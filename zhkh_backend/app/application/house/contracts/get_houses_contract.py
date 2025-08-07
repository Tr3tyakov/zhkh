from typing import (
    List,
    Optional,
)

from fastapi import Query

from app.domain.common.schemas.base import PaginationSchema


class HouseQueryParams(PaginationSchema):
    address: Optional[str]
    region: Optional[str]
    city: Optional[str]
    commissioning_year_from: Optional[int]
    commissioning_year_to: Optional[int]

    min_floors_count: Optional[int]
    max_floors_count: Optional[int]

    house_type: Optional[List[int]]
    building_series: Optional[List[int]]
    overlap_type: Optional[List[int]]
    load_bearing_walls: Optional[List[int]]
    garbage_chute_type: Optional[List[int]]
    energy_efficiency_class: Optional[List[int]]
    capital_repair_fund: Optional[List[int]]
    has_accessibility: Optional[List[int]]
    is_cultural_heritage: Optional[List[int]]
    ventilation: Optional[List[int]]
    sewerage: Optional[List[int]]
    drainage_system: Optional[List[int]]
    gas_supply: Optional[List[int]]
    hot_water_supply: Optional[List[int]]
    fire_suppression: Optional[List[int]]
    heating: Optional[List[int]]
    cold_water_supply: Optional[List[int]]
    electricity_supply: Optional[List[int]]
    hot_water_system_type: Optional[List[int]]
    hot_water_network_material: Optional[List[int]]
    hot_water_insulation_material: Optional[List[int]]
    hot_water_riser_material: Optional[List[int]]
    sewerage_system_type: Optional[List[int]]
    gas_system_type: Optional[List[int]]
    foundation_type: Optional[List[int]]
    foundation_material: Optional[List[int]]
    internal_walls_type: Optional[List[int]]
    facade_wall_type: Optional[List[int]]
    facade_insulation_type: Optional[List[int]]
    facade_finishing_material: Optional[List[int]]
    roof_shape: Optional[List[int]]
    attic_insulation_layers: Optional[List[int]]
    roof_support_structure_type: Optional[List[int]]
    roof_covering_type: Optional[List[int]]
    window_material: Optional[List[int]]
    heating_riser_layout_type: Optional[List[int]]
    heating_riser_material: Optional[List[int]]
    heating_device_type: Optional[List[int]]

    is_emergency: Optional[bool]

    class Config:
        arbitrary_types_allowed = True


