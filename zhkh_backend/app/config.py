import pathlib

from dynaconf import Dynaconf

settings = Dynaconf(
    settings_files=["settings.yml"],
    environments=True,
    ENVVAR_PREFIX_FOR_DYNACONF=False,
)
BASE_URL = "postgresql+{driver}://{username}:{password}@{host}:{port}/{database}"

DB_URL = BASE_URL.format(
    username=settings.POSTGRES.user,
    password=settings.POSTGRES.password,
    host=settings.POSTGRES.host,
    port=settings.POSTGRES.port,
    database=settings.POSTGRES.database,
    driver=settings.POSTGRES.async_driver,
)

MIGRATION_URL = "postgresql://{username}:{password}@{host}:{port}/{database}".format(
    username=settings.POSTGRES.user,
    password=settings.POSTGRES.password,
    host=settings.POSTGRES.host,
    port=settings.POSTGRES.port,
    database=settings.POSTGRES.database,
)


PROJECT_DIR = pathlib.Path(__file__).parent.parent.resolve()
