export function trimObjectStrings<T extends object>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map(trimObjectStrings) as T;
    }

    if (obj !== null && typeof obj === 'object') {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            acc[key as keyof T] =
                typeof value === 'string'
                    ? value.trim()
                    : typeof value === 'object' && value !== null
                      ? trimObjectStrings(value)
                      : value;
            return acc;
        }, {} as T);
    }

    return obj;
}
