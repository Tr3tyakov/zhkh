import { IHouseField } from '../houses/houseAPI.interfaces.ts';
import { ReportTypeEnum } from '../../../infrastructures/enums/user.ts';

interface IGenerationField extends IHouseField {}

interface IGenerateDocument {
    fields: IGenerationField[];
}

interface IDocumentGenerationAPI {
    generateExcel: (data: IGenerateDocument) => Promise<string>;
    generatePDF: (data: IGenerateDocument, reportType: ReportTypeEnum) => Promise<string>;
}

export type { IDocumentGenerationAPI, IGenerateDocument, IGenerationField };
