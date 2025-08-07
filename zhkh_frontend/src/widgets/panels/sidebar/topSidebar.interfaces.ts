import { ReactElement } from 'react';

interface ITopSidebar {
    isSidebarOpen: boolean;
    handleClose: () => void;
}

interface INavigationItem {
    text: string;
    icon: ReactElement;
    path: string;
    disabled: boolean;
}

export type { ITopSidebar, INavigationItem };
