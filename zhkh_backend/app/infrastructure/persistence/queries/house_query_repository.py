from collections import defaultdict
from typing import (
    List,
    Optional,
)

from sqlalchemy import (
    case,
    distinct,
    func,
    select, or_,
)

from app.application.common.interfaces.ceph import ICeph
from app.application.house.queries.get_attached_houses_query import GetAttachedHousesQuery
from app.application.house.queries.get_houses_query import GetHousesQuery
from app.application.house.queries.get_unattached_houses_query import GetUnAttachedHousesQuery
from app.application.house.schemas.base import HouseResponseSchema
from app.application.house.schemas.get_house_files_schema import (
    GetHouseFilesResponseSchema,
    HouseFileSchema,
)
from app.config import settings
from app.domain.common.interfaces.repositories.queries.house_query_repository import (
    IHouseQueryRepository,
)
from app.domain.common.schemas.house_regions_schema import GetHouseRegionsResponseSchema
from app.domain.common.schemas.house_response_schema import GetHouseResponseSchema
from app.infrastructure.common.enums.base import ResultStrategy
from app.infrastructure.common.enums.user import FileCategoryEnum
from app.infrastructure.containers.utils import Provide
from app.infrastructure.orm.models import (
    House,
)
from app.infrastructure.orm.models.file import File
from app.infrastructure.orm.models.m2m.house_file import HouseFileM2M
from app.infrastructure.persistence.base import BaseRepository
from app.infrastructure.persistence.common.options import Options


