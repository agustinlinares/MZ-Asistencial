import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataGrid, { Column, FilterRow, HeaderFilter, Pager, Paging, Export, Scrolling, Sorting } from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";

import '../../../styles/FichaGlobal.css';

const VIAS         = ["AVENIDA","CALLE","PLAZA","PASEO","CARRETERA","CAMINO","RONDA"];
const SERVICIOS_ESP = ["Servicios Centrales","Servicios Especiales","Ninguno"];
const ESPECIALIDADES_LIST = ["Medicina General","Traumatologia","Rehabilitacion","Fisioterapia","Psicologia","Enfermeria","Radiologia","Cirugia","Cardiologia","Neurologia","Dermatologia","Oftalmologia","Urgencias","Pediatria"];
const ANOS         = ["2020","2021","2022","2023","2024","2025","2026"];
const MESES        = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

const TABS = [
    { key: "general",           label: "General" },
    { key: "datosUtilizacion",  label: "Datos Utilización" },
    { key: "registroICG",       label: "Registro ICG" },
    { key: "fincasRegistrales", label: "Fincas Registrales" },
    { key: "especialidades",    label: "Especialidades / Serv. Disponibles" },
    { key: "catalogo",          label: "Catálogo completo de servicios" },
];

const onExportingGrid = (e, filename) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Datos");
    exportDataGrid({ component: e.component, worksheet, autoFilterEnabled: true }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), filename + ".xlsx");
        });
    });
    e.cancel = true;
};

const thS = (align, width) => ({
    padding: '8px 6px', textAlign: align, width, minWidth: width,
    fontWeight: 700, fontSize: 11, borderRight: '1px solid rgba(255,255,255,0.2)',
});
const tdS = (align) => ({
    padding: '6px', textAlign: align, borderBottom: '1px solid #eee',
    borderRight: '1px solid #f0f0f0',
});