def house_query_params(
    limit: int = Query(10, ge=1, le=100, alias="limit"),
    offset: int = Query(0, ge=0, alias="offset"),
    region: Optional[str] = Query(None, alias="regions"),
    city: Optional[str] = Query(None, alias="city"),
    address: Optional[str] = Query(None, alias="address"),
    commissioning_year_from: Optional[int] = Query(
        None, ge=0, alias="commissioningYearFrom"
    ),
    commissioning_year_to: Optional[int] = Query(
        None, ge=0, alias="commissioningYearTo"
    ),
    min_floors_count: Optional[int] = Query(None, ge=0, alias="floorsCountFrom"),
    max_floors_count: Optional[int] = Query(None, ge=0, alias="floorsCountTo"),
    house_type: Optional[List[int]] = Query(None, alias="houseType"),
    building_series: Optional[List[int]] = Query(None, alias="buildingSeries"),
    overlap_type: Optional[List[int]] = Query(None, alias="overlapType"),
    load_bearing_walls: Optional[List[int]] = Query(None, alias="loadBearingWalls"),
    garbage_chute_type: Optional[List[int]] = Query(None, alias="garbageChuteType"),
    energy_efficiency_class: Optional[List[int]] = Query(
        None, alias="energyEfficiencyClass"
    ),
    capital_repair_fund: Optional[List[int]] = Query(None, alias="capitalRepairFund"),
    has_accessibility: Optional[List[int]] = Query(None, alias="hasAccessibility"),
    is_cultural_heritage: Optional[List[int]] = Query(None, alias="isCulturalHeritage"),
    ventilation: Optional[List[int]] = Query(None, alias="ventilation"),
    sewerage: Optional[List[int]] = Query(None, alias="sewerage"),
    drainage_system: Optional[List[int]] = Query(None, alias="drainageSystem"),
    gas_supply: Optional[List[int]] = Query(None, alias="gasSupply"),
    hot_water_supply: Optional[List[int]] = Query(None, alias="hotWaterSupply"),
    fire_suppression: Optional[List[int]] = Query(None, alias="fireSuppression"),
    heating: Optional[List[int]] = Query(None, alias="heating"),
    cold_water_supply: Optional[List[int]] = Query(None, alias="coldWaterSupply"),
    electricity_supply: Optional[List[int]] = Query(None, alias="electricitySupply"),
    hot_water_system_type: Optional[List[int]] = Query(
        None, alias="hotWaterSystemType"
    ),
    hot_water_network_material: Optional[List[int]] = Query(
        None, alias="hotWaterNetworkMaterial"
    ),
    hot_water_insulation_material: Optional[List[int]] = Query(
        None, alias="hotWaterInsulationMaterial"
    ),
    hot_water_riser_material: Optional[List[int]] = Query(
        None, alias="hotWaterRiserMaterial"
    ),
    sewerage_system_type: Optional[List[int]] = Query(None, alias="sewerageSystemType"),
    gas_system_type: Optional[List[int]] = Query(None, alias="gasSystemType"),
    foundation_type: Optional[List[int]] = Query(None, alias="foundationType"),
    foundation_material: Optional[List[int]] = Query(None, alias="foundationMaterial"),
    internal_walls_type: Optional[List[int]] = Query(None, alias="internalWallsType"),
    facade_wall_type: Optional[List[int]] = Query(None, alias="facadeWallType"),
    facade_insulation_type: Optional[List[int]] = Query(
        None, alias="facadeInsulationType"
    ),
    facade_finishing_material: Optional[List[int]] = Query(
        None, alias="facadeFinishingMaterial"
    ),
    roof_shape: Optional[List[int]] = Query(None, alias="roofShape"),
    attic_insulation_layers: Optional[List[int]] = Query(
        None, alias="atticInsulationLayers"
    ),
    roof_support_structure_type: Optional[List[int]] = Query(
        None, alias="roofSupportStructureType"
    ),
    roof_covering_type: Optional[List[int]] = Query(None, alias="roofCoveringType"),
    window_material: Optional[List[int]] = Query(None, alias="windowMaterial"),
    heating_riser_layout_type: Optional[List[int]] = Query(
        None, alias="heatingRiserLayoutType"
    ),
    heating_riser_material: Optional[List[int]] = Query(
        None, alias="heatingRiserMaterial"
    ),
    heating_device_type: Optional[List[int]] = Query(None, alias="heatingDeviceType"),
    is_emergency: Optional[bool] = Query(None, alias="isEmergency"),
) -> HouseQueryParams:
    return HouseQueryParams(
        limit=limit,
        offset=offset,
        region=region,
        city=city,
        address=address,
        commissioning_year_from=commissioning_year_from,
        commissioning_year_to=commissioning_year_to,
        min_floors_count=min_floors_count,
        max_floors_count=max_floors_count,
        house_type=house_type,
        building_series=building_series,
        overlap_type=overlap_type,
        load_bearing_walls=load_bearing_walls,
        garbage_chute_type=garbage_chute_type,
        energy_efficiency_class=energy_efficiency_class,
        capital_repair_fund=capital_repair_fund,
        has_accessibility=has_accessibility,
        is_cultural_heritage=is_cultural_heritage,
        ventilation=ventilation,
        sewerage=sewerage,
        drainage_system=drainage_system,
        gas_supply=gas_supply,
        hot_water_supply=hot_water_supply,
        fire_suppression=fire_suppression,
        heating=heating,
        cold_water_supply=cold_water_supply,
        electricity_supply=electricity_supply,
        hot_water_system_type=hot_water_system_type,
        hot_water_network_material=hot_water_network_material,
        hot_water_insulation_material=hot_water_insulation_material,
        hot_water_riser_material=hot_water_riser_material,
        sewerage_system_type=sewerage_system_type,
        gas_system_type=gas_system_type,
        foundation_type=foundation_type,
        foundation_material=foundation_material,
        internal_walls_type=internal_walls_type,
        facade_wall_type=facade_wall_type,
        facade_insulation_type=facade_insulation_type,
        facade_finishing_material=facade_finishing_material,
        roof_shape=roof_shape,
        attic_insulation_layers=attic_insulation_layers,
        roof_support_structure_type=roof_support_structure_type,
        roof_covering_type=roof_covering_type,
        window_material=window_material,
        heating_riser_layout_type=heating_riser_layout_type,
        heating_riser_material=heating_riser_material,
        heating_device_type=heating_device_type,
        is_emergency=is_emergency,
    )
