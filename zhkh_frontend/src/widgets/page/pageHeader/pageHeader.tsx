import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { IPageHeader } from './pageHeader.interfaces.ts';

export const PageHeader: React.FC<IPageHeader> = ({ title, body, path, buttonTitle }) => {
    const navigate = useNavigate();

    return (
        <Box mt={4} mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    {title}
                </Typography>
                {buttonTitle && path && (
                    <Button onClick={() => navigate(path)} variant="contained" size="small">
                        {buttonTitle}
                    </Button>
                )}
            </Box>
            <Typography variant="body1" mt={1}>
                {body}
            </Typography>
        </Box>
    );
};
