import { INavigationItem } from './topSidebar.interfaces.ts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DescriptionIcon from '@mui/icons-material/Description';

export const DefaultUserNavigation: INavigationItem[] = [
    {
        text: 'Жилой фонд',
        icon: <DashboardIcon sx={{ color: 'black' }} />,
        path: '/',
        disabled: false,
    },
    {
        text: 'Управляющие компании',
        icon: <WorkRoundedIcon sx={{ color: 'black' }} />,
        path: '/companies',
        disabled: false,
    },
    {
        text: 'Экспорт данных',
        icon: <ImportExportIcon sx={{ color: 'black' }} />,
        path: '/generate',
        disabled: false,
    },
];

export const AdminNavigation: INavigationItem[] = [
    ...DefaultUserNavigation,
    {
        text: 'Пользователи',
        icon: <AdminPanelSettingsIcon />,
        path: '/users',
        disabled: false,
    },
    {
        text: 'Журнал действий',
        icon: <DescriptionIcon sx={{ color: 'black' }} />,
        path: '/logs',
        disabled: false,
    },
    {
        text: 'Справочники',
        icon: <DescriptionIcon sx={{ color: 'black' }} />,
        path: '/reference-books',
        disabled: false,
    },
];
