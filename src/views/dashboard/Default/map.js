import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography } from '@mui/material';

// Define custom icons
const activeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const inactiveIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const DeviceMap = ({ spots }) => {
    return (
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '400px', width: '100%' }}>
            <LayersControl position="topright">
                <LayersControl.BaseLayer name="OpenTopoMap" checked>
                    <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri World Imagery">
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                </LayersControl.BaseLayer>
            </LayersControl>
            {spots.map((spot) => (
                <Marker
                    key={spot.id}
                    position={[spot.latitude, spot.longitude]}
                    icon={spot.status.toLowerCase() === 'active' ? activeIcon : inactiveIcon}
                >
                    <Popup>
                        <Typography variant="body1">{spot.sname}</Typography>
                        <Typography variant="body2">Status: {spot.status}</Typography>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default DeviceMap;
