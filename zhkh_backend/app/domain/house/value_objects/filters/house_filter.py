from typing import Optional

from app.domain.common.schemas.base import PaginationSchema
from app.domain.common.value_objects.base import BaseValueObjectSchema
from app.infrastructure.persistence.common.types import (
    BooleanField,
    DatetimeField,
    FloatField,
    IntegerField,
    StringField,
)


class HouseFilter(BaseValueObjectSchema, PaginationSchema):
    id: Optional[IntegerField] = None
    company_id: Optional[IntegerField] = None

    region: Optional[StringField] = None
    city: Optional[StringField] = None
    street: Optional[StringField] = None
    house_number: Optional[StringField] = None
    building: Optional[StringField] = None

    commissioning_year: Optional[IntegerField] = None
    is_emergency: Optional[BooleanField] = None
    condition: Optional[StringField] = None
    apartments_count: Optional[IntegerField] = None
    non_residential_units_count: Optional[IntegerField] = None

    energy_efficiency_class: Optional[StringField] = None
    energy_survey_date: Optional[DatetimeField] = None

    entrances_count: Optional[IntegerField] = None
    max_floors_count: Optional[IntegerField] = None
    min_floors_count: Optional[IntegerField] = None
    underground_floors_count: Optional[IntegerField] = None

    capital_repair_fund: Optional[StringField] = None
    parking_area: Optional[FloatField] = None
    has_accessibility: Optional[IntegerField] = None

    house_type: Optional[StringField] = None
    building_wear_percent: Optional[FloatField] = None
    building_wear_date: Optional[DatetimeField] = None

    total_area: Optional[FloatField] = None
    residential_area: Optional[FloatField] = None
    non_residential_area: Optional[FloatField] = None
    common_property_area: Optional[FloatField] = None
    land_area: Optional[FloatField] = None

    building_series: Optional[StringField] = None
    is_cultural_heritage: Optional[IntegerField] = None

    ventilation: Optional[StringField] = None
    sewerage: Optional[StringField] = None
    drainage_system: Optional[StringField] = None
    gas_supply: Optional[StringField] = None
    hot_water_supply: Optional[StringField] = None
    fire_suppression: Optional[StringField] = None
    heating: Optional[StringField] = None
    cold_water_supply: Optional[StringField] = None
    electricity_supply: Optional[StringField] = None
    number_of_inputs: Optional[IntegerField] = None

    garbage_chute: Optional[BooleanField] = None
    load_bearing_walls: Optional[StringField] = None
    basement_area: Optional[FloatField] = None
    foundation_type: Optional[StringField] = None
    foundation_material: Optional[StringField] = None
    blind_area: Optional[FloatField] = None
    overlap_type: Optional[StringField] = None

    hot_water_system_type: Optional[StringField] = None
    hot_water_physical_wear: Optional[FloatField] = None
    hot_water_network_material: Optional[StringField] = None
    hot_water_insulation_material: Optional[StringField] = None
    hot_water_riser_material: Optional[StringField] = None

    sewerage_system_type: Optional[StringField] = None
    sewerage_network_material: Optional[StringField] = None

    gas_system_type: Optional[StringField] = None

    internal_walls_type: Optional[IntegerField] = None

    facade_wall_type: Optional[IntegerField] = None
    facade_insulation_type: Optional[IntegerField] = None
    facade_finishing_material: Optional[IntegerField] = None
    facade_last_major_repair_year: Optional[IntegerField] = None

    roof_shape: Optional[IntegerField] = None
    attic_insulation_layers: Optional[IntegerField] = None
    roof_support_structure_type: Optional[IntegerField] = None
    roof_covering_type: Optional[IntegerField] = None
    roof_last_major_repair_year: Optional[IntegerField] = None

    window_material: Optional[IntegerField] = None

    heating_physical_wear: Optional[FloatField] = None
    heating_network_material: Optional[StringField] = None
    heating_insulation_material: Optional[StringField] = None

    heating_riser_layout_type: Optional[StringField] = None
    heating_riser_material: Optional[StringField] = None
    heating_riser_valve_wear: Optional[FloatField] = None

    heating_device_type: Optional[StringField] = None
    heating_device_wear: Optional[FloatField] = None

    cold_water_physical_wear: Optional[FloatField] = None
    cold_water_network_material: Optional[StringField] = None

    cold_water_riser_wear: Optional[FloatField] = None
    cold_water_riser_material: Optional[StringField] = None

    cold_water_valve_wear: Optional[FloatField] = None

    hot_water_riser_wear: Optional[FloatField] = None

    hot_water_valve_wear: Optional[FloatField] = None
