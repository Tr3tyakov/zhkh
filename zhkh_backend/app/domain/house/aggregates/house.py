from dataclasses import dataclass
from datetime import (
    datetime,
)
from typing import (
    Optional,
    Set,
)

from app.domain.common.interfaces.aggregates import IAggregate
from app.domain.house.schemas.house_create_schema import HouseCreateSchema
from app.domain.house.schemas.house_setup_schema import HouseSetupSchema
from app.domain.house.schemas.house_update_schema import HouseUpdateSchema


@dataclass
class HouseAggregate(IAggregate):
    # --- Адрес ---
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
    energy_efficiency_class: Optional[str] = None
    energy_survey_date: Optional[datetime] = None

    # --- Этажность ---
    entrances_count: Optional[int] = None
    max_floors_count: Optional[int] = None
    min_floors_count: Optional[int] = None
    underground_floors_count: Optional[int] = None

    # --- Ремонт и доступность ---
    capital_repair_fund: Optional[str] = None
    parking_area: Optional[float] = None
    has_accessibility: Optional[int] = None

    # --- Технические характеристики ---
    house_type: Optional[str] = None
    building_wear_percent: Optional[float] = None
    building_wear_date: Optional[datetime] = None

    # --- Площади ---
    total_area: Optional[float] = None
    residential_area: Optional[float] = None
    non_residential_area: Optional[float] = None
    common_property_area: Optional[float] = None
    land_area: Optional[float] = None

    # --- Статус здания ---
    building_series: Optional[str] = None
    is_cultural_heritage: Optional[int] = None

    # --- Инженерные системы ---
    ventilation: Optional[str] = None
    sewerage: Optional[str] = None
    drainage_system: Optional[str] = None
    gas_supply: Optional[str] = None
    hot_water_supply: Optional[str] = None
    fire_suppression: Optional[str] = None
    heating: Optional[str] = None
    cold_water_supply: Optional[str] = None
    electricity_supply: Optional[str] = None
    number_of_inputs: Optional[int] = None
    supply_systems_major_repair_year: Optional[int] = None
    supply_systems_number: Optional[int] = None

    # --- Конструктивные элементы ---
    garbage_chute: Optional[bool] = None
    garbage_chute_type: Optional[int] = None
    load_bearing_walls: Optional[int] = None
    basement_area: Optional[float] = None
    foundation_type: Optional[str] = None
    foundation_material: Optional[str] = None
    blind_area: Optional[float] = None
    overlap_type: Optional[str] = None

    # --- Система горячего водоснабжения ---
    hot_water_system_type: Optional[str] = None
    hot_water_physical_wear: Optional[float] = None
    hot_water_network_material: Optional[str] = None
    hot_water_insulation_material: Optional[str] = None
    hot_water_riser_material: Optional[str] = None

    # --- Система водоотведения ---
    sewerage_system_type: Optional[int] = None
    sewerage_network_material: Optional[int] = None

    # --- Система газоснабжения ---
    gas_system_type: Optional[str] = None

    # --- Внутренние стены ---
    internal_walls_type: Optional[int] = None

    # --- Фасад ---
    facade_wall_type: Optional[int] = None
    facade_insulation_type: Optional[str] = None
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

    company_id: Optional[int] = None
    id: Optional[int] = None
    user_id: Optional[int] = None

    @classmethod
    def create_house(cls, data: HouseCreateSchema) -> "HouseAggregate":
        return cls(**data.model_dump())

    @classmethod
    def setup_house(cls, data: HouseSetupSchema) -> "HouseAggregate":
        return cls(**data.model_dump())

    def update_house(self, data: HouseUpdateSchema) -> None:
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(self, field, value)

    def dump(self, exclude: Optional[Set[str]] = None) -> dict:
        result = {}
        for field in self.__dataclass_fields__:
            if exclude and field in exclude:
                continue
            result[field] = getattr(self, field)
        return result
