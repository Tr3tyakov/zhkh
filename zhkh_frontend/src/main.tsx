import 'reflect-metadata';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import theme from './app/theme.ts';
import { UserProvider } from './app/infrastructures/providers/userProvider/UserProvider.tsx';
import { SnackbarCloseButton } from './app/domain/hooks/useSnackbar/useEnqueueSnackbar.tsx';
import { setupContainer } from './app/infrastructures/container/container.ts';
import { ReferenceBookProvider } from './app/infrastructures/providers/referenceBookProvider/ReferenceBookProvider.tsx';

setupContainer();

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
            maxSnack={3}
            autoHideDuration={5000}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            action={(key) => <SnackbarCloseButton snackbarKey={key} />}
        >
            <BrowserRouter>
                <UserProvider>
                    <ReferenceBookProvider>
                        <App />
                    </ReferenceBookProvider>
                </UserProvider>
            </BrowserRouter>
        </SnackbarProvider>
    </ThemeProvider>
);
