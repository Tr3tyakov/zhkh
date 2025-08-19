const address = [
    { name: 'region', label: 'Регион' },
    { name: 'city', label: 'Населённый пункт' },
    { name: 'street', label: 'Улица' },
    { name: 'houseNumber', label: 'Номер дома' },
    { name: 'building', label: 'Корпус' },
];

const floors = [
    { name: 'entrancesCount', label: 'Количество подъездов' },
    { name: 'maxFloorsCount', label: 'Наибольшее количество этажей' },
    { name: 'minFloorsCount', label: 'Наименьшее количество этажей' },
];

const squares = [
    { name: 'totalArea', label: 'Площадь многоквартирного дома, м²' },
    { name: 'residentialArea', label: 'Площадь жилых помещений, м²' },
    {
        name: 'nonResidentialArea',
        label: 'Площадь нежилых помещений, м²',
    },
    {
        name: 'commonPropertyArea',
        label: 'Площадь общего имущества, м²',
    },
    { name: 'landArea', label: 'Площадь земельного участка, м²' },
];

export { address, floors, squares };
