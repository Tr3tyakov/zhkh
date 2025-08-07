import { CompanyForm } from '../../../widgets/company/form/CompanyForm.tsx';
import { UpdateCompanyHOC } from '../../../widgets/company/hocs/UpdateCompanyHOC.tsx';

export const EditCompanyPage = UpdateCompanyHOC(CompanyForm);
