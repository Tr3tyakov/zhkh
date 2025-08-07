import { ReactElement } from 'react';
import { ITableInformation } from '../../../../shared/tables/informationTable.interfaces.ts';

interface IIntelligence {
    data: ITableInformation[];
    title: string;
    icon: ReactElement;
}

export type { IIntelligence };
