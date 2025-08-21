import { useReferenceBook } from '../useReferenceBooks/useReferenceBook.ts';
import { IHouseResponse } from '../../services/houses/houseAPI.interfaces.ts';
import { ITableInformation } from '../../../../shared/tables/informationTable.interfaces.ts';
import { useInjection } from '../useInjection.ts';
import { ICompanyAPI } from '../../services/companies/companyAPI.interfaces.ts';
import { CompanyAPIKey } from '../../services/companies/key.ts';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const safe = (value: unknown): string => {
    return value === null || value === undefined || value === '' ? '—' : String(value);
};

const safeBool = (value: boolean | null | undefined): string => {
    return value === true ? 'Да' : value === false ? 'Нет' : '—';
};

function formatDateDayjs(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    return dayjs(dateStr).locale('ru').format('DD.MM.YYYY');
}

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
    const companyAPI = useInjection<ICompanyAPI>(CompanyAPIKey);
    const [companyName, setCompanyName] = useState<string | null>(null);

    const getCompanyName = async () => {
        if (!house.companyId) return;
        try {
            const data = await companyAPI.getCompany(+house.companyId);
            setCompanyName(data.name);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getCompanyName();
    }, []);

    const getRef = (name: string, id: number | null | undefined) =>
        resolveRefValue(referenceBooks, name, id);

    const address = `${safe(house.city)}, ул. ${safe(house.street)}, д. ${safe(house.houseNumber)}${
        house.building ? `, корп. ${house.building}` : ''
    }`;

    const buildHomeInformationTable = (): ITableInformation[] => [
        { title: 'Адрес', value: address },
        { title: 'Год постройки', value: safe(house.commissioningYear) },
        {
            title: 'Количество этажей',
            value: house.maxFloorsCount,
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
            title: 'Несущие стены',
            value: getRef('Несущие стены', house.loadBearingWalls),
        },
        { title: 'Тип мусоропровода', value: getRef('Тип мусоропровода', house.garbageChuteType) },
        { title: 'Дом признан аварийным', value: safeBool(house.isEmergency) },
        { title: 'Кадастровый номер', value: safe(house.cadastralNumber) },
        { title: 'Код ОКТМО', value: safe(house.classifierCode) },
        { title: 'Управляющая компания', value: safe(companyName) },
    ];

    const buildGeneralInformationTable = (): ITableInformation[] => [
        { title: 'Год ввода в эксплуатацию', value: safe(house.commissioningYear) },
        { title: 'Дом признан аварийным', value: safeBool(house.isEmergency) },
        { title: 'Состояние дома', value: safe(house.condition) },
        { title: 'Количество квартир', value: safe(house.apartmentsCount) },
        { title: 'Количество нежилых помещений', value: safe(house.nonResidentialUnitsCount) },
        {
            title: 'Класс энергетической эффективности',
            value: getRef('Класс энергетической эффективности', house.energyEfficiencyClass),
        },
        {
            title: 'Дата проведения энергетического обследования',
            value: safe(formatDateDayjs(house.energySurveyDate)),
        },
        { title: 'Количество подъездов', value: safe(house.entrancesCount) },
        { title: 'Наибольшее количество этажей', value: safe(house.maxFloorsCount) },
        { title: 'Наименьшее количество этажей', value: safe(house.minFloorsCount) },
        { title: 'Формирование фонда кап. ремонта', value: safe(house.capitalRepairFund) },
        { title: 'Площадь парковки м²', value: safe(house.parkingArea) },
        {
            title: 'Приспособления для МГН',
            value: getRef(
                'Наличие в подъездах приспособлений для нужд маломобильных групп населения',
                house.hasAccessibility
            ),
        },
        {
            title: 'Тип дома',
            value: getRef('Тип дома', house.houseType),
        },
        { title: 'Износ здания, %', value: safe(house.buildingWearPercent) },
        {
            title: 'Дата, на которую установлен износ здания',
            value: safe(formatDateDayjs(house.buildingWearDate)),
        },
        { title: 'Площадь многоквартирного дома, кв.м', value: safe(house.totalArea) },
        { title: 'Площадь жилых помещений, м²', value: safe(house.residentialArea) },
        { title: 'Площадь нежилых помещений, м²', value: safe(house.nonResidentialArea) },
        { title: 'Площадь помещений общего имущества, м²', value: safe(house.commonPropertyArea) },
        { title: 'Площадь зем. участка общего имущества, м²', value: safe(house.landArea) },
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
        { title: 'Водоотведение', value: getRef('Водоотведение', house.sewerage) },
        { title: 'Система водостоков', value: getRef('Система водостоков', house.drainageSystem) },
        { title: 'Газоснабжение', value: getRef('Газоснабжение', house.gasSupply) },
        {
            title: 'Горячее водоснабжение',
            value: getRef('Горячее водоснабжение', house.hotWaterSupply),
        },
        {
            title: 'Система пожаротушения',
            value: getRef('Система пожаротушения', house.fireSuppression),
        },
        { title: 'Теплоснабжение', value: getRef('Теплоснабжение', house.heating) },
        {
            title: 'Холодное водоснабжение',
            value: getRef('Холодное водоснабжение', house.coldWaterSupply),
        },
        { title: 'Электроснабжение', value: getRef('Электроснабжение', house.electricitySupply) },
        {
            title: 'Количество вводов системы электроснабжения, ед.',
            value: safe(house.supplySystemsNumber),
        },
    ];

    const buildStructuralElementsTable = (): ITableInformation[] => [
        { title: 'Мусоропровод', value: safeBool(house.garbageChute) },
        { title: 'Несущие стены', value: getRef('Несущие стены', house.loadBearingWalls) },
        { title: 'Площадь подвала, кв.м', value: safe(house.basementArea) },
        { title: 'Фундамент', value: getRef('Тип фундамента', house.foundationType) },
        { title: 'Перекрытия', value: getRef('Тип перекрытий', house.overlapType) },
    ];

    const buildHotWaterSupplyTable = (): ITableInformation[] => [
        {
            title: 'Тип системы горячего водоснабжения',
            value: getRef('Тип системы горячего водоснабжения', house.hotWaterSystemType),
        },
        {
            title: 'Материал сети',
            value: getRef('Материал сети', house.hotWaterNetworkMaterial),
        },
        {
            title: 'Материал теплоизоляции сети',
            value: getRef('Материал теплоизоляции сети', house.hotWaterInsulationMaterial),
        },
        {
            title: 'Материал стояков',
            value: getRef('Материал стояков', house.hotWaterRiserMaterial),
        },
    ];
    const buildSewerageTable = (): ITableInformation[] => [
        {
            title: 'Тип системы водоотведения',
            value: getRef('Тип системы водоотведения', house.sewerageSystemType),
        },
        { title: 'Материал сети', value: getRef('Материал сети', house.sewerageNetworkMaterial) },
    ];
    const buildGasSystemTable = (): ITableInformation[] => [
        {
            title: 'Тип системы газоснабжения',
            value: getRef('Тип системы газоснабжения', house.gasSystemType),
        },
    ];
    const buildElectricSystemTable = (): ITableInformation[] => [
        {
            title: 'Количество вводов системы электроснабжения',
            value: safe(house.supplySystemsNumber),
        },
    ];
    const buildFundamentTable = (): ITableInformation[] => [
        { title: 'Фундамент', value: getRef('Тип фундамента', house.foundationType) },
        {
            title: 'Материал фундамента',
            value: getRef('Материал фундамента', house.foundationMaterial),
        },
        { title: 'Площадь отмостки', value: safe(house.blindArea) },
    ];
    const buildInnerWall = (): ITableInformation[] => [
        {
            title: 'Тип внутренних стен',
            value: getRef('Тип внутренних стен', house.internalWallsType),
        },
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
        {
            title: 'Год проведения последнего капитального ремонта',
            value: safe(house.facadeLastMajorRepairYear),
        },
    ];
    const buildOverlapTable = (): ITableInformation[] => [
        { title: 'Тип перекрытия', value: getRef('Тип перекрытий', house.overlapType) },
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
        {
            title: 'Год проведения последнего капитального ремонта кровли',
            value: safe(house.roofLastMajorRepairYear),
        },
    ];

    const buildWindowTable = (): ITableInformation[] => [
        { title: 'Материал окон', value: getRef('Материал окон', house.windowMaterial) },
    ];

    const buildHeatingTable = (): ITableInformation[] => [
        { title: 'Материал сети', value: getRef('Материал сети', house.heatingNetworkMaterial) },
        {
            title: 'Материал теплоизоляции сети',
            value: getRef('Материал теплоизоляции сети', house.heatingInsulationMaterial),
        },
    ];
    const buildHeatingSystemRisersTable = (): ITableInformation[] => [
        { title: 'Физический износ, %', value: safe(house.heatingRiserValveWear) },
        {
            title: 'Тип поквартирной разводки внутридомовой системы отопления',
            value: getRef(
                'Тип поквартирной разводки внутридомовой системы отопления',
                house.heatingRiserLayoutType
            ),
        },
        { title: 'Материал', value: getRef('Материал стояков', house.heatingRiserMaterial) },
    ];
    const buildWaterSystemWearTable = (): ITableInformation[] => [
        { title: 'Физический износ, %', value: safe(house.waterSystemValveWear) },
    ];
    const buildColdWaterSystemWearTable = (): ITableInformation[] => [
        { title: 'Физический износ, %', value: safe(house.coldWaterValveWear) },
    ];
    const buildHotWaterSystemWearTable = (): ITableInformation[] => [
        { title: 'Физический износ, %', value: safe(house.hotWaterValveWear) },
    ];

    const buildHeatingDevices = (): ITableInformation[] => [
        { title: 'Физический износ, %', value: safe(house.heatingDeviceWear) },
        {
            title: 'Тип отопительных приборов',
            value: getRef('Тип отопительных приборов', house.heatingDeviceType),
        },
    ];
    const buildColdWaterSystemTable = (): ITableInformation[] => [
        { title: 'Физический износ, %', value: safe(house.coldWaterPhysicalWear) },
        {
            title: 'Материал сети',
            value: getRef('Материал сети', house.coldWaterNetworkMaterial),
        },
    ];
    const buildColdWaterSystemRiserTable = (): ITableInformation[] => [
        { title: 'Физический износ, %', value: safe(house.coldWaterRiserWear) },
        { title: 'Материал сети', value: getRef('Материал сети', house.coldWaterRiserMaterial) },
    ];
    const buildHotWaterSystemRiserTable = (): ITableInformation[] => [
        { title: 'Физический износ, %', value: safe(house.hotWaterRiserWear) },
    ];
    const buildAdditionalInfoTable = (): ITableInformation[] => [
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
        buildHotWaterSupplyTable,
        buildSewerageTable,
        buildGasSystemTable,
        buildElectricSystemTable,
        buildFundamentTable,
        buildInnerWall,
        buildOverlapTable,
        buildWindowTable,
        buildHeatingTable,
        buildHeatingSystemRisersTable,
        buildWaterSystemWearTable,
        buildHeatingDevices,
        buildColdWaterSystemTable,
        buildColdWaterSystemRiserTable,
        buildHotWaterSystemRiserTable,
        buildHotWaterSystemWearTable,
        buildColdWaterSystemWearTable,
    };
};
