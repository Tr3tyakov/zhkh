export const getDayWord = (n: number) => {
    const plural = new Intl.PluralRules('ru-RU').select(n);

    switch (plural) {
        case 'one':
            return 'день';
        case 'few':
            return 'дня';
        default:
            return 'дней';
    }
};
