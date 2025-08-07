import React, { useState } from 'react';
import {
    Box,
    Container,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    Paper,
    useTheme,
} from '@mui/material';
import { ReferenceBookEditor } from '../../widgets/referenceBook/ReferenceBookEditor.tsx';
import { useReferenceBook } from '../../app/domain/hooks/useReferenceBooks/useReferenceBook.ts';

export const ReferenceBooksPage: React.FC = () => {
    const [selectedBook, setSelectedBook] = useState<string>('');
    const { referenceBooks } = useReferenceBook();
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ width: '100%', p: '10px', display: 'flex', gap: 3 }}>
            {/* Левая панель */}
            <Paper
                elevation={4}
                sx={{
                    maxWidth: '400px',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: theme.shadows[1],
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        p: 2,
                        fontWeight: 'bold',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    Справочники
                </Typography>
                <List
                    disablePadding
                    sx={{
                        overflowY: 'auto',
                        maxHeight: 'calc(100vh - 200px)',
                    }}
                >
                    {referenceBooks &&
                        Object.keys(referenceBooks).map((book) => (
                            <ListItemButton
                                className="pointer"
                                key={book}
                                selected={selectedBook === book}
                                onClick={() => setSelectedBook(book)}
                                sx={{
                                    px: 3,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                    },
                                }}
                            >
                                <ListItemText primary={book} />
                            </ListItemButton>
                        ))}
                </List>
            </Paper>

            {/* Правая область */}
            <Box
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    boxShadow: theme.shadows[1],
                    overflowY: 'auto',
                }}
            >
                {selectedBook ? (
                    <>
                        <Typography
                            variant="h6"
                            sx={{
                                p: 2,
                                fontWeight: 'bold',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            Редактирование: {selectedBook}
                        </Typography>
                        <ReferenceBookEditor referenceBookName={selectedBook} />
                    </>
                ) : (
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mt: 20 }}
                    >
                        Выберите справочник слева для редактирования
                    </Typography>
                )}
            </Box>
        </Container>
    );
};
