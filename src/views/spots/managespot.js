/*

Module: managespot.js

Function:
    Implementation code for Spots.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation   October 2023

*/

import React, { useState, useEffect } from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import EditSpot from './editspot';
import DeleteSpot from './deletespot';
import AssignDevice from './assigndevice';
import { constobj } from './../../misc/constants';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ScreenRotationAltSharpIcon from '@mui/icons-material/ScreenRotationAltSharp';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Icon } from 'leaflet';

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    shadowSize: [41, 41]
});

// Ensure the icon displays correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function ManageSpot(props) {
    const { DNC_URL } = { ...constobj };
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [cols, setCols] = React.useState([]);
    const [mypopup, setMyPopUp] = React.useState(false);
    const [delpopup, setDelPopUp] = React.useState(false);
    const [myassign, setMyAssign] = React.useState(false);
    const [selid, setSelId] = React.useState();
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);
    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });
    const [map, setMap] = useState(null);
    function cleanCoordinate(coord) {
        if (typeof coord === 'string') {
            let cleanString = coord.replace(/[^0-9.-]/g, ''); // Remove non-numeric and non-decimal point characters
            return parseFloat(cleanString); // Convert to float
        }
        return coord; // Return the coordinate if it's already a number
    }
    // Helper function to create map markers
    const mapMarkers = rows.map((spot) => {
        const latitude = cleanCoordinate(spot.latitude);
        const longitude = cleanCoordinate(spot.longitude);

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const isActive = spot.status.toLowerCase() === 'active';
            console.log(`Spot: ${spot.sname}, Status: ${spot.status}, Active: ${isActive}`);

            const icon = isActive ? blueIcon : redIcon;
            return (
                <Marker position={[latitude, longitude]} key={spot.id} icon={icon}>
                    <Popup>
                        {spot.sname}
                        <br />
                        {`Lat: ${latitude}, Lng: ${longitude}`}
                        <br />
                        Status: {spot.status}
                    </Popup>
                </Marker>
            );
        }
        return null;
    });

    useEffect(() => {
        // console.log('Use Effect ====> ===>');
        props.lsdata.cbftitle('Spots > ManageSpot');
        let myorg = sessionStorage.getItem('myOrg');
        getSpotInfo(myorg);
        const interval = setInterval(() => {
            let norg = sessionStorage.getItem('myOrg');
            if (norg != myorg) {
                myorg = norg;
                getSpotInfo(myorg);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function isothertags(value) {
        if (value == 'latitude' || value == 'longitude' || value == 'sid' || value == 'user') {
            return false;
        }
        return true;
    }

    /*

    Name:	constructtable ()

    Function:
        constructtable function construct the column configuration for table
        based on the provided keys (mykeyso).

    Definition:
        It filters the keys to exclude specific tags and then iterates through
        the keys to create column configurations

    Description:
        The function sets field names, header names, and widths based specific 
        keys or dynamically calculate the width based on string length. It also
        adds an "Actions" column configuration with predefined actions. The 
        resulting column configuration are stored in the state variable (cols).
        
        mykeyso: An array of keys used to construct the table columns.

    Return:
        function doesn't have a return value but sets the state variable (cols)
        with the constructed column configurations.

    */
    function constructtable(mykeyso) {
        let mykeys = mykeyso.filter(isothertags);
        let mycol = [];
        for (let i = 0; i < mykeys.length; i++) {
            let mydict = {};
            mydict['field'] = mykeys[i];
            if (mykeys[i] == 'id') {
                mydict['headerName'] = 'S/N';
                mydict['width'] = 50; // Adjust the width as needed for the first column
            } else if (mykeys[i] == 'sname') {
                mydict['headerName'] = 'Name';
                mydict['width'] = 120; // Adjust the width as needed for the second and second columns
            } else if (mykeys[i] == 'status') {
                mydict['headerName'] = 'Status';
                mydict['width'] = 90; // Adjust the width as needed for the second and third columns
            } else if (mykeys[i] == 'country') {
                mydict['headerName'] = 'Country';
                mydict['width'] = 110; // Adjust the width as needed for the second and fourth columns
            } else if (mykeys[i] == 'state') {
                mydict['headerName'] = 'State';
                mydict['width'] = 110; // Adjust the width as needed for the second and fiveth columns
            } else if (mykeys[i] == 'district') {
                mydict['headerName'] = 'District';
                mydict['width'] = 110; // Adjust the width as needed for the second and sixth columns
            } else if (mykeys[i] == 'city') {
                mydict['headerName'] = 'City';
                mydict['width'] = 120; // Adjust the width as needed for the second and seventh columns
            } else if (mykeys[i] == 'street') {
                mydict['headerName'] = 'Street';
                mydict['width'] = 110; // Adjust the width as needed for the second and eighth columns
            } else if (i < 3) {
                mydict['headerName'] = mykeys[i];
                mydict['width'] = 100; // Adjust the width as needed for the second and nine columns
            } else {
                mydict['headerName'] = mykeys[i];
                // Dynamically calculate column width based on string length
                mydict['width'] = mykeys[i].length * 20; // Adjust the multiplier as needed
            }
            // Align text to the left side
            mydict['textAlign'] = 'left';

            mycol.push(mydict);
        }
        mycol.push({
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        onClick={handleEditClick(id)}
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                    />,
                    <GridActionsCellItem onClick={handleDeleteClick(id)} icon={<DeleteIcon />} label="Delete" color="inherit" />,
                    <GridActionsCellItem
                        icon={<ScreenRotationAltSharpIcon />}
                        onClick={handleAssignClick(id)}
                        helperText="Some important text"
                        label="Custom Action"
                        color="inherit"
                        title="Assigned Devices"
                    />
                ];
            }
        });

        setCols(mycol);
    }

    async function getSpotInfo(myorg) {
        const myspot = await getSpotData(myorg);
        let myrow = myspot[0];
        let mkeys = Object.keys(myrow);
        constructtable(mkeys);
        setRows(myspot);
    }

    /*
    | getSpotData spot data for a given organization by making a fetch request
    | to the server. It constructs the URL based on the organization includes 
    | the necessary authentication headers. The function then process received
    | data, converting each item into row object and storing them in an array.
    | The resulting array of spot data is resolved in the promise.
    | myorg: The organization for which spot data is to be retrieved.
    */
    function getSpotData(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/spot/' + myorg);
            let myslist = [];
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Real Data: ', data);
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        let keys = Object.keys(item);
                        for (let i = 0; i < keys.length; i++) {
                            myrow[keys[i]] = item[keys[i]];
                        }
                        myslist.push(myrow);
                    });
                    resolve(myslist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const handleEditClick = (id) => () => {
        // console.log('Edit Triggered: ===> ', id);
        setSelId(id);
        setMyPopUp(true);
    };
    const handleAssignClick = (id) => () => {
        // console.log('assign device: ===> ', id);
        setSelId(id);
        setMyAssign(true);
        // console.log("Selected ID: ", id);
    };
    function printmyrow(id) {
        // console.log(rows);
    }
    const makepopenable = () => {
        setMyPopUp(false);
        setDelPopUp(false);
        let myorg = sessionStorage.getItem('myOrg');
        getSpotInfo(myorg);
    };
    const makeDeletepopenable = () => {
        setDelPopUp(false);
        let myorg = sessionStorage.getItem('myOrg');
        getSpotInfo(myorg);
    };
    const makeassigndeviceenable = () => {
        setMyAssign(false);
    };
    const onProcessRowUpdateError = (error) => {
        // console.log('Error: --->', error);
    };
    const handleDeleteClick = (id) => async () => {
        setSelId(id);
        setDelPopUp(true);
    };

    async function devrecord() {
        setMyAssign(false);
        //let sname = rows[selid - 1].sname;
        props.lsdata.cbf(2);
        props.lsdata.cbfsid(rows[selid - 1].sid);
        props.lsdata.cbfsname(rows[selid - 1].sname);
        // props.lsdata.cbftitle('Spots -> ManageDevice -> '+sname);
    }

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        return updatedRow;
    };
    const handleOpenDownloadDialog = () => {
        setOpenDownloadDialog(true);
    };
    // Close the dialog
    const handleCloseDownloadDialog = () => {
        setOpenDownloadDialog(false);
    };

    // Download CSV with the provided file name
    const handleDownloadCsv = () => {
        handleCloseDownloadDialog();
        handleExportCsv(csvFileName);
    };
    const handleCsvFileNameChange = (event) => {
        setCsvFileName(event.target.value);
    };
    const handleExportCsv = (fileName) => {
        // Create a CSV string from the rows data
        const csvData = rows.map((row) => Object.values(row).join(',')).join('\n');
        // Create a blob with the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });
        // Create a temporary link to download the CSV file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`; // Set the file name with the user-entered name
        document.body.appendChild(a);
        a.click();
        // Clean up the temporary link
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    // for PDF
    const [pdfFileName, setPdfFileName] = React.useState('');
    const handleOpenDownloadPdfDialog = () => {
        setOpenDownloadPdfDialog(true);
    };
    const handleCloseDownloadPdfDialog = () => {
        setOpenDownloadPdfDialog(false);
    };
    const handlePdfFileNameChange = (event) => {
        setPdfFileName(event.target.value);
    };
    const handleExportPdf = () => {
        handleCloseDownloadPdfDialog();
        handleGeneratePdf(pdfFileName);
    };
    const pdfCellWidth = 70;
    const handleGeneratePdf = (fileName) => {
        const doc = new jsPDF();
        const columns = thcolumns.map((col) => col.headerName);
        // Calculate the total number of pages required based on the rows
        const totalPages = Math.ceil(rows.length / 10); // Assuming 10 rows fit on each page
        let startY = 10; // Initial Y position for the first page
        for (let page = 1; page <= totalPages; page++) {
            if (page > 1) {
                doc.addPage();
            }
            // Calculate the ending index for the current page
            const endIndex = page * 10;
            const pageRows = rows.slice((page - 1) * 10, endIndex);
            const tableData = pageRows.map((row) => thcolumns.map((col) => row[col.field]));
            // Calculate the width for each column based on thcolumns
            const columnWidths = thcolumns.map((col) => col.width || 100); // Default width: 100 if not specified
            // Add the PDF table to the document for the current page
            doc.autoTable({
                head: [columns],
                body: tableData,
                startY,
                styles: {
                    fontSize: 10,
                    cellPadding: { top: 5, right: 5, bottom: 5, left: 5 }
                },
                columnStyles: {
                    // Set individual column widths based on thcolumns
                    ...columnWidths.reduce((acc, width, index) => {
                        acc[index] = { cellWidth: width };
                        return acc;
                    }, {})
                    // Add more column styles for each column if needed
                },
                // Set the width of the table to match the content
                tableWidth: 'auto',
                // Add custom 'pageBreak' option to ensure table content flows across pages
                pageBreak: 'auto'
            });
            // Update the starting position for the next page
            startY = doc.autoTable.previous.finalY + 10;
        }
        // Save the PDF
        doc.save(`${fileName}.pdf`);
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
        <div>
            <div style={{ height: 400, width: '100%', marginTop: -1, marginLeft: -20 }}>
                {delpopup ? <DeleteSpot mydata={{ sdata: rows[selid - 1], hcb: makeDeletepopenable }} /> : null}
                {mypopup ? <EditSpot mydata={{ sdata: rows[selid - 1], hcb: makepopenable }} /> : null}
                {myassign ? devrecord() : null}
                <DataGrid
                    {...data1}
                    loading={loading}
                    slots={{ toolbar: GridToolbar }}
                    rows={rows}
                    columns={cols}
                    pageSize={(2, 5, 10, 20)}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    density="compact"
                    onProcessRowUpdateError={onProcessRowUpdateError}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel }
                    }}
                    slots={{
                        toolbar: CustomToolbar
                    }}
                />
            </div>
            <Dialog open={openDownloadDialog} onClose={handleCloseDownloadDialog}>
                <DialogTitle>Enter CSV File Name</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                        <TextField id="linkmail" label="Enter Name" fullWidth value={csvFileName} onChange={handleCsvFileNameChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDownloadDialog}>Cancel</Button>
                    <Button onClick={handleDownloadCsv} color="primary">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDownloadPdfDialog} onClose={handleCloseDownloadPdfDialog}>
                <DialogTitle>Enter PDF File Name</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                        <TextField id="linkmail" label="Enter Name" fullWidth value={pdfFileName} onChange={handlePdfFileNameChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDownloadPdfDialog}>Cancel</Button>
                    <Button onClick={handleExportPdf} color="primary">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
            <div style={{ height: '500px', width: '100%' }}>
                <MapContainer
                    center={[20.5937, 78.9629]} // Default center of the map (India)
                    zoom={5}
                    whenCreated={setMap}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {mapMarkers}
                </MapContainer>
            </div>
        </div>
    );
}

/*** end of managespot.js ***/
