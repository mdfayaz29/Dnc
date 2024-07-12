import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { constobj } from '../../../misc/constants';

export default function ConfigEdit(props) {
    const { PORTAL_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [apiData, setApiData] = useState(props.mydata.sdata);

    const statusRef = useRef(null);

    const handleSave = () => {
        //setOpen(true);
        UpdateApiConfig();
    };

    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    useEffect(() => {
        showConfigData();
    }, []);

    function UpdateApicData(apidata) {
        return new Promise(async function (resolve, reject) {
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            var raw = JSON.stringify({ apidata: apidata });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw
            };

            var url = new URL('http://localhost:7791' + '/uapic');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    }

    async function showConfigData() {
        let apidata = props.mydata.sdata;
        let mydict = {};

        mydict['name'] = apidata['Application_Name'];
        mydict['akey'] = apidata['API_Key'];
        mydict['nwpf'] = apidata['Network_ID_Prefix'];
        mydict['upf'] = apidata['API_URL_Prefix'];
        mydict['usf'] = apidata['API_URL_Suffix'];
        setApiData(mydict);
    }

    async function UpdateApiConfig() {
        let newdict = {};
        newdict['name'] = props.mydata.sdata.name;

        let apiurlpf = document.getElementById('apiurlpf').value;
        let apikey = document.getElementById('apikey').value;
        let apiurlsf = document.getElementById('apiurlsf').value;
        let nwidpf = document.getElementById('nwidpf').value;

        // const apidata = { name: apiname, urlprefix: apiurlpf, apikey: apikey, urlsuffix: apiurlsf, nwidprefix: nwidpf };

        if (apiurlpf !== props.mydata.sdata.upf) {
            newdict['urlprefix'] = apiurlpf;
        }
        if (apikey !== props.mydata.sdata.akey) {
            newdict['apikey'] = apikey;
        }
        if (apiurlsf !== props.mydata.sdata.usf) {
            newdict['urlsuffix'] = apiurlsf;
        }
        if (nwidpf !== props.mydata.sdata.nwpf) {
            newdict['nwidprefix'] = nwidpf;
        }

        let uresp = await UpdateApicData(newdict);

        handleClose();
        Swal.fire(uresp);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'Edit Config API -  ' + apiData.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{}} id="alert-dialog-description">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                '& > :not(style)': { m: 1, flexBasis: '50%' }
                            }}
                        >
                            <TextField
                                size="small"
                                disabled
                                label="Application Name"
                                defaultValue={props.mydata.sdata.Application_Name}
                                inputRef={statusRef}
                            />
                            <TextField
                                size="small"
                                id="apiurlpf"
                                label="API URL Prefix"
                                defaultValue={props.mydata.sdata.API_URL_Prefix}
                                inputRef={statusRef}
                            />
                            <TextField
                                size="small"
                                id="apikey"
                                label="API Key"
                                defaultValue={props.mydata.sdata.API_Key}
                                inputRef={statusRef}
                            />
                            <TextField
                                id="apiurlsf"
                                size="small"
                                label="API URL Suffix "
                                defaultValue={props.mydata.sdata.API_URL_Suffix}
                                inputRef={statusRef}
                            />
                            <TextField
                                id="nwidpf"
                                size="small"
                                label="Network ID Prefix"
                                defaultValue={props.mydata.sdata.Network_ID_Prefix}
                                inputRef={statusRef}
                            />
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        size="small"
                        color="success"
                        sx={{
                            backgroundColor: 'green',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '15px'
                        }}
                    >
                        Update
                    </Button>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        size="small"
                        ccolor="error"
                        sx={{
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '15px'
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
