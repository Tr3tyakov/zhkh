import asyncio
import json
import re
from datetime import datetime
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import (
    DB_URL,
    settings,
)
from app.infrastructure.common.enums.user import UserTypeEnum
from app.infrastructure.orm.models import (
    Company,
    House,
    ReferenceBook,
    User,
)
from app.infrastructure.postgres import Database


async def load_ref_values(session: AsyncSession):
    """Загрузить справочники в удобный словарь"""
    ref_books = await session.execute(
        select(ReferenceBook).options(selectinload(ReferenceBook.reference_book_values))
    )
    ref_books = ref_books.scalars().all()

    ref_values = {}
    for rb in ref_books:
        values = {}
        for v in rb.reference_book_values:
            values[v.value.strip().lower()] = v.id
        ref_values[rb.name.strip().lower()] = values
    return ref_values


def parse_float(val):
    if not val:
        return None
    val = str(val).replace(",", ".").replace(" ", "")
    m = re.match(r"(\d+(\.\d+)?)", val)
    return float(m.group(1)) if m else None


def parse_int(val):
    if not val:
        return None
    m = re.match(r"(\d+)", str(val).replace(" ", ""))
    return int(m.group(1)) if m else None


def parse_percent(val):
    if not val:
        return None
    return parse_float(val.replace("%", "").strip())


