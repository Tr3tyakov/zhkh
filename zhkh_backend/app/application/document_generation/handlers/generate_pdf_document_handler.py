from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import List

from jinja2 import (
    Environment,
    FileSystemLoader,
    select_autoescape,
)
from weasyprint import HTML

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
from app.infrastructure.common.enums.generation_document import GeneratePDFDocumentType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext
from app.infrastructure.orm.models import House


class GeneratePdfDocumentHandler(IRequestHandler[GeneratePDFDocumentCommand, None]):
    def __init__(
        self,
        ceph: ICeph = Provide[ICeph],
        house_repository: IHouseRepository = Provide[IHouseRepository],
    ):
        self._ceph = ceph
        self._house_repository = house_repository

    async def handle(
        self, command: GeneratePDFDocumentCommand, context: PipelineContext
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
        houses_data = await self._gather_all_houses()

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
        houses_data: List,
        report_date: str,
    ) -> str:
        template = env.get_template("tableInformation.html")
        headers = [f.description for f in fields]
        rows = [[getattr(house, f.field, "") for f in fields] for house in houses_data]

        return template.render(
            headers=headers,
            rows=rows,
            report_date=report_date,
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
