import React from 'react';
import { InformationTable } from '../../shared/tables/InformationTable.tsx';
import { buildCompanyInformationTable } from './companyInformation.functions.ts';
import { ICompanyInformation } from './companyInformation.interfaces.ts';

export const CompanyInformation: React.FC<ICompanyInformation> = ({ data }) => {
    return <InformationTable data={buildCompanyInformationTable(data)} />;
};
