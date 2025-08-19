import { IHouseFiltersState } from './houseFilter.interfaces.ts';

// Маппинг названий справочников на ключи состояния фильтров
export const refNameToFilterField: Record<string, keyof IHouseFiltersState> = {
    'Тип дома': 'houseType',
    'Серия, тип постройки': 'buildingSeries',
    'Тип перекрытий': 'overlapType',
    'Материал несущих стен': 'loadBearingWalls',
    'Тип мусоропровода': 'garbageChuteType',
    'Класс энергетической эффективности': 'energyEfficiencyClass',
    'Формирование фонда кап. ремонта': 'capitalRepairFund',
    'Наличие в подъездах приспособлений для нужд маломобильных групп населения': 'hasAccessibility',
    'Статус объекта культурного наследия': 'isCulturalHeritage',
    Вентиляция: 'ventilation',
    Водоотведение: 'sewerage',
    'Система водостоков': 'drainageSystem',
    Газоснабжение: 'gasSupply',
    'Горячее водоснабжение': 'hotWaterSupply',
    'Система пожаротушения': 'fireSuppression',
    Теплоснабжение: 'heating',
    'Холодное водоснабжение': 'coldWaterSupply',
    Электроснабжение: 'electricitySupply',
    'Несущие стены': 'loadBearingWalls',
    'Тип системы горячего водоснабжения': 'hotWaterSystemType',
    'Материал сети': 'hotWaterNetworkMaterial',
    'Материал теплоизоляции сети': 'hotWaterInsulationMaterial',
    'Материал стояков': 'hotWaterRiserMaterial',
    'Тип системы водоотведения': 'sewerageSystemType',
    'Тип системы газоснабжения': 'gasSystemType',
    'Тип фундамента': 'foundationType',
    'Материал фундамента': 'foundationMaterial',
    'Тип внутренних стен': 'internalWallsType',
    'Тип наружных стен': 'facadeWallType',
    'Тип наружного утепления фасада': 'facadeInsulationType',
    'Материал отделки фасада': 'facadeFinishingMaterial',
    'Форма крыши': 'roofShape',
    'Утепляющие слои чердачных перекрытий': 'atticInsulationLayers',
    'Вид несущей части': 'roofSupportStructureType',
    'Тип кровли': 'roofCoveringType',
    'Материал окон': 'windowMaterial',
    'Тип поквартирной разводки внутридомовой системы отопления': 'heatingRiserLayoutType',
    Материал: 'heatingRiserMaterial',
    'Тип отопительных приборов': 'heatingDeviceType',
};
export const houseFilterState: any = {
    address: '',
    commissioningYearFrom: undefined,
    commissioningYearTo: undefined,
    floorsCountFrom: undefined,
    floorsCountTo: undefined,
    ...Object.values(refNameToFilterField).reduce((acc, key) => {
        acc[key] = [] as any;
        return acc;
    }, {} as Partial<IHouseFiltersState>),
};

export default houseFilterState;
