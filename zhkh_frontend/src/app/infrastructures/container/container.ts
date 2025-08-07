import { container } from 'tsyringe';
import { IUserAPI } from '../../domain/services/users/userAPI.interfaces.ts';
import { UserAPI } from '../../domain/services/users/userAPI.ts';
import { UserAPIKey } from '../../domain/services/users/key.ts';
import { ICookieService } from '../../domain/cookie/cookieService.interfaces.ts';
import { CookieServiceKey } from '../../domain/cookie/key.ts';
import { CookieService } from '../../domain/cookie/cookieService.ts';
import { IHouseAPI } from '../../domain/services/houses/houseAPI.interfaces.ts';
import { HouseAPI } from '../../domain/services/houses/houseAPI.ts';
import { HouseAPIKey } from '../../domain/services/houses/key.ts';
import { ICompanyAPI } from '../../domain/services/companies/companyAPI.interfaces.ts';
import { CompanyAPIKey } from '../../domain/services/companies/key.ts';
import { CompanyAPI } from '../../domain/services/companies/companyAPI.ts';
import { DocumentGenerationAPI } from '../../domain/services/documentGeneration/DocumentGenerationAPI.ts';
import { DocumentGenerationAPIKey } from '../../domain/services/documentGeneration/key.ts';
import { IDocumentGenerationAPI } from '../../domain/services/documentGeneration/documentGenerationAPI.interfaces.ts';
import { AuditLogAPI } from '../../domain/services/auditLogs/auditLogAPI.ts';
import { AuditLogAPIKey } from '../../domain/services/auditLogs/key.ts';
import { ReferenceBookAPI } from '../../domain/services/referenceBooks/referenceBookAPI.ts';
import { IReferenceBookAPI } from '../../domain/services/referenceBooks/referenceBookAPI.interfaces.ts';
import { ReferenceBookAPIKey } from '../../domain/services/referenceBooks/key.ts';

export function setupContainer() {
    container.registerSingleton<IUserAPI>(UserAPIKey, UserAPI);
    container.registerSingleton<IHouseAPI>(HouseAPIKey, HouseAPI);
    container.registerSingleton<ICompanyAPI>(CompanyAPIKey, CompanyAPI);
    container.registerSingleton<ICookieService>(CookieServiceKey, CookieService);
    container.registerSingleton<IDocumentGenerationAPI>(
        DocumentGenerationAPIKey,
        DocumentGenerationAPI
    );
    container.registerSingleton<AuditLogAPI>(AuditLogAPIKey, AuditLogAPI);
    container.registerSingleton<IReferenceBookAPI>(ReferenceBookAPIKey, ReferenceBookAPI);
}
