import { ReactNode } from 'react';
import { IUseContextMenuResult } from '../../../app/domain/hooks/useContextMenu/useContextMenu.interfaces.ts';
import { IMenuData } from '../../../shared/menu/menuBar.interfaces.ts';
import { IFilters, IUsePageResult } from '../../../app/domain/hooks/usePage/usePage.ts';

interface HasId {
    id: number | string;
}

interface IPageTable<T, S extends IFilters>
    extends Pick<IUsePageResult<T, S>, 'handlePageChange' | 'page' | 'data' | 'total'> {
    isLoading: boolean;
    heads: string[];
    renderBody: (item: T, index: number) => ReactNode;
    bodyPath?: string;
    menuData?: IMenuData<T>[];
    contextMenuData?: IUseContextMenuResult;
    data: T[];
}

export type { IPageTable, HasId };
