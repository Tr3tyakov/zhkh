export const camelToEnum = (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
};
