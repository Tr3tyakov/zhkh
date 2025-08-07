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
        buildAdditionalInfoTable,
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

            <Intelligence
                data={buildFacadeTable()}
                title="Фасад"
                icon={<ApartmentRoundedIcon color="primary" />}
            />

            <Intelligence
                data={buildRoofTable()}
                title="Крыша"
                icon={<ApartmentRoundedIcon color="primary" />}
            />

            <Intelligence
                data={buildAdditionalInfoTable()}
                title="Дополнительная информация"
                icon={<ApartmentRoundedIcon color="primary" />}
            />

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
