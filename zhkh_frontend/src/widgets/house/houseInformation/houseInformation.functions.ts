import { IHouseResponse } from '../../../app/domain/services/houses/houseAPI.interfaces.ts';

export const formatHouseAddress = (data: IHouseResponse | null): string | undefined => {
    if (!data) return;
    return `${data.region} г. ${data.city} ул. ${data.street} д. ${data.houseNumber}${data.building ? ` корп. ${data.building}` : ''}`;
};
