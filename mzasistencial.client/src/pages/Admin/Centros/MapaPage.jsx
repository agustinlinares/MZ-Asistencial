import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MapaPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const s = location.state || {};

    const [lat, setLat] = useState(s.latitud !== undefined ? String(s.latitud) : "");
    const [lng, setLng] = useState(s.longitud !== undefined ? String(s.longitud) : "");
    const [dir, setDir] = useState(s.direccion || "");
    const [mapUrl, setMapUrl] = useState(
        s.latitud && s.longitud
            ? `https://maps.google.com/maps?q=${s.latitud},${s.longitud}&z=15&output=embed`
            : "https://maps.google.com/maps?q=Espana&z=6&output=embed"
    );

    const handleBuscar = async (buscarDir) => {
        const dirBuscar = buscarDir || dir;
        if (dirBuscar) {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dirBuscar)}&limit=1`,
                    { headers: { 'Accept-Language': 'es' } }
                );
                const data = await res.json();
                if (data && data.length > 0) {
                    const { lat: newLat, lon: newLng, display_name } = data[0];
                    setLat(newLat);
                    setLng(newLng);
                    setDir(display_name);
                    setMapUrl(`https://maps.google.com/maps?q=${newLat},${newLng}&z=15&output=embed`);
                } else {
                    setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(dirBuscar)}&z=15&output=embed`);
                }
            } catch {
                setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(dirBuscar)}&z=15&output=embed`);
            }
        } else if (lat && lng) {
            setMapUrl(`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`);
        }
    };

    useEffect(() => {
        if (s.direccion && !s.latitud && !s.longitud) {
            handleBuscar(s.direccion);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ✅ Usa sessionStorage para pasar datos de vuelta a FichaCentroPropio
    const handleAceptar = async () => {
        if (s.centroId && lat && lng) {
            try {
                await fetch("/api/CentrosPropios/" + s.centroId + "/coordenadas", {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ latitud: lat, longitud: lng }),
                });
            } catch { /* silently handled */ }
        }
        sessionStorage.setItem('mapaRetorno', JSON.stringify({
            latitud: lat,
            longitud: lng,
            direccion: dir,
            mapaValidado: true,
        }));
        navigate(-1);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "#1a3a5c", flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Mapa — Verificar Dirección</span>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleAceptar} style={{ background: "#2ecc71", color: "#fff", border: "none", borderRadius: 5, padding: "7px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        ✓ Aceptar
                    </button>
                    <button onClick={() => navigate(-1)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 5, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Volver
                    </button>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", padding: "14px 24px", background: "#f8fafc", borderBottom: "1px solid #e0e6ed", flexShrink: 0 }}>
                <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 3 }}>
                    <label style={{ fontSize: 10.5, fontWeight: 700, color: "#1565c0", textTransform: "uppercase", letterSpacing: "0.4px" }}>Dirección</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                        <input type="text" value={dir} onChange={e => setDir(e.target.value)} onKeyDown={e => e.key === "Enter" && handleBuscar()} placeholder="Introduce una dirección..."
                            style={{ flex: 1, border: "none", borderBottom: "1.5px solid #b0bec5", padding: "5px 2px", fontSize: 13, background: "transparent", outline: "none", fontFamily: "inherit", color: "#333" }} />
                        <button onClick={() => handleBuscar()} style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                            Buscar
                        </button>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <label style={{ fontSize: 10.5, fontWeight: 700, color: "#1565c0", textTransform: "uppercase", letterSpacing: "0.4px" }}>Latitud</label>
                    <input type="text" value={lat} onChange={e => setLat(e.target.value)} placeholder="ej: 40.4168"
                        style={{ border: "none", borderBottom: "1.5px solid #b0bec5", padding: "5px 2px", fontSize: 13, background: "transparent", outline: "none", fontFamily: "inherit", color: "#333" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <label style={{ fontSize: 10.5, fontWeight: 700, color: "#1565c0", textTransform: "uppercase", letterSpacing: "0.4px" }}>Longitud</label>
                    <input type="text" value={lng} onChange={e => setLng(e.target.value)} placeholder="ej: -3.7038"
                        style={{ border: "none", borderBottom: "1.5px solid #b0bec5", padding: "5px 2px", fontSize: 13, background: "transparent", outline: "none", fontFamily: "inherit", color: "#333" }} />
                </div>
            </div>
            <div style={{ flex: 1, position: "relative" }}>
                <iframe title="Mapa Google" src={mapUrl}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
        </div>
    );
};

export default MapaPage;