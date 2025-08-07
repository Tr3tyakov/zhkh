import { FormikContextType } from 'formik';

interface IFieldGroup<T> {
    name: string;
    title: string;
    type?: string;
    width?: number;
    mask?: string;
    formik: FormikContextType<T>;
    defaultTitle?: string;
}

export type { IFieldGroup };
