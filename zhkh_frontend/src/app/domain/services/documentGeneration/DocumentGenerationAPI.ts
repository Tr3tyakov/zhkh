import { IDocumentGenerationAPI, IGenerateDocument } from './documentGenerationAPI.interfaces.ts';
import { inject, injectable } from 'tsyringe';
import { DefaultAPI } from '../baseAPI.ts';
import { CookieServiceKey } from '../../cookie/key.ts';
import type { ICookieService } from '../../cookie/cookieService.interfaces.ts';
import { ReportTypeEnum } from '../../../infrastructures/enums/user.ts';

@injectable()
export class DocumentGenerationAPI extends DefaultAPI implements IDocumentGenerationAPI {
    constructor(@inject(CookieServiceKey) cookieService: ICookieService) {
        super(cookieService);
    }

    /**
     * Генерация Excel файла
     */
    async generateExcel(data: IGenerateDocument) {
        const response = await this.API.post('/generate/excel', data, {
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    /**
     * Генерация PDF файла
     */
    async generatePDF(data: IGenerateDocument, reportType: ReportTypeEnum) {
        const response = await this.API.post(
            '/generate/pdf',
            { ...data, reportType },
            {
                headers: { Authorization: this.bearer },
            }
        );

        return response.data;
    }
}
