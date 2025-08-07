import { AxiosResponse } from 'axios';

interface IReferenceBook {
    name: string;
}

interface IReferenceBookValueResponse {
    id: number;
    value: string;
}

interface IReferenceBookList extends IReferenceBook {
    id: number;
    reference_book_values: IReferenceBookValueResponse[];
}

interface IReferenceBookListResponse {
    books: IReferenceBookList[];
}

type ReferenceBookMap = {
    [name: string]: IReferenceBookValueResponse[];
};
type ReferenceBookIDMap = {
    [name: string]: number;
};
type ReferenceBookIdToNameMap = {
    [id: number]: string;
};

interface IReferenceBookAPI {
    getReferenceBooks(): Promise<IReferenceBookListResponse>;

    deleteBookValue(id: number): Promise<AxiosResponse>;

    createBookValue(bookId: number, bookValue: string): Promise<AxiosResponse>;

    updateBookValue(bookId: number, bookValue: string): Promise<AxiosResponse>;
}

export type {
    IReferenceBookAPI,
    IReferenceBookListResponse,
    IReferenceBookList,
    ReferenceBookMap,
    ReferenceBookIDMap,
    ReferenceBookIdToNameMap,
};
