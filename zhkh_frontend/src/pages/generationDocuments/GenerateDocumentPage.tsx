import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import { useEnqueueSnackbar } from '../../app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import { getErrorLog, getErrorMessage } from '../../shared/api/base.ts';
import { useInjection } from '../../app/domain/hooks/useInjection.ts';
import { IHouseAPI, IHouseField } from '../../app/domain/services/houses/houseAPI.interfaces.ts';
import { HouseAPIKey } from '../../app/domain/services/houses/key.ts';
import { LoadingProgress } from '../../shared/loading/loadingProgress/LoadingProgress.tsx';
import { DocumentGenerationAPIKey } from '../../app/domain/services/documentGeneration/key.ts';
import { IDocumentGenerationAPI } from '../../app/domain/services/documentGeneration/documentGenerationAPI.interfaces.ts';
import { ReportTypeEnum } from '../../app/infrastructures/enums/report.ts';
import { AuditLogEnum, EntityTypeEnum } from '../../app/infrastructures/enums/auditLog.ts';
import { IAuditLogAPI } from '../../app/domain/services/auditLogs/auditLogAPI.interfaces.ts';
import { AuditLogAPIKey } from '../../app/domain/services/auditLogs/key.ts';
import { useUser } from '../../app/domain/hooks/useUser/useUser.ts';

const HouseGenerateDocumentPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [fields, setFields] = useState<IHouseField[]>([]);
    const [selectedFields, setSelectedFields] = useState<IHouseField[]>([]);
    const [reportTypeDialogOpen, setReportTypeDialogOpen] = useState(false);
    const [selectedReportType, setSelectedReportType] = useState<ReportTypeEnum>(
        ReportTypeEnum.TABLE
    );
    const { user } = useUser();
    const { openSnackbar } = useEnqueueSnackbar();
    const houseAPI = useInjection<IHouseAPI>(HouseAPIKey);
    const auditLogAPI = useInjection<IAuditLogAPI>(AuditLogAPIKey);

    const documentGenerationAPI = useInjection<IDocumentGenerationAPI>(DocumentGenerationAPIKey);

    useEffect(() => {
        fetchHouseFields();
    }, []);

    useEffect(() => {
        setSelectAll(selectedFields.length === fields.length && fields.length > 0);
    }, [selectedFields, fields]);

    const fetchHouseFields = async () => {
        setIsLoading(true);
        try {
            const data = await houseAPI.getHouseFields();
            setFields(data);
        } catch (e) {
            openSnackbar({ message: getErrorMessage(e), variant: 'default' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleAll = () => {
        const newState = !selectAll;
        setSelectedFields(newState ? fields : []);
        setSelectAll(newState);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, item: IHouseField) => {
        const checked = e.target.checked;
        const newFields = checked
            ? [...selectedFields, item]
            : selectedFields.filter((f) => f.field !== item.field);
        setSelectedFields(newFields);
    };

    const handleOpenReportTypeDialog = () => setReportTypeDialogOpen(true);
    const handleCloseReportTypeDialog = () => setReportTypeDialogOpen(false);

    const handleReportTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedReportType(e.target.value as ReportTypeEnum);
    };

    const handleExportPDF = async () => {
        setIsLoading(true);
        try {
            if (selectedFields.length === 0) {
                openSnackbar({ message: 'Выберите хотя бы одно поле', variant: 'default' });
                setIsLoading(false);
                return;
            }

            const url = await documentGenerationAPI.generatePDF(
                { fields: selectedFields },
                selectedReportType
            );

            const link = document.createElement('a');
            link.href = url;
            link.download = 'houses.pdf';
            link.click();
            setReportTypeDialogOpen(false);

            // Создание лога
            await auditLogAPI.createAuditLog({
                userId: user?.id,
                logType: AuditLogEnum.EXPORT_DATA,
                entityType: EntityTypeEnum.DATA,
                description: `Экспорт PDF файла, типа: ${selectedReportType}`,
                actionResult: 'Успешно',
            });
        } catch (e) {
            const message = getErrorMessage(e);
            openSnackbar({ message: message, variant: 'default' });

            // Создание лога
            await auditLogAPI.createAuditLog({
                userId: user?.id,
                logType: AuditLogEnum.EXPORT_DATA,
                entityType: EntityTypeEnum.DATA,
                description: `Экспорт PDF файла, типа: ${selectedReportType}`,
                actionResult: message,
                logMetadata: JSON.stringify(getErrorLog(e)),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportExcel = async () => {
        setIsLoading(true);
        try {
            if (selectedFields.length === 0) {
                openSnackbar({ message: 'Выберите хотя бы одно поле', variant: 'default' });
                setIsLoading(false);
                return;
            }
            const url = await documentGenerationAPI.generateExcel({ fields: selectedFields });
            const link = document.createElement('a');
            link.href = url;
            link.download = 'houses.xlsx';
            link.click();

            // Создание лога
            await auditLogAPI.createAuditLog({
                userId: user?.id,
                logType: AuditLogEnum.EXPORT_DATA,
                entityType: EntityTypeEnum.DATA,
                description: 'Авторизация в системе',
                actionResult: 'Успешно',
            });
        } catch (e) {
            const message = getErrorMessage(e);
            openSnackbar({ message: message, variant: 'default' });

            // Создание лога
            await auditLogAPI.createAuditLog({
                userId: user?.id,
                logType: AuditLogEnum.EXPORT_DATA,
                entityType: EntityTypeEnum.DATA,
                description: 'Экспорт Excel файла',
                actionResult: message,
                logMetadata: JSON.stringify(getErrorLog(e)),
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h5" fontWeight={600} mb="10px" mt="20px">
                Экспорт данных
            </Typography>
            <Typography mb="10px">Выберите поля для экспорта</Typography>

            <FormGroup
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '8px',
                    height: '67vh',
                    overflow: 'auto',
                }}
            >
                {fields.map((item) => (
                    <Box key={item.field} sx={{ width: 'calc(50% - 8px)' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={selectedFields.some((f) => f.field === item.field)}
                                    onChange={(e) => handleChange(e, item)}
                                    name="fields"
                                />
                            }
                            label={item.description}
                        />
                    </Box>
                ))}
            </FormGroup>

            <Dialog open={reportTypeDialogOpen} onClose={handleCloseReportTypeDialog}>
                <DialogTitle>Выберите тип PDF отчёта</DialogTitle>
                <DialogContent>
                    <RadioGroup value={selectedReportType} onChange={handleReportTypeChange}>
                        <FormControlLabel
                            value={ReportTypeEnum.TABLE}
                            control={<Radio />}
                            label="Табличный вид"
                        />
                        <FormControlLabel
                            value={ReportTypeEnum.DETAIL}
                            control={<Radio />}
                            label="Детализированный отчёт"
                        />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReportTypeDialog}>Отмена</Button>
                    <Button onClick={handleExportPDF} variant="contained" disabled={isLoading}>
                        <LoadingProgress isLoading={isLoading} value="Экспортировать" />
                    </Button>
                </DialogActions>
            </Dialog>

            <Box display="flex" justifyContent="space-between" mt={4}>
                <Button variant="outlined" onClick={handleToggleAll}>
                    {selectAll ? 'Сбросить всё' : 'Выбрать всё'}
                </Button>

                <Box display="flex" gap={2}>
                    <Button
                        variant="contained"
                        onClick={handleOpenReportTypeDialog}
                        disabled={isLoading}
                    >
                        <LoadingProgress isLoading={isLoading} value="Сгенерировать PDF" />
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleExportExcel}
                        disabled={isLoading}
                    >
                        <LoadingProgress isLoading={isLoading} value="Сгенерировать Excel" />
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default HouseGenerateDocumentPage;
