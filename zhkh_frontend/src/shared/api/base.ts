import axios, { AxiosError, isAxiosError } from 'axios';
import { ErrorResponse } from './api.interfaces.ts';
import Cookies from 'js-cookie';

const BASE_URL = 'localhost:8000';
const API = axios.create({
    baseURL: `http://${BASE_URL}/api`,
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname != '/auth') {
            Cookies.remove('access_token');
            window.location.href = '/auth';
        }
        if (
            error.response?.status === 400 &&
            error.response.data.detail.error === 'Отсутствует доступ к ресурсу' &&
            window.location.pathname != '/auth'
        ) {
            Cookies.remove('access_token');
            window.location.href = '/auth';
        }

        if (!error.response && window.location.pathname != '/auth') {
            Cookies.remove('access_token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

const getErrorMessage = (e: unknown): string => {
    const error = e as AxiosError<ErrorResponse>;

    if (!error.response) {
        return 'Отсутствует соединение с контейнером';
    }

    return (
        error?.response?.data?.detail?.text ||
        error?.response?.data?.detail?.error ||
        'Произошла ошибка'
    );
};

const getErrorLog = (e: unknown) => {
    if (e instanceof Error) {
        return {
            message: e.message,
            name: e.name,
            stack: e.stack,
            ...(isAxiosError(e) && {
                config: e.config,
                response: e.response,
                code: e.code,
                isAxiosError: true,
            }),
        };
    }

    // Если это обычный объект с message
    if (typeof e === 'object' && e !== null && 'message' in e) {
        return {
            message: String((e as any).message),
            name: (e as any).name ?? 'UnknownError',
            stack: (e as any).stack,
        };
    }

    // На случай если это строка или что-то ещё
    return {
        message: String(e),
        name: 'UnknownError',
        stack: '',
    };
};

export { API, getErrorMessage, getErrorLog, BASE_URL };
