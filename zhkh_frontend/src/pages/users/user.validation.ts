import * as Yup from 'yup';

const DefaultUserValidationSchema = {
    firstName: Yup.string().required('Имя обязательно'),
    middleName: Yup.string().required('Фамилия обязательна'),
    lastName: Yup.string().required('Отчество обязательно'),
    email: Yup.string()
        .email('Введите корректный адрес электронной почты (например, example@mail.ru)')
        .required('Почта обязательна'),
    userType: Yup.string().required('Тип пользователя обязателен'),
    accountStatus: Yup.string().required('Тип аккаунта обязателен'),
    workPhone: Yup.string()
        .nullable()
        .matches(/^\+?[\d\s\-()]+$/, 'Некорректный номер телефона'),
    privatePhone: Yup.string()
        .nullable()
        .matches(/^\+?[\d\s\-()]+$/, 'Некорректный номер телефона'),
};

export const UpdateUserValidationSchema = Yup.object({
    ...DefaultUserValidationSchema,
    password: Yup.string(),
});
export const CreateUserValidationSchema = Yup.object({
    ...DefaultUserValidationSchema,
    password: Yup.string().required('Пароль обязателен'),
});
export const createUserInitialValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    password: null,
    email: '',
    workPhone: '',
    privatePhone: '',
    userType: '',
    accountStatus: '',
};
