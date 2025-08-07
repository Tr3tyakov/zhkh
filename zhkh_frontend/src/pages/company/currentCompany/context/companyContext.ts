import { createContext } from 'react';
import { CompanyContextType } from './companyContext.interfaces.ts';

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);
