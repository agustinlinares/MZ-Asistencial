import React, { useState, useEffect } from "react";
import './FichaCliente.css';
import MapaModal from './MapaModal';
import DataGrid, { Column, FilterRow, HeaderFilter, Pager, Paging, Export, Scrolling, Sorting } from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";

const MUTUOS = ["603 - ACTIVA MUTUA 2008","151 - FRATERNIDAD MUPRESPA","201 - FREMAP","272 - IBERMUTUA","061 - MAC MUTUA"];
const PROVINCIAS = ["Alava","Albacete","Alicante","Almeria","Avila","Badajoz","Barcelona","Burgos","Caceres","Cadiz","Castellon","Ciudad Real","Cordoba","Cuenca","Girona","Granada","Guadalajara","Guipuzcoa","Huelva","Huesca","Jaen","La Rioja","Las Palmas","Leon","Lerida","Lugo","Madrid","Malaga","Murcia","Navarra","Orense","Palencia","Pontevedra","Salamanca","Santa Cruz de Tenerife","Segovia","Sevilla","Soria","Tarragona","Teruel","Toledo","Valencia","Valladolid","Vizcaya","Zamora","Zaragoza"];
const VIAS = ["AVENIDA","CALLE","PLAZA","PASEO","CARRETERA","CAMINO","RONDA"];
const SERVICIOS_ESP = ["Servicios Centrales","Servicios Especiales","Ninguno"];
const ESPECIALIDADES_LIST = ["Medicina General","Traumatologia","Rehabilitacion","Fisioterapia","Psicologia","Enfermeria","Radiologia","Cirugia","Cardiologia","Neurologia","Dermatologia","Oftalmologia","Urgencias","Pediatria"];
const ANOS = ["2020","2021","2022","2023","2024","2025"];

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

const FichaCliente = ({ cliente, onClose }) => {
    const [activeTab, setActiveTab] = useState("general");
    const [form, setForm] = useState({});
    const [mapaAbierto, setMapaAbierto] = useState(false);

    useEffect(() => {
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
        setActiveTab("general");
    }, [cliente]);

    const set = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm(f => ({ ...f, [key]: val }));
    };

    const TABS = [
        { key: "general", label: "General" },
        { key: "DatosUtilizacion", label: "Datos Utilizacion" },
        { key: "RegistroICG", label: "Registro ICG" },
        { key: "FincasRegistrales", label: "Fincas Registrales" },
        { key: "Especialidades", label: "Especialidades/ Serv.Disponibles" },
        { key: "Catalogo", label: "Catalogo completo de servicios" },
    ];
