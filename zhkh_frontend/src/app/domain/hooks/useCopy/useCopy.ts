import { useEnqueueSnackbar } from '../useSnackbar/useEnqueueSnackbar.ts';
import { handleError } from '../../../../shared/common/handlerError.ts';

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
            handleError(e, openSnackbar);
        }
    };

    return { copy };
};
