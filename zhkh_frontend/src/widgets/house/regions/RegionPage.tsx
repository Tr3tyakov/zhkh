import { SyntheticEvent, useEffect, useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, useTheme } from '@mui/material';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar';
import { useInjection } from '../../../app/domain/hooks/useInjection';
import {
    IHouseRegionsResponse,
    IHouseAPI,
} from '../../../app/domain/services/houses/houseAPI.interfaces';
import { getErrorMessage } from '../../../shared/api/base';
import { PageHeader } from '../../page/pageHeader/pageHeader';
import { HouseAPIKey } from '../../../app/domain/services/houses/key.ts';
import { LoadingProgress } from '../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { RenderRegionList } from './renderRegionList/RenderRegionList.tsx';
import { TabPanel } from './tabPanel/TabPanel.tsx';
import { useNavigate } from 'react-router-dom';

function a11yProps(index: number) {
    return {
        id: `region-tab-${index}`,
        'aria-controls': `region-tabpanel-${index}`,
    };
}

export const RegionsPage = () => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [regions, setRegions] = useState<IHouseRegionsResponse | null>(null);
    const [tabIndex, setTabIndex] = useState(0);
    const { openSnackbar } = useEnqueueSnackbar();
    const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);
    const navigate = useNavigate();

    const fetchRegions = async () => {
        setIsLoading(true);
        try {
            const data = await houseAPI.getRegions();
            setRegions(data);
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
        fetchRegions();
    }, []);

    const handleTabChange = (_: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Container maxWidth="lg">
            <PageHeader
                title="Регионы"
                body="Сервис содержит информацию о домах. Введите адрес дома в поисковую строку, чтобы
                получить подробные сведения об объекте: текущее состояние, историю изменений и
                другую важную информацию."
            />
            <LoadingProgress
                isLoading={isLoading}
                value={
                    regions ? (
                        <>
                            <Tabs
                                value={tabIndex}
                                onChange={handleTabChange}
                                aria-label="region tabs"
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    mt: 3,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    '.MuiTabs-indicator': {
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: theme.palette.primary.main,
                                    },
                                }}
                            >
                                <Tab label="Автономные округа" {...a11yProps(0)} />
                                <Tab label="Автономные области" {...a11yProps(1)} />
                                <Tab label="Города" {...a11yProps(2)} />
                                <Tab label="Области" {...a11yProps(3)} />
                                <Tab label="Края" {...a11yProps(4)} />
                                <Tab label="Республики" {...a11yProps(5)} />
                            </Tabs>

                            <Box>
                                <TabPanel value={tabIndex} index={0}>
                                    {RenderRegionList(regions.autonomousOkrugs, navigate)}
                                </TabPanel>
                                <TabPanel value={tabIndex} index={1}>
                                    {RenderRegionList(regions.autonomousAreas, navigate)}
                                </TabPanel>
                                <TabPanel value={tabIndex} index={2}>
                                    {RenderRegionList(regions.cities, navigate)}
                                </TabPanel>
                                <TabPanel value={tabIndex} index={3}>
                                    {RenderRegionList(regions.oblasts, navigate)}
                                </TabPanel>
                                <TabPanel value={tabIndex} index={4}>
                                    {RenderRegionList(regions.krais, navigate)}
                                </TabPanel>
                                <TabPanel value={tabIndex} index={5}>
                                    {RenderRegionList(regions.republics, navigate)}
                                </TabPanel>
                            </Box>
                        </>
                    ) : (
                        <Typography variant="body1" sx={{ mt: 4 }}>
                            Регионы не найдены.
                        </Typography>
                    )
                }
            />
        </Container>
    );
};
