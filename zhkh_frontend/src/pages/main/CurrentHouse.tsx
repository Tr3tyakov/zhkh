import { Box, Breadcrumbs, Button, Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { IHouseAPI, IHouseResponse } from '../../app/domain/services/houses/houseAPI.interfaces.ts';
import { useInjection } from '../../app/domain/hooks/useInjection.ts';
import { HouseAPIKey } from '../../app/domain/services/houses/key.ts';
import { useEnqueueSnackbar } from '../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { HouseInformation } from '../../widgets/house/houseInformation/HouseInformation.tsx';
import { formatHouseAddress } from '../../widgets/house/houseInformation/houseInformation.functions.ts';
import { LoadingProgress } from '../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { handleError } from '../../shared/common/handlerError.ts';
import { getErrorMessage } from '../../shared/api/base.ts';
import { ICompanyAPI, IResponseCompanyData } from '../../app/domain/services/companies/companyAPI.interfaces.ts';
import { CompanyAPIKey } from '../../app/domain/services/companies/key.ts';

function getHouseDescription(
    data?: IHouseResponse | null,
    company?: IResponseCompanyData | null,
): string {
    if (!data) return '';

    const houseParts = [
        `Жилой дом${data?.city ? ` в ${data.city}` : ''}`,
        data?.street || data?.houseNumber || data?.building
            ? `по адресу${
                data?.street ? ` ул. ${data.street}` : ''
            }${data?.houseNumber ? ` д. ${data.houseNumber}` : ''}${
                data?.building ? ` корп. ${data.building}` : ''
            }`
            : '',
        data?.commissioningYear
            ? `введен в эксплуатацию в ${data.commissioningYear} году`
            : '',
        data?.maxFloorsCount ? `${data.maxFloorsCount}-этажный` : '',
        data?.totalArea
            ? `имеет общую площадь всех помещений ${data.totalArea} кв. м`
            : '',
    ].filter(Boolean);

    let description = houseParts.join(', ');
    if (description) description += '.';

    if (company?.name) {
        description += ` Дом находится под управлением ${company.name}`;
    }

    return description;
}

export const CurrentHouse = () => {
    const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);
    const companyAPI = useInjection<ICompanyAPI>(CompanyAPIKey);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<IHouseResponse | null>(null);
    const [company, setCompany] = useState<IResponseCompanyData | null>(null);
    const { houseId } = useParams<{ houseId: string }>();

    const { openSnackbar } = useEnqueueSnackbar();
    const navigate = useNavigate();

    const fetchHouseData = async () => {
        if (!houseId) return;

        setIsLoading(true);
        try {
            const data = await houseAPI.getHouseInformation(+houseId);
            setData(data);
        } catch (e) {
            handleError(e, openSnackbar);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchCompany = async () => {
        if (!data?.companyId) return;
        try {
            const company = await companyAPI.getCompany(+data.companyId);
            setCompany(company);
        } catch (e) {
            openSnackbar({ message: getErrorMessage(e), variant: 'default' });
        }
    };


    useEffect(() => {
        fetchHouseData();
    }, [houseId]);

    useEffect(() => {
        fetchCompany();
    }, [data]);

    return (
        <Container maxWidth="lg">
            <Box display="flex" flexDirection="column" gap="10px" p="20px">
                <Box display="flex" justifyContent="space-between">
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                        <Typography className="pointer" onClick={() => navigate('/houses')}>
                            Жилой фонд
                        </Typography>
                        <Typography className="pointer" color="text.primary" noWrap>
                            {formatHouseAddress(data)}
                        </Typography>
                    </Breadcrumbs>
                    <Box>
                        <Button
                            onClick={() => navigate(`/houses/edit-house/${data?.id}`)}
                            variant="contained"
                            size="small"
                        >
                            Редактировать жилой фонд
                        </Button>
                    </Box>
                </Box>
                <Typography fontSize="18px" fontWeight="500">
                    Анкета дома по адресу {formatHouseAddress(data)}
                </Typography>
                <LoadingProgress
                    isLoading={isLoading}
                    value={
                        <Typography>
                            {getHouseDescription(data, company)}
                        </Typography>
                    }
                />

                {data && <HouseInformation data={data} />}
            </Box>
        </Container>
    );
};
