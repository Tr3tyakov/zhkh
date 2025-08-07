import { Box, Button, Container, Typography } from '@mui/material';
import { useFormik } from 'formik';

import { FieldGroup } from '../../../shared/forms/group/FieldGroup.tsx';
import { Section } from '../../../shared/forms/section/Section.tsx';
import { CustomSelect } from '../../../app/domain/components/CustomSelect.tsx';
import { IUserForm } from './userForm.interfaces.ts';
import { LoadingProgress } from '../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { UploadAvatar } from '../../../shared/user/uploadAvatar/uploadAvatar.tsx';
import {
    accountStatusOptions,
    typeOptions,
} from '../../../app/infrastructures/enums/translation/user.ts';
import { IUserResponse } from '../../../app/domain/services/users/userAPI.interfaces.ts';
import { useCallback } from 'react';

export const UserForm = <T extends IUserResponse>({
    initialValues,
    isLoading,
    title,
    onSubmit,
    isEdit,
    setupUser,
    userValidationSchema,
}: IUserForm<T>) => {
    const formik = useFormik({
        initialValues,
        validationSchema: userValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values, formikHelpers) => {
            await onSubmit(values, formikHelpers);
        },
    });
    const handleSetupUser = useCallback(
        (user: IUserResponse | null) => {
            if (setupUser) setupUser(user as T);
        },
        [setupUser]
    );

    return (
        <form onSubmit={formik.handleSubmit}>
            <Container maxWidth="lg">
                <Box mt={2} mb={4} p={3} boxShadow={1} borderRadius={5}>
                    <Typography fontSize={18} fontWeight={500} gutterBottom>
                        {title}
                    </Typography>

                    {isEdit && (
                        <Box>
                            <UploadAvatar user={initialValues} setupUser={handleSetupUser} />
                        </Box>
                    )}

                    <Section title="Личные данные">
                        <Box width="100%" display="flex" gap="10px">
                            <FieldGroup name="firstName" title="Имя" formik={formik} />
                            <FieldGroup name="middleName" title="Фамилия" formik={formik} />
                            <FieldGroup name="lastName" title="Отчество" formik={formik} />
                        </Box>
                        <Box width="100%">
                            <FieldGroup name="email" title="Почта" formik={formik} />
                        </Box>
                        <Box width="40%">
                            <FieldGroup
                                name="password"
                                title="Пароль"
                                type="password"
                                defaultTitle={isEdit ? 'Введите новый пароль..' : 'Отсутствует'}
                                formik={formik}
                            />
                        </Box>
                    </Section>

                    <Section title="Тип и статус">
                        <CustomSelect
                            label="Тип пользователя"
                            formik={formik}
                            options={typeOptions}
                            name="userType"
                        />
                        <CustomSelect
                            label="Статус пользователя"
                            formik={formik}
                            options={accountStatusOptions}
                            name="accountStatus"
                        />
                    </Section>

                    <Section title="Контакты и аватар">
                        <FieldGroup
                            mask="+{7} (000) 000-00-00"
                            name="privatePhone"
                            title="Личный телефон"
                            type="tel"
                            formik={formik}
                        />
                        <FieldGroup
                            mask="+{7} (000) 000-00-00"
                            name="workPhone"
                            title="Рабочий телефон"
                            type="tel"
                            formik={formik}
                        />
                    </Section>
                    <Box mt={4} textAlign="center">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                            size="large"
                        >
                            <LoadingProgress isLoading={isLoading} value="Сохранить" />
                        </Button>
                    </Box>
                </Box>
            </Container>
        </form>
    );
};
