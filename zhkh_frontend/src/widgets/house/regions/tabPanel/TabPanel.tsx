import { Box } from '@mui/material';
import { ITabPanel } from './tabPanel.interfaces.ts';
import React from 'react';

export const TabPanel: React.FC<ITabPanel> = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`region-tabpanel-${index}`}
            aria-labelledby={`region-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
        </Box>
    );
};
