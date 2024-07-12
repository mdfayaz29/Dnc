import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function HelperText() {
    const [fname, setFname] = useState('First Name');
    const [surName, setSurName] = useState('Surname');
    const [mail, setEmail] = useState('Email');

    const handleChangeFname = (event) => {
        setFname(event.target.value);
    };

    const handleChangeSurName = (event) => {
        setSurName(event.target.value);
    };

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const clear = () => {
        setFname('');
        setSurName('');
        setEmail('');
    };

    return (
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <TextField id="Fname" label="First Name" value={fname} onChange={handleChangeFname} variant="outlined" />
            <TextField id="Sname" label="Surname" value={surName} onChange={handleChangeSurName} variant="outlined" />
            <TextField id="mail" label="Email" value={mail} onChange={handleChangeEmail} variant="outlined" />
            <br />
            <Button variant="contained" onClick={clear}>
                Submit
            </Button>
        </Box>
    );
}
