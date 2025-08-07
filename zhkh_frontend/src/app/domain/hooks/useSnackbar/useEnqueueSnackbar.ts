import { useSnackbar } from 'notistack';
import { IOpenSnackbarProps } from './useEnqueueSnackbar.interfaces.ts';

export const useEnqueueSnackbar = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const openSnackbar = ({ message, variant = 'default' }: IOpenSnackbarProps) => {
        enqueueSnackbar(message, { variant });
    };

    return { openSnackbar, closeSnackbar };
};
