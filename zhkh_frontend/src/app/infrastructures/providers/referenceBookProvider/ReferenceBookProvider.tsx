import React, {useEffect, useState} from 'react';
import {useEnqueueSnackbar} from '../../../domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import {useInjection} from '../../../domain/hooks/useInjection.ts';
import {
    IReferenceBookAPI,
    IReferenceBookList,
    ReferenceBookIDMap,
    ReferenceBookIdToNameMap,
    ReferenceBookMap,
} from '../../../domain/services/referenceBooks/referenceBookAPI.interfaces.ts';
import {ReferenceBookAPIKey} from '../../../domain/services/referenceBooks/key.ts';
import {ReferenceBookContext} from './referenceBookContext.ts';
import {handleError} from '../../../../shared/common/handlerError.ts';

function buildReferenceBookMaps(books: IReferenceBookList[]) {
    const refMap: ReferenceBookMap = {};
    const nameToId: ReferenceBookIDMap = {};
    const idToName: ReferenceBookIdToNameMap = {};

    for (const book of books) {
        refMap[book.name] = book.reference_book_values;
        nameToId[book.name] = book.id;
        idToName[book.id] = book.name;
    }

    return { refMap, nameToId, idToName };
}

export const ReferenceBookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [referenceBooks, setReferenceBooks] = useState<ReferenceBookMap | null>(null);
    const [referenceBookIds, setReferenceBookIds] = useState<ReferenceBookIDMap | null>(null);
    const [referenceBookIdToName, setReferenceBookIdToName] =
        useState<ReferenceBookIdToNameMap | null>(null);
    const { openSnackbar } = useEnqueueSnackbar();
    const referenceBookAPI = useInjection<IReferenceBookAPI>(ReferenceBookAPIKey);

    const fetchReferenceBooks = async () => {
        try {
            const data = await referenceBookAPI.getReferenceBooks();
            const { refMap, nameToId, idToName } = buildReferenceBookMaps(data.books);

            setReferenceBooks(refMap);
            setReferenceBookIds(nameToId);
            setReferenceBookIdToName(idToName);
        } catch (e) {
            handleError(e, openSnackbar);
        }
    };

    useEffect(() => {
        fetchReferenceBooks();
    }, []);

    return (
        <ReferenceBookContext.Provider
            value={{ referenceBooks, referenceBookIds, referenceBookIdToName, fetchReferenceBooks }}
        >
            {children}
        </ReferenceBookContext.Provider>
    );
};

