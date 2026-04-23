import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MapaModal from './MapaModal';
import DataGrid, { Column, FilterRow, HeaderFilter, Pager, Paging, Export, Scrolling, Sorting } from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";
import './FichaCentroPropio.css';

const MUTUOS = ["603 - ACTIVA MUTUA 2008","151 - FRATERNIDAD MUPRESPA","201 - FREMAP","272 - IBERMUTUA","061 - MAC MUTUA"];
const PROVINCIAS = ["Alava","Albacete","Alicante","Almeria","Avila","Badajoz","Barcelona","Burgos","Caceres","Cadiz","Castellon","Ciudad Real","Cordoba","Cuenca","Girona","Granada","Guadalajara","Guipuzcoa","Huelva","Huesca","Jaen","La Rioja","Las Palmas","Leon","Lerida","Lugo","Madrid","Malaga","Murcia","Navarra","Orense","Palencia","Pontevedra","Salamanca","Santa Cruz de Tenerife","Segovia","Sevilla","Soria","Tarragona","Teruel","Toledo","Valencia","Valladolid","Vizcaya","Zamora","Zaragoza"];
const VIAS = ["AVENIDA","CALLE","PLAZA","PASEO","CARRETERA","CAMINO","RONDA"];
const SERVICIOS_ESP = ["Servicios Centrales","Servicios Especiales","Ninguno"];
const ESPECIALIDADES_LIST = ["Medicina General","Traumatologia","Rehabilitacion","Fisioterapia","Psicologia","Enfermeria","Radiologia","Cirugia","Cardiologia","Neurologia","Dermatologia","Oftalmologia","Urgencias","Pediatria"];
const ANOS = ["2020","2021","2022","2023","2024","2025"];

