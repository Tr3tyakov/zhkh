import React from 'react';
import { CircularProgress, Box, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { IProgressInterval } from './ProgressInterval.interfaces.ts';

const CircularProgressInterval: React.FC<IProgressInterval> = ({
    changeCancel,
    size = 20,
    circularProgressColor = 'white',
    iconColor = 'default',
    timeoutTime = 5000,
}) => {
    const [progress, setProgress] = React.useState(0);

    const stateMagnifer = React.useMemo(() => {
        return 10000 / timeoutTime;
    }, []);

    const handleChangeValue = () => {
        setProgress((state) => state + stateMagnifer);
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            handleChangeValue();
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
        }, timeoutTime);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box position="relative" display="flex" alignItems="center" justifyContent="center">
            <CircularProgress
                sx={{ color: circularProgressColor }}
                variant="determinate"
                size={size}
                value={progress}
            />
            <Box className="circular__clear">
                <IconButton color={iconColor} onClick={changeCancel}>
                    <ClearIcon
                        sx={{
                            width: '16px',
                            height: '16px',
                            color: iconColor === 'default' ? 'white' : iconColor,
                        }}
                    />
                </IconButton>
            </Box>
        </Box>
    );
};

export default CircularProgressInterval;
