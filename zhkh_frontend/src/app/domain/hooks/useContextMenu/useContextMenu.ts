import React, { useState } from 'react';
import { IContextMenuPosition, IUseContextMenuResult } from './useContextMenu.interfaces.ts';

export const useContextMenu = (): IUseContextMenuResult => {
    const [contextMenu, setContextMenu] = useState<IContextMenuPosition | null>(null);

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    return { handleContextMenu, contextMenu, handleClose };
};
