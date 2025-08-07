export function getChangedFields(
    values: Record<string, any>,
    initialValues: Record<string, any>
): string | null {
    const changedFields = Object.entries(values).reduce<Record<string, { old: any; new: any }>>(
        (acc, [key, value]) => {
            if (value !== initialValues[key]) {
                acc[key] = { old: initialValues[key], new: value };
            }
            return acc;
        },
        {}
    );

    if (Object.keys(changedFields).length === 0) {
        return 'Нет изменений';
    }

    return Object.entries(changedFields)
        .map(([key, { old, new: newVal }]) => `${key}: "${old}" → "${newVal}"`)
        .join(', ');
}
