import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar, GridToolbarColumnsButton } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ConfigEdit from './configEdit';
import CaptchaDialog from 'views/CaptchaDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ApiURL from './apiURL';
import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
const DNC_URL = 'your_delete_api_endpoint'; // Replace with your actual DELETE API endpoint
import { constobj } from '../../../misc/constants';
import Swal from 'sweetalert2';

export default function TableConfig() {
    const initialRows = []; // Initialize your rows
    const { DNC_URL } = { ...constobj };
    const [rows, setRows] = useState([]);
    console.log('ROWS: ' + rows);
    const [csvFileName, setCsvFileName] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
    const [openCaptchaDialog, setOpenCaptchaDialog] = useState(false);
    const [openConfigDialog, setOpenConfigDialog] = useState(false); // State for Config API dialog
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [showEditApiConfig, setshowEditApiConfig] = React.useState(false);

    const [id, setId] = useState();

    const columns = [
        { field: 'id', headerName: 'S/No', width: 70 },
        { field: 'Application_Name', headerName: 'Application Name', width: 130 },
        { field: 'API_URL_Prefix', headerName: 'API URL Prefix', width: 110 },
        { field: 'API_Key', headerName: 'API Key', width: 90 },
        { field: 'API_URL_Suffix', headerName: 'API URL Suffix', width: 120 },
        { field: 'Network_ID_Prefix', headerName: 'Network ID Prefix', width: 130 },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <div>
                    <Button variant="text" size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(params.row.id)} />
                    <Button variant="text" size="small" startIcon={<DeleteIcon />} onClick={() => handleDeleteUser(params.row.id)} />
                </div>
            )
        }
    ];

    const handleEditClick = (id) => {
        console.log(rows[id - 1]);
        setId(id);
        setshowEditApiConfig(true);
    };

    const handleDeleteUser = (id) => {
        console.log('ID: ' + id);
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

    const handleOpenConfigDialog = () => {
        setOpenConfigDialog(true);
    };

    const handleCloseConfigDialog = () => {
        setOpenConfigDialog(false);
    };
    useEffect(() => {
        getApicInfo();
    }, []);
    async function getApicInfo() {
        const myuser = await getApiData();
        console.log(myuser);
        setRows(myuser);
    }
    function getApiData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL('http://localhost:7791' + '/apiclist');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('VSP APIC List: ', data);
                    let apicdict = data.message;
                    console.log(apicdict);
                    let apicnt = Object.keys(apicdict);

                    let myapiclist = [];
                    for (let i = 0; i < apicnt.length; i++) {
                        let mydict = {};
                        mydict['id'] = i + 1;
                        mydict['Application_Name'] = apicnt[i];
                        mydict['API_URL_Prefix'] = apicdict[apicnt[i]]['urlprefix'];
                        mydict['API_Key'] = apicdict[apicnt[i]]['apikey'];
                        mydict['API_URL_Suffix'] = apicdict[apicnt[i]]['urlsuffix'];
                        mydict['Network_ID_Prefix'] = apicdict[apicnt[i]]['nwidprefix'];
                        console.log('dict: ' + mydict);
                        myapiclist.push(mydict);
                    }
                    console.log(myapiclist);
                    resolve(myapiclist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    const handleConfirmDelete = async () => {
        console.log('Delete the selected API Config: ', rows[id - 1]);
        handleCloseDeleteDialog();

        try {
            let delresp = await deleteApicData({ apiname: rows[id - 1].Application_Name });
            Swal.fire(delresp.message);
            getApicInfo();
        } catch (error) {
            Swal.fire(error.message);
        }
    };

    const handleCloseDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
    };

    function deleteApicData(apidata) {
        return new Promise(async function (resolve, reject) {
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            var raw = JSON.stringify(apidata);

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: raw
            };

            var url = new URL('http://localhost:7791' + '/apicdelete');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    }
    async function getApicInfo() {
        const myuser = await getApiData();
        setRows(myuser);
    }
    const makeUserEditable = () => {
        setshowEditApiConfig(false);
        getApicInfo();
    };
    return (
        <div>
            <Button variant="outlined" style={{ float: 'right' }} onClick={handleOpenConfigDialog}>
                Config API
            </Button>
            <br />
            <br />
            {showEditApiConfig ? <ConfigEdit mydata={{ sdata: rows[id - 1], location: location, hcb: makeUserEditable }} /> : null}
            <div style={{ height: 480, width: '100%' }}>
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
                    <ConfigEdit
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
                <CaptchaDialog open={openCaptchaDialog} onClose={() => setOpenCaptchaDialog(false)} onDelete={handleConfirmDelete} />
            </div>

            {/* Config API Dialog */}
            <Dialog open={openConfigDialog} onClose={handleCloseConfigDialog}>
                <DialogTitle>Config API</DialogTitle>
                <DialogContent>
                    <ApiURL />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfigDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
