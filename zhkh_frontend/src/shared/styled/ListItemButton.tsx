import { ListItemButton, styled } from '@mui/material';

export const StyleListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: '12px',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));
