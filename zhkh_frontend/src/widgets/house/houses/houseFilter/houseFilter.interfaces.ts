import { Dispatch, SetStateAction } from 'react';
import { IHouse } from '../../../../app/domain/services/houses/houseAPI.interfaces';

interface IHousesFilter {
    setSearchValue: Dispatch<SetStateAction<string>>;
    isLoading: boolean;
    setPage: Dispatch<SetStateAction<number>>;
    filters: IHouseFiltersState;
    setFilters: Dispatch<SetStateAction<IHouseFiltersState>>;
}

interface IHouseFiltersState extends IHouse {
    region?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    commissioningYearFrom?: number;
    commissioningYearTo?: number;
    floorsCountFrom?: number;
    floorsCountTo?: number;
    houseType?: string[];
    wallMaterial?: string[];
    ventilationType?: string[];
    isEmergency?: boolean;
    managingCompany?: string;
}

export type { IHousesFilter, IHouseFiltersState };
