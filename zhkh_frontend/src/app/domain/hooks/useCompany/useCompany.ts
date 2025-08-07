import { useContext } from 'react';
import { CompanyContext } from '../../../../pages/company/currentCompany/context/companyContext.ts';

export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error('Отсутствует контекст компании');
    }
    return context;
};
