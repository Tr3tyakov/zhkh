import React, { useState } from 'react';
import { ButtonBase, Container } from '@mui/material';
import { useEnqueueSnackbar } from '../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { ROWS_PER_PAGE } from '../../widgets/house/houses/houses.constants.ts';
import { getErrorMessage } from '../../shared/api/base.ts';
import { usePage } from '../../app/domain/hooks/usePage/usePage.ts';
import { PageHeader } from '../../widgets/page/pageHeader/pageHeader.tsx';
import { PageTable } from '../../widgets/page/pageTable/PageTable.tsx';
import { useInjection } from '../../app/domain/hooks/useInjection.ts';
import {
    IAuditLogAPI,
    IAuditLogItem,
} from '../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../app/domain/services/auditLogs/key.ts';
import { logsHead } from '../../widgets/admin/auditLogs/auditLogs.constants.ts';
import { BodyTableCell } from '../../app/domain/components/BodyTableCell.tsx';
import { auditLogsInitialFilters } from './auditLogs.constants.ts';
import { IAuditLogFilters } from './auditLogs.interfaces.ts';
import { AuditLogsPageFilter } from '../../widgets/admin/auditLogs/pageFilter/AuditLogPageFilter.tsx';
import {
    auditLogTranslations,
    entityTypeTranslations,
} from '../../app/infrastructures/enums/translation/auditLog.ts';
import { translateEnum } from '../../app/infrastructures/enums/translate.ts';
import { LogTooltip } from '../../widgets/admin/auditLogs/logTooltip/LogTooltip.tsx';
import InfoOutlineRoundedIcon from '@mui/icons-material/InfoOutlineRounded';
import { useCopy } from '../../app/domain/hooks/useCopy/useCopy.ts';
import { handleError } from '../../shared/common/handlerError.ts';

export const AuditLogsPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openSnackbar } = useEnqueueSnackbar();
    const { copy } = useCopy('Ошибка лога скопирована в буфер обмена');

    const fetchLogs = async (filters: IAuditLogFilters, page: number) => {
        setIsLoading(true);
        try {
            const safePage = Math.max(page, 1); // защита от 0 или < 0
            const offset = (safePage - 1) * ROWS_PER_PAGE;
            const data = await auditLogAPI.getLogs({ ...filters, limit: 10, offset });
            usePageData.changeData(data.logs, data.total);
        } catch (e) {
            handleError(e, openSnackbar);
        } finally {
            setIsLoading(false);
        }
    };

    const usePageData = usePage<IAuditLogItem, IAuditLogFilters>(
        fetchLogs,
        auditLogsInitialFilters
    );
    const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);

    return (
        <Container maxWidth="lg">
            <PageHeader title="Журнал действий" body="" />
            <AuditLogsPageFilter {...usePageData} isLoading={isLoading} label="Поиск лога" />
            <PageTable
                {...usePageData}
                isLoading={isLoading}
                heads={logsHead}
                renderBody={(log: IAuditLogItem) => {
                    const logTypeTranslated = translateEnum(log.logType, auditLogTranslations);
                    const entityTypeTranslated = translateEnum(
                        log.entityType,
                        entityTypeTranslations
                    );

                    return (
                        <React.Fragment key={log.id}>
                            <BodyTableCell>{log.id}</BodyTableCell>
                            <LogTooltip log={log}>
                                <BodyTableCell sx={{ cursor: 'help' }}>
                                    {logTypeTranslated}
                                </BodyTableCell>
                            </LogTooltip>
                            <BodyTableCell>{entityTypeTranslated}</BodyTableCell>
                            <BodyTableCell>{log.actionResult ?? '-'}</BodyTableCell>
                            <BodyTableCell>{log.createdAt}</BodyTableCell>
                            <BodyTableCell>
                                <LogTooltip log={log}>
                                    <ButtonBase
                                        onClick={() =>
                                            log.logMetadata &&
                                            log.logMetadata.length > 0 &&
                                            copy(log.logMetadata)
                                        }
                                        sx={{ borderRadius: 50 }}
                                    >
                                        <InfoOutlineRoundedIcon />
                                    </ButtonBase>
                                </LogTooltip>
                            </BodyTableCell>
                        </React.Fragment>
                    );
                }}
            />
        </Container>
    );
};
