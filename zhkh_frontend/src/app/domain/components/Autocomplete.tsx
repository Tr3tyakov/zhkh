import React, { useState, useEffect, useRef } from 'react';
import { MenuItem, Typography, Box, useTheme, Select, SelectChangeEvent } from '@mui/material';
import { useReferenceBook } from '../../../app/domain/hooks/useReferenceBooks/useReferenceBook';

interface ReferenceSelectEditableProps {
    name: string;
    title: string;
    referenceKey: string;
    formik: any;
    width?: number;
    defaultTitle?: string;
}

export const ReferenceSelect: React.FC<ReferenceSelectEditableProps> = ({
    name,
    title,
    referenceKey,
    formik,
    width = 300,
    defaultTitle = 'Не выбрано',
}) => {
    const theme = useTheme();
    const { referenceBooks } = useReferenceBook();
    const options = referenceBooks?.[referenceKey] || [];

    const [isEditing, setIsEditing] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const error = formik.touched[name] && Boolean(formik.errors[name]);

    // При активации редактирования ставим фокус и раскрываем меню
    useEffect(() => {
        if (isEditing && selectRef.current) {
            // Фокусируем кнопку селекта (MUI оборачивает select в кнопку)
            const button = selectRef.current.querySelector('button') as HTMLElement | null;
            if (button) {
                button.focus();
                // Через микро-таймаут имитируем клик для открытия меню
                setTimeout(() => {
                    button.click();
                }, 0);
            }
        }
    }, [isEditing]);

    const handleClose = () => {
        setIsEditing(false);
        formik.setFieldTouched(name, true, true);
    };

    const handleBlur = (event: React.FocusEvent<any>) => {
        // Задержка нужна, чтобы дать время выбрать пункт меню
        setTimeout(() => {
            // Проверяем, что фокус ушел не обратно в селект
            const activeEl = document.activeElement;
            if (!selectRef.current?.contains(activeEl)) {
                handleClose();
                formik.handleBlur(event);
            }
        }, 100);
    };

    const handleChange = (event: SelectChangeEvent<any>) => {
        formik.setFieldValue(name, event.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            formik.setFieldValue(name, formik.initialValues[name]);
            formik.setFieldTouched(name, false, false);
            setIsEditing(false);
        }
        if (e.key === 'Enter') {
            handleClose();
        }
    };

    const selectedOption = options.find((opt: any) => opt.id === formik.values[name]);

    const onClickWrapper = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isEditing) {
            e.stopPropagation();
            setIsEditing(true);
        }
    };

    return (
        <Box
            ref={selectRef}
            className="pointer"
            display="flex"
            flexDirection="column"
            borderRadius={3}
            padding="12px 16px"
            height="70px"
            width={width}
            boxShadow={error ? 'inset 0px 0px 5px #fcbebe' : undefined}
            border={`1px solid ${error ? theme.palette.error.main : '#e5e5e5'}`}
            onClick={onClickWrapper}
            sx={{ cursor: isEditing ? 'text' : 'pointer' }}
        >
            <Typography fontSize="14px" color={error ? theme.palette.error.main : 'gray'} mb={0.5}>
                {title}
            </Typography>

            {isEditing ? (
                <Select
                    size="small"
                    fullWidth
                    value={formik.values[name] ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    error={error}
                    variant="standard"
                    autoFocus
                    displayEmpty
                    renderValue={(selected) => {
                        if (!selected) return <em>{defaultTitle}</em>;
                        const opt = options.find((o) => o.id === selected);
                        return opt ? opt.value : defaultTitle;
                    }}
                >
                    <MenuItem value="">
                        <em>{defaultTitle}</em>
                    </MenuItem>
                    {options.map((option: any) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.value}
                        </MenuItem>
                    ))}
                </Select>
            ) : (
                <Typography
                    variant="body1"
                    sx={{ userSelect: 'none', minHeight: '24px', lineHeight: 1.5 }}
                >
                    {selectedOption ? selectedOption.value : defaultTitle}
                </Typography>
            )}

            {error && (
                <Typography
                    variant="caption"
                    color={theme.palette.error.main}
                    mt={0.5}
                    sx={{ display: 'block' }}
                >
                    {formik.errors[name]}
                </Typography>
            )}
        </Box>
    );
};
