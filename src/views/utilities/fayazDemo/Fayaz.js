import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import DataTable from '../fayazDemo/CustomizedTables';
import HelperText from '../fayazDemo/HelperText';

export default function Fayaz() {
    const [currentTab, setCurrentTab] = React.useState('User');
    const [value, setValue] = React.useState('1');

    const breadcrumbs = (
        <>
            {/* Customize your breadcrumbs here */}
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <RouterLink color="inherit" to="/">
                    {' '}
                    {/* Use RouterLink instead of Link */}
                    <HomeIcon fontSize="small" />
                </RouterLink>
                <Typography variant="body2" color="text.primary">
                    Organization
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {currentTab} {/* Use the currentTab state variable */}
                </Typography>
            </Breadcrumbs>
        </>
    );

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === '1') setCurrentTab('User');
        else if (newValue === '2') setCurrentTab('Add User');
    };

    return (
        <MainCard title="Fayaz" breadcrumbs={breadcrumbs}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="User" value="1" />
                            <Tab label="Add User" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <DataTable />
                    </TabPanel>
                    <TabPanel value="2">
                        <HelperText />
                    </TabPanel>
                </TabContext>
            </Box>
        </MainCard>
    );
}
