import React, { useState, useEffect, useRef, useCallback } from "react";
import DataGrid, { Column, Scrolling } from "devextreme-react/data-grid";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../styles/FichaGlobal.css';

// Configuración de iconos de Leaflet para Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const TILE_OSM = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_SAT = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ATTR_OSM = '&copy; OpenStreetMap';
const ATTR_SAT = 'Tiles &copy; Esri';

/* ── HELPERS LEAFLET ───────────────────────────────────────────── */
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({ click: e => onMapClick(e.latlng.lat, e.latlng.lng) });
    return null;
};

const FlyTo = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        const la = parseFloat(lat);
        const lo = parseFloat(lng);
        if (!isNaN(la) && !isNaN(lo)) map.flyTo([la, lo], 15);
    }, [lat, lng, map]);
    return null;
};

/* ── PESTAÑA MAPA ──────────────────────────────────────────────── */
const TabMapa = ({ form, onChange }) => {
    const [vistaTab, setVistaTab] = useState('mapa');
    const [flyKey, setFlyKey] = useState(0);

    const parsedLat = parseFloat(form.latitud);
    const parsedLng = parseFloat(form.longitud);
    const tieneCoords = !isNaN(parsedLat) && !isNaN(parsedLng);

    const handleMapClick = (la, lo) => {
        onChange('latitud', String(la.toFixed(6)));
        onChange('longitud', String(lo.toFixed(6)));
    };

    const handleBuscar = () => setFlyKey(k => k + 1);
    const defaultCenter = tieneCoords ? [parsedLat, parsedLng] : [40.416775, -3.70379];

    return (
        <div className="ficha-tab-mapa">
            <div className="ficha-grid" style={{ marginBottom: 15 }}>
                <div className="ficha-field span2">
                    <label>Dirección Google / Localización</label>
                    <input 
                        type="text" 
                        value={form.dir_google || ''} 
                        onChange={e => onChange('dir_google', e.target.value)} 
                        placeholder="Ej: Calle Mayor 1, Madrid"
                    />
                </div>
                <div className="ficha-field">
                    <label>Latitud</label>
                    <input type="text" value={form.latitud || ''} onChange={e => onChange('latitud', e.target.value)} onBlur={handleBuscar} />
                </div>
                <div className="ficha-field">
                    <label>Longitud</label>
                    <input type="text" value={form.longitud || ''} onChange={e => onChange('longitud', e.target.value)} onBlur={handleBuscar} />
                </div>
            </div>

            <div className="mapa-view-tabs">
                <button className={`mapa-view-tab ${vistaTab === 'mapa' ? 'active' : ''}`} onClick={() => setVistaTab('mapa')}>Mapa</button>
                <button className={`mapa-view-tab ${vistaTab === 'satelite' ? 'active' : ''}`} onClick={() => setVistaTab('satelite')}>Satélite</button>
            </div>

            <div className="mapa-container" style={{ height: 400 }}>
                <MapContainer center={defaultCenter} zoom={tieneCoords ? 15 : 6} style={{ height: '100%', width: '100%' }}>
                    <TileLayer key={vistaTab} url={vistaTab === 'satelite' ? TILE_SAT : TILE_OSM} attribution={vistaTab === 'satelite' ? ATTR_SAT : ATTR_OSM} />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {tieneCoords && (
                        <>
                            <Marker position={[parsedLat, parsedLng]} />
                            <FlyTo key={flyKey} lat={form.latitud} lng={form.longitud} />
                        </>
                    )}
                </MapContainer>
            </div>
            <p className="mapa-hint" style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>📍 Haz clic en el mapa para situar el centro o introduce las coordenadas manualmente.</p>
        </div>
    );
};

