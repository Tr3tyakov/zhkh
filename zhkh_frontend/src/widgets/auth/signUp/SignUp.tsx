import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ISignUp } from './signUp.interfaces.ts';
import React, { useState } from 'react';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { LoadingProgress } from '../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { getErrorMessage } from '../../../shared/api/base.ts';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import { IUserAPI } from '../../../app/domain/services/users/userAPI.interfaces.ts';
import { UserAPIKey } from '../../../app/domain/services/users/key.ts';

export const SignUp: React.FC<ISignUp> = ({ changeIsSignIn }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openSnackbar } = useEnqueueSnackbar();
    const userAPI = useInjection<IUserAPI>(UserAPIKey);

    const formik = useFormik({
        initialValues: {
            email: '',
            firstName: '',
            middleName: '',
            lastName: '',
            password: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Введите имя'),
            middleName: Yup.string().required('Введите фамилию'),
            lastName: Yup.string().required('Введите отчество'),
            email: Yup.string().email('Некорректная почта').required('Введите почту'),
            password: Yup.string()
                .min(6, 'Минимум 6 символов')
                .max(24, 'Максимум 24 символа')
                .required('Введите пароль'),
        }),
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const response = await userAPI.createUser({
                    email: values.email.trim(),
                    password: values.password.trim(),
                    firstName: values.firstName.trim(),
                    middleName: values.middleName.trim(),
                    lastName: values.lastName.trim(),
                });
                openSnackbar({
                    message: response.data,
                    variant: 'default',
                });

                formik.resetForm();
                changeIsSignIn();
            } catch (e) {
                openSnackbar({
                    message: getErrorMessage(e),
                    variant: 'default',
                });
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} style={{ maxWidth: '500px' }}>
            <Typography fontSize="24px" mb="10px" fontWeight={500}>
                Готовы начать свою историю успеха?
            </Typography>
            <Typography color="#505050">
                Ваше пространство для продуктивных решений начинается здесь
            </Typography>
            <Box width="100%">
                <Box display="flex" flexDirection="column" gap="10px" mb="30px">
                    <TextField
                        label="Имя"
                        variant="standard"
                        fullWidth
                        {...formik.getFieldProps('firstName')}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                    />
                    <TextField
                        label="Фамилия"
                        variant="standard"
                        fullWidth
                        {...formik.getFieldProps('middleName')}
                        error={formik.touched.middleName && Boolean(formik.errors.middleName)}
                        helperText={formik.touched.middleName && formik.errors.middleName}
                    />
                    <TextField
                        label="Отчество"
                        variant="standard"
                        fullWidth
                        {...formik.getFieldProps('lastName')}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                    />
                    <TextField
                        label="Почта"
                        variant="standard"
                        fullWidth
                        {...formik.getFieldProps('email')}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        variant="standard"
                        fullWidth
                        {...formik.getFieldProps('password')}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                </Box>
                <Button disabled={isLoading} type="submit" fullWidth variant="contained">
                    <LoadingProgress isLoading={isLoading} value="Зарегистрироваться" />
                </Button>
                <Box display="flex" mt="10px" gap="6px">
                    <Typography>Уже имеется аккаунт?</Typography>
                    <Typography onClick={changeIsSignIn} className="pointer" color="primary">
                        Авторизоваться
                    </Typography>
                </Box>
            </Box>
        </form>
    );
};
