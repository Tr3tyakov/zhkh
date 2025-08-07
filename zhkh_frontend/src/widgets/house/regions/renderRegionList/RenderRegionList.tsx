import { List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import { defaultMotionConfig, MotionBox } from '../../../../app/domain/motion/motionBox.ts';
import theme from '../../../../app/theme.ts';

export const RenderRegionList = (items: string[], navigate: any) => {
    if (!items || items.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                Нет данных
            </Typography>
        );
    }
    return (
        <Paper
            elevation={1}
            sx={{
                maxHeight: 400,
                overflowY: 'auto',
                p: '5px',
                bgcolor: theme.palette.background.default,
                borderRadius: 2,
            }}
        >
            <List disablePadding>
                {items.map((region, idx) => (
                    <MotionBox
                        key={region + idx}
                        {...defaultMotionConfig}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: theme.palette.action.hover,
                                cursor: 'pointer',
                            },
                        }}
                    >
                        <ListItemButton
                            sx={{ borderRadius: 2 }}
                            onClick={() =>
                                navigate(`/houses/?regions=${encodeURIComponent(region)}`)
                            }
                        >
                            <ListItemText
                                primary={region}
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                        </ListItemButton>
                    </MotionBox>
                ))}
            </List>
        </Paper>
    );
};
