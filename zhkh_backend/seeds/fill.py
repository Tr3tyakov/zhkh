import asyncio
from pathlib import Path

from app.config import (
    DB_URL,
    settings,
)
from app.infrastructure.postgres import Database
from seeds.fill_admin import seed_user
from seeds.fill_default_company import seed_company
from seeds.fill_houses import import_houses
from seeds.fill_reference_books import (
    full_reference_data,
    seed_insert_reference_books,
)


async def main():
    database = Database(settings.POSTGRES, DB_URL)
    database.connect()
    json_path = Path(__file__).parent.parent / "house_data.json"

    try:
        async with database.async_context() as session:
            await seed_user(session)
            await seed_company(session)
            await import_houses(session, json_path)
            await seed_insert_reference_books(session, full_reference_data)
    finally:
        await database.close()


if __name__ == "__main__":
    asyncio.run(main())
