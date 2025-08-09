import { getErrorMessage } from '../api/base.ts';
import { IOpenSnackbarProps } from '../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.interfaces.ts';

export const handleError = (
    e: any,
    openSnackbar: ({ message, variant }: IOpenSnackbarProps) => void
) => {
    if (e?.response?.status === 401) {
        return;
    }

    openSnackbar({
        message: getErrorMessage(e),
        variant: 'default',
    });
};