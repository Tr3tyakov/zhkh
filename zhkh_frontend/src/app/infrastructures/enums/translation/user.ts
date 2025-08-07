import { AccountStatusEnum, UserTypeEnum } from '../user.ts';

export const userTypeTranslations: Record<UserTypeEnum, string> = {
    [UserTypeEnum.ADMIN]: 'Администратор',
    [UserTypeEnum.USER]: 'Пользователь',
};

export const accountStatusTranslations: Record<AccountStatusEnum, string> = {
    [AccountStatusEnum.ACTIVE]: 'Активен',
    [AccountStatusEnum.BLOCKED]: 'Заблокирован',
};

export const typeOptions = Object.values(UserTypeEnum).map((type) => ({
    value: userTypeTranslations[type],
    id: type,
}));
export const accountStatusOptions = Object.values(AccountStatusEnum).map((type) => ({
    value: accountStatusTranslations[type],
    id: type,
}));
