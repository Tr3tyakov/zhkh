from app.domain.common.interfaces.orm_translator import IPersistenceTranslator
from app.domain.file.aggregates.file_aggregate import FileAggregate
from app.domain.file.schemas.file_setup_schema import FileSetupSchema
from app.infrastructure.orm.models.file import File


class FileTranslator(IPersistenceTranslator):
    orm_model = File
    aggregate = FileAggregate

    @classmethod
    def to_domain(cls, model: File) -> FileAggregate:
        return cls.aggregate.setup(data=FileSetupSchema(**model.__dict__))

    @classmethod
    def to_orm(cls, aggregate: FileAggregate) -> File:
        return cls.orm_model(**aggregate.dump())
