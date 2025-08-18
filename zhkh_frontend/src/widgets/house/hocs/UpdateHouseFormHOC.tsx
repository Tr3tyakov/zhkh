import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import {
    IHouse,
    IHouseAPI,
    IUpdateHouseData,
} from '../../../app/domain/services/houses/houseAPI.interfaces.ts';
import { HouseAPIKey } from '../../../app/domain/services/houses/key.ts';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { trimObjectStrings } from '../../../shared/common/trimValues.ts';
import { getErrorLog, getErrorMessage } from '../../../shared/api/base.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../../app/infrastructures/enums/auditLog.ts';
import { IAuditLogAPI } from '../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../../app/domain/services/auditLogs/key.ts';
import { useUser } from '../../../app/domain/hooks/useUser/useUser.ts';
import { getChangedFields } from '../../../shared/common/getChangedFields.ts';
import { handleError } from '../../../shared/common/handlerError.ts';

export const UpdateHouseHOC = (FormComponent: React.FC<any>) => {
    const WrappedComponent: React.FC = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [initialValues, setInitialValues] = useState<IUpdateHouseData | null>(null);
        const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);
        const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);
        const { openSnackbar } = useEnqueueSnackbar();
        const { user } = useUser();

        const { id } = useParams<{ id?: string }>();

        const updateState = async () => {
            try {
                setIsLoading(true);
                const data = await houseAPI.getHouseInformation(Number(id));
                setInitialValues(data);
            } catch (e) {
                handleError(e, openSnackbar);
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            if (!id) return;

            updateState();
        }, [id]);

        const onSubmit = async (values: IHouse) => {
            if (!id) return;
            const description = `Обновление жилого фонда с идентификатором ${id} пользователем ${user?.id}. Изменения: ${getChangedFields(values, initialValues!)}`;

            setIsLoading(true);
            try {
                const data = trimObjectStrings(values);
                await houseAPI.updateHouse(Number(id), data);
                await Promise.all([
                    updateState(),
                    auditLogAPI.createAuditLog({
                        userId: user?.id,
                        logType: AuditLogEnum.EDIT,
                        entityType: EntityTypeEnum.HOUSE,
                        description: description,
                        actionResult: 'Успешно',
                        objectId: Number(id),
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
                    logType: AuditLogEnum.EDIT,
                    entityType: EntityTypeEnum.HOUSE,
                    description: description,
                    actionResult: message,
                    logMetadata: JSON.stringify(getErrorLog(e)),
                    objectId: Number(id),
                });
            } finally {
                setIsLoading(false);
            }
        };

        return (
            initialValues && (
                <FormComponent
                    title="Обновление жилого фонда"
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    id={id}
                />
            )
        );
    };
    return WrappedComponent;
};
