import React, { useState } from 'react';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import {
    ICreateHouseData,
    IHouseAPI,
} from '../../../app/domain/services/houses/houseAPI.interfaces.ts';
import { HouseAPIKey } from '../../../app/domain/services/houses/key.ts';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { trimObjectStrings } from '../../../shared/common/trimValues.ts';
import { getErrorLog, getErrorMessage } from '../../../shared/api/base.ts';
import { createHouseInitialValues } from '../../../pages/house/createHouse/createHousePage.validation.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../../app/infrastructures/enums/auditLog.ts';
import { IAuditLogAPI } from '../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../../app/domain/services/auditLogs/key.ts';
import { useUser } from '../../../app/domain/hooks/useUser/useUser.ts';
import { FormikHelpers } from 'formik';
import { convertEmptyStringsToNull } from '../../../shared/common/convertToNull.tsx';

export const CreateHouseFormHOC = (FormComponent: React.FC<any>) => {
    const WrappedComponent: React.FC = () => {
        const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);
        const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);
        const { user } = useUser();

        const { openSnackbar } = useEnqueueSnackbar();
        const [isLoading, setIsLoading] = useState(false);

        const onSubmit = async (
            values: ICreateHouseData,
            helper: FormikHelpers<ICreateHouseData>
        ) => {
            const description = `Создание жилого фонда`;
            setIsLoading(true);
            try {
                const data = trimObjectStrings(values);
                await houseAPI.createHouse(data);
                openSnackbar({ message: 'Жилой фонд успешно создан', variant: 'default' });
                await auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.CREATE,
                    entityType: EntityTypeEnum.HOUSE,
                    description: description,
                    actionResult: 'Успешно',
                });
                helper.resetForm();
            } catch (e) {
                const message = getErrorMessage(e);
                openSnackbar({
                    message: message,
                    variant: 'default',
                });

                await auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.CREATE,
                    entityType: EntityTypeEnum.HOUSE,
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
                title="Создание жилого фонда"
                initialValues={createHouseInitialValues}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        );
    };
    return WrappedComponent;
};
