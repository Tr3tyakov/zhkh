import {
    ReferenceBookIDMap,
    ReferenceBookIdToNameMap,
    ReferenceBookMap,
} from '../../../domain/services/referenceBooks/referenceBookAPI.interfaces.ts';

interface IReferenceBookContext {
    referenceBooks: ReferenceBookMap | null;
    referenceBookIds: ReferenceBookIDMap | null;
    referenceBookIdToName: ReferenceBookIdToNameMap | null;
    fetchReferenceBooks: () => Promise<void>;
}

export type { IReferenceBookContext };
