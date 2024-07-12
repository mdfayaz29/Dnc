// LeafletMap.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Text from './text';

const Maps = () => {
    const [position, setPosition] = useState(null);

    // Function to fetch geolocation
    useEffect(() => {
        const getLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                },
                (err) => {
                    console.error(err);
                    alert('Location access denied or failed.');
                }
            );
        };

        getLocation();
    }, []);

    // Function to handle form submission from Text component
    const handleFormSubmit = (lat, lng) => {
        setPosition([lat, lng]);
    };

    return (
        <>
            <Text onSubmit={handleFormSubmit} />
            <MapContainer
                center={position || [51.505, -0.09]} // Use current position if available, otherwise default center
                zoom={position ? 15 : 5} // Zoom in to current position if available, otherwise show world view
                style={{ height: '400px', width: '100%' }} // Set height and width of the map
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {position && (
                    <Marker position={position}>
                        <Popup>You are here!</Popup>
                    </Marker>
                )}
            </MapContainer>
        </>
    );
};

export default Maps;
