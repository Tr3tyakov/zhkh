import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

declare module '@mui/material/styles' {
    interface Palette {
        title: Palette['primary'];
        subtitle: Palette['primary'];
    }

    interface PaletteOptions {
        title?: PaletteOptions['primary'];
        subtitle?: PaletteOptions['primary'];
    }
}
// @ts-ignore
const theme = createTheme({
    typography: {
        button: {
            textTransform: 'none',
        },
        fontSize: 14,
        fontFamily: `'Halvar Breitschrift', sans-serif`,
    },
    cssVariables: true,
    palette: {
        title: {
            main: '#0F172A',
            contrastText: '#fff',
        },
        subtitle: {
            main: '#1E293B',
            contrastText: '#fff',
        },
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red[600],
        },
        text: {
            primary: '#404040',
            secondary: '#757575',
            disabled: '#bdbdbd',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#f1f5f963',
                },
            },
        },
    },
});

export default theme;
