import React, { useState } from 'react';
import { Container } from '@mui/material';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { getErrorLog, getErrorMessage } from '../../../shared/api/base.ts';
import {
    ICompanyAPI,
    IResponseCompanyData,
} from '../../../app/domain/services/companies/companyAPI.interfaces.ts';
import { CompanyAPIKey } from '../../../app/domain/services/companies/key.ts';
import { usePage } from '../../../app/domain/hooks/usePage/usePage.ts';
import { PageHeader } from '../../../widgets/page/pageHeader/pageHeader.tsx';
import { PageFilter } from '../../../widgets/page/pageFilter/PageFilter.tsx';
import { PageTable } from '../../../widgets/page/pageTable/PageTable.tsx';
import { ROWS_PER_PAGE } from '../../../widgets/house/houses/houses.constants.ts';
import { BodyTableCell } from '../../../app/domain/components/BodyTableCell.tsx';
import { companiesHead } from './company.constants.ts';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useNavigate } from 'react-router-dom';
import { IMenuData } from '../../../app/domain/hooks/useContextMenu/useContextMenu.interfaces.ts';
import { useContextMenu } from '../../../app/domain/hooks/useContextMenu/useContextMenu.ts';
import { LoadingProgress } from '../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { AuditLogEnum, EntityTypeEnum } from '../../../app/infrastructures/enums/auditLog.ts';
import { IAuditLogAPI } from '../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../../app/domain/services/auditLogs/key.ts';
import { useUser } from '../../../app/domain/hooks/useUser/useUser.ts';
import { ICompaniesFilter } from './companies.interfaces.ts';
import { handleError } from '../../../shared/common/handlerError.ts';

const filter: ICompaniesFilter = {
    searchValue: '',
};

export const CompaniesPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openSnackbar } = useEnqueueSnackbar();
    const contextMenuData = useContextMenu();
    const { user } = useUser();
    const navigate = useNavigate();

    const fetchCompanies = async (filter: ICompaniesFilter, page: number) => {
        setIsLoading(true);
        try {
            const safePage = Math.max(page, 1); // защита от 0 или < 0
            const offset = (safePage - 1) * ROWS_PER_PAGE;
            const data = await companyAPI.getCompanies(10, offset, filter.searchValue);
            usePageData.changeData(data.companies, data.total);
        } catch (e) {
            handleError(e, openSnackbar);

        } finally {
            setIsLoading(false);
        }
    };
    const usePageData = usePage<IResponseCompanyData, ICompaniesFilter>(fetchCompanies, filter);
    const companyAPI = useInjection<ICompanyAPI>(CompanyAPIKey);
    const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);

    const deleteCompany = async (company: IResponseCompanyData) => {
        const description = `Удаление компании c идентификатором ${company.id} пользователем с идентификатором ${user?.id}`;
        try {
            setIsLoading(true);
            await companyAPI.deleteCompany(company!.id);
            usePageData.handlePageChange(1);

            await Promise.all([
                fetchCompanies(usePageData.filters, 1),
                auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.DELETE,
                    entityType: EntityTypeEnum.COMPANY,
                    description: description,
                    actionResult: 'Успешно',
                    objectId: company.id,
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
                entityType: EntityTypeEnum.COMPANY,
                description: description,
                actionResult: message,
                logMetadata: JSON.stringify(getErrorLog(e)),
                objectId: company.id,
            });
        } finally {
            setIsLoading(false);
            contextMenuData.handleClose();
        }
    };
    const menuData: IMenuData[] = [
        {
            title: 'Редактировать',
            function: (company) => navigate(`/companies/edit-company/${company.id}`),
            icon: <EditRoundedIcon fontSize="small" color="disabled" />,
            disabled: false,
        },
        {
            title: 'Удалить',
            function: deleteCompany,
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
                title="Управляющие компании"
                path="/companies/create-company"
                buttonTitle="Создать управляющую компанию"
                body="Сервис содержит информацию о домах. Введите адрес дома в поисковую строку, чтобы
                получить подробные сведения об объекте: текущее состояние, историю изменений и
                другую важную информацию."
            />
            <PageFilter
                {...usePageData}
                isLoading={isLoading}
                label="Поиск управляющей компании по наименованию"
            />
            <PageTable
                {...usePageData}
                isLoading={isLoading}
                heads={companiesHead}
                bodyPath="/companies"
                menuData={menuData}
                contextMenuData={contextMenuData}
                renderBody={(company: IResponseCompanyData) => (
                    <React.Fragment key={company.id}>
                        <BodyTableCell>{company.id}</BodyTableCell>
                        <BodyTableCell>{company.name}</BodyTableCell>
                        <BodyTableCell>{company.email}</BodyTableCell>
                        <BodyTableCell>{company.address}</BodyTableCell>
                        <BodyTableCell>{company.phone}</BodyTableCell>
                    </React.Fragment>
                )}
            />
        </Container>
    );
};
