import * as Yup from 'yup';
import { IBaseCompany } from '../../app/domain/services/companies/companyAPI.interfaces.ts';

const companyValidationSchema = Yup.object({
    name: Yup.string().required('Название обязательно'),
    legalForm: Yup.string(),
    inn: Yup.string()
        .matches(/^\d{10}(\d{2})?$/, 'ИНН должен содержать 10 или 12 цифр')
        .required('ИНН обязателен'),
    address: Yup.string().required('Адрес обязателен'),
    phone: Yup.string()
        .matches(/^\+7\d{10}$/, 'Телефон должен быть в формате +7(XXX)-(XXX)-XX-XX')
        .nullable(),
    email: Yup.string()
        .trim()
        .email('Введите корректный адрес электронной почты (например, example@mail.ru)')
        .required('Почта обязательна'),
    website: Yup.string().url('Некорректный URL').nullable(),
});

const companyInitialValues: IBaseCompany = {
    name: '',
    legalForm: '',
    inn: '',
    address: '',
    phone: '',
    email: '',
    website: '',
};

export { companyInitialValues, companyValidationSchema };
