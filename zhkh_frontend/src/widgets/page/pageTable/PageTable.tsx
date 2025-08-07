import {
    Box,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableHead,
    TableRow,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { defaultMotionConfig } from '../../../app/domain/motion/motionBox.ts';
import { ROWS_PER_PAGE } from '../../house/houses/houses.constants.ts';
import { HasId, IPageTable } from './pageTable.interfaces.ts';
import { HeaderTableCell } from '../../../app/domain/components/HeadTableCell.tsx';
import { useNavigate } from 'react-router-dom';
import { MenuBar } from '../../../shared/menu/MenuBar.tsx';
import { IFilters } from '../../../app/domain/hooks/usePage/usePage.ts';

const MotionRow = motion.create(TableRow);

export const PageTable = <T extends HasId, S extends IFilters>({
    data,
    heads,
    renderBody,
    page,
    total,
    isLoading,
    handlePageChange,
    bodyPath,
    menuData,
    contextMenuData,
}: IPageTable<T, S>): React.ReactElement => {
    const theme = useTheme();
    const navigate = useNavigate();
    const totalPages = Math.ceil(total / ROWS_PER_PAGE);
    const [currentElement, setCurrentElement] = useState<T | null>(null);

    const handleContext = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: T) => {
        setCurrentElement(item);
        if (contextMenuData) {
            contextMenuData.handleContextMenu(event);
        }
    };

    return (
        <>
            {menuData && contextMenuData && currentElement && (
                <MenuBar data={menuData} {...contextMenuData} currentElement={currentElement} />
            )}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                            {heads.map((element) => (
                                <HeaderTableCell key={element}>{element}</HeaderTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 &&
                            data.map((item, index) => (
                                <MotionRow
                                    className="pointer"
                                    layout
                                    hover
                                    key={item.id}
                                    {...defaultMotionConfig}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    onClick={() => bodyPath && navigate(`${bodyPath}/${item.id}`)}
                                    onContextMenu={(e) => handleContext(e, item)}
                                >
                                    {renderBody(item, index)}
                                </MotionRow>
                            ))}
                    </TableBody>
                </Table>
                <Box display="flex" alignItems="center" justifyContent="center" px={2} py={1}>
                    <Pagination
                        disabled={isLoading}
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => handlePageChange(value)}
                        color="primary"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            </Paper>
        </>
    );
};

