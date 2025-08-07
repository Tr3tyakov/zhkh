import { FileCategoryEnum } from '../house';

export const fileCategoryTranslations: Record<FileCategoryEnum, string> = {
    [FileCategoryEnum.CAPITAL_REPAIR_PROJECT]: 'Проект кап. ремонта',
    [FileCategoryEnum.DESIGN_DOCUMENTATION]: 'Проектная документация',
    [FileCategoryEnum.INSPECTION_RESULT]: 'Результаты обследования',
    [FileCategoryEnum.TECHNICAL_PASSPORT]: 'Технический паспорт',
};
