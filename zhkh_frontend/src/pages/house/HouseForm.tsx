import React from 'react';
import { useFormik } from 'formik';
import { Box, Button, Checkbox, Container, FormControlLabel, Typography } from '@mui/material';
import { validationSchema } from './createHouse/createHousePage.validation';
import { Section } from '../../shared/forms/section/Section';
import { FieldGroup } from '../../shared/forms/group/FieldGroup';
import { LoadingProgress } from '../../shared/loading/loadingProgress/LoadingProgress';
import { IHouseForm } from './createHouse/createHousePage.interfaces';
import { address, floors, squares } from './createHouse/createHousePage.constants';
import { CustomSelect } from '../../app/domain/components/CustomSelect';
import { useReferenceBook } from '../../app/domain/hooks/useReferenceBooks/useReferenceBook.ts';

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
        width = 430,
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
        fields: { name: string; label: string; referenceKey?: string }[],
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

                    <Section title="Адрес">{renderFields(address)}</Section>
                    <Section title="Основные сведения">
                        {renderFields([
                            {
                                name: 'commissioningYear',
                                label: 'Год ввода в эксплуатацию',
                                type: 'number',
                            },
                            {
                                name: 'apartmentsCount',
                                label: 'Количество квартир',
                                type: 'number',
                            },
                            {
                                name: 'nonResidentialUnitsCount',
                                label: 'Количество нежилых помещений',
                                type: 'number',
                            },
                            {
                                name: 'cadastralNumber',
                                label: 'Кадастровый номер',
                                type: 'text',
                            }, {
                                name: 'classifierCode',
                                label: 'Код ОКТМО',
                                type: 'text',
                            },
                            { name: 'condition', label: 'Состояние дома', type: 'text' },
                        ])}
                    </Section>

                    <Section title="Энергоэффективность">
                        {renderFields([
                            {
                                name: 'energySurveyDate',
                                label: 'Дата обследования',
                                type: 'date',
                            },
                        ])}
                        <CustomSelect
                            name="energyEfficiencyClass"
                            label="Класс энергетической эффективности"
                            formik={formik}
                        />
                    </Section>

                    <Section title="Этажность">{renderFields(floors)}</Section>

                    <Section title="Технические характеристики">
                        {renderFields([
                            {
                                name: 'buildingWearPercent',
                                label: 'Износ здания (%)',
                                type: 'number',
                            },
                            {
                                name: 'buildingWearDate',
                                label: 'Дата установления износа',
                                type: 'date',
                            },
                            {
                                name: 'numberOfInputs',
                                label: 'Количество вводов в дом',
                                type: 'number',
                            },
                        ])}
                        <CustomSelect name="houseType" label="Тип дома" formik={formik} />
                        <CustomSelect
                            name="buildingSeries"
                            label="Серия, тип постройки"
                            formik={formik}
                        />
                    </Section>

                    <Section title="Площади">{renderFields(squares)}</Section>

                    <Section title="Фонды и доступность">
                        <Box display="flex" flexDirection="column" gap="10px">
                            <CustomSelect
                                name="capitalRepairFund"
                                label="Формирование фонда кап. ремонта"
                                formik={formik}
                            />
                            <CustomSelect
                                name="hasAccessibility"
                                label="Наличие в подъездах приспособлений для нужд маломобильных групп населения"
                                formik={formik}
                            />
                        </Box>
                        {renderFields([
                            { name: 'parkingArea', label: 'Площадь парковки, м²', type: 'number' },
                        ])}
                    </Section>

                    <Section title="Инженерные системы">
                        <Box display="flex" flexWrap="wrap" gap="10px">
                            {renderReferenceFields([
                                { name: 'ventilation', label: 'Вентиляция' },
                                { name: 'sewerage', label: 'Водоотведение' },
                                { name: 'drainageSystem', label: 'Система водостоков' },
                                { name: 'gasSupply', label: 'Газоснабжение' },
                                { name: 'coldWaterSupply', label: 'Холодное водоснабжение' },
                                { name: 'hotWaterSupply', label: 'Горячее водоснабжение' },
                                { name: 'fireSuppression', label: 'Система пожаротушения' },
                                { name: 'heating', label: 'Теплоснабжение' },
                                { name: 'electricitySupply', label: 'Электроснабжение' },
                            ])}
                        </Box>

                        <Box display="flex" flexWrap="wrap" gap="10px">
                            {renderReferenceFields([
                                { name: 'gasSystemType', label: 'Тип системы газоснабжения' },
                                {
                                    name: 'hotWaterSystemType',
                                    label: 'Тип системы горячего водоснабжения',
                                },
                                { name: 'sewerageSystemType', label: 'Тип системы водоотведения' },
                                { name: 'sewerageNetworkMaterial', label: 'Материал сети' },
                            ])}
                        </Box>

                        <Box display="flex" flexWrap="wrap" gap="10px">
                            {renderReferenceFields([
                                {
                                    name: 'hotWaterNetworkMaterial',
                                    label: 'Материал сети ГВС',
                                    referenceKey: 'Материал сети',
                                },
                                {
                                    name: 'hotWaterInsulationMaterial',
                                    label: 'Материал теплоизоляции сети ГВС',
                                    referenceKey: 'Материал сети',
                                },
                                {
                                    name: 'hotWaterRiserMaterial',
                                    label: 'Материал стояков ГВС',
                                    referenceKey: 'Материал стояков',
                                },
                                {
                                    name: 'heatingNetworkMaterial',
                                    label: 'Материал сети отопления',
                                    referenceKey: 'Материал сети',
                                },
                                {
                                    name: 'heatingInsulationMaterial',
                                    label: 'Материал теплоизоляции сети отопления',
                                    referenceKey: 'Материал сети',
                                },
                                {
                                    name: 'heatingRiserMaterial',
                                    label: 'Материал стояков отопления',
                                    referenceKey: 'Материал стояков',
                                },
                                {
                                    name: 'heatingRiserLayoutType',
                                    label: 'Тип поквартирной разводки системы отопления',
                                    referenceKey: 'Тип поквартирной разводки внутридомовой системы отопления',
                                },
                            ])}
                        </Box>
                        <Box display="flex" flexWrap="wrap" gap="10px">
                            {renderFields([
                                {
                                    name: 'hotWaterPhysicalWear',
                                    label: 'Физический износ системы ГВС',
                                    type: 'number',
                                },
                                {
                                    name: 'heatingRiserValveWear',
                                    label: 'Физический износ запорной арматуры отопления',
                                    type: 'number',
                                },
                            ])}
                        </Box>
                    </Section>

                    <Section title="Конструктивные элементы">
                        {handleCheckbox('garbageChute')}
                        <CustomSelect
                            name="garbageChuteType"
                            label="Тип мусоропровода"
                            formik={formik}
                        />
                        {renderReferenceFields([
                            {
                                name: 'loadBearingWalls',
                                label: 'Несущие стены',
                            },
                            {
                                name: 'foundationType',
                                label: 'Тип фундамента',
                            },
                            {
                                name: 'foundationMaterial',
                                label: 'Материал фундамента',
                            },
                            {
                                name: 'overlapType',
                                label: 'Тип перекрытий',
                            },
                            {
                                name: 'internalWallsType',
                                label: 'Тип внутренних стен',
                            },
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
                            {
                                name: 'windowMaterial',
                                label: 'Материал окон',
                            },
                            {
                                name: 'isCulturalHeritage',
                                label: 'Статус объекта культурного наследия',
                            },
                            {
                                name: 'heatingDeviceType',
                                label: 'Тип отопительных приборов',
                            },
                            {
                                name: 'coldWaterNetworkMaterial',
                                label: 'Материал сети ХВС',
                                referenceKey: 'Материал сети',
                            },
                            {
                                name: 'coldWaterRiserMaterial',
                                label: "Материал сети стояков ХВС",
                                referenceKey: 'Материал сети',
                            },
                        ])}
                        {renderFields([
                            {
                                name: 'roofLastMajorRepairYear',
                                label: 'Год кап. ремонта кровли',
                                type: 'number',
                            },
                            {
                                name: 'facadeLastMajorRepairYear',
                                label: 'Год последнего кап. ремонта фасада',
                                type: 'number',
                            },
                            { name: 'basementArea', label: 'Площадь подвала', type: 'number' },
                            { name: 'blindArea', label: 'Площадь отмостки', type: 'number' },
                        ])}
                    </Section>

                    <Section title="Дополнительно">
                        {renderFields([{ name: 'note', label: 'Примечание администратора' }])}
                    </Section>

                    {handleCheckbox('isEmergency')}

                    <Section title="Система холодного водоснабжения">
                        {renderFields([
                            {
                                name: 'coldWaterPhysicalWear',
                                label: 'Физический износ системы ХВС',
                                type: 'number',
                            },
                            {
                                name: 'coldWaterRiserWear',
                                label: 'Физический износ стояков ХВС',
                                type: 'number',
                            },
                            {
                                name: 'coldWaterValveWear',
                                label: 'Физический износ запорной арматуры ХВС',
                                type: 'number',
                            },
                            {
                                name: 'waterSystemValveWear',
                                label: 'Физический износ запорной арматуры системы отопления',
                                type: 'number',
                            },
                            {
                                name: 'heatingDeviceWear',
                                label: 'Физический износ отопительных приборов',
                            },
                        ])}
                    </Section>

                    <Section title="Система горячего водоснабжения">
                        {renderFields([
                            {
                                name: 'hotWaterRiserWear',
                                label: 'Физический износ стояков ГВС',
                                type: 'number',
                            },
                            {
                                name: 'hotWaterValveWear',
                                label: 'Физический износ запорной арматуры ГВС',
                                type: 'number',
                            },
                        ])}
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
