import { Navigate, Route, Routes } from 'react-router-dom';
import { Auth } from './pages/auth/Auth.tsx';
import { CurrentHouse } from './pages/main/CurrentHouse.tsx';
import { NavigationLayout } from './shared/layouts/NavigationLayout.tsx';
import { useLayoutEffect } from 'react';
import { useUser } from './app/domain/hooks/useUser/useUser.ts';
import { useEnqueueSnackbar } from './app/domain/hooks/useSnackbar/useEnqueueSnackbar.ts';
import useSidebar from './app/domain/hooks/useSidebar/useSidebar.ts';
import { useInjection } from './app/domain/hooks/useInjection.ts';
import { IUserAPI } from './app/domain/services/users/userAPI.interfaces.ts';
import { UserAPIKey } from './app/domain/services/users/key.ts';
import dayjs from 'dayjs';
import { CreateHousePage } from './pages/house/createHouse/CreateHousePage.tsx';
import { HousesPage } from './pages/house/houses/HousesPage.tsx';
import { CreateCompanyPage } from './pages/company/createCompany/CreateCompanyPage.tsx';
import { CompaniesPage } from './pages/company/companies/Companies.tsx';
import { CurrentCompany } from './pages/company/currentCompany/CurrentCompany.tsx';
import { EditHousePage } from './pages/house/editHouse/EditHousePage.tsx';
import { CompanyProvider } from './pages/company/currentCompany/context/CompanyProvider.tsx';
import { UsersPage } from './pages/users/Users.tsx';
import { CreateUserPage } from './pages/users/createUser/CreateUserPage.tsx';
import { EditUserPage } from './pages/users/editUser/EditUserPage.tsx';
import { EditCompanyPage } from './pages/company/editCompany/EditCompanyPage.tsx';
import HouseGenerateDocumentPage from './pages/generationDocuments/GenerateDocumentPage.tsx';
import './app/scss/index.scss';
import 'dayjs/locale/ru';
import { AuditLogsPage } from './pages/auditLogs/AuditLogsPage.tsx';
import { RegionsPage } from './widgets/house/regions/RegionPage.tsx';
import { CitiesPage } from './widgets/house/cities/CitiesPage.tsx';
import { ReferenceBooksPage } from './pages/referenceBook/ReferenceBooksPage.tsx';
import { handleError } from './shared/common/handlerError.ts';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ru';

dayjs.locale('ru');
dayjs.extend(customParseFormat);

const App = () => {
    const { user, setupUser } = useUser();
    const { openSnackbar } = useEnqueueSnackbar();
    const userAPI = useInjection<IUserAPI>(UserAPIKey);

    const { isSidebarOpen, handleClose } = useSidebar();

    useLayoutEffect(() => {
        const fetchUser = async () => {
            if (!user) {
                try {
                    const user = await userAPI.getUserInformation();
                    setupUser(user);
                } catch (e) {
                    handleError(e, openSnackbar);
                }
            }
        };
        fetchUser();
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />

            <Route path="/auth" element={<Auth />} />

            {/* Все страницы с сайдбаром — внутрь Layout */}
            <Route
                element={
                    <NavigationLayout isSidebarOpen={isSidebarOpen} handleClose={handleClose} />
                }
            >
                {/*Генерация документов*/}
                <Route path="/generate" element={<HouseGenerateDocumentPage />} />

                {/*Жилые фонды*/}
                <Route path="/logs" element={<AuditLogsPage />} />

                {/*Справочники*/}
                <Route path="/reference-books" element={<ReferenceBooksPage />} />

                {/*Пользователи*/}
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/create-user" element={<CreateUserPage />} />
                <Route path="/users/edit-user/:id" element={<EditUserPage />} />

                {/*Управляющие компании*/}
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/companies/create-company" element={<CreateCompanyPage />} />
                <Route path="/companies/edit-company/:id" element={<EditCompanyPage />} />
                <Route
                    path="/companies/:companyId"
                    element={
                        <CompanyProvider>
                            <CurrentCompany />
                        </CompanyProvider>
                    }
                />

                {/*Жилые фонды*/}
                <Route path="/houses" element={<HousesPage />} />
                <Route path="/houses/regions" element={<RegionsPage />} />
                <Route path="/houses/cities" element={<CitiesPage />} />

                <Route path="/houses/create-house" element={<CreateHousePage />} />
                <Route path="/houses/edit-house/:id" element={<EditHousePage />} />
                <Route path="/houses/:houseId" element={<CurrentHouse />} />
            </Route>
        </Routes>
    );
};

export default App;
