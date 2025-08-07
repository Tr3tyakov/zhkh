import { FormikProps } from 'formik';

interface IEditField {
    title: string;
    name: string;
    formik: FormikProps<any>;
    type?: string;
    mask?: string;
    defaultTitle?: string;
}

export type { IEditField };
