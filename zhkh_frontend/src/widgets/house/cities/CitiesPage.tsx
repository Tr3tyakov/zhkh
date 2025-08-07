import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Box, Divider, Grid as MuiGrid, GridProps } from '@mui/material';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar';
import { useInjection } from '../../../app/domain/hooks/useInjection';
import { IHouseAPI } from '../../../app/domain/services/houses/houseAPI.interfaces';
import { getErrorMessage } from '../../../shared/api/base';
import { PageHeader } from '../../page/pageHeader/pageHeader';
import { HouseAPIKey } from '../../../app/domain/services/houses/key.ts';
import { LoadingProgress } from '../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { useNavigate } from 'react-router-dom';

const Grid = MuiGrid as React.FC<GridProps>;

export const CitiesPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cities, setCities] = useState<string[]>([]);
    const { openSnackbar } = useEnqueueSnackbar();
    const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);
    const navigate = useNavigate();

    const fetchCities = async () => {
        setIsLoading(true);
        try {
            const data = await houseAPI.getCities();
            setCities(data);
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
        fetchCities();
    }, []);

    const groupedCities = useMemo(() => {
        const grouped: Record<string, string[]> = {};
        cities.forEach((city) => {
            const letter = city[0].toUpperCase();
            if (!grouped[letter]) {
                grouped[letter] = [];
            }
            grouped[letter].push(city);
        });
        return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0], 'ru'));
    }, [cities]);

    return (
        <Container maxWidth="lg">
            <PageHeader
                title="Города"
                body="Сервис содержит информацию о домах. Введите адрес дома в поисковую строку, чтобы
                получить подробные сведения об объекте: текущее состояние, историю изменений и
                другую важную информацию."
            />

            <LoadingProgress
                isLoading={isLoading}
                value={
                    groupedCities.length > 0 ? (
                        groupedCities.map(([letter, cityGroup]) => (
                            <Box key={letter} sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h4" sx={{ mr: 2, color: 'primary.main' }}>
                                        {letter}
                                    </Typography>
                                    <Divider sx={{ flexGrow: 1 }} />
                                </Box>
                                <Grid container spacing={1}>
                                    {cityGroup.map((city) => (
                                        <Grid component="div" key={city}>
                                            <Typography
                                                onClick={() =>
                                                    navigate(
                                                        `/houses/?city=${encodeURIComponent(city)}`
                                                    )
                                                }
                                                variant="body1"
                                                sx={{
                                                    color: 'primary.main',
                                                    cursor: 'pointer',
                                                    '&:hover': { textDecoration: 'underline' },
                                                }}
                                            >
                                                {city}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ mt: 4 }}>
                            Города не найдены.
                        </Typography>
                    )
                }
            />
        </Container>
    );
};
