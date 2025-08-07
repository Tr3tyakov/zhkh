import { Box, Breadcrumbs, Container, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CompanyInformation } from '../../../widgets/company/CompanyInformation.tsx';
import { AttachedHouse } from './attachedHouse/AttachedHouse.tsx';
import { AttachedHousesTable } from './attachedHousesTable/AttachedHousesTable.tsx';
import { getErrorMessage } from '../../../shared/api/base.ts';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import {
    ICompanyAPI,
    IResponseCompanyData,
} from '../../../app/domain/services/companies/companyAPI.interfaces.ts';
import { CompanyAPIKey } from '../../../app/domain/services/companies/key.ts';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { useEffect, useState } from 'react';

export const CurrentCompany = () => {
    const [companyData, setCompanyData] = useState<IResponseCompanyData | null>(null);

    const navigate = useNavigate();
    const { companyId } = useParams<{ companyId: string }>();
    const companyAPI = useInjection<ICompanyAPI>(CompanyAPIKey);
    const { openSnackbar } = useEnqueueSnackbar();

    const fetchCompany = async () => {
        if (!companyId) return;
        try {
            const company = await companyAPI.getCompany(+companyId);
            setCompanyData(company);
        } catch (e) {
            openSnackbar({ message: getErrorMessage(e), variant: 'default' });
        }
    };

    useEffect(() => {
        fetchCompany();
    }, [companyId]);

    return (
        <Container maxWidth="lg">
            <Box display="flex" flexDirection="column" gap="10px" p="20px">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Typography className="pointer" onClick={() => navigate('/houses')}>
                        Управляющие компании
                    </Typography>
                    <Typography color="text.primary">
                        {companyData?.name || 'Управляющая компания'}
                    </Typography>
                </Breadcrumbs>
                <Typography mt="20px" fontSize="18px" fontWeight="500">
                    Информация об управляющей компании {companyData?.name}
                </Typography>
                {companyData && <CompanyInformation data={companyData} />}

                <Box display="flex" flexDirection="column">
                    {companyId && (
                        <>
                            <Typography mt="20px" fontSize="18px" fontWeight="500">
                                Привязка жилового дома
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                <AttachedHouse companyId={+companyId} />
                            </Box>
                            <Typography mt="20px" fontSize="18px" fontWeight="500">
                                Привязанные жилые дома
                            </Typography>
                            <Box>
                                <AttachedHousesTable companyId={+companyId} />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Container>
    );
};
