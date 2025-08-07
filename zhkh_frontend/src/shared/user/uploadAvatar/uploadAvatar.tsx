import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { IconButton, CircularProgress, Box } from '@mui/material';
import { useEnqueueSnackbar } from '../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { getErrorMessage } from '../../api/base.ts';
import { useInjection } from '../../../app/domain/hooks/useInjection.ts';
import { IUserAPI } from '../../../app/domain/services/users/userAPI.interfaces.ts';
import { UserAPIKey } from '../../../app/domain/services/users/key.ts';
import { IUploadAvatar } from './uploadAvatar.interfaces.ts';

export const UploadAvatar = ({ user, setupUser }: IUploadAvatar) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { openSnackbar } = useEnqueueSnackbar();
    const userAPI = useInjection<IUserAPI>(UserAPIKey);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (user && reader.result) {
                setupUser({
                    ...user,
                    filePath: reader.result as string,
                });
            }
        };
        try {
            setIsLoading(true);
            await userAPI.uploadAvatar(user!.id, file);
            reader.readAsDataURL(file);
        } catch (e) {
            openSnackbar({
                message: getErrorMessage(e),
                variant: 'default',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <IconButton component="label" disabled={isLoading}>
            <Box sx={{ position: 'relative' }}>
                <Avatar
                    sx={{ width: 120, height: 120 }}
                    alt="Аватар пользователя"
                    src={user?.filePath}
                />
                {isLoading && (
                    <CircularProgress
                        size={120}
                        thickness={1}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 1,
                        }}
                    />
                )}
            </Box>
            <input
                type="file"
                accept="image/*"
                style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0 0 0 0)',
                    border: 0,
                }}
                onChange={handleAvatarChange}
            />
        </IconButton>
    );
};
