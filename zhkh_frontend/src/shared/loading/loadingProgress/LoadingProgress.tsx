import { CircularProgress } from '@mui/material';
import { ILoadingProgress } from './loadingProgress.interfaces.ts';
import React from 'react';

export const LoadingProgress: React.FC<ILoadingProgress> = ({ isLoading, size = 20, value }) => {
    return <>{isLoading ? <CircularProgress size={size} color="primary" /> : value}</>;
};
