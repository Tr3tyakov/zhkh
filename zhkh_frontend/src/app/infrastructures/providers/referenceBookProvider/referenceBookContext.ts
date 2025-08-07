import { createContext } from 'react';
import { IReferenceBookContext } from './referenceBookProvider.interfaces.ts';

export const ReferenceBookContext = createContext<IReferenceBookContext | null>(null);
