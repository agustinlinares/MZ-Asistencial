import React, { useState } from "react";
import "../../../styles/FichaGlobal.css";


const MapaModal = ({ latitud, longitud, direccion, onAceptar, onCerrar }) => {
    const [lat, setLat] = useState(latitud || "");
    const [lng, setLng] = useState(longitud || "");
    const [dir, setDir] = useState(direccion || "");
    const [mapUrl, setMapUrl] = useState(
        latitud && longitud
            ? "https://maps.google.com/maps?q=" + latitud + "," + longitud + "&z=15&output=embed"
            : "https://maps.google.com/maps?q=Espana&z=6&output=embed"
    );

const handleBuscar = async () => {
    if (dir) {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dir)}&limit=1`,
                { headers: { 'Accept-Language': 'es' } }
            );
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat: newLat, lon: newLng } = data[0];
                setLat(newLat);
                setLng(newLng);
                setMapUrl(`https://maps.google.com/maps?q=${newLat},${newLng}&z=15&output=embed`);
            } else {
                setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(dir)}&z=15&output=embed`);
            }
        } catch {
            setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(dir)}&z=15&output=embed`);
        }
    } else if (lat && lng) {
        setMapUrl(`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`);
    }
};

    const handleAceptar = () => {
        onAceptar({ latitud: lat, longitud: lng, direccion: dir });
        onCerrar();
    };

    return (
        <div className="ficha-overlay">
            <div className="ficha-container-inline" style={{ maxWidth: '900px', height: '90vh' }}>
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title"><i className="ri-map-2-line"></i> Mapa</span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={handleAceptar}>Aceptar</button>
                        <button className="ficha-btn-secondary" onClick={onCerrar}>Salir</button>
                    </div>
                </div>
                <div className="ficha-grid" style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e0e0e0', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                    <div className="ficha-field span2">
                        <label>Direccion</label>
                        <div className="ficha-input-suffix">
                            <input type="text" value={dir} onChange={e => setDir(e.target.value)} onKeyDown={e => e.key === "Enter" && handleBuscar()} placeholder="Introduce una direccion..." style={{ flex: 1 }} />
                            <button className="ficha-btn-primary" onClick={handleBuscar}>Buscar</button>
                        </div>
                    </div>
                    <div className="ficha-field">
                        <label>Latitud</label>
                        <input type="text" value={lat} onChange={e => setLat(e.target.value)} placeholder="ej: 40.4168" />
                    </div>
                    <div className="ficha-field">
                        <label>Longitud</label>
                        <input type="text" value={lng} onChange={e => setLng(e.target.value)} placeholder="ej: -3.7038" />
                    </div>
                </div>
                <div className="ficha-iframe-wrap">
                    <iframe title="Mapa Google" src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
            </div>
        </div>
    );
};

export default MapaModal;