def parse_date(val):
    if not val:
        return None
    for fmt in ("%d.%m.%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(val.strip(), fmt).date()
        except Exception:
            continue
    return None


def parse_bool(val):
    if not val:
        return None
    return str(val).strip().lower() in ("да", "true", "yes")


def get_ref_id(ref_values, book_name: str, value: str):
    if not value:
        return None
    return ref_values.get(book_name.strip().lower(), {}).get(value.strip().lower())


async def import_houses(session: AsyncSession, filepath: str):
    existing_houses = await session.execute(select(House.id).limit(1))
    if existing_houses.scalars().first() is not None:
        print("Дома уже есть в базе, сид пропущен")
        return

    ref_values = await load_ref_values(session)

    with open(filepath, "r", encoding="utf-8") as f:
        houses = json.load(f)
    user_id = (
        (
            await session.execute(
                select(User.id).where(User.user_type == UserTypeEnum.ADMIN)
            )
        )
        .scalars()
        .first()
    )
    company = (
        (await session.execute(select(Company).where(Company.inn == "123456789012")))
        .scalars()
        .first()
    )
    created = []
    for h in houses:
        p = h.get("passport", {})
        s = h.get("sections", {})

        # --- Адрес ---
        address_parts = p.get("Адрес", "").split(",")
        region = "Мурманская область"
        city = "Заполярный"
        street = address_parts[0].replace("ул.", "").strip() if address_parts else None
        house_number = address_parts[1].strip() if len(address_parts) > 1 else None

        main = s.get("Основные сведения", {})
        eng = s.get("Инженерные системы", {})
        constr = s.get("Конструктивные элементы", {})
        detail = s.get("Подробные сведения о конструктиве и инженерных сетях", {})

        house = House(
            # Адрес
            region=region,
            city=city,
            street=street,
            house_number=house_number,
            # Основные сведения
            commissioning_year=parse_int(main.get("Год ввода в эксплуатацию")),
            is_emergency=parse_bool(main.get("Дом признан аварийным")),
            condition=main.get("Состояние дома"),
            apartments_count=parse_int(main.get("Количество квартир")),
            non_residential_units_count=parse_int(
                main.get("Количество нежилых помещений")
            ),
            cadastral_number=p.get("Кадастровый номер"),
            classifier_code=p.get("Код ОКТМО"),
            user_id=user_id,
            company_id=company.id,
            # Энергоэффективность
            energy_efficiency_class=get_ref_id(
                ref_values,
                "Класс энергетической эффективности",
                main.get("Класс энергетической эффективности"),
            ),
            energy_survey_date=parse_date(
                main.get("Дата проведения энергетического обследования")
            ),
            # Этажность
            entrances_count=parse_int(main.get("Количество подъездов")),
            max_floors_count=parse_int(main.get("Наибольшее количество этажей")),
            min_floors_count=parse_int(main.get("Наименьшее количество этажей")),
            underground_floors_count=parse_int(main.get("Подземных этажей")),
            # Ремонт и доступность
            capital_repair_fund=get_ref_id(
                ref_values,
                "Формирование фонда кап. ремонта",
                main.get("Формирование фонда кап. ремонта"),
            ),
            parking_area=parse_float(main.get("Площадь парковки м 2")),
            has_accessibility=get_ref_id(
                ref_values,
                "Наличие в подъездах приспособлений для нужд маломобильных групп населения",
                main.get(
                    "Наличие в подъездах приспособлений для нужд маломобильных групп населения"
                ),
            ),
            # Тех. характеристики
            house_type=get_ref_id(ref_values, "Тип дома", p.get("Тип дома")),
            building_wear_percent=parse_float(main.get("Износ здания, %")),
            building_wear_date=parse_date(
                main.get("Дата, на которую установлен износ здания")
            ),
            # Площади
            total_area=parse_float(main.get("Площадь многоквартирного дома, кв.м")),
            residential_area=parse_float(main.get("Площадь жилых помещений м 2")),
            non_residential_area=parse_float(main.get("Площадь нежилых помещений м 2")),
            common_property_area=parse_float(
                main.get("Площадь помещений общего имущества м 2")
            ),
            land_area=parse_float(
                main.get("Площадь зем. участка общего имущества м 2")
            ),
            # Статус здания
            building_series=get_ref_id(
                ref_values, "Серия, тип постройки", p.get("Серия, тип постройки")
            ),
            is_cultural_heritage=get_ref_id(
                ref_values,
                "Статус объекта культурного наследия",
                main.get("Статус объекта культурного наследия"),
            ),
            # Инженерные системы
            ventilation=get_ref_id(ref_values, "Вентиляция", eng.get("Вентиляция")),
            sewerage=get_ref_id(ref_values, "Водоотведение", eng.get("Водоотведение")),
            drainage_system=get_ref_id(
                ref_values, "Система водостоков", eng.get("Система водостоков")
            ),
            gas_supply=get_ref_id(
                ref_values, "Газоснабжение", eng.get("Газоснабжение")
            ),
            hot_water_supply=get_ref_id(
                ref_values, "Горячее водоснабжение", eng.get("Горячее водоснабжение")
            ),
            fire_suppression=get_ref_id(
                ref_values, "Система пожаротушения", eng.get("Система пожаротушения")
            ),
            heating=get_ref_id(ref_values, "Теплоснабжение", eng.get("Теплоснабжение")),
            cold_water_supply=get_ref_id(
                ref_values, "Холодное водоснабжение", eng.get("Холодное водоснабжение")
            ),
            electricity_supply=get_ref_id(
                ref_values, "Электроснабжение", eng.get("Электроснабжение")
            ),
            number_of_inputs=parse_int(eng.get("Количество вводов в дом, ед.")),
            # Конструктивные элементы
            garbage_chute_type=get_ref_id(
                ref_values, "Тип мусоропровода", p.get("Тип мусоропровода")
            ),
            garbage_chute=parse_bool(constr.get("Мусоропровод")),
            load_bearing_walls=get_ref_id(
                ref_values, "Несущие стены", p.get("Материал несущих стен")
            ),
            basement_area=parse_float(constr.get("Площадь подвала, кв.м")),
            foundation_type=get_ref_id(
                ref_values, "Тип фундамента", constr.get("Фундамент")
            ),
            foundation_material=get_ref_id(
                ref_values,
                "Материал фундамента",
                detail.get("Фундамент", {}).get("Материал фундамента"),
            ),
            blind_area=parse_float(detail.get("Фундамент", {}).get("Площадь отмостки")),
            overlap_type=get_ref_id(
                ref_values, "Тип перекрытий", p.get("Тип перекрытий")
            ),
            # Система ГВС
            hot_water_system_type=get_ref_id(
                ref_values,
                "Тип системы горячего водоснабжения",
                detail.get("Cистема горячего водоснабжения", {}).get(
                    "Тип системы горячего водоснабжения"
                ),
            ),
            hot_water_physical_wear=parse_percent(
                detail.get("Cистема горячего водоснабжения", {}).get("Физический износ")
            ),
            hot_water_network_material=get_ref_id(
                ref_values,
                "Материал сети",
                detail.get("Cистема горячего водоснабжения", {}).get("Материал сети"),
            ),
            hot_water_insulation_material=get_ref_id(
                ref_values,
                "Материал теплоизоляции сети",
                detail.get("Cистема горячего водоснабжения", {}).get(
                    "Материал теплоизоляции сети"
                ),
            ),
            hot_water_riser_material=get_ref_id(
                ref_values,
                "Материал стояков",
                detail.get("Cистема горячего водоснабжения", {}).get(
                    "Материал стояков"
                ),
            ),
            # Система водоотведения
            sewerage_system_type=get_ref_id(
                ref_values,
                "Тип системы водоотведения",
                detail.get("Система водоотведения", {}).get(
                    "Тип системы водоотведения"
                ),
            ),
            sewerage_network_material=get_ref_id(
                ref_values,
                "Материал сети",
                detail.get("Система водоотведения", {}).get("Материал сети"),
            ),
            # Система газоснабжения
            gas_system_type=get_ref_id(
                ref_values,
                "Тип системы газоснабжения",
                detail.get("Система газоснабжения", {}).get(
                    "Тип системы газоснабжения"
                ),
            ),
            # Внутренние стены
            internal_walls_type=get_ref_id(
                ref_values,
                "Тип внутренних стен",
                detail.get("Внутренние стены", {}).get("Тип внутренних стен"),
            ),
            # Фасад
            facade_wall_type=get_ref_id(
                ref_values,
                "Тип наружных стен",
                detail.get("Фасад", {}).get("Тип наружных стен"),
            ),
            facade_insulation_type=get_ref_id(
                ref_values,
                "Тип наружного утепления фасада",
                detail.get("Фасад", {}).get("Тип наружного утепления фасада"),
            ),
            facade_finishing_material=get_ref_id(
                ref_values,
                "Материал отделки фасада",
                detail.get("Фасад", {}).get("Материал отделки фасада"),
            ),
            facade_last_major_repair_year=parse_int(
                detail.get("Фасад", {}).get(
                    "Год проведения последнего капитального ремонта"
                )
            ),
            # Крыша
            roof_shape=get_ref_id(
                ref_values, "Форма крыши", detail.get("Крыша", {}).get("Форма крыши")
            ),
            attic_insulation_layers=get_ref_id(
                ref_values,
                "Утепляющие слои чердачных перекрытий",
                detail.get("Крыша", {}).get("Утепляющие слои чердачных перекрытий"),
            ),
            roof_support_structure_type=get_ref_id(
                ref_values,
                "Вид несущей части",
                detail.get("Крыша", {}).get("Вид несущей части"),
            ),
            roof_covering_type=get_ref_id(
                ref_values, "Тип кровли", detail.get("Крыша", {}).get("Тип кровли")
            ),
            roof_last_major_repair_year=parse_int(
                detail.get("Крыша", {}).get(
                    "Год проведения последнего капитального ремонта кровли"
                )
            ),
            # Окна
            window_material=get_ref_id(
                ref_values, "Материал окон", detail.get("Окна", {}).get("Материал окон")
            ),
            # Отопление
            heating_physical_wear=parse_percent(
                detail.get("Система отопления", {}).get("Физический износ")
            ),
            heating_network_material=get_ref_id(
                ref_values,
                "Материал сети",
                detail.get("Система отопления", {}).get("Материал сети"),
            ),
            heating_insulation_material=get_ref_id(
                ref_values,
                "Материал теплоизоляции сети",
                detail.get("Система отопления", {}).get("Материал теплоизоляции сети"),
            ),
            heating_riser_layout_type=get_ref_id(
                ref_values,
                "Тип поквартирной разводки внутридомовой системы отопления",
                detail.get("Стояки системы отопления", {}).get(
                    "Тип поквартирной разводки внутридомовой системы отопления"
                ),
            ),
            heating_riser_material=get_ref_id(
                ref_values,
                "Материал",
                detail.get("Стояки системы отопления", {}).get("Материал"),
            ),
            heating_riser_valve_wear=parse_percent(
                detail.get("Запорная арматура системы отопления", {}).get(
                    "Физический износ"
                )
            ),
            heating_device_type=get_ref_id(
                ref_values,
                "Тип отопительных приборов",
                detail.get("Отопительные приборы", {}).get("Тип отопительных приборов"),
            ),
            heating_device_wear=parse_percent(
                detail.get("Отопительные приборы", {}).get("Физический износ")
            ),
            # Система ХВС
            cold_water_physical_wear=parse_percent(
                detail.get("Система холодного водоснабжения", {}).get(
                    "Физический износ"
                )
            ),
            cold_water_network_material=get_ref_id(
                ref_values,
                "Материал сети",
                detail.get("Система холодного водоснабжения", {}).get("Материал сети"),
            ),
            cold_water_riser_wear=parse_percent(
                detail.get("Стояки системы холодного водоснабжения", {}).get(
                    "Физический износ"
                )
            ),
            cold_water_riser_material=get_ref_id(
                ref_values,
                "Материал сети",
                detail.get("Стояки системы холодного водоснабжения", {}).get(
                    "Материал сети"
                ),
            ),
            cold_water_valve_wear=parse_percent(
                detail.get("Запорная арматура системы холодного водоснабжения", {}).get(
                    "Физический износ"
                )
            ),
            # Система ГВС стояки/арматура
            hot_water_riser_wear=parse_percent(
                detail.get("Стояки системы горячего водоснабжения", {}).get(
                    "Физический износ"
                )
            ),
            hot_water_valve_wear=parse_percent(
                detail.get("Запорная арматура системы горячего водоснабжения", {}).get(
                    "Физический износ"
                )
            ),
            # Запорная арматура системы отопления
            water_system_valve_wear=parse_percent(
                detail.get("Запорная арматура системы отопления", {}).get(
                    "Физический износ"
                )
            ),
        )

        created.append(house)

    session.add_all(created)
    await session.commit()
    print(f"Импортировано {len(created)} домов")


async def main():
    db = Database(settings.POSTGRES, DB_URL)
    db.connect()
    try:
        json_path = Path(__file__).parent.parent / "house_data.json"

        async with db.async_context() as session:
            await import_houses(session, json_path)
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(main())
