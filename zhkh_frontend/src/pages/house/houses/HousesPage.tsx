import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import { getErrorLog, getErrorMessage } from '../../../shared/api/base.ts';
import {
    IHouseAPI,
    IHouseResponse,
} from '../../../app/domain/services/houses/houseAPI.interfaces.ts';
import { HouseAPIKey } from '../../../app/domain/services/houses/key.ts';
import { ROWS_PER_PAGE } from '../../../widgets/house/houses/houses.constants.ts';
import { PageHeader } from '../../../widgets/page/pageHeader/pageHeader.tsx';
import { PageTable } from '../../../widgets/page/pageTable/PageTable.tsx';
import { BodyTableCell } from '../../../app/domain/components/BodyTableCell.tsx';
import { houseTableHeads } from './housePage.constants.ts';
import { usePage } from '../../../app/domain/hooks/usePage/usePage.ts';
import { IMenuData } from '../../../app/domain/hooks/useContextMenu/useContextMenu.interfaces.ts';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContextMenu } from '../../../app/domain/hooks/useContextMenu/useContextMenu.ts';
import { LoadingProgress } from '../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useUser } from '../../../app/domain/hooks/useUser/useUser.ts';
import { IAuditLogAPI } from '../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../../app/domain/services/auditLogs/key.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../../app/infrastructures/enums/auditLog.ts';
import { IHouseFiltersState } from '../../../widgets/house/houses/houseFilter/houseFilter.interfaces.ts';
import houseFilterState from '../../../widgets/house/houses/houseFilter/houseFilter.constants.ts';
import { HouseFilter } from '../../../widgets/house/houses/houseFilter/HouseFilter.tsx';
import { handleError } from '../../../shared/common/handlerError.ts';

export const HousesPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openSnackbar } = useEnqueueSnackbar();
    const contextMenuData = useContextMenu();
    const { user } = useUser();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const fetchHouses = async (filter: IHouseFiltersState, page: number) => {
        setIsLoading(true);
        try {
            const safePage = Math.max(page, 1); // защита от 0 или < 0
            const offset = (safePage - 1) * ROWS_PER_PAGE;
            const data = await houseAPI.getHouses(10, offset, filter, {
                region: searchParams.get('regions'),
                city: searchParams.get('city'),
            });
            usePageData.changeData(data.houses, data.total);
        } catch (e) {
            handleError(e, openSnackbar);
        } finally {
            setIsLoading(false);
        }
    };
    const usePageData = usePage<IHouseResponse, IHouseFiltersState>(fetchHouses, houseFilterState);

    const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);
    const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);

    const deleteHouse = async (house: IHouseResponse) => {
        const description = `Удаление жилого фонда c идентификатором ${house.id} пользователем с идентификатором ${user?.id}`;

        try {
            setIsLoading(true);
            await houseAPI.deleteHouse(house!.id);
            await usePageData.handlePageChange(1);

            await Promise.all([
                await fetchHouses(usePageData.filters, 1),
                auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.DELETE,
                    entityType: EntityTypeEnum.HOUSE,
                    description: description,
                    actionResult: 'Успешно',
                    objectId: house!.id,
                }),
            ]);
        } catch (e) {
            const message = getErrorMessage(e);
            openSnackbar({
                message: message,
                variant: 'default',
            });
            await auditLogAPI.createAuditLog({
                userId: user?.id,
                logType: AuditLogEnum.DELETE,
                entityType: EntityTypeEnum.HOUSE,
                description: description,
                actionResult: message,
                logMetadata: JSON.stringify(getErrorLog(e)),
                objectId: house!.id,
            });
        } finally {
            setIsLoading(false);
            contextMenuData.handleClose();
        }
    };
    const menuData: IMenuData[] = [
        {
            title: 'Редактировать',
            function: (house) => navigate(`/houses/edit-house/${house.id}`),
            icon: <EditRoundedIcon fontSize="small" color="disabled" />,
            disabled: isLoading,
        },
        {
            title: 'Удалить',
            function: deleteHouse,
            icon: (
                <LoadingProgress
                    isLoading={isLoading}
                    value={<DeleteRoundedIcon fontSize="small" color="disabled" />}
                />
            ),
            disabled: isLoading,
        },
    ];

    return (
        <Container maxWidth="lg">
            <PageHeader
                title="Жилой фонд"
                path="/houses/create-house"
                buttonTitle="Создать жилой фонд"
                body="Сервис содержит информацию о домах. Введите адрес дома в поисковую строку, чтобы
                получить подробные сведения об объекте: текущее состояние, историю изменений и
                другую важную информацию."
            />
            <HouseFilter {...usePageData} fetchHouses={fetchHouses} isLoading={isLoading} />
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
        </Container>
    );
};