/* ── PESTAÑA GENERAL ───────────────────────────────────────────── */
const TabGeneral = ({ form, onChange, errors, onGoToMap }) => (
    <div className="ficha-grid">
        <div className="ficha-field">
            <label>Localizador (CCN)</label>
            <input type="text" value={form.localizador || ''} readOnly />
        </div>
        <div className="ficha-field">
            <label>Proveedor</label>
            <select value={form.proveedor || ''} onChange={e => onChange('proveedor', e.target.value)}>
                <option value="">— Seleccionar —</option>
            </select>
        </div>

        <div className="ficha-field">
            <label>Delegación</label>
            <select value={form.delegacion || ''} onChange={e => onChange('delegacion', e.target.value)}>
                <option value="">— Seleccionar —</option>
            </select>
        </div>
        <div className="ficha-field">
            <label>Centro</label>
            <input className={errors.centro ? 'error' : ''} type="text" value={form.centro || ''} onChange={e => onChange('centro', e.target.value)} />
        </div>

        <div className="ficha-field">
            <label>Provincia</label>
            <select value={form.provincia || ''} onChange={e => onChange('provincia', e.target.value)}>
                <option value="">{form.provincia || '— Seleccionar —'}</option>
            </select>
        </div>
        <div className="ficha-field">
            <label>Población</label>
            <select value={form.poblacion || ''} onChange={e => onChange('poblacion', e.target.value)}>
                <option value="">{form.poblacion || '— Seleccionar —'}</option>
            </select>
        </div>

        <div className="ficha-field">
            <label>CIF / NIF</label>
            <input type="text" value={form.cif || ''} onChange={e => onChange('cif', e.target.value)} />
        </div>
        <div className="ficha-field">
            <label>Código Postal</label>
            <select value={form.cp || ''} onChange={e => onChange('cp', e.target.value)}>
                <option value="">{form.cp || '— Seleccionar —'}</option>
            </select>
        </div>

        <div className="ficha-field">
            <label>Dirección</label>
            <input type="text" value={form.direccion || ''} onChange={e => onChange('direccion', e.target.value)} />
        </div>
        <div className="ficha-field">
            <label>Número</label>
            <input type="text" value={form.numero || ''} onChange={e => onChange('numero', e.target.value)} />
        </div>

        <div className="ficha-field">
            <label>Teléfono</label>
            <input type="text" value={form.telefono || ''} onChange={e => onChange('telefono', e.target.value)} />
        </div>
        <div className="ficha-field">
            <label>Nº de Registro Sanitario</label>
            <input type="text" value={form.registro_sanitario || ''} onChange={e => onChange('registro_sanitario', e.target.value)} />
        </div>

        <div className="ficha-field">
            <label>Ubicación</label>
            <button className="ficha-btn-secondary" type="button" onClick={onGoToMap} style={{ width: '100%', textAlign: 'left' }}>
                🌐 {form.latitud && form.longitud ? `${form.latitud}, ${form.longitud}` : 'Ver / Editar en mapa'}
            </button>
        </div>
        <div className="ficha-field">
            <label>Fecha de baja</label>
            <input type="date" value={form.fecha_baja || ''} onChange={e => onChange('fecha_baja', e.target.value)} />
        </div>

        <div className="ficha-field span2">
            <label>Comentarios</label>
            <textarea rows={3} value={form.comentarios || ''} onChange={e => onChange('comentarios', e.target.value)} />
        </div>

        <div className="ficha-field span2">
            <label>Motivo de la baja</label>
            <textarea rows={3} value={form.motivo_baja || ''} onChange={e => onChange('motivo_baja', e.target.value)} />
        </div>
    </div>
);

/* ── PESTAÑAS DE TABLAS SECUNDARIAS ────────────────────────────── */
const TabDataGrid = ({ datos, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginBottom: '10px' }}>
             <button className="ficha-btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>📊 Excel</button>
             <button className="ficha-btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>📄 PDF</button>
        </div>
        <DataGrid dataSource={datos} showBorders={true} noDataText="Sin datos para mostrar" height={350}>
            <Scrolling mode="standard" />
            {children}
        </DataGrid>
    </div>
);

