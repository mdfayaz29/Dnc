import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

export default function EditSpotzz({ mydata }) {
    const { sdata, hcb, handleSpotUpdate } = mydata; // Destructure props
    const [editedData, setEditedData] = useState(sdata);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        handleSpotUpdate(editedData);
        hcb(); // Close the dialog or reset state after save
    };

    return (
        <Dialog open={true} onClose={hcb}>
            <DialogTitle>Edit Spot</DialogTitle>
            <DialogContent>
                <TextField
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    margin="dense"
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    type="text"
                    fullWidth
                    value={editedData.firstName}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    type="text"
                    fullWidth
                    value={editedData.lastName}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="age"
                    name="age"
                    label="Age"
                    type="number"
                    fullWidth
                    value={editedData.age}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={hcb}>Cancel</Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
