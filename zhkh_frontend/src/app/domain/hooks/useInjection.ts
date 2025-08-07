import { useMemo } from 'react';
import { container } from 'tsyringe';

export function useInjection<T>(token: symbol | string): T {
    return useMemo(() => container.resolve<T>(token), [token]);
}
