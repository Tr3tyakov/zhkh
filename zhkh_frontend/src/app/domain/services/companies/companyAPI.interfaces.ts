import { AxiosResponse } from 'axios';

interface IBaseCompany {
    /** Название УК */
    name: string;

    /** Форма организации (ООО, АО) */
    legalForm?: string;

    /** ИНН */
    inn?: string;

    /** Юридический адрес */
    address?: string;

    /** Телефон */
    phone?: string;

    /** Почта */
    email?: string;

    /** Сайт */
    website?: string;
}

interface IResponseCompanyData extends IBaseCompany {
    id: number;
}

interface ICreateCompanyData extends IBaseCompany {}

interface IUpdateCompanyData extends IBaseCompany {}

interface IGetCompaniesData {
    companies: IResponseCompanyData[];
    total: number;
}

interface ICompanyAPI {
    getCompany: (companyId: number) => Promise<IResponseCompanyData>;
    getCompanies: (
        offset: number,
        limit: number,
        searchValue?: string
    ) => Promise<IGetCompaniesData>;
    createCompany: (userId: number, data: ICreateCompanyData) => Promise<AxiosResponse>;
    updateCompany: (companyId: number, data: IUpdateCompanyData) => Promise<AxiosResponse>;
    deleteCompany: (companyId: number) => Promise<AxiosResponse>;
}

export type {
    ICompanyAPI,
    ICreateCompanyData,
    IResponseCompanyData,
    IUpdateCompanyData,
    IBaseCompany,
};
