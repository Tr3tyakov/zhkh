from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import List, Dict

from app.application.common.interfaces.ceph import ICeph
from app.application.common.interfaces.request import IRequestHandler
from app.application.document_generation.commands.generate_pdf_document_command import (
    GeneratePDFDocumentCommand,
)
from app.application.house.schemas.house_fields_schema import HouseFieldSchema
from app.config import (
    PROJECT_DIR,
    settings,
)
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.common.interfaces.repositories.reference_book_value_repository import \
    IReferenceBookValueRepository
from app.infrastructure.common.enums.base import ResultStrategy
from app.infrastructure.common.enums.generation_document import GeneratePDFDocumentType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.orm.models import House
from app.infrastructure.persistence.common.options import Options
from jinja2 import (
    Environment,
    FileSystemLoader,
    select_autoescape,
)
from weasyprint import HTML

from app.application.document_generation.handlers.base import HouseDataMapper


class GeneratePdfDocumentHandler(IRequestHandler[GeneratePDFDocumentCommand, None]):
    def __init__(
        self,
        ceph: ICeph = Provide[ICeph],
            reference_book_value_repository: IReferenceBookValueRepository = Provide[IReferenceBookValueRepository],
        house_repository: IHouseRepository = Provide[IHouseRepository],
    ):
        self._ceph = ceph
        self._house_repository = house_repository
        self._reference_book_value_repository = reference_book_value_repository
        self._data_mapper = HouseDataMapper(reference_book_value_repository)


    async def handle(
            self, command: GeneratePDFDocumentCommand, _
    ) -> str:
        pdf_stream = await self._render_pdf(command)

        filename = f"houses_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        key = f"reports/{filename}"

        await self._ceph.put_object(bucket=settings.S3.bucket, key=key, data=pdf_stream)

        return await self._ceph.generate_presigned_url(
            bucket=settings.S3.bucket, key=key
        )

    async def _render_pdf(self, command: GeneratePDFDocumentCommand) -> BytesIO:
        render_functions = {
            GeneratePDFDocumentType.TABLE.value: self.render_table_report_html,
            GeneratePDFDocumentType.DETAIL.value: self.render_detailed_report_html,
        }
        render_func = render_functions.get(command.report_type)
        template_dir = PROJECT_DIR / "app" / "presentation" / "templates"
        env = self._get_env(template_dir)

        report_date = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
        houses = await self._gather_all_houses()

        houses_data = []
        for house in houses:
            house_dict = await self._data_mapper.map_house_fields(house)
            row = [house_dict.get(f.field, "") for f in command.fields]
            houses_data.append(row)

        rendered_html = render_func(env, command.fields, houses_data, report_date)

        stream = BytesIO()
        HTML(string=rendered_html).write_pdf(stream)
        stream.seek(0)
        return stream

    def _get_env(self, template_dir: Path) -> Environment:
        return Environment(
            loader=FileSystemLoader(str(template_dir)),
            autoescape=select_autoescape(["html"]),
        )

    async def _gather_all_houses(self) -> List:
        houses = []
        async for chunk in self._house_repository.get_all_houses_by_chunk():
            houses.extend(chunk)
        return houses

    def render_table_report_html(
            self,
            env: Environment,
            fields: List[HouseFieldSchema],
            houses_data: List[dict],  # теперь это список словарей
            report_date: str,
    ) -> str:
        template = env.get_template("tableInformation.html")
        headers = [f.description for f in fields]

        num_cols = len(fields)
        if num_cols <= 10:
            page_size = "A4"
        elif num_cols <= 18:
            page_size = "A3"
        elif num_cols <= 25:
            page_size = "A2"
        else:
            page_size = "A1"

        return template.render(
            headers=headers,
            rows=houses_data,
            report_date=report_date,
            page_size=page_size
        )
    def render_detailed_report_html(
        self,
        env: Environment,
        fields: List[HouseFieldSchema],
        houses_data: List[House],
        report_date: str,
    ) -> str:
        template = env.get_template("detailInformation.html")

        return template.render(
            fields=fields,
            houses=houses_data,
            report_date=report_date,
        )