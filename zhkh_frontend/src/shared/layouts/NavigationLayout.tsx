import React from 'react';
import { Outlet } from 'react-router-dom';
import TopSidebar from '../../widgets/panels/sidebar/TopSidebar.tsx';
import { INavigationLayout } from './navigationLayout.interfaces.ts';
import { Box } from '@mui/material';

export const NavigationLayout: React.FC<INavigationLayout> = () => {
    return (
        <Box display="flex" flexDirection="column">
            <TopSidebar />
            <Outlet />
        </Box>
    );
};
