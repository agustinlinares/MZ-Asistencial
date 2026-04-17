import React, { useState } from "react";
import "./MapaModal.css";

const MapaModal = ({ latitud, longitud, direccion, onAceptar, onCerrar }) => {
    const [lat, setLat] = useState(latitud || "");
    const [lng, setLng] = useState(longitud || "");
    const [dir, setDir] = useState(direccion || "");
    const [mapUrl, setMapUrl] = useState(
        latitud && longitud
            ? "https://maps.google.com/maps?q=" + latitud + "," + longitud + "&z=15&output=embed"
            : "https://maps.google.com/maps?q=Espana&z=6&output=embed"
    );

    const handleBuscar = () => {
        if (lat && lng) {
            setMapUrl("https://maps.google.com/maps?q=" + lat + "," + lng + "&z=15&output=embed");
        } else if (dir) {
            setMapUrl("https://maps.google.com/maps?q=" + encodeURIComponent(dir) + "&z=15&output=embed");
        }
    };

    const handleAceptar = () => {
        onAceptar({ latitud: lat, longitud: lng, direccion: dir });
        onCerrar();
    };

    return (
        <div className="mapa-overlay">
            <div className="mapa-container">
                <div className="mapa-header">
                    <span className="mapa-title">Mapa</span>
                    <div className="mapa-header-btns">
                        <button className="mapa-btn mapa-btn--aceptar" onClick={handleAceptar}>Aceptar</button>
                        <button className="mapa-btn mapa-btn--salir" onClick={onCerrar}>Salir</button>
                    </div>
                </div>
                <div className="mapa-fields">
                    <div className="mapa-field mapa-field--full">
                        <label>Direccion</label>
                        <div className="mapa-busqueda-row">
                            <input type="text" value={dir} onChange={e => setDir(e.target.value)} onKeyDown={e => e.key === "Enter" && handleBuscar()} placeholder="Introduce una direccion..." />
                            <button className="mapa-btn-buscar" onClick={handleBuscar}>Buscar</button>
                        </div>
                    </div>
                    <div className="mapa-field">
                        <label>Latitud</label>
                        <input type="text" value={lat} onChange={e => setLat(e.target.value)} placeholder="ej: 40.4168" />
                    </div>
                    <div className="mapa-field">
                        <label>Longitud</label>
                        <input type="text" value={lng} onChange={e => setLng(e.target.value)} placeholder="ej: -3.7038" />
                    </div>
                </div>
                <div className="mapa-iframe-wrap">
                    <iframe title="Mapa Google" src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
            </div>
        </div>
    );
};

export default MapaModal;
