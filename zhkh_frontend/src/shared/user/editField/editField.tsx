import React, { useState } from 'react';
import { Box, TextField, Typography, useTheme } from '@mui/material';
import { IEditField } from './editField.interfaces.ts';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { MaskedInput } from '../../../app/domain/components/MaskedTextField.tsx';
import dayjs from 'dayjs';

export const EditField: React.FC<IEditField> = ({
    title,
    name,
    formik,
    type,
    mask,
    defaultTitle = 'Отсутствует',
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const theme = useTheme();
    const { openSnackbar } = useEnqueueSnackbar();

    const isError = formik.touched[name] && Boolean(formik.errors[name]);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsEditing(false);
        formik.handleBlur(e);

        const val = e.target.value;

        // если дата -> сохраняем в ISO формате
        if (val && type === 'date') {
            const parsed = dayjs(val, 'DD.MM.YYYY', true);
            if (parsed.isValid()) {
                formik.setFieldValue(e.target.name, parsed.format('YYYY-MM-DD'));
            }
        }

        if (formik.errors[name]) {
            openSnackbar({ message: formik.errors[name] as string, variant: 'default' });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsEditing(false);
            formik.setFieldTouched(name, true, true);
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            formik.setFieldValue(name, formik.initialValues[name]);
            formik.setFieldTouched(name, false, false);
        }
    };

    // преобразуем значение для UI (только если type = date)
    const displayValue =
        type === 'date' && formik.values[name]
            ? dayjs(formik.values[name], 'YYYY-MM-DD').format('DD.MM.YYYY')
            : formik.values[name];

    return (
        <Box
            flex={1}
            className="pointer"
            display="flex"
            flexDirection="column"
            borderRadius={3}
            padding="12px 16px"
            height="70px"
            boxShadow={isError ? 'inset 0px 0px 5px #fcbebe' : undefined}
            border={`1px solid ${isError ? theme.palette.error.main : '#e5e5e5'}`}
            onClick={() => !isEditing && setIsEditing(true)}
            sx={{ cursor: isEditing ? 'text' : 'pointer' }}
        >
            <Typography
                whiteSpace="nowrap"
                fontSize="14px"
                color={isError ? theme.palette.error.main : 'gray'}
                mb={0.5}
            >
                {title}
            </Typography>

            {isEditing ? (
                mask ? (
                    <TextField
                        variant="standard"
                        size="small"
                        type={type === 'date' ? 'text' : type} // если дата → текстовое поле с маской
                        autoFocus
                        {...formik.getFieldProps(name)}
                        onBlur={handleBlur}
                        InputProps={{
                            inputComponent: MaskedInput as any,
                        }}
                        inputProps={{ mask }}
                        error={isError}
                        sx={{
                            '& .MuiInput-underline:after': {
                                borderBottomColor: isError ? theme.palette.error.main : undefined,
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: 0,
                            },
                        }}
                    />
                ) : (
                    <TextField
                        variant="standard"
                        autoFocus
                        size="small"
                        type={type}
                        onKeyDown={handleKeyDown}
                        {...formik.getFieldProps(name)}
                        error={isError}
                        onBlur={handleBlur}
                        sx={{
                            '& .MuiInput-underline:after': {
                                borderBottomColor: isError ? theme.palette.error.main : undefined,
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: 0,
                            },
                        }}
                    />
                )
            ) : (
                <Typography
                    whiteSpace="nowrap"
                    height="20px"
                    fontSize="14px"
                    fontWeight={600}
                    onClick={() => setIsEditing(true)}
                    sx={{ userSelect: 'none' }}
                >
                    {displayValue || defaultTitle}
                </Typography>
            )}
        </Box>
    );
};
