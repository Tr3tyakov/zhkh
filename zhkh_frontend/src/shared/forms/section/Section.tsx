import React from 'react';
import { Box, Typography } from '@mui/material';
import { ISection } from './section.interfaces.ts';

export const Section: React.FC<ISection> = ({ title, children, icon }) => (
    <>
        <Box borderBottom="1px solid #8080805c" mb='10px'>
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
        <Box display="flex" flexWrap="wrap" gap="10px">
            {children}
        </Box>
    </>
);
