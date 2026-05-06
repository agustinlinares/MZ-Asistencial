import React, { useEffect, useRef, useState, useCallback } from "react";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid as exportDataGridToExcel } from 'devextreme/excel_exporter';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import DataGrid, {
    Column, Paging, FilterRow, HeaderFilter, Selection,
    GroupPanel, Grouping, ColumnChooser, Export, Scrolling,
    Sorting, ColumnFixing, Pager, Toolbar, Item,
} from "devextreme-react/data-grid";
import DateBox from "devextreme-react/date-box";
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import RadioGroup from "devextreme-react/radio-group";
import { Button } from "devextreme-react/button";
import { useTranslation } from "react-i18next";
import '../../../styles/FichaGlobal.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5118/api';
const TIPOS = ['Todos', 'Anuales', 'Individuales'];
const VISTAS = ['Agrupada', 'Desagrupada'];

const GestionDemanda = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const buscarRef = useRef(null);
    const menuRef = useRef(null);

    const [tipo, setTipo] = useState('Todos');
    const [vista, setVista] = useState('Agrupada');
    const [añoSeleccionado, setAñoSeleccionado] = useState(null);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
    const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);

    const [fechaSolicitudDesde, setFechaSolicitudDesde] = useState(null);
    const [fechaSolicitudHasta, setFechaSolicitudHasta] = useState(null);
    const [fechaAsignacionDesde, setFechaAsignacionDesde] = useState(null);
    const [fechaAsignacionHasta, setFechaAsignacionHasta] = useState(null);
    const [fechaConfirmacionDesde, setFechaConfirmacionDesde] = useState(null);
    const [fechaConfirmacionHasta, setFechaConfirmacionHasta] = useState(null);
    const [necesidadesServicio, setNecesidadesServicio] = useState('');
    const [contestacionNecesidades, setContestacionNecesidades] = useState('');
    const [demandaId, setDemandaId] = useState('');

    const [años, setAños] = useState([]);
    const [estados, setEstados] = useState([]);
    const [datos, setDatos] = useState([
        {
            demandaId: 1001,
            año: 2026,
            mutuaSolicitante: "Prevensalud",
            mutuaOfertante: "Laboralia",
            localidad: "Getafe",
            centro: "CENTRO MEDICO GETAFE (TEST)",
            especialidad: "Fisioterapia",
            tipoMovimiento: "Individual",
            servicio: "Rehabilitación",
            fechaConfirmacion: new Date(),
            peticionesAsignadas: 5,
            peticionesPendientes: 2,
            ene: 2, feb: 1, mar: 4, abr: 0, may: 0, jun: 0,
            jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
            total: 7
        },
        {
            demandaId: 1002,
            año: 2026,
            mutuaSolicitante: "Laboralia",
            mutuaOfertante: "Prevensalud",
            localidad: "Madrid",
            centro: "Centro Médico Retiro",
            especialidad: "Medicina General",
            tipoMovimiento: "Anual",
            servicio: "Consulta",
            fechaConfirmacion: new Date(),
            peticionesAsignadas: 10,
            peticionesPendientes: 0,
            ene: 10, feb: 10, mar: 10, abr: 10, may: 10, jun: 10,
            jul: 10, ago: 10, sep: 10, oct: 10, nov: 10, dic: 10,
            total: 120
        }
    ]);
    const [cargando, setCargando] = useState(false);

    // --- EXPORTACIÓN ---
    const exportToExcel = () => {
        const context = dataGridRef.current.instance();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Lista Demandas');
        exportDataGridToExcel({ component: context, worksheet, autoFilterEnabled: true }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ListaDemanda.xlsx');
            });
        });
    };

    const exportToPdf = () => {
        const doc = new jsPDF('l', 'mm', 'a4');
        const context = dataGridRef.current.instance();
        exportDataGridToPdf({ jsPDFDocument: doc, component: context }).then(() => {
            doc.save('ListaDemanda.pdf');
        });
    };

    // --- BÚSQUEDA ---
    const ejecutarBusqueda = useCallback((filtros) => {
        fetch(`${API}/ListaDemanda/lista`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filtros),
        })
            .then(res => res.json())
            .then(data => setDatos(data))
            .catch(err => console.error('Error:', err))
            .finally(() => setCargando(false));
    }, []);

    const buscar = useCallback(() => {
        setCargando(true);
        ejecutarBusqueda({
            año: añoSeleccionado,
            estadoId: estadoSeleccionado,
            tipo: tipo === 'Todos' ? null : tipo,
            vistaAgrupada: vista === 'Agrupada',
            fechaSolicitudDesde, fechaSolicitudHasta,
            fechaAsignacionDesde, fechaAsignacionHasta,
            fechaConfirmacionDesde, fechaConfirmacionHasta,
            necesidadesServicio, contestacionNecesidades,
            demandaId: demandaId ? parseInt(demandaId) : null,
        });
    }, [añoSeleccionado, estadoSeleccionado, tipo, vista, fechaSolicitudDesde, fechaSolicitudHasta, fechaAsignacionDesde, fechaAsignacionHasta, fechaConfirmacionDesde, fechaConfirmacionHasta, necesidadesServicio, contestacionNecesidades, demandaId, ejecutarBusqueda]);

    useEffect(() => { buscarRef.current = buscar; }, [buscar]);

    useEffect(() => {
        fetch(`${API}/ListaDemanda/años`).then(res => res.json()).then(data => {
            setAños(data);
            if (data.length > 0) setAñoSeleccionado(data[0]);
        });
        fetch(`${API}/ListaDemanda/estados`).then(res => res.json()).then(data => {
            setEstados([{ estadoId: null, estado: 'Todas' }, ...data]);
        });
    }, []);

    useEffect(() => {
        if (añoSeleccionado !== null) buscarRef.current();
    }, [añoSeleccionado, estadoSeleccionado, tipo]);

    const limpiarFiltros = () => {
        setFechaSolicitudDesde(null); setFechaSolicitudHasta(null);
        setFechaAsignacionDesde(null); setFechaAsignacionHasta(null);
        setFechaConfirmacionDesde(null); setFechaConfirmacionHasta(null);
        setNecesidadesServicio(''); setContestacionNecesidades(''); setDemandaId('');
    };

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content">
                <div className="header-page">
                    <div className="title">{t('Gestión de Demanda')}</div>
                    <div className="acciones-container" ref={menuRef}>
                        <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                            <i className="ri-settings-3-line"></i> {t('Acciones')}
                        </div>
                        {menuAbierto && (
                            <div className="acciones-menu">
                                <div className="acciones-item" onClick={exportToExcel}>
                                    <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i> {t('Exportar a Excel')}
                                </div>
                                <div className="acciones-item" onClick={exportToPdf}>
                                    <i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i> {t('Exportar a PDF')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* FILTROS (Igual que Oferta) */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', background: '#fafafa' }}>
                    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div className="ficha-field"><label>Tipo</label>
                            <RadioGroup items={TIPOS} value={tipo} onValueChanged={e => setTipo(e.value)} layout="horizontal" />
                        </div>
                        <div className="ficha-field"><label>Año</label>
                            <SelectBox items={años} value={añoSeleccionado} onValueChanged={e => setAñoSeleccionado(e.value)} width={200} />
                        </div>
                        <div className="ficha-field"><label>Estado</label>
                            <SelectBox dataSource={estados} displayExpr="estado" valueExpr="estadoId" value={estadoSeleccionado} onValueChanged={e => setEstadoSeleccionado(e.value)} width={220} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginTop: 16 }}>
                        <div className="ficha-field"><label>Vista</label>
                            <RadioGroup items={VISTAS} value={vista} onValueChanged={e => setVista(e.value)} layout="horizontal" />
                        </div>
                        <button className="ficha-btn-primary" onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}>
                            {filtrosExpandidos ? '- Filtros' : '+ Filtros'}
                        </button>
                    </div>

                    {filtrosExpandidos && (
                        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 24px', paddingTop: 16, borderTop: '1px solid #e0e0e0' }}>
                            <div className="ficha-field"><label>Fecha solicitud desde</label><DateBox value={fechaSolicitudDesde} onValueChanged={e => setFechaSolicitudDesde(e.value)} displayFormat="dd/MM/yyyy" width="100%" /></div>
                            <div className="ficha-field"><label>Fecha solicitud hasta</label><DateBox value={fechaSolicitudHasta} onValueChanged={e => setFechaSolicitudHasta(e.value)} displayFormat="dd/MM/yyyy" width="100%" /></div>
                            {/* ... resto de campos de fecha ... */}
                            <div className="ficha-field"><label>Demanda ID</label><TextBox value={demandaId} onValueChanged={e => setDemandaId(e.value)} width="100%" /></div>
                            <div style={{ gridColumn: '3', display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'flex-end' }}>
                                <button className="ficha-btn-secondary" onClick={limpiarFiltros}>Limpiar Filtros</button>
                                <button className="ficha-btn-primary" onClick={buscar}>Buscar</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* TABLA (Columnas según image_db5036.png) */}
                <div className="ficha-tab-content" style={{ padding: '16px' }}>
                    <DataGrid
                        ref={dataGridRef}
                        dataSource={datos}
                        keyExpr="demandaId"
                        showBorders={true}
                        allowColumnResizing={true}
                        className="mz-table"
                        rowAlternationEnabled={true}
                        noDataText={cargando ? 'Cargando...' : 'Sin datos para mostrar'}
                    >
                        <Scrolling mode="standard" showScrollbar="always" />
                        <Paging defaultPageSize={25} />
                        <FilterRow visible={true} />
                        <HeaderFilter visible={true} />
                        <Selection mode="multiple" />
                        <GroupPanel visible={vista === 'Agrupada'} emptyPanelText="Especialidad / Servicio" />
                        <ColumnChooser enabled mode="select" />
                        <ColumnFixing enabled />

                        <Toolbar>
                            <Item name="groupPanel" />
                            <Item location="after"><Button icon="refresh" stylingMode="text" onClick={buscar} /></Item>
                            <Item name="columnChooserButton" />
                        </Toolbar>

                        <Column dataField="año" caption="Año" width={60} fixed fixedPosition="left" />
                        <Column dataField="mutuaSolicitante" caption="Mutua Solicitante" width={140} fixed fixedPosition="left" />
                        <Column dataField="mutuaOfertante" caption="Mutua Ofertante" width={140} />
                        <Column dataField="localidad" caption="Localidad" width={120} />
                        <Column dataField="centro" caption="Centro" width={160} />
                        <Column dataField="especialidad" caption="Especialidad" width={160} />
                        <Column dataField="tipoMovimiento" caption="Tipo Movimien" width={130} />
                        <Column dataField="servicio" caption="Servicio" width={140} />
                        <Column dataField="fechaConfirmacion" caption="Fecha Confirmación" dataType="date" format="dd/MM/yyyy" width={140} />
                        <Column dataField="peticionesAsignadas" caption="Pet. Asig" width={80} alignment="center" />
                        <Column dataField="peticionesPendientes" caption="Pet. Pen" width={80} alignment="center" />

                        {/* Meses */}
                        {['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].map(m => (
                            <Column key={m} dataField={m} caption={m.charAt(0).toUpperCase() + m.slice(1)} width={45} alignment="center" />
                        ))}

                        <Column dataField="total" caption="Total" width={70} alignment="center" fixed fixedPosition="right" />
                        <Column caption="Acciones" width={80} fixed fixedPosition="right" alignment="center" cellRender={() => (
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', fontSize: 18, color: '#1a5fa8' }}>
                                <i className="ri-edit-line" style={{ cursor: 'pointer' }}></i>
                                <i className="ri-delete-bin-line" style={{ color: '#c62828', cursor: 'pointer' }}></i>
                            </div>
                        )} />
                    </DataGrid>
                </div>
            </div>
        </div>
    );
};

export default GestionDemanda;