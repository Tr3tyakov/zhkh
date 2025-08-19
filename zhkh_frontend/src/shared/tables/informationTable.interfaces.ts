interface ITableInformation {
    title: string;
    value?: string | number;
}

interface IInformationTable {
    data: ITableInformation[];
    motionDelay?: number;
    header?: string;
}

export type { IInformationTable, ITableInformation };
