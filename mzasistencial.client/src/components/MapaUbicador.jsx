import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useLogError } from '../hooks/useLogError';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ 
    iconRetinaUrl: markerIcon2x, 
    iconUrl: markerIcon, 
    shadowUrl: markerShadow 
});

const TILE_OSM = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_SAT = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ATTR_OSM = '&copy; OpenStreetMap';
const ATTR_SAT = 'Tiles &copy; Esri';

const FlyTo = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        const probarLog = () => {
            // Error al servidor de prueba
            logError("PRUEBA_LOG", new Error("Este es un error forzado para verificar el sistema"));
        };
        const la = parseFloat(lat);
        const lo = parseFloat(lng);
        if (!isNaN(la) && !isNaN(lo)) map.flyTo([la, lo], 15);
    }, [lat, lng, map]);
    return null;
};

// Componente auxiliar para capturar clics en el mapa
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

export const MapaUbicador = ({ form, onChange }) => {
    const [vistaTab, setVistaTab] = useState('mapa');
    const [flyKey, setFlyKey] = useState(0);
    const [buscando, setBuscando] = useState(false);

    const parsedLat = parseFloat(form.latitud);
    const parsedLng = parseFloat(form.longitud);
    const tieneCoords = !isNaN(parsedLat) && !isNaN(parsedLng);

    const logError = useLogError("Mapa Ubicador");

    const handleBuscarDireccion = async () => {
        if (!form.direccion?.trim()) return;
        setBuscando(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.direccion)}`);

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat).toFixed(6);
                const lon = parseFloat(data[0].lon).toFixed(6);
                
                onChange('latitud', lat);
                onChange('longitud', lon);
                
                const direccionLimpia = data[0].display_name.split(',').slice(0, 3).join(',').trim();
                onChange('direccion', direccionLimpia); 
                setFlyKey(k => k + 1); 
            } else {
                alert("No se ha encontrado esa dirección en el mapa.");
            }
        } catch (error) {
            console.error("Error buscando dirección:", error);
            logError("Fallo al buscar dirección en el mapa", error);
        } finally {
            setBuscando(false);
        }
    };

    const obtenerDireccionPorCoordenadas = async (lat, lon) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();
            if (data && data.display_name) {
                const direccionLimpia = data.display_name.split(',').slice(0, 3).join(',').trim();
                onChange('direccion', direccionLimpia);
            } else {
                onChange('direccion', `Coordenadas: ${lat}, ${lon}`);
            }
        } catch (error) {
            console.error("Error al obtener la calle por coordenadas:", error);
            logError("Fallo al obtener dirección inversa por coordenadas", error);
        }
    };

    const handleMapClick = async (la, lo) => {
        const latStr = la.toFixed(6);
        const lonStr = lo.toFixed(6);
        onChange('latitud', latStr);
        onChange('longitud', lonStr);
        await obtenerDireccionPorCoordenadas(la, lo);
    };

    const defaultCenter = tieneCoords ? [parsedLat, parsedLng] : [40.416775, -3.70379];

    return (
        <div className="ficha-tab-mapa">
            <div className="ficha-grid" style={{ marginBottom: 15 }}>
                <div className="ficha-field span2">
                    <label>Buscador de Dirección</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            value={form.direccion || ''} 
                            onChange={e => onChange('direccion', e.target.value)} 
                            placeholder="Escribe aquí y dale a buscar, o haz clic en el mapa..."
                            onKeyDown={e => e.key === 'Enter' && handleBuscarDireccion()}
                        />
                        <button className="ficha-btn-secondary" onClick={handleBuscarDireccion} disabled={buscando}>
                            {buscando ? '⏳...' : '🔍 Buscar y Situar'}
                        </button>
                    </div>
                </div>
                
                <div className="ficha-field">
                    <label>Latitud</label>
                    <input type="text" value={form.latitud || ''} readOnly className="readonly" />
                </div>
                <div className="ficha-field">
                    <label>Longitud</label>
                    <input type="text" value={form.longitud || ''} readOnly className="readonly" />
                </div>
            </div>

            <div className="mapa-view-tabs">
                <button className={`mapa-view-tab ${vistaTab === 'mapa' ? 'active' : ''}`} onClick={() => setVistaTab('mapa')}>Mapa</button>
                <button className={`mapa-view-tab ${vistaTab === 'satelite' ? 'active' : ''}`} onClick={() => setVistaTab('satelite')}>Satélite</button>
            </div>

            <div className="mapa-container" style={{ height: 400 }}>
                <MapContainer center={defaultCenter} zoom={tieneCoords ? 16 : 6} style={{ height: '100%', width: '100%' }}>
                    {/* Sustituye TILE_OSM etc. por tus variables o strings reales */}
                    <TileLayer 
                        key={vistaTab} 
                        url={vistaTab === 'satelite' ? 'URL_SATELITE' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} 
                    />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {tieneCoords && (
                        <Marker position={[parsedLat, parsedLng]} />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};