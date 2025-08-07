import { AuditLogEnum, EntityTypeEnum } from '../../../../app/infrastructures/enums/auditLog.ts';
import React from 'react';

interface AuditLogFilters {
    searchValue?: string;
    logType?: AuditLogEnum;
    entityType?: EntityTypeEnum;
    findUserId?: number;
    startDatetime?: string;
    endDatetime?: string;
}

interface AuditLogsPageFilterProps {
    filters: AuditLogFilters;
    setFilters: React.Dispatch<React.SetStateAction<AuditLogFilters>>;
    isLoading: boolean;
    handlePageChange: (page: number) => void;
    label: string;
}

export type { AuditLogFilters, AuditLogsPageFilterProps };
