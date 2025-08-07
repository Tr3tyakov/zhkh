import { ReactNode } from 'react';
import { IHouseResponse } from '../../../../app/domain/services/houses/houseAPI.interfaces.ts';
import { IUsePageResult } from '../../../../app/domain/hooks/usePage/usePage.ts';

interface CompanyContextType<S> {
    fetchAttachedHouses: (search: string, page: number) => Promise<void>;
    usePageData: IUsePageResult<IHouseResponse, S>;
    isLoading: boolean;
}

interface ICompanyProvider {
    children: ReactNode;
}

export type { CompanyContextType, ICompanyProvider };
