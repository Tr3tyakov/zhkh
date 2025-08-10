import asyncio
import logging
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import (
    DB_URL,
    settings,
)
from app.domain.user.aggregates.user import UserAggregate
from app.domain.user.schemas.user_create_schema import UserCreateSchema
from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)
from app.infrastructure.orm.models import User
from app.infrastructure.postgres import Database

from sqlalchemy import select
async def seed_user(session: AsyncSession):
    async with session.begin():
        user =(await session.execute(select(User).where(User.email == "admin@service.ru"))).scalars().first()
        if user:
            return

        user = UserAggregate.create_user(
            data=UserCreateSchema(
                first_name="Иван",
                middle_name="Иванов",
                last_name="Иванович",
                email="admin@service.ru",
                password="admin123",
                user_type=UserTypeEnum.ADMIN,
                file_key=None,
                account_status=UserAccountStatusEnum.ACTIVE,
                private_phone="+79990001122",
                work_phone=None,
            )
        )
        user = User(**user.dump(exclude={"id", "file_path"}))
        session.add(user)
        await session.commit()

    logging.info("Пользователь успешно создан")


async def main():
    database = Database(settings.POSTGRES, DB_URL)
    database.connect()
    try:
        async with database.async_context() as session:
            await seed_user(session)
    finally:
        await database.close()


if __name__ == "__main__":
    asyncio.run(main())
