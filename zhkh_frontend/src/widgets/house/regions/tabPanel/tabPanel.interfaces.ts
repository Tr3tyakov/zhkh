import { ReactNode } from 'react';

interface ITabPanel {
    children?: ReactNode;
    index: number;
    value: number;
}

export type { ITabPanel };
