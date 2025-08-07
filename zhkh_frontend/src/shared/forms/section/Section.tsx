import React from 'react';
import { Box, Typography } from '@mui/material';
import { ISection } from './section.interfaces.ts';

export const Section: React.FC<ISection> = ({ title, children }) => (
    <>
        <Typography fontSize={14} fontWeight={500} mt={2} gutterBottom>
            {title}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap="10px">
            {children}
        </Box>
    </>
);
