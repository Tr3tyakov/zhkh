import asyncio
import json
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import (
    DB_URL,
    settings,
)
from app.infrastructure.common.enums.user import UserTypeEnum
from app.infrastructure.orm.models import (
    Company,
    House,
    ReferenceBook,
    ReferenceBookValue,
    User,
)
from app.infrastructure.postgres import Database


def parse_int(value):
    if not value:
        return None
    try:
        return int(re.sub(r"[^\d]", "", str(value)))
    except Exception:
        return None


def parse_float(value):
    if not value:
        return None
    try:
        return float(re.sub(r"[^\d.,]", "", str(value)).replace(",", "."))
    except Exception:
        return None


def parse_bool(value):
    if not value:
        return False
    v = str(value).lower()
    return v in ("Да", "да", "true", "1")


def parse_date_ddmmyyyy(value):
    if not value:
        return None
    try:
        return datetime.strptime(value, "%d.%m.%Y").date()
    except Exception:
        return None


async def seed_house(session: AsyncSession):
    async with session.begin():
        existing_house = await session.execute(select(House.id).limit(1))
        if existing_house.scalars().first() is not None:
            print("Дома уже есть в базе, сид пропущен")
            return

        user_id = (
            (
                await session.execute(
                    select(User.id).where(User.user_type == UserTypeEnum.ADMIN)
                )
            )
            .scalars()
            .first()
        )
        company_id = (
            (
                await session.execute(
                    select(Company.id).where(Company.name == "УК «Жилищный сервис»")
                )
            )
            .scalars()
            .first()
        )

        ref_books = await session.execute(select(ReferenceBook))
        ref_books = ref_books.scalars().all()
        ref_book_values = await session.execute(select(ReferenceBookValue))
        ref_book_values = ref_book_values.scalars().all()

        reference_map = defaultdict(dict)
        book_id_to_name = {book.id: book.name for book in ref_books}
        for value in ref_book_values:
            book_name = book_id_to_name[value.reference_book_id]
            reference_map[book_name][value.value.strip()] = value.id

        def get_ref_id(book: str, value: str | None) -> int | None:
            if not value:
                return None
            return reference_map[book].get(value.strip())

        json_path = Path(__file__).parent.parent / "house_data.json"

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            created_instances = []

            for house_data in data:
                passport = house_data.get("passport", {})
                sections = house_data.get("sections", {})
                main = sections.get("Основные сведения", {})
                engineering = sections.get("Инженерные системы", {})
                construction = sections.get("Конструктивные элементы", {})
                detailed = sections.get(
                    "Подробные сведения о конструктиве и инженерных сетях", {}
                )

                house = House(
                    region=house_data.get("region") or "Мурманская область",
                    city="Заполярный",
                    street=(
                        passport.get("Адрес", "")
                        .split(",")[0]
                        .removeprefix("ул.")
                        .removeprefix(".")
                        .strip()
                        if "Адрес" in passport
                        else None
                    ),
                    house_number=(
                        passport.get("Адрес", "")
                        .split(",")[1]
                        .removeprefix("д.")
                        .strip()
                        if "Адрес" in passport and "," in passport["Адрес"]
                        else None
                    ),
                    commissioning_year=parse_int(
                        main.get("Год ввода в эксплуатацию")
                        or passport.get("Год постройки")
                    ),
                    is_emergency=parse_bool(
                        main.get("Дом признан аварийным")
                        or passport.get("Дом признан аварийным")
                    ),
                    condition=main.get("Состояние дома"),
                    apartments_count=parse_int(
                        main.get("Количество квартир")
                        or passport.get("Жилых помещений")
                    ),
                    non_residential_units_count=parse_int(
                        main.get("Количество нежилых помещений")
                    ),
                    energy_efficiency_class=get_ref_id(
                        "Класс энергетической эффективности",
                        main.get("Класс энергетической эффективности"),
                    ),
                    energy_survey_date=parse_date_ddmmyyyy(
                        main.get("Дата проведения энергетического обследования")
                    ),
                    entrances_count=parse_int(main.get("Количество подъездов")),
                    max_floors_count=parse_int(
                        main.get("Наибольшее количество этажей")
                        or main.get("Количество этажей")
                    ),
                    min_floors_count=parse_int(
                        main.get("Наименьшее количество этажей")
                        or main.get("Количество этажей")
                    ),
                    underground_floors_count=parse_int(main.get("Подземных этажей")),
                    capital_repair_fund=get_ref_id(
                        "Формирование фонда кап. ремонта",
                        main.get("Формирование фонда кап. ремонта"),
                    ),
                    parking_area=parse_float(main.get("Площадь парковки м 2")),
                    has_accessibility=get_ref_id(
                        "Наличие в подъездах приспособлений для нужд маломобильных групп населения",
                        main.get(
                            "Наличие в подъездах приспособлений для нужд маломобильных групп населения"
                        ),
                    ),
                    house_type=get_ref_id("Тип дома", main.get("Тип дома")),
                    building_wear_percent=parse_float(main.get("Износ здания, %")),
                    building_wear_date=parse_date_ddmmyyyy(
                        main.get("Дата, на которую установлен износ здания")
                    ),
                    total_area=parse_float(
                        main.get("Площадь многоквартирного дома, кв.м")
                    ),
                    residential_area=parse_float(
                        main.get("Площадь жилых помещений м 2")
                    ),
                    non_residential_area=parse_float(
                        main.get("Площадь нежилых помещений м 2")
                    ),
                    common_property_area=parse_float(
                        main.get("Площадь помещений общего имущества м 2")
                    ),
                    land_area=parse_float(
                        main.get("Площадь зем. участка общего имущества м 2")
                    ),
                    building_series=get_ref_id(
                        "Серия, тип постройки", main.get("Серия, тип постройки здания")
                    ),
                    is_cultural_heritage=get_ref_id(
                        "Статус объекта культурного наследия",
                        main.get("Статус объекта культурного наследия"),
                    ),
                    ventilation=get_ref_id("Вентиляция", engineering.get("Вентиляция")),
                    sewerage=get_ref_id(
                        "Водоотведение", engineering.get("Водоотведение")
                    ),
                    drainage_system=get_ref_id(
                        "Система водостоков", engineering.get("Система водостоков")
                    ),
                    gas_supply=get_ref_id(
                        "Газоснабжение", engineering.get("Газоснабжение")
                    ),
                    hot_water_supply=get_ref_id(
                        "Горячее водоснабжение",
                        engineering.get("Горячее водоснабжение"),
                    ),
                    fire_suppression=get_ref_id(
                        "Система пожаротушения",
                        engineering.get("Система пожаротушения"),
                    ),
                    heating=get_ref_id(
                        "Теплоснабжение", engineering.get("Теплоснабжение")
                    ),
                    cold_water_supply=get_ref_id(
                        "Холодное водоснабжение",
                        engineering.get("Холодное водоснабжение"),
                    ),
                    electricity_supply=get_ref_id(
                        "Электроснабжение", engineering.get("Электроснабжение")
                    ),
                    number_of_inputs=parse_int(
                        engineering.get("Количество вводов в дом, ед.")
                    ),
                    garbage_chute=parse_bool(construction.get("Мусоропровод")),
                    garbage_chute_type=get_ref_id(
                        "Тип мусоропровода", passport.get("Тип мусоропровода")
                    ),
                    load_bearing_walls=get_ref_id(
                        "Материал несущих стен", construction.get("Несущие стены")
                    ),
                    basement_area=parse_float(
                        construction.get("Площадь подвала, кв.м")
                    ),
                    foundation_type=get_ref_id(
                        "Тип фундамента", construction.get("Фундамент")
                    ),
                    foundation_material=get_ref_id(
                        "Материал фундамента",
                        detailed.get("Фундамент", {}).get("Материал фундамента"),
                    ),
                    blind_area=parse_float(
                        detailed.get("Фундамент", {}).get("Площадь отмостки")
                    ),
                    overlap_type=get_ref_id(
                        "Тип перекрытий", construction.get("Перекрытия")
                    ),
                    note=None,
                    created_at=datetime.now(),
                    updated_at=datetime.now(),
                    company_id=company_id,
                    user_id=user_id,
                )
                created_instances.append(house)

            session.add_all(created_instances)
            await session.commit()


async def main():
    database = Database(settings.POSTGRES, DB_URL)
    database.connect()
    try:
        async with database.async_context() as session:
            await seed_house(session)
    finally:
        await database.close()


if __name__ == "__main__":
    asyncio.run(main())
