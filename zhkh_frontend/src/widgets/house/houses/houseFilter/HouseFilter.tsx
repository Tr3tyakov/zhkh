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
} from '@mui/material';
import { IHousesFilter, IHouseFiltersState } from './houseFilter.interfaces.ts';
import { LoadingProgress } from '../../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { useReferenceBook } from '../../../../app/domain/hooks/useReferenceBooks/useReferenceBook.ts';
import { refNameToFilterField } from './houseFilter.constants.ts';
import useDebounce from '../../../../app/domain/hooks/useDebounce/useDebounce.ts';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: { maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP, width: 280 },
    },
};
export const HouseFilter: React.FC<IHousesFilter> = ({
    isLoading,
    setPage,
    filters,
    setFilters,
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const { referenceBooks } = useReferenceBook();
    const [textField, setTextField] = useState<string>('');
    const debouncedText = useDebounce(textField, 500);

    const handleNumberChange =
        (field: keyof IHouseFiltersState) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(e.target.value);
            setFilters((prev) => ({
                ...prev,
                [field]: isNaN(value) ? undefined : value,
            }));
            setPage(1);
        };

    // Универсальный обработчик мультиселектов
    const handleMultiSelectChange =
        (field: keyof IHouseFiltersState) => (event: React.ChangeEvent<{ value: unknown }>) => {
            const value = event.target.value as string[];
            setFilters((prev) => ({
                ...prev,
                [field]: value.length > 0 ? value : undefined,
            }));
            setPage(1);
        };

    const handleReset = () => {
        setFilters({});
        setTextField('');
        setPage(1);
    };

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            address: debouncedText || '',
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
                    label="Поиск по адресу"
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
                <Collapse in={isFilterOpen} unmountOnExit>
                    <Stack direction="row" gap="10px">
                        <Stack flex={1} direction="column" gap="5px" flexWrap="wrap" mb="10px">
                            Год постройки
                            <Stack flex={1} direction="row" gap="10px">
                                <TextField
                                    label="от"
                                    type="number"
                                    value={filters.commissioningYearFrom || ''}
                                    onChange={handleNumberChange('commissioningYearFrom')}
                                    fullWidth
                                />

                                <TextField
                                    label="до"
                                    type="number"
                                    value={filters.commissioningYearTo || ''}
                                    onChange={handleNumberChange('commissioningYearTo')}
                                    fullWidth
                                />
                            </Stack>
                        </Stack>
                        <Stack flex={1} direction="column" gap="5px" flexWrap="wrap">
                            Количество этажей
                            <Stack flex={1} direction="row" gap="10px">
                                <TextField
                                    label="от"
                                    type="number"
                                    value={filters.floorsCountFrom || ''}
                                    onChange={handleNumberChange('floorsCountFrom')}
                                    fullWidth
                                />
                                <TextField
                                    label="до"
                                    type="number"
                                    value={filters.floorsCountTo || ''}
                                    onChange={handleNumberChange('floorsCountTo')}
                                    fullWidth
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack flexDirection="column" gap="10px">
                        {referenceBooks &&
                            Object.entries(referenceBooks).map(([refName, options]) => {
                                const filterField = refNameToFilterField[refName];
                                if (!filterField) return null;

                                return (
                                    <FormControl key={refName} fullWidth>
                                        <InputLabel id={`${filterField}-label`}>
                                            {refName}
                                        </InputLabel>
                                        <Select
                                            labelId={`${filterField}-label`}
                                            multiple
                                            value={filters[filterField] || []}
                                            onChange={handleMultiSelectChange(filterField)}
                                            input={<OutlinedInput label={refName} />}
                                            renderValue={(selected) => {
                                                const selectedLabels = options
                                                    .filter((opt) =>
                                                        (selected as any[]).includes(opt.id)
                                                    )
                                                    .map((opt) => opt.value);
                                                return selectedLabels.join(', ');
                                            }}
                                            MenuProps={MenuProps}
                                        >
                                            {options.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    <Checkbox
                                                        checked={
                                                            filters[filterField]?.includes(
                                                                option.id
                                                            ) || false
                                                        }
                                                    />
                                                    <ListItemText primary={option.value} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                );
                            })}
                    </Stack>
                </Collapse>
            </Box>
        </>
    );
};
