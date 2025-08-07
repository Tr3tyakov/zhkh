import { IHouseResponse } from '../../../app/domain/services/houses/houseAPI.interfaces.ts';

interface IHouseInformation {
    data: IHouseResponse;
}

interface IHouseTableInformation {
    title: string;
    value: string | number;
}

export type { IHouseInformation, IHouseTableInformation };
