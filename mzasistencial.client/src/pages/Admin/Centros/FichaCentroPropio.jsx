﻿import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DataGrid, { Column, FilterRow, HeaderFilter, Pager, Paging, Export, Scrolling, Sorting } from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";

import '../../../styles/FichaGlobal.css';

const VIAS = ["AVENIDA","CALLE","PLAZA","PASEO","CARRETERA","CAMINO","RONDA"];
const SERVICIOS_ESP = ["Servicios Centrales","Servicios Especiales","Ninguno"];
const ESPECIALIDADES_LIST = ["Medicina General","Traumatologia","Rehabilitacion","Fisioterapia","Psicologia","Enfermeria","Radiologia","Cirugia","Cardiologia","Neurologia","Dermatologia","Oftalmologia","Urgencias","Pediatria"];
const ANOS = ["2020","2021","2022","2023","2024","2025"];

const TABS = [
    { key: "general",           label: "General" },
    { key: "datosUtilizacion",  label: "Datos Utilizacion" },
    { key: "registroICG",       label: "Registro ICG" },
    { key: "fincasRegistrales", label: "Fincas Registrales" },
    { key: "especialidades",    label: "Especialidades / Serv. Disponibles" },
    { key: "catalogo",          label: "Catalogo completo de servicios" },
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

const FichaCentroPropio = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cliente = location.state?.cliente;

    const [MUTUOS, setMUTUOS] = useState([]);
    const [PROVINCIAS, setProvincias] = useState([]);
    const [POBLACIONES, setPoblaciones] = useState([]);
    const [form, setForm] = useState({});
    const [registrosICG, setRegistrosICG] = useState([]);
    const [tabActiva, setTabActiva] = useState("general");
    const [guardando, setGuardando] = useState(false);
    const [fincas, setFincas] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [catalogo, setCatalogo] = useState([]);
    const [anioEsp, setAnioEsp] = useState(2024);
    const [bloqueado, setBloqueado] = useState(false);

    const clienteRef = useRef(cliente);
    useEffect(() => {
        if (cliente) clienteRef.current = cliente;
    }, [cliente]);

    useEffect(() => {
        fetch("/api/mutuas")
            .then(r => r.ok ? r.json() : [])
            .then(data => setMUTUOS(data))
            .catch(() => setMUTUOS([]));
    }, []);

    useEffect(() => {
        fetch("/api/auxprovincias")
            .then(r => r.ok ? r.json() : [])
            .then(data => setProvincias(data))
            .catch(() => setProvincias([]));
    }, []);

    useEffect(() => {
        if (form.ProvinciaId) {
            fetch(`/api/auxpoblaciones/${form.ProvinciaId}`)
                .then(r => r.ok ? r.json() : [])
                .then(data => setPoblaciones(data))
                .catch(() => setPoblaciones([]));
        } else {
            setPoblaciones([]);
        }
    }, [form.ProvinciaId]);

    useEffect(() => {
        if (!cliente) { navigate(-1); return; }
        setForm({
            Localizador: cliente.localizador || cliente.Localizador || "",
            TipoCentro: cliente.tipoCentro || cliente.TipoCentro || "",
            CentroId: cliente.centroId || cliente.CentroId || "",
            Centro: cliente.centro || cliente.Centro || "",
            Mutua: cliente.mutuaId || cliente.Mutua || "",
            ProvinciaId: cliente.provinciaId || cliente.ProvinciaId || "",
            PoblacionId: cliente.poblacionId || cliente.PoblacionId || "",
            Cp: cliente.cp || cliente.Cp || "",
            ViaPublica: cliente.ViaPublica || "AVENIDA",
            Direccion: cliente.Direccion || "",
            Numero: cliente.Numero || "",
            Piso: cliente.Piso || "",
            Puerta: cliente.Puerta || "",
            ServiciosEspeciales: cliente.ServiciosEspeciales || "",
            Telefono: cliente.telefono || cliente.Telefono || "",
            DireccionGoogle: cliente.DireccionGoogle || "",
            VerificarDireccionGoogle: cliente.VerificarDireccionGoogle || "",
            Latitud: cliente.latitud || cliente.Latitud || "",
            Longitud: cliente.longitud || cliente.Longitud || "",
            Email: cliente.Email || "",
            PersonaContacto: cliente.PersonaContacto || "",
            OtrosDatos: cliente.OtrosDatos || "",
            Autorizacion: cliente.Autorizacion || "",
            PuestaFuncionamiento: cliente.PuestaFuncionamiento || "",
            Calificacion: cliente.Calificacion || "",
            CentroInicial: cliente.CentroInicial || "",
            TipoCentroRadio: cliente.TipoCentroRadio || "hospitalarios",
            ActividadHospitalaria: cliente.asistenciaHospitalaria ?? cliente.ActividadHospitalaria ?? false,
            ActividadAmbulatoria: cliente.asistenciaAmbulatoria ?? cliente.ActividadAmbulatoria ?? false,
            ActividadRehabilitacion: cliente.rehabilitacion ?? cliente.ActividadRehabilitacion ?? false,
            ActividadControlIT: cliente.incapacidadTransitoria ?? cliente.ActividadControlIT ?? false,
            ActividadPrevencion: cliente.prevencion ?? cliente.ActividadPrevencion ?? false,
            ActividadOtras: cliente.otrasActividades ?? cliente.ActividadOtras ?? false,
            ActividadAdmon: cliente.administracion ?? cliente.ActividadAdmon ?? false,
            MotivoBaja: cliente.MotivoBaja || "",
            FechaBaja: cliente.FechaBaja || "",
            Traslado: cliente.Traslado ?? false,
            CentroDesactivado: cliente.desactivado ?? cliente.CentroDesactivado ?? false,
            NuevoCentro: cliente.NuevoCentro || "",
            MapaValidado: cliente.mapaValidado ?? cliente.MapaValidado ?? false,
        });
    }, [cliente]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const mapaData = sessionStorage.getItem('mapaRetorno');
            if (mapaData) {
                const { latitud, longitud, direccion, mapaValidado } = JSON.parse(mapaData);
                sessionStorage.removeItem('mapaRetorno');
                setForm(f => ({
                    ...f,
                    Latitud: latitud || f.Latitud,
                    Longitud: longitud || f.Longitud,
                    DireccionGoogle: direccion || f.DireccionGoogle,
                    MapaValidado: mapaValidado === true ? true : f.MapaValidado,
                }));
            }
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (form.CentroId) {
            fetch(`/api/RegistroICG/${form.CentroId}`)
                .then(res => res.json())
                .then(data => setRegistrosICG(data))
                .catch(() => setRegistrosICG([]));
        }
    }, [form.CentroId]);

    useEffect(() => {
        fetch('/api/CentrosPropiosEspecialidades/bloqueo')
            .then(r => r.ok ? r.json() : { bloqueado: false })
            .then(d => setBloqueado(d.bloqueado))
            .catch(() => setBloqueado(false));
    }, []);

    useEffect(() => {
        if (form.CentroId && anioEsp) {
            fetch('/api/CentrosPropiosEspecialidades?centroId=' + form.CentroId + '&anio=' + anioEsp)
                .then(r => r.ok ? r.json() : [])
                .then(d => setEspecialidades(d))
                .catch(() => setEspecialidades([]));
            fetch('/api/CentrosPropiosEspecialidades/catalogo?centroId=' + form.CentroId + '&anio=' + anioEsp)
                .then(r => r.ok ? r.json() : [])
                .then(d => setCatalogo(d))
                .catch(() => setCatalogo([]));
        }
    }, [form.CentroId, anioEsp]);

    useEffect(() => {
        if (form.CentroId) {
            fetch(`/api/FincasRegistrales?centroId=${form.CentroId}`)
                .then(res => res.json())
                .then(data => setFincas(data))
                .catch(() => setFincas([]));
        }
    }, [form.CentroId]);

    useEffect(() => {
        if (!form.CentroId && form.Mutua) {
            fetch(`/api/CentrosPropios/siguiente-localizador/${form.Mutua}`)
                .then(r => r.ok ? r.text() : null)
                .then(localizador => {
                    if (localizador) setForm(f => ({ ...f, Localizador: localizador.replace(/"/g, '') }));
                })
                .catch(() => {});
        }
    }, [form.Mutua, form.CentroId]);

    const set = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm(f => ({ ...f, [key]: val }));
    };

    const handleProvinciaChange = (e) => {
        const provinciaId = e.target.value;
        setForm(f => ({ ...f, ProvinciaId: provinciaId, PoblacionId: "" }));
    };

    const handleGuardar = async () => {
        setGuardando(true);
        try {
            const res = await fetch(`/api/CentrosPropios/${form.CentroId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
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
                    fautocom:               form.Autorizacion || null,
                    fpufuncio:              form.PuestaFuncionamiento || null,
                    fcalisuf:               form.Calificacion || null,
                    mapaValidado:           form.MapaValidado ?? false,
                    usuarioId:              JSON.parse(sessionStorage.getItem('user'))?.usuarioId ?? null,
                })
            });
            if (res.ok) { alert('Centro guardado correctamente'); navigate(-1); }
            else { alert('Error al guardar el centro'); }
        } catch (err) {
            alert('Error de conexión: ' + err.message);
        } finally {
            setGuardando(false);
        }
    };

    if (!cliente) return null;

    return (
        <div className="fcp-page">

            {/* ── HEADER ── */}
            <div className="fcp-header">
                <div className="fcp-header-left">
                    <button className="fcp-btn-volver" onClick={() => navigate(-1)}>
                        <i className="ri-arrow-left-line" /> Volver
                    </button>
                    <div className="ficha-modal-title" style={{ marginLeft: '15px' }}>
                        {t('Ficha Centro Propio')}
                        <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                            {form.Localizador} — {form.Centro}
                        </span>
                    </div>
                </div>
                <div className="ficha-header-btns">
                    <button className="ficha-btn-primary" onClick={handleGuardar} disabled={guardando}>
                        <i className="ri-check-line" /> {guardando ? t("Guardando...") : t("Aceptar")}
                    </button>
                    <button className="ficha-btn-secondary" onClick={() => navigate(-1)}>
                        <i className="ri-close-line" /> {t('Salir')}
                    </button>
                </div>
            </div>

            {/* ── PESTAÑAS ── */}
            <div className="fcp-tabs-bar">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        className={"ficha-tab" + (tabActiva === key ? " active" : "")}
                        onClick={() => setTabActiva(key)}
                    >
                        {t(label)}
                    </button>
                ))}
            </div>

            {/* ── CONTENIDO ── */}
            <div className="fcp-content">

                {/* GENERAL */}
                {tabActiva === "general" && (
                    <div className="fcp-seccion">
                        <div className="ficha-grid">
                            <div className="ficha-field">
                                <label>Localizador</label>
                                <input type="text" value={form.Localizador || ""} onChange={set("Localizador")} />
                            </div>
                            <div className="ficha-field">
                                <label>Tipo de Centro</label>
                                <input type="text" value={form.TipoCentro || ""} readOnly className="readonly" />
                            </div>
                            <div className="ficha-field">
                                <label>Centro ID</label>
                                <input type="text" value={form.CentroId || ""} readOnly className="readonly" />
                            </div>
                            <div className="ficha-field span2">
                                <label>Centro</label>
                                <input type="text" value={form.Centro || ""} onChange={set("Centro")} />
                            </div>
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
                                    {PROVINCIAS.map(p => (
                                        <option key={p.provinciaId} value={p.provinciaId}>{p.provincia}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="ficha-field">
                                <label>Población</label>
                                <select value={form.PoblacionId || ""} onChange={set("PoblacionId")} disabled={!form.ProvinciaId}>
                                    <option value="">— Seleccionar —</option>
                                    {POBLACIONES.map(p => (
                                        <option key={p.poblacionId} value={p.poblacionId}>{p.poblacion}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="ficha-field">
                                <label>Código Postal</label>
                                <input type="text" value={form.Cp || ""} onChange={set("Cp")} />
                            </div>
                            <div className="ficha-field">
                                <label>Vía Pública</label>
                                <select value={form.ViaPublica || ""} onChange={set("ViaPublica")}>
                                    {VIAS.map(v => <option key={v}>{v}</option>)}
                                </select>
                            </div>
                            <div className="ficha-field span2">
                                <label>Dirección</label>
                                <input type="text" value={form.Direccion || ""} onChange={set("Direccion")} />
                            </div>
                            <div className="ficha-field">
                                <label>Número</label>
                                <input type="text" value={form.Numero || ""} onChange={set("Numero")} />
                            </div>
                            <div className="ficha-field">
                                <label>Piso</label>
                                <input type="text" value={form.Piso || ""} onChange={set("Piso")} />
                            </div>
                            <div className="ficha-field">
                                <label>Puerta</label>
                                <input type="text" value={form.Puerta || ""} onChange={set("Puerta")} />
                            </div>
                            <div className="ficha-field">
                                <label>Servicios Especiales</label>
                                <select value={form.ServiciosEspeciales || ""} onChange={set("ServiciosEspeciales")}>
                                    <option value="">— Seleccionar —</option>
                                    {SERVICIOS_ESP.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="ficha-field">
                                <label>Teléfono</label>
                                <input type="text" value={form.Telefono || ""} onChange={set("Telefono")} />
                            </div>
                            <div className="ficha-field span2">
                                <label>Dirección Google</label>
                                <input type="text" value={form.DireccionGoogle || ""} onChange={set("DireccionGoogle")} />
                            </div>
                            <div className="ficha-field span2">
                                <label>Verificar Dirección Google</label>
                                <div className="ficha-input-suffix">
                                    <input type="text" value={form.VerificarDireccionGoogle || ""} onChange={set("VerificarDireccionGoogle")} />
                                    <button className="fcp-icon-btn" title="Abrir mapa"
                                        onClick={() => navigate('/admin/Centros/MapaPage', { state: { latitud: form.Latitud, longitud: form.Longitud, direccion: form.DireccionGoogle } })}>
                                        🌐
                                    </button>
                                </div>
                            </div>
                            <div className="ficha-field">
                                <label>Dirección Electrónica</label>
                                <input type="email" value={form.Email || ""} onChange={set("Email")} />
                            </div>
                            <div className="ficha-field">
                                <label>Persona de Contacto</label>
                                <input type="text" value={form.PersonaContacto || ""} onChange={set("PersonaContacto")} />
                            </div>
                            <div className="ficha-field">
                                <label>Otros Datos</label>
                                <input type="text" value={form.OtrosDatos || ""} onChange={set("OtrosDatos")} />
                            </div>
                            <div className="ficha-field">
                                <label>Autorización / Comunicación</label>
                                <input type="date" value={form.Autorizacion || ""} onChange={set("Autorizacion")} />
                            </div>
                            <div className="ficha-field">
                                <label>Puesta en Funcionamiento</label>
                                <input type="date" value={form.PuestaFuncionamiento || ""} onChange={set("PuestaFuncionamiento")} />
                            </div>
                            <div className="ficha-field">
                                <label>Calificación de Suficiencia</label>
                                <input type="date" value={form.Calificacion || ""} onChange={set("Calificacion")} />
                            </div>
                            <div className="ficha-field">
                                <label>Centro Inicial</label>
                                <input type="date" value={form.CentroInicial || ""} onChange={set("CentroInicial")} />
                            </div>
                        </div>
                    </div>
                )}

                {/* DATOS UTILIZACIÓN */}
                {tabActiva === "datosUtilizacion" && (
                    <div className="fcp-seccion">
                        <div className="fcp-bloque">
                            <p className="fcp-bloque-titulo">Tipo de Centro</p>
                            <div className="fcp-radio-group">
                                <label>
                                    <input type="radio" name="tipoCentro" value="noSanitario"
                                        checked={form.TipoCentroRadio === "noSanitario"} onChange={set("TipoCentroRadio")} />
                                    Centro NO Sanitario
                                </label>
                                <label>
                                    <input type="radio" name="tipoCentro" value="hospitalarios"
                                        checked={form.TipoCentroRadio === "hospitalarios"} onChange={set("TipoCentroRadio")} />
                                    Hospitales y Ambulatorios
                                </label>
                            </div>
                        </div>
                        <div className="fcp-bloque">
                            <p className="fcp-bloque-titulo">Actividades del Centro</p>
                            <p className="fcp-bloque-sub">Selecciona las actividades del centro:</p>
                            <div className="fcp-checkbox-grid">
                                <label><input type="checkbox" checked={form.ActividadHospitalaria || false} onChange={set("ActividadHospitalaria")} /> Asistencia sanitaria Hospitalaria</label>
                                <label><input type="checkbox" checked={form.ActividadAmbulatoria || false} onChange={set("ActividadAmbulatoria")} /> Asistencia sanitaria ambulatoria</label>
                                <label><input type="checkbox" checked={form.ActividadRehabilitacion || false} onChange={set("ActividadRehabilitacion")} /> Solamente rehabilitación</label>
                                <label><input type="checkbox" checked={form.ActividadControlIT || false} onChange={set("ActividadControlIT")} /> Control administrativo de IT</label>
                                <label><input type="checkbox" checked={form.ActividadPrevencion || false} onChange={set("ActividadPrevencion")} /> Prevención R.L seguridad social</label>
                                <label><input type="checkbox" checked={form.ActividadOtras || false} onChange={set("ActividadOtras")} /> Otras Actividades</label>
                                <label><input type="checkbox" checked={form.ActividadAdmon || false} onChange={set("ActividadAdmon")} /> Administración general de la Mutua</label>
                            </div>
                        </div>
                        <div className="fcp-bloque">
                            <p className="fcp-bloque-titulo">Motivo de la Baja</p>
                            <textarea className="fcp-textarea" value={form.MotivoBaja || ""} onChange={e => setForm(f => ({ ...f, MotivoBaja: e.target.value }))} rows={4} />
                        </div>
                        <div className="ficha-grid ficha-grid--3">
                            <div className="ficha-field">
                                <label>Fecha de Baja</label>
                                <input type="date" value={form.FechaBaja || ""} onChange={set("FechaBaja")}
                                    disabled={!form.CentroDesactivado}
                                    style={{ opacity: !form.CentroDesactivado ? 0.4 : 1, cursor: !form.CentroDesactivado ? "not-allowed" : "default" }} />
                            </div>
                            <div className="ficha-field ficha-field--center">
                                <label>Traslado</label>
                                <input type="checkbox" checked={form.Traslado || false} onChange={set("Traslado")} className="fcp-check-center" />
                            </div>
                            <div className="ficha-field ficha-field--center">
                                <label>Centro Desactivado</label>
                                <input type="checkbox" checked={form.CentroDesactivado || false} onChange={set("CentroDesactivado")} className="fcp-check-center" />
                            </div>
                        </div>
                        <div className="fcp-bloque" style={{ marginTop: 20 }}>
                            <p className="fcp-bloque-titulo">Nuevo Centro</p>
                            <input type="text" value={form.NuevoCentro || ""} onChange={set("NuevoCentro")}
                                className="fcp-input-full" disabled={!form.Traslado}
                                style={{ opacity: !form.Traslado ? 0.4 : 1, cursor: !form.Traslado ? "not-allowed" : "default" }} />
                        </div>
                    </div>
                )}

                {/* REGISTRO ICG */}
                {tabActiva === "registroICG" && (
                    <div className="fcp-seccion">
                        <DataGrid dataSource={registrosICG} showBorders={true} rowAlternationEnabled={true}
                            noDataText="Sin datos para mostrar" onExporting={e => onExportingGrid(e, "RegistroICG")}
                            className="mz-table" height={450}>
                            <Scrolling mode="standard" />
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10, 20, 50]} showPageSizeSelector={true} />
                            <FilterRow visible={true} />
                            <HeaderFilter visible={true} />
                            <Sorting mode="multiple" />
                            <Export enabled={true} />
                            <Column dataField="ano" caption="Año" width={80} />
                            <Column dataField="mutua" caption="Mutua" width={220} />
                            <Column dataField="centro" caption="Centro" width={220} />
                            <Column dataField="fechaActualizacion" caption="Fecha de Actualización" width={180} dataType="date" format="dd/MM/yyyy" />
                            <Column dataField="usuario" caption="Usuario" width={150} />
                        </DataGrid>
                    </div>
                )}

                {/* FINCAS REGISTRALES */}
                {tabActiva === "fincasRegistrales" && (
                    <div className="fcp-seccion">
                        <DataGrid dataSource={fincas} showBorders={true} rowAlternationEnabled={true}
                            noDataText="Sin datos para mostrar" onExporting={e => onExportingGrid(e, "FincasRegistrales")}
                            className="mz-table" height={450}>
                            <Scrolling mode="standard" />
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10, 20, 50]} showPageSizeSelector={true} />
                            <FilterRow visible={true} />
                            <HeaderFilter visible={true} />
                            <Sorting mode="multiple" />
                            <Export enabled={true} />
                            <Column dataField="Finca_id" caption="ID" width={70} />
                            <Column dataField="Localizador" caption="Localizador" width={110} />
                            <Column
                                caption="Dirección"
                                width={250}
                                cellRender={(cell) => (
                                    <span>
                                        {cell.data.Direccion} {cell.data.Numero ? `nº ${cell.data.Numero}` : ''}
                                        {cell.data.Piso ? `, ${cell.data.Piso}` : ''} {cell.data.Puerta ? `- ${cell.data.Puerta}` : ''}
                                    </span>
                                )}
                            />
                            <Column dataField="Superficie" caption="Superficie" width={100} />
                            <Column dataField="Titularidad" caption="Titularidad" width={180} />
                            <Column dataField="Coste" caption="Coste" width={100} dataType="number" format="#,##0.00" />
                            <Column dataField="F_Alquiler" caption="F. Alquiler" width={130} dataType="date" format="dd/MM/yyyy" />
                            <Column dataField="F_Inscripcion" caption="F. Inscripción" width={140} dataType="date" format="dd/MM/yyyy" />
                        </DataGrid>
                    </div>
                )}

                {/* ESPECIALIDADES */}
                {tabActiva === "especialidades" && (
                    <div className="fcp-seccion">

                        {/* ── BANNER BLOQUEO ── */}
                        {bloqueado && (
                            <div style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                background: "#fff3cd", border: "1px solid #ffc107",
                                borderLeft: "5px solid #e6a800", borderRadius: "4px",
                                padding: "10px 16px", marginBottom: "14px",
                                color: "#856404", fontWeight: 500, fontSize: "14px",
                            }}>
                                <i className="ri-lock-line" style={{ fontSize: "18px", flexShrink: 0 }} />
                                <span>
                                    La edición de disponibilidad está <strong>bloqueada</strong>.
                                    El período de bloqueo activo no permite realizar modificaciones.
                                </span>
                            </div>
                        )}

                        <div className="fcp-filtros">
                            <div className="ficha-field"><label>Localizador</label><input type="text" value={form.Localizador || ""} readOnly className="readonly" /></div>
                            <div className="ficha-field">
                                <label>Mutua</label>
                                <select value={form.Mutua || ""} onChange={set("Mutua")}>
                                    <option value="">— Seleccionar —</option>
                                    {MUTUOS.map(m => <option key={m.numeroId} value={m.numeroId}>{m.numeroId} - {m.mutua}</option>)}
                                </select>
                            </div>
                            <div className="ficha-field"><label>Centro</label><input type="text" value={form.Centro || ""} readOnly className="readonly" /></div>
                            <div className="ficha-field">
                                <label>Especialidad</label>
                                <select><option value="">— Seleccionar —</option>{ESPECIALIDADES_LIST.map(e => <option key={e}>{e}</option>)}</select>
                            </div>
                            <div className="fcp-field">
                                <label>Año</label>
                                <select><option value="">— Seleccionar —</option>{ANOS.map(a => <option key={a}>{a}</option>)}</select>
                            </div>
                        </div>

                        {/* ── DATAGRID CON MESES PIVOTADOS ── */}
                        <DataGrid
                            dataSource={especialidades}
                            showBorders={true}
                            rowAlternationEnabled={true}
                            noDataText="Sin datos para mostrar"
                            className="mz-table"
                            height={380}
                            columnAutoWidth={false}
                            allowColumnResizing={true}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10, 20, 50]} showPageSizeSelector={true} />
                            <FilterRow visible={true} />
                            <HeaderFilter visible={true} />
                            <Sorting mode="multiple" />

                            {/* Columnas fijas izquierda */}
                            <Column dataField="especialidad"   caption="Especialidad" width={150} fixed={true} fixedPosition="left" />
                            <Column dataField="servicio"       caption="Servicio"     width={160} fixed={true} fixedPosition="left" />
                            <Column dataField="cantidad"       caption="Cant."        width={60}  alignment="center" />
                            <Column dataField="disponibilidad" caption="Disp."        width={55}  alignment="center" />

                            {/* 12 meses */}
                            {["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"].map(m =>
                                <Column
                                    key={m}
                                    dataField={m}
                                    caption={m.charAt(0).toUpperCase() + m.slice(1)}
                                    width={65}
                                    dataType="number"
                                    alignment="center"
                                />
                            )}

                            {/* Total fijo derecha */}
                            <Column
                                dataField="total"
                                caption="Total"
                                width={75}
                                dataType="number"
                                alignment="center"
                                fixed={true}
                                fixedPosition="right"
                            />
                        </DataGrid>

                        <div className="fcp-acciones-bottom">
                            <button className="fcp-btn-accion" disabled={bloqueado} style={{ opacity: bloqueado ? 0.5 : 1, cursor: bloqueado ? "not-allowed" : "pointer" }}>Actualizar</button>
                            <button className="fcp-btn-accion fcp-btn-accion--cancelar">Cancelar</button>
                        </div>
                    </div>
                )}

                {/* CATÁLOGO */}
                {tabActiva === "catalogo" && (
                    <div className="fcp-seccion">
                        <div className="fcp-filtros">
                            <div className="ficha-field"><label>Localizador</label><input type="text" value={form.Localizador || ""} readOnly className="readonly" /></div>
                            <div className="ficha-field">
                                <label>Mutua</label>
                                <select value={form.Mutua || ""} onChange={set("Mutua")}>
                                    <option value="">— Seleccionar —</option>
                                    {MUTUOS.map(m => <option key={m.numeroId} value={m.numeroId}>{m.numeroId} - {m.mutua}</option>)}
                                </select>
                            </div>
                            <div className="ficha-field"><label>Centro</label><input type="text" value={form.Centro || ""} readOnly className="readonly" /></div>
                            <div className="ficha-field">
                                <label>Especialidad</label>
                                <select><option value="">— Seleccionar —</option>{ESPECIALIDADES_LIST.map(e => <option key={e}>{e}</option>)}</select>
                            </div>
                            <div className="fcp-field">
                                <label>Año</label>
                                <select><option value="">— Seleccionar —</option>{ANOS.map(a => <option key={a}>{a}</option>)}</select>
                            </div>
                        </div>
                        <DataGrid dataSource={catalogo} showBorders={true} rowAlternationEnabled={true} noDataText="Sin datos para mostrar" className="mz-table" height={380}>
                            <Scrolling mode="standard" />
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10, 20, 50]} showPageSizeSelector={true} />
                            <FilterRow visible={true} />
                            <HeaderFilter visible={true} />
                            <Sorting mode="multiple" />
                            <Column dataField="especialidad"  caption="Especialidad"  width={220} />
                            <Column dataField="servicio"      caption="Servicio"      width={250} />
                            <Column dataField="disponibilidad" caption="Disponibilidad" width={120} />
                            <Column dataField="fechaAlta"     caption="F. Alta"       width={120} dataType="date" format="dd/MM/yyyy" />
                        </DataGrid>
                        <div className="fcp-acciones-bottom">
                            <button className="fcp-btn-accion">Actualizar</button>
                            <button className="fcp-btn-accion fcp-btn-accion--cancelar">Cancelar</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default FichaCentroPropio;