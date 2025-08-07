import { FileCategoryEnum } from '../../../../../app/infrastructures/enums/house.ts';

interface IUploadFileButton {
    category: FileCategoryEnum;
    houseId: number;
    onUploadSuccess: () => void;
}

export type { IUploadFileButton };
