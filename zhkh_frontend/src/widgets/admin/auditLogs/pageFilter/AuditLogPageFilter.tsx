import React from 'react';
import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import { LoadingProgress } from '../../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {
    auditLogOptions,
    entityTypeOptions,
} from '../../../../pages/auditLogs/auditLogs.constants.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../../../app/infrastructures/enums/auditLog.ts';
import { AuditLogsPageFilterProps } from './auditLogPageFilter.interfaces.ts';

export const AuditLogsPageFilter: React.FC<AuditLogsPageFilterProps> = ({
    filters,
    setFilters,
    isLoading,
    handlePageChange,
    label,
}) => {
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, searchValue: e.target.value }));
    };

    const onUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFilters((prev) => ({
            ...prev,
            findUserId: val ? Number(val) : undefined,
        }));
    };

    const onStartDateChange = (date: Dayjs | null) => {
        setFilters((prev) => ({
            ...prev,
            startDatetime: date?.isValid() ? date.toISOString() : undefined,
        }));
    };

    const onEndDateChange = (date: Dayjs | null) => {
        setFilters((prev) => ({
            ...prev,
            endDatetime: date?.isValid() ? date.toISOString() : undefined,
        }));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <Box display="flex" gap={2} mt={2} mb={2} flexWrap="wrap" alignItems="center">
                <TextField
                    label={label}
                    variant="outlined"
                    value={filters.searchValue || ''}
                    onChange={onSearchChange}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <LoadingProgress isLoading={isLoading} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Autocomplete
                    sx={{ flex: 1 }}
                    options={auditLogOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                        auditLogOptions.find((opt) => opt.value === filters.logType) ??
                        auditLogOptions[0]
                    }
                    onChange={(_, newValue) => {
                        setFilters((prev) => ({
                            ...prev,
                            logType: (newValue?.value as AuditLogEnum) || '',
                        }));
                        handlePageChange(1);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Тип события"
                            variant="outlined"
                            sx={{ minWidth: 230 }}
                        />
                    )}
                    clearOnEscape
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                />
                <Autocomplete
                    sx={{ flex: 1 }}
                    options={entityTypeOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                        entityTypeOptions.find((opt) => opt.value === filters.entityType) ??
                        entityTypeOptions[0]
                    }
                    onChange={(_, newValue) => {
                        setFilters((prev) => ({
                            ...prev,
                            entityType: (newValue?.value as EntityTypeEnum) || '',
                        }));
                        handlePageChange(1);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Сущность"
                            variant="outlined"
                            sx={{ minWidth: 230 }}
                        />
                    )}
                    clearOnEscape
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                />
                <DatePicker
                    sx={{ width: '100%' }}
                    label="Дата начала"
                    value={filters.startDatetime ? dayjs(filters.startDatetime) : null}
                    onChange={onStartDateChange}
                    slotProps={{ textField: { variant: 'outlined', sx: { width: 200 } } }}
                    maxDate={filters.endDatetime ? dayjs(filters.endDatetime) : undefined}
                />

                <DatePicker
                    sx={{ width: '100%' }}
                    label="Дата конца"
                    value={filters.endDatetime ? dayjs(filters.endDatetime) : null}
                    onChange={onEndDateChange}
                    slotProps={{ textField: { variant: 'outlined', sx: { width: 200 } } }}
                    minDate={filters.startDatetime ? dayjs(filters.startDatetime) : undefined}
                />
                <TextField
                    sx={{ flex: 1 }}
                    label="ID пользователя"
                    variant="outlined"
                    type="number"
                    value={filters.findUserId ?? ''}
                    onChange={onUserIdChange}
                />
            </Box>
        </LocalizationProvider>
    );
};
