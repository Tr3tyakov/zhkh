interface IHousesFilter {
    fetchHouses: (value: string | null, page: number) => void;
}

export type { IHousesFilter };
