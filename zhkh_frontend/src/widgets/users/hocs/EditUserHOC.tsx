import { UpdateUserValidationSchema } from '../../../pages/users/user.validation.ts';
import {
    ICreateUserData,
    IUpdateUserData,
    IUserAPI,
} from '../../../app/domain/services/users/userAPI.interfaces.ts';
import { getErrorLog, getErrorMessage } from '../../../shared/api/base.ts';
import { trimObjectStrings } from '../../../shared/common/trimValues.ts';
import React, { useEffect, useState } from 'react';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import { UserAPIKey } from '../../../app/domain/services/users/key.ts';
import { useUser } from '../../../app/domain/hooks/useUser/useUser.ts';
import { useParams } from 'react-router-dom';
import { IUserForm } from '../form/userForm.interfaces.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../../app/infrastructures/enums/auditLog.ts';
import { IAuditLogAPI } from '../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../../app/domain/services/auditLogs/key.ts';
import { getChangedFields } from '../../../shared/common/getChangedFields.ts';
import { handleError } from '../../../shared/common/handlerError.ts';

export const UpdateUserHOC = (FormComponent: React.FC<IUserForm<IUpdateUserData>>) => {
    const WrappedComponent: React.FC = () => {
        const { id } = useParams<{ id?: string }>();
        const { user, setupUser } = useUser();
        const [isLoading, setIsLoading] = useState(true);
        const [initialValues, setInitialValues] = useState<IUpdateUserData | null>(null);

        const userAPI = useInjection<IUserAPI>(UserAPIKey);
        const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);

        const { openSnackbar } = useEnqueueSnackbar();

        useEffect(() => {
            if (!id) return;

            if (user?.id === Number(id)) {
                setInitialValues({ ...user, password: '' });
                setIsLoading(false);
                return;
            }

            const fetchUser = async () => {
                try {
                    const user = await userAPI.getUserById(Number(id));
                    setInitialValues({ password: '', ...user });
                } catch (e) {
                    handleError(e, openSnackbar);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchUser();
        }, [id, user?.id]);

        const handleSubmit = async (values: ICreateUserData) => {
            const description = `Редактирование пользователя пользователем ${user?.id} с идентификатором ${id}. Изменения: ${getChangedFields(values, initialValues!)}`;
            setIsLoading(true);

            try {
                const data = trimObjectStrings(values);
                await userAPI.updateUser(Number(id), data);
                openSnackbar({
                    message: 'Пользователь успешно обновлён',
                    variant: 'default',
                });

                await auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.EDIT,
                    entityType: EntityTypeEnum.USER,
                    description: description,
                    actionResult: 'Успешно',
                    objectId: Number(id),
                });
            } catch (e) {
                const message = getErrorMessage(e);
                openSnackbar({
                    message: message,
                    variant: 'default',
                });

                await auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.EDIT,
                    entityType: EntityTypeEnum.USER,
                    description: description,
                    actionResult: message,
                    logMetadata: JSON.stringify(getErrorLog(e)),
                    objectId: Number(id),
                });
            } finally {
                setIsLoading(false);
            }
        };

        const setupCurrentUser = (data: IUpdateUserData) => {
            setInitialValues(data);
            if (user?.id === Number(id)) {
                return setupUser({ ...user, filePath: data.filePath });
            }
        };

        if (!initialValues) return null;

        return (
            <FormComponent
                initialValues={initialValues}
                isLoading={isLoading}
                title="Редактирование пользователя"
                onSubmit={handleSubmit}
                isEdit={true}
                setupUser={setupCurrentUser}
                userValidationSchema={UpdateUserValidationSchema}
            />
        );
    };

    return WrappedComponent;
};
