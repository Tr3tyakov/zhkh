import { Box, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import useDebounce from '../../../app/domain/hooks/useDebounce/useDebounce.ts';
import { LoadingProgress } from '../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { IPageFilter } from './pageFilter.interfaces.ts';

export const PageFilter = <S,>({
    filters,
    setFilters,
    isLoading,
    handlePageChange,
    label,
}: IPageFilter<S>) => {
    const [textField, setTextField] = useState<string>('');
    const debounceValue = useDebounce<string>(textField, 600);

    useEffect(() => {
        setFilters({ ...filters, searchValue: debounceValue });
        handlePageChange(1);
    }, [debounceValue]);

    return (
        <Box display="flex" gap={2} mt={2} mb={2} flexWrap="wrap">
            <TextField
                onChange={(e) => setTextField(e.target.value)}
                label={label}
                variant="outlined"
                fullWidth
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <LoadingProgress isLoading={isLoading} />
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Box>
    );
};
