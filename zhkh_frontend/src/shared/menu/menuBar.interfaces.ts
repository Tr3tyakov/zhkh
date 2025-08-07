import { JSX } from 'react';
import { IUseContextMenuResult } from '../../app/domain/hooks/useContextMenu/useContextMenu.interfaces.ts';

interface IMenuData<T> {
    title: string | ((item: T) => string);
    icon: JSX.Element;
    function: (data?: any) => void;
    disabled?: boolean;
}

interface IMenuBar<T> extends Pick<IUseContextMenuResult, 'handleClose' | 'contextMenu'> {
    data: IMenuData<T>[];
    currentElement?: any;
}

export type { IMenuBar, IMenuData };
