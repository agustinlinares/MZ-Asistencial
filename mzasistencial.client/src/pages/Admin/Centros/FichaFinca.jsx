import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './FichaFinca.css';
import FincasService from "../../../services/admin/FincasService";
import { useTranslation } from "react-i18next";

// Fix Leaflet marker icons in Vite/webpack bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const TIPOS_FINCA = ['SÓTANO', 'PLANTA BAJA', 'PISO', 'LOCAL', 'GARAJE', 'TRASTERO'];

const TITULARIDADES = [
    'Patrimonio Histórico',
    'Patrimonio de la Seguridad Social',
    'Terceros distintos de los anteriores',
];



const TILE_OSM = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_SAT = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ATTR_OSM = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
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
    const [buscando, setBuscando] = useState(false);

    const parsedLat = parseFloat(form.latitud);
    const parsedLng = parseFloat(form.longitud);
    const tieneCoords = !isNaN(parsedLat) && !isNaN(parsedLng);

    const handleMapClick = (la, lo) => {
        onChange('latitud', String(la.toFixed(6)));
        onChange('longitud', String(lo.toFixed(6)));
    };

    const handleBuscar = async () => {
        if (!form.dir_google) { setFlyKey(k => k + 1); return; }
        
        setBuscando(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.dir_google)}&limit=1`,
                { headers: { 'Accept-Language': 'es' } }
            );
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                onChange('latitud', lat);
                onChange('longitud', lon);
                setFlyKey(k => k + 1);
            }
        } catch (error) {
            console.error("Error buscando dirección:", error);
        } finally {
            setBuscando(false);
        }
    };

    const defaultCenter = tieneCoords ? [parsedLat, parsedLng] : [40.416775, -3.70379];

    // URLs de Tiles de Google Maps (lyrs: m=callejero, s=satelite, y=hibrido)
    const GOOGLE_STREET = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    const GOOGLE_SATELLITE = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
    const GOOGLE_HYBRID = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';

    return (
        <div className="tab-mapa-container">
            <div className="finca-grid" style={{ marginBottom: 15 }}>
                <div className="finca-field span2">
                    <label>Buscador de Dirección (Google Maps)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input 
                            type="text" 
                            style={{ flex: 1 }}
                            value={form.dir_google || ''} 
                            onChange={e => onChange('dir_google', e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                            placeholder="Ej: Calle Mayor 1, Madrid"
                        />
                        <button 
                            className="finca-btn-primary" 
                            onClick={handleBuscar} 
                            disabled={buscando}
                            style={{ width: 'auto', padding: '0 15px' }}
                        >
                            {buscando ? <i className="ri-loader-4-line ri-spin"></i> : <i className="ri-search-line"></i>}
                        </button>
                    </div>
                </div>
                <div className="finca-field">
                    <label>Latitud</label>
                    <input type="text" value={form.latitud || ''} onChange={e => onChange('latitud', e.target.value)} onBlur={() => setFlyKey(k => k + 1)} />
                </div>
                <div className="finca-field">
                    <label>Longitud</label>
                    <input type="text" value={form.longitud || ''} onChange={e => onChange('longitud', e.target.value)} onBlur={() => setFlyKey(k => k + 1)} />
                </div>
            </div>

            <div className="mapa-view-tabs">
                <button className={`mapa-view-tab ${vistaTab === 'mapa' ? 'active' : ''}`} onClick={() => setVistaTab('mapa')}>Callejero</button>
                <button className={`mapa-view-tab ${vistaTab === 'satelite' ? 'active' : ''}`} onClick={() => setVistaTab('satelite')}>Satélite</button>
                <button className={`mapa-view-tab ${vistaTab === 'hibrido' ? 'active' : ''}`} onClick={() => setVistaTab('hibrido')}>Híbrido</button>
            </div>

            <div className="mapa-container" style={{ height: 400, borderRadius: 8, overflow: 'hidden', border: '1px solid #ddd', zIndex: 0 }}>
                <MapContainer center={defaultCenter} zoom={tieneCoords ? 15 : 6} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        key={vistaTab}
                        url={vistaTab === 'satelite' ? GOOGLE_SATELLITE : vistaTab === 'hibrido' ? GOOGLE_HYBRID : GOOGLE_STREET}
                        attribution="&copy; Google Maps"
                    />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {tieneCoords && (
                        <>
                            <Marker position={[parsedLat, parsedLng]} />
                            <FlyTo key={flyKey} lat={form.latitud} lng={form.longitud} />
                        </>
                    )}
                </MapContainer>
            </div>
            <p className="mapa-hint">📍 Haz clic en el mapa para situar la finca o busca una dirección arriba.</p>
        </div>
    );
};

/* ── PESTAÑA COSTES ────────────────────────────────────────────── */
const TabCostes = ({ fincaId }) => {
    const [costes, setCostes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [editando, setEditando] = useState(null);
    const [nuevaFila, setNuevaFila] = useState(null);

    useEffect(() => {
        if (!fincaId) return;
        const cargar = async () => {
            setCargando(true);
            try {
                setCostes(await FincasService.getCostes(fincaId));
            } catch (error) {
                console.error(error);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [fincaId]);

    const handleGuardar = async (coste) => {
        try {
            const result = await FincasService.saveCoste(fincaId, coste);
            if (coste.Id) {
                setCostes(prev => prev.map(c => c.Id === coste.Id ? result : c));
            } else {
                setCostes(prev => [...prev, result]);
            }
            setEditando(null);
            setNuevaFila(null);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Eliminar este coste?')) return;
        try {
            await FincasService.deleteCoste(fincaId, id);
            setCostes(prev => prev.filter(c => c.Id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    if (!fincaId) return (
        <div style={{ color: '#999', textAlign: 'center', marginTop: 40, fontSize: 14 }}>
            Guarda la finca primero para gestionar sus costes.
        </div>
    );

    if (cargando) return <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>Cargando...</div>;

    return (
        <div style={{ padding: '8px 0' }}>
            <table className="finca-costes-table">
                <thead>
                    <tr>
                        <th>Año</th>
                        <th>Coste (€)</th>
                        <th>Localizador</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {costes.length === 0 && !nuevaFila && (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999', padding: 16 }}>Sin costes registrados</td></tr>
                    )}
                    {costes.map(c =>
                        editando?.Id === c.Id ? (
                            <tr key={c.Id}>
                                <td><input type="number" value={editando.Anio} onChange={e => setEditando(p => ({ ...p, Anio: parseInt(e.target.value) || 0 }))} /></td>
                                <td><input type="number" step="0.01" value={editando.Coste ?? ''} onChange={e => setEditando(p => ({ ...p, Coste: parseFloat(e.target.value) || null }))} /></td>
                                <td><input type="text" value={editando.Localizador ?? ''} onChange={e => setEditando(p => ({ ...p, Localizador: e.target.value }))} /></td>
                                <td>
                                    <button className="finca-btn-primary" style={{ marginRight: 4, padding: '4px 10px' }} onClick={() => handleGuardar(editando)}>
                                        <i className="ri-save-line"></i>
                                    </button>
                                    <button className="finca-btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setEditando(null)}>
                                        <i className="ri-close-line"></i>
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={c.Id}>
                                <td>{c.Anio}</td>
                                <td>{c.Coste != null ? c.Coste.toLocaleString('es-ES', { minimumFractionDigits: 2 }) : '—'}</td>
                                <td>{c.Localizador ?? '—'}</td>
                                <td>
                                    <button className="finca-btn-secondary" style={{ marginRight: 4, padding: '4px 10px' }} onClick={() => setEditando({ ...c })}>
                                        <i className="ri-edit-line"></i>
                                    </button>
                                    <button className="finca-btn-secondary" style={{ padding: '4px 10px', color: '#c62828' }} onClick={() => handleEliminar(c.Id)}>
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </td>
                            </tr>
                        )
                    )}
                    {nuevaFila && (
                        <tr>
                            <td><input type="number" value={nuevaFila.Anio} onChange={e => setNuevaFila(p => ({ ...p, Anio: parseInt(e.target.value) || 0 }))} /></td>
                            <td><input type="number" step="0.01" value={nuevaFila.Coste ?? ''} onChange={e => setNuevaFila(p => ({ ...p, Coste: parseFloat(e.target.value) || null }))} /></td>
                            <td><input type="text" value={nuevaFila.Localizador ?? ''} onChange={e => setNuevaFila(p => ({ ...p, Localizador: e.target.value }))} /></td>
                            <td>
                                <button className="finca-btn-primary" style={{ marginRight: 4, padding: '4px 10px' }} onClick={() => handleGuardar(nuevaFila)}>
                                    <i className="ri-save-line"></i>
                                </button>
                                <button className="finca-btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setNuevaFila(null)}>
                                    <i className="ri-close-line"></i>
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div style={{ marginTop: 8 }}>
                <button className="finca-btn-primary" onClick={() => setNuevaFila({ Anio: new Date().getFullYear(), Coste: null, Localizador: '' })}>
                    + Añadir coste
                </button>
            </div>
        </div>
    );
};

/* ── PESTAÑA GENERAL ───────────────────────────────────────────── */
const TabGeneral = ({ form, onChange, errors, centros, onGoToMap }) => (
    <div className="finca-grid">
        <div className="finca-field">
            <label>Finca ID</label>
            <input type="text" value={form.finca_id || ''} readOnly />
        </div>
        <div className="finca-field">
            <label>Centro</label>
            <select
                className={errors.centro_id ? 'error' : ''}
                value={form.centro_id || ''}
                onChange={e => onChange('centro_id', e.target.value)}
            >
                <option value="">— Seleccionar —</option>
                {(centros || []).map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
        </div>

        <div className="finca-field">
            <label>Mutua</label>
            <input type="text" value={form.mutua || ''} onChange={e => onChange('mutua', e.target.value)} />
        </div>
        <div className="finca-field">
            <label>Coste Alquiler</label>
            <div className="finca-input-suffix">
                <input type="number" value={form.coste || ''} onChange={e => onChange('coste', e.target.value)} />
                <span>€</span>
            </div>
        </div>

        <div className="finca-field">
            <label>Dirección</label>
            <input type="text" value={form.direccion || ''} onChange={e => onChange('direccion', e.target.value)} />
        </div>
        <div className="finca-field">
            <label>Superficie Construida</label>
            <input type="number" value={form.superficie || ''} onChange={e => onChange('superficie', e.target.value)} />
        </div>

        <div className="finca-field">
            <label>Referencia Catastral</label>
            <input type="text" value={form.ref_catastral || ''} onChange={e => onChange('ref_catastral', e.target.value)} />
        </div>
        <div className="finca-field">
            <label>Utilización</label>
            <input type="text" value={form.utilizacion || ''} onChange={e => onChange('utilizacion', e.target.value)} />
        </div>

        <div className="finca-field">
            <label>Tipo de Finca</label>
            <select
                value={form.tipo_finca || ''}
                onChange={e => {
                    const idx = TIPOS_FINCA.indexOf(e.target.value);
                    onChange('tipo_finca', e.target.value);
                    onChange('tipo_finca_idx', idx >= 0 ? idx : null);
                }}
            >
                <option value="">— Seleccionar —</option>
                {TIPOS_FINCA.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
        <div className="finca-field">
            <label>Ubicación</label>
            <button className="finca-btn-secondary" type="button" onClick={onGoToMap} style={{ width: '100%', textAlign: 'left', justifyContent: 'flex-start', gap: '8px' }}>
                <i className="ri-map-pin-line" style={{ color: '#1a5fa8' }}></i>
                {form.latitud ? `${form.latitud}, ${form.longitud}` : 'Ver en mapa'}
            </button>
        </div>

        <div className="finca-field span2">
            <label>Titularidad</label>
            <div className="finca-radio-group">
                {TITULARIDADES.map(t => (
                    <label key={t}>
                        <input type="radio" name="titularidad_finca" value={t} checked={form.titularidad === t} onChange={() => onChange('titularidad', t)} />
                        {t}
                    </label>
                ))}
            </div>
        </div>

        <div className="finca-field span2">
            <div className="finca-grid-3">
                <div className="finca-field">
                    <label>Fecha de Adquisición</label>
                    <input type="date" value={form.f_adquisicion || ''} onChange={e => onChange('f_adquisicion', e.target.value)} />
                </div>
                <div className="finca-field">
                    <label>Fecha de Inscripción</label>
                    <input type="date" value={form.f_inscripcion || ''} onChange={e => onChange('f_inscripcion', e.target.value)} />
                </div>
                <div className="finca-field">
                    <label>Fecha de Baja</label>
                    <input type="date" value={form.f_baja || ''} onChange={e => onChange('f_baja', e.target.value)} />
                </div>
            </div>
        </div>

        <div className="finca-field span2">
            <label>Otros Datos</label>
            <textarea rows={4} value={form.otros_datos || ''} onChange={e => onChange('otros_datos', e.target.value)} />
        </div>
    </div>
);

/* ── COMPONENTE PRINCIPAL ──────────────────────────────────────── */
const FichaFinca = ({ finca, centros, onClose, onSave }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('general');
    const tipoFincaIdx = finca?.TipoFinca ?? finca?.tipo_finca_idx ?? null;
    const [form, setForm] = useState({
        finca_id:      finca?.Finca_id      ?? finca?.finca_id      ?? '',
        centro_id:     finca?.Centro_id     ?? finca?.centro_id     ?? '',
        mutua:         finca?.Mutua         ?? finca?.mutua         ?? '',
        coste:         finca?.Coste         ?? finca?.coste         ?? '',
        direccion:     finca?.Direccion     ?? finca?.direccion     ?? '',
        superficie:    finca?.Superficie    ?? finca?.superficie    ?? '',
        ref_catastral: finca?.Referencia_Catastral ?? finca?.ref_catastral ?? '',
        utilizacion:   finca?.Utilizacion   ?? finca?.utilizacion   ?? '',
        tipo_finca:    tipoFincaIdx != null ? (TIPOS_FINCA[tipoFincaIdx] ?? '') : '',
        tipo_finca_idx: tipoFincaIdx,
        titularidad:   finca?.Titularidad   ?? finca?.titularidad   ?? '',
        f_adquisicion: finca?.F_Alquiler    ? String(finca.F_Alquiler).substring(0, 10) : (finca?.f_adquisicion ?? ''),
        f_inscripcion: finca?.F_Inscripcion ? String(finca.F_Inscripcion).substring(0, 10) : (finca?.f_inscripcion ?? ''),
        f_baja:        finca?.F_Baja        ? String(finca.F_Baja).substring(0, 10) : (finca?.f_baja ?? ''),
        dir_google:    finca?.DireccionGoogle ?? finca?.dir_google  ?? '',
        latitud:       finca?.Latitud       ?? finca?.latitud       ?? '',
        longitud:      finca?.Longitud      ?? finca?.longitud      ?? '',
        otros_datos:   finca?.OtrosDatos    ?? finca?.otros_datos   ?? '',
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
        if (!form.centro_id) newErrors.centro_id = true;
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        onSave?.(form);
    };

    return (
        <div className="finca-container-inline" role="region" aria-label={`Ficha Finca ${form.finca_id}`}>
            <div className="finca-inline-content" ref={modalRef} tabIndex={-1}>
                <div className="finca-modal-header">
                    <span className="finca-modal-title">
                        <i className="ri-edit-box-line"></i> {t('Ficha Finca')} | {form.finca_id || t('Nueva')}
                    </span>
                    <div className="finca-header-btns">
                        <button className="finca-btn-primary" onClick={handleSave}>
                            <i className="ri-check-line"></i> {t('Aceptar')}
                        </button>
                        <button className="finca-btn-secondary" onClick={onClose}>
                            <i className="ri-close-line"></i> {t('Salir')}
                        </button>
                    </div>
                </div>

                <div className="finca-tabs">
                    <button className={`finca-tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
                    <button className={`finca-tab ${activeTab === 'costes' ? 'active' : ''}`} onClick={() => setActiveTab('costes')}>Costes</button>
                    <button className={`finca-tab ${activeTab === 'mapa' ? 'active' : ''}`} onClick={() => setActiveTab('mapa')}>Mapa / Ubicación</button>
                </div>

                <div className="finca-tab-content">
                    {activeTab === 'general' && (
                        <TabGeneral form={form} onChange={handleChange} errors={errors} centros={centros} onGoToMap={() => setActiveTab('mapa')} />
                    )}
                    {activeTab === 'costes' && <TabCostes fincaId={form.finca_id} />}
                    {activeTab === 'mapa' && <TabMapa form={form} onChange={handleChange} />}
                </div>
            </div>
        </div>
    );
};

export default FichaFinca;
