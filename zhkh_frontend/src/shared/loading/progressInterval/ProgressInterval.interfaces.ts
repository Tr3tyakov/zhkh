interface IProgressInterval {
    changeCancel: () => void;
    size?: number;
    circularProgressColor?: string;
    iconColor: IIconColor;
    timeoutTime?: number;
}

type IIconColor = 'default' | 'primary' | 'secondary' | 'error' | 'success';

export type { IProgressInterval, IIconColor };
