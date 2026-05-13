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
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(false);

    const exportToExcel = () => {
        const context = dataGridRef.current.instance();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Lista Demandas');
        exportDataGridToExcel({ component: context, worksheet, autoFilterEnabled: true })
            .then(() => workbook.xlsx.writeBuffer()
                .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ListaDemanda.xlsx')));
        setMenuAbierto(false);
    };

    const exportToPdf = () => {
        const doc = new jsPDF('l', 'mm', 'a4');
        const context = dataGridRef.current.instance();
        exportDataGridToPdf({ jsPDFDocument: doc, component: context })
            .then(() => doc.save('ListaDemanda.pdf'));
        setMenuAbierto(false);
    };

    const ejecutarBusqueda = useCallback((filtros) => {
        fetch(`${API}/ListaDemandas/lista`, {
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
            fechaSolicitudDesde: fechaSolicitudDesde || null,
            fechaSolicitudHasta: fechaSolicitudHasta || null,
            fechaAsignacionDesde: fechaAsignacionDesde || null,
            fechaAsignacionHasta: fechaAsignacionHasta || null,
            fechaConfirmacionDesde: fechaConfirmacionDesde || null,
            fechaConfirmacionHasta: fechaConfirmacionHasta || null,
            necesidadesServicio: necesidadesServicio || null,
            contestacionNecesidades: contestacionNecesidades || null,
            demandaId: demandaId ? parseInt(demandaId) : null,
        });
    }, [
        añoSeleccionado, estadoSeleccionado, tipo, vista,
        fechaSolicitudDesde, fechaSolicitudHasta,
        fechaAsignacionDesde, fechaAsignacionHasta,
        fechaConfirmacionDesde, fechaConfirmacionHasta,
        necesidadesServicio, contestacionNecesidades, demandaId,
        ejecutarBusqueda
    ]);

    useEffect(() => { buscarRef.current = buscar; }, [buscar]);

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setMenuAbierto(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        fetch(`${API}/ListaDemandas/años`)
            .then(res => res.json())
            .then(data => {
                setAños(data);
                if (data.length > 0) setAñoSeleccionado(data[0]);
            })
            .catch(err => console.error('Error al cargar años:', err));

        fetch(`${API}/ListaDemandas/estados`)
            .then(res => res.json())
            .then(data => {
                setEstados([{ estadoId: null, estado: 'Todas' }, ...data]);
                setEstadoSeleccionado(null);
            })
            .catch(err => console.error('Error al cargar estados:', err));
    }, []);

    useEffect(() => {
        if (añoSeleccionado !== null) buscarRef.current();
    }, [añoSeleccionado, estadoSeleccionado, tipo]);

    const limpiarFiltros = () => {
        setFechaSolicitudDesde(null);
        setFechaSolicitudHasta(null);
        setFechaAsignacionDesde(null);
        setFechaAsignacionHasta(null);
        setFechaConfirmacionDesde(null);
        setFechaConfirmacionHasta(null);
        setNecesidadesServicio('');
        setContestacionNecesidades('');
        setDemandaId('');
    };

    const handleBorrar = (e, rowData) => {
        e.stopPropagation();
        if (window.confirm(`Seguro que deseas eliminar la demanda ${rowData.demandaId}?`)) {
            fetch(`${API}/ListaDemandas/${rowData.demandaId}`, { method: 'DELETE' })
                .then(res => {
                    if (res.ok) {
                        setDatos(prev => prev.filter(d => d.demandaId !== rowData.demandaId));
                    } else {
                        alert('Error al eliminar el registro');
                    }
                })
                .catch(err => console.error('Error:', err));
        }
    };

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content">

                {/* HEADER */}
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">{t('GESTION DEMANDA')}</span>
                    <div className="acciones-container" ref={menuRef}>
                        <div className="acciones-btn" onClick={() => setMenuAbierto(v => !v)}>
                            <i className="ri-settings-3-line"></i>
                            {t('Acciones')}
                        </div>
                        {menuAbierto && (
                            <div className="acciones-menu">
                                <div className="acciones-item" onClick={() => setMenuAbierto(false)}>
                                    <i className="ri-add-line" style={{ color: '#1976d2' }}></i>
                                    {t('Nueva Demanda')}
                                </div>
                                <div className="acciones-item" onClick={exportToExcel}>
                                    <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                    {t('Exportar a Excel')}
                                </div>
                                <div className="acciones-item" onClick={exportToPdf}>
                                    <i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i>
                                    {t('Exportar a PDF')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* FILTROS */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', background: '#fafafa' }}>
                    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div className="ficha-field">
                            <label>Tipo</label>
                            <RadioGroup items={TIPOS} value={tipo} onValueChanged={e => setTipo(e.value)} layout="horizontal" />
                        </div>
                        <div className="ficha-field" style={{ minWidth: 200 }}>
                            <label>Año</label>
                            <SelectBox items={años} value={añoSeleccionado} onValueChanged={e => setAñoSeleccionado(e.value)} placeholder="Selecciona un año" width={200} />
                        </div>
                        <div className="ficha-field" style={{ minWidth: 220 }}>
                            <label>Estado</label>
                            <SelectBox dataSource={estados} displayExpr="estado" valueExpr="estadoId" value={estadoSeleccionado} onValueChanged={e => setEstadoSeleccionado(e.value)} placeholder="Selecciona un estado" width={220} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                        <div className="ficha-field">
                            <label>Vista</label>
                            <RadioGroup items={VISTAS} value={vista} onValueChanged={e => setVista(e.value)} layout="horizontal" />
                        </div>
                        <button type="button" className="ficha-btn-primary" style={{ marginTop: 16 }} onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}>
                            {filtrosExpandidos ? '- Filtros' : '+ Filtros'}
                        </button>
                    </div>

                    {filtrosExpandidos && (
                        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 24px', paddingTop: 16, borderTop: '1px solid #e0e0e0' }}>
                            <div className="ficha-field">
                                <label>Fecha Solicitud Desde</label>
                                <DateBox value={fechaSolicitudDesde} onValueChanged={e => setFechaSolicitudDesde(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                            </div>
                            <div className="ficha-field">
                                <label>Fecha Solicitud Hasta</label>
                                <DateBox value={fechaSolicitudHasta} onValueChanged={e => setFechaSolicitudHasta(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                            </div>
                            <div className="ficha-field">
                                <label>Fecha Asignacion Desde</label>
                                <DateBox value={fechaAsignacionDesde} onValueChanged={e => setFechaAsignacionDesde(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                            </div>
                            <div className="ficha-field">
                                <label>Fecha Asignacion Hasta</label>
                                <DateBox value={fechaAsignacionHasta} onValueChanged={e => setFechaAsignacionHasta(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                            </div>
                            <div className="ficha-field">
                                <label>Fecha Confirmacion Desde</label>
                                <DateBox value={fechaConfirmacionDesde} onValueChanged={e => setFechaConfirmacionDesde(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                            </div>
                            <div className="ficha-field">
                                <label>Fecha Confirmacion Hasta</label>
                                <DateBox value={fechaConfirmacionHasta} onValueChanged={e => setFechaConfirmacionHasta(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                            </div>
                            <div className="ficha-field">
                                <label>Necesidades para el Servicio</label>
                                <TextBox value={necesidadesServicio} onValueChanged={e => setNecesidadesServicio(e.value)} showClearButton width="100%" />
                            </div>
                            <div className="ficha-field">
                                <label>Contestacion a las Necesidades</label>
                                <TextBox value={contestacionNecesidades} onValueChanged={e => setContestacionNecesidades(e.value)} showClearButton width="100%" />
                            </div>
                            <div className="ficha-field">
                                <label>Demanda ID</label>
                                <TextBox value={demandaId} onValueChanged={e => setDemandaId(e.value)} showClearButton width="100%" />
                            </div>
                            <div style={{ gridColumn: '3', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 8 }}>
                                <button type="button" className="ficha-btn-secondary" onClick={limpiarFiltros}>Limpiar Filtros</button>
                                <button type="button" className="ficha-btn-primary" onClick={buscar}>Buscar</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* TABLA */}
                <div className="ficha-tab-content" style={{ padding: '16px' }}>
                    <DataGrid
                        ref={dataGridRef}
                        dataSource={datos}
                        keyExpr="demandaId"
                        showBorders={true}
                        columnAutoWidth={false}
                        allowColumnResizing={true}
                        className="mz-table"
                        rowAlternationEnabled={true}
                        showRowLines={true}
                        showColumnLines={true}
                        wordWrapEnabled={false}
                        noDataText={cargando ? 'Cargando...' : 'Sin datos para mostrar'}
                    >
                        <Scrolling mode="standard" showScrollbar="always" />
                        <Paging defaultPageSize={25} />
                        <Pager visible={true} allowedPageSizes={[10, 25, 50]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                        <FilterRow visible={true} applyFilter="auto" />
                        <HeaderFilter visible searchMode="contains" />
                        <Selection mode="multiple" allowSelectAll />
                        <GroupPanel visible={vista === 'Agrupada'} emptyPanelText="Arrastra una columna aqui para agrupar" />
                        <Grouping autoExpandAll={false} />
                        <ColumnChooser enabled mode="select" />
                        <Sorting mode="multiple" />
                        <ColumnFixing enabled />
                        <Toolbar>
                            <Item name="groupPanel" />
                            <Item name="columnChooserButton" />
                        </Toolbar>

                        <Column dataField="año" caption="Año" width={70} fixed fixedPosition="left" />
                        <Column dataField="mutuaSolicitante" caption="Mutua Solicitante" width={150} fixed fixedPosition="left" />
                        <Column dataField="mutuaOfertante" caption="Mutua Ofertante" width={150} />
                        <Column dataField="localidad" caption="Localidad" width={120} />
                        <Column dataField="centro" caption="Centro" width={180} />
                        <Column dataField="especialidad" caption="Especialidad" width={160} />
                        <Column dataField="tipoMovimiento" caption="Tipo Movimiento" width={140} />
                        <Column dataField="servicio" caption="Servicio" width={150} />
                        <Column dataField="estado" caption="Estado" width={140} />
                        <Column dataField="fechaConfirmacion" caption="Fecha Confirmacion" dataType="date" format="dd/MM/yyyy" width={150} />
                        <Column dataField="peticionesAsignadas" caption="Pet. Asig." width={90} alignment="center" />
                        <Column dataField="peticionesPendientes" caption="Pet. Pend." width={90} alignment="center" />
                        {['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].map(m => (
                            <Column key={m} dataField={m} caption={m.charAt(0).toUpperCase() + m.slice(1)} width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                        ))}
                        <Column dataField="total" caption="Total" width={70} alignment="center" fixed fixedPosition="right" allowFiltering={false} allowHeaderFiltering={false} />
                        <Column
                            caption="Acciones"
                            width={90}
                            fixed
                            fixedPosition="right"
                            alignment="center"
                            allowFiltering={false}
                            allowHeaderFiltering={false}
                            allowSorting={false}
                            cellRender={(cell) => (
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                    <div
                                        style={{ cursor: 'pointer', color: '#2f5da8', fontSize: 18 }}
                                        title="Editar"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Editar demanda:', cell.data.demandaId);
                                        }}
                                    >
                                        <i className="ri-edit-line"></i>
                                    </div>
                                    <div
                                        style={{ cursor: 'pointer', color: '#c62828', fontSize: 18 }}
                                        title="Eliminar"
                                        onClick={(e) => handleBorrar(e, cell.data)}
                                    >
                                        <i className="ri-delete-bin-line"></i>
                                    </div>
                                </div>
                            )}
                        />
                    </DataGrid>
                </div>
            </div>
        </div>
    );
};

export default GestionDemanda;