interface ISnackbarCloseButton {
    snackbarKey: number | string;
}

type IColorsSnackbar = 'error' | 'success' | 'info' | 'warning' | 'default';

interface IOpenSnackbarProps {
    message: string;
    variant: IColorsSnackbar;
}

export type { ISnackbarCloseButton, IColorsSnackbar, IOpenSnackbarProps };
