import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function HelperText() {
    function clear() {
        var textField = document.getElementById('demo-helper-text-misaligned-no-helper');
        textField.value = '';
    }
    return (
        <Box
            sx={{
                display: 'absolute',
                alignItems: 'center',
                '& > :not(style)': { m: 1 }
            }}
        >
            <TextField id="demo-helper-text-misaligned-no-helper" type="mail" label="Emter your Email" />
            <br />
            <Button onClick={clear} variant="contained">
                Send Mail
            </Button>
        </Box>
    );
}
