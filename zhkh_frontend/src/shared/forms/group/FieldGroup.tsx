import { Box } from '@mui/material';
import { IFieldGroup } from './fieldGroup.interfaces.ts';
import { JSX } from 'react';
import { EditField } from '../../user/editField/editField.tsx';

export const FieldGroup = <T,>(props: IFieldGroup<T>): JSX.Element => {
    const { name, mask, title, type, width = 'max-content', formik, defaultTitle } = props;

    return (
        <Box flex={1} width="100%" maxWidth={`${width}px`}>
            <EditField
                mask={mask}
                name={name}
                title={title}
                type={type}
                formik={formik}
                defaultTitle={defaultTitle}
            />
        </Box>
    );
};
