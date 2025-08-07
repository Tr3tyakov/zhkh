import React, { useState } from 'react';
import { IUserProvider } from './userProvider.interfaces.ts';
import { IUserResponse } from '../../../domain/services/users/userAPI.interfaces.ts';
import { UserContext } from './userContext.ts';

export const UserProvider: React.FC<IUserProvider> = ({ children }) => {
    const [user, setUser] = useState<IUserResponse | null>(null);

    const setupUser = (newUser: IUserResponse | null) => {
        setUser(newUser);
    };

    return <UserContext.Provider value={{ user, setupUser }}>{children}</UserContext.Provider>;
};
