interface ITableInformation {
    title: string;
    value?: string | number;
}

interface IInformationTable {
    data: ITableInformation[];
    motionDelay?: number;
}

export type { IInformationTable, ITableInformation };
