from app.application.common.interfaces.ceph import ICeph
from app.application.common.interfaces.container import IContainer
from app.application.common.interfaces.postgres import IDatabase
from app.application.common.interfaces.redis import IRedis
from app.application.common.interfaces.services.key_generator_service import (
    IKeyGeneratorService,
)
from app.application.common.interfaces.services.token_service import ITokenService
from app.application.common.interfaces.session_manager import ISessionManager
from app.config import (
    DB_URL,
    settings,
)
from app.domain.common.interfaces.repositories.audit_log_repository import (
    IAuditLogRepository,
)
from app.domain.common.interfaces.repositories.company_repository import (
    ICompanyRepository,
)
from app.domain.common.interfaces.repositories.file_repository import IFileRepository
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.common.interfaces.repositories.queries.audit_query_repository import (
    IAuditLogQueryRepository,
)
from app.domain.common.interfaces.repositories.queries.company_query_repository import (
    ICompanyQueryRepository,
)
from app.domain.common.interfaces.repositories.queries.house_query_repository import (
    IHouseQueryRepository,
)
from app.domain.common.interfaces.repositories.queries.reference_book_query_repository import (
    IReferenceBookQueryRepository,
)
from app.domain.common.interfaces.repositories.queries.user_query_repository import (
    IUserQueryRepository,
)
from app.domain.common.interfaces.repositories.reference_book_repository import (
    IReferenceBookRepository,
)
from app.domain.common.interfaces.repositories.reference_book_value_repository import (
    IReferenceBookValueRepository,
)
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.domain.services.token_service import TokenService
from app.infrastructure.ceph import Ceph
from app.infrastructure.common.services.key_generator_service import KeyGeneratorService
from app.infrastructure.containers.utils import Configuration
from app.infrastructure.persistence.audit_log_repository import AuditLogRepository
from app.infrastructure.persistence.company_repository import CompanyRepository
from app.infrastructure.persistence.file_repository import FileRepository
from app.infrastructure.persistence.house_repository import HouseRepository
from app.infrastructure.persistence.queries.audit_logs_query_repository import (
    AuditLogQueryRepository,
)
from app.infrastructure.persistence.queries.company_query_repository import (
    CompanyQueryRepository,
)
from app.infrastructure.persistence.queries.house_query_repository import (
    HouseQueryRepository,
)
from app.infrastructure.persistence.queries.reference_book_query_repository import (
    ReferenceBookQueryRepository,
)
from app.infrastructure.persistence.queries.user_query_repository import (
    UserQueryRepository,
)
from app.infrastructure.persistence.reference_book_repository import (
    ReferenceBookRepository,
)
from app.infrastructure.persistence.reference_book_value_repository import (
    ReferenceBookValueRepository,
)
from app.infrastructure.persistence.user_repository import UserRepository
from app.infrastructure.postgres import Database
from app.infrastructure.redis import Redis
from app.infrastructure.session_manger import SessionManager


# REPOSITORY
def add_repositories(_, di_container: IContainer) -> IContainer:
    di_container.add_singleton(
        implementation=UserRepository,
        interface=IUserRepository,
    )
    di_container.add_singleton(
        implementation=HouseRepository, interface=IHouseRepository
    )
    di_container.add_singleton(
        implementation=HouseQueryRepository, interface=IHouseQueryRepository
    )
    di_container.add_singleton(
        implementation=UserQueryRepository, interface=IUserQueryRepository
    )
    di_container.add_singleton(
        implementation=CompanyRepository, interface=ICompanyRepository
    )
    di_container.add_singleton(
        implementation=CompanyQueryRepository, interface=ICompanyQueryRepository
    )
    di_container.add_singleton(
        implementation=AuditLogQueryRepository, interface=IAuditLogQueryRepository
    )
    di_container.add_singleton(
        implementation=AuditLogRepository,
        interface=IAuditLogRepository,
    )
    di_container.add_singleton(
        implementation=FileRepository,
        interface=IFileRepository,
    )
    di_container.add_singleton(
        implementation=ReferenceBookValueRepository,
        interface=IReferenceBookValueRepository,
    )
    di_container.add_singleton(
        implementation=ReferenceBookRepository,
        interface=IReferenceBookRepository,
    )
    di_container.add_singleton(
        implementation=ReferenceBookQueryRepository,
        interface=IReferenceBookQueryRepository,
    )

    return di_container


def add_infrastructures(_, di_container: IContainer) -> IContainer:
    di_container.add_singleton(
        implementation=Database,
        interface=IDatabase,
        config=Configuration(settings=settings.POSTGRES, db_url=DB_URL),
    )
    di_container.add_singleton(
        implementation=Ceph, interface=ICeph, config=Configuration(settings=settings.S3)
    )
    di_container.add_singleton(
        implementation=SessionManager,
        interface=ISessionManager,
    )
    di_container.add_singleton(
        implementation=Redis,
        interface=IRedis,
        config=Configuration(settings=settings.REDIS),
    )
    di_container.add_singleton(
        implementation=TokenService,
        interface=ITokenService,
        config=Configuration(settings=settings.TOKENS),
    )
    di_container.add_singleton(
        implementation=KeyGeneratorService,
        interface=IKeyGeneratorService,
    )

    return di_container
