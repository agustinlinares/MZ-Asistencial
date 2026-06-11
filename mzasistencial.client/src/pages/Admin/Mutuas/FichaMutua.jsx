import React, { useState, useEffect, useRef } from "react";
import '../../../styles/FichaGlobal.css';
import notify from 'devextreme/ui/notify';
import './FichaMutua.css';
import MapaModal from '../../Admin/Centros/MapaModal'; // La ruta a MapaModal.jsx
import { useLogError } from '../../../hooks/useLogError';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import DataGrid, {
    Column,
    Paging,
    FilterRow,
    HeaderFilter,
    Pager,
    Scrolling,
    Sorting,
    GroupPanel,
    Grouping,
    Export
} from "devextreme-react/data-grid";


// Recibimos dos props:
// - mutua: los datos de la fila que clickó el usuario
// - onClose: la función para cerrar la ficha
const FichaMutua = ({ mutua, onClose }) => {

    // Estado que controla qué pestaña está activa
    // Por defecto empieza en "general"
    const [activeTab, setActiveTab] = useState("general");

    // Estado para guardar los datos completos de la mutua -segun el DTO-
    // Empieza con los datos básicos que ya tenemos de la lista
    const [datosMutua, setDatosMutua] = useState(mutua);

    // Estado para el formulario editable
    // Es una copia de los datos que el usuario puede modificar
    const [form, setForm] = useState({});

    // Listas para los combos
    const [provincias, setProvincias] = useState([]);
    const [poblaciones, setPoblaciones] = useState([]);
    // IDs seleccionados para filtrar
    const [provinciaId, setProvinciaId] = useState(null);

    // Referencia para el foco inicial igual que FichaFinca
    const modalRef = useRef(null);

    // Función helper para actualizar un campo del form
    // "key" es el nombre del campo, "e" es el evento del input
    const set = (key) => (e) => {
        setForm(f => ({ ...f, [key]: e.target.value }));
    };

    //Sirve para detectar si la mutua que se va a guarda es nueva
    const esNuevo = !mutua.numeroId;

    // Estado para errores de validación
    const [errors, setErrors] = useState({});

    // Estado para centros propios
    const [centrosPropios, setCentrosPropios] = useState([]);

    // Estado para el modal del mapa
    const [mapaData, setMapaData] = useState(null); // null = cerrado

    // Estado para conciertos
    const [conciertos, setConciertos] = useState([]);

    // Estados para especialidades
    const [especialidadesPropios, setEspecialidadesPropios] = useState([]);
    const [especialidadesConciertos, setEspecialidadesConciertos] = useState([]);

    const logError = useLogError("Ficha mutua");

    // Función para exportar a Excel cualquier DataGrid
    const exportarExcel = (gridRef, nombreArchivo) => {
        const grid = gridRef.current?.instance();
        if (!grid) return;
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(nombreArchivo);
        exportDataGrid({ component: grid, worksheet, autoFilterEnabled: true })
            .then(() => workbook.xlsx.writeBuffer())
            .then(buffer => saveAs(new Blob([buffer]), `${nombreArchivo}.xlsx`));
    };

    // Función para exportar a PDF cualquier DataGrid
    const exportarPDF = (gridRef, nombreArchivo) => {
        const grid = gridRef.current?.instance();
        if (!grid) return;
        import('devextreme/pdf_exporter').then(({ exportDataGrid: exportPDF }) => {
            import('jspdf').then(({ jsPDF }) => {
                const doc = new jsPDF({ orientation: 'landscape' });
                exportPDF({ jsPDFDocument: doc, component: grid, indent: 5 })
                    .then(() => doc.save(`${nombreArchivo}.pdf`));
            });
        });
    };      

    // Refs para los DataGrids de las pestañas
    const centrosPropiosGridRef = useRef(null);
    const conciertosGridRef = useRef(null);

    // Igual que FichaFinca: foco al abrir y cerrar con Escape
    useEffect(() => {
        modalRef.current?.focus();
        const handler = e => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // Cuando se abre la ficha, pedimos los datos del DTO
    // useEffect se ejecuta automáticamente cuando el componente aparece en pantalla
    useEffect(() => {

        // Si es nuevo - No hace fetch
        if (!mutua.numeroId) {
            setForm({
                mutua: "",
                razonSocial: "",
                provincia: "",
                poblacion: "",
                poblacionId: null,
                direccion: "",
                cp: "",
                telefono: "",
                fax: "",
                direccionElectronica: "",
                personaContacto: "",
                numeroMutua: "",
            });
            return;
        }
        
        // Si es edición - Fetch normal
        fetch(`/api/mutuas/${mutua.numeroId}`)
            .then(response => response.json())
            .then(data => {
                //console.log("Datos completos del DTO:", data);
                setDatosMutua(data); // Guardamos los datos detallados en el DTO

                // Inicializamos el form con los datos recibidos
                setForm({
                    mutua: data.mutua || "",
                    razonSocial: data.razonSocial || "",
                    provincia: data.provincia || "",
                    poblacion: data.poblacion || "",
                    poblacionId: data.poblacionId || null,
                    direccion: data.direccion || "",
                    cp: data.cp || "",
                    telefono: data.telefono || "",
                    fax: data.fax || "",
                    direccionElectronica: data.direccionElectronica || "",
                    personaContacto: data.personaContacto || "",
                    numeroMutua: data.numeroMutua || "",
                });

            })
            .catch(error => console.error("Error cargando ficha mutua:", error));
    }, [mutua]); // Se ejecuta esto solo una vez, al abrirse.

    // Carga todas las provincias al abrir la ficha
    useEffect(() => {
        fetch('/api/auxprovincias')
            .then(r => r.json())
            .then(data => setProvincias(data))
            .catch(err => console.error("Error cargando provincias:", err));
    }, []);

    useEffect(() => {
        if (provincias.length === 0 || !datosMutua.provincia) return;
        
        const provEncontrada = provincias.find(
            p => p.provincia.trim() === datosMutua.provincia?.trim()
        );
        if (provEncontrada) {
            setProvinciaId(provEncontrada.provinciaId);
            // También inicializamos el poblacionId
            setForm(f => ({ ...f, poblacionId: datosMutua.poblacionId || null }));
        }
    }, [provincias, datosMutua]);

    // Cuando el usuario elige una provincia, carga sus poblaciones
    useEffect(() => {
        if (!provinciaId) return;
        fetch(`/api/auxpoblaciones/${provinciaId}`)
            .then(r => r.json())
            .then(data => setPoblaciones(data))
            .catch(err => console.error("Error cargando poblaciones:", err));
    }, [provinciaId]); // Se ejecuta cada vez que provincia cambia

    // Carga centros propios cuando se abre la pestaña
    useEffect(() => {
        if (activeTab !== "centrosPropios" || !mutua.numeroId) return;
        fetch(`/api/mutuas/${mutua.numeroId}/centrosPropios`)
            .then(r => r.json())
            .then(data => setCentrosPropios(data))
            .catch(err => console.error("Error cargando centros propios:", err));
    }, [activeTab, mutua.numeroId]);

    // Carga conciertos cuando se abre la pestaña
    useEffect(() => {
        if (activeTab !== "conciertos" || !mutua.numeroId) return;
        fetch(`/api/mutuas/${mutua.numeroId}/conciertos`)
            .then(r => r.json())
            .then(data => setConciertos(data))
            .catch(err => console.error("Error cargando conciertos:", err));
    }, [activeTab, mutua.numeroId]);

    // Carga especialidades propios cuando se abre la pestaña
    useEffect(() => {
        if (activeTab !== "especialidadesPropios" || !mutua.numeroId) return;
        fetch(`/api/mutuas/${mutua.numeroId}/especialidadesPropios`)
            .then(r => r.json())
            .then(data => setEspecialidadesPropios(data))
            .catch(err => console.error("Error cargando especialidades propios:", err));
    }, [activeTab, mutua.numeroId]);

    // Carga especialidades conciertos cuando se abre la pestaña
    useEffect(() => {
        if (activeTab !== "especialidadesConciertos" || !mutua.numeroId) return;
        fetch(`/api/mutuas/${mutua.numeroId}/especialidadesConciertos`)
            .then(r => r.json())
            .then(data => setEspecialidadesConciertos(data))
            .catch(err => console.error("Error cargando especialidades conciertos:", err));
    }, [activeTab, mutua.numeroId]);

    // función que llama al PUT cuando el usuario pulsa Aceptar
    const handleGuardar = async () => {

        // Validación de campos obligatorios
        const newErrors = {};
        if (!form.mutua) newErrors.mutua = true;
        if (!form.razonSocial) newErrors.razonSocial = true;
        if (!form.direccion) newErrors.direccion = true;
        if (!form.cp) newErrors.cp = true;
        if (!form.telefono) newErrors.telefono = true;
        if (!form.fax) newErrors.fax = true;
        if (!form.personaContacto) newErrors.personaContacto = true;
        if (!provinciaId) newErrors.provincia = true;
        if (!form.poblacionId) newErrors.poblacion = true;
        if (!form.numeroMutua) newErrors.numeroMutua = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // No guardamos si hay errores
        }

        // Obtenemos el usuario de la sesión
        const userData = JSON.parse(
            localStorage.getItem('UsuarioActual') ||
            sessionStorage.getItem('user') ||
            '{}'
        );
        const usuarioId = userData.usuarioId || userData.UsuarioId || null;

        // Comprobamos unicidad del número de mutua
        const mutuaIdParam = esNuevo ? '' : `&mutuaId=${mutua.numeroId}`;
        const checkRes = await fetch(`/api/mutuas/comprobarNumero?numero=${form.numeroMutua}${mutuaIdParam}`);
        const yaExiste = await checkRes.json();
        if (yaExiste) {
            setErrors(f => ({ ...f, numeroMutua: true }));
            notify('El número de mutua ya existe en el sistema', 'error', 3000);
            return;
        }

    
        try {

            const url = esNuevo 
                ? '/api/mutuas' 
                : `/api/mutuas/${mutua.numeroId}`;

            const method = esNuevo ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    //numeroId: mutua.numeroId,
                    ...(esNuevo ? {} : { numeroId: mutua.numeroId }),

                    mutua: form.mutua,
                    razonSocial: form.razonSocial,
                    direccion: form.direccion,
                    poblacionId: form.poblacionId,
                    cp: form.cp,
                    telefono: form.telefono,
                    fax: form.fax,
                    // Email opcional — si está vacío se envía null
                    direccionElectronica: form.direccionElectronica || null,
                    personaContacto: form.personaContacto,
                    numeroMutua: form.numeroMutua,
                    // Usuario de la sesión para el registro de actividad
                    usuarioId: usuarioId,
                })
            });

            if (response.ok) {
                notify(esNuevo ? 'Mutua creada correctamente' : 'Mutua guardada correctamente', 'success', 2000);
                onClose();
            } else {
                const status = response.status;
                logError(`Fallo al ${esNuevo ? 'crear' : 'actualizar'} Mutua (ID: ${mutua?.numeroId || 'Nueva'}). Estado: ${status}`);
                notify('Error al guardar la mutua', 'error', 3000);
            }

        } catch (error) {
            console.error("Error guardando mutua:", error);
            logError(`Error crítico de red al guardar Mutua (ID: ${mutua?.numeroId || 'Nueva'})`, error);
            notify('Error de conexión', 'error', 3000);
        }
    };

    return (
        <div className="ficha-container-inline" role="region" aria-label={`Ficha Mutua ${datosMutua.numeroMutua}`}>
            <div className="ficha-inline-content" ref={modalRef} tabIndex={-1}>

                {/* HEADER */}
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">
                        {/*✏️ Ficha Mutua | {datosMutua.numeroMutua || '—'}*/}
                         Ficha Mutua | {datosMutua.numeroMutua || '—'} | {datosMutua.mutua || '—'}
                    </span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={handleGuardar}>✓ Aceptar</button>
                        <button className="ficha-btn-secondary" onClick={onClose}>✗ Salir</button>
                    </div>
                </div>

                {/* PESTAÑAS HORIZONTALES*/}
                <div className="ficha-tabs">
                    <button
                        className={`ficha-tab ${activeTab === "general" ? "active" : ""}`}
                        onClick={() => setActiveTab("general")}
                    >
                        General
                    </button>

                    {/* Solo mostramos el resto de pestañas si la mutua ya existe */}
                    {!esNuevo && (
                        <>
                            <button
                                className={`ficha-tab ${activeTab === "centrosPropios" ? "active" : ""}`}
                                onClick={() => setActiveTab("centrosPropios")}
                            >
                                Centros Propios
                            </button>
                            <button
                                className={`ficha-tab ${activeTab === "conciertos" ? "active" : ""}`}
                                onClick={() => setActiveTab("conciertos")}
                            >
                                Conciertos
                            </button>
                            <button
                                className={`ficha-tab ${activeTab === "especialidadesPropios" ? "active" : ""}`}
                                onClick={() => setActiveTab("especialidadesPropios")}
                            >
                                Especialidades / Serv. (Propios)
                            </button>
                            <button
                                className={`ficha-tab ${activeTab === "especialidadesConciertos" ? "active" : ""}`}
                                onClick={() => setActiveTab("especialidadesConciertos")}
                            >
                                Especialidades / Serv. (Conciertos)
                            </button>
                        </>
                    )}
                </div>

                {/* CONTENIDO DE CADA PESTAÑA */}
                <div className="ficha-tab-content">

                    {/* PESTAÑA GENERAL — muestra los datos de la mutua */}
                    {activeTab === "general" && (
                        <div className="ficha-grid">

                            <div className="ficha-field">
                                <label>Mutua</label>
                                {/* Usa form.mutua y tiene onChange */}
                                <input 
                                    type="text" 
                                    className={errors.mutua ? 'error' : ''}
                                    value={form.mutua || ""} 
                                    onChange={(e)=>{
                                        set("mutua")(e);
                                        setErrors(f => ({ ...f, mutua: false })); // limpia el error al escribir
                                    }} 
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Código Razón Social</label>
                                <input 
                                    type="text" 
                                    className={errors.razonSocial ? 'error' : ''}
                                    value={form.razonSocial || ""} 
                                    onChange={(e)=>{
                                        set("razonSocial")(e);
                                        setErrors(f => ({ ...f, razonSocial: false })); // limpia el error al escribir
                                    }} 
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Provincia</label>
                                <select
                                    className={errors.provincia ? 'error' : ''}
                                    value={provinciaId || ""}
                                    onChange={(e) => {
                                        const id = parseInt(e.target.value);
                                        setProvinciaId(id);
                                        // Busca el nombre de la provincia para guardarlo en el form
                                        const prov = provincias.find(p => p.provinciaId === id);
                                        setForm(f => ({ ...f, provincia: prov?.provincia || "", poblacion: "" }));
                                        setPoblaciones([]); // limpia el combo de población
                                        setErrors(f => ({ ...f, provincia: false })); // limpia el error
                                    }}
                                >
                                    <option value="">-- Selecciona provincia --</option>
                                    {provincias.map(p => (
                                        <option key={p.provinciaId} value={p.provinciaId}>
                                            {p.provincia}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="ficha-field">
                                <label>Población</label>
                                <select
                                    className={errors.poblacion ? 'error' : ''}
                                    value={form.poblacionId || ""}
                                    onChange={(e) => {
                                        const id = parseInt(e.target.value);
                                        const pob = poblaciones.find(p => p.poblacionId === id);
                                        setForm(f => ({ 
                                            ...f, 
                                            poblacion: pob?.poblacion || "",
                                            poblacionId: id  // Guardamos el id
                                        }));
                                        setErrors(f => ({ ...f, poblacion: false })); // limpia el error
                                    }}
                                    disabled={!provinciaId} // deshabilitado hasta que haya provincia
                                >
                                    <option value="">-- Selecciona población --</option>
                                    {poblaciones.map(p => (
                                        <option key={p.poblacionId} value={p.poblacionId}>
                                            {p.poblacion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="ficha-field">
                                <label>Dirección</label>
                                <input 
                                    type="text" 
                                    className={errors.direccion ? 'error' : ''}
                                    value={form.direccion || ""} 
                                    onChange={(e)=>{
                                        set("direccion")(e);
                                        setErrors(f => ({ ...f, direccion: false })); // limpia el error al escribir
                                    }} 
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Código Postal</label>
                                <input 
                                    type="text" 
                                    className={errors.cp ? 'error' : ''}
                                    value={form.cp || ""} 
                                    onChange={(e)=>{
                                        set("cp")(e);
                                        setErrors(f => ({ ...f, cp: false })); // limpia el error al escribir
                                    }} 
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Teléfono</label>
                                <input 
                                    type="text" 
                                    className={errors.telefono ? 'error' : ''}
                                    value={form.telefono || ""} 
                                    onChange={(e)=>{
                                        set("telefono")(e);
                                        setErrors(f => ({ ...f, telefono: false })); // limpia el error al escribir
                                    }} 
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Fax</label>
                                <input 
                                    type="text" 
                                    className={errors.fax ? 'error' : ''}
                                    value={form.fax || ""} 
                                    onChange={(e)=>{
                                        set("fax")(e);
                                        setErrors(f => ({ ...f, fax: false })); // limpia el error al escribir
                                    }} 
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Dirección Electrónica</label>
                                <input type="text" value={form.direccionElectronica || ""} onChange={set("direccionElectronica")} />
                            </div>
                            <div className="ficha-field">
                                <label>Persona de Contacto</label>
                                <input 
                                    type="text" 
                                    className={errors.personaContacto ? 'error' : ''}
                                    value={form.personaContacto || ""} 
                                    onChange={(e)=>{
                                        set("personaContacto")(e);
                                        setErrors(f => ({ ...f, personaContacto: false })); // limpia el error al escribir
                                    }} 
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Número de Mutua</label>
                                {/*ahora es editable tanto en alta como en edición */}
                                <input
                                    type="text"
                                    className={errors.numeroMutua ? 'error' : ''}
                                    value={form.numeroMutua || ""}
                                    onChange={(e) => {
                                        set("numeroMutua")(e);
                                        setErrors(f => ({ ...f, numeroMutua: false }));
                                    }}
                                    //placeholder="Ej: 001"
                                    maxLength={3}
                                />
                            </div>

                        </div>
                    )}

                    {/* PESTAÑAS CENTROS PROPIOS — ??? */}
                    {activeTab === "centrosPropios" && (
                            <div style={{ padding: '8px 0' }}>

                                {/* Modal del mapa — se abre al pulsar el icono */}
                                {mapaData && (
                                    <MapaModal
                                        latitud={mapaData.latitud}
                                        longitud={mapaData.longitud}
                                        direccion={mapaData.direccion}
                                        onAceptar={() => {}} // solo lectura, no guardamos
                                        onCerrar={() => setMapaData(null)}
                                    />
                                )}

                                {/* Botones exportar */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '8px' }}>
                                    <button className="ficha-btn-secondary" onClick={() => exportarExcel(centrosPropiosGridRef, 'CentrosPropios')}>
                                        <i className="ri-file-excel-2-line" style={{ color: '#2e7d32', marginRight: 4 }}></i>
                                        Exportar a Excel
                                    </button>
                                    <button className="ficha-btn-secondary" onClick={() => exportarPDF(centrosPropiosGridRef, 'CentrosPropios')}>
                                        <i className="ri-file-pdf-line" style={{ color: '#c62828', marginRight: 4 }}></i>
                                        Exportar a PDF
                                    </button>
                                </div>

                                <DataGrid
                                    ref={centrosPropiosGridRef}  /* Ref de los botones*/
                                    dataSource={centrosPropios} // Conectar con el endpoint
                                    showBorders={true}
                                    rowAlternationEnabled={true}
                                    noDataText="Sin datos para mostrar"
                                    className="mz-table"
                                    columnAutoWidth={false}
                                    width="100%"    
                                    height={400}
                                >
                                    <Scrolling mode="standard" />
                                    <Paging defaultPageSize={10} />
                                    <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10,20,50]} showPageSizeSelector={true} />
                                    <FilterRow visible={true} />
                                    <HeaderFilter visible={true} />
                                    <Sorting mode="multiple" />
                                    <Column dataField="localizador" caption="Localizador" width="11%" />
                                    <Column dataField="centro" caption="Centro" width="17%" />
                                    <Column dataField="cp" caption="C.P" width="7%" />
                                    <Column dataField="poblacion" caption="Población" width="11%" />
                                    <Column dataField="provincia" caption="Provincia" width="11%" />
                                    <Column dataField="telefono" caption="Teléfono" width="10%" />
                                    <Column dataField="contacto" caption="Contacto" width="12%" />
                                    <Column dataField="email" caption="Email" width="14%" />
                                    
                                    {/* Columna Mapa — abre el MapaModal */}
                                    <Column
                                        caption="Mapa"
                                        width="6%"
                                        alignment="center"
                                        cellRender={(cell) => {
                                            const { latitud, longitud, centro } = cell.data;
                                            if (!latitud || !longitud) return <span style={{ color: '#aaa' }}>—</span>;
                                            return (
                                                <div
                                                    style={{ color: '#1a5fa8', cursor: 'pointer', textAlign: 'center' }}
                                                    title="Ver en mapa"
                                                    onClick={() => setMapaData({
                                                        latitud,
                                                        longitud,
                                                        direccion: centro
                                                    })}
                                                >
                                                    <i className="ri-map-pin-line"></i>
                                                </div>
                                            );
                                        }}
                                    />

                                    <Column dataField="validado" caption="Validado" width="11%" alignment="center" />
                                </DataGrid>
                            </div>
                    )}

                    {/* PESTAÑAS CONCIERTOS — ??? */}
                    {activeTab === "conciertos" && (
                        <div style={{ padding: '8px 0' }}>

                            {/* Modal del mapa */}
                            {mapaData && (
                                <MapaModal
                                    latitud={mapaData.latitud}
                                    longitud={mapaData.longitud}
                                    direccion={mapaData.direccion}
                                    onAceptar={() => {}}
                                    onCerrar={() => setMapaData(null)}
                                />
                            )}

                            {/* Botones exportar */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '8px' }}>
                                <button className="ficha-btn-secondary" onClick={() => exportarExcel(conciertosGridRef, 'Conciertos')}>
                                    <i className="ri-file-excel-2-line" style={{ color: '#2e7d32', marginRight: 4 }}></i>
                                    Exportar a Excel
                                </button>
                                <button className="ficha-btn-secondary" onClick={() => exportarPDF(conciertosGridRef, 'Conciertos')}>
                                    <i className="ri-file-pdf-line" style={{ color: '#c62828', marginRight: 4 }}></i>
                                    Exportar a PDF
                                </button>
                            </div>

                            <DataGrid
                                ref={conciertosGridRef}  /* Ref de los botones*/
                                dataSource={conciertos} // TODO: fetch /api/conciertos?mutuaId={mutua.numeroId}
                                showBorders={true}
                                rowAlternationEnabled={true}
                                noDataText="Sin datos para mostrar"
                                className="mz-table"
                                columnAutoWidth={false}
                                width="100%"
                                height={400}
                            >
                                <Scrolling mode="standard" />
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10,20,50]} showPageSizeSelector={true} />
                                <FilterRow visible={true} />
                                <HeaderFilter visible={true} />
                                <Sorting mode="multiple" />
                                <Column dataField="codMutua" caption="Cód. Mutua" width="12%" alignment="left"/>
                                <Column dataField="codCentro" caption="Cód. Centro" width="14%" alignment="center"/>
                                <Column dataField="centro" caption="Centro" width="15%" />
                                <Column dataField="cifNif" caption="CIF/NIF" width="8%" />
                                <Column dataField="cp" caption="C.P" width="7%" />
                                <Column dataField="poblacion" caption="Población" width="11%" />
                                <Column dataField="provincia" caption="Provincia" width="11%" />
                                <Column dataField="contacto" caption="Contacto" width="12%" />
                                <Column dataField="email" caption="Email" width="15%" />
                                <Column
                                    caption="Mapa"
                                    width="6%"
                                    alignment="center"
                                    cellRender={(cell) => {
                                        const { latitud, longitud, centro } = cell.data;
                                        if (!latitud || !longitud) return <span style={{ color: '#aaa' }}>—</span>;
                                        return (
                                            <div
                                                style={{ color: '#1a5fa8', cursor: 'pointer', textAlign: 'center' }}
                                                title="Ver en mapa"
                                                onClick={() => setMapaData({ latitud, longitud, direccion: centro })}
                                            >
                                                <i className="ri-map-pin-line"></i>
                                            </div>
                                        );
                                    }}
                                />
                                <Column dataField="autorizado" caption="Autorizado" width="14%" alignment="center"/>
                            </DataGrid>
                        </div>
                    )}

                    {/* PESTAÑAS ESPECIALIDADES /SERV. (PROPIOS) — ??? */}
                    {activeTab === "especialidadesPropios" && (
                        <div style={{ padding: '8px 0' }}>
                            <DataGrid
                                dataSource={especialidadesPropios} // TODO: fetch /api/especialidades/propios?mutuaId={mutua.numeroId}
                                showBorders={true}
                                rowAlternationEnabled={true}
                                noDataText="Sin datos para mostrar"
                                className="mz-table"
                                columnAutoWidth={false}
                                width="100%"
                                height={400}
                            >
                                <Scrolling mode="standard" />
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10,20,50]} showPageSizeSelector={true} />
                                <FilterRow visible={true} />
                                <HeaderFilter visible={true} />
                                <Sorting mode="multiple" />
                                <GroupPanel visible={true} placeholder="Arrastre una columna aquí para agrupar por dicha columna" />
                                <Grouping autoExpandAll={false} />
                                <Column dataField="ano" caption="Año" width="10%" />
                                <Column dataField="servicio" caption="Servicio" width="40%" />
                                <Column dataField="especialidad" caption="Especialidad" width="30%" />
                                <Column dataField="cantidad" caption="Cantidad" width="20%" />
                            </DataGrid>
                        </div>
                    )}

                    {/* PESTAÑAS ESPECIALIDADES /SERV. (CONCIERTOS) — ??? */}
                    {activeTab === "especialidadesConciertos" && (
                        <div style={{ padding: '8px 0' }}>
                            <DataGrid
                                dataSource={especialidadesConciertos} // TODO: fetch /api/especialidades/conciertos?mutuaId={mutua.numeroId}
                                showBorders={true}
                                rowAlternationEnabled={true}
                                noDataText="Sin datos para mostrar"
                                className="mz-table"
                                columnAutoWidth={false}
                                width="100%"
                                height={400}
                            >
                                <Scrolling mode="standard" />
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} showInfo={true} showNavigationButtons={true} displayMode="full" allowedPageSizes={[10,20,50]} showPageSizeSelector={true} />
                                <FilterRow visible={true} />
                                <HeaderFilter visible={true} />
                                <Sorting mode="multiple" />
                                <GroupPanel visible={true} placeholder="Arrastre una columna aquí para agrupar por dicha columna" />
                                <Grouping autoExpandAll={false} />
                                <Column dataField="ano" caption="Año" width="10%" />
                                <Column dataField="servicio" caption="Servicio" width="40%" />
                                <Column dataField="especialidad" caption="Especialidad" width="30%" />
                                <Column dataField="cantidad" caption="Cantidad" width="20%" />
                            </DataGrid>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FichaMutua;