import React, { useState } from 'react';
import { DataGrid, GridToolbar, GridToolbarColumnsButton } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EditSpotzz from './mangeEdit';
import CaptchaDialog from 'views/CaptchaDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
const DNC_URL = 'your_delete_api_endpoint'; // Replace with your actual DELETE API endpoint

export default function UserData() {
    const initialRows = [
        { id: 1, lastName: 'Shankar', firstName: 'Athi', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Akash', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 54 },
        { id: 6, lastName: 'Melisandre', firstName: 'kumar', age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
    ];

    const [rows, setRows] = useState(initialRows);
    console.log('Fayaz: ' + rows);
    const [csvFileName, setCsvFileName] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
    const [openCaptchaDialog, setOpenCaptchaDialog] = useState(false);

    const [id, setId] = useState();

    function deleteUser(id) {
        return new Promise(async function (resolve, reject) {
            try {
                let auth = sessionStorage.getItem('myToken');
                let myuser = sessionStorage.getItem('myUser');
                let myuobj = JSON.parse(myuser);

                var myHeaders = new Headers();
                myHeaders.append('Authorization', 'Bearer ' + auth);
                myHeaders.append('Content-Type', 'application/json');

                let mydict = {};
                mydict['user'] = myuobj.user;
                mydict['level'] = myuobj.level;

                var requestOptions = {
                    method: 'DELETE',
                    headers: myHeaders,
                    body: JSON.stringify(mydict)
                };

                var url = new URL(DNC_URL + '/user/' + id);

                const response = await fetch(url, requestOptions);
                const data = await response.json();

                if (response.ok) {
                    resolve(data);
                } else {
                    reject(data);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'age', headerName: 'Age', type: 'number', width: 90 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <div>
                    <Button variant="text" size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(params.row)} />
                    <Button variant="text" size="small" startIcon={<DeleteIcon />} onClick={() => handleDeleteUser(params.row.id)} />
                </div>
            )
        }
    ];
    const handleEditClick = (selectedRow) => {
        setSelectedRow(selectedRow);
    };
    const handleDeleteUser = (id) => {
        setId(id);
        setOpenCaptchaDialog(true);
    };

    const handleCaptchaDialogConfirm = () => {
        setOpenCaptchaDialog(false);
        handleCaptchaDialogConfirm1(id);
    };

    const handleCaptchaDialogConfirm1 = (id) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
    };

    const handleCsvFileNameChange = (event) => {
        setCsvFileName(event.target.value);
    };

    const handleOpenDownloadDialog = () => {
        setOpenDownloadDialog(true);
    };

    const handleCloseDownloadDialog = () => {
        setOpenDownloadDialog(false);
    };

    const handleDownloadCsv = () => {
        handleCloseDownloadDialog();
        handleExportCsv(csvFileName);
    };

    const handleExportCsv = (fileName) => {
        const csvData = rows.map((row) => Object.values(row).join(',')).join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <Button style={{ fontSize: '13px' }} variant="text" startIcon={<DownloadIcon />} onClick={handleOpenDownloadDialog}>
                    Export CSV
                </Button>
            </GridToolbarContainer>
        );
    }

    return (
        <div style={{ height: 480, width: '75%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[12]}
                checkboxSelection
                components={{
                    Toolbar: CustomToolbar
                }}
            />
            {selectedRow && (
                <EditSpotzz
                    mydata={{
                        sdata: selectedRow,
                        hcb: () => setSelectedRow(null),
                        handleSpotUpdate: (updatedData) => {
                            const updatedRows = rows.map((row) => (row.id === updatedData.id ? updatedData : row));
                            setRows(updatedRows);
                        }
                    }}
                />
            )}
            <Dialog open={openDownloadDialog} onClose={handleCloseDownloadDialog}>
                <DialogTitle>Enter CSV File Name</DialogTitle>
                <DialogContent>
                    <TextField id="csv-file-name" label="Enter Name" fullWidth value={csvFileName} onChange={handleCsvFileNameChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDownloadDialog}>Cancel</Button>
                    <Button onClick={handleDownloadCsv} color="primary">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
            <CaptchaDialog open={openCaptchaDialog} onClose={() => setOpenCaptchaDialog(false)} onDelete={handleCaptchaDialogConfirm} />
        </div>
    );
}
