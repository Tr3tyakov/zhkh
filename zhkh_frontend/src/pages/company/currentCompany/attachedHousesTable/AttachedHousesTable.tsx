import React, { useState } from 'react';
import { useEnqueueSnackbar } from '../../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { getErrorLog, getErrorMessage } from '../../../../shared/api/base.ts';
import {
    IHouseAPI,
    IHouseResponse,
} from '../../../../app/domain/services/houses/houseAPI.interfaces.ts';
import { useInjection } from '../../../../app/domain/hooks/useInjection.ts';
import { HouseAPIKey } from '../../../../app/domain/services/houses/key.ts';
import { PageFilter } from '../../../../widgets/page/pageFilter/PageFilter.tsx';
import { PageTable } from '../../../../widgets/page/pageTable/PageTable.tsx';
import { houseTableHeads } from '../../../house/houses/housePage.constants.ts';
import { BodyTableCell } from '../../../../app/domain/components/BodyTableCell.tsx';
import { IAttachedHousesTable } from './attachedHousesTable.interfaces.ts';
import { IMenuData } from '../../../../app/domain/hooks/useContextMenu/useContextMenu.interfaces.ts';
import { useNavigate } from 'react-router-dom';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LinkOffRoundedIcon from '@mui/icons-material/LinkOffRounded';
import { useContextMenu } from '../../../../app/domain/hooks/useContextMenu/useContextMenu.ts';
import { LoadingProgress } from '../../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { useCompany } from '../../../../app/domain/hooks/useCompany/useCompany.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../../../app/infrastructures/enums/auditLog.ts';
import { useUser } from '../../../../app/domain/hooks/useUser/useUser.ts';
import { IAuditLogAPI } from '../../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../../../app/domain/services/auditLogs/key.ts';

export const AttachedHousesTable: React.FC<IAttachedHousesTable> = ({ companyId }) => {
    const { fetchAttachedHouses, usePageData } = useCompany();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openSnackbar } = useEnqueueSnackbar();
    const navigate = useNavigate();
    const contextMenuData = useContextMenu();
    const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);
    const { user } = useUser();

    const untie = async (house: IHouseResponse) => {
        const description = `Отвязка жилого фонда с идентификатором ${house.id} от компании c идентификатором ${companyId} пользователем с идентификатором ${user?.id}`;

        setIsLoading(true);
        try {
            await houseAPI.untieFromCompany(house.id, companyId);
            await Promise.all([
                fetchAttachedHouses(usePageData.filters.searchValue, 1),
                auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.UNTIE,
                    entityType: EntityTypeEnum.COMPANY,
                    description: description,
                    actionResult: 'Успешно',
                    objectId: house.id,
                }),
            ]);
            openSnackbar({
                message: 'Жилой фонд успешно отвязан',
                variant: 'default',
            });
        } catch (e) {
            const message = getErrorMessage(e);
            openSnackbar({
                message: message,
                variant: 'default',
            });
            await auditLogAPI.createAuditLog({
                userId: user?.id,
                logType: AuditLogEnum.UNTIE,
                entityType: EntityTypeEnum.COMPANY,

                description: description,
                actionResult: message,
                logMetadata: JSON.stringify(getErrorLog(e)),
                objectId: house.id,
            });
        } finally {
            setIsLoading(false);
            contextMenuData.handleClose();
        }
    };

    const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);

    const menuData: IMenuData[] = [
        {
            title: 'Редактировать',
            function: (house) => navigate(`/houses/edit-house/${house.id}`),
            icon: (
                <LoadingProgress
                    isLoading={isLoading}
                    value={<EditRoundedIcon fontSize="small" color="disabled" />}
                />
            ),
            disabled: isLoading,
        },
        {
            title: 'Отвязать',
            function: untie,
            icon: (
                <LoadingProgress
                    isLoading={isLoading}
                    value={<LinkOffRoundedIcon fontSize="small" color="disabled" />}
                />
            ),
            disabled: isLoading,
        },
    ];

    return (
        <>
            <PageFilter {...usePageData} isLoading={isLoading} label="Поиск дома по адресу" />
            <PageTable
                {...usePageData}
                isLoading={isLoading}
                heads={houseTableHeads}
                bodyPath="/houses"
                menuData={menuData}
                contextMenuData={contextMenuData}
                renderBody={(house: IHouseResponse) => (
                    <React.Fragment key={house.id}>
                        <BodyTableCell>{house.id}</BodyTableCell>
                        <BodyTableCell>{`${house.region}, ${house.city}, ${house.street}, д. ${house.houseNumber}`}</BodyTableCell>
                        <BodyTableCell>{house.commissioningYear}</BodyTableCell>
                        <BodyTableCell>{house.maxFloorsCount}</BodyTableCell>
                        <BodyTableCell>{house.totalArea}</BodyTableCell>
                    </React.Fragment>
                )}
            />
        </>
    );
};
