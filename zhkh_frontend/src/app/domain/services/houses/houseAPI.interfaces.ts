import { AxiosResponse } from 'axios';
import { IHouseFiltersState } from '../../../../widgets/house/houses/houseFilter/houseFilter.interfaces';

interface IHouse {
    // Адрес
    region?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    building?: string;

    // Основные сведения
    commissioningYear?: number;
    isEmergency?: boolean;
    condition?: number;
    apartmentsCount?: number;
    nonResidentialUnitsCount?: number;

    // Энергоэффективность
    energyEfficiencyClass?: number;
    energySurveyDate?: string; // ISO дата

    // Этажность
    entrancesCount?: number;
    maxFloorsCount?: number;
    minFloorsCount?: number;
    undergroundFloorsCount?: number;

    // Ремонт и доступность
    capitalRepairFund?: number;
    parkingArea?: number;
    hasAccessibility?: number;

    // Технические характеристики
    houseType?: number;
    buildingWearPercent?: number;
    buildingWearDate?: string; // ISO дата

    // Площади
    totalArea?: number;
    residentialArea?: number;
    nonResidentialArea?: number;
    commonPropertyArea?: number;
    landArea?: number;

    // Статус здания
    buildingSeries?: number;
    isCulturalHeritage?: undefined;

    // Компания и ID
    companyId?: number;

    // --- Инженерные системы ---
    ventilation?: number;
    sewerage?: number;
    drainageSystem?: number;
    gasSupply?: number;
    hotWaterSupply?: number;
    fireSuppression?: number;
    heating?: number;
    coldWaterSupply?: number;
    electricitySupply?: number;
    numberOfInputs?: number;

    // --- Конструктивные элементы ---
    garbageChute?: boolean;
    garbageChuteType?: number;
    loadBearingWalls?: number;
    basementArea?: number;
    foundationType?: number;
    foundationMaterial?: number;
    blindArea?: number;
    overlapType?: number;

    // --- Система горячего водоснабжения ---
    hotWaterSystemType?: string;
    hotWaterPhysicalWear?: number;
    hotWaterNetworkMaterial?: string;
    hotWaterInsulationMaterial?: string;
    hotWaterRiserMaterial?: string;

    // --- Система водоотведения ---
    sewerageSystemType?: string;
    sewerageNetworkMaterial?: string;

    // --- Система газоснабжения ---
    gasSystemType?: string;

    // --- Внутренние стены ---
    internalWallsType?: number;

    // --- Фасад ---
    facadeWallType?: number;
    facadeInsulationType?: number;
    facadeFinishingMaterial?: number;
    facadeLastMajorRepairYear?: number;

    // --- Крыша ---
    roofShape?: number;
    atticInsulationLayers?: number;
    roofSupportStructureType?: number;
    roofCoveringType?: number;
    roofLastMajorRepairYear?: number;

    // --- Окна ---
    windowMaterial?: number;

    // --- Система отопления ---
    heatingPhysicalWear?: number;
    heatingNetworkMaterial?: string;
    heatingInsulationMaterial?: string;

    // --- Стояки системы отопления ---
    heatingRiserLayoutType?: string;
    heatingRiserMaterial?: string;
    heatingRiserValveWear?: number;

    // --- Отопительные приборы ---
    heatingDeviceType?: string;
    heatingDeviceWear?: number;

    // --- Система холодного водоснабжения ---
    coldWaterPhysicalWear?: number;
    coldWaterNetworkMaterial?: string;

    // --- Стояки системы холодного водоснабжения ---
    coldWaterRiserWear?: number;
    coldWaterRiserMaterial?: string;

    // --- Запорная арматура системы холодного водоснабжения ---
    coldWaterValveWear?: number;

    // --- Стояки системы горячего водоснабжения ---
    hotWaterRiserWear?: number;

    // --- Запорная арматура системы горячего водоснабжения ---
    hotWaterValveWear?: number;

    // --- Примечание ---
    note?: string;
}

interface ICreateHouseData extends IHouse {}

interface IUpdateHouseData extends IHouse {}

interface IHouseResponse extends IHouse {
    id: number;
}

interface IGetHousesResponse {
    total: number;
    houses: IHouseResponse[];
}

interface IHouseField {
    field: string;
    description: string;
}

interface IHouseRegionsResponse {
    oblasts: string[];
    cities: string[];
    krais: string[];
    republics: string[];
    autonomousAreas: string[];
    autonomousOkrugs: string[];
}

interface IHouseCitiesResponse {
    oblasts: string[];
    cities: string[];
    krais: string[];
    republics: string[];
    autonomousAreas: string[];
    autonomousOkrugs: string[];
}

interface IHouseQueryParams {
    region?: string | null;
    city?: string | null;
}

interface IHouseAPI {
    createHouse: (data: ICreateHouseData) => Promise<AxiosResponse>;
    updateHouse: (houseId: number, data: IUpdateHouseData) => Promise<AxiosResponse>;
    deleteHouse: (houseId: number) => Promise<AxiosResponse>;

    getHouses: (
        limit: number,
        offset: number,
        filter: IHouseFiltersState,
        queries: IHouseQueryParams
    ) => Promise<IGetHousesResponse>;
    getHouseFields: () => Promise<IHouseField[]>;
    getHouseInformation: (houseId: number) => Promise<IHouseResponse>;
    attachToCompany: (houseId: number, companyId: number) => Promise<AxiosResponse>;
    untieFromCompany: (houseId: number, companyId: number) => Promise<AxiosResponse>;
    getRegions: () => Promise<IHouseRegionsResponse>;
    getCities: () => Promise<string[]>;
    getAttachedHouses: (
        companyId: number,
        limit: number,
        offset: number,
        searchValue?: string
    ) => Promise<IGetHousesResponse>;
}

export type {
    IHouse,
    IHouseAPI,
    IHouseResponse,
    ICreateHouseData,
    IUpdateHouseData,
    IHouseField,
    IHouseRegionsResponse,
    IHouseQueryParams,
    IHouseCitiesResponse,
};
