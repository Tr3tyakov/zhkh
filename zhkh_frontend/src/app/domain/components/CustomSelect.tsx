import React, {useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import {useReferenceBook} from '../hooks/useReferenceBooks/useReferenceBook.ts';
import AddIcon from '@mui/icons-material/Add';
import useSidebar from '../hooks/useSidebar/useSidebar.ts';
import {useInjection} from '../hooks/useInjection.ts';
import {IReferenceBookAPI} from '../services/referenceBooks/referenceBookAPI.interfaces.ts';
import {ReferenceBookAPIKey} from '../services/referenceBooks/key.ts';
import {handleError} from '../../../shared/common/handlerError.ts';
import {useEnqueueSnackbar} from '../hooks/useSnackbar/useEnqueueSnackbar.ts';

interface CustomSelectProps {
    label: string;
    name: string;
    options?: { label: string; value: string }[];
    formik: any; // типизируй по возможности, например FormikProps
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ label, name, options, formik }) => {
    const theme = useTheme();
    const { referenceBooks, referenceBookIds, fetchReferenceBooks } = useReferenceBook();
    const referenceBookAPI = useInjection<IReferenceBookAPI>(ReferenceBookAPIKey);

    const { isSidebarOpen, handleClose } = useSidebar();
    const { openSnackbar } = useEnqueueSnackbar();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [bookValue, setBookValue] = useState<string>('');
    const error = formik.touched[name] && Boolean(formik.errors[name]);

    const handleBlur = (event: React.FocusEvent<any>) => {
        setIsEditing(false);
        formik.handleBlur(event);
    };

    if (!options) {
        options = referenceBooks?.[label] || [];
    }

    const save = async () => {
        try {
            setIsLoading(true);
            const id = referenceBookIds![label];

            await referenceBookAPI.createBookValue(id, bookValue);
            await fetchReferenceBooks();
            setBookValue('');
            openSnackbar({
                message: 'Значение успешно сохранено',
                variant: 'default',
            });
        } catch (e) {
            handleError(e, openSnackbar);
        } finally {
            setIsLoading(false);
            handleClose();

        }
    };
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            save();
        }
    };


    return (
        <>
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
                    value={formik.values[name]}
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
                    <MenuItem onClick={handleClose}>
                        <AddIcon fontSize="small" sx={{ mr: 1 }} />
                        Добавить новое
                    </MenuItem>
                </Select>
            </Box>
            <Dialog open={isSidebarOpen} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Добавить новое значение
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Значение"
                        fullWidth
                        value={bookValue}
                        onChange={(e) => setBookValue(e.target.value)}
                        onKeyDown={onKeyDown}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button disabled={isLoading} variant="contained" onClick={save}>
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
};
