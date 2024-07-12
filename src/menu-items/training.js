// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ManageHistoryOutlinedIcon from '@mui/icons-material/ManageHistoryOutlined';
import InstallDesktopOutlinedIcon from '@mui/icons-material/InstallDesktopOutlined';
import AddHomeWorkSharpIcon from '@mui/icons-material/AddHomeWorkSharp';
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import AirlineStopsOutlinedIcon from '@mui/icons-material/AirlineStopsOutlined';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    AirlineStopsOutlinedIcon,
    ManageAccountsOutlinedIcon,
    ManageHistoryOutlinedIcon,
    InstallDesktopOutlinedIcon,
    PeopleAltSharpIcon,
    AddHomeWorkSharpIcon
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const training = {
    id: 'training',
    title: 'Training',
    type: 'group',
    children: [
        {
            id: 'training',
            title: 'Training',
            type: 'item',
            url: '/training/demo',
            icon: icons.AddHomeWorkSharpIcon,
            breadcrumbs: false
        }
    ]
};

export default training;
