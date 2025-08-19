from datetime import (
    datetime,
)
from typing import Optional

from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel


class HouseBaseSchema(BaseSchema):
    # --- Адрес (иерархия) ---
    region: Optional[str] = None
    city: Optional[str] = None
    street: Optional[str] = None
    house_number: Optional[str] = None
    building: Optional[str] = None
    cadastral_number: Optional[str] = None
    classifier_code: Optional[str] = None

    # --- Основные сведения ---
    commissioning_year: Optional[int] = None
    is_emergency: Optional[bool] = None
    condition: Optional[str] = None
    apartments_count: Optional[int] = None
    non_residential_units_count: Optional[int] = None

    # --- Энергоэффективность ---
    energy_efficiency_class: Optional[int] = None
    energy_survey_date: Optional[datetime] = None

    # --- Этажность ---
    entrances_count: Optional[int] = None
    max_floors_count: Optional[int] = None
    min_floors_count: Optional[int] = None
    underground_floors_count: Optional[int] = None

    # --- Ремонт и доступность ---
    capital_repair_fund: Optional[int] = None
    parking_area: Optional[float] = None
    has_accessibility: Optional[int] = None

    # --- Технические характеристики ---
    house_type: Optional[int] = None
    building_wear_percent: Optional[float] = None
    building_wear_date: Optional[datetime] = None

    # --- Площади ---
    total_area: Optional[float] = None
    residential_area: Optional[float] = None
    non_residential_area: Optional[float] = None
    common_property_area: Optional[float] = None
    land_area: Optional[float] = None

    # --- Статус здания ---
    building_series: Optional[int] = None
    is_cultural_heritage: Optional[int] = None

    # --- Инженерные системы многоквартирного дома ---
    ventilation: Optional[int] = None
    sewerage: Optional[int] = None
    drainage_system: Optional[int] = None
    gas_supply: Optional[int] = None
    hot_water_supply: Optional[int] = None
    hot_water_system_type: Optional[int] = None
    fire_suppression: Optional[int] = None
    heating: Optional[int] = None
    cold_water_supply: Optional[int] = None
    electricity_supply: Optional[int] = None
    number_of_inputs: Optional[int] = None

    # --- Конструктивные элементы многоквартирного дома ---
    garbage_chute: Optional[bool] = None
    garbage_chute_type: Optional[int] = None
    load_bearing_walls: Optional[int] = None
    basement_area: Optional[float] = None
    foundation_type: Optional[int] = None
    foundation_material: Optional[int] = None
    blind_area: Optional[float] = None
    overlap_type: Optional[int] = None

    # --- Система горячего водоснабжения ---
    hot_water_physical_wear: Optional[float] = None
    hot_water_network_material: Optional[int] = None
    hot_water_insulation_material: Optional[int] = None
    hot_water_riser_material: Optional[int] = None

    # --- Система водоотведения ---
    sewerage_system_type: Optional[int] = None
    sewerage_network_material: Optional[int] = None

    # --- Система газоснабжения ---
    gas_system_type: Optional[int] = None

    # --- Внутренние стены ---
    internal_walls_type: Optional[int] = None

    # --- Фасад ---
    facade_wall_type: Optional[int] = None
    facade_insulation_type: Optional[int] = None
    facade_finishing_material: Optional[int] = None
    facade_last_major_repair_year: Optional[int] = None

    # --- Крыша ---
    roof_shape: Optional[int] = None
    attic_insulation_layers: Optional[int] = None
    roof_support_structure_type: Optional[int] = None
    roof_covering_type: Optional[int] = None
    roof_last_major_repair_year: Optional[int] = None

    # --- Окна ---
    window_material: Optional[int] = None

    # --- Система отопления ---
    heating_physical_wear: Optional[float] = None
    heating_network_material: Optional[int] = None
    heating_insulation_material: Optional[int] = None

    # --- Стояки системы отопления ---
    heating_riser_layout_type: Optional[int] = None
    heating_riser_material: Optional[int] = None
    heating_riser_valve_wear: Optional[float] = None

    # --- Отопительные приборы ---
    heating_device_type: Optional[int] = None
    heating_device_wear: Optional[float] = None

    # --- Система холодного водоснабжения ---
    cold_water_physical_wear: Optional[float] = None
    cold_water_network_material: Optional[int] = None

    # --- Стояки системы холодного водоснабжения ---
    cold_water_riser_wear: Optional[float] = None
    cold_water_riser_material: Optional[int] = None

    # --- Запорная арматура системы холодного водоснабжения ---
    cold_water_valve_wear: Optional[float] = None

    # --- Стояки системы горячего водоснабжения ---
    hot_water_riser_wear: Optional[float] = None

    # --- Запорная арматура системы горячего водоснабжения ---
    hot_water_valve_wear: Optional[float] = None
    water_system_valve_wear: Optional[float] = None

    # --- Примечание администратора ---
    note: Optional[str] = None

    class Config:
        json_encoders = {datetime: lambda v: v.strftime("%d.%m.%Y")}


class HouseResponseSchema(HouseBaseSchema):
    id: int
    user_id: int
    company_id: Optional[int] = None

    class Config:
        alias_generator = to_camel
        validate_by_name = True