const handleAceptar = async () => {
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
        if (res.ok) { alert('Centro guardado correctamente'); onClose(); }
        else { alert('Error al guardar el centro'); }
    } catch (err) { alert('Error de conexion: ' + err.message); }
};
    return (
        <div className="ficha-overlay">
            <div className="ficha-container">
                <div className="ficha-header">
                    <span className="ficha-header-title">Ficha Centros Propios</span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn ficha-btn--aceptar" onClick={handleAceptar}>Aceptar</button>
                        <button className="ficha-btn ficha-btn--salir" onClick={onClose}>Salir</button>
                    </div>
                </div>
                <div className="ficha-tabs">
                    {TABS.map(t => (
                        <button key={t.key} className={"ficha-tab" + (activeTab === t.key ? " active" : "")} onClick={() => setActiveTab(t.key)}>{t.label}</button>
                    ))}
                </div>
                <div className="ficha-body">

                    {activeTab === "general" && (
                        <div className="ficha-grid">
                            <div className="ficha-field"><label>Localizador</label><input type="text" value={form.Localizador} onChange={set("Localizador")} /></div>
                            <div className="ficha-field"><label>Tipo de Centro</label><input type="text" value={form.TipoCentro} onChange={set("TipoCentro")} readOnly className="readonly" /></div>
                            <div className="ficha-field"><label>Centro ID</label><input type="text" value={form.CentroId} readOnly className="readonly" /></div>
                            <div className="ficha-field ficha-field--wide"><label>Centro</label><input type="text" value={form.Centro} onChange={set("Centro")} /></div>
                            <div className="ficha-field"><label>Mutua</label><select value={form.Mutua} onChange={set("Mutua")}><option value=""></option>{MUTUOS.map(m => <option key={m}>{m}</option>)}</select></div>
                            <div className="ficha-field"><label>Provincia</label><select value={form.Provincia} onChange={set("Provincia")}><option value=""></option>{PROVINCIAS.map(p => <option key={p}>{p}</option>)}</select></div>
                            <div className="ficha-field"><label>Poblacion</label><select value={form.Poblacion} onChange={set("Poblacion")}><option value=""></option>{PROVINCIAS.map(p => <option key={p}>{p}</option>)}</select></div>
                            <div className="ficha-field"><label>Codigo Postal</label><input type="text" value={form.Cp} onChange={set("Cp")} /></div>
                            <div className="ficha-field"><label>Via Publica</label><select value={form.ViaPublica} onChange={set("ViaPublica")}>{VIAS.map(v => <option key={v}>{v}</option>)}</select></div>
                            <div className="ficha-field ficha-field--wide"><label>Direccion</label><input type="text" value={form.Direccion} onChange={set("Direccion")} /></div>
                            <div className="ficha-field"><label>Numero</label><input type="text" value={form.Numero} onChange={set("Numero")} /></div>
                            <div className="ficha-field"><label>Piso</label><input type="text" value={form.Piso} onChange={set("Piso")} /></div>
                            <div className="ficha-field"><label>Puerta</label><input type="text" value={form.Puerta} onChange={set("Puerta")} /></div>
                            <div className="ficha-field"><label>Servicios Especiales</label><select value={form.ServiciosEspeciales} onChange={set("ServiciosEspeciales")}><option value=""></option>{SERVICIOS_ESP.map(s => <option key={s}>{s}</option>)}</select></div>
                            <div className="ficha-field"><label>Telefono</label><input type="text" value={form.Telefono} onChange={set("Telefono")} /></div>
                            <div className="ficha-field ficha-field--wide"><label>Direccion Google</label><input type="text" value={form.DireccionGoogle} onChange={set("DireccionGoogle")} /></div>
                            <div className="ficha-field">
                                <label>Verificar direccion Google</label>
                                <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                                    <input type="text" value={form.VerificarDireccionGoogle} onChange={set("VerificarDireccionGoogle")} />
                                    <span style={{fontSize:'18px', cursor:'pointer'}} onClick={() => setMapaAbierto(true)}>🌐</span>
                                </div>
                            </div>
                            <div className="ficha-field"><label>Direccion electronica</label><input type="email" value={form.Email} onChange={set("Email")} /></div>
                            <div className="ficha-field"><label>Persona de contacto</label><input type="text" value={form.PersonaContacto} onChange={set("PersonaContacto")} /></div>
                            <div className="ficha-field"><label>Otros Datos</label><input type="text" value={form.OtrosDatos} onChange={set("OtrosDatos")} /></div>
                            <div className="ficha-field"><label>Autorizacion / Comunicacion</label><input type="date" value={form.Autorizacion} onChange={set("Autorizacion")} /></div>
                            <div className="ficha-field"><label>Puesta en funcionamiento</label><input type="date" value={form.PuestaFuncionamiento} onChange={set("PuestaFuncionamiento")} /></div>
                            <div className="ficha-field"><label>Calificacion de suficiencia</label><input type="date" value={form.Calificacion} onChange={set("Calificacion")} /></div>
                            <div className="ficha-field"><label>Centro Inicial</label><input type="date" value={form.CentroInicial} onChange={set("CentroInicial")} /></div>
                        </div>
                    )}

                    {activeTab === "DatosUtilizacion" && (
                        <div className="ficha-util">
                            <div className="ficha-bloque">
                                <p className="ficha-bloque-titulo">Tipo de Centro</p>
                                <div className="ficha-radio-group">
                                    <label><input type="radio" name="tipoCentro" value="noSanitario" checked={form.TipoCentroRadio === "noSanitario"} onChange={set("TipoCentroRadio")} /> Centro NO Sanitario</label>
                                    <label><input type="radio" name="tipoCentro" value="hospitalarios" checked={form.TipoCentroRadio === "hospitalarios"} onChange={set("TipoCentroRadio")} /> Hospitales y Ambulatorios</label>
                                </div>
                            </div>
                            <div className="ficha-bloque">
                                <p className="ficha-bloque-titulo">Actividades del Centro</p>
                                <p className="ficha-bloque-sub">Selecciona las actividades del centro:</p>
                                <div className="ficha-checkbox-grid">
                                    <label><input type="checkbox" checked={form.ActividadHospitalaria} onChange={set("ActividadHospitalaria")} /> Asistencia sanitaria Hospitalaria</label>
                                    <label><input type="checkbox" checked={form.ActividadAmbulatoria} onChange={set("ActividadAmbulatoria")} /> Asistencia sanitaria ambulatoria</label>
                                    <label><input type="checkbox" checked={form.ActividadRehabilitacion} onChange={set("ActividadRehabilitacion")} /> Solamente rehabilitacion</label>
                                    <label><input type="checkbox" checked={form.ActividadControlIT} onChange={set("ActividadControlIT")} /> Control administrativo de IT</label>
                                    <label><input type="checkbox" checked={form.ActividadPrevencion} onChange={set("ActividadPrevencion")} /> Prevencion R.L seguridad social</label>
                                    <label><input type="checkbox" checked={form.ActividadOtras} onChange={set("ActividadOtras")} /> Otras Actividades</label>
                                    <label><input type="checkbox" checked={form.ActividadAdmon} onChange={set("ActividadAdmon")} /> Administracion general de la Mutua</label>
                                </div>
                            </div>
                            <div className="ficha-bloque">
                                <p className="ficha-bloque-titulo">Motivo de la baja</p>
                                <textarea className="ficha-textarea" value={form.MotivoBaja} onChange={e => setForm(f => ({ ...f, MotivoBaja: e.target.value }))} rows={4} />
                            </div>
                            <div className="ficha-fila">
                                <div className="ficha-field"><label>Fecha de baja</label><input type="date" value={form.FechaBaja} onChange={set("FechaBaja")} /></div>
                                <div className="ficha-field ficha-field--center"><label>Traslado</label><input type="checkbox" checked={form.Traslado} onChange={set("Traslado")} className="ficha-check-center" /></div>
                                <div className="ficha-field ficha-field--center"><label>Centro Desactivado</label><input type="checkbox" checked={form.CentroDesactivado} onChange={set("CentroDesactivado")} className="ficha-check-center" /></div>
                            </div>
                            <div className="ficha-bloque">
                                <p className="ficha-bloque-titulo">Nuevo Centro</p>
                                <input type="text" value={form.NuevoCentro} onChange={set("NuevoCentro")} style={{border:"1px solid #d0d0d0",borderRadius:3,padding:"5px 8px",width:"100%",fontSize:12.5,fontFamily:"inherit"}} />
                            </div>
                        </div>
                    )}

                    {activeTab === "RegistroICG" && (
                        <div className="ficha-datagrid-wrap">
                            <DataGrid dataSource={[]} showBorders={true} rowAlternationEnabled={true} noDataText="Sin datos para mostrar" onExporting={e => onExportingGrid(e, "RegistroICG")} className="mz-table" height={400}>
                                <Scrolling mode="standard" />
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10,20,50]} showPageSizeSelector={true} />
                                <FilterRow visible={true} />
                                <HeaderFilter visible={true} />
                                <Sorting mode="multiple" />
                                <Export enabled={true} />
                                <Column dataField="ano" caption="Ano" width={80} />
                                <Column dataField="mutua" caption="Mutua" width={220} />
                                <Column dataField="centro" caption="Centro" width={220} />
                                <Column dataField="fechaActualizacion" caption="Fecha de Actualizacion" width={180} dataType="date" format="dd/MM/yyyy" />
                                <Column dataField="usuario" caption="Usuario" width={150} />
                            </DataGrid>
                        </div>
                    )}

                    {activeTab === "FincasRegistrales" && (
                        <div className="ficha-datagrid-wrap">
                            <DataGrid dataSource={[]} showBorders={true} rowAlternationEnabled={true} noDataText="Sin datos para mostrar" onExporting={e => onExportingGrid(e, "FincasRegistrales")} className="mz-table" height={400}>
                                <Scrolling mode="standard" />
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10,20,50]} showPageSizeSelector={true} />
                                <FilterRow visible={true} />
                                <HeaderFilter visible={true} />
                                <Sorting mode="multiple" />
                                <Export enabled={true} />
                                <Column dataField="codigo" caption="Codigo" width={90} />
                                <Column dataField="cFinca" caption="C. Finca" width={100} />
                                <Column dataField="direccion" caption="Direccion" width={220} />
                                <Column dataField="superficie" caption="Superficie" width={100} />
                                <Column dataField="titularidad" caption="Titularidad" width={120} />
                                <Column dataField="coste" caption="Coste" width={100} dataType="number" format="#,##0.00" />
                                <Column dataField="fechaAlquiler" caption="Fecha Alquiler" width={130} dataType="date" format="dd/MM/yyyy" />
                                <Column dataField="fechaInscripcion" caption="Fecha Inscripcion" width={140} dataType="date" format="dd/MM/yyyy" />
                            </DataGrid>
                        </div>
                    )}

                    {activeTab === "Especialidades" && (
                        <div className="ficha-datagrid-wrap">
                            <div className="ficha-filtros-esp">
                                <div className="ficha-field"><label>Localizador</label><input type="text" value={form.Localizador} readOnly className="readonly" /></div>
                                <div className="ficha-field"><label>Mutua</label><select value={form.Mutua} onChange={set("Mutua")}><option value=""></option>{MUTUOS.map(m => <option key={m}>{m}</option>)}</select></div>
                                <div className="ficha-field"><label>Centro</label><input type="text" value={form.Centro} readOnly className="readonly" /></div>
                                <div className="ficha-field"><label>Especialidad</label><select><option value=""></option>{ESPECIALIDADES_LIST.map(e => <option key={e}>{e}</option>)}</select></div>
                                <div className="ficha-field"><label>Ano</label><select><option value=""></option>{ANOS.map(a => <option key={a}>{a}</option>)}</select></div>
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
                                <Column dataField="ene" caption="Ene" width={55} dataType="number" />
                                <Column dataField="feb" caption="Feb" width={55} dataType="number" />
                                <Column dataField="mar" caption="Mar" width={55} dataType="number" />
                                <Column dataField="abr" caption="Abr" width={55} dataType="number" />
                                <Column dataField="may" caption="May" width={55} dataType="number" />
                                <Column dataField="jun" caption="Jun" width={55} dataType="number" />
                                <Column dataField="jul" caption="Jul" width={55} dataType="number" />
                                <Column dataField="ago" caption="Ago" width={55} dataType="number" />
                                <Column dataField="sep" caption="Sep" width={55} dataType="number" />
                                <Column dataField="oct" caption="Oct" width={55} dataType="number" />
                                <Column dataField="nov" caption="Nov" width={55} dataType="number" />
                                <Column dataField="dic" caption="Dic" width={55} dataType="number" />
                                <Column dataField="total" caption="Total" width={70} dataType="number" />
                            </DataGrid>
                            <div className="ficha-acciones-bottom">
                                <button className="ficha-btn ficha-btn--actualizar">Actualizar</button>
                                <button className="ficha-btn ficha-btn--cancelar">Cancelar</button>
                            </div>
                        </div>
                    )}

                    {activeTab === "Catalogo" && (
                        <div className="ficha-datagrid-wrap">
                            <div className="ficha-filtros-esp">
                                <div className="ficha-field"><label>Localizador</label><input type="text" value={form.Localizador} readOnly className="readonly" /></div>
                                <div className="ficha-field"><label>Mutua</label><select value={form.Mutua} onChange={set("Mutua")}><option value=""></option>{MUTUOS.map(m => <option key={m}>{m}</option>)}</select></div>
                                <div className="ficha-field"><label>Centro</label><input type="text" value={form.Centro} readOnly className="readonly" /></div>
                                <div className="ficha-field"><label>Especialidad</label><select><option value=""></option>{ESPECIALIDADES_LIST.map(e => <option key={e}>{e}</option>)}</select></div>
                                <div className="ficha-field"><label>Ano</label><select><option value=""></option>{ANOS.map(a => <option key={a}>{a}</option>)}</select></div>
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
                                <Column dataField="catalogoCompletoServ" caption="Catalogo Completo de Servicios" width={250} />
                            </DataGrid>
                            <div className="ficha-acciones-bottom">
                                <button className="ficha-btn ficha-btn--actualizar">Actualizar</button>
                                <button className="ficha-btn ficha-btn--cancelar">Cancelar</button>
                            </div>
                        </div>
                    )}

                </div>
                {mapaAbierto && (
                    <MapaModal
                        latitud={form.Latitud}
                        longitud={form.Longitud}
                        direccion={form.DireccionGoogle}
                        onAceptar={(coords) => setForm(f => ({
                            ...f,
                            Latitud: coords.latitud,
                            Longitud: coords.longitud,
                            DireccionGoogle: coords.direccion
                        }))}
                        onCerrar={() => setMapaAbierto(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default FichaCliente;