// useUser.ts
import { useContext } from 'react';
import { UserContext } from '../../../infrastructures/providers/userProvider/userContext.ts';
import { IUseUser } from './useUser.interfaces.ts';

export const useUser: IUseUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('Хук useUser должен использоваться вместе с UseProvider');
    }

    return context;
};
