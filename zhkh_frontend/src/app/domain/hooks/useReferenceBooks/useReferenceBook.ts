import { ReferenceBookContext } from '../../../infrastructures/providers/referenceBookProvider/referenceBookContext.ts';
import { useContext } from 'react';

export const useReferenceBook = () => {
    const context = useContext(ReferenceBookContext);
    if (!context) {
        throw new Error('useReferenceBook must be used within a ReferenceBookProvider');
    }
    return context;
};
