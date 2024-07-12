import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import Typography from '@mui/material/Typography';
import { divIcon } from 'leaflet';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#512da8',
    '&:hover': {
        backgroundColor: purple[700]
    }
}));

export default function Download() {
    const BASE_URL = 'https://www.cornellsaprun.com/dncserver/';
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [location, setLocation] = useState('Arnot');
    const [frmDate, setFrmDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const handleDownload = () => {
        // console.log('Download button clicked!');
        setIsDialogOpen(true);
        setTimeout(() => {
            // console.log('Download completed!');
            setIsDialogOpen(false);
            console.log('hii');
        }, 1000);
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        var query = JSON.stringify({ loc: location, fmdate: frmDate, todate: toDate });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: query
        };
        fetch(BASE_URL + 'getld', requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let resobj = JSON.parse(result);
                let fname = resobj['message'];
                var anchor = document.createElement('a');
                anchor.href = BASE_URL + 'download/' + fname;
                anchor.download = fname;
                anchor.click();
                setLoading(false);
            })
            .catch((error) => console.log('error', error));
    };

    const onHandleDnload = () => {
        setLoading(true);
        onDownload();
    };
    const onHandleBack = () => {
        props.navigation.navigate('LoginScreen');
    };
    const onLocationChange = (e) => {
        setLocation(e.target.value);
    };
    const [currentTab, setCurrentTab] = React.useState('Data Download');
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
                    Pluginsss
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {currentTab} {/* Use the currentTab state variable */}
                </Typography>
            </Breadcrumbs>
        </>
    );
    return (
        <div>
            <Box
                sx={{
                    width: '70%', // Use 100% width for full responsiveness
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'white',
                    borderRadius: '10px'
                }}
            >
                <FormControl size="small" style={{ width: '100%', maxWidth: '240px' }}>
                    <InputLabel id="demo-simple-select-label">Select Location</InputLabel>
                    <Select labelId="Select Location" id="demo-simple-select" label="Select Location" onChange={(e) => onLocationChange(e)}>
                        <MenuItem value="Arnot">TamilNadu</MenuItem>
                        <MenuItem value="Uihlein">Coimbatore</MenuItem>
                        <MenuItem value="UVM">Tiruneleveli</MenuItem>
                    </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="From Date"
                        size="small"
                        value={frmDate}
                        onChange={(value) => setFrmDate(value)}
                        renderInput={(params) => <TextField style={{ marginTop: '2%' }} {...params} size="small" required />}
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="To Date"
                        size="small"
                        value={toDate}
                        onChange={(value) => setToDate(value)}
                        renderInput={(params) => <TextField style={{ marginTop: '2%' }} {...params} size="small" required />}
                    />
                </LocalizationProvider>

                <Box sx={{ textAlign: 'center' }}>
                    <ColorButton style={{ marginTop: '15%' }} variant="contained" onClick={handleDownload}>
                        Download
                    </ColorButton>
                </Box>
            </Box>

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 3
                        }}
                    >
                        {' '}
                        <CircularProgress size={64} color="secondary" />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <h3>Downloading...</h3>
                        <p>Please wait while the data is being downloaded.</p>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}
