import { useFormik } from 'formik';
import { Box, Button, Container, Typography } from '@mui/material';

import { Section } from '../../../shared/forms/section/Section.tsx';
import { FieldGroup } from '../../../shared/forms/group/FieldGroup.tsx';
import { LoadingProgress } from '../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { ICompanyForm } from './companyForm.interfaces.ts';
import { companyValidationSchema } from '../../../pages/company/companyPage.validation.ts';

export const CompanyForm = <T extends object>({
    title,
    isLoading,
    onSubmit,
    initialValues,
}: ICompanyForm<T>) => {
    const formik = useFormik({
        initialValues,
        validationSchema: companyValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values, formikHelpers) => {
            await onSubmit(values, formikHelpers);
        },
    });

    return (
        <Container maxWidth="lg">
            <Box mt={2} mb={4} p={3} boxShadow={1} borderRadius={5}>
                <Typography fontSize={18} fontWeight={500} gutterBottom>
                    {title}
                </Typography>

                <form onSubmit={formik.handleSubmit} noValidate>
                    <Section title="Реквизиты организации">
                        <FieldGroup name="name" title="Название компании" formik={formik} />
                        <FieldGroup
                            width={400}
                            name="legalForm"
                            title="Организационно-правовая форма"
                            formik={formik}
                        />
                        <FieldGroup name="inn" title="ИНН" formik={formik} />
                        <FieldGroup name="address" title="Юридический адрес" formik={formik} />
                    </Section>

                    <Section title="Контактные данные">
                        <FieldGroup name="phone" title="Телефон" formik={formik} />
                        <FieldGroup name="email" title="Email" formik={formik} />
                        <FieldGroup name="website" title="Официальный сайт" formik={formik} />
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
                </form>
            </Box>
        </Container>
    );
};
