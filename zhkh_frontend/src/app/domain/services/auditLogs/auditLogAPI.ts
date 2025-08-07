import { IAuditLogAPI, ICreateAuditLog } from './auditLogAPI.interfaces.ts';
import { inject, injectable } from 'tsyringe';
import { DefaultAPI } from '../baseAPI.ts';
import { CookieServiceKey } from '../../cookie/key.ts';
import type { ICookieService } from '../../cookie/cookieService.interfaces.ts';
import axios from 'axios';

@injectable()
export class AuditLogAPI extends DefaultAPI implements IAuditLogAPI {
    private ipAddress: string | null;

    constructor(@inject(CookieServiceKey) cookieService: ICookieService) {
        super(cookieService);
        this.initIpAddress();
        this.ipAddress = null;
    }

    private async initIpAddress() {
        try {
            const ipifyResponse = await axios.get('https://api.ipify.org?format=json');
            this.ipAddress = ipifyResponse.data.ip;
        } catch (error) {
            console.warn('Ошибка получения IP-адреса', error);
            this.ipAddress = null;
        }
    }

    /**
     * Создание лога
     */
    async createAuditLog(data: ICreateAuditLog) {
        const auditData = {
            ...data,
            userAgent: navigator.userAgent,
            ipAddress: this.ipAddress,
        };
        const response = await this.API.post('/audit_log', auditData, {
            headers: { Authorization: this.bearer },
        });

        return response.data;
    }

    async getLogs({
        limit = 10,
        offset = 0,
        description,
        entityType,
        startDatetime,
        endDatetime,
        findUserId,
        logType,
        searchValue,
    } = {}) {
        const params = {
            limit,
            offset,
            ...(description && { description }),
            ...(entityType && { entityType }),
            ...(startDatetime && { startDatetime }),
            ...(endDatetime && { endDatetime }),
            ...(findUserId && { findUserId }),
            ...(logType && { logType }),
            ...(searchValue && { search: searchValue }),
        };
        const response = await this.API.get('/audit_log', {
            params,
            headers: {
                Authorization: this.bearer,
            },
        });

        return response.data;
    }
}
