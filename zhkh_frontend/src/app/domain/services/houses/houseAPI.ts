import {
    ICreateHouseData,
    IHouseAPI,
    IHouseQueryParams,
    IUpdateHouseData,
} from './houseAPI.interfaces.ts';
import { inject, injectable } from 'tsyringe';
import { DefaultAPI } from '../baseAPI.ts';
import { CookieServiceKey } from '../../cookie/key.ts';
import type { ICookieService } from '../../cookie/cookieService.interfaces.ts';
import { IHouseFiltersState } from '../../../../widgets/house/houses/houseFilter/houseFilter.interfaces.ts';
import qs from 'qs';

@injectable()
export class HouseAPI extends DefaultAPI implements IHouseAPI {
    constructor(@inject(CookieServiceKey) cookieService: ICookieService) {
        // Инициализация родительского класса с передачей сервиса куки
        super(cookieService);
    }

    /**
     * Создание нового дома
     * @param data - Данные для создания дома
     */
    async createHouse(data: ICreateHouseData) {
        return await this.API.post('/house', data, {
            headers: { Authorization: this.bearer },
        });
    }

    /**
     * Обновление данных дома по ID
     * @param houseId - Идентификатор дома
     * @param data - Обновлённые данные
     */
    async updateHouse(houseId: number, data: IUpdateHouseData) {
        return await this.API.put(`/houses/${houseId}`, data, {
            headers: { Authorization: this.bearer },
        });
    }

    /**
     * Обновление данных дома по ID
     * @param housesId - Идентификатор дома
     */
    async deleteHouse(housesId: number) {
        const response = await this.API.delete(`/houses/${housesId}`, {
            headers: {
                Authorization: this.bearer,
            },
        });

        return response.data;
    }

    /**
     * Получение списка домов с пагинацией и поиском
     * @param limit - Количество элементов на странице
     * @param offset - Смещение
     * @param filters - Фильтры
     * @param query - Квери параметры
     */
    async getHouses(
        limit: number,
        offset: number,
        filters: IHouseFiltersState,
        query: IHouseQueryParams
    ) {
        const params = {
            limit,
            offset,
            ...filters,
            ...query,
        };

        const response = await this.API.get('/houses', {
            params,
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    /**
     * Получение списка полей дома
     */
    async getHouseFields() {
        const response = await this.API.get(`/house/fields`, {
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    /**
     * Получение информации о доме по ID
     * @param houseId - Идентификатор дома
     */
    async getHouseInformation(houseId: number) {
        const response = await this.API.get(`/houses/${houseId}`, {
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    /**
     * Привязка дома к компании
     * @param houseId - ID дома
     * @param companyId - ID компании
     */
    async attachToCompany(houseId: number, companyId: number) {
        return await this.API.post(
            `/house/attach`,
            {
                houseId,
                companyId,
            },
            {
                headers: { Authorization: this.bearer },
            }
        );
    }

    /**
     * Отвязка дома от компании
     * @param houseId - ID дома
     * @param companyId - ID компании
     */
    async untieFromCompany(houseId: number, companyId: number) {
        return await this.API.post(
            `/house/untie`,
            {
                houseId,
                companyId,
            },
            {
                headers: { Authorization: this.bearer },
            }
        );
    }

    /**
     * Получение списка домов, привязанных к конкретной компании
     * @param companyId - ID компании
     * @param limit - Кол-во элементов
     * @param offset - Смещение
     * @param searchValue - Поиск (необязателен)
     */
    async getAttachedHouses(
        companyId: number,
        limit: number,
        offset: number,
        searchValue?: string
    ) {
        const params = {
            limit,
            offset,
            companyId,
            ...(searchValue ? { search: searchValue } : {}),
        };

        const response = await this.API.get(`/houses/attached/${companyId}`, {
            params,
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    async getRegions() {
        const response = await this.API.get(`/regions`, {
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    async getCities() {
        const response = await this.API.get(`/cities`, {
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    async getUnattachedHouses() {
        const response = await this.API.get(`/houses-unattached`, {
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }
}
