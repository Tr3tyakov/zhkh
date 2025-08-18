import React, { useRef } from 'react';
import { Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useInjection } from '../../../../../app/domain/hooks/useInjection.ts';
import { IUserAPI } from '../../../../../app/domain/services/users/userAPI.interfaces.ts';
import { UserAPIKey } from '../../../../../app/domain/services/users/key.ts';
import { useEnqueueSnackbar } from '../../../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { IUploadFileButton } from './uploadFileButton.intefaces.ts';
import { getErrorMessage } from '../../../../../shared/api/base.ts';
import { handleError } from '../../../../../shared/common/handlerError.ts';

export const UploadFileButton: React.FC<IUploadFileButton> = ({
    category,
    houseId,
    onUploadSuccess,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const userAPI = useInjection<IUserAPI>(UserAPIKey);
    const { openSnackbar } = useEnqueueSnackbar();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await userAPI.uploadHouseFile(houseId, file, category);
            openSnackbar({ message: 'Файл успешно загружен', variant: 'default' });
            onUploadSuccess();
        } catch (e) {
            handleError(e, openSnackbar);
        }
    };

    return (
        <>
            <input type="file" hidden ref={inputRef} onChange={handleFileChange} />
            <Button
                variant="outlined"
                size="small"
                startIcon={<UploadIcon />}
                onClick={() => inputRef.current?.click()}
            >
                Загрузить
            </Button>
        </>
    );
};
