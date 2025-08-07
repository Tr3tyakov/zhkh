import { AuditLogEnum, EntityTypeEnum } from '../auditLog.ts';

export const auditLogTranslations: Record<AuditLogEnum, string> = {
    [AuditLogEnum.EDIT]: 'Редактирование',
    [AuditLogEnum.DELETE]: 'Удаление',
    [AuditLogEnum.ENTER_TO_SYSTEM]: 'Вход в систему',
    [AuditLogEnum.EXPORT_DATA]: 'Экспорт данных',
    [AuditLogEnum.CREATE]: 'Создание',
    [AuditLogEnum.ATTACH]: 'Привязка',
    [AuditLogEnum.UNTIE]: 'Отвязка',
};
export const entityTypeTranslations: Record<EntityTypeEnum, string> = {
    [EntityTypeEnum.HOUSE]: 'Дом',
    [EntityTypeEnum.COMPANY]: 'Компания',
    [EntityTypeEnum.USER]: 'Пользователь',
    [EntityTypeEnum.DATA]: 'Данные',
};
