import React, { useEffect, useRef, useState, useCallback } from "react";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid as exportDataGridToExcel } from 'devextreme/excel_exporter';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import DataGrid, {
    Column, Paging, FilterRow, HeaderFilter, Selection,
    GroupPanel, Grouping, Scrolling, Sorting, ColumnFixing, Pager, Toolbar, Item,
} from "devextreme-react/data-grid";
import DateBox from "devextreme-react/date-box";
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import RadioGroup from "devextreme-react/radio-group";
import { useTranslation } from "react-i18next";
import '../../../styles/FichaGlobal.css';
import notify from 'devextreme/ui/notify';
import { confirm as dxConfirm } from 'devextreme/ui/dialog';

const API = '/api';
const TIPOS = ['Todos', 'Anuales', 'Individuales'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_LABEL = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const GestionDemanda = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const buscarRef = useRef(null);
    const menuRef = useRef(null);

    const [tipo, setTipo] = useState('Todos');
    const [añoSeleccionado, setAñoSeleccionado] = useState(null);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
    const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [demandaEditando, setDemandaEditando] = useState(null);

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
                .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ListaDemandas.xlsx')));
    };

    const exportToPdf = () => {
        const doc = new jsPDF();
        const context = dataGridRef.current.instance();
        exportDataGridToPdf({ jsPDFDocument: doc, component: context })
            .then(() => doc.save('ListaDemandas.pdf'));
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
            vistaAgrupada: false,
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
        añoSeleccionado, estadoSeleccionado, tipo,
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
        fetch(`${API}/ListaDemanda/años`)
            .then(res => res.json())
            .then(data => {
                setAños(data);
                if (data.length > 0) setAñoSeleccionado(data[0]);
            })
            .catch(err => console.error('Error al cargar años:', err));

        fetch(`${API}/ListaDemanda/estados`)
            .then(res => res.json())
            .then(data => {
                const todos = [{ estadoId: null, estado: 'Todas' }, ...data];
                setEstados(todos);
                setEstadoSeleccionado(null);
            })
            .catch(err => console.error('Error al cargar estados:', err));
    }, []);

    useEffect(() => {
        buscarRef.current();
    }, [añoSeleccionado, estadoSeleccionado, tipo]);

    const limpiarFiltros = () => {
        setFechaSolicitudDesde(null); setFechaSolicitudHasta(null);
        setFechaAsignacionDesde(null); setFechaAsignacionHasta(null);
        setFechaConfirmacionDesde(null); setFechaConfirmacionHasta(null);
        setNecesidadesServicio(''); setContestacionNecesidades(''); setDemandaId('');
    };

    const handleGuardarEdicion = async () => {
        if (demandaEditando.estadoId === 8) {
            const temp = { ...demandaEditando };
            setDemandaEditando(null);
            const ok = await dxConfirm(
                '¿Seguro que desea rechazar esta demanda? Todas las subsolicitudes quedarán rechazadas.',
                'Confirmar rechazo'
            );
            if (!ok) { setDemandaEditando(temp); return; }
            Object.assign(demandaEditando, temp);
        }

        fetch(`${API}/ListaDemanda/${demandaEditando.demandaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estadoId: demandaEditando.estadoId }),
        })
            .then(res => {
                if (res.ok) {
                    notify('Demanda guardada correctamente', 'success', 2000);
                    setDemandaEditando(null);
                    buscarRef.current();
                } else {
                    notify('Error al guardar la demanda', 'error', 3000);
                }
            })
            .catch(err => console.error('Error:', err));
    };

    const totalDemanda = demandaEditando ? MESES.reduce((s, m) => s + (demandaEditando[m] || 0), 0) : 0;
    const totalAsignacion = demandaEditando ? MESES.reduce((s, m) => s + (demandaEditando[`oferta${m.charAt(0).toUpperCase() + m.slice(1)}`] || 0), 0) : 0;
    const totalDiferencia = totalAsignacion - totalDemanda;

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">{t('Lista de Demandas')}</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <div
                                style={{ cursor: 'pointer', fontSize: 20, color: '#555', padding: '4px 8px' }}
                                title="Selector de columnas"
                                onClick={() => dataGridRef.current.instance().showColumnChooser()}
                            >
                                <i className="ri-layout-column-line"></i>
                            </div>
                            <div className="acciones-container" ref={menuRef}>
                                <div className="acciones-btn" onClick={() => setMenuAbierto(v => !v)}>
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>
                                {menuAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-item" onClick={() => { setMenuAbierto(false); exportToExcel(); }}>
                                            <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                            {t('Exportar a Excel')}
                                        </div>
                                        <div className="acciones-item" onClick={() => { setMenuAbierto(false); exportToPdf(); }}>
                                            <i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i>
                                            {t('Exportar a PDF')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

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
                                <SelectBox dataSource={estados} displayExpr="estado" valueExpr="estadoId" value={estadoSeleccionado} onValueChanged={e => setEstadoSeleccionado(e.value)} placeholder="Todas" width={220} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                                <button type="button" className="ficha-btn-primary" onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}>
                                    {filtrosExpandidos ? '- Filtros' : '+ Filtros'}
                                </button>
                            </div>
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

                    <div className="ficha-tab-content" style={{ padding: '16px' }}>
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={datos}
                            keyExpr="rowKey"
                            showBorders={true}
                            columnAutoWidth={false}
                            allowColumnResizing={true}
                            className="mz-table"
                            rowAlternationEnabled={false}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
                            noDataText={cargando ? 'Cargando...' : 'Sin datos para mostrar'}
                            onRowPrepared={(e) => {
                                if (e.rowType === 'data') {
                                    if (e.data.tipoLinea === 'Demanda') {
                                        e.rowElement.style.background = '#dbeafe';
                                        e.rowElement.style.fontWeight = '600';
                                    } else if (e.data.tipoLinea === 'Asignación') {
                                        e.rowElement.style.background = '#eff6ff';
                                    }
                                }
                            }}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={25} />
                            <Pager visible={true} allowedPageSizes={[10, 25, 50]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible searchMode="contains" />
                            <Selection mode="multiple" allowSelectAll />
                            <Sorting mode="multiple" />
                            <ColumnFixing enabled />
                            <GroupPanel visible={true} emptyPanelText="Arrastra una columna aqui para agrupar" />
                            <Grouping autoExpandAll={true} />
                            <Toolbar>
                                <Item name="groupPanel" />
                            </Toolbar>

                            <Column dataField="especialidad" caption="Especialidad" width={160} />
                            <Column dataField="servicio" caption="Servicio" width={150} />
                            <Column dataField="año" caption="Año" width={70} />
                            <Column dataField="mutuaSolicitante" caption="Mutua Solicitante" width={160} />
                            <Column dataField="mutuaOfertante" caption="Mutua Ofertante" width={160} />
                            <Column dataField="centro" caption="Centro" width={180} />
                            <Column dataField="localidad" caption="Localidad" width={120} />
                            <Column dataField="tipoLinea" caption="Tipo Movimiento" width={120} />
                            <Column dataField="estado" caption="Estado" width={140} />
                            <Column dataField="demandaId" caption="Num. Pet." width={90} />
                            <Column dataField="ene" caption="Ene" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="feb" caption="Feb" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="mar" caption="Mar" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="abr" caption="Abr" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="may" caption="May" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="jun" caption="Jun" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="jul" caption="Jul" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="ago" caption="Ago" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="sep" caption="Sep" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="oct" caption="Oct" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="nov" caption="Nov" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="dic" caption="Dic" width={50} alignment="center" allowHeaderFiltering={false} allowFiltering={false} />
                            <Column dataField="total" caption="Total" width={70} alignment="center" fixed fixedPosition="right" allowFiltering={false} allowHeaderFiltering={false} />
                            <Column
                                caption="Acciones"
                                width={60}
                                fixed
                                fixedPosition="right"
                                alignment="center"
                                allowFiltering={false}
                                allowHeaderFiltering={false}
                                allowSorting={false}
                                cellRender={(cell) => (
                                    cell.data.tipoLinea === 'Demanda' ? (
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                            <div
                                                style={{ cursor: 'pointer', color: '#2f5da8', fontSize: 18 }}
                                                title="Editar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDemandaEditando({ ...cell.data });
                                                }}
                                            >
                                                <i className="ri-edit-line"></i>
                                            </div>
                                            <div
                                                style={{ cursor: 'pointer', color: '#c62828', fontSize: 18 }}
                                                title="Eliminar"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    const ok = await dxConfirm('¿Seguro que desea eliminar esta demanda?', 'Confirmar eliminación');
                                                    if (ok) {
                                                        fetch(`${API}/ListaDemanda/${cell.data.demandaId}`, { method: 'DELETE' })
                                                            .then(res => {
                                                                if (res.ok) {
                                                                    notify('Demanda eliminada correctamente', 'success', 2000);
                                                                    setDatos(prev => prev.filter(d => d.demandaId !== cell.data.demandaId));
                                                                } else {
                                                                    notify('Error al eliminar la demanda', 'error', 3000);
                                                                }
                                                            })
                                                            .catch(err => console.error('Error:', err));
                                                    }
                                                }}
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </div>
                                        </div>
                                    ) : null
                                )}
                            />
                        </DataGrid>
                    </div>

                    {/* MODAL EDICION */}
                    {demandaEditando && (
                        <div style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                        }}>
                            <div style={{
                                background: '#fff', borderRadius: 8, width: 820,
                                maxHeight: '90vh', overflow: 'auto',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                            }}>
                                <div className="ficha-modal-header">
                                    <span className="ficha-modal-title">Ficha Gestión Demanda</span>
                                    <div className="ficha-header-btns">
                                        <button className="ficha-btn-primary" onClick={handleGuardarEdicion}>Guardar</button>
                                        <button className="ficha-btn-secondary" onClick={() => setDemandaEditando(null)}>Salir</button>
                                    </div>
                                </div>

                                <div style={{ padding: 20 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                                        <div className="ficha-field">
                                            <label>Mutua Solicitante</label>
                                            <input type="text" readOnly value={demandaEditando.mutuaSolicitante || ''} style={{ background: '#f5f5f5' }} />
                                        </div>
                                        <div className="ficha-field">
                                            <label>Mutua Ofertante</label>
                                            <input type="text" readOnly value={demandaEditando.mutuaOfertante || ''} style={{ background: '#f5f5f5' }} />
                                        </div>
                                        <div className="ficha-field">
                                            <label>Centro</label>
                                            <input type="text" readOnly value={demandaEditando.centro || ''} style={{ background: '#f5f5f5' }} />
                                        </div>
                                        <div className="ficha-field">
                                            <label>Especialidad</label>
                                            <input type="text" readOnly value={demandaEditando.especialidad || ''} style={{ background: '#f5f5f5' }} />
                                        </div>
                                        <div className="ficha-field">
                                            <label>Servicio</label>
                                            <input type="text" readOnly value={demandaEditando.servicio || ''} style={{ background: '#f5f5f5' }} />
                                        </div>
                                        <div className="ficha-field">
                                            <label>Estado</label>
                                            <select
                                                value={demandaEditando.estadoId || ''}
                                                onChange={e => setDemandaEditando(prev => ({ ...prev, estadoId: parseInt(e.target.value) }))}
                                            >
                                                {estados.filter(e => e.estadoId !== null).map(e => (
                                                    <option key={e.estadoId} value={e.estadoId}>{e.estado}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                            <thead>
                                                <tr style={{ background: '#1a5fa8', color: '#fff' }}>
                                                    <th style={{ padding: '8px 12px', textAlign: 'left', width: 160 }}></th>
                                                    {MESES_LABEL.map(m => (
                                                        <th key={m} style={{ padding: '8px 6px', textAlign: 'center', width: 55 }}>{m}</th>
                                                    ))}
                                                    <th style={{ padding: '8px 6px', textAlign: 'center', width: 60 }}>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr style={{ background: '#dbeafe' }}>
                                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1a5fa8' }}>DEMANDA TOTAL</td>
                                                    {MESES.map(m => (
                                                        <td key={m} style={{ padding: '8px 6px', textAlign: 'center', color: '#1a5fa8', fontWeight: 600 }}>
                                                            {demandaEditando[m] || 0}
                                                        </td>
                                                    ))}
                                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#1a5fa8' }}>{totalDemanda}</td>
                                                </tr>
                                                <tr style={{ background: '#eff6ff' }}>
                                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#555' }}>ASIGNACION TOTAL</td>
                                                    {MESES.map(m => {
                                                        const key = `oferta${m.charAt(0).toUpperCase() + m.slice(1)}`;
                                                        return (
                                                            <td key={m} style={{ padding: '8px 6px', textAlign: 'center', color: '#555' }}>
                                                                {demandaEditando[key] || 0}
                                                            </td>
                                                        );
                                                    })}
                                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#555' }}>{totalAsignacion}</td>
                                                </tr>
                                                <tr style={{ background: '#f0fdf4' }}>
                                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#2e7d32' }}>DIFERENCIA</td>
                                                    {MESES.map(m => {
                                                        const keyO = `oferta${m.charAt(0).toUpperCase() + m.slice(1)}`;
                                                        const diff = (demandaEditando[keyO] || 0) - (demandaEditando[m] || 0);
                                                        return (
                                                            <td key={m} style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 600, color: diff < 0 ? '#c62828' : '#2e7d32' }}>
                                                                {diff}
                                                            </td>
                                                        );
                                                    })}
                                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: totalDiferencia < 0 ? '#c62828' : '#2e7d32' }}>
                                                        {totalDiferencia}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </React.Fragment>
    );
};

export default GestionDemanda;