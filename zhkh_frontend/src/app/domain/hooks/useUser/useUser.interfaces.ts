import { IUserContext } from '../../../infrastructures/providers/userProvider/userProvider.interfaces.ts';

interface IUseUser {
    (): IUserContext;
}

export type { IUseUser };
