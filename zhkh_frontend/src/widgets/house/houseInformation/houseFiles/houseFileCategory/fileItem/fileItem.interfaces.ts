import { HouseFileSchema } from '../../../../../../app/domain/services/users/userAPI.interfaces.ts';

interface IFileItem {
    file: HouseFileSchema;
    onDeleted: () => void;
}

export type { IFileItem };
