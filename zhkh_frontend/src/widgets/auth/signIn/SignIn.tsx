import {Box, Button, TextField, Typography} from '@mui/material';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {ISignIn} from './signIn.interfaces.ts';
import React, {useState} from 'react';
import {useEnqueueSnackbar} from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import {LoadingProgress} from '../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import {getErrorLog, getErrorMessage} from '../../../shared/api/base.ts';
import {useNavigate} from 'react-router-dom';
import {IAuthorizationData, IUserAPI,} from '../../../app/domain/services/users/userAPI.interfaces.ts';
import {useInjection} from '../../../app/domain/hooks/useInjection.ts';
import {UserAPIKey} from '../../../app/domain/services/users/key.ts';
import {AuditLogAPIKey} from '../../../app/domain/services/auditLogs/key.ts';
import {IAuditLogAPI} from '../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import {AuditLogEnum, EntityTypeEnum} from '../../../app/infrastructures/enums/auditLog.ts';
import {useUser} from '../../../app/domain/hooks/useUser/useUser.ts';
import Icon from '../../../app/assets/icons/icon.png';
import {useReferenceBook} from "../../../app/domain/hooks/useReferenceBooks/useReferenceBook.ts";

export const SignIn: React.FC<ISignIn> = ({ changeIsSignIn }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { openSnackbar } = useEnqueueSnackbar();
    const { setupUser } = useUser();
    const navigate = useNavigate();
    const userAPI = useInjection<IUserAPI>(UserAPIKey);
    const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);
    const {fetchReferenceBooks} = useReferenceBook();

    const formik = useFormik<IAuthorizationData>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Некорректная почта').required('Введите почту'),
            password: Yup.string().required('Введите пароль'),
        }),
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const userId = await userAPI.authorization({
                    email: values.email.trim(),
                    password: values.password.trim(),
                });
                const user = await userAPI.getUserInformation();
                setupUser(user);
                await fetchReferenceBooks()
                console.log(1)

                await auditLogAPI.createAuditLog({
                    userId,
                    logType: AuditLogEnum.ENTER_TO_SYSTEM,
                    entityType: EntityTypeEnum.USER,
                    description: 'Авторизация в системе',
                    actionResult: 'Успешно',
                });
                navigate('/houses');
                formik.resetForm();
            } catch (e) {
                const message = getErrorMessage(e);
                openSnackbar({
                    message: message,
                    variant: 'default',
                });

                await auditLogAPI.createAuditLog({
                    logType: AuditLogEnum.ENTER_TO_SYSTEM,
                    description: 'Авторизация в системе',
                    entityType: EntityTypeEnum.USER,
                    actionResult: message,
                    logMetadata: JSON.stringify(getErrorLog(e)),
                });
            } finally {
                setIsLoading(false);
            }
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
            <Box>
                <Box width="100%" display="flex" justifyContent="center">
                    <Box component="img" src={Icon} />
                </Box>
                <Typography fontSize="24px" mb="10px" fontWeight={500}>
                    С этого шага начинается управление жилым фондом
                </Typography>
                <Box width="100%" mt="20px">
                    <Box display="flex" flexDirection="column" gap="10px" mb="40px">
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
                        <LoadingProgress isLoading={isLoading} value="Войти" />
                    </Button>
                    {/*<Box display="flex" mt="10px" gap="6px">*/}
                    {/*    /!*<Typography>Нет аккаунта?</Typography>*!/*/}
                    {/*    <Typography onClick={changeIsSignIn} className="pointer" color="primary">*/}
                    {/*        Зарегистрироваться*/}
                    {/*    </Typography>*/}
                    {/*</Box>*/}
                </Box>
            </Box>
        </form>
    );
};
