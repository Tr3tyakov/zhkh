import sys
from pathlib import Path

from alembic import context
from sqlalchemy import (
    engine_from_config,
    pool,
)

# Fix путей к пакету
MODEL_PATH = str(Path.cwd())
sys.path.append(MODEL_PATH)

config = context.config
from app.config import MIGRATION_URL
from app.infrastructure.orm.models import User

# Проверяем передан ли нам URL бд для миграций
try:
    pg_url = config.cmd_opts.pg_url
except AttributeError:
    pg_url = None

# Задаем дефолтный URL БД, если явно не передан
if not pg_url:
    config.set_main_option("sqlalchemy.url", str(MIGRATION_URL))

target_metadata = User.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_schemas=True,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """

    def process_revision_directives(_context, _revision, directives) -> None:
        if config.cmd_opts.autogenerate:
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            process_revision_directives=process_revision_directives,
            include_schemas=True,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
