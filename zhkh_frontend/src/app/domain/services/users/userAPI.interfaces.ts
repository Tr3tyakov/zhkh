import { AxiosResponse } from 'axios';
import { AccountStatusEnum, UserTypeEnum } from '../../../infrastructures/enums/user.ts';
import { FileCategoryEnum } from '../../../infrastructures/enums/house.ts';

interface IUser {
    lastName: string;
    middleName: string;
    firstName: string;
    email: string;
    userType: UserTypeEnum;
    accountStatus: AccountStatusEnum;
    lastLoginDate: string;
    createdAt: string;
    privatePhone: string;
    workPhone?: string;
    filePath?: string;
}

interface IUserResponse extends IUser {
    id: number;
}

interface ICreateUserData extends Pick<IUser, 'firstName' | 'lastName' | 'middleName' | 'email'> {
    password: string;
}

interface IUpdateUserData
    extends Pick<IUser, 'firstName' | 'lastName' | 'middleName' | 'email' | 'filePath'> {
    password: string;
}

interface IAuthorizationData extends Pick<IUser, 'email'> {
    password: string;
}

interface IChangeUserInformation
    extends Pick<
        IUser,
        'firstName' | 'lastName' | 'middleName' | 'email' | 'workPhone' | 'privatePhone'
    > {}

interface IUserTableResponse
    extends Pick<
        IUserResponse,
        'id' | 'userType' | 'accountStatus' | 'firstName' | 'createdAt' | 'email'
    > {}

interface IGetUsersResponse {
    users: IUserTableResponse[];
    total: number;
}

export interface HouseFileSchema {
    id: number;
    fileName: string;
    link: string;
    createdAt: string;
}

interface IGetHouseFilesResponseSchema {
    capitalRepairProject: HouseFileSchema[];
    designDocumentation: HouseFileSchema[];
    inspectionResult: HouseFileSchema[];
    technicalPassport: HouseFileSchema[];
}

interface IUserAPI {
    createUser: (data: ICreateUserData) => Promise<AxiosResponse>;
    updateUser: (userId: number, data: IUpdateUserData) => Promise<AxiosResponse>;
    authorization: (data: IAuthorizationData) => Promise<number>;
    getUserInformation: () => Promise<IUserResponse>;
    getUsers: (limit: number, offset: number, filters: string) => Promise<IGetUsersResponse>;
    getUserById: (userId: number) => Promise<IUserResponse>;
    changeUserInformation: (data: IChangeUserInformation) => Promise<AxiosResponse>;
    uploadAvatar: (userId: number, file: File) => Promise<AxiosResponse>;
    deleteAccount: (id: number) => Promise<AxiosResponse>;
    changeUserType: (id: number, userType: UserTypeEnum) => Promise<AxiosResponse>;
    changeAccountStatus: (id: number, accountStatus: AccountStatusEnum) => Promise<AxiosResponse>;
    getHouseFiles: (id: number) => Promise<IGetHouseFilesResponseSchema>;
    uploadHouseFile: (
        houseId: number,
        file: File,
        category: FileCategoryEnum
    ) => Promise<AxiosResponse>;
    deleteHouseFile: (fileId: number) => Promise<AxiosResponse>;
}

export type {
    IUser,
    IUserResponse,
    ICreateUserData,
    IAuthorizationData,
    IChangeUserInformation,
    IUserTableResponse,
    IUserAPI,
    IUpdateUserData,
    IGetHouseFilesResponseSchema,
};
