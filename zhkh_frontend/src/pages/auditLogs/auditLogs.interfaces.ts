import { AuditLogEnum, EntityTypeEnum } from '../../app/infrastructures/enums/auditLog.ts';

interface IAuditLogFilters {
    searchValue?: string;
    logType?: AuditLogEnum;
    entityType?: EntityTypeEnum;
    findUserId?: number;
    startDatetime?: string;
    endDatetime?: string;
}

export type { IAuditLogFilters };
