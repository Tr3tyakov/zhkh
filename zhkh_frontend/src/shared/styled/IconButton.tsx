import { IconButton, styled } from '@mui/material';

export const RecIconButton = styled(IconButton)(() => ({
    borderRadius: '4px',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // или ваш цвет
    },
}));
