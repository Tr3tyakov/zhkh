import { InformationTable } from '../../../shared/tables/InformationTable.tsx';
import React from 'react';
import { Intelligence } from './intelligence/Intelligence.tsx';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import { IHouseInformation } from './houseInformation.interfaces.ts';
import { HouseFiles } from './houseFiles/HouseFiles.tsx';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useHouseTables } from '../../../app/domain/hooks/useHouseInformation/useHouseInformation.ts';

export const HouseInformation: React.FC<IHouseInformation> = ({ data }) => {
    const {
        buildHomeInformationTable,
        buildGeneralInformationTable,
        buildEngineeringSystemsTable,
        buildStructuralElementsTable,
        buildFacadeTable,
        buildRoofTable,
        buildHotWaterSupplyTable,
        buildSewerageTable,
        buildGasSystemTable,
        buildElectricSystemTable,
        buildFundamentTable,
        buildInnerWall,
        buildOverlapTable,
        buildWindowTable,
        buildHeatingTable,
        buildHeatingSystemRisersTable,
        buildWaterSystemWearTable,
        buildHeatingDevices,
        buildColdWaterSystemTable,
        buildColdWaterSystemRiserTable,
        buildHotWaterSystemRiserTable,
        buildHotWaterSystemWearTable,
        buildColdWaterSystemWearTable,
    } = useHouseTables(data);

    return (
        <>
            <InformationTable data={buildHomeInformationTable()} />

            <Intelligence
                data={buildGeneralInformationTable()}
                title="Основные сведения"
                icon={<ApartmentRoundedIcon color="primary" />}
            />

            <Intelligence
                data={buildEngineeringSystemsTable()}
                title="Инженерные системы"
                icon={<ApartmentRoundedIcon color="primary" />}
            />

            <Intelligence
                data={buildStructuralElementsTable()}
                title="Конструктивные элементы"
                icon={<ApartmentRoundedIcon color="primary" />}
            />

            <Box>
                <Box borderBottom="1px solid #8080805c">
                    <Box
                        mt="20px"
                        display="flex"
                        pb="10px"
                        gap="5px"
                        borderBottom="2px solid #556cd6"
                        maxWidth="max-content"
                    >
                        <ApartmentRoundedIcon color="primary" />
                        <Typography>
                            Подробные сведения о конструктиве и инженерных сетях
                        </Typography>
                    </Box>
                </Box>
                <Box mt="20px" display="flex" gap="20px">
                    <Box width="100%" display="flex" flexDirection="column" gap="10px">
                        <InformationTable
                            header="Система горячего водоснабжения"
                            data={buildHotWaterSupplyTable()}
                            motionDelay={1}
                        />
                        <InformationTable
                            header="Система электроснабжения"
                            data={buildElectricSystemTable()}
                            motionDelay={3}
                        />
                        <InformationTable
                            header="Внутренние стены"
                            data={buildInnerWall()}
                            motionDelay={2}
                        />
                        <InformationTable
                            header="Фасад"
                            data={buildFacadeTable()}
                            motionDelay={2}
                        />
                        <InformationTable
                            header="Перекрытия"
                            data={buildOverlapTable()}
                            motionDelay={3}
                        />
                        <InformationTable
                            header="Система отопления"
                            data={buildHeatingTable()}
                            motionDelay={3}
                        />
                        <InformationTable
                            header="Отопительные приборы"
                            data={buildHeatingDevices()}
                            motionDelay={5}
                        />
                        <InformationTable
                            header="Система холодного водоснабжения"
                            data={buildColdWaterSystemTable()}
                            motionDelay={5}
                        />
                        <InformationTable
                            header="Стояки системы холодного водоснабжения"
                            data={buildColdWaterSystemRiserTable()}
                            motionDelay={5}
                        />
                    </Box>
                    <Box width="100%" display="flex" flexDirection="column" gap="10px">
                        <InformationTable
                            header="Система водоотведения"
                            data={buildSewerageTable()}
                            motionDelay={2}
                        />
                        <InformationTable
                            header="Система газоснабжения"
                            data={buildGasSystemTable()}
                            motionDelay={3}
                        />
                        <InformationTable
                            header="Фундамент"
                            data={buildFundamentTable()}
                            motionDelay={1}
                        />
                        <InformationTable header="Крыша" data={buildRoofTable()} motionDelay={4} />
                        <InformationTable header="Окна" data={buildWindowTable()} motionDelay={5} />
                        <InformationTable
                            header="Стояки системы отопления"
                            data={buildHeatingSystemRisersTable()}
                            motionDelay={5}
                        />
                        <InformationTable
                            header="Запорная арматура системы отопления"
                            data={buildWaterSystemWearTable()}
                            motionDelay={5}
                        />
                        <InformationTable
                            header="Стояки системы горячего водоснабжения"
                            data={buildHotWaterSystemRiserTable()}
                            motionDelay={5}
                        />
                        <InformationTable
                            header="Запорная арматура системы холодного водоснабжения"
                            data={buildHotWaterSystemWearTable()}
                            motionDelay={5}
                        />
                        <InformationTable
                            header="Запорная арматура системы горячего водоснабжения"
                            data={buildColdWaterSystemWearTable()}
                            motionDelay={5}
                        />
                    </Box>
                </Box>
            </Box>

            <Box borderBottom="1px solid #8080805c">
                <Box
                    mt="20px"
                    display="flex"
                    pb="10px"
                    gap="5px"
                    borderBottom="2px solid #556cd6"
                    maxWidth="max-content"
                >
                    <InsertDriveFileIcon color="primary" />
                    <Typography>Файлы</Typography>
                </Box>
            </Box>
            <HouseFiles houseId={data.id} />
        </>
    );
};