const SECCIONES = [
    { key: "general", label: "General" },
    { key: "datosUtilizacion", label: "Datos Utilización" },
    { key: "registroICG", label: "Registro ICG" },
    { key: "fincasRegistrales", label: "Fincas Registrales" },
    { key: "especialidades", label: "Especialidades / Serv. Disponibles" },
    { key: "catalogo", label: "Catálogo completo de servicios" },
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

    const [form, setForm] = useState({});
    const [registrosICG, setRegistrosICG] = useState([]);
    const [seccionActiva, setSeccionActiva] = useState("general");
    const [guardando, setGuardando] = useState(false);

    const seccionRefs = {
        general: useRef(null),
        datosUtilizacion: useRef(null),
        registroICG: useRef(null),
        fincasRegistrales: useRef(null),
        especialidades: useRef(null),
        catalogo: useRef(null),
    };

    useEffect(() => {
        if (!cliente) { navigate(-1); return; }
        setForm({
            Localizador: cliente.localizador || cliente.Localizador || "",
            TipoCentro: cliente.tipoCentro || cliente.TipoCentro || "",
            CentroId: cliente.centroId || cliente.CentroId || "",
            Centro: cliente.centro || cliente.Centro || "",
            Mutua: cliente.Mutua || "",
            Provincia: cliente.Provincia || "",
            Poblacion: cliente.Poblacion || "",
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
            ActividadHospitalaria: cliente.ActividadHospitalaria ?? false,
            ActividadAmbulatoria: cliente.ActividadAmbulatoria ?? false,
            ActividadRehabilitacion: cliente.ActividadRehabilitacion ?? false,
            ActividadControlIT: cliente.ActividadControlIT ?? false,
            ActividadPrevencion: cliente.ActividadPrevencion ?? false,
            ActividadOtras: cliente.ActividadOtras ?? false,
            ActividadAdmon: cliente.ActividadAdmon ?? false,
            MotivoBaja: cliente.MotivoBaja || "",
            FechaBaja: cliente.FechaBaja || "",
            Traslado: cliente.Traslado ?? false,
            CentroDesactivado: cliente.desactivado ?? cliente.CentroDesactivado ?? false,
            NuevoCentro: cliente.NuevoCentro || "",
        });
    }, [cliente]);

    useEffect(() => {
        if (form.CentroId) {
            fetch(`/api/RegistroICG/${form.CentroId}`)
                .then(res => res.json())
                .then(data => setRegistrosICG(data))
                .catch(() => setRegistrosICG([]));
        }
    }, [form.CentroId]);

    // Intersection observer para detectar sección visible
    useEffect(() => {
        const observers = [];
        SECCIONES.forEach(({ key }) => {
            const ref = seccionRefs[key];
            if (!ref.current) return;
            const observer = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setSeccionActiva(key); },
                { threshold: 0.3 }
            );
            observer.observe(ref.current);
            observers.push(observer);
        });
        return () => observers.forEach(o => o.disconnect());
    }, [form]);

    const set = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm(f => ({ ...f, [key]: val }));
    };

    const scrollToSeccion = (key) => {
        seccionRefs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setSeccionActiva(key);
    };

    const handleGuardar = async () => {
        setGuardando(true);
        try {
            const res = await fetch(`/api/CentrosPropios/${form.CentroId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    localizador: form.Localizador, centroId: form.CentroId,
                    mutuaId: form.MutuaId || 0, centro: form.Centro,
                    cp: form.Cp, poblacionId: form.PoblacionId || 0,
                    telefono: form.Telefono, latitud: form.Latitud,
                    longitud: form.Longitud, direccion: form.Direccion,
                    direccionGoogle: form.DireccionGoogle, email: form.Email,
                    personaContacto: form.PersonaContacto, desactivado: form.CentroDesactivado,
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
            {/* HEADER */}
            <div className="fcp-header">
                <div className="fcp-header-left">
                    <button className="fcp-btn-volver" onClick={() => navigate(-1)}>
                        <i className="ri-arrow-left-line" /> Volver
                    </button>
                    <div className="fcp-header-info">
                        <span className="fcp-header-titulo">Ficha Centro Propio</span>
                        <span className="fcp-header-subtitulo">{form.Localizador} — {form.Centro}</span>
                    </div>
                </div>
                <div className="fcp-header-right">
                    <button className="fcp-btn-guardar" onClick={handleGuardar} disabled={guardando}>
                        <i className="ri-save-line" /> {guardando ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>

            <div className="fcp-layout">
                {/* SIDEBAR NAVEGACIÓN */}
                <nav className="fcp-sidebar">
                    {SECCIONES.map(({ key, label }) => (
                        <button
                            key={key}
                            className={"fcp-sidebar-item" + (seccionActiva === key ? " active" : "")}
                            onClick={() => scrollToSeccion(key)}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                {/* CONTENIDO CON SCROLL */}
                <div className="fcp-content">

                    {/* SECCIÓN GENERAL */}
                    <section ref={seccionRefs.general} className="fcp-seccion" id="general">
                        <div className="fcp-seccion-header">
                            <h2 className="fcp-seccion-titulo">General</h2>
                        </div>
                        <div className="fcp-grid">
                            <div className="fcp-field">
                                <label>Localizador</label>
                                <input type="text" value={form.Localizador || ""} onChange={set("Localizador")} />
                            </div>
                            <div className="fcp-field">
                                <label>Tipo de Centro</label>
                                <input type="text" value={form.TipoCentro || ""} readOnly className="readonly" />
                            </div>
                            <div className="fcp-field">
                                <label>Centro ID</label>
                                <input type="text" value={form.CentroId || ""} readOnly className="readonly" />
                            </div>
                            <div className="fcp-field fcp-field--span2">
                                <label>Centro</label>
                                <input type="text" value={form.Centro || ""} onChange={set("Centro")} />
                            </div>
                            <div className="fcp-field">
                                <label>Mutua</label>
                                <select value={form.Mutua || ""} onChange={set("Mutua")}>
                                    <option value=""></option>
                                    {MUTUOS.map(m => <option key={m}>{m}</option>)}
                                </select>
                            </div>
                            <div className="fcp-field">
                                <label>Provincia</label>
                                <select value={form.Provincia || ""} onChange={set("Provincia")}>
                                    <option value=""></option>
                                    {PROVINCIAS.map(p => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="fcp-field">
                                <label>Población</label>
                                <select value={form.Poblacion || ""} onChange={set("Poblacion")}>
                                    <option value=""></option>
                                    {PROVINCIAS.map(p => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="fcp-field">
                                <label>Código Postal</label>
                                <input type="text" value={form.Cp || ""} onChange={set("Cp")} />
                            </div>
                            <div className="fcp-field">
                                <label>Vía Pública</label>
                                <select value={form.ViaPublica || ""} onChange={set("ViaPublica")}>
                                    {VIAS.map(v => <option key={v}>{v}</option>)}
                                </select>
                            </div>
                            <div className="fcp-field fcp-field--span2">
                                <label>Dirección</label>
                                <input type="text" value={form.Direccion || ""} onChange={set("Direccion")} />
                            </div>
                            <div className="fcp-field">
                                <label>Número</label>
                                <input type="text" value={form.Numero || ""} onChange={set("Numero")} />
                            </div>
                            <div className="fcp-field">
                                <label>Piso</label>
                                <input type="text" value={form.Piso || ""} onChange={set("Piso")} />
                            </div>
                            <div className="fcp-field">
                                <label>Puerta</label>
                                <input type="text" value={form.Puerta || ""} onChange={set("Puerta")} />
                            </div>
                            <div className="fcp-field">
                                <label>Servicios Especiales</label>
                                <select value={form.ServiciosEspeciales || ""} onChange={set("ServiciosEspeciales")}>
                                    <option value=""></option>
                                    {SERVICIOS_ESP.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="fcp-field">
                                <label>Teléfono</label>
                                <input type="text" value={form.Telefono || ""} onChange={set("Telefono")} />
                            </div>
                            <div className="fcp-field fcp-field--span2">
                                <label>Dirección Google</label>
                                <input type="text" value={form.DireccionGoogle || ""} onChange={set("DireccionGoogle")} />
                            </div>
                            <div className="fcp-field fcp-field--span2">
                                <label>Verificar Dirección Google</label>
                                <div className="fcp-input-icon">
                                    <input type="text" value={form.VerificarDireccionGoogle || ""} onChange={set("VerificarDireccionGoogle")} />
                                    <button className="fcp-icon-btn" onClick={() => navigate('/admin/Centros/MapaPage', { state: { latitud: form.Latitud, longitud: form.Longitud, direccion: form.DireccionGoogle } })} title="Abrir mapa">
                                        🌐
                                    </button>
                                </div>
                            </div>
                            <div className="fcp-field">
                                <label>Dirección Electrónica</label>
                                <input type="email" value={form.Email || ""} onChange={set("Email")} />
                            </div>
                            <div className="fcp-field">
                                <label>Persona de Contacto</label>
                                <input type="text" value={form.PersonaContacto || ""} onChange={set("PersonaContacto")} />
                            </div>
                            <div className="fcp-field">
                                <label>Otros Datos</label>
                                <input type="text" value={form.OtrosDatos || ""} onChange={set("OtrosDatos")} />
                            </div>
                            <div className="fcp-field">
                                <label>Autorización / Comunicación</label>
                                <input type="date" value={form.Autorizacion || ""} onChange={set("Autorizacion")} />
                            </div>
                            <div className="fcp-field">
                                <label>Puesta en Funcionamiento</label>
                                <input type="date" value={form.PuestaFuncionamiento || ""} onChange={set("PuestaFuncionamiento")} />
                            </div>
                            <div className="fcp-field">
                                <label>Calificación de Suficiencia</label>
                                <input type="date" value={form.Calificacion || ""} onChange={set("Calificacion")} />
                            </div>
                            <div className="fcp-field">
                                <label>Centro Inicial</label>
                                <input type="date" value={form.CentroInicial || ""} onChange={set("CentroInicial")} />
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN DATOS UTILIZACIÓN */}
                    <section ref={seccionRefs.datosUtilizacion} className="fcp-seccion" id="datosUtilizacion">
                        <div className="fcp-seccion-header">
                            <h2 className="fcp-seccion-titulo">Datos Utilización</h2>
                        </div>
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
                        <div className="fcp-grid fcp-grid--3">
                            <div className="fcp-field">
                                <label>Fecha de Baja</label>
                                <input 
                                    type="date" 
                                    value={form.FechaBaja || ""} 
                                    onChange={set("FechaBaja")}
                                    disabled={!form.CentroDesactivado}
                                    style={{ opacity: !form.CentroDesactivado ? 0.4 : 1, cursor: !form.CentroDesactivado ? "not-allowed" : "default" }}
                                />
                            </div>
                            <div className="fcp-field fcp-field--center">
                                <label>Traslado</label>
                                <input type="checkbox" checked={form.Traslado || false} onChange={set("Traslado")} className="fcp-check-center" />
                            </div>
                            <div className="fcp-field fcp-field--center">
                                <label>Centro Desactivado</label>
                                <input type="checkbox" checked={form.CentroDesactivado || false} onChange={set("CentroDesactivado")} className="fcp-check-center" />
                            </div>
                        </div>
                        <div className="fcp-bloque">
                            <p className="fcp-bloque-titulo">Nuevo Centro</p>
                            <input 
                                type="text" 
                                value={form.NuevoCentro || ""} 
                                onChange={set("NuevoCentro")} 
                                className="fcp-input-full"
                                disabled={!form.Traslado}
                                style={{ opacity: !form.Traslado ? 0.4 : 1, cursor: !form.Traslado ? "not-allowed" : "default" }}
                            />
                        </div>
                    </section>

                    {/* SECCIÓN REGISTRO ICG */}
                    <section ref={seccionRefs.registroICG} className="fcp-seccion" id="registroICG">
                        <div className="fcp-seccion-header">
                            <h2 className="fcp-seccion-titulo">Registro ICG</h2>
                        </div>
                        <DataGrid dataSource={registrosICG} showBorders={true} rowAlternationEnabled={true}
                            noDataText="Sin datos para mostrar" onExporting={e => onExportingGrid(e, "RegistroICG")}
                            className="mz-table" height={400}>
                            <Scrolling mode="standard" />
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10,20,50]} showPageSizeSelector={true} />
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
                    </section>

                    {/* SECCIÓN FINCAS REGISTRALES */}
                    <section ref={seccionRefs.fincasRegistrales} className="fcp-seccion" id="fincasRegistrales">
                        <div className="fcp-seccion-header">
                            <h2 className="fcp-seccion-titulo">Fincas Registrales</h2>
                        </div>
                        <DataGrid dataSource={[]} showBorders={true} rowAlternationEnabled={true}
                            noDataText="Sin datos para mostrar" onExporting={e => onExportingGrid(e, "FincasRegistrales")}
                            className="mz-table" height={400}>
                            <Scrolling mode="standard" />
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10,20,50]} showPageSizeSelector={true} />
                            <FilterRow visible={true} />
                            <HeaderFilter visible={true} />
                            <Sorting mode="multiple" />
                            <Export enabled={true} />
                            <Column dataField="codigo" caption="Código" width={90} />
                            <Column dataField="cFinca" caption="C. Finca" width={100} />
                            <Column dataField="direccion" caption="Dirección" width={220} />
                            <Column dataField="superficie" caption="Superficie" width={100} />
                            <Column dataField="titularidad" caption="Titularidad" width={120} />
                            <Column dataField="coste" caption="Coste" width={100} dataType="number" format="#,##0.00" />
                            <Column dataField="fechaAlquiler" caption="Fecha Alquiler" width={130} dataType="date" format="dd/MM/yyyy" />
                            <Column dataField="fechaInscripcion" caption="Fecha Inscripción" width={140} dataType="date" format="dd/MM/yyyy" />
                        </DataGrid>
                    </section>

                    {/* SECCIÓN ESPECIALIDADES */}
                    <section ref={seccionRefs.especialidades} className="fcp-seccion" id="especialidades">
                        <div className="fcp-seccion-header">
                            <h2 className="fcp-seccion-titulo">Especialidades / Servicios Disponibles</h2>
                        </div>
                        <div className="fcp-filtros">
                            <div className="fcp-field"><label>Localizador</label><input type="text" value={form.Localizador || ""} readOnly className="readonly" /></div>
                            <div className="fcp-field"><label>Mutua</label><select value={form.Mutua || ""} onChange={set("Mutua")}><option value=""></option>{MUTUOS.map(m => <option key={m}>{m}</option>)}</select></div>
                            <div className="fcp-field"><label>Centro</label><input type="text" value={form.Centro || ""} readOnly className="readonly" /></div>
                            <div className="fcp-field"><label>Especialidad</label><select><option value=""></option>{ESPECIALIDADES_LIST.map(e => <option key={e}>{e}</option>)}</select></div>
                            <div className="fcp-field"><label>Año</label><select><option value=""></option>{ANOS.map(a => <option key={a}>{a}</option>)}</select></div>
                        </div>
                        <DataGrid dataSource={[]} showBorders={true} rowAlternationEnabled={true} noDataText="Sin datos para mostrar" className="mz-table" height={350}>
                            <Scrolling mode="standard" />
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10,20,50]} showPageSizeSelector={true} />
                            <FilterRow visible={true} />
                            <HeaderFilter visible={true} />
                            <Sorting mode="multiple" />
                            <Column dataField="especialidad" caption="Especialidad" width={160} />
                            <Column dataField="servicio" caption="Servicio" width={180} />
                            <Column dataField="altaTec" caption="AltaTec" width={90} />
                            <Column dataField="disp" caption="Disp." width={70} />
                            {["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"].map(m =>
                                <Column key={m} dataField={m} caption={m.charAt(0).toUpperCase()+m.slice(1)} width={55} dataType="number" />
                            )}
                            <Column dataField="total" caption="Total" width={70} dataType="number" />
                        </DataGrid>
                        <div className="fcp-acciones-bottom">
                            <button className="fcp-btn-accion">Actualizar</button>
                            <button className="fcp-btn-accion fcp-btn-accion--cancelar">Cancelar</button>
                        </div>
                    </section>

                    {/* SECCIÓN CATÁLOGO */}
                    <section ref={seccionRefs.catalogo} className="fcp-seccion" id="catalogo">
                        <div className="fcp-seccion-header">
                            <h2 className="fcp-seccion-titulo">Catálogo Completo de Servicios</h2>
                        </div>
                        <div className="fcp-filtros">
                            <div className="fcp-field"><label>Localizador</label><input type="text" value={form.Localizador || ""} readOnly className="readonly" /></div>
                            <div className="fcp-field"><label>Mutua</label><select value={form.Mutua || ""} onChange={set("Mutua")}><option value=""></option>{MUTUOS.map(m => <option key={m}>{m}</option>)}</select></div>
                            <div className="fcp-field"><label>Centro</label><input type="text" value={form.Centro || ""} readOnly className="readonly" /></div>
                            <div className="fcp-field"><label>Especialidad</label><select><option value=""></option>{ESPECIALIDADES_LIST.map(e => <option key={e}>{e}</option>)}</select></div>
                            <div className="fcp-field"><label>Año</label><select><option value=""></option>{ANOS.map(a => <option key={a}>{a}</option>)}</select></div>
                        </div>
                        <DataGrid dataSource={[]} showBorders={true} rowAlternationEnabled={true} noDataText="Sin datos para mostrar" className="mz-table" height={350}>
                            <Scrolling mode="standard" />
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10,20,50]} showPageSizeSelector={true} />
                            <FilterRow visible={true} />
                            <HeaderFilter visible={true} />
                            <Sorting mode="multiple" />
                            <Column dataField="especialidad" caption="Especialidad" width={220} />
                            <Column dataField="servicio" caption="Servicio" width={250} />
                            <Column dataField="catalogoCompletoServ" caption="Catálogo Completo de Servicios" width={250} />
                        </DataGrid>
                        <div className="fcp-acciones-bottom">
                            <button className="fcp-btn-accion">Actualizar</button>
                            <button className="fcp-btn-accion fcp-btn-accion--cancelar">Cancelar</button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};



export default FichaCentroPropio;
