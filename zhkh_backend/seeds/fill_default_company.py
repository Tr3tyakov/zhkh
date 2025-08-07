import asyncio
import logging
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import (
    DB_URL,
    settings,
)
from app.infrastructure.common.enums.user import UserTypeEnum
from app.infrastructure.orm.models import (
    Company,
    User,
)
from app.infrastructure.postgres import Database


async def seed_company(session: AsyncSession):
    async with session.begin():
        company = (
            (
                await session.execute(
                    select(Company.inn).where(Company.inn == "123456789012")
                )
            )
            .scalars()
            .first()
        )
        if company:
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

        company = Company(
            name="УК «Жилищный сервис»",
            legal_form="ООО",
            inn="123456789012",
            address="г. Москва, ул. Ленина, д.1",
            phone="+7 (495) 123-45-67",
            email="info@zhilservis.ru",
            website="https://zhilservis.ru",
            user_id=user_id,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

        session.add(company)
        await session.commit()

        logging.info("Компания успешно создана")


async def main():
    database = Database(settings.POSTGRES, DB_URL)
    database.connect()
    try:
        async with database.async_context() as session:
            await seed_company(session)
    finally:
        await database.close()


if __name__ == "__main__":
    asyncio.run(main())
