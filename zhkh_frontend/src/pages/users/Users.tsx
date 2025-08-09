import React, { useState } from 'react';
import { Container } from '@mui/material';
import {
    IUserAPI,
    IUserTableResponse,
} from '../../app/domain/services/users/userAPI.interfaces.ts';
import { UserAPIKey } from '../../app/domain/services/users/key.ts';
import { useEnqueueSnackbar } from '../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { ROWS_PER_PAGE } from '../../widgets/house/houses/houses.constants.ts';
import { getErrorLog, getErrorMessage } from '../../shared/api/base.ts';
import { usePage } from '../../app/domain/hooks/usePage/usePage.ts';
import { useInjection } from '../../app/domain/hooks/useInjection.ts';
import { PageHeader } from '../../widgets/page/pageHeader/pageHeader.tsx';
import { PageTable } from '../../widgets/page/pageTable/PageTable.tsx';
import { AccountStatusEnum, UserTypeEnum } from '../../app/infrastructures/enums/user.ts';
import { LoadingProgress } from '../../shared/loading/loadingProgress/LoadingProgress.tsx';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { BodyTableCell } from '../../app/domain/components/BodyTableCell.tsx';
import { IMenuData } from '../../shared/menu/menuBar.interfaces.ts';
import { useContextMenu } from '../../app/domain/hooks/useContextMenu/useContextMenu.ts';
import { userTableHeads } from './users.constants.ts';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useNavigate } from 'react-router-dom';
import { IAuditLogAPI } from '../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../app/domain/services/auditLogs/key.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../app/infrastructures/enums/auditLog.ts';
import { useUser } from '../../app/domain/hooks/useUser/useUser.ts';
import { DefaultSearchFilter } from '../../app/domain/hooks/usePage/usePage.interfaces.ts';
import { UserFilter } from '../../widgets/users/filters/UserFilter.tsx';
import { handleError } from '../../shared/common/handlerError.ts';
import { translateEnum } from '../../app/infrastructures/enums/translate.ts';
import { accountStatusTranslations, userTypeTranslations } from '../../app/infrastructures/enums/translation/user.ts';

const DefaultFilterState = {
    searchValue: '',
    userType: [],
    accountStatus: [],
};

