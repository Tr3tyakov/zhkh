import { FormikHelpers, FormikValues } from 'formik';
import { ObjectSchema } from 'yup';

interface IUserForm<T extends FormikValues> {
    initialValues: T;
    isLoading: boolean;
    onSubmit: (data: T, formikHelpers: FormikHelpers<T>) => Promise<void>;
    title: string;
    isEdit?: boolean;
    setupUser?: (data: T) => void;
    userValidationSchema: ObjectSchema<any>;
}

export type { IUserForm };
