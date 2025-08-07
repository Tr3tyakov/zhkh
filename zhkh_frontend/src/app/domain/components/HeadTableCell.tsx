import { TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HeaderTableCell = styled(TableCell)(({ theme }) => ({
    color: '#fff',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
}));
