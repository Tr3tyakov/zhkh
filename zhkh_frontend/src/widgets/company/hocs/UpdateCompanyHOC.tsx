import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';

import { ICompanyForm } from '../form/companyForm.interfaces.ts';
import {
    ICompanyAPI,
    IUpdateCompanyData,
} from '../../../app/domain/services/companies/companyAPI.interfaces.ts';
import { CompanyAPIKey } from '../../../app/domain/services/companies/key.ts';

import { getErrorLog, getErrorMessage } from '../../../shared/api/base.ts';
import { trimObjectStrings } from '../../../shared/common/trimValues.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../../app/infrastructures/enums/auditLog.ts';
import { AuditLogAPIKey } from '../../../app/domain/services/auditLogs/key.ts';
import { IAuditLogAPI } from '../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { useUser } from '../../../app/domain/hooks/useUser/useUser.ts';
import { getChangedFields } from '../../../shared/common/getChangedFields.ts';

export const UpdateCompanyHOC = (FormComponent: React.FC<ICompanyForm<IUpdateCompanyData>>) => {
    const WrappedComponent: React.FC = () => {
        const { id } = useParams<{ id?: string }>();
        const [isLoading, setIsLoading] = useState(true);
        const [initialValues, setInitialValues] = useState<IUpdateCompanyData | null>(null);

        const companyAPI = useInjection<ICompanyAPI>(CompanyAPIKey);
        const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);

        const { openSnackbar } = useEnqueueSnackbar();
        const { user } = useUser();

        useEffect(() => {
            if (!id) return;

            const fetchCompany = async () => {
                try {
                    const data = await companyAPI.getCompany(+id);
                    setInitialValues(data);
                } catch (e) {
                    openSnackbar({
                        message: getErrorMessage(e),
                        variant: 'default',
                    });
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCompany();
        }, [id]);

        const handleSubmit = async (values: IUpdateCompanyData) => {
            const description = `Обновление компании с идентификатором ${id} пользователем ${user?.id}. Изменения: ${getChangedFields(values, initialValues!)}`;
            setIsLoading(true);
            try {
                const data = trimObjectStrings(values);
                await companyAPI.updateCompany(Number(id), data);

                openSnackbar({
                    message: 'Компания успешно обновлена',
                    variant: 'default',
                });
                await auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.EDIT,
                    entityType: EntityTypeEnum.COMPANY,

                    description: description,
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
                    entityType: EntityTypeEnum.COMPANY,

                    description: description,
                    actionResult: message,
                    logMetadata: JSON.stringify(getErrorLog(e)),
                    objectId: Number(id),
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (!initialValues) return null;

        return (
            <FormComponent
                title="Обновление управляющей компании"
                onSubmit={handleSubmit}
                isLoading={isLoading}
                initialValues={initialValues}
            />
        );
    };

    return WrappedComponent;
};
