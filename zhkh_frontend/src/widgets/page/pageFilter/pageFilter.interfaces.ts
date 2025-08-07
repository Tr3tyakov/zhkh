interface IPageFilter<S> {
    filters: S;
    setFilters: (data: S) => void;
    isLoading: boolean;
    handlePageChange: (page: number) => void;
    label: string;
}

export type { IPageFilter };
