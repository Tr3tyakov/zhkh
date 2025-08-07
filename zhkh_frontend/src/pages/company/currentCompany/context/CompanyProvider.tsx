import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInjection } from '../../../../app/domain/hooks/useInjection.ts';
import { useEnqueueSnackbar } from '../../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { getErrorMessage } from '../../../../shared/api/base.ts';
import { CompanyContext } from './companyContext.ts';
import {
    IHouseAPI,
    IHouseResponse,
} from '../../../../app/domain/services/houses/houseAPI.interfaces.ts';
import { HouseAPIKey } from '../../../../app/domain/services/houses/key.ts';
import { ICompanyProvider } from './companyContext.interfaces.ts';
import { ROWS_PER_PAGE } from '../../../../widgets/house/houses/houses.constants.ts';
import { usePage } from '../../../../app/domain/hooks/usePage/usePage.ts';
import { DefaultSearchFilter } from '../../../../app/domain/hooks/usePage/usePage.interfaces.ts';

const CompanyProvider: React.FC<ICompanyProvider> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);
    const { companyId } = useParams<{ companyId: string }>();
    const { openSnackbar } = useEnqueueSnackbar();

    const fetchAttachedHouses = async (filter: DefaultSearchFilter, page: number) => {
        if (!companyId) return;

        setIsLoading(true);
        try {
            const safePage = Math.max(page, 1);
            const offset = (safePage - 1) * ROWS_PER_PAGE;
            const data = await houseAPI.getAttachedHouses(
                +companyId,
                10,
                offset,
                filter.searchValue
            );
            usePageData.changeData(data.houses, data.total);
        } catch (e) {
            openSnackbar({
                message: getErrorMessage(e),
                variant: 'default',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const usePageData = usePage<IHouseResponse, DefaultSearchFilter>(fetchAttachedHouses, {
        searchValue: '',
    });

    return (
        <CompanyContext.Provider value={{ fetchAttachedHouses, usePageData, isLoading }}>
            {children}
        </CompanyContext.Provider>
    );
};

export { CompanyProvider, CompanyContext };
