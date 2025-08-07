import {
    IAuthorizationData,
    IChangeUserInformation,
    ICreateUserData,
    IUpdateUserData,
    IUserAPI,
} from './userAPI.interfaces.ts';
import { inject, injectable } from 'tsyringe';
import { DefaultAPI } from '../baseAPI.ts';
import { CookieServiceKey } from '../../cookie/key.ts';
import type { ICookieService } from '../../cookie/cookieService.interfaces.ts';
import { AccountStatusEnum, UserTypeEnum } from '../../../infrastructures/enums/user.ts';
import { FileCategoryEnum } from '../../../infrastructures/enums/house.ts';
import qs from 'qs';

@injectable()
export class UserAPI extends DefaultAPI implements IUserAPI {
    constructor(@inject(CookieServiceKey) cookieService: ICookieService) {
        super(cookieService);
    }

    async createUser(data: ICreateUserData) {
        return await this.API.post('/registration', data);
    }

    async updateUser(userId: number, data: IUpdateUserData) {
        return await this.API.put(`/user/${userId}`, data, {
            headers: {
                Authorization: this.bearer,
            },
        });
    }

    async authorization(data: IAuthorizationData) {
        const response = await this.API.post('/authorization', data, {
            withCredentials: true,
        });

        return response.data;
    }

    async getUserInformation() {
        const response = await this.API.get('/user', {
            headers: {
                Authorization: this.bearer,
            },
        });
        return response.data;
    }

    async changeUserInformation(data: IChangeUserInformation) {
        const response = await this.API.put('/user', data, {
            headers: {
                Authorization: this.bearer,
            },
        });

        return response.data;
    }

    async uploadAvatar(userId: number, file: File) {
        const data = new FormData();
        data.append('file', file);

        const response = await this.API.patch(`/users/${userId}/avatar`, data, {
            headers: {
                Authorization: this.bearer,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }

    async getUsers(limit: number, offset: number, filters: any) {
        const params = {
            limit,
            offset,
            ...filters,
        };

        const response = await this.API.get(`/users`, {
            params,
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
            headers: {
                Authorization: this.bearer,
            },
        });

        return response.data;
    }

    async getUserById(userId: number) {
        const response = await this.API.get(`/users/${userId}`, {
            headers: {
                Authorization: this.bearer,
            },
        });

        return response.data;
    }

    async deleteAccount(id: number) {
        const response = await this.API.delete(`/users/${id}`, {
            headers: {
                Authorization: this.bearer,
            },
        });

        return response.data;
    }

    async changeAccountStatus(id: number, accountStatus: AccountStatusEnum) {
        const response = await this.API.post(
            `/users/${id}/account_status`,
            {
                accountStatus,
            },
            {
                headers: {
                    Authorization: this.bearer,
                },
            }
        );

        return response.data;
    }

    async changeUserType(id: number, userType: UserTypeEnum) {
        const response = await this.API.post(
            `/users/${id}/user_type`,
            { userType },
            {
                headers: {
                    Authorization: this.bearer,
                },
            }
        );

        return response.data;
    }

    async getHouseFiles(id: number) {
        const response = await this.API.get(`/houses/${id}/house_files`, {
            headers: {
                Authorization: this.bearer,
            },
        });

        return response.data;
    }

    async uploadHouseFile(id: number, file: File, category: FileCategoryEnum) {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('categoryType', category);

        const response = await this.API.post(`/houses/${id}/house_files`, formData, {
            headers: {
                Authorization: this.bearer,
            },
        });

        return response.data;
    }

    async deleteHouseFile(fileId: number) {
        const response = await this.API.delete(`/house_files/${fileId}`, {
            headers: {
                Authorization: this.bearer,
            },
        });

        return response.data;
    }
}