/* ── COMPONENTE PRINCIPAL ──────────────────────────────────────── */
const FichaCentroConcertado = ({ cliente, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState('general');
    
    const [form, setForm] = useState({
        centro_id: cliente?.CentroID ?? cliente?.centro_id ?? '',
        localizador: cliente?.Localizador ?? cliente?.ccn ?? '',
        centro: cliente?.Centro ?? cliente?.centro ?? '',
        direccion: cliente?.Direccion ?? cliente?.direccion ?? '',
        poblacion: cliente?.Poblacion ?? cliente?.poblacion ?? '',
        provincia: cliente?.Provincia ?? cliente?.provincia ?? '',
        cif: cliente?.Cif ?? cliente?.cif ?? '',
        cp: cliente?.CP ?? cliente?.cp ?? '',
        proveedor: '', delegacion: '', numero: '', telefono: '', 
        registro_sanitario: '', dir_google: '', fecha_baja: '', 
        comentarios: '', motivo_baja: '', latitud: '', longitud: ''
    });

    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);

    useEffect(() => {
        modalRef.current?.focus();
        const handler = e => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleChange = useCallback((field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: false }));
    }, []);

    const handleSave = () => {
        const newErrors = {};
        if (!form.centro) newErrors.centro = true;
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        onSave?.(form);
    };

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content" ref={modalRef} tabIndex={-1}>
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">🏥 Ficha Centro Concertado | {form.localizador || 'Nuevo'}</span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={handleSave}>✓ Aceptar</button>
                        <button className="ficha-btn-secondary" onClick={onClose}>✗ Salir</button>
                    </div>
                </div>

                <div className="ficha-tabs">
                    <button className={`ficha-tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
                    <button className={`ficha-tab ${activeTab === 'registroICG' ? 'active' : ''}`} onClick={() => setActiveTab('registroICG')}>Registro ICG</button>
                    <button className={`ficha-tab ${activeTab === 'mutuasAsignadas' ? 'active' : ''}`} onClick={() => setActiveTab('mutuasAsignadas')}>Mutuas Asignadas</button>
                    <button className={`ficha-tab ${activeTab === 'especialidades' ? 'active' : ''}`} onClick={() => setActiveTab('especialidades')}>Especialidades / Serv.</button>
                    <button className={`ficha-tab ${activeTab === 'mapa' ? 'active' : ''}`} onClick={() => setActiveTab('mapa')}>Mapa / Ubicación</button>
                </div>

                <div className="ficha-tab-content">
                    {activeTab === 'general' && <TabGeneral form={form} onChange={handleChange} errors={errors} onGoToMap={() => setActiveTab('mapa')} />}
                    
                    {activeTab === 'registroICG' && (
                        <TabDataGrid datos={[]}>
                            <Column dataField="anyo" caption="Año" width={100} />
                            <Column dataField="mutua" caption="Mutua" />
                            <Column dataField="centro" caption="Centro" />
                            <Column dataField="fechaActualizacion" caption="Fecha Act." dataType="date" width={150} />
                            <Column dataField="usuario" caption="Usuario" width={150} />
                        </TabDataGrid>
                    )}

                    {activeTab === 'mutuasAsignadas' && (
                        <TabDataGrid datos={[]}>
                            <Column dataField="mutua" caption="Mutua" />
                        </TabDataGrid>
                    )}

                    {activeTab === 'especialidades' && (
                        <TabDataGrid datos={[]}>
                            <Column dataField="anyo" caption="Año" width={100} />
                            <Column dataField="servicio" caption="Servicio" />
                            <Column dataField="especialidad" caption="Especialidad" />
                            <Column dataField="cantidad" caption="Cantidad" width={100} />
                        </TabDataGrid>
                    )}

                    {activeTab === 'mapa' && <TabMapa form={form} onChange={handleChange} />}
                </div>
            </div>
        </div>
    );
};

export default FichaCentroConcertado;