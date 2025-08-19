import { ICreateHouseData } from '../../../app/domain/services/houses/houseAPI.interfaces.ts';
import * as Yup from 'yup';

const createHouseInitialValues: ICreateHouseData = {
    region: '',
    city: '',
    street: '',
    houseNumber: '',
    building: '',
    cadastralNumber: '',
    classifierCode: '',

    commissioningYear: undefined,
    isEmergency: false,
    condition: undefined,
    apartmentsCount: undefined,
    nonResidentialUnitsCount: undefined,

    energyEfficiencyClass: undefined,
    energySurveyDate: undefined,

    entrancesCount: undefined,
    maxFloorsCount: undefined,
    minFloorsCount: undefined,
    undergroundFloorsCount: undefined,

    capitalRepairFund: undefined,
    parkingArea: undefined,
    hasAccessibility: undefined,

    houseType: undefined,
    buildingWearPercent: undefined,
    buildingWearDate: undefined,

    totalArea: undefined,
    residentialArea: undefined,
    nonResidentialArea: undefined,
    commonPropertyArea: undefined,
    landArea: undefined,

    buildingSeries: undefined,
    isCulturalHeritage: undefined,
    companyId: undefined,

    // --- Инженерные системы ---
    ventilation: undefined,
    sewerage: undefined,
    drainageSystem: undefined,
    gasSupply: undefined,
    hotWaterSupply: undefined,
    fireSuppression: undefined,
    heating: undefined,
    coldWaterSupply: undefined,
    electricitySupply: undefined,
    numberOfInputs: undefined,

    // --- Конструктивные элементы ---
    garbageChute: false,
    garbageChuteType: undefined,
    loadBearingWalls: undefined,
    basementArea: undefined,
    foundationType: undefined,
    foundationMaterial: undefined,
    blindArea: undefined,
    overlapType: undefined,

    // --- Система горячего водоснабжения ---
    hotWaterSystemType: undefined,
    hotWaterPhysicalWear: undefined,
    hotWaterNetworkMaterial: undefined,
    hotWaterInsulationMaterial: undefined,
    hotWaterRiserMaterial: undefined,
    hotWaterRiserWear: undefined,
    hotWaterValveWear: undefined,

    // --- Система водоотведения ---
    sewerageSystemType: undefined,
    sewerageNetworkMaterial: undefined,

    // --- Система газоснабжения ---
    gasSystemType: undefined,

    // --- Внутренние стены ---
    internalWallsType: undefined,

    // --- Фасад ---
    facadeWallType: undefined,
    facadeInsulationType: undefined,
    facadeFinishingMaterial: undefined,
    facadeLastMajorRepairYear: undefined,

    // --- Крыша ---
    roofShape: undefined,
    atticInsulationLayers: undefined,
    roofSupportStructureType: undefined,
    roofCoveringType: undefined,
    roofLastMajorRepairYear: undefined,

    // --- Окна ---
    windowMaterial: undefined,

    // --- Система отопления ---
    heatingPhysicalWear: undefined,
    heatingNetworkMaterial: undefined,
    heatingInsulationMaterial: undefined,

    // --- Стояки системы отопления ---
    heatingRiserLayoutType: undefined,
    heatingRiserMaterial: undefined,
    heatingRiserValveWear: undefined,

    // --- Отопительные приборы ---
    heatingDeviceType: undefined,
    heatingDeviceWear: undefined,

    // --- Система холодного водоснабжения ---
    coldWaterPhysicalWear: undefined,
    coldWaterNetworkMaterial: undefined,
    coldWaterRiserWear: undefined,
    coldWaterRiserMaterial: undefined,
    coldWaterValveWear: undefined,

    // --- Примечание ---
    note: '',
};
const validationSchema = Yup.object({
    cadastralNumber: Yup.string()
        .matches(
            /^\d{2}:\d{2}:\d{6,7}:\d+$/,
            'Кадастровый номер должен быть в формате XX:XX:XXXXXX:XXX',
        )
        .nullable()
        .test(
            'cadastral-format',
            'Неверный формат кадастрового номера',
            (value) => {
                if (!value) return true; // разрешаем пустое значение

                const parts = value.split(':');
                if (parts.length !== 4) return false;

                // Проверяем каждую часть
                const [district, area, quarter, number] = parts;

                // Район (2 цифры)
                if (!/^\d{2}$/.test(district)) return false;

                // Округ/район (2 цифры)
                if (!/^\d{2}$/.test(area)) return false;

                // Квартал (6-7 цифр)
                if (!/^\d{6,7}$/.test(quarter)) return false;

                // Номер участка (1+ цифр)
                if (!/^\d+$/.test(number)) return false;

                return true;
            },
        ),

    classifierCode: Yup.string()
        .matches(
            /^\d{8,11}$/,
            'Код ОКТМО должен содержать от 8 до 11 цифр',
        )
        .nullable()
        .test(
            'oktmo-length',
            'Код ОКТМО должен содержать от 8 до 11 цифр',
            (value) => {
                if (!value) return true; // разрешаем пустое значение
                return value.length >= 8 && value.length <= 11;
            },
        )
        .test(
            'oktmo-digits',
            'Код ОКТМО должен содержать только цифры',
            (value) => {
                if (!value) return true;
                return /^\d+$/.test(value);
            },
        ),
    commissioningYear: Yup.number()
        .min(1800, 'Год не может быть меньше 1800')
        .max(new Date().getFullYear(), 'Год не может быть больше текущего')
        .nullable()
        .typeError('Введите корректный год ввода в эксплуатацию'),

    apartmentsCount: Yup.number()
        .min(0, 'Количество квартир не может быть меньше 0')
        .nullable()
        .typeError('Введите корректное количество квартир'),

    nonResidentialUnitsCount: Yup.number()
        .min(0, 'Количество нежилых помещений не может быть меньше 0')
        .nullable()
        .typeError('Введите корректное количество нежилых помещений'),

    entrancesCount: Yup.number()
        .min(0, 'Количество подъездов не может быть меньше 0')
        .nullable()
        .typeError('Введите корректное количество подъездов'),

    maxFloorsCount: Yup.number()
        .min(0, 'Максимальное количество этажей не может быть меньше 0')
        .nullable()
        .typeError('Введите корректное значение максимального количества этажей'),

    minFloorsCount: Yup.number()
        .min(0, 'Минимальное количество этажей не может быть меньше 0')
        .nullable()
        .typeError('Введите корректное значение минимального количества этажей'),

    parkingArea: Yup.number()
        .min(0, 'Площадь парковки не может быть меньше 0')
        .nullable()
        .typeError('Введите корректную площадь парковки'),

    buildingWearPercent: Yup.number()
        .min(0, 'Износ не может быть меньше 0%')
        .max(100, 'Износ не может превышать 100%')
        .nullable()
        .typeError('Введите корректное значение износа'),

    totalArea: Yup.number()
        .min(0, 'Общая площадь не может быть меньше 0')
        .nullable()
        .typeError('Введите корректную общую площадь')
        .required('Площадь обязателена для заполнения'),

    residentialArea: Yup.number()
        .min(0, 'Жилая площадь не может быть меньше 0')
        .nullable()
        .typeError('Введите корректную жилую площадь'),

    nonResidentialArea: Yup.number()
        .min(0, 'Нежилая площадь не может быть меньше 0')
        .nullable()
        .typeError('Введите корректную нежилую площадь'),

    commonPropertyArea: Yup.number()
        .min(0, 'Площадь общего имущества не может быть меньше 0')
        .nullable()
        .typeError('Введите корректную площадь общего имущества'),

    landArea: Yup.number()
        .min(0, 'Площадь земельного участка не может быть меньше 0')
        .nullable()
        .typeError('Введите корректную площадь земельного участка'),

    numberOfInputs: Yup.number()
        .min(0, 'Количество вводов не может быть меньше 0')
        .nullable()
        .typeError('Введите корректное количество вводов'),

    basementArea: Yup.number()
        .min(0, 'Площадь подвала не может быть меньше 0')
        .nullable()
        .typeError('Введите корректную площадь подвала'),

    blindArea: Yup.number()
        .min(0, 'Площадь отмостки не может быть меньше 0')
        .nullable()
        .typeError('Введите корректную площадь отмостки'),

    facadeLastMajorRepairYear: Yup.number()
        .min(1800, 'Год ремонта не может быть меньше 1800')
        .max(new Date().getFullYear(), 'Год ремонта не может быть больше текущего')
        .nullable()
        .typeError('Введите корректный год последнего капремонта фасада'),

    roofLastMajorRepairYear: Yup.number()
        .min(1800, 'Год ремонта не может быть меньше 1800')
        .max(new Date().getFullYear(), 'Год ремонта не может быть больше текущего')
        .nullable()
        .typeError('Введите корректный год последнего капремонта кровли'),

    heatingRiserValveWear: Yup.number()
        .min(0, 'Износ не может быть меньше 0%')
        .max(100, 'Износ не может превышать 100%')
        .nullable()
        .typeError('Введите корректное значение износа'),

    heatingDeviceWear: Yup.number()
        .min(0, 'Износ не может быть меньше 0%')
        .max(100, 'Износ не может превышать 100%')
        .nullable()
        .typeError('Введите корректное значение износа'),

    hotWaterPhysicalWear: Yup.number()
        .min(0, 'Износ не может быть меньше 0%')
        .max(100, 'Износ не может превышать 100%')
        .nullable()
        .typeError('Введите корректное значение износа'),

    hotWaterRiserWear: Yup.number()
        .min(0, 'Износ не может быть меньше 0%')
        .max(100, 'Износ не может превышать 100%')
        .nullable()
        .typeError('Введите корректное значение износа'),

    hotWaterValveWear: Yup.number()
        .min(0, 'Износ не может быть меньше 0%')
        .max(100, 'Износ не может превышать 100%')
        .nullable()
        .typeError('Введите корректное значение износа'),

    coldWaterPhysicalWear: Yup.number()
        .min(0, 'Износ не может быть меньше 0%')
        .max(100, 'Износ не может превышать 100%')
        .nullable()
        .typeError('Введите корректное значение износа'),

    coldWaterRiserWear: Yup.number()
        .min(0, 'Износ не может быть меньше 0%')
        .max(100, 'Износ не может превышать 100%')
        .nullable()
        .typeError('Введите корректное значение износа'),

    coldWaterValveWear: Yup.number()
        .min(0, 'Износ не может быть меньше 0%')
        .max(100, 'Износ не может превышать 100%')
        .nullable()
        .typeError('Введите корректное значение износа'),

    // --- Даты ---
    energySurveyDate: Yup.date()
        .min(new Date(1800, 0, 1), 'Дата не может быть раньше 01.01.1800')
        .max(new Date(), 'Дата не может быть позже текущей')
        .nullable()
        .typeError('Введите корректную дату энергетического обследования'),

    buildingWearDate: Yup.date()
        .min(new Date(1800, 0, 1), 'Дата не может быть раньше 01.01.1800')
        .max(new Date(), 'Дата не может быть позже текущей')
        .nullable()
        .typeError('Введите корректную дату установления износа'),

    region: Yup.string().required('Регион обязателен для заполнения'),
    city: Yup.string().required('Город обязателен для заполнения'),
    street: Yup.string().required('Улица обязательна для заполнения'),
    houseNumber: Yup.string().required('Номер дома обязателен для заполнения'),
    houseType: Yup.string().required('Тип дома обязателен для заполнения'),
    building: Yup.string().nullable(),
    condition: Yup.string().nullable(),
    capitalRepairFund: Yup.string().nullable(),
    buildingSeries: Yup.string().nullable(),
    ventilation: Yup.string().nullable(),
    sewerage: Yup.string().nullable(),
    drainageSystem: Yup.string().nullable(),
    gasSupply: Yup.string().nullable(),
    hotWaterSupply: Yup.string().nullable(),
    fireSuppression: Yup.string().nullable(),
    heating: Yup.string().nullable(),
    coldWaterSupply: Yup.string().nullable(),
    electricitySupply: Yup.string().nullable(),
    loadBearingWalls: Yup.string().nullable(),
    foundationType: Yup.string().nullable(),
    foundationMaterial: Yup.string().nullable(),
    overlapType: Yup.string().nullable(),
    hotWaterSystemType: Yup.string().nullable(),
    hotWaterNetworkMaterial: Yup.string().nullable(),
    hotWaterInsulationMaterial: Yup.string().nullable(),
    hotWaterRiserMaterial: Yup.string().nullable(),
    sewerageSystemType: Yup.string().nullable(),
    sewerageNetworkMaterial: Yup.string().nullable(),
    gasSystemType: Yup.string().nullable(),
    internalWallsType: Yup.string().nullable(),
    facadeWallType: Yup.string().nullable(),
    facadeInsulationType: Yup.string().nullable(),
    facadeFinishingMaterial: Yup.string().nullable(),
    roofShape: Yup.string().nullable(),
    atticInsulationLayers: Yup.string().nullable(),
    roofSupportStructureType: Yup.string().nullable(),
    roofCoveringType: Yup.string().nullable(),
    windowMaterial: Yup.string().nullable(),
    heatingNetworkMaterial: Yup.string().nullable(),
    heatingInsulationMaterial: Yup.string().nullable(),
    heatingRiserLayoutType: Yup.string().nullable(),
    heatingRiserMaterial: Yup.string().nullable(),
    heatingDeviceType: Yup.string().nullable(),
    coldWaterNetworkMaterial: Yup.string().nullable(),
    coldWaterRiserMaterial: Yup.string().nullable(),
    note: Yup.string().nullable(),
});

export { createHouseInitialValues, validationSchema };
