import { FileCategoryEnum } from '../../../../app/infrastructures/enums/house.ts';

export const categoryMap = {
    capitalRepairProject: {
        label: 'Проект кап. ремонта',
        apiKey: FileCategoryEnum.CAPITAL_REPAIR_PROJECT,
    },
    designDocumentation: {
        label: 'Проектная документация',
        apiKey: FileCategoryEnum.DESIGN_DOCUMENTATION,
    },
    inspectionResult: {
        label: 'Результаты обследования',
        apiKey: FileCategoryEnum.INSPECTION_RESULT,
    },
    technicalPassport: {
        label: 'Технический паспорт',
        apiKey: FileCategoryEnum.TECHNICAL_PASSPORT,
    },
} as const;
