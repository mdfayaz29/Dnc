/*

Module: co2calibaration.js

Function:
    Implementation code for downlink.

Copyright and License:
    See accompanying LICENSE file for copyright and license information.

Author:
    AthiSankar, MCCI Corporation October 2023

*/

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import { constobj } from '../../../misc/constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Co2calibration() {
    const { DNC_URL } = { ...constobj };
    const [apiUrl, setApiUrl] = React.useState('');
    const [apiKey, setApiKey] = React.useState('');
    const [apiSf, setApiSf] = React.useState('');
    const [apiPf, setApiPf] = React.useState('');

    const handleSaveClick = () => {
        let adata = {
            aurl: document.getElementById('apiurl').value,
            akey: document.getElementById('apikey').value,
            apisf: document.getElementById('apiusf').value,
            nwidpf: document.getElementById('nwidpf').value
        };
        updateApic({ adata: adata });
        props.mydata.hcb();
        setOpen(false);
    };

    /*
    | updateApic use a try catch block to handle asynchronous operation. Inside
    | the try block It calls the updateApiData function using await, indicating
    | that it wait for the asynchronous operation to complete before proceeding
    | It stores the result in the variable sresp. It displays a success toast
    | notification using the toast.success method with specific configuration.
    | Catches any errors thrown during the asynchronous operation. It displays
    | an error toast notification using the toast.error
    */
    async function updateApic(mydict) {
        try {
            let sresp = await updateApiData(mydict);
            toast.success('API Config Updated successfully', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        } catch (err) {
            // Replace Swal alert with toast notification
            toast.error(err.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        }
    }

    /*

    Name:   updateApiData()

    Function:
        It takes one parameter, mydict, presumably an object containing data
        for updating API configurations.

    Definition:
        Retrieves the authentication token (auth) and user information (myuser)
        from the session storage. a requestOptions object with the HTTP method
        'POST', headers, and the request body as a JSON string (mydict). It 
        constructs a URL based on the DNC_URL variable, representing the base
        URL for the API.

    Description:
        DNC_URL: The base URL possibly for server endpoint. auth: Authorization
        token retrieved from the session storage. myuser: User information 
        retrieved from the session storage. myuobj: Parsed user information as
        a JavaScript object. myHeaders: Headers object including authorization
        and content type. requestOptions: Options the fetch request including
        method, headers, and body. url: The constructed URL for fetch request.

    Return:
        Resolving with data if the request is successful, and rejecting with
        an error if there's a failure during the request.

    */
    function updateApiData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/apic');
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /*
    | getApiData is responsible for fetching API configuration data. It uses 
    | the fetch API to make a GET request, extracts specific properties from 
    | the response, and resolves a Promise with the extracted data.
    */
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
            var url = new URL(DNC_URL + '/apic');
            let resdict = {};
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resdict['aurl'] = data[0].aurl;
                    resdict['akey'] = data[0].akey;
                    resdict['apisf'] = data[0].apisf;
                    resdict['nwidpf'] = data[0].nwidpf;
                    resolve(resdict);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function getApiConfig() {
        const myapi = await getApiData();
        setApiUrl(myapi.aurl);
        setApiKey(myapi.akey);
        setApiSf(myapi.apisf);
        setApiPf(myapi.nwidpf);
    }

    useEffect(() => {
        getApiConfig();
    }, []);

    return (
        <Box display="flex" marginLeft="-10%" flexDirection="column" alignItems="center" justifyContent="center" height="50%">
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '50ch' },
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '10px'
                }}
                noValidate
                autoComplete="off"
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h6 style={{ marginRight: '10px', verticalAlign: 'middle' }}>CO2 Calibration</h6>
                    <TextField
                        id="co2input"
                        label="Enter Data"
                        type="number"
                        variant="standard"
                        style={{ verticalAlign: 'middle', marginTop: '-10px' }}
                    />
                    <h6 style={{ marginLeft: '10px', verticalAlign: 'middle' }}>ppm</h6>
                </div>
            </Box>
        </Box>
    );
}

/**** end of co2calibaration.js ****/
