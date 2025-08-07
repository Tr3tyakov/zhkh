import { ICreateHouseData } from '../../../app/domain/services/houses/houseAPI.interfaces.ts';

interface IHouseForm {
    initialValues: ICreateHouseData;
    isLoading: boolean;
    onSubmit: (data: ICreateHouseData) => Promise<void>;
    title: string;
}

export type { IHouseForm };
