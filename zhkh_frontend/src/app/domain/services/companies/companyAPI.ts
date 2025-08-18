import { inject, injectable } from 'tsyringe';
import { DefaultAPI } from '../baseAPI.ts';
import { CookieServiceKey } from '../../cookie/key.ts';
import type { ICookieService } from '../../cookie/cookieService.interfaces.ts';
import { ICompanyAPI, ICreateCompanyData, IUpdateCompanyData } from './companyAPI.interfaces.ts';

@injectable()
export class CompanyAPI extends DefaultAPI implements ICompanyAPI {
    constructor(@inject(CookieServiceKey) cookieService: ICookieService) {
        super(cookieService);
    }

    async createCompany(userId: number, data: ICreateCompanyData) {
        return await this.API.post(
            '/company',
            { ...data, userId },
            {
                headers: { Authorization: this.bearer },
            }
        );
    }

    async updateCompany(companyId: number, data: IUpdateCompanyData) {
        return await this.API.put(`/companies/${companyId}`, data, {
            headers: { Authorization: this.bearer },
        });
    }

    async getCompanies(limit: number, offset: number, searchValue?: string) {
        const params = {
            limit,
            offset,
            ...(searchValue ? { search: searchValue } : {}),
        };
        const response = await this.API.get('/companies', {
            params,
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    async getCompany(companyId: number) {
        const response = await this.API.get(`/companies/${companyId}`, {
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    async deleteCompany(companyId: number) {
        return await this.API.delete(`/companies/${companyId}`, {
            headers: { Authorization: this.bearer },
        });
    }
}
