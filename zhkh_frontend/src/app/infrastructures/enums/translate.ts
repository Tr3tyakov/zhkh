// Общий транслятор для enum значений
export const translateEnum = <T extends string>(
    value: T,
    translations: Record<T, string>
): string => translations[value];