export const UsersPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openSnackbar } = useEnqueueSnackbar();
    const contextMenuData = useContextMenu();
    const navigate = useNavigate();
    const { user } = useUser();

    const fetchUsers = async (filters: DefaultSearchFilter, page: number) => {
        setIsLoading(true);
        try {
            const safePage = Math.max(page, 1); // защита от 0 или < 0
            const offset = (safePage - 1) * ROWS_PER_PAGE;
            const data = await userAPI.getUsers(10, offset, filters);
            usePageData.changeData(data.users, data.total);
        } catch (e) {
                    handleError(e, openSnackbar);
        } finally {
            setIsLoading(false);
        }
    };
    const usePageData = usePage<IUserTableResponse, DefaultSearchFilter>(
        fetchUsers,
        DefaultFilterState
    );
    const userAPI = useInjection<IUserAPI>(UserAPIKey);
    const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);

    const deleteAccount = async (userToDelete: IUserTableResponse) => {
        const description = `Удаление пользователя с идентификатором ${userToDelete!.id}`;
        try {
            setIsLoading(true);
            await userAPI.deleteAccount(userToDelete!.id);
            usePageData.handlePageChange(1);

            await Promise.all([
                fetchUsers(usePageData.filters, 1),
                // Создание лога
                auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.DELETE,
                    entityType: EntityTypeEnum.USER,
                    description: description,
                    actionResult: 'Успешно',
                    objectId: userToDelete!.id,
                }),
            ]);
        } catch (e) {
            const message = getErrorMessage(e);
            openSnackbar({
                message: message,
                variant: 'default',
            });

            // Создание лога
            await auditLogAPI.createAuditLog({
                userId: user?.id,
                logType: AuditLogEnum.DELETE,
                entityType: EntityTypeEnum.USER,
                objectId: userToDelete!.id,
                description: description,
                actionResult: message,
                logMetadata: JSON.stringify(getErrorLog(e)),
            });
        } finally {
            setIsLoading(false);
            contextMenuData.handleClose();
        }
    };
    const handleAccountStatus = async (userToChange: IUserTableResponse) => {
        const accountStatus =
            userToChange!.accountStatus === AccountStatusEnum.ACTIVE
                ? AccountStatusEnum.BLOCKED
                : AccountStatusEnum.ACTIVE;
        const description = `Изменение статуса аккаунта с идентификатором ${userToChange!.id} с ${userToChange!.accountStatus} на ${accountStatus}`;

        try {
            setIsLoading(true);
            await userAPI.changeAccountStatus(userToChange!.id, accountStatus);
            await Promise.all([
                fetchUsers(usePageData.filters, 1),
                // Создание лога
                auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.EDIT,
                    entityType: EntityTypeEnum.USER,
                    objectId: userToChange!.id,
                    description: description,
                }),
            ]);
        } catch (e) {
            const message = getErrorMessage(e);
            openSnackbar({
                message: message,
                variant: 'default',
            });

            // Создание лога
            await auditLogAPI.createAuditLog({
                userId: user?.id,
                logType: AuditLogEnum.EDIT,
                entityType: EntityTypeEnum.USER,

                description: description,
                objectId: userToChange!.id,
                actionResult: message,
                logMetadata: JSON.stringify(getErrorLog(e)),
            });
        } finally {
            setIsLoading(false);
            contextMenuData.handleClose();
        }
    };
    const handleUserType = async (userToChange: IUserTableResponse) => {
        const userType =
            user!.userType === UserTypeEnum.USER ? UserTypeEnum.ADMIN : UserTypeEnum.USER;
        const description = `Изменение типа аккаунта с идентификатором ${userToChange!.id} с ${userToChange!.userType} на ${userType}`;
        try {
            setIsLoading(true);
            await userAPI.changeUserType(userToChange!.id, userType);
            await Promise.all([
                fetchUsers(usePageData.filters, 1),
                // Создание лога
                auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.EDIT,
                    entityType: EntityTypeEnum.USER,
                    description: description,
                    objectId: userToChange!.id,
                }),
            ]);
        } catch (e) {
            const message = getErrorMessage(e);
            openSnackbar({
                message: message,
                variant: 'default',
            });

            // Создание лога
            await auditLogAPI.createAuditLog({
                userId: user?.id,
                logType: AuditLogEnum.EDIT,
                entityType: EntityTypeEnum.USER,
                description: description,
                actionResult: message,
                objectId: userToChange!.id,
                logMetadata: JSON.stringify(getErrorLog(e)),
            });
        } finally {
            setIsLoading(false);
            contextMenuData.handleClose();
        }
    };

    const menuData: IMenuData<IUserTableResponse>[] = [
        {
            title: 'Редактировать',
            function: (user) => navigate(`/users/edit-user/${user.id}`),
            icon: (
                <LoadingProgress
                    isLoading={isLoading}
                    value={<EditRoundedIcon fontSize="small" color="disabled" />}
                />
            ),
            disabled: isLoading,
        },
        {
            title: 'Удалить',
            function: deleteAccount,
            icon: (
                <LoadingProgress
                    isLoading={isLoading}
                    value={<DeleteRoundedIcon fontSize="small" color="disabled" />}
                />
            ),
            disabled: isLoading,
        },
        {
            title: (user) =>
                user.accountStatus === AccountStatusEnum.ACTIVE
                    ? 'Заблокировать'
                    : 'Разблокировать',
            function: handleAccountStatus,
            icon: (
                <LoadingProgress
                    isLoading={isLoading}
                    value={<BlockRoundedIcon fontSize="small" color="disabled" />}
                />
            ),
            disabled: isLoading,
        },
        {
            title: (user) =>
                user.userType === UserTypeEnum.USER
                    ? 'Сделать администратором'
                    : 'Сделать пользователем',
            function: (user) => {
                console.log(user);
                handleUserType(user);
            },
            icon: (
                <LoadingProgress
                    isLoading={isLoading}
                    value={<SupervisorAccountRoundedIcon fontSize="small" color="disabled" />}
                />
            ),
            disabled: isLoading,
        },
    ];

    return (
        <Container maxWidth="lg">
            <PageHeader
                title="Пользователи"
                path="/users/create-user"
                buttonTitle="Создать пользователя"
                body="Введите имя или электронную почту пользователя в поисковую строку, чтобы получить подробные сведения: имя, роль в системе и другую важную информацию."
            />
            <UserFilter
                {...usePageData}
                isLoading={isLoading}
                label="Поиск пользователи по имени"
            />
            <PageTable
                {...usePageData}
                isLoading={isLoading}
                heads={userTableHeads}
                bodyPath="/users/edit-user"
                menuData={menuData}
                contextMenuData={contextMenuData}
                renderBody={(user: IUserTableResponse) => (
                    <React.Fragment key={user.id}>
                        <BodyTableCell>{user.id}</BodyTableCell>
                        <BodyTableCell>{user.firstName}</BodyTableCell>
                        <BodyTableCell>{user.email}</BodyTableCell>
                        <BodyTableCell>{translateEnum(user.accountStatus, accountStatusTranslations)}</BodyTableCell>
                        <BodyTableCell>{translateEnum(user.userType, userTypeTranslations)}</BodyTableCell>
                    </React.Fragment>
                )}
            />
        </Container>
    );
};
