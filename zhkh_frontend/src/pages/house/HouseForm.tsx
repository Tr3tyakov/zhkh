import React from 'react';
import { useFormik } from 'formik';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Stack,
    Typography,
} from '@mui/material';
import { validationSchema } from './createHouse/createHousePage.validation';
import { Section } from '../../shared/forms/section/Section';
import { FieldGroup } from '../../shared/forms/group/FieldGroup';
import { LoadingProgress } from '../../shared/loading/loadingProgress/LoadingProgress';
import { IHouseForm } from './createHouse/createHousePage.interfaces';

import { CustomSelect } from '../../app/domain/components/CustomSelect';
import { useReferenceBook } from '../../app/domain/hooks/useReferenceBooks/useReferenceBook.ts';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';

export const HouseForm: React.FC<IHouseForm> = ({
    id,
    initialValues,
    isLoading,
    onSubmit,
    title,
}) => {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
        enableReinitialize: true,
    });
    const { referenceBooks } = useReferenceBook();

    const handleCheckbox = (name: string) => (
        <FormControlLabel
            control={
                <Checkbox
                    id={name}
                    checked={Boolean(formik.values[name])}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    color="primary"
                />
            }
            label={
                {
                    isEmergency: 'Признан ли дом аварийным',
                    garbageChute: 'Наличие мусоропровода',
                }[name]
            }
        />
    );

    const renderFields = (
        fields: { name: string; label: string; type?: string; mask?: string }[],
        width = 430
    ) =>
        fields.map(({ name, label, type }) => (
            <FieldGroup
                key={name}
                name={name}
                title={label}
                type={type}
                width={width}
                formik={formik}
            />
        ));

    const renderReferenceFields = (
        fields: { name: string; label: string; referenceKey?: string }[]
    ) => {
        return fields.map(({ name, label, referenceKey }) => {
            const options = referenceKey ? referenceBooks?.[referenceKey] || [] : null;
            return (
                <Box key={name} flex={1} width="100%" maxWidth="400px">
                    <CustomSelect name={name} label={label} options={options} formik={formik} />
                </Box>
            );
        });
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Container maxWidth="lg">
                <Box mt={2} mb={4} p={3} boxShadow={1} borderRadius={5}>
                    <Typography fontSize={18} fontWeight={500} gutterBottom>
                        {title}
                    </Typography>
                    <Section
                        title="Паспортные данные"
                        icon={<ApartmentRoundedIcon color="primary" />}
                    >
                        <Box width="100%" display="flex" gap="4px">
                            {renderFields([
                                { name: 'region', label: 'Регион' },
                                { name: 'city', label: 'Населённый пункт' },
                                { name: 'street', label: 'Улица' },
                                { name: 'houseNumber', label: 'Номер дома' },
                                { name: 'building', label: 'Корпус' },
                            ])}
                        </Box>

                        <Box width="100%" display="flex" gap="4px">
                            {renderFields([
                                {
                                    name: 'maxFloorsCount',
                                    label: 'Максимальное количество этажей',
                                    type: 'number',
                                },
                            ])}
                            {renderFields([
                                {
                                    name: 'minFloorsCount',
                                    label: 'Минимальное количество этажей',
                                    type: 'number',
                                },
                            ])}
                            {renderFields([
                                {
                                    name: 'apartmentsCount',
                                    label: 'Количество квартир',
                                    type: 'number',
                                },
                            ])}
                        </Box>

                        <Box width="100%" display="flex" gap="4px">
                            <CustomSelect name="houseType" label="Тип дома" formik={formik} />
                            <CustomSelect
                                name="buildingSeries"
                                label="Серия, тип постройки"
                                formik={formik}
                            />
                            <CustomSelect
                                name="capitalRepairFund"
                                label="Формирование фонда кап. ремонта"
                                formik={formik}
                            />
                        </Box>
                        <Box width="100%" display="flex" gap="4px" flexWrap="wrap">
                            {renderReferenceFields([
                                { name: 'overlapType', label: 'Тип перекрытий' },
                                {
                                    name: 'loadBearingWalls',
                                    label: 'Несущие стены',
                                },
                            ])}
                            <CustomSelect
                                name="garbageChuteType"
                                label="Тип мусоропровода"
                                formik={formik}
                            />
                        </Box>
                        <Box width="100%" display="flex" gap="4px">
                            {renderFields([
                                {
                                    name: 'commissioningYear',
                                    label: 'Год ввода в эксплуатацию',
                                    type: 'number',
                                },
                                { name: 'classifierCode', label: 'Код ОКТМО' },
                                {
                                    name: 'cadastralNumber',
                                    label: 'Кадастровый номер',
                                },
                            ])}
                        </Box>
                        <Box>{handleCheckbox('isEmergency')}</Box>
                    </Section>

                    <Section
                        title="Основные сведения"
                        icon={<ApartmentRoundedIcon color="primary" />}
                    >
                        {renderFields([
                            {
                                name: 'condition',
                                label: 'Состояние дома',
                                type: 'text',
                            },

                            {
                                name: 'energySurveyDate',
                                label: 'Дата проведения энергетического обследования',
                                type: 'date',
                            },
                            {
                                name: 'buildingWearDate',
                                label: 'Дата, на которую установлен износ здания',
                                type: 'date',
                            },
                        ])}
                        <Box width="100%" display="flex" gap="4px">
                            <CustomSelect
                                name="energyEfficiencyClass"
                                label="Класс энергетической эффективности"
                                formik={formik}
                            />
                            <CustomSelect
                                name="capitalRepairFund"
                                label="Формирование фонда кап. ремонта"
                                formik={formik}
                            />
                        </Box>
                        <Box width="100%" display="flex" gap="4px">
                            <CustomSelect
                                name="hasAccessibility"
                                label="Наличие в подъездах приспособлений для нужд маломобильных групп населения"
                                formik={formik}
                            />
                            {renderReferenceFields([
                                {
                                    name: 'isCulturalHeritage',
                                    label: 'Является ли объектом культурного наследия',
                                    referenceKey: 'Статус объекта культурного наследия',
                                },
                            ])}
                        </Box>
                        <Box width="100%" display="flex" gap="4px">
                            {renderFields([
                                {
                                    name: 'entrancesCount',
                                    label: 'Количество подъездов',
                                    type: 'number',
                                },
                                {
                                    name: 'nonResidentialUnitsCount',
                                    label: 'Количество нежилых помещений',
                                    type: 'number',
                                },
                                {
                                    name: 'buildingWearPercent',
                                    label: 'Износ здания (%)',
                                    type: 'number',
                                },
                            ])}
                        </Box>
                        <Box width="100%" display="flex" gap="4px">
                            {renderFields([
                                {
                                    name: 'totalArea',
                                    label: 'Площадь многоквартирного дома',
                                    type: 'number',
                                },
                                {
                                    name: 'residentialArea',
                                    label: 'Площадь жилых помещений, м²',
                                    type: 'number',
                                },
                                {
                                    name: 'nonResidentialArea',
                                    label: 'Площадь нежилых помещений, м²',
                                    type: 'number',
                                },
                            ])}
                        </Box>

                        <Box width="100%" display="flex" gap="4px">
                            {renderFields([
                                {
                                    name: 'parkingArea',
                                    label: 'Площадь парковки м²',
                                    type: 'number',
                                },
                                {
                                    name: 'commonPropertyArea',
                                    label: 'Площадь помещений общего имущества, м²',
                                    type: 'number',
                                },
                                {
                                    name: 'landArea',
                                    label: 'Площадь зем. участка общего имущества, м²',
                                    type: 'number',
                                },
                            ])}
                        </Box>
                    </Section>

                    <Section
                        title="Инженерные системы"
                        icon={<ApartmentRoundedIcon color="primary" />}
                    >
                        <Box
                            display="flex"
                            flexWrap="wrap"
                            gap="10px"
                            icon={<ApartmentRoundedIcon color="primary" />}
                        >
                            {renderReferenceFields([
                                { name: 'ventilation', label: 'Вентиляция' },
                                { name: 'sewerage', label: 'Водоотведение' },
                                { name: 'drainageSystem', label: 'Система водостоков' },
                                { name: 'gasSupply', label: 'Газоснабжение' },
                                { name: 'hotWaterSupply', label: 'Горячее водоснабжение' },
                                { name: 'coldWaterSupply', label: 'Холодное водоснабжение' },
                                { name: 'fireSuppression', label: 'Система пожаротушения' },
                                { name: 'heating', label: 'Теплоснабжение' },
                                { name: 'electricitySupply', label: 'Электроснабжение' },
                            ])}
                            {renderFields([
                                {
                                    name: 'supplySystemsNumber',
                                    label: 'Количество вводов системы электроснабжения, ед.',
                                    type: 'number',
                                },
                            ])}
                        </Box>
                    </Section>
                    <Section
                        title="Конструктивные элементы"
                        icon={<ApartmentRoundedIcon color="primary" />}
                    >
                        <Box display="flex" width="100%" gap="10px">
                            {renderFields([
                                { name: 'basementArea', label: 'Площадь подвала', type: 'number' },
                            ])}
                            {renderReferenceFields([
                                {
                                    name: 'foundationType',
                                    label: 'Тип фундамента',
                                },
                                {
                                    name: 'overlapType',
                                    label: 'Тип перекрытий',
                                },
                            ])}
                        </Box>
                        {handleCheckbox('garbageChute')}
                    </Section>
                    <Section
                        title="Подробные сведения о конструктиве и инженерных сетях"
                        icon={<ApartmentRoundedIcon color="primary" />}
                    >
                        <Stack>
                            <Box
                                display="flex"
                                gap="5px"
                                width="100%"
                                flexWrap="wrap"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Система горячего водоснабжения
                                </Typography>
                                <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                    {renderReferenceFields([
                                        {
                                            name: 'hotWaterSystemType',
                                            label: 'Тип системы горячего водоснабжения',
                                        },
                                        {
                                            name: 'hotWaterNetworkMaterial',
                                            label: 'Материал сети',
                                            referenceKey: 'Материал сети',
                                        },
                                        {
                                            name: 'hotWaterInsulationMaterial',
                                            label: 'Материал теплоизоляции сети',
                                            referenceKey: 'Материал теплоизоляции сети',
                                        },
                                        {
                                            name: 'hotWaterRiserMaterial',
                                            label: 'Материал стояков',
                                            referenceKey: 'Материал стояков',
                                        },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Система водоотведения
                                </Typography>
                                <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                    {renderReferenceFields([
                                        {
                                            name: 'sewerageSystemType',
                                            label: 'Тип системы водоотведения',
                                        },
                                        { name: 'sewerageNetworkMaterial', label: 'Материал сети' },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Система газоснабжения
                                </Typography>
                                <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                    {renderReferenceFields([
                                        {
                                            name: 'gasSystemType',
                                            label: 'Тип системы газоснабжения',
                                        },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Фундамент
                                </Typography>

                                <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                    {renderReferenceFields([
                                        {
                                            name: 'foundationMaterial',
                                            label: 'Материал фундамента',
                                        },
                                    ])}
                                    {renderFields([
                                        {
                                            name: 'blindArea',
                                            label: 'Площадь отмостки',
                                            type: 'number',
                                        },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Внутренние стены
                                </Typography>
                                {renderReferenceFields([
                                    {
                                        name: 'internalWallsType',
                                        label: 'Тип внутренних стен',
                                    },
                                ])}
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Крыша
                                </Typography>
                                <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                    {renderReferenceFields([
                                        {
                                            name: 'roofShape',
                                            label: 'Форма крыши',
                                        },
                                        {
                                            name: 'atticInsulationLayers',
                                            label: 'Утепляющие слои чердачных перекрытий',
                                        },
                                        {
                                            name: 'roofSupportStructureType',
                                            label: 'Вид несущей части',
                                        },
                                        {
                                            name: 'roofCoveringType',
                                            label: 'Тип кровли',
                                        },
                                    ])}
                                    {renderFields([
                                        {
                                            name: 'roofLastMajorRepairYear',
                                            label: 'Год кап. ремонта кровли',
                                            type: 'number',
                                        },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Фасад
                                </Typography>
                                <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                    {renderReferenceFields([
                                        {
                                            name: 'facadeWallType',
                                            label: 'Тип наружных стен',
                                        },
                                        {
                                            name: 'facadeInsulationType',
                                            label: 'Тип наружного утепления фасада',
                                        },
                                        {
                                            name: 'facadeFinishingMaterial',
                                            label: 'Материал отделки фасада',
                                        },
                                    ])}
                                    {renderFields([
                                        {
                                            name: 'facadeLastMajorRepairYear',
                                            label: 'Год проведения последнего капитального ремонта\t',
                                            type: 'number',
                                        },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Окна
                                </Typography>
                                <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                    {renderReferenceFields([
                                        {
                                            name: 'windowMaterial',
                                            label: 'Материал окон',
                                        },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Система отопления
                                </Typography>
                                <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                    {renderReferenceFields([
                                        {
                                            name: 'heatingNetworkMaterial',
                                            label: 'Материал сети отопления',
                                            referenceKey: 'Материал сети',
                                        },
                                        {
                                            name: 'heatingInsulationMaterial',
                                            label: 'Материал теплоизоляции сети отопления',
                                            referenceKey: 'Материал теплоизоляции сети',
                                        },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Отопительные приборы
                                </Typography>
                                <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                    {renderFields([
                                        {
                                            name: 'heatingDeviceWear',
                                            label: 'Физический износ, %',
                                            type: 'number',
                                        },
                                    ])}
                                    {renderReferenceFields([
                                        {
                                            name: 'heatingDeviceType',
                                            label: 'Тип отопительных приборов',
                                        },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Запорная арматура системы отопления
                                </Typography>
                                {renderFields([
                                    {
                                        name: 'waterSystemValveWear',
                                        label: 'Физический износ, %',
                                        type: 'number',
                                    },
                                ])}
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="10px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Система холодного водоснабжения
                                </Typography>
                                <Box display="flex" width="100%" flexWrap="wrap" gap="5px">
                                    {renderFields([
                                        {
                                            name: 'coldWaterPhysicalWear',
                                            label: 'Физический износ, %',
                                            type: 'number',
                                        },
                                    ])}
                                    {renderReferenceFields([
                                        {
                                            name: 'coldWaterNetworkMaterial',
                                            label: 'Материал сети',
                                            referenceKey: 'Материал сети',
                                        },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Стояки системы горячего водоснабжения
                                </Typography>
                                {renderFields([
                                    {
                                        name: 'hotWaterRiserWear',
                                        label: 'Физический износ, %',
                                        type: 'number',
                                    },
                                ])}
                                <Box
                                    mt="20px"
                                    display="flex"
                                    flexWrap="wrap"
                                    gap="5px"
                                    flexDirection="column"
                                >
                                    <Typography fontSize="16px" fontWeight={500}>
                                        Стояки системы отопления
                                    </Typography>
                                    <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                        {renderFields([
                                            {
                                                name: 'heatingRiserValveWear',
                                                label: 'Физический износ, %',
                                                type: 'number',
                                            },
                                        ])}
                                        {renderReferenceFields([
                                            {
                                                name: 'heatingRiserLayoutType',
                                                label: 'Тип поквартирной разводки',
                                                referenceKey:
                                                    'Тип поквартирной разводки внутридомовой системы отопления',
                                            },
                                            {
                                                name: 'heatingRiserMaterial',
                                                label: 'Материал стояков',
                                            },
                                        ])}
                                    </Box>
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Стояки системы холодного водоснабжения
                                </Typography>
                                <Box display="flex" width="100%" flexWrap="wrap" gap="10px">
                                    {renderFields([
                                        {
                                            name: 'coldWaterRiserWear',
                                            label: 'Физический износ, %',
                                            type: 'number',
                                        },
                                    ])}
                                    {renderReferenceFields([
                                        {
                                            name: 'coldWaterRiserMaterial',
                                            label: 'Материал сети',
                                        },
                                    ])}
                                </Box>
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Запорная арматура системы холодного водоснабжения
                                </Typography>
                                {renderFields([
                                    {
                                        name: 'coldWaterValveWear',
                                        label: 'Физический износ, %',
                                        type: 'number',
                                    },
                                ])}
                            </Box>
                            <Box
                                mt="20px"
                                display="flex"
                                flexWrap="wrap"
                                gap="5px"
                                flexDirection="column"
                            >
                                <Typography fontSize="16px" fontWeight={500}>
                                    Запорная арматура системы горячего водоснабжения
                                </Typography>
                                {renderFields([
                                    {
                                        name: 'hotWaterValveWear',
                                        label: 'Физический износ, %',
                                        type: 'number',
                                    },
                                ])}
                            </Box>
                        </Stack>
                    </Section>

                    <Box mt={4} textAlign="center">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                            size="large"
                        >
                            <LoadingProgress isLoading={isLoading} value="Сохранить" />
                        </Button>
                    </Box>
                </Box>
            </Container>
        </form>
    );
};
