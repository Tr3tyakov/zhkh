import { Box, Breadcrumbs, Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import { getErrorMessage } from '../../shared/api/base.ts';
import { useEffect, useState } from 'react';
import { IHouseAPI, IHouseResponse } from '../../app/domain/services/houses/houseAPI.interfaces.ts';
import { useInjection } from '../../app/domain/hooks/useInjection.ts';
import { HouseAPIKey } from '../../app/domain/services/houses/key.ts';
import { useEnqueueSnackbar } from '../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { HouseInformation } from '../../widgets/house/houseInformation/HouseInformation.tsx';
import { formatHouseAddress } from '../../widgets/house/houseInformation/houseInformation.functions.ts';
import { LoadingProgress } from '../../shared/loading/loadingProgress/LoadingProgress.tsx';

export const CurrentHouse = () => {
    const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<IHouseResponse | null>(null);
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
            openSnackbar({
                message: getErrorMessage(e),
                variant: 'default',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHouseData();
    }, [houseId]);

    return (
        <Container maxWidth="lg">
            <Box display="flex" flexDirection="column" gap="10px" p="20px">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Typography className="pointer" onClick={() => navigate('/houses')}>
                        Жилой фонд
                    </Typography>
                    <Typography className="pointer" color="text.primary" noWrap>
                        {formatHouseAddress(data)}
                    </Typography>
                </Breadcrumbs>
                <Typography fontSize="18px" fontWeight="500">
                    Анкета дома по адресу {formatHouseAddress(data)}
                </Typography>
                <LoadingProgress
                    isLoading={isLoading}
                    value={
                        <Typography>
                            Жилой дом в {data?.city}, по адресу ул. {data?.street} д.{' '}
                            {data?.houseNumber} корп. {data?.building} введен в эксплуатацию в{' '}
                            {data?.commissioningYear} году, {data?.maxFloorsCount}-этажный, имеет
                            общую площадь всех помещений {data?.totalArea} квадратных метров. Дом
                            находится под управлением УК «Жилищник района люблино» с 09.04.2015.
                        </Typography>
                    }
                />

                {data && <HouseInformation data={data} />}
            </Box>
        </Container>
    );
};
