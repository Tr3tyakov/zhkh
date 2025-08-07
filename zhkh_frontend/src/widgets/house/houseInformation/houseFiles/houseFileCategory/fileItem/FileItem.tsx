import React, { useState } from 'react';
import { Box, IconButton, Link, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { useInjection } from '../../../../../../app/domain/hooks/useInjection.ts';
import { useEnqueueSnackbar } from '../../../../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { IUserAPI } from '../../../../../../app/domain/services/users/userAPI.interfaces.ts';
import { UserAPIKey } from '../../../../../../app/domain/services/users/key.ts';
import { IFileItem } from './fileItem.interfaces.ts';
import { getErrorMessage } from '../../../../../../shared/api/base.ts';
import { LoadingProgress } from '../../../../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import dayjs from 'dayjs';

export const FileItem: React.FC<IFileItem> = ({ file, onDeleted }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userAPI = useInjection<IUserAPI>(UserAPIKey);
    const { openSnackbar } = useEnqueueSnackbar();

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await userAPI.deleteHouseFile(file.id);
            openSnackbar({ message: 'Файл успешно удалён', variant: 'default' });
            onDeleted();
        } catch (e) {
            openSnackbar({
                message: getErrorMessage(e),
                variant: 'default',
            });
        } finally {
            {
                setIsLoading(false);
            }
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <Stack flexDirection="row" gap="10px">
                <Link href={file.link} target="_blank" rel="noopener noreferrer">
                    {file.fileName}
                </Link>
                {dayjs(file.createdAt, 'DD.MM.YY HH:mm:ss').format('D MMMM HH:mm')}
            </Stack>
            <Box>
                <IconButton href={file.link} download>
                    <DownloadIcon />
                </IconButton>
                <IconButton onClick={handleDelete}>
                    <LoadingProgress isLoading={isLoading} size={24} value={<DeleteIcon />} />
                </IconButton>
            </Box>
        </Box>
    );
};
