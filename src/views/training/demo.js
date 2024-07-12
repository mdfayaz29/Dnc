import React from 'react';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import PersonIcon from '@material-ui/icons/Person';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Download from './download';
import Maps from './map';

export default function Demo() {
    const [currentTab, setCurrentTab] = React.useState('Data Download');
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
                    Training
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {currentTab}
                </Typography>
            </Breadcrumbs>
        </>
    );
    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === '1') setCurrentTab('Data Download');
        else if (newValue === '2') setCurrentTab('Map');
    };
    return (
        <MainCard title="Training" breadcrumbs={breadcrumbs}>
            <Box sx={{ width: '130%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Data Download" icon={<PersonIcon />} value="1" />
                            <Tab label="Map" icon={<AddCircleIcon />} value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Download />
                    </TabPanel>
                    <TabPanel value="2">
                        <Maps />
                    </TabPanel>
                </TabContext>
            </Box>
        </MainCard>
    );
}
