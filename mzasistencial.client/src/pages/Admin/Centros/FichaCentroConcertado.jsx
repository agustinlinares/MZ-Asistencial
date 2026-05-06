import React, { useState, useEffect, useRef, useCallback } from "react";
import DataGrid, { Column, Scrolling } from "devextreme-react/data-grid";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../styles/FichaGlobal.css';
import AuthService from "../../../services/auth/AuthService";

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
const authHeaders = () => {
    const token = AuthService.getToken();
    return { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
};

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
const TabGeneral = ({ form, onChange, errors, onGoToMap, opts }) => (
    <div className="ficha-grid">
        <div className="ficha-field">
            <label>Proveedor</label>
            <select value={form.proveedor || ''} onChange={e => {
                onChange('proveedor', e.target.value);
                onChange('delegacion', ''); // Limpiamos la delegación al cambiar proveedor
            }}>
                <option value="">— Seleccionar —</option>
                {opts.proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
        </div>

        <div className="ficha-field">
            <label>Delegación</label>
            <select value={form.delegacion || ''} onChange={e => onChange('delegacion', e.target.value)} disabled={!form.proveedor}>
                <option value="">— Seleccionar —</option>
                {opts.delegaciones.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
        </div>
        <div className="ficha-field">
            <label>Centro</label>
            <input className={errors.centro ? 'error' : ''} type="text" value={form.centro || ''} onChange={e => onChange('centro', e.target.value)} />
        </div>

        <div className="ficha-field">
            <label>Provincia</label>
            <select value={form.provincia || ''} onChange={e => {
                onChange('provincia', e.target.value);
                onChange('poblacion', ''); 
            }}>
                <option value="">— Seleccionar —</option>
                {opts.provincias.map(p => (
                    // Usamos provinciaId y provincia en lugar de Id y Nombre
                    <option key={p.provinciaId} value={p.provinciaId}>
                        {p.provincia}
                    </option>
                ))}
            </select>
        </div>

        <div className="ficha-field">
            <label>Población</label>
            <select value={form.poblacion || ''} onChange={e => onChange('poblacion', e.target.value)} disabled={!form.provincia}>
                <option value="">— Seleccionar —</option>
                {opts.poblaciones.map(p => (
                    // Verifica si el JSON de poblaciones también usa poblacionId/poblacion
                    <option key={p.poblacionId} value={p.poblacionId}>
                        {p.poblacion}
                    </option>
                ))}
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
            <label>Fecha de alta</label>
            <input type="date" value={form.fecha_alta || ''} readOnly className="readonly" /> 
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
    const [mutuasAsignadas, setMutuasAsignadas] = useState([]);
    const [registrosICG, setRegistrosICG] = useState([]);
    
    // Función para convertir fechas de DD/MM/YYYY o ISO a YYYY-MM-DD
    const parseDateForInput = (dateStr) => {
        if (!dateStr) return '';
        // Si ya viene con la T de SQL (ej. 2024-01-01T00:00:00)
        if (dateStr.includes('T')) return dateStr.split('T')[0];
        // Si viene en formato español (ej. 1/1/2024 o 01/01/2024)
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            const dia = parts[0].padStart(2, '0');
            const mes = parts[1].padStart(2, '0');
            const ano = parts[2];
            return `${ano}-${mes}-${dia}`;
        }
        return dateStr;
    };
    console.log("Datos que llegan de la tabla:", cliente);

    const [form, setForm] = useState({
        centro_id: cliente?.CentroId ?? cliente?.centro_id ?? '',
        localizador: cliente?.Localizador ?? cliente?.ccn ?? '',
        centro: cliente?.Centro ?? cliente?.centro ?? '',
        direccion: cliente?.Direccion ?? cliente?.direccion ?? '',
        cif: cliente?.Cifnif ?? cliente?.Cif ?? cliente?.cif ?? '',
        cp: cliente?.Cp ?? cliente?.cp ?? '',
        
        proveedor: cliente?.ProveedorId ?? cliente?.proveedorId ?? '',
        delegacion: cliente?.DelegacionId ?? cliente?.delegacionId ?? '',
        provincia: cliente?.ProvinciaId ?? cliente?.provinciaId ?? '',
        poblacion: cliente?.PoblacionId ?? cliente?.poblacionId ?? '',
        
        fecha_alta: parseDateForInput(cliente?.FechaAlta ?? cliente?.fechaAlta),
        fecha_baja: parseDateForInput(cliente?.FechaBaja ?? cliente?.fechaBaja),
        
        numero: '', telefono: '', registro_sanitario: '', dir_google: '', 
        comentarios: '', motivo_baja: '', latitud: cliente?.Latitud ?? '', longitud: cliente?.Longitud ?? ''
    });

    const [datosMutuas, setDatosMutuas] = useState([]);

    const [opts, setOpts] = useState({ proveedores: [], delegaciones: [], provincias: [], poblaciones: [] });

    // Carga inicial de datos maestros (Provincias y Proveedores)
    useEffect(() => {
        const fetchMaestros = async () => {
            try {
                const headers = authHeaders();
                const resProv = await fetch('/api/AuxProvincias', { headers });
                const resProvdd = await fetch('/api/AuxProveedores', { headers }); 
                
                if (resProv.ok && resProvdd.ok) {
                    const provincias = await resProv.json();
                    const proveedores = await resProvdd.json();
                    setOpts(prev => ({ ...prev, provincias, proveedores }));
                }
            } catch (error) {
                console.error("Error cargando maestros:", error);
            }
        };
        fetchMaestros();
    }, []);

    // Carga en cascada de Poblaciones cuando cambia la Provincia
    useEffect(() => {
        if (!form.provincia) {
            setOpts(prev => ({ ...prev, poblaciones: [] }));
            return;
        }
        fetch(`/api/AuxPoblaciones/${form.provincia}`, { headers: authHeaders() })
            .then(r => r.ok ? r.json() : [])
            .then(data => setOpts(prev => ({ ...prev, poblaciones: data })));
    }, [form.provincia]);

    // Carga en cascada de Delegaciones cuando cambia el Proveedor
    useEffect(() => {
        if (!form.proveedor) {
            setOpts(prev => ({ ...prev, delegaciones: [] }));
            return;
        }
        fetch(`/api/AuxDelegaciones/PorProveedor/${form.proveedor}`, { headers: authHeaders() })
            .then(r => r.ok ? r.json() : [])
            .then(data => setOpts(prev => ({ ...prev, delegaciones: data })));
    }, [form.proveedor]);

    // Cargar Mutuas Asignadas
    const cargarMutuasAsignadas = async (id) => {
        try {
            // Usamos la URL con M mayúscula del equipo para evitar el 404
            const response = await fetch(`/api/CentrosConcertados/${id}/Mutuas`, { 
                headers: authHeaders() 
            });
            if (response.ok) {
                const data = await response.json();
                setMutuasAsignadas(data);
            } else {
                console.error("Error al cargar mutuas asignadas");
            }
        } catch (error) {
            console.error("Error de red al cargar mutuas:", error);
        }
    };

    // Cargar Registros ICG 
    const cargarRegistrosICG = async (id) => {
        try {
            const response = await fetch(`/api/RegistroICG/Concertado/${id}`, { 
                headers: authHeaders() 
            });
            if (response.ok) {
                const data = await response.json();
                setRegistrosICG(data);
            } else {
                console.error("Error al cargar registros ICG");
            }
        } catch (error) {
            console.error("Error de red al cargar ICG:", error);
        }
    };

    useEffect(() => {
        // Solo cargamos si el ID es válido y no es un centro nuevo (0)
        if (form.centro_id && form.centro_id !== 0) {
            cargarMutuasAsignadas(form.centro_id);
            cargarRegistrosICG(form.centro_id);
        }
    }, [form.centro_id]);

    // Carga de las Mutuas Asignadas al abrir el modal
    useEffect(() => {
        // Si estamos creando un centro nuevo, no hacemos la petición
        if (!form.centro_id || form.centro_id === 0) {
            setDatosMutuas([]);
            return;
        }

        const fetchMutuasAsignadas = async () => {
            try {
                const response = await fetch(`/api/CentrosConcertados/${form.centro_id}/Mutuas`, {
                    headers: authHeaders()
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setDatosMutuas(data);
                } else {
                    console.error("Error en la respuesta del servidor al cargar mutuas");
                }
            } catch (error) {
                console.error("Error de red cargando mutuas:", error);
            }
        };

        fetchMutuasAsignadas();
    }, [form.centro_id]); // Se ejecuta cuando el ID del centro cambia

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

    const handleSave = async () => {
        const newErrors = {};
        if (!form.centro) newErrors.centro = true;
        
        if (Object.keys(newErrors).length > 0) { 
            setErrors(newErrors); 
            return; 
        }

        // Construimos el objeto exacto que espera el CentrosConcertadoDTO de C#
        const payload = {
            // C# espera un int. Si es nuevo (""), le pasamos 0. Si editamos, lo parseamos.
            centro_id: form.centro_id ? parseInt(form.centro_id) : 0, 
            
            // Textos básicos. React usa 'localizador', el DTO espera 'ccn'
            ccn: form.localizador, 
            cif: form.cif,
            centro: form.centro,
            direccion: form.direccion,
            cp: form.cp,
            
            // Los IDs deben llamarse igual que en el DTO y ser números enteros (o null)
            provinciaId: form.provincia ? parseInt(form.provincia) : null,
            poblacionId: form.poblacion ? parseInt(form.poblacion) : null,
            proveedorId: form.proveedor ? parseInt(form.proveedor) : null,
            delegacionId: form.delegacion ? parseInt(form.delegacion) : null,
            
            telefono: form.telefono,
            fechaAlta: form.fecha_alta || null,
            fechaBaja: form.fecha_baja || null,
            latitud: form.latitud,
            longitud: form.longitud
        };

        try {
            const url = payload.centro_id > 0
                ? `/api/CentrosConcertados/${payload.centro_id}` // Actualizar
                : '/api/CentrosConcertados';                     // Crear nuevo
            
            const method = payload.centro_id > 0 ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    ...authHeaders(),
                    'Content-Type': 'application/json'
                },
                // Enviamos nuestro objeto limpio, no el form crudo
                body: JSON.stringify(payload) 
            });

            if (!response.ok) {
                // Capturamos el error real del backend si falla
                const errorText = await response.text();
                throw new Error(errorText); 
            }

            // Si todo va bien, cerramos la ficha y recargamos la tabla
            onSave?.(payload); 

        } catch (error) {
            console.error("Error al guardar en BD:", error);
            alert("Hubo un problema al guardar los datos en el servidor. Revisa la consola.");
        }
    };

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content" ref={modalRef} tabIndex={-1}>
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">
                        🏥 Ficha Centro Concertado | {form.centro || form.localizador || 'Nuevo'}
                    </span>
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
                    {activeTab === 'general' && <TabGeneral form={form} onChange={handleChange} errors={errors} onGoToMap={() => setActiveTab('mapa')} opts={opts} />}
                    
                    {activeTab === 'registroICG' && (
                        <TabDataGrid datos={registrosICG}>
                            <Column dataField="ano" caption="Año" width={100} />
                            <Column dataField="mutua" caption="Mutua" />
                            <Column dataField="centro" caption="Centro" />
                            <Column dataField="fechaModificacion" caption="Fecha Act." dataType="date" width={150} />
                            <Column dataField="usuarioModificacionId" caption="ID Usuario" width={150} />
                        </TabDataGrid>
                    )}

                    {activeTab === 'mutuasAsignadas' && (
                        <TabDataGrid datos={mutuasAsignadas}>
                            <Column dataField="mutua" caption="Mutua" />
                            
                            <Column dataField="codigoCasa" caption="Cód. CASA" width={150} />
                            <Column dataField="localizador" caption="Localizador" width={150} />
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