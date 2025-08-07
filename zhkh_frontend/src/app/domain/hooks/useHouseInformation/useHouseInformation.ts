import { useReferenceBook } from '../useReferenceBooks/useReferenceBook.ts';
import { IHouseResponse } from '../../services/houses/houseAPI.interfaces.ts';
import { ITableInformation } from '../../../../shared/tables/informationTable.interfaces.ts';

const safe = (value: unknown): string => {
    return value === null || value === undefined || value === '' ? '—' : String(value);
};

const safeBool = (value: boolean | null | undefined): string => {
    return value === true ? 'Да' : value === false ? 'Нет' : '—';
};

const resolveRefValue = (
    referenceBooks: ReturnType<typeof useReferenceBook>['referenceBooks'],
    name: string,
    id: number | null | undefined
): string => {
    if (!id || !referenceBooks?.[name]) return '—';
    return referenceBooks[name].find((val) => val.id === id)?.value ?? '—';
};

export const useHouseTables = (house: IHouseResponse) => {
    const { referenceBooks } = useReferenceBook();

    const getRef = (name: string, id: number | null | undefined) =>
        resolveRefValue(referenceBooks, name, id);

    const address = `${safe(house.city)}, ул. ${safe(house.street)}, д. ${safe(house.houseNumber)}${
        house.building ? `, корп. ${house.building}` : ''
    }`;

    console.log('Тип наружных стен', house.facadeWallType);
    const buildHomeInformationTable = (): ITableInformation[] => [
        { title: 'Адрес', value: address },
        { title: 'Год постройки', value: safe(house.commissioningYear) },
        {
            title: 'Количество этажей',
            value:
                house.minFloorsCount && house.maxFloorsCount
                    ? `${house.minFloorsCount}–${house.maxFloorsCount}`
                    : '—',
        },
        { title: 'Тип дома', value: getRef('Тип дома', house.houseType) },
        { title: 'Жилых помещений', value: safe(house.apartmentsCount) },
        {
            title: 'Капитальный ремонт',
            value: getRef('Формирование фонда кап. ремонта', house.capitalRepairFund),
        },
        {
            title: 'Серия, тип постройки',
            value: getRef('Серия, тип постройки', house.buildingSeries),
        },
        { title: 'Тип перекрытий', value: getRef('Тип перекрытий', house.overlapType) },
        {
            title: 'Материал несущих стен',
            value: getRef('Материал несущих стен', house.loadBearingWalls),
        },
        { title: 'Тип мусоропровода', value: getRef('Тип мусоропровода', house.garbageChuteType) },
        { title: 'Дом признан аварийным', value: safeBool(house.isEmergency) },
        { title: 'Управляющая компания', value: '—' },
    ];

    const buildGeneralInformationTable = (): ITableInformation[] => [
        { title: 'Год ввода в эксплуатацию', value: safe(house.commissioningYear) },
        { title: 'Дом признан аварийным', value: safeBool(house.isEmergency) },
        { title: 'Состояние дома', value: safe(house.condition) },
        { title: 'Количество квартир', value: safe(house.apartmentsCount) },
        {
            title: 'Класс энергетической эффективности',
            value: getRef('Класс энергетической эффективности', house.energyEfficiencyClass),
        },
        { title: 'Дата энергетического обследования', value: safe(house.energySurveyDate) },
        { title: 'Количество подъездов', value: safe(house.entrancesCount) },
        { title: 'Наибольшее количество этажей', value: safe(house.maxFloorsCount) },
        { title: 'Подземных этажей', value: safe(house.undergroundFloorsCount) },
        { title: 'Формирование фонда кап. ремонта', value: safe(house.capitalRepairFund) },
        { title: 'Площадь парковки м²', value: safe(house.parkingArea) },
        {
            title: 'Приспособления для МГН',
            value: getRef(
                'Наличие в подъездах приспособлений для нужд маломобильных групп населения',
                house.hasAccessibility
            ),
        },
        { title: 'Износ здания, %', value: safe(house.buildingWearPercent) },
        { title: 'Дата износа', value: safe(house.buildingWearDate) },
        { title: 'Площадь МКД, кв.м', value: safe(house.totalArea) },
        { title: 'Жилая площадь, м²', value: safe(house.residentialArea) },
        { title: 'Нежилая площадь, м²', value: safe(house.nonResidentialArea) },
        { title: 'Общая площадь имущества, м²', value: safe(house.commonPropertyArea) },
        { title: 'Площадь земли, м²', value: safe(house.landArea) },
        {
            title: 'Серия, тип постройки',
            value: getRef('Серия, тип постройки', house.buildingSeries),
        },
        {
            title: 'Объект культурного наследия',
            value: getRef('Статус объекта культурного наследия', house.isCulturalHeritage),
        },
    ];

    const buildEngineeringSystemsTable = (): ITableInformation[] => [
        { title: 'Вентиляция', value: getRef('Вентиляция', house.ventilation) },
        {
            title: 'Система пожаротушения',
            value: getRef('Система пожаротушения', house.fireSuppression),
        },
        { title: 'Водоотведение', value: getRef('Водоотведение', house.sewerage) },
        { title: 'Теплоснабжение', value: getRef('Теплоснабжение', house.heating) },
        { title: 'Система водостоков', value: getRef('Система водостоков', house.drainageSystem) },
        {
            title: 'Холодное водоснабжение',
            value: getRef('Холодное водоснабжение', house.coldWaterSupply),
        },
        { title: 'Газоснабжение', value: getRef('Газоснабжение', house.gasSupply) },
        { title: 'Электроснабжение', value: getRef('Электроснабжение', house.electricitySupply) },
        {
            title: 'Горячее водоснабжение',
            value: getRef('Горячее водоснабжение', house.hotWaterSupply),
        },
        { title: 'Количество вводов', value: safe(house.numberOfInputs) },
    ];

    const buildStructuralElementsTable = (): ITableInformation[] => [
        { title: 'Мусоропровод', value: safeBool(house.garbageChute) },
        { title: 'Перекрытия', value: getRef('Тип перекрытий', house.overlapType) },
        { title: 'Несущие стены', value: getRef('Несущие стены', house.loadBearingWalls) },
        { title: 'Площадь подвала, кв.м', value: safe(house.basementArea) },
        {
            title: 'Материал фундамента',
            value: getRef('Материал фундамента', house.foundationMaterial),
        },
        { title: 'Тип фундамента', value: getRef('Тип фундамента', house.foundationType) },
        { title: 'Площадь отмостки', value: safe(house.blindArea) },
    ];

    const buildFacadeTable = (): ITableInformation[] => [
        { title: 'Тип наружных стен', value: getRef('Тип наружных стен', house.facadeWallType) },
        {
            title: 'Тип наружного утепления фасада',
            value: getRef('Тип наружного утепления фасада', house.facadeInsulationType),
        },
        {
            title: 'Материал отделки фасада',
            value: getRef('Материал отделки фасада', house.facadeFinishingMaterial),
        },
        { title: 'Год кап. ремонта фасада', value: safe(house.facadeLastMajorRepairYear) },
    ];

    const buildRoofTable = (): ITableInformation[] => [
        { title: 'Форма крыши', value: getRef('Форма крыши', house.roofShape) },
        {
            title: 'Утепляющие слои чердачных перекрытий',
            value: getRef('Утепляющие слои чердачных перекрытий', house.atticInsulationLayers),
        },
        {
            title: 'Вид несущей части',
            value: getRef('Вид несущей части', house.roofSupportStructureType),
        },
        { title: 'Тип кровли', value: getRef('Тип кровли', house.roofCoveringType) },
        { title: 'Год капремонта кровли', value: safe(house.roofLastMajorRepairYear) },
    ];
    const buildAdditionalInfoTable = (): ITableInformation[] => [
        { title: 'Материал окон', value: getRef('Материал окон', house.windowMaterial) },
        {
            title: 'Тип внутренних стен',
            value: getRef('Тип внутренних стен', house.internalWallsType),
        },
        { title: 'Примечание администратора', value: safe(house.note) },
    ];

    const formatHouseAddress = (data: IHouseResponse | null): string | undefined => {
        if (!data) return;
        return `${data.region} г. ${data.city} ул. ${data.street} д. ${data.houseNumber}${
            data.building ? ` корп. ${data.building}` : ''
        }`;
    };

    return {
        buildHomeInformationTable,
        buildGeneralInformationTable,
        buildEngineeringSystemsTable,
        buildStructuralElementsTable,
        buildFacadeTable,
        buildRoofTable,
        buildAdditionalInfoTable,
        formatHouseAddress,
    };
};
