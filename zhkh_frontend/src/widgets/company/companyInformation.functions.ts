import { IResponseCompanyData } from '../../app/domain/services/companies/companyAPI.interfaces.ts';
import { ITableInformation } from '../../shared/tables/informationTable.interfaces.ts';

export const buildCompanyInformationTable = (data: IResponseCompanyData): ITableInformation[] => {
    return [
        { title: 'Название', value: data.name },
        { title: 'ИНН', value: data.inn },
        { title: 'Юридический адрес', value: data.address },
        { title: 'Телефон', value: data.phone },
        { title: 'Электронная почта', value: data.email },
        { title: 'Руководитель', value: data.legalForm },
        { title: 'Дата регистрации', value: data.website },
    ];
};
