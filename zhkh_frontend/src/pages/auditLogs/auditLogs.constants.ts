import { IAuditLogFilters } from './auditLogs.interfaces.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../app/infrastructures/enums/auditLog.ts';

export const auditLogsInitialFilters: IAuditLogFilters = {
    searchValue: '',
    logType: undefined,
    findUserId: undefined,
    startDatetime: '',
    endDatetime: '',
    entityType: undefined,
};

export const auditLogOptions = [
    { label: 'Все', value: '' },
    { label: 'Редактирование', value: AuditLogEnum.EDIT },
    { label: 'Удаление', value: AuditLogEnum.DELETE },
    { label: 'Вход в систему', value: AuditLogEnum.ENTER_TO_SYSTEM },
    { label: 'Экспорт данных', value: AuditLogEnum.EXPORT_DATA },
    { label: 'Создание', value: AuditLogEnum.CREATE },
    { label: 'Прикрепление', value: AuditLogEnum.ATTACH },
    { label: 'Отвязка', value: AuditLogEnum.UNTIE },
];

export const entityTypeOptions = [
    { label: 'Все', value: '' },
    { label: 'Дом', value: EntityTypeEnum.HOUSE },
    { label: 'Компания', value: EntityTypeEnum.COMPANY },
    { label: 'Пользователь', value: EntityTypeEnum.USER },
    { label: 'Данные', value: EntityTypeEnum.DATA },
];
