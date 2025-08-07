import React, { useState } from 'react';
import {
    createUserInitialValues,
    CreateUserValidationSchema,
} from '../../../pages/users/user.validation.ts';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import {
    ICreateUserData,
    IUserAPI,
} from '../../../app/domain/services/users/userAPI.interfaces.ts';
import { UserAPIKey } from '../../../app/domain/services/users/key.ts';
import { getErrorLog, getErrorMessage } from '../../../shared/api/base.ts';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { trimObjectStrings } from '../../../shared/common/trimValues.ts';
import { FormikHelpers } from 'formik';
import { IUserForm } from '../form/userForm.interfaces.ts';
import { IAuditLogAPI } from '../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../../app/domain/services/auditLogs/key.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../../app/infrastructures/enums/auditLog.ts';
import { useUser } from '../../../app/domain/hooks/useUser/useUser.ts';

export const CreateUserHOC = (FormComponent: React.FC<IUserForm<ICreateUserData>>) => {
    const WrappedComponent: React.FC = () => {
        const [isLoading, setIsLoading] = useState(false);

        const userAPI = useInjection<IUserAPI>(UserAPIKey);
        const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);

        const { openSnackbar } = useEnqueueSnackbar();
        const { user } = useUser();

        const handleSubmit = async (
            values: ICreateUserData,
            formikHelpers: FormikHelpers<ICreateUserData>
        ) => {
            const description = `Создание пользователя`;
            setIsLoading(true);
            try {
                const data = trimObjectStrings(values);
                await userAPI.createUser(data);
                openSnackbar({
                    message: 'Пользователь успешно создан',
                    variant: 'default',
                });

                await auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.CREATE,
                    entityType: EntityTypeEnum.USER,
                    description: description,
                    actionResult: 'Успешно',
                });

                formikHelpers.resetForm();
            } catch (e) {
                const message = getErrorMessage(e);
                openSnackbar({
                    message: message,
                    variant: 'default',
                });

                await auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.CREATE,
                    entityType: EntityTypeEnum.USER,
                    description: description,
                    actionResult: message,
                    logMetadata: JSON.stringify(getErrorLog(e)),
                });
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <FormComponent
                initialValues={createUserInitialValues}
                isLoading={isLoading}
                title="Создание пользователя"
                onSubmit={handleSubmit}
                userValidationSchema={CreateUserValidationSchema}
            />
        );
    };
    return WrappedComponent;
};
