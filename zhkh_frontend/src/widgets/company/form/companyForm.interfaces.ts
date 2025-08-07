import { FormikHelpers } from 'formik';

interface ICompanyForm<T extends object> {
    initialValues: T;
    isLoading: boolean;
    onSubmit: (data: T, formikHelpers: FormikHelpers<T>) => Promise<void>;
    title: string;
}

export type { ICompanyForm };
