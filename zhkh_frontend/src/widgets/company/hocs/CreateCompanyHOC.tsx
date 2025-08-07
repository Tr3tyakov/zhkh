import React, { useState } from 'react';
import {
    ICompanyAPI,
    ICreateCompanyData,
} from '../../../app/domain/services/companies/companyAPI.interfaces.ts';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import { CompanyAPIKey } from '../../../app/domain/services/companies/key.ts';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { useUser } from '../../../app/domain/hooks/useUser/useUser.ts';

import { ICompanyForm } from '../form/companyForm.interfaces.ts';
import { trimObjectStrings } from '../../../shared/common/trimValues.ts';
import { getErrorLog, getErrorMessage } from '../../../shared/api/base.ts';
import { companyInitialValues } from '../../../pages/company/companyPage.validation.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../../app/infrastructures/enums/auditLog.ts';
import { IAuditLogAPI } from '../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../../app/domain/services/auditLogs/key.ts';

export const CreateCompanyHOC = (FormComponent: React.FC<ICompanyForm<ICreateCompanyData>>) => {
    const WrappedComponent: React.FC = () => {
        const companyAPI = useInjection<ICompanyAPI>(CompanyAPIKey);
        const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);

        const { openSnackbar } = useEnqueueSnackbar();
        const { user } = useUser();

        const [isLoading, setIsLoading] = useState(false);

        const handleSubmit = async (values: ICreateCompanyData, helpers: any) => {
            const description = `Создание компании пользователем`;
            setIsLoading(true);
            try {
                const data = trimObjectStrings(values);
                await companyAPI.createCompany(user!.id, data);

                openSnackbar({
                    message: 'Управляющая компания успешно создана',
                    variant: 'default',
                });
                await auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.CREATE,
                    entityType: EntityTypeEnum.COMPANY,
                    description: description,
                    actionResult: 'Успешно',
                });

                helpers.resetForm();
            } catch (e) {
                const message = getErrorMessage(e);
                openSnackbar({
                    message: message,
                    variant: 'default',
                });
                await auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.CREATE,
                    entityType: EntityTypeEnum.COMPANY,
                    description: description,
                    actionResult: message,
                    logMetadata: JSON.stringify(getErrorLog(e)),
                });
            } finally {
                setIsLoading(false);
                helpers.setSubmitting(false);
            }
        };

        return (
            <FormComponent
                title="Создание управляющей компании"
                onSubmit={handleSubmit}
                isLoading={isLoading}
                initialValues={companyInitialValues}
            />
        );
    };

    return WrappedComponent;
};
