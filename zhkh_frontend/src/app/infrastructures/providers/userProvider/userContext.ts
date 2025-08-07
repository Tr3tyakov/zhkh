import React from 'react';
import { IUserContext } from './userProvider.interfaces.ts';

export const UserContext = React.createContext<IUserContext | null>(null);
