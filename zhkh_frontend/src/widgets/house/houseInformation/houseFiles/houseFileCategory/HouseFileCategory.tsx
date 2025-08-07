import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { FileItem } from './fileItem/FileItem';
import { UploadFileButton } from '../uploadFileButton/UploadFileButton';
import { IHouseFileCategory } from './houseFileCategory.intefaces.ts';
import { defaultMotionConfig, MotionBox } from '../../../../../app/domain/motion/motionBox.ts';

export const HouseFileCategoryBlock: React.FC<IHouseFileCategory> = ({
    title,
    files,
    categoryKey,
    houseId,
    onRefresh,
}) => {
    return (
        <Box>
            <Typography fontSize="16px" mb={1}>
                {title}
            </Typography>
            <UploadFileButton
                category={categoryKey}
                houseId={houseId}
                onUploadSuccess={onRefresh}
            />
            <Stack spacing={1} mt={1}>
                {files.map((file) => (
                    <MotionBox key={file.id} layout {...defaultMotionConfig}>
                        <FileItem file={file} onDeleted={onRefresh} />
                    </MotionBox>
                ))}
            </Stack>
        </Box>
    );
};