class HouseQueryRepository(BaseRepository, IHouseQueryRepository):

    def __init__(self, ceph: ICeph = Provide[ICeph]):
        self._ceph = ceph
        super().__init__()

    async def get_unattached_houses(self, query: GetUnAttachedHousesQuery) -> GetHouseResponseSchema:
        stmt = select(House).where(
            House.company_id == None
        )

        stmt = self._get_search_stmt(stmt, query.search)
        stmt = stmt.order_by(House.id)
        houses, count = await self.get_pagination_data(
            stmt, query.limit, query.offset
        )
        return GetHouseResponseSchema(
            total=count,
            houses=[HouseResponseSchema.model_validate(house) for house in houses],
        )

    async def get_attached_houses(self, query: GetAttachedHousesQuery) -> GetHouseResponseSchema:
        stmt = select(House).where(
            House.company_id == query.company_id
        )

        stmt = self._get_search_stmt(stmt, query.search)
        stmt = stmt.order_by(House.id)
        houses, count = await self.get_pagination_data(
            stmt, query.limit, query.offset
        )

        return GetHouseResponseSchema(
            total=count,
            houses=[HouseResponseSchema.model_validate(house) for house in houses],
        )

    async def get_houses(
            self,
            filters: GetHousesQuery,
    ) -> GetHouseResponseSchema:
        stmt = select(House)

        if filters.address:
            address_like = f"%{filters.address.lower()}%"
            full_address = func.lower(
                func.concat_ws(
                    " ",
                    House.region,
                    House.city,
                    House.street,
                    func.concat("д. ", House.house_number),
                )
            )
            stmt = stmt.where(full_address.ilike(address_like))

        if filters.city:
            stmt = stmt.where(House.city.ilike(f"%{filters.city}%"))

        if filters.region:
            stmt = stmt.where(House.city.ilike(f"%{filters.city}%"))

        # --- Фильтрация по годам ---
        if filters.commissioning_year_from is not None:
            stmt = stmt.where(
                House.commissioning_year >= filters.commissioning_year_from
            )

        if filters.commissioning_year_to is not None:
            stmt = stmt.where(House.commissioning_year <= filters.commissioning_year_to)

        # --- Фильтрация по этажности ---
        if filters.min_floors_count is not None:
            stmt = stmt.where(House.min_floors_count >= filters.min_floors_count)

        if filters.max_floors_count is not None:
            stmt = stmt.where(House.max_floors_count <= filters.max_floors_count)

        list_filters = {
            "house_type": filters.house_type,
            "building_series": filters.building_series,
            "overlap_type": filters.overlap_type,
            "load_bearing_walls": filters.load_bearing_walls,
            "garbage_chute_type": filters.garbage_chute_type,
            "energy_efficiency_class": filters.energy_efficiency_class,
            "capital_repair_fund": filters.capital_repair_fund,
            "has_accessibility": filters.has_accessibility,
            "is_cultural_heritage": filters.is_cultural_heritage,
            "ventilation": filters.ventilation,
            "sewerage": filters.sewerage,
            "drainage_system": filters.drainage_system,
            "gas_supply": filters.gas_supply,
            "hot_water_supply": filters.hot_water_supply,
            "fire_suppression": filters.fire_suppression,
            "heating": filters.heating,
            "cold_water_supply": filters.cold_water_supply,
            "electricity_supply": filters.electricity_supply,
            "hot_water_system_type": filters.hot_water_system_type,
            "hot_water_network_material": filters.hot_water_network_material,
            "hot_water_insulation_material": filters.hot_water_insulation_material,
            "hot_water_riser_material": filters.hot_water_riser_material,
            "sewerage_system_type": filters.sewerage_system_type,
            "gas_system_type": filters.gas_system_type,
            "foundation_type": filters.foundation_type,
            "foundation_material": filters.foundation_material,
            "internal_walls_type": filters.internal_walls_type,
            "facade_wall_type": filters.facade_wall_type,
            "facade_insulation_type": filters.facade_insulation_type,
            "facade_finishing_material": filters.facade_finishing_material,
            "roof_shape": filters.roof_shape,
            "attic_insulation_layers": filters.attic_insulation_layers,
            "roof_support_structure_type": filters.roof_support_structure_type,
            "roof_covering_type": filters.roof_covering_type,
            "window_material": filters.window_material,
            "heating_riser_layout_type": filters.heating_riser_layout_type,
            "heating_riser_material": filters.heating_riser_material,
            "heating_device_type": filters.heating_device_type,
        }

        for field, values in list_filters.items():
            stmt = self._apply_filter(stmt, field, values)

        if filters.is_emergency is not None:
            stmt = stmt.where(House.is_emergency == filters.is_emergency)

        stmt = stmt.order_by(House.id)
        houses, count = await self.get_pagination_data(
            stmt, filters.limit, filters.offset
        )

        return GetHouseResponseSchema(
            total=count,
            houses=[HouseResponseSchema.model_validate(house) for house in houses],
        )

    async def get_house_files(self, house_id: int) -> GetHouseFilesResponseSchema:
        stmt = (
            select(File, HouseFileM2M.category)
            .join(HouseFileM2M, HouseFileM2M.file_id == File.id)
            .where(HouseFileM2M.house_id == house_id)
        )

        result = await self.execute(stmt, options=Options(strategy=ResultStrategy.ALL))

        files_map = defaultdict(list)
        for file, category in result:
            files_map[category.value].append(
                HouseFileSchema(
                    id=file.id,
                    file_name=file.file_name,
                    link=await self._ceph.generate_presigned_url(
                        bucket=settings.S3.bucket, key=file.file_key
                    ),
                    created_at=file.created_at,
                )
            )

        response_data = {
            str(category.value).lower(): files_map.get(category.value, [])
            for category in FileCategoryEnum
        }

        return GetHouseFilesResponseSchema(**response_data)

    async def get_house_regions(self) -> GetHouseRegionsResponseSchema:
        region_col = House.region

        region_type_case = case(
            (region_col.ilike("%автономная область%"), "autonomous_areas"),
            (region_col.ilike("%область%"), "oblasts"),
            (region_col.ilike("%край%"), "krais"),
            (region_col.ilike("%республика%"), "republics"),
            (region_col.ilike("%автономный округ%"), "autonomous_okrugs"),
            else_="cities",
        )

        stmt = select(
            distinct(region_col).label("region"), region_type_case.label("region_type")
        ).order_by("region_type", "region")
        results = await self.execute(stmt, options=Options(strategy=ResultStrategy.ALL))

        grouped = defaultdict(list)
        for region, rtype in results:
            grouped[rtype].append(region)

        return GetHouseRegionsResponseSchema(
            oblasts=grouped.get("oblasts", []),
            cities=grouped.get("cities", []),
            krais=grouped.get("krais", []),
            republics=grouped.get("republics", []),
            autonomous_areas=grouped.get("autonomous_areas", []),
            autonomous_okrugs=grouped.get("autonomous_okrugs", []),
        )

    async def get_house_cities(self) -> List[str]:
        stmt = select(distinct(House.city))
        return await self.execute(
            stmt, options=Options(strategy=ResultStrategy.SCALARS_ALL)
        )

    def _apply_filter(self, stmt, field, values: Optional[list]):
        if values is not None and len(values) > 0:
            return stmt.where(getattr(House, field).in_(values))
        return stmt

    def _get_search_stmt(self, stmt, search: Optional[str] = None):
        if search:
            address_like = f"%{search.lower().strip()}%"
            full_address = func.lower(
                func.concat_ws(
                    " ",
                    House.region,
                    House.city,
                    House.street,
                    func.concat("д. ", House.house_number),
                )
            )
            return stmt.where(full_address.ilike(address_like))
        return stmt

    async def is_reference_value_used(self, reference_value_id: int) -> bool:
        filters = or_(
            House.energy_efficiency_class == reference_value_id,
            House.capital_repair_fund == reference_value_id,
            House.has_accessibility == reference_value_id,
            House.house_type == reference_value_id,
            House.building_series == reference_value_id,
            House.is_cultural_heritage == reference_value_id,
            House.ventilation == reference_value_id,
            House.sewerage == reference_value_id,
            House.drainage_system == reference_value_id,
            House.gas_supply == reference_value_id,
            House.hot_water_supply == reference_value_id,
            House.fire_suppression == reference_value_id,
            House.heating == reference_value_id,
            House.cold_water_supply == reference_value_id,
            House.electricity_supply == reference_value_id,
            House.garbage_chute_type == reference_value_id,
            House.load_bearing_walls == reference_value_id,
            House.foundation_type == reference_value_id,
            House.foundation_material == reference_value_id,
            House.overlap_type == reference_value_id,
            House.hot_water_system_type == reference_value_id,
            House.hot_water_network_material == reference_value_id,
            House.hot_water_insulation_material == reference_value_id,
            House.hot_water_riser_material == reference_value_id,
            House.sewerage_system_type == reference_value_id,
            House.gas_system_type == reference_value_id,
            House.internal_walls_type == reference_value_id,
            House.facade_wall_type == reference_value_id,
            House.facade_insulation_type == reference_value_id,
            House.facade_finishing_material == reference_value_id,
            House.roof_shape == reference_value_id,
            House.roof_support_structure_type == reference_value_id,
            House.roof_covering_type == reference_value_id,
            House.window_material == reference_value_id,
            House.heating_riser_layout_type == reference_value_id,
            House.heating_device_type == reference_value_id,
        )

        stmt = select(House.id).where(filters).limit(1)

        result = await self.execute(
            stmt, options=Options(strategy=ResultStrategy.SCALAR)
        )

        return result is not None
