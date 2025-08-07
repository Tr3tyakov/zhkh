import { TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BodyTableCell = styled(TableCell)(({ theme }) => ({
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
}));
