import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, useTheme } from '@mui/material';
import { useReferenceBook } from '../hooks/useReferenceBooks/useReferenceBook.ts';

interface CustomSelectProps {
    label: string;
    name: string;
    options?: { label: string; value: string }[];
    formik: any; // типизируй по возможности, например FormikProps
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ label, name, options, formik }) => {
    const theme = useTheme();
    const { referenceBooks } = useReferenceBook();
    const [isEditing, setIsEditing] = useState(false);
    const error = formik.touched[name] && Boolean(formik.errors[name]);

    const handleBlur = (event: React.FocusEvent<any>) => {
        setIsEditing(false);
        formik.handleBlur(event);
    };

    if (!options) {
        options = referenceBooks?.[label] || [];
    }

    return (
        <Box
            className="pointer"
            display="flex"
            flexDirection="column"
            borderRadius={3}
            padding="12px 16px"
            height="70px"
            width="100%"
            minWidth="355px"
            boxShadow={error ? 'inset 0px 0px 5px #fcbebe' : undefined}
            border={`1px solid ${error ? theme.palette.error.main : '#e5e5e5'}`}
            onClick={() => !isEditing && setIsEditing(true)}
            sx={{ cursor: isEditing ? 'text' : 'pointer' }}
        >
            <Typography fontSize="14px" color={error ? theme.palette.error.main : 'gray'} mb={0.5}>
                {label}
            </Typography>

            <Select
                name={name}
                {...formik.getFieldProps(name)}
                onBlur={handleBlur}
                variant="standard"
                fullWidth
                error={error}
                autoFocus={isEditing}
                onClick={(e) => e.stopPropagation()}
                sx={{
                    '& .MuiSelect-select': {
                        fontSize: '14px',
                        fontWeight: 600,
                        padding: 0,
                    },
                    '&:before': {
                        borderBottom: `1px solid ${error ? theme.palette.error.main : '#e5e5e5'}`,
                    },
                    '&:hover:not(.Mui-disabled):before': {
                        borderBottom: `2px solid ${error ? theme.palette.error.main : theme.palette.primary.main}`,
                    },
                    '&:after': {
                        borderBottomColor: error
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        borderBottomWidth: 2,
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.value}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};
