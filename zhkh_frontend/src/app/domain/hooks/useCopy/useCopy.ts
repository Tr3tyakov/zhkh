import { useEnqueueSnackbar } from '../useSnackbar/useEnqueueSnackbar.ts';
import { getErrorMessage } from '../../../../shared/api/base.ts';

export const useCopy = (message?: string) => {
    const { openSnackbar } = useEnqueueSnackbar();

    const copy = async (toCopy: string | undefined) => {
        try {
            await navigator.clipboard.writeText(toCopy || '');
            openSnackbar({
                message: message ? message : 'Значение скопировано',
                variant: 'default',
            });
        } catch (e) {
            openSnackbar({
                message: getErrorMessage(e),
                variant: 'default',
            });
        }
    };

    return { copy };
};
