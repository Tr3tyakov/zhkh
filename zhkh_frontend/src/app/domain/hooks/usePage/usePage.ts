import React, { useEffect, useState } from 'react';

export interface IFilters {
    searchValue?: string;
    logType?: string;
    userId?: number;
    startDate?: string;
    endDate?: string;

    [key: string]: any;
}

export interface IUsePageResult<T, S extends IFilters> {
    data: T[];
    total: number;
    page: number;
    filters: S;
    setPage: (page: number) => void;
    setFilters: React.Dispatch<React.SetStateAction<S>>;
    handlePageChange: (page: number) => void;
    changeData: (data: T[], total: number) => void;
}

export const usePage = <T, S extends IFilters>(
    fetch: (filters: S, page: number) => void,
    initialFilters: S
): IUsePageResult<T, S> => {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [filters, setFilters] = useState<S>(initialFilters);

    useEffect(() => {
        fetch(filters, page);
    }, [filters, page]);

    const changeData = (data: T[], total: number) => {
        setData(data);
        setTotal(total);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    return {
        data,
        total,
        page,
        setPage,
        filters,
        setFilters,
        handlePageChange,
        changeData,
    };
};
