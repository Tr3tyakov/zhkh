import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useEnqueueSnackbar } from '../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { useReferenceBook } from '../../app/domain/hooks/useReferenceBooks/useReferenceBook.ts';
import { useInjection } from '../../app/domain/hooks/useInjection.ts';
import { IReferenceBookAPI } from '../../app/domain/services/referenceBooks/referenceBookAPI.interfaces.ts';
import { ReferenceBookAPIKey } from '../../app/domain/services/referenceBooks/key.ts';
import { handleError } from '../../shared/common/handlerError.ts';
import { motion } from 'framer-motion';
import { defaultMotionConfig } from '../../app/domain/motion/motionBox.ts';

interface ReferenceBookValue {
    id: number;
    value: string;
}

interface Props {
    referenceBookName: string;
}

const MotionListItem = motion.create(ListItem);

export const ReferenceBookEditor: React.FC<Props> = ({ referenceBookName }) => {
    const { referenceBooks, referenceBookIds, fetchReferenceBooks } = useReferenceBook();
    const [editValue, setEditValue] = useState<string>('');
    const [editId, setEditId] = useState<number | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const referenceBookAPI = useInjection<IReferenceBookAPI>(ReferenceBookAPIKey);
    const { openSnackbar } = useEnqueueSnackbar();

    // Открыть диалог добавления или редактирования
    const handleOpenDialog = (value?: ReferenceBookValue) => {
        if (value) {
            setEditId(value.id);
            setEditValue(value.value);
        } else {
            setEditId(null);
            setEditValue('');
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => setDialogOpen(false);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const id = referenceBookIds![referenceBookName];

            await referenceBookAPI.createBookValue(id, editValue);
            await fetchReferenceBooks();
            setEditValue('');
            setDialogOpen(false);
            openSnackbar({
                message: 'Значение успешно сохранено',
                variant: 'default',
            });
        } catch (e) {
            handleError(e, openSnackbar);
        } finally {
            setIsLoading(false);
            setDialogOpen(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true);
            await referenceBookAPI.deleteBookValue(id);
            await fetchReferenceBooks();
            openSnackbar({
                message: 'Значение успешно удалено',
                variant: 'default',
            });
        } catch (e) {
            handleError(e, openSnackbar);
        } finally {
            setIsLoading(false);
        }
    };
    const handleEditValue = async () => {
        try {
            setIsLoading(true);
            await referenceBookAPI.updateBookValue(editId!, editValue);
            await fetchReferenceBooks();
            openSnackbar({
                message: 'Значение успешно изменено',
                variant: 'default',
            });
        } catch (e) {
            handleError(e, openSnackbar);
        } finally {
            setIsLoading(false);
            setDialogOpen(false);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            if (editId) {
                handleEditValue();
            } else {
                handleSave();
            }
        }
    };

    const save = () => {
        if (editId) {
            handleEditValue();
        } else {
            handleSave();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: '10px' }}>
            <Box maxHeight="calc(100vh - 290px)" overflow="auto">
                <List>
                    {referenceBooks &&
                        referenceBooks[referenceBookName].map((value, index) => (
                            <MotionListItem
                                {...defaultMotionConfig}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                key={value.id}
                                divider
                            >
                                <ListItemText primary={value.value} />
                                <Box display="flex" gap="10px">
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => handleOpenDialog(value)}
                                        sx={{ ml: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDelete(value.id)}
                                        sx={{ ml: 1 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </MotionListItem>
                        ))}

                    {referenceBooks && referenceBooks[referenceBookName].length === 0 && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: 'center', mt: 2 }}
                        >
                            Нет значений
                        </Typography>
                    )}
                </List>
                {/* Диалог добавления/редактирования */}
                <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle>
                        {editId ? 'Редактировать значение' : 'Добавить новое значение'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Значение"
                            fullWidth
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={onKeyDown}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Отмена</Button>
                        <Button variant="contained" onClick={save}>
                            Сохранить
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={() => handleOpenDialog()}
                >
                    Добавить значение
                </Button>
            </Box>
        </Container>
    );
};