const FichaCentroPropio = ({ cliente, onClose, onSave }) => {
    const { t }    = useTranslation();
    const navigate = useNavigate();
    const modalRef = useRef(null);

    // ── Perfil del usuario actual ─────────────────────────────────────────────
    const user    = JSON.parse(localStorage.getItem('UsuarioActual') || '{}');
    const esAdmin = user?.perfilId === 1;

    const [MUTUOS,      setMUTUOS]      = useState([]);
    const [PROVINCIAS,  setProvincias]  = useState([]);
    const [POBLACIONES, setPoblaciones] = useState([]);
    const [form,        setForm]        = useState({});
    const [registrosICG, setRegistrosICG] = useState([]);
    const [tabActiva,   setTabActiva]   = useState("general");
    const [guardando,   setGuardando]   = useState(false);
    const [fincas,      setFincas]      = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [catalogo,    setCatalogo]    = useState([]);
    const [anioEsp,     setAnioEsp]     = useState(null);
    const [anioCat,     setAnioCat]     = useState(null); // ── Estado independiente para Catálogo
    const [bloqueado,   setBloqueado]   = useState(false);
    const [editandoEsp,  setEditandoEsp]  = useState({});
    const [guardandoEsp, setGuardandoEsp] = useState(false);
    const [msgEsp,       setMsgEsp]       = useState(null);

    useEffect(() => {
        modalRef.current?.focus();
        const handler = e => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    const clienteRef = useRef(cliente);
    useEffect(() => { if (cliente) clienteRef.current = cliente; }, [cliente]);

    useEffect(() => {
        fetch("/api/mutuas").then(r => r.ok ? r.json() : []).then(setMUTUOS).catch(() => setMUTUOS([]));
    }, []);

    useEffect(() => {
        fetch("/api/auxprovincias").then(r => r.ok ? r.json() : []).then(setProvincias).catch(() => setProvincias([]));
    }, []);

    useEffect(() => {
        if (form.ProvinciaId) {
            fetch(`/api/auxpoblaciones/${form.ProvinciaId}`).then(r => r.ok ? r.json() : []).then(setPoblaciones).catch(() => setPoblaciones([]));
        } else {
            setPoblaciones([]);
        }
    }, [form.ProvinciaId]);

    useEffect(() => {
        if (!cliente) { onClose(); return; }
        const centroId = cliente.centroId || cliente.CentroId;
        fetch(`/api/CentrosPropios/${centroId}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                const c = data || cliente;
                setForm({
                    Localizador:             c.localizador            || c.Localizador            || "",
                    TipoCentro:              c.tipoCentro             || c.TipoCentro             || "",
                    CentroId:                c.centroId               || c.CentroId               || "",
                    Centro:                  c.centro                 || c.Centro                 || "",
                    Mutua:                   c.mutuaId                || c.Mutua                  || "",
                    ProvinciaId:             c.provinciaId            || c.ProvinciaId            || "",
                    PoblacionId:             c.poblacionId            || c.PoblacionId            || "",
                    Cp:                      c.cp                     || c.Cp                     || "",
                    ViaPublica:              c.ViaPublica             || "AVENIDA",
                    Direccion:               c.direccion              || c.Direccion              || "",
                    Numero:                  c.numero                 || c.Numero                 || "",
                    Piso:                    c.piso                   || c.Piso                   || "",
                    Puerta:                  c.puerta                 || c.Puerta                 || "",
                    ServiciosEspeciales:     c.serviciosEspeciales    || c.ServiciosEspeciales    || "",
                    Telefono:                c.telefono               || c.Telefono               || "",
                    DireccionGoogle:         c.direccionGoogle        || c.DireccionGoogle        || "",
                    VerificarDireccionGoogle: c.VerificarDireccionGoogle || "",
                    Latitud:                 c.latitud                || c.Latitud                || "",
                    Longitud:               c.longitud               || c.Longitud               || "",
                    Email:                   c.email                  || c.Email                  || "",
                    PersonaContacto:         c.personaContacto        || c.PersonaContacto        || "",
                    OtrosDatos:              c.otrosDatos             || c.OtrosDatos             || "",
                    Autorizacion:            c.Autorizacion           || "",
                    PuestaFuncionamiento:    c.PuestaFuncionamiento   || "",
                    Calificacion:            c.Calificacion           || "",
                    CentroInicial:           c.CentroInicial          || "",
                    TipoCentroRadio:         c.TipoCentroRadio        || "hospitalarios",
                    ActividadHospitalaria:   c.asistenciaHospitalaria ?? c.ActividadHospitalaria  ?? false,
                    ActividadAmbulatoria:    c.asistenciaAmbulatoria  ?? c.ActividadAmbulatoria   ?? false,
                    ActividadRehabilitacion: c.rehabilitacion         ?? c.ActividadRehabilitacion ?? false,
                    ActividadControlIT:      c.incapacidadTransitoria ?? c.ActividadControlIT     ?? false,
                    ActividadPrevencion:     c.prevencion             ?? c.ActividadPrevencion     ?? false,
                    ActividadOtras:          c.otrasActividades       ?? c.ActividadOtras         ?? false,
                    ActividadAdmon:          c.administracion         ?? c.ActividadAdmon         ?? false,
                    MotivoBaja:              c.motivoBaja             || c.MotivoBaja             || "",
                    FechaBaja:               c.fechaBaja              || c.FechaBaja              || "",
                    Traslado:                c.traslado               ?? c.Traslado               ?? false,
                    CentroDesactivado:       c.desactivado            ?? c.CentroDesactivado      ?? false,
                    NuevoCentro:             c.NuevoCentro            || "",
                    MapaValidado:            c.mapaValidado           ?? c.MapaValidado           ?? false,
                });
            })
            .catch(() => { /* silently handled */ });
    }, [cliente, onClose]);

    // ── Autocalcular Tipo de Centro según actividades ─────────────────────────
    useEffect(() => {
        if (Object.keys(form).length === 0) return;
        const esHospitalario = form.ActividadHospitalaria || form.ActividadAmbulatoria || form.ActividadRehabilitacion;
        setForm(f => ({ ...f, TipoCentroRadio: esHospitalario ? "hospitalarios" : "noSanitario" }));
    }, [form.ActividadHospitalaria, form.ActividadAmbulatoria, form.ActividadRehabilitacion]); // eslint-disable-line

    // ── Leer coordenadas al volver de MapaPage ────────────────────────────────
    useEffect(() => {
        const leerMapaRetorno = () => {
            const mapaData = sessionStorage.getItem('mapaRetorno');
            if (mapaData) {
                try {
                    const { latitud, longitud, direccion, mapaValidado } = JSON.parse(mapaData);
                    sessionStorage.removeItem('mapaRetorno');
                    setForm(f => ({
                        ...f,
                        Latitud:         latitud   || f.Latitud,
                        Longitud:        longitud  || f.Longitud,
                        DireccionGoogle: direccion || f.DireccionGoogle,
                        MapaValidado:    mapaValidado === true ? true : f.MapaValidado,
                    }));
                } catch { /* silently handled */ }
            }
        };
        leerMapaRetorno();
        window.addEventListener('focus', leerMapaRetorno);
        return () => window.removeEventListener('focus', leerMapaRetorno);
    }, []);

    useEffect(() => {
        if (form.CentroId) {
            fetch(`/api/RegistroICG/${form.CentroId}`)
                .then(res => res.json()).then(setRegistrosICG).catch(() => setRegistrosICG([]));
        }
    }, [form.CentroId]);

    useEffect(() => {
        fetch('/api/CentrosPropiosEspecialidades/bloqueo')
            .then(r => r.ok ? r.json() : { bloqueado: false })
            .then(d => setBloqueado(d.bloqueado))
            .catch(() => setBloqueado(false));
    }, []);

    const cargarEspecialidades = () => {
        if (!form.CentroId || !anioEsp) return;
        fetch(`/api/CentrosPropiosEspecialidades?centroId=${form.CentroId}&anio=${anioEsp}`)
            .then(r => r.ok ? r.json() : []).then(d => { setEspecialidades(d); setEditandoEsp({}); }).catch(() => setEspecialidades([]));
    };

    // ── Catálogo: carga independiente con anioCat ─────────────────────────────
    const cargarCatalogo = () => {
        if (!form.CentroId || !anioCat) return;
        fetch(`/api/CentrosPropiosEspecialidades/catalogo?centroId=${form.CentroId}&anio=${anioCat}`)
            .then(r => r.ok ? r.json() : []).then(setCatalogo).catch(() => setCatalogo([]));
    };

    useEffect(() => { cargarEspecialidades(); }, [form.CentroId, anioEsp]); // eslint-disable-line
    useEffect(() => { cargarCatalogo(); }, [form.CentroId, anioCat]); // eslint-disable-line

    useEffect(() => {
        if (form.CentroId) {
            fetch(`/api/FincasRegistrales?centroId=${form.CentroId}&anio=${anioEsp || new Date().getFullYear()}`)
                .then(res => res.json()).then(setFincas).catch(() => setFincas([]));
        }
    }, [form.CentroId, anioEsp]);

    useEffect(() => {
        if (!form.CentroId && form.Mutua) {
            fetch(`/api/CentrosPropios/siguiente-localizador/${form.Mutua}`)
                .then(r => r.ok ? r.text() : null)
                .then(loc => { if (loc) setForm(f => ({ ...f, Localizador: loc.replace(/"/g, '') })); })
                .catch(() => { /* silently handled */ });
        }
    }, [form.Mutua, form.CentroId]);

    const set = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm(f => ({ ...f, [key]: val }));
    };

    const handleProvinciaChange = (e) => {
        setForm(f => ({ ...f, ProvinciaId: e.target.value, PoblacionId: "" }));
    };

    const handleGuardar = async () => {
        setGuardando(true);
        try {
            const dataToSave = {
                centroId:               form.CentroId,
                localizador:            form.Localizador,
                mutuaId:                parseInt(form.Mutua) || 0,
                centro:                 form.Centro,
                cp:                     form.Cp,
                poblacionId:            parseInt(form.PoblacionId) || 0,
                telefono:               form.Telefono,
                latitud:                form.Latitud,
                longitud:               form.Longitud,
                direccion:              form.Direccion,
                numero:                 form.Numero,
                piso:                   form.Piso,
                puerta:                 form.Puerta,
                direccionGoogle:        form.DireccionGoogle,
                email:                  form.Email,
                personaContacto:        form.PersonaContacto,
                otrosDatos:             form.OtrosDatos,
                desactivado:            form.CentroDesactivado,
                traslado:               form.Traslado,
                motivoBaja:             form.MotivoBaja,
                fechaBaja:              form.FechaBaja || null,
                asistenciaHospitalaria: form.ActividadHospitalaria,
                asistenciaAmbulatoria:  form.ActividadAmbulatoria,
                rehabilitacion:         form.ActividadRehabilitacion,
                incapacidadTransitoria: form.ActividadControlIT,
                prevencion:             form.ActividadPrevencion,
                otrasActividades:       form.ActividadOtras,
                administracion:         form.ActividadAdmon,
                tipoCentro:             form.TipoCentroRadio === "hospitalarios" ? 0 : 1,
                fautocom:               form.Autorizacion || null,
                fpufuncio:              form.PuestaFuncionamiento || null,
                fcalisuf:               form.Calificacion || null,
                mapaValidado:           form.MapaValidado ?? false,
                usuarioId:              JSON.parse(localStorage.getItem('UsuarioActual') || '{}')?.usuarioId ?? null,
            };
            onSave(dataToSave);
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setGuardando(false);
        }
    };

    const handleActualizarDisponibilidad = async () => {
        const ids = Object.keys(editandoEsp);
        if (ids.length === 0) return;
        setGuardandoEsp(true);
        setMsgEsp(null);
        try {
            const user = JSON.parse(localStorage.getItem('UsuarioActual') || '{}');
            for (const id of ids) {
                const meses = editandoEsp[id];
                const res = await fetch(`/api/CentrosPropiosEspecialidades/${id}/disponibilidad`, {
                    method:  'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ ...meses, usuarioId: user?.usuarioId ?? null }),
                });
                if (!res.ok) throw new Error(`Error al guardar fila ${id}`);
            }
            setMsgEsp({ ok: true, text: 'Disponibilidad actualizada correctamente.' });
            cargarEspecialidades();
        } catch (err) {
            setMsgEsp({ ok: false, text: err.message || 'Error al guardar.' });
        } finally {
            setGuardandoEsp(false);
            setTimeout(() => setMsgEsp(null), 4000);
        }
    };

    if (!cliente) return null;

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content" ref={modalRef} tabIndex={-1}>

                {/* HEADER */}
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">
                        <i className="ri-edit-box-line"></i> {t('Ficha Centro Propio')} | {form.Localizador || t('Nuevo')} | {form.Centro}
                    </span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={handleGuardar} disabled={guardando}>
                            <i className="ri-check-line" /> {guardando ? t("Guardando...") : t("Aceptar")}
                        </button>
                        <button className="ficha-btn-secondary" onClick={onClose}>
                            <i className="ri-close-line" /> {t('Salir')}
                        </button>
                    </div>
                </div>

                {/* PESTAÑAS */}
                <div className="ficha-tabs">
                    {TABS.map(({ key, label }) => (
                        <button key={key} className={"ficha-tab" + (tabActiva === key ? " active" : "")} onClick={() => setTabActiva(key)}>
                            {t(label)}
                        </button>
                    ))}
                </div>

                {/* CONTENIDO */}
                <div className="ficha-tab-content">

                    {/* GENERAL */}
                    {tabActiva === "general" && (
                        <div className="ficha-grid">
                            <div className="ficha-field"><label>Localizador</label><input type="text" value={form.Localizador || ""} onChange={set("Localizador")} /></div>
                            <div className="ficha-field"><label>Tipo de Centro</label><input type="text" value={form.TipoCentro || ""} readOnly className="readonly" /></div>
                            <div className="ficha-field"><label>Centro ID</label><input type="text" value={form.CentroId || ""} readOnly className="readonly" /></div>
                            <div className="ficha-field span2"><label>Centro</label><input type="text" value={form.Centro || ""} onChange={set("Centro")} /></div>
                            <div className="ficha-field">
                                <label>Mutua</label>
                                <select value={form.Mutua || ""} onChange={set("Mutua")}>
                                    <option value="">— Seleccionar —</option>
                                    {MUTUOS.map(m => <option key={m.numeroId} value={m.numeroId}>{m.numeroId} - {m.mutua}</option>)}
                                </select>
                            </div>
                            <div className="ficha-field">
                                <label>Provincia</label>
                                <select value={form.ProvinciaId || ""} onChange={handleProvinciaChange}>
                                    <option value="">— Seleccionar —</option>
                                    {PROVINCIAS.map(p => <option key={p.provinciaId} value={p.provinciaId}>{p.provincia}</option>)}
                                </select>
                            </div>
                            <div className="ficha-field">
                                <label>Población</label>
                                <select value={form.PoblacionId || ""} onChange={set("PoblacionId")} disabled={!form.ProvinciaId}>
                                    <option value="">— Seleccionar —</option>
                                    {POBLACIONES.map(p => <option key={p.poblacionId} value={p.poblacionId}>{p.poblacion}</option>)}
                                </select>
                            </div>
                            <div className="ficha-field"><label>Código Postal</label><input type="text" value={form.Cp || ""} onChange={set("Cp")} /></div>
                            <div className="ficha-field">
                                <label>Vía Pública</label>
                                <select value={form.ViaPublica || ""} onChange={set("ViaPublica")}>
                                    {VIAS.map(v => <option key={v}>{v}</option>)}
                                </select>
                            </div>
                            <div className="ficha-field span2"><label>Dirección</label><input type="text" value={form.Direccion || ""} onChange={set("Direccion")} /></div>
                            <div className="ficha-field"><label>Número</label><input type="text" value={form.Numero || ""} onChange={set("Numero")} /></div>
                            <div className="ficha-field"><label>Piso</label><input type="text" value={form.Piso || ""} onChange={set("Piso")} /></div>
                            <div className="ficha-field"><label>Puerta</label><input type="text" value={form.Puerta || ""} onChange={set("Puerta")} /></div>
                            <div className="ficha-field">
                                <label>Servicios Especiales</label>
                                <select value={form.ServiciosEspeciales || ""} onChange={set("ServiciosEspeciales")}>
                                    <option value="">— Seleccionar —</option>
                                    {SERVICIOS_ESP.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="ficha-field"><label>Teléfono</label><input type="text" value={form.Telefono || ""} onChange={set("Telefono")} /></div>
                            <div className="ficha-field span2"><label>Dirección Google</label><input type="text" value={form.DireccionGoogle || ""} onChange={set("DireccionGoogle")} /></div>
                            <div className="ficha-field span2">
                                <label>Verificar Dirección Google</label>
                                <div className="ficha-input-suffix">
                                    <input type="text" value={form.VerificarDireccionGoogle || ""} onChange={set("VerificarDireccionGoogle")} />
                                    <button className="finca-btn-secondary" title="Abrir mapa" style={{ padding: '0 10px' }}
                                        onClick={() => navigate('/admin/Centros/MapaPage', { state: { centroId: form.CentroId, latitud: form.Latitud, longitud: form.Longitud, direccion: form.DireccionGoogle } })}>
                                        <i className="ri-map-pin-line"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="ficha-field">
                                <label>Coordenadas GPS</label>
                                <input type="text" readOnly className="readonly"
                                    value={form.Latitud && form.Longitud ? `${form.Latitud}, ${form.Longitud}` : ""}
                                    placeholder="Sin coordenadas"
                                    style={{ color: form.MapaValidado ? '#2e7d32' : '#888' }}
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Mapa validado</label>
                                <input type="text" readOnly className="readonly"
                                    value={form.MapaValidado ? '✓ Validado' : '✗ No validado'}
                                    style={{ color: form.MapaValidado ? '#2e7d32' : '#c62828', fontWeight: 600 }}
                                />
                            </div>
                            <div className="ficha-field"><label>Dirección Electrónica</label><input type="email" value={form.Email || ""} onChange={set("Email")} /></div>
                            <div className="ficha-field"><label>Persona de Contacto</label><input type="text" value={form.PersonaContacto || ""} onChange={set("PersonaContacto")} /></div>
                            <div className="ficha-field"><label>Otros Datos</label><input type="text" value={form.OtrosDatos || ""} onChange={set("OtrosDatos")} /></div>
                            <div className="ficha-field"><label>Autorización / Comunicación</label><input type="date" value={form.Autorizacion || ""} onChange={set("Autorizacion")} /></div>
                            <div className="ficha-field"><label>Puesta en Funcionamiento</label><input type="date" value={form.PuestaFuncionamiento || ""} onChange={set("PuestaFuncionamiento")} /></div>
                            <div className="ficha-field"><label>Calificación de Suficiencia</label><input type="date" value={form.Calificacion || ""} onChange={set("Calificacion")} /></div>
                            <div className="ficha-field"><label>Centro Inicial</label><input type="date" value={form.CentroInicial || ""} onChange={set("CentroInicial")} /></div>
                        </div>
                    )}

                    {/* DATOS UTILIZACIÓN */}
                    {tabActiva === "datosUtilizacion" && (
                        <div className="ficha-tab-inner">
                            <div className="ficha-section">
                                <p className="ficha-section-title"><i className="ri-building-line"></i> {t('Tipo de Centro')}</p>
                                <div className="ficha-radio-group">
                                    <label style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                                        <input type="radio" name="tipoCentro" value="noSanitario"
                                            checked={form.TipoCentroRadio === "noSanitario"}
                                            onChange={() => {}} disabled
                                        />
                                        {t('Centro NO Sanitario')}
                                    </label>
                                    <label style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                                        <input type="radio" name="tipoCentro" value="hospitalarios"
                                            checked={form.TipoCentroRadio === "hospitalarios"}
                                            onChange={() => {}} disabled
                                        />
                                        {t('Hospitales y Ambulatorios')}
                                    </label>
                                </div>
                                <p style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
                                    <i className="ri-information-line"></i> {t('El tipo de centro se calcula automáticamente según las actividades seleccionadas.')}
                                </p>
                            </div>
                            <div className="ficha-section">
                                <p className="ficha-section-title"><i className="ri-list-check-2"></i> {t('Actividades del Centro')}</p>
                                <p className="ficha-section-sub">{t('Selecciona las actividades que se realizan en este centro:')}</p>
                                <div className="ficha-checkbox-grid">
                                    <label style={{ opacity: esAdmin ? 1 : 0.6, cursor: esAdmin ? 'pointer' : 'not-allowed' }}>
                                        <input type="checkbox" checked={form.ActividadHospitalaria || false} onChange={set("ActividadHospitalaria")} disabled={!esAdmin} />
                                        {t('Asistencia sanitaria Hospitalaria')}
                                    </label>
                                    <label style={{ opacity: esAdmin ? 1 : 0.6, cursor: esAdmin ? 'pointer' : 'not-allowed' }}>
                                        <input type="checkbox" checked={form.ActividadAmbulatoria || false} onChange={set("ActividadAmbulatoria")} disabled={!esAdmin} />
                                        {t('Asistencia sanitaria ambulatoria')}
                                    </label>
                                    <label style={{ opacity: esAdmin ? 1 : 0.6, cursor: esAdmin ? 'pointer' : 'not-allowed' }}>
                                        <input type="checkbox" checked={form.ActividadRehabilitacion || false} onChange={set("ActividadRehabilitacion")} disabled={!esAdmin} />
                                        {t('Solamente rehabilitación')}
                                    </label>
                                    <label style={{ opacity: esAdmin ? 1 : 0.6, cursor: esAdmin ? 'pointer' : 'not-allowed' }}>
                                        <input type="checkbox" checked={form.ActividadControlIT || false} onChange={set("ActividadControlIT")} disabled={!esAdmin} />
                                        {t('Control administrativo de IT')}
                                    </label>
                                    <label style={{ opacity: esAdmin ? 1 : 0.6, cursor: esAdmin ? 'pointer' : 'not-allowed' }}>
                                        <input type="checkbox" checked={form.ActividadPrevencion || false} onChange={set("ActividadPrevencion")} disabled={!esAdmin} />
                                        {t('Prevención R.L seguridad social')}
                                    </label>
                                    <label style={{ opacity: esAdmin ? 1 : 0.6, cursor: esAdmin ? 'pointer' : 'not-allowed' }}>
                                        <input type="checkbox" checked={form.ActividadOtras || false} onChange={set("ActividadOtras")} disabled={!esAdmin} />
                                        {t('Otras Actividades')}
                                    </label>
                                    <label className="span2" style={{ opacity: esAdmin ? 1 : 0.6, cursor: esAdmin ? 'pointer' : 'not-allowed' }}>
                                        <input type="checkbox" checked={form.ActividadAdmon || false} onChange={set("ActividadAdmon")} disabled={!esAdmin} />
                                        {t('Administración general de la Mutua')}
                                    </label>
                                </div>
                                {!esAdmin && (
                                    <p style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
                                        <i className="ri-lock-line"></i> {t('Las actividades solo pueden ser modificadas por un administrador.')}
                                    </p>
                                )}
                            </div>
                            <div className="ficha-section">
                                <p className="ficha-section-title"><i className="ri-close-circle-line"></i> {t('Estado y Baja')}</p>
                                <div className="ficha-grid ficha-grid-3" style={{ marginBottom: 15 }}>
                                    <div className="ficha-field">
                                        <label>{t('Centro Desactivado')}</label>
                                        <label style={{ marginTop: 8 }}><input type="checkbox" checked={form.CentroDesactivado || false} onChange={set("CentroDesactivado")} /> {t('Sí, desactivar')}</label>
                                    </div>
                                    <div className="ficha-field">
                                        <label>{t('Fecha de Baja')}</label>
                                        <input type="date" value={form.FechaBaja || ""} onChange={set("FechaBaja")} disabled={!form.CentroDesactivado} style={{ opacity: !form.CentroDesactivado ? 0.4 : 1 }} />
                                    </div>
                                    <div className="ficha-field">
                                        <label>{t('Traslado')}</label>
                                        <label style={{ marginTop: 8 }}><input type="checkbox" checked={form.Traslado || false} onChange={set("Traslado")} /> {t('Es un traslado')}</label>
                                    </div>
                                </div>
                                <div className="ficha-field" style={{ marginBottom: 15 }}>
                                    <label>{t('Motivo de la Baja')}</label>
                                    <textarea className="ficha-textarea" value={form.MotivoBaja || ""} onChange={e => setForm(f => ({ ...f, MotivoBaja: e.target.value }))} rows={3} placeholder={t('Explique el motivo de la baja del centro...')} />
                                </div>
                                {form.Traslado && (
                                    <div className="ficha-field animate-fade-in">
                                        <label>{t('Nuevo Centro (Destino del traslado)')}</label>
                                        <input type="text" value={form.NuevoCentro || ""} onChange={set("NuevoCentro")} placeholder={t('Indique el centro al que se ha trasladado la actividad...')} className="ficha-input-full" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* REGISTRO ICG */}
                    {tabActiva === "registroICG" && (
                        <div className="ficha-tab-inner" style={{ width: '100%', boxSizing: 'border-box' }}>
                            <DataGrid
                                dataSource={registrosICG}
                                showBorders
                                rowAlternationEnabled
                                noDataText="Sin datos para mostrar"
                                onExporting={e => onExportingGrid(e, "RegistroICG")}
                                className="mz-table"
                                width="100%"
                                height="auto"
                            >
                                <Scrolling mode="standard" />
                                <Paging defaultPageSize={10} />
                                <Pager visible showInfo showNavigationButtons displayMode="full" allowedPageSizes={[10, 20, 50]} showPageSizeSelector />
                                <FilterRow visible /><HeaderFilter visible /><Sorting mode="multiple" /><Export enabled />
                                <Column dataField="ano"                   caption="Año"                 width={80} />
                                <Column dataField="mutua"                 caption="Mutua"               minWidth={220} />
                                <Column dataField="centro"                caption="Centro"              minWidth={220} />
                                <Column dataField="fechaModificacion"     caption="Fecha Actualización" width={180} dataType="date" format="dd/MM/yyyy" />
                                <Column dataField="usuarioModificacionId" caption="Usuario"             width={100} />
                            </DataGrid>
                        </div>
                    )}

                    {/* FINCAS REGISTRALES */}
                    {tabActiva === "fincasRegistrales" && (
                        <div className="ficha-tab-inner">
                            <DataGrid dataSource={fincas} showBorders rowAlternationEnabled noDataText="Sin datos para mostrar" onExporting={e => onExportingGrid(e, "FincasRegistrales")} className="mz-table" height={450}>
                                <Scrolling mode="standard" /><Paging defaultPageSize={10} />
                                <Pager visible showInfo showNavigationButtons displayMode="full" allowedPageSizes={[10, 20, 50]} showPageSizeSelector />
                                <FilterRow visible /><HeaderFilter visible /><Sorting mode="multiple" /><Export enabled />
                                <Column dataField="Finca_id"    caption="ID"            width={70} />
                                <Column dataField="Localizador" caption="Localizador"   width={110} />
                                <Column caption="Dirección" width={250} cellRender={(cell) => (
                                    <span>{cell.data.Direccion}{cell.data.Numero ? ` nº ${cell.data.Numero}` : ''}{cell.data.Piso ? `, ${cell.data.Piso}` : ''}{cell.data.Puerta ? ` - ${cell.data.Puerta}` : ''}</span>
                                )} />
                                <Column dataField="Superficie"  caption="Superficie"    width={100} format="#,##0.00 m²" />
                                <Column dataField="Titularidad" caption="Titularidad"   width={180} />
                                <Column dataField="Coste" caption="Coste" width={100} dataType="number" format={{ type: 'currency', currency: 'EUR', precision: 2 }}
                                    cellRender={(cell) => (
                                        <span style={{ color: !cell.value ? '#d32f2f' : 'inherit', fontWeight: !cell.value ? 'bold' : 'normal' }}>
                                            {cell.text} {!cell.value && '⚠️'}
                                        </span>
                                    )}
                                />
                                <Column dataField="F_Alquiler"    caption="F. Alquiler"    width={130} dataType="date" format="dd/MM/yyyy" />
                                <Column dataField="F_Inscripcion" caption="F. Inscripción" width={140} dataType="date" format="dd/MM/yyyy" />
                            </DataGrid>
                        </div>
                    )}

                    {/* ESPECIALIDADES */}
                    {tabActiva === "especialidades" && (
                        <div className="ficha-tab-inner">
                            {bloqueado && (
                                <div className="ficha-alert ficha-alert-warning" style={{ marginBottom: 15 }}>
                                    <i className="ri-lock-line" />
                                    <span>La edición de disponibilidad está <strong>bloqueada</strong>. El período de bloqueo activo no permite realizar modificaciones.</span>
                                </div>
                            )}
                            {!esAdmin && (
                                <div className="ficha-alert ficha-alert-warning" style={{ marginBottom: 15 }}>
                                    <i className="ri-lock-line" />
                                    <span>La edición de especialidades es gestionada por el administrador del centro.</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 15 }}>
                                <div className="ficha-field" style={{ minWidth: 220 }}>
                                    <label>Centro</label>
                                    <input type="text" value={form.Centro || ""} readOnly className="readonly" />
                                </div>
                                <div className="ficha-field" style={{ minWidth: 90 }}>
                                    <label>Año</label>
                                    <select value={anioEsp || ''} onChange={e => { setAnioEsp(e.target.value ? Number(e.target.value) : null); setEditandoEsp({}); }}>
                                        <option value=''>-- Seleccionar --</option>
                                        {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                {msgEsp && (
                                    <span style={{ fontSize: 12.5, color: msgEsp.ok ? '#2e7d32' : '#c62828', paddingBottom: 4 }}>
                                        {msgEsp.text}
                                    </span>
                                )}
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
                                    <thead>
                                        <tr style={{ background: '#1976d2', color: '#fff' }}>
                                            <th style={thS('left', 160)}>Especialidad</th>
                                            <th style={thS('left', 180)}>Servicio</th>
                                            <th style={thS('center', 55)}>Cant.</th>
                                            <th style={thS('center', 50)}>Disp.</th>
                                            {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].map(m =>
                                                <th key={m} style={thS('center', 58)}>{m}</th>
                                            )}
                                            <th style={thS('center', 70)}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {especialidades.length === 0 ? (
                                            <tr><td colSpan={18} style={{ textAlign: 'center', padding: 20, color: '#999' }}>Sin especialidades para este centro y año</td></tr>
                                        ) : especialidades.map((row, i) => {
                                            const id   = row.centroPropioEspecialidadId;
                                            const edit = editandoEsp[id] || {
                                                ene: row.ene, feb: row.feb, mar: row.mar, abr: row.abr,
                                                may: row.may, jun: row.jun, jul: row.jul, ago: row.ago,
                                                sep: row.sep, oct: row.oct, nov: row.nov, dic: row.dic,
                                            };
                                            const total      = MESES.reduce((s, m) => s + (Number(edit[m]) || 0), 0);
                                            const hayEdicion = !!editandoEsp[id];
                                            const setMes = (mes, val) => setEditandoEsp(prev => ({
                                                ...prev,
                                                [id]: { ...edit, [mes]: Number(val) || 0 }
                                            }));
                                            return (
                                                <tr key={id} style={{
                                                    background: i % 2 === 0 ? '#fff' : '#f9f9f9',
                                                    outline: hayEdicion ? '2px solid #1976d2' : 'none',
                                                    outlineOffset: -1,
                                                }}>
                                                    <td style={tdS('left')}>{row.especialidad}</td>
                                                    <td style={tdS('left')}>{row.servicio}</td>
                                                    <td style={tdS('center')}>{row.cantidad}</td>
                                                    <td style={tdS('center')}>{row.disponibilidad}</td>
                                                    {MESES.map(mes => (
                                                        <td key={mes} style={{ ...tdS('center'), padding: '2px 3px' }}>
                                                            <input type="text" inputMode="numeric" pattern="[0-9]*"
                                                                disabled={bloqueado || !esAdmin}
                                                                value={String(edit[mes] ?? 0)}
                                                                onChange={e => setMes(mes, e.target.value)}
                                                                style={{ width: 48, textAlign: 'center', border: '1px solid #ccc', borderRadius: 3, padding: '2px 4px', fontSize: 11, color: '#333', background: (bloqueado || !esAdmin) ? '#f5f5f5' : '#fff' }}
                                                            />
                                                        </td>
                                                    ))}
                                                    <td style={{ ...tdS('center'), fontWeight: 700, color: '#1976d2' }}>{total}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {esAdmin && (
                                <div className="ficha-header-btns" style={{ marginTop: 15, justifyContent: 'flex-start', gap: 10 }}>
                                    <button className="ficha-btn-primary"
                                        disabled={bloqueado || guardandoEsp || Object.keys(editandoEsp).length === 0}
                                        style={{ opacity: (bloqueado || Object.keys(editandoEsp).length === 0) ? 0.5 : 1 }}
                                        onClick={handleActualizarDisponibilidad}>
                                        {guardandoEsp ? 'Guardando…' : 'Actualizar'}
                                    </button>
                                    <button className="ficha-btn-secondary" onClick={() => { setEditandoEsp({}); setMsgEsp(null); }}>
                                        Cancelar
                                    </button>
                                    <span style={{ fontSize: 11, color: '#888', paddingTop: 6 }}>
                                        {Object.keys(editandoEsp).length > 0
                                            ? `${Object.keys(editandoEsp).length} fila(s) modificada(s) — pulsa Actualizar para guardar`
                                            : 'Edita los valores de los meses directamente en la tabla'}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CATÁLOGO */}
                    {tabActiva === "catalogo" && (
                        <div className="ficha-tab-inner">
                            {/* Bloqueado para usuario final */}
                            {!esAdmin && (
                                <div className="ficha-alert ficha-alert-warning" style={{ marginBottom: 15 }}>
                                    <i className="ri-lock-line" />
                                    <span>El catálogo de servicios es gestionado por el administrador del centro.</span>
                                </div>
                            )}
                            <div className="ficha-grid ficha-grid--5" style={{ marginBottom: 15 }}>
                                <div className="ficha-field">
                                    <label>Localizador</label>
                                    <input type="text" value={form.Localizador || ""} readOnly className="readonly" />
                                </div>
                                <div className="ficha-field">
                                    <label>Mutua</label>
                                    <select value={form.Mutua || ""} disabled={!esAdmin} onChange={set("Mutua")}>
                                        <option value="">— Seleccionar —</option>
                                        {MUTUOS.map(m => <option key={m.numeroId} value={m.numeroId}>{m.numeroId} - {m.mutua}</option>)}
                                    </select>
                                </div>
                                <div className="ficha-field">
                                    <label>Centro</label>
                                    <input type="text" value={form.Centro || ""} readOnly className="readonly" />
                                </div>
                                <div className="ficha-field">
                                    <label>Especialidad</label>
                                    <select disabled={!esAdmin}>
                                        <option value="">— Seleccionar —</option>
                                        {ESPECIALIDADES_LIST.map(e => <option key={e}>{e}</option>)}
                                    </select>
                                </div>
                                <div className="ficha-field">
                                    <label>Año</label>
                                    <select
                                        value={anioCat || ''}
                                        disabled={!esAdmin}
                                        onChange={e => setAnioCat(e.target.value ? Number(e.target.value) : null)}
                                    >
                                        <option value=''>-- Seleccionar --</option>
                                        {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>
                            {!anioCat && esAdmin && (
                                <p style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>
                                    <i className="ri-information-line"></i> Selecciona un año para ver el catálogo.
                                </p>
                            )}
                            <DataGrid dataSource={anioCat ? catalogo : []} showBorders rowAlternationEnabled noDataText="Sin datos para mostrar" className="mz-table" width="100%" height="auto">
                                <Scrolling mode="standard" /><Paging defaultPageSize={10} />
                                <Pager visible showInfo showNavigationButtons displayMode="full" allowedPageSizes={[10, 20, 50]} showPageSizeSelector />
                                <FilterRow visible /><HeaderFilter visible /><Sorting mode="multiple" />
                                <Column dataField="especialidad"   caption="Especialidad"   width={220} />
                                <Column dataField="servicio"       caption="Servicio"       width={250} />
                                <Column dataField="disponibilidad" caption="Disponibilidad" width={120} />
                                <Column dataField="fechaAlta"      caption="F. Alta"        width={120} dataType="date" format="dd/MM/yyyy" />
                            </DataGrid>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FichaCentroPropio;
