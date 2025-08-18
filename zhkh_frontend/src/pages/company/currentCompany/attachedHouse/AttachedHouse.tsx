import React, { useEffect, useState } from 'react';
import { IHouseAPI } from '../../../../app/domain/services/houses/houseAPI.interfaces';
import { useInjection } from '../../../../app/domain/hooks/useInjection';
import { HouseAPIKey } from '../../../../app/domain/services/houses/key';
import { useEnqueueSnackbar } from '../../../../app/domain/hooks/useSnackbar/useEnqueueSnackbar';
import { formatHouseAddress } from '../../../../widgets/house/houseInformation/houseInformation.functions';
import { Autocomplete, Button, TextField } from '@mui/material';
import { getErrorLog, getErrorMessage } from '../../../../shared/api/base.ts';
import useDebounce from '../../../../app/domain/hooks/useDebounce/useDebounce.ts';
import { IAttachedHouse } from './attachedHouse.interfaces.ts';
import { LoadingProgress } from '../../../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { useCompany } from '../../../../app/domain/hooks/useCompany/useCompany.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../../../app/infrastructures/enums/auditLog.ts';
import { IAuditLogAPI } from '../../../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../../../app/domain/services/auditLogs/key.ts';
import { useUser } from '../../../../app/domain/hooks/useUser/useUser.ts';

export const AttachedHouse: React.FC<IAttachedHouse> = ({ companyId }) => {
    const { fetchAttachedHouses, usePageData } = useCompany();
    const [inputValue, setInputValue] = useState('');
    const [houses, setHouses] = useState<{ id: number; address: string }[]>([]);
    const [selectedHouse, setSelectedHouse] = useState<{ id: number; address: string } | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAttach, setIsLoadingAttach] = useState(false);

    const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);
    const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);

    const { openSnackbar } = useEnqueueSnackbar();
    const { user } = useUser();

    const debounceValue = useDebounce(inputValue, 300);

    const fetchHouses = async (search: string) => {
        try {
            setIsLoading(true);
            const data = await houseAPI.getUnattachedHouses(20, 0, search);
            setHouses(
                data.houses.map((element) => ({
                    id: element.id,
                    address: formatHouseAddress(element) ?? '',
                }))
            );
        } catch (e) {
            openSnackbar({ message: getErrorMessage(e), variant: 'default' });
        } finally {
            setIsLoading(false);
        }
    };
    const attach = async () => {
        if (!selectedHouse) return;
        const description = `Привязка жилого фонда с идентификатором ${selectedHouse.id} к компании с идентификатором ${companyId} пользователем ${user?.id}`;
        try {
            setIsLoadingAttach(true);
            await houseAPI.attachToCompany(selectedHouse.id, companyId);
            setSelectedHouse(null);
            await Promise.all([
                fetchAttachedHouses(usePageData.filters.searchValue, 1),
                auditLogAPI.createAuditLog({
                    userId: user?.id,
                    logType: AuditLogEnum.ATTACH,
                    entityType: EntityTypeEnum.COMPANY,
                    description: description,
                    actionResult: 'Успешно',
                    objectId: selectedHouse.id,
                }),
            ]);
            openSnackbar({
                message: 'Жилой фонд успешно привязан',
                variant: 'default',
            });
        } catch (e) {
            const message = getErrorMessage(e);
            openSnackbar({
                message: message,
                variant: 'default',
            });
            await auditLogAPI.createAuditLog({
                userId: user?.id,
                logType: AuditLogEnum.ATTACH,
                entityType: EntityTypeEnum.COMPANY,
                description: description,
                actionResult: message,
                logMetadata: JSON.stringify(getErrorLog(e)),
                objectId: selectedHouse.id,
            });
        } finally {
            setIsLoadingAttach(false);
        }
    };

    useEffect(() => {
        if (debounceValue) {
            fetchHouses(debounceValue);
        } else {
            setHouses([]);
        }
    }, [debounceValue]);

    return (
        <>
            <Autocomplete
                size="small"
                options={houses}
                loading={isLoading}
                loadingText="Загрузка..."
                getOptionLabel={(option) => option.address}
                value={selectedHouse}
                onChange={(_, newValue) => setSelectedHouse(newValue)}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                noOptionsText={inputValue === '' ? '' : 'Нет совпадений'}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Введите адрес дома для привязки"
                        sx={{
                            '& .MuiInputBase-input': {
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: 0,
                            },
                        }}
                    />
                )}
                sx={{ width: 400 }}
            />
            <Button
                sx={{ width: '120px' }}
                onClick={attach}
                variant="contained"
                color="primary"
                disabled={isLoadingAttach || !selectedHouse}
            >
                <LoadingProgress value="Привязать" isLoading={false} />
            </Button>
        </>
    );
};
