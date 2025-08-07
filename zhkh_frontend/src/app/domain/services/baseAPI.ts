import type { ICookieService } from '../cookie/cookieService.interfaces.ts';
import { ACCESS_TOKEN } from '../../infrastructures/providers/userProvider/useUser.constants.ts';
import { API } from '../../../shared/api/base.ts';
import { AxiosInstance } from 'axios';

export class DefaultAPI {
    API: AxiosInstance;

    constructor(protected cookieService: ICookieService) {
        this.API = API;
    }

    get bearer(): string | null {
        const token = this.cookieService.getToken(ACCESS_TOKEN);
        return token ? `Bearer ${token}` : null;
    }
}
