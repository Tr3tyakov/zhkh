import React from 'react';

interface IContextMenuPosition {
    mouseX: number;
    mouseY: number;
}

interface IUseContextMenuResult {
    contextMenu: IContextMenuPosition | null;
    handleContextMenu: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleClose: () => void;
}

interface IMenuData {
    title: string;
    function: (data: any) => void;
    icon: React.ReactElement;
    disabled: boolean;
}

export type { IContextMenuPosition, IMenuData, IUseContextMenuResult };
