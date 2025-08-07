import { AuditLogEnum, EntityTypeEnum } from '../../../infrastructures/enums/auditLog.ts';
import { IUserTableResponse } from '../users/userAPI.interfaces.ts';

interface IAuditLogBase {
    userId?: number;
    logType: AuditLogEnum;
    entityType: EntityTypeEnum;
    objectId?: number | null;
    description: string;
    objectType?: string;
    actionResult?: string;
    logMetadata?: string | JSON;
}

interface ICreateAuditLog extends IAuditLogBase {}

interface IGetLogsParams {
    limit?: number;
    offset?: number;
    description?: string;
    entityType?: string;
    startDatetime?: string | Date;
    endDatetime?: string | Date;
    findUserId?: number;
    logType?: string;
    search?: string;
}

interface IAuditLogItem {
    id: number;
    userId: number;
    logType: AuditLogEnum;
    entityType: EntityTypeEnum;
    objectId?: number;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
    actionResult?: string;
    logMetadata?: string;
    createdAt: string;
    user: IUserTableResponse;
}

interface IAuditLogResponse {
    logs: IAuditLogItem[];
    total: number;
}

interface IAuditLogAPI {
    createAuditLog: (data: ICreateAuditLog) => Promise<string>;
    getLogs: (params?: IGetLogsParams) => Promise<IAuditLogResponse>;
}

export type { IAuditLogAPI, ICreateAuditLog, IAuditLogResponse, IAuditLogItem };
