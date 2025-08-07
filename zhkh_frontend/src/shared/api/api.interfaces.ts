interface DetailError {
    field?: string;
    value?: string | number;
    error: string;
    text?: string;
}

interface ErrorResponse {
    detail?: DetailError;
}

export type { ErrorResponse };
