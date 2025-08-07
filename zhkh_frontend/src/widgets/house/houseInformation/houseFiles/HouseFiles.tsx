import { useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import {
    IGetHouseFilesResponseSchema,
    IUserAPI,
} from '../../../../app/domain/services/users/userAPI.interfaces';
import { useInjection } from '../../../../app/domain/hooks/useInjection';
import { useEnqueueSnackbar } from '../../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar';
import { UserAPIKey } from '../../../../app/domain/services/users/key';
import { getErrorMessage } from '../../../../shared/api/base';
import { HouseFileCategoryBlock } from './houseFileCategory/HouseFileCategory.tsx';
import { fileCategoryTranslations } from '../../../../app/infrastructures/enums/translation/house.ts';
import { camelToEnum } from '../../../../shared/common/toCamel.ts';
import { FileCategoryEnum } from '../../../../app/infrastructures/enums/house.ts';
import { defaultMotionConfig, MotionBox } from '../../../../app/domain/motion/motionBox.ts';

export const HouseFiles = ({ houseId }: { houseId: number }) => {
    const userAPI = useInjection<IUserAPI>(UserAPIKey);
    const { openSnackbar } = useEnqueueSnackbar();

    const [files, setFiles] = useState<IGetHouseFilesResponseSchema | null>(null);

    const fetchFiles = async () => {
        try {
            const response = await userAPI.getHouseFiles(houseId);
            setFiles(response);
        } catch (e) {
            openSnackbar({
                message: getErrorMessage(e),
                variant: 'default',
            });
        } finally {
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <Box>
            {files &&
                Object.entries(files).map(([key, fileList]) => {
                    const enumKey = camelToEnum(key) as FileCategoryEnum;
                    return (
                        <MotionBox {...defaultMotionConfig} key={key}>
                            <HouseFileCategoryBlock
                                title={fileCategoryTranslations[enumKey] ?? key}
                                files={fileList}
                                categoryKey={enumKey}
                                houseId={houseId}
                                onRefresh={fetchFiles}
                            />
                            <Divider sx={{ my: 2 }} />
                        </MotionBox>
                    );
                })}
        </Box>
    );
};
