import { HouseFileSchema } from '../../../../../app/domain/services/users/userAPI.interfaces.ts';
import { FileCategoryEnum } from '../../../../../app/infrastructures/enums/house.ts';

interface IHouseFileCategory {
    title: string;
    files: HouseFileSchema[];
    categoryKey: FileCategoryEnum;
    houseId: number;
    onRefresh: () => void;
}

export type { IHouseFileCategory };
