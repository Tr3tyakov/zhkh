import { IUserResponse } from '../../../domain/services/users/userAPI.interfaces.ts';
import { ReactNode } from 'react';

interface IUserContext {
    user: IUserResponse | null;
    setupUser: (newUser: IUserResponse | null) => void;
}

interface IUserProvider {
    children: ReactNode;
}

export type { IUserContext, IUserProvider };
