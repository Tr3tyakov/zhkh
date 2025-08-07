import React from 'react';
import { IconButton } from '@mui/material';
import { ISnackbarCloseButton } from './useEnqueueSnackbar.interfaces.ts';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEnqueueSnackbar } from './useEnqueueSnackbar.ts';

export const SnackbarCloseButton: React.FC<ISnackbarCloseButton> = ({ snackbarKey }) => {
    const { closeSnackbar } = useEnqueueSnackbar();

    return (
        <IconButton color="error" onClick={() => closeSnackbar(snackbarKey)}>
            <CloseRoundedIcon />
        </IconButton>
    );
};
