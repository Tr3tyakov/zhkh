import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableContainerProps,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React, { forwardRef } from 'react';
import { IInformationTable } from './informationTable.interfaces.ts';
import { motion } from 'framer-motion';
import { defaultMotionConfig } from '../../app/domain/motion/motionBox.ts';

const MotionTableContainer = motion(
    forwardRef<HTMLDivElement, TableContainerProps>(function MotionContainer(props, ref) {
        return <TableContainer ref={ref} {...props} />;
    })
);
export const InformationTable: React.FC<IInformationTable> = ({ data, motionDelay, header }) => {
    const delay = motionDelay !== null && motionDelay !== undefined ? motionDelay : 1;

    return (
        <MotionTableContainer
            {...defaultMotionConfig}
            transition={{ duration: 0.3, delay: delay * 0.05 }}
            component={Paper}
            sx={{ boxShadow: 1, borderRadius: 2 }}
        >
            <Table size="small">
                {header && (
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: '#fafafa',
                            }}
                        >
                            <TableCell colSpan={2}>
                                <Typography fontSize="14px" fontWeight={600}>
                                    {header}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                )}
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow
                            key={index}
                            hover
                            sx={{
                                '&:nth-of-type(even)': {
                                    backgroundColor: '#fafafa',
                                },
                            }}
                        >
                            <TableCell>{item.title}</TableCell>
                            <TableCell align="right">{item.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </MotionTableContainer>
    );
};
