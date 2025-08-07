import { Box, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { translateEnum } from '../../../../app/infrastructures/enums/translate.ts';
import {
    auditLogTranslations,
    entityTypeTranslations,
} from '../../../../app/infrastructures/enums/translation/auditLog.ts';
import { IAuditLogItem } from '../../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import {
    accountStatusTranslations,
    userTypeTranslations,
} from '../../../../app/infrastructures/enums/translation/user.ts';

export const LogTooltip = ({
    log,
    children,
}: {
    log: IAuditLogItem;
    children: React.ReactElement;
}) => {
    const auditLogTranslate = translateEnum(log.logType, auditLogTranslations);
    const entityTypeTranslate = translateEnum(log.entityType, entityTypeTranslations);
    const accountStatusTranslate = translateEnum(log.user.accountStatus, accountStatusTranslations);
    const userTypeTranslate = translateEnum(log.user.userType, userTypeTranslations);
    return (
        <Tooltip
            title={
                <Box>
                    <Typography variant="body2" fontSize="16px">
                        <strong>Лог</strong>
                    </Typography>
                    <Box p="2px 10px">
                        <Typography variant="body2">
                            <strong>Тип:</strong> {auditLogTranslate}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Объект:</strong> {entityTypeTranslate}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Дата:</strong> {log.createdAt}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Описание:</strong> {log.description}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Описание:</strong> {log.actionResult}
                        </Typography>
                        <Typography variant="body2">
                            <strong>IP-адрес:</strong> {log.ipAddress}
                        </Typography>
                        <Typography variant="body2">
                            <strong>UserAgent:</strong> {log.userAgent}
                        </Typography>
                    </Box>

                    <Typography mt="10px" variant="body2" fontSize="16px">
                        <strong>Пользователь</strong>
                    </Typography>
                    <Box p="2px 10px">
                        <Typography variant="body2">
                            <strong>ID:</strong> {log.user.id}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Имя:</strong> {log.user.firstName}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Почта:</strong> {log.user.email}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Статус аккаунта:</strong> {accountStatusTranslate}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Тип аккаунта:</strong> {userTypeTranslate}
                        </Typography>
                    </Box>
                </Box>
            }
            placement="top"
            arrow
        >
            {children}
        </Tooltip>
    );
};
