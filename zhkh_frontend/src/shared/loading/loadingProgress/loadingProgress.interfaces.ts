import React from 'react';

interface ILoadingProgress {
    isLoading: boolean;
    size?: string | number | undefined;
    value?: string | number | React.ReactNode;
}

export type { ILoadingProgress };
