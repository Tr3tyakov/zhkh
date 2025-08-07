import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Button,
    Stack,
    MenuItem,
    Checkbox,
    ListItemText,
    Select,
    FormControl,
    OutlinedInput,
    InputLabel,
    Collapse,
    SelectChangeEvent,
} from '@mui/material';
import useDebounce from '../../../app/domain/hooks/useDebounce/useDebounce.ts';
import { LoadingProgress } from '../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { accountStatusOptions, typeOptions } from '../../../app/infrastructures/enums/translation/user.ts';

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
        },
    },
};

export const UserFilter: React.FC<IUserFilter> = ({ isLoading, setPage, filters, setFilters }) => {
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [textField, setTextField] = useState<string>('');
    const debouncedText = useDebounce(textField, 500);

    const handleReset = () => {
        setFilters({});
        setTextField('');
        setPage(1);
    };
    const handleMultiSelectChange =
        (filterField: keyof S) => (event: SelectChangeEvent<string[]>) => {
            const value = event.target.value as string[];
            setFilters((prev) => ({
                ...prev,
                [filterField]: value.length ? value : undefined,
            }));
            setPage(1);
        };

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            searchValue: debouncedText || '',
        }));
        setPage(1);
    }, [debouncedText]);

    return (
        <>
            <Box
                width="100%"
                display="flex"
                gap="10px"
                alignItems="center"
                justifyContent="flex-end"
            >
                <Stack flexDirection="row" gap="10px">
                    <Button size="small" variant="contained" color="primary" onClick={handleReset}>
                        Сбросить фильтры
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                    >
                        Все фильтры
                    </Button>
                </Stack>
            </Box>
            <Box display="flex" flexDirection="column" gap={2} mt={2} mb={2}>
                <TextField
                    onChange={(e) => setTextField(e.target.value)}
                    label="Поиск по имени"
                    variant="outlined"
                    fullWidth
                    value={textField}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <LoadingProgress isLoading={isLoading} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Collapse in={isFilterOpen}>
                    <Stack direction="row" gap="10px">
                        <FormControl fullWidth>
                            <InputLabel id="user-type-label">Тип пользователя</InputLabel>
                            <Select
                                labelId="user-type-label"
                                multiple
                                value={filters.userType || []}
                                onChange={handleMultiSelectChange('userType')}
                                input={<OutlinedInput label="Тип пользователя" />}
                                renderValue={(selected) =>
                                    typeOptions
                                        .filter((opt) => (selected as string[]).includes(opt.value))
                                        .map((opt) => opt.label)
                                        .join(', ')
                                }
                                MenuProps={MenuProps}
                            >
                                {typeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Checkbox
                                            checked={
                                                filters.userType?.includes(option.value) || false
                                            }
                                        />
                                        <ListItemText primary={option.label} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="account-status-label">Статус пользователя</InputLabel>
                            <Select
                                labelId="account-status-label"
                                multiple
                                value={filters.accountStatus || []}
                                onChange={handleMultiSelectChange('accountStatus')}
                                input={<OutlinedInput label="Статус пользователя" />}
                                renderValue={(selected) =>
                                    accountStatusOptions
                                        .filter((opt) => (selected as string[]).includes(opt.value))
                                        .map((opt) => opt.label)
                                        .join(', ')
                                }
                                MenuProps={MenuProps}
                            >
                                {accountStatusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Checkbox
                                            checked={
                                                filters.accountStatus?.includes(option.value) ||
                                                false
                                            }
                                        />
                                        <ListItemText primary={option.label} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Collapse>
            </Box>
        </>
    );
};
