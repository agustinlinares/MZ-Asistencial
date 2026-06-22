// File: src/pages/admin/conciertos/FichaConcierto.jsx
import React, { useState, useEffect } from "react";
import notify from 'devextreme/ui/notify';
import { conciertosService } from "../../../services/admin/ConciertosService";
import AuthService from "../../../services/auth/AuthService";
import { useLogError } from '../../../hooks/useLogError';
import TabAmbitos from "./TabAmbitos";
import TabDocumentos from "./TabDocumentos";
import TabEspecialidades from "./TabEspecialidades";
import TabRegistrosICG from "./TabRegistrosICG";
import '../../../styles/FichaGlobal.css';

const parseDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) return dateStr.split('T')[0];
    return dateStr;
};

const FichaConcierto = ({ concierto, onClose, onSave }) => {
    const logError = useLogError("Ficha Concierto");
    const [activeTab, setActiveTab] = useState('general');

    const cambiarPestana = (nombrePestana) => {
        setActiveTab(nombrePestana);
    };
    
    // Lectura de sesión
    const getUsuarioSesion = () => {
        try {
            const raw = localStorage.getItem('UsuarioActual');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    const user = getUsuarioSesion();
    const perfilId = user?.perfilId || 0;
    
    // Reglas de negocio y permisos
    const esPerfil1o4 = perfilId === 1 || perfilId === 4; 
    const esPerfilMutuaBloqueada = perfilId === 2;
    const sesionMutuaId = user?.mutuaId || 0;
    const anioSesion = parseInt(localStorage.getItem("anioActivo") || new Date().getFullYear(), 10);

    const [form, setForm] = useState({
        conciertoId: concierto?.conciertoId || 0,
        mutuaId: esPerfilMutuaBloqueada ? sesionMutuaId : (concierto?.mutuaId || ''),
        centroId: concierto?.centroId || '',
        codigoCasa: concierto?.codigoCasa || '',
        codigoMz: concierto?.codigoMz || '', 
        centroAsociadoId: concierto?.centroAsociadoId || '', 
        adhesion: concierto?.adhesion || '', 
        tipoAsistenciaId: concierto?.tipoAsistenciaId || '',
        ambitoCobertura: concierto?.ambitoCobertura || '',
        muniambito: concierto?.muniambito || '',
        autorizado: concierto?.autorizado || false,
        fechaAutorizacion: parseDateForInput(concierto?.fechaAutorizacion),
        fechaSuscripcion: parseDateForInput(concierto?.fechaSuscripcion),
        fechaResolucion: parseDateForInput(concierto?.fechaResolucion),
        fechaVigencia: parseDateForInput(concierto?.fechaVigencia),
        fechaProrroga: parseDateForInput(concierto?.fechaProrroga)
    });

    const esNuevo = !form.conciertoId || form.conciertoId === 0;
    const [combos, setCombos] = useState({ mutuas: [], centros: [], centrosPropios: [], tiposAsistencia: [], centrosAdhesion: [] });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const cargarMaestros = async () => {
            try {
                const tiposAsistencia = await conciertosService.obtenerTiposAsistencia(anioSesion);
                const centrosAdhesion = await conciertosService.obtenerCentrosAdhesion(form.conciertoId);
                
                const mutuasRes = await fetch('/api/Mutuas', { headers: { 'Authorization': `Bearer ${AuthService.getToken()}` } });
                const mutuas = await mutuasRes.json();

                setCombos(prev => ({ ...prev, tiposAsistencia, centrosAdhesion, mutuas }));
            } catch (error) {
                logError("Fallo al cargar maestros base de conciertos", error);
            }
        };
        cargarMaestros();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anioSesion, logError]);

    useEffect(() => {
        if (!form.mutuaId) {
            setCombos(prev => ({ ...prev, centros: [], centrosPropios: [] }));
            return;
        }
        
        fetch(`/api/CentrosConcertados?mutuaId=${form.mutuaId}`, { headers: { 'Authorization': `Bearer ${AuthService.getToken()}` } })
            .then(r => r.ok ? r.json() : [])
            .then(data => setCombos(prev => ({ ...prev, centros: data })));

        fetch(`/api/Centros?mutuaId=${form.mutuaId}&propios=true`, { headers: { 'Authorization': `Bearer ${AuthService.getToken()}` } })
            .then(r => r.ok ? r.json() : [])
            .then(data => setCombos(prev => ({ ...prev, centrosPropios: data })));
            
    }, [form.mutuaId]);

    const handleChange = (field, value) => {
        setForm(prev => {
            const newForm = { ...prev, [field]: value };
            if (field === 'autorizado' && !value) {
                newForm.fechaAutorizacion = '';
            }
            return newForm;
        });
        setErrors(prev => ({ ...prev, [field]: false }));
    };

    const handleAdhesionChange = (adhesionId) => {
        handleChange('adhesion', adhesionId);
        if (adhesionId) {
            const conciertoSeleccionado = combos.centrosAdhesion.find(c => c.conciertoId.toString() === adhesionId.toString());
            if (conciertoSeleccionado && conciertoSeleccionado.codigoCasa) {
                handleChange('codigoCasa', conciertoSeleccionado.codigoCasa);
            }
        }
    };

    const handleSave = async () => {
        const newErrors = {};

        // 1. Validaciones obligatorias de campos vacíos
        if (!form.mutuaId) newErrors.mutuaId = true;
        if (!form.centroId) newErrors.centroId = true;
        if (!form.codigoCasa) newErrors.codigoCasa = true;
        if (!form.tipoAsistenciaId) newErrors.tipoAsistenciaId = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            notify("Faltan datos obligatorios. Revisa los campos en rojo.", "error", 3500);
            return;
        }

        // Parseo numérico
        const mutuaIdParsed = parseInt(form.mutuaId, 10);
        const centroIdParsed = parseInt(form.centroId, 10);
        const tipoAsistenciaParsed = parseInt(form.tipoAsistenciaId, 10);

        if (isNaN(mutuaIdParsed) || isNaN(centroIdParsed) || isNaN(tipoAsistenciaParsed)) {
            notify("Error interno: Uno de los desplegables no tiene un ID numérico válido.", "error", 4000);
            return;
        }

        try {
            const payload = {
                mutuaId: mutuaIdParsed,
                centroId: centroIdParsed,
                codigoCasa: form.codigoCasa,
                codigoMz: form.codigoMz || null, // <-- Aseguramos que el código actual viaje en el PUT
                centroAsociadoId: form.centroAsociadoId ? parseInt(form.centroAsociadoId, 10) : null,
                adhesion: form.adhesion ? parseInt(form.adhesion, 10) : null,
                tipoAsistenciaId: tipoAsistenciaParsed,
                ambitoCobertura: form.ambitoCobertura ? parseInt(form.ambitoCobertura, 10) : null,
                muniambito: form.muniambito || null,
                autorizado: form.autorizado, 
                // Fechas
                fechaAutorizacion: form.fechaAutorizacion || null,
                fechaSuscripcion: form.fechaSuscripcion || null,
                fechaResolucion: form.fechaResolucion || null,
                fechaVigencia: form.fechaVigencia || null,
                fechaProrroga: form.fechaProrroga || null
            };

            if (esNuevo) {
                const creado = await conciertosService.crear(payload);
                notify("Concierto creado correctamente.", "success", 3000);
                setForm(prev => ({ ...prev, conciertoId: creado.conciertoId, codigoMz: creado.codigoMz }));
            } else {
                payload.conciertoId = form.conciertoId;
                await conciertosService.actualizar(form.conciertoId, payload);
                notify("Concierto actualizado", "success", 2000);
                onSave?.();
            }
        } catch (error) {
            logError("Fallo al guardar el concierto", error);
            notify(`Error al guardar: ${error.message}`, "error", 4000);
        }
    };

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content">
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">
                        Concierto | {form.codigoMz ? `MZ: ${form.codigoMz}` : 'Nuevo Registro'}
                    </span>
                    <div className="ficha-header-btns">
                        {/* El botón Guardar solo se renderiza si es perfil administrador o gestor (1 o 4) */}
                        {esPerfil1o4 && <button className="ficha-btn-primary" onClick={handleSave}>Guardar</button>}
                        <button className="ficha-btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>

                <div className="ficha-tabs">
                    <button className={`ficha-tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => cambiarPestana('general', form.conciertoId)}>Datos Generales</button>
                    {!esNuevo && (
                        <>
                            <button className={`ficha-tab ${activeTab === 'ambitos' ? 'active' : ''}`} onClick={() => cambiarPestana('ambitos', form.conciertoId)}>Ámbitos de cobertura</button>
                            <button className={`ficha-tab ${activeTab === 'documentos' ? 'active' : ''}`} onClick={() => cambiarPestana('documentos', form.conciertoId)}>Documentos</button>
                            <button className={`ficha-tab ${activeTab === 'icg' ? 'active' : ''}`} onClick={() => cambiarPestana('icg', form.conciertoId)}>Registros ICG</button>
                            <button className={`ficha-tab ${activeTab === 'especialidades' ? 'active' : ''}`} onClick={() => cambiarPestana('especialidades', form.conciertoId)}>Especialidades</button>
                        </>
                    )}
                </div>

                <div className="ficha-tab-content">
                    {activeTab === 'general' && (
                        <div className="ficha-grid">
                            
                            <div className="ficha-field">
                                <label>Código MZ (Autogenerado)</label>
                                <input type="text" value={form.codigoMz} className="readonly" readOnly placeholder="Se genera automáticamente al guardar" />
                            </div>

                            <div className="ficha-field">
                                <label>Mutua *</label>
                                <select 
                                    className={errors.mutuaId ? 'error' : ''} 
                                    value={form.mutuaId} 
                                    onChange={e => { 
                                        handleChange('mutuaId', e.target.value); 
                                        handleChange('centroId', ''); 
                                        handleChange('centroAsociadoId', ''); 
                                    }}
                                    disabled={esPerfilMutuaBloqueada || !esPerfil1o4}
                                >
                                    <option value="">— Seleccionar Mutua —</option>
                                    {combos.mutuas.map((m, index) => {
                                        const idMutua = m.numeroId || m.NumeroId || m.mutuaId || m.MutuaId; 
                                        const nombreMutua = m.mutua || m.Mutua || m.nombre;
                                        return (
                                            <option key={`mutua-${index}`} value={idMutua}>
                                                {nombreMutua}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="ficha-field">
                                <label>Centro Concertado *</label>
                                <select 
                                    className={errors.centroId ? 'error' : ''} 
                                    value={form.centroId} 
                                    onChange={e => handleChange('centroId', e.target.value)} 
                                    disabled={!form.mutuaId || !esPerfil1o4}
                                >
                                    <option value="">{form.mutuaId ? '— Seleccione —' : '— Seleccione mutua primero —'}</option>
                                    {combos.centros.map((c, index) => {
                                        const idCentro = c.CentroId || c.centroId || c.centro_id || c.Id || c.id;
                                        const nombreCentro = c.Centro || c.centro || c.Nombre || c.nombre;
                                        return (
                                            <option key={`centro-${index}`} value={idCentro}>
                                                {nombreCentro} ({c.poblacion} - {c.provincia})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="ficha-field">
                                <label>Centro Asociado (Propio)</label>
                                <select 
                                    value={form.centroAsociadoId} 
                                    onChange={e => handleChange('centroAsociadoId', e.target.value)} 
                                    disabled={!form.mutuaId || !esPerfil1o4}
                                >
                                    <option value="">{form.mutuaId ? '— Sin Centro Asociado —' : '— Seleccione mutua primero —'}</option>
                                    {combos.centrosPropios.map((c, index) => {
                                        const idPropio = c.CentroId || c.centroId || c.centro_id || c.Id || c.id;
                                        const nombrePropio = c.Centro || c.centro || c.Nombre || c.nombre;
                                        return (
                                            <option key={`propio-${index}`} value={idPropio}>
                                                {nombrePropio}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="ficha-field">
                                <label>Adhesión a Concierto (Terminados en 000)</label>
                                <select 
                                    value={form.adhesion} 
                                    onChange={e => handleAdhesionChange(e.target.value)}
                                    disabled={!esPerfil1o4}
                                >
                                    <option value="">— Sin Adhesión —</option>
                                    {combos.centrosAdhesion.map((c, index) => (
                                        <option key={`adhesion-${index}`} value={c.conciertoId}>
                                            {c.codigoCasa} - {c.centroNombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="ficha-field">
                                <label>Código CASA *</label>
                                <input 
                                    className={errors.codigoCasa ? 'error' : ''} 
                                    type="text" 
                                    value={form.codigoCasa} 
                                    onChange={e => handleChange('codigoCasa', e.target.value)} 
                                    disabled={!esPerfil1o4}
                                />
                            </div>

                            <div className="ficha-field">
                                <label>Tipo de Concierto *</label>
                                <select 
                                    className={errors.tipoAsistenciaId ? 'error' : ''} 
                                    value={form.tipoAsistenciaId} 
                                    onChange={e => handleChange('tipoAsistenciaId', e.target.value)}
                                    disabled={!esPerfil1o4}
                                >
                                    <option value="">— Filtrado por Año ({anioSesion}) —</option>
                                    {combos.tiposAsistencia.map((t, index) => {
                                        const idTipo = t.TipoAsistenciaId || t.tipoAsistenciaId || t.Id || t.id;
                                        const descTipo = t.Descripcion || t.descripcion || t.Nombre || t.nombre || t.tipo;
                                        return (
                                            <option key={`tipo-${index}`} value={idTipo}>
                                                {descTipo}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="ficha-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="chkAutorizado"
                                    checked={form.autorizado}
                                    onChange={e => handleChange('autorizado', e.target.checked)}
                                    disabled={!esPerfil1o4} 
                                />
                                <label htmlFor="chkAutorizado" style={{ marginBottom: 0 }}>Concierto Autorizado</label>
                            </div>

                            <div className="ficha-field">
                                <label>Fecha Autorización</label>
                                <input
                                    type="date"
                                    value={form.fechaAutorizacion}
                                    onChange={e => handleChange('fechaAutorizacion', e.target.value)}
                                    disabled={!form.autorizado || !esPerfil1o4} 
                                />
                            </div>

                            <div className="ficha-field">
                                <label>Fecha Suscripción</label>
                                <input type="date" value={form.fechaSuscripcion} onChange={e => handleChange('fechaSuscripcion', e.target.value)} disabled={!esPerfil1o4} />
                            </div>
                            
                            <div className="ficha-field">
                                <label>Fecha Vigencia</label>
                                <input type="date" value={form.fechaVigencia} onChange={e => handleChange('fechaVigencia', e.target.value)} disabled={!esPerfil1o4} />
                            </div>
                            
                            <div className="ficha-field">
                                <label>Fecha Prórroga</label>
                                <input type="date" value={form.fechaProrroga} onChange={e => handleChange('fechaProrroga', e.target.value)} disabled={!esPerfil1o4} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'ambitos' && !esNuevo && <TabAmbitos conciertoId={form.conciertoId} />}
                    {activeTab === 'documentos' && !esNuevo && <TabDocumentos conciertoId={form.conciertoId} />}
                    {activeTab === 'icg' && !esNuevo && <TabRegistrosICG conciertoId={form.conciertoId} />}
                    {activeTab === 'especialidades' && !esNuevo && <TabEspecialidades conciertoId={form.conciertoId} />}
                </div>
            </div>
        </div>
    );
};

export default FichaConcierto;