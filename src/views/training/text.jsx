import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Text = ({ onSubmit }) => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(latitude, longitude);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' }
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                id="outlined-basic-lat"
                label="Latitude"
                variant="outlined"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
            />
            <TextField
                id="outlined-basic-lng"
                label="Longitude"
                variant="outlined"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
            />
            <Button variant="contained" type="submit">
                Submit
            </Button>
        </Box>
    );
};

export default Text;
