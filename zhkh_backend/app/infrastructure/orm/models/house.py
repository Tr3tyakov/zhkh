from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)

from app.infrastructure.orm.models.base import BaseModel


class House(BaseModel):
    """Модель дома/недвижимости"""

    # --- Адрес (иерархия) ---
    region = Column(String, comment="Регион", index=True)
    city = Column(String, comment="Населённый пункт")
    street = Column(String, comment="Улица")
    house_number = Column(String, comment="Номер дома")
    building = Column(String, comment="Корпус")

    # --- Основные сведения ---
    commissioning_year = Column(Integer, comment="Год ввода в эксплуатацию")
    is_emergency = Column(Boolean, comment="Признан ли дом аварийным")
    condition = Column(String, comment="Состояние дома")
    apartments_count = Column(Integer, comment="Количество квартир")
    non_residential_units_count = Column(
        Integer, comment="Количество нежилых помещений"
    )
    cadastral_number = Column(
        String, comment="Кадастровый номер"
    )
    classifier_code = Column(
        String, comment="Код ОКТМО"
    )

    # --- Энергоэффективность ---
    energy_efficiency_class = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Класс энергетической эффективности",
    )
    energy_survey_date = Column(
        Date, comment="Дата проведения энергетического обследования"
    )

    # --- Этажность ---
    entrances_count = Column(Integer, comment="Количество подъездов")
    max_floors_count = Column(Integer, comment="Наибольшее количество этажей")
    min_floors_count = Column(Integer, comment="Наименьшее количество этажей")
    underground_floors_count = Column(Integer, comment="Количество подземных этажей")

    # --- Ремонт и доступность ---
    capital_repair_fund = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Формирование фонда капитального ремонта",
    )
    parking_area = Column(Float, comment="Площадь парковки, м²")
    has_accessibility = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Наличие приспособлений для маломобильных групп населения",
    )

    # --- Технические характеристики ---
    house_type = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Тип дома"
    )
    building_wear_percent = Column(Float, comment="Износ здания, %")
    building_wear_date = Column(DateTime, comment="Дата установления износа")

    # --- Площади ---
    total_area = Column(Float, comment="Площадь многоквартирного дома, м²")
    residential_area = Column(Float, comment="Площадь жилых помещений, м²")
    non_residential_area = Column(Float, comment="Площадь нежилых помещений, м²")
    common_property_area = Column(Float, comment="Площадь общего имущества, м²")
    land_area = Column(Float, comment="Площадь земельного участка, м²")

    # --- Статус здания ---
    building_series = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Серия/тип постройки здания",
    )
    is_cultural_heritage = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Является ли объектом культурного наследия",
    )

    # --- Инженерные системы многоквартирного дома ---
    ventilation = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Тип вентиляции"
    )
    sewerage = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Система водоотведения"
    )
    drainage_system = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Система водостоков"
    )
    gas_supply = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Система газоснабжения"
    )
    hot_water_supply = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Система горячего водоснабжения",
    )
    fire_suppression = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Система пожаротушения"
    )
    heating = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Система теплоснабжения"
    )
    cold_water_supply = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Система холодного водоснабжения",
    )
    electricity_supply = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Система электроснабжения",
    )
    number_of_inputs = Column(Integer, comment="Количество вводов в дом, ед")
    supply_systems_number = Column(Integer, comment="Количество вводов системы электроснабжения, ед")
    supply_systems_major_repair_year = Column(Integer, comment="Год проведения последнего капитального ремонта")

    # --- Конструктивные элементы многоквартирного дома ---
    garbage_chute_type = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Тип мусоропровода"
    )
    garbage_chute = Column(Boolean, comment="Наличие мусоропровода")
    load_bearing_walls = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Материал несущих стен"
    )
    basement_area = Column(Float, comment="Площадь подвала, м²")
    foundation_type = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Тип фундамента"
    )
    foundation_material = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Материал фундамента"
    )
    blind_area = Column(Float, comment="Площадь отмостки, м²")
    overlap_type = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Тип перекрытий"
    )

    # --- Система горячего водоснабжения ---
    hot_water_system_type = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Тип системы ГВС"
    )
    hot_water_physical_wear = Column(Float, comment="Физический износ системы ГВС")
    hot_water_network_material = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Материал сети ГВС"
    )
    hot_water_insulation_material = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Материал теплоизоляции сети ГВС",
    )
    hot_water_riser_material = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Материал стояков ГВС"
    )

    # --- Система водоотведения ---
    sewerage_system_type = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Тип системы водоотведения",
    )
    sewerage_network_material = Column(Integer, ForeignKey("reference_book_value.id"),
                                       comment="Материал сети водоотведения")

    # --- Система газоснабжения ---
    gas_system_type = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Тип системы газоснабжения",
    )

    # --- Внутренние стены ---
    internal_walls_type = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Тип внутренних стен"
    )

    # --- Фасад ---
    facade_wall_type = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Тип наружных стен"
    )
    facade_insulation_type = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Тип наружного утепления фасада",
    )
    facade_finishing_material = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Материал отделки фасада",
    )
    facade_last_major_repair_year = Column(
        Integer, comment="Год последнего капремонта фасада"
    )

    # --- Крыша ---
    roof_shape = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Форма крыши"
    )
    attic_insulation_layers = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Утепляющие слои чердачных перекрытий",
    )
    roof_support_structure_type = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Вид несущей части крыши",
    )
    roof_covering_type = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Тип кровли"
    )
    roof_last_major_repair_year = Column(
        Integer, comment="Год последнего капремонта кровли"
    )

    # --- Окна ---
    window_material = Column(
        Integer, ForeignKey("reference_book_value.id"), comment="Материал окон"
    )

    # --- Система отопления ---
    heating_physical_wear = Column(Float, comment="Физический износ системы отопления")
    heating_network_material = Column(Integer,
                                      ForeignKey("reference_book_value.id"), comment="Материал сети отопления")
    heating_insulation_material = Column(
        Integer,
        ForeignKey("reference_book_value.id"), comment="Материал теплоизоляции сети отопления"
    )

    # --- Стояки системы отопления ---
    heating_riser_layout_type = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Тип разводки стояков отопления",
    )
    heating_riser_material = Column(Integer,
                                    ForeignKey("reference_book_value.id"), comment="Материал стояков отопления")
    heating_riser_valve_wear = Column(
        Float, comment="Физический износ запорной арматуры отопления"
    )

    # --- Отопительные приборы ---
    heating_device_type = Column(
        Integer,
        ForeignKey("reference_book_value.id"),
        comment="Тип отопительных приборов",
    )
    heating_device_wear = Column(
        Float, comment="Физический износ отопительных приборов"
    )

    # --- Система холодного водоснабжения ---
    cold_water_physical_wear = Column(Float, comment="Физический износ системы ХВС")
    cold_water_network_material = Column(Integer,
                                         ForeignKey("reference_book_value.id"), comment="Материал сети ХВС")

    # --- Стояки системы холодного водоснабжения ---
    cold_water_riser_wear = Column(Float, comment="Физический износ стояков ХВС")
    cold_water_riser_material = Column(Integer,
                                       ForeignKey("reference_book_value.id"), comment="Материал стояков ХВС")

    # --- Запорная арматура системы холодного водоснабжения ---
    cold_water_valve_wear = Column(
        Float, comment="Физический износ запорной арматуры ХВС"
    )

    # --- Стояки системы горячего водоснабжения ---
    hot_water_riser_wear = Column(Float, comment="Физический износ стояков ГВС")

    # --- Запорная арматура системы горячего водоснабжения ---
    hot_water_valve_wear = Column(
        Float, comment="Физический износ запорной арматуры ГВС"
    )
    # --- Запорная арматура системы отопления ---
    water_system_valve_wear = Column(
        Float, comment="Физический износ запорной арматуры системы отопления"
    )

    # --- Примечание администратора ---
    note = Column(Text, comment="Дополнительное примечание")

    # --- Метаданные ---
    created_at = Column(
        DateTime, nullable=False, default=datetime.now, comment="Дата создания"
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.now,
        onupdate=datetime.now,
        comment="Дата обновления",
    )

    company_id = Column(
        Integer, ForeignKey("company.id", ondelete="SET NULL"), nullable=True
    )
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
