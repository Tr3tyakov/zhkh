from typing import (
    Any,
    AsyncGenerator,
    List,
    Optional,
    Sequence,
    Tuple,
    Union,
)

from sqlalchemy import (
    Result,
    Select,
    delete,
    exists,
    func,
    select,
    update,
)

from app.application.common.interfaces.session_manager import ISessionManager
from app.domain.common.interfaces.aggregates import IAggregate
from app.domain.common.interfaces.orm_translator import TAggregate
from app.domain.common.interfaces.repositories.base import IBaseRepository
from app.infrastructure.common.enums.base import (
    ResultStrategy,
    SortDirectionEnum,
)
from app.infrastructure.containers.utils import Provide
from app.infrastructure.persistence.common.options import (
    BaseFilter,
    Options,
)
from app.infrastructure.persistence.common.types import StatementType


class BaseRepository(IBaseRepository):

    def __init__(self, session_manager: ISessionManager = Provide[ISessionManager]):
        self._session_manager = session_manager

    async def create_instance(self, aggregate: TAggregate) -> TAggregate:
        session = self._session_manager.get_session()
        instance = self.translator.to_orm(aggregate)

        session.add(instance)
        await session.flush()

        return self.translator.to_domain(instance)

    async def update_instance(self, id: int, **kwargs) -> TAggregate:
        """Обновление сущности"""
        session = self._session_manager.get_session()
        model = self.translator.orm_model

        result = await session.execute(
            update(model).where(model.id == id).values(**kwargs).returning(model)
        )
        return self.translator.to_domain(model=result.scalar_one())

    async def delete_instances(self, ids: List[int]) -> None:
        model = self.translator.orm_model
        await self.just_execute(delete(model).where(model.id.in_(ids)))

    async def execute(
        self,
        stmt: StatementType,
        options: Optional[Options] = None,
    ) -> Any:
        result = await self.just_execute(stmt)
        if options and options.strategy:
            return options.strategy.apply(result)

        return result.scalar_one_or_none()

    async def just_execute(self, stmt: StatementType) -> Result:
        session = self._session_manager.get_session()
        return await session.execute(stmt)

    async def execute_by_chunk(
        self,
        stmt: Select,
        chunk_size: int = 10,
        unique: bool = False,
    ) -> AsyncGenerator:
        """
        Получение данных из БД порциями
        """
        session = self._session_manager.get_session()

        result = await session.execute(stmt)
        if unique:
            result = result.unique()

        while chunk := result.scalars().fetchmany(chunk_size):
            yield chunk

    def integrate_query(
        self, options: Optional[Options] = None, filters: Optional[BaseFilter] = None
    ) -> Select:
        return self._integrate_filters(self._integrate_options(options), filters)

    def _integrate_options(self, options: Optional[Options] = None) -> Select:
        model = self.translator.orm_model

        # Выбор конкретного возвращаемого поля
        if options and options.current_attributes:
            stmt = select(
                *[
                    getattr(model, current_attribute)
                    for current_attribute in options.current_attributes
                ]
            )
        else:
            stmt = select(model)

        # Загрузка relationships
        if options and options.load_options:
            stmt = stmt.options(*options.load_options)

        # Сортировка
        if options and options.order_by:
            for field_name, direction in options.order_by:
                column = getattr(model, field_name)
                stmt = stmt.order_by(
                    column.asc()
                    if direction == SortDirectionEnum.ASC
                    else column.desc()
                )

        return stmt

    def _integrate_filters(
        self, stmt: Select, filters: Optional[BaseFilter] = None
    ) -> Select:
        if filters:
            filter_fields = filters.model_dump(
                exclude_none=True, exclude={"limit", "offset"}
            ).items()

            for field, filter_value in filter_fields:
                operator_func, value = filter_value
                column = getattr(self.translator.orm_model, field)
                stmt = stmt.where(operator_func(column, value))

            if filters.limit is not None:
                stmt = stmt.limit(filters.limit)

            if filters.offset is not None:
                stmt = stmt.offset(filters.offset)

        return stmt

    async def get(
        self,
        filters: Optional[BaseFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[IAggregate, Sequence[IAggregate], Any]]:
        result = await self.execute(self.integrate_query(options, filters), options)

        # Если выбирали отдельные поля — возвращаем "сырые" значения
        if options and options.current_attributes:
            if isinstance(result, list):
                return result
            return result

        # Преобразуем результат в агрегаты (если полный ORM объект)
        if isinstance(result, list):
            return [self.translator.to_domain(obj) for obj in result]

        if result is not None:
            return self.translator.to_domain(result)
        return None

    async def check_existence(
        self,
        filters: Optional[BaseFilter] = None,
        options: Optional[Options] = None,
    ) -> bool:
        base_query = self.integrate_query(filters=filters, options=options)
        stmt = select(exists(base_query))
        result = await self.just_execute(stmt)

        return result.scalar()

    async def get_pagination_data(
        self, stmt: Select, limit: int, offset: int
    ) -> Tuple[Any, int]:
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count = await self.execute(
            count_stmt, options=Options(strategy=ResultStrategy.SCALAR)
        )

        stmt = stmt.limit(limit).offset(offset)
        data = await self.execute(
            stmt, options=Options(strategy=ResultStrategy.SCALARS_ALL)
        )

        return data, count
