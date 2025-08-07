import { Box } from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';
import { InformationTable } from '../../../../shared/tables/InformationTable.tsx';
import { IIntelligence } from './intelligence.information.ts';

export const Intelligence: React.FC<IIntelligence> = ({ data, title, icon }) => {
    const firstHalf = data.slice(0, Math.ceil(data.length / 2));
    const secondHalf = data.slice(Math.ceil(data.length / 2));

    return (
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
                    {icon}
                    <Typography>{title}</Typography>
                </Box>
            </Box>
            <Box mt="20px" display="flex" gap="20px">
                <InformationTable data={firstHalf} motionDelay={1} />
                <InformationTable data={secondHalf} motionDelay={2} />
            </Box>
        </Box>
    );
};
