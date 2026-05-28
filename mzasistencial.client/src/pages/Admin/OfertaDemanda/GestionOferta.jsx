import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

const GestionOferta = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dataGridRef = useRef(null);
    const buscarRef = useRef(null);
    const menuRef = useRef(null);

    const [tipo, setTipo] = useState('Todos');
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
        const worksheet = workbook.addWorksheet('Lista Ofertas');
        exportDataGridToExcel({ component: context, worksheet, autoFilterEnabled: true })
            .then(() => workbook.xlsx.writeBuffer()
                .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ListaOfertas.xlsx')));
    };

    const exportToPdf = () => {
        const doc = new jsPDF();
        const context = dataGridRef.current.instance();
        exportDataGridToPdf({ jsPDFDocument: doc, component: context })
            .then(() => doc.save('ListaOfertas.pdf'));
    };

    const ejecutarBusqueda = useCallback((filtros) => {
        fetch(`${API}/ListaOfertas/lista`, {
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
        fetch(`${API}/ListaOfertas/años`)
            .then(res => res.json())
            .then(data => {
                setAños(data);
                if (data.length > 0) setAñoSeleccionado(data[0]);
            })
            .catch(err => console.error('Error al cargar años:', err));

        fetch(`${API}/ListaOfertas/estados`)
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

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">{t('Lista de Ofertas')}</div>
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
                            <div className="ficha-field">
                                <label>&nbsp;</label>
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

                    <div className="table-container" style={{ padding: '0 20px 20px 20px' }}>
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={datos}
                            keyExpr="rowKey"
                            showBorders={true}
                            columnAutoWidth={false}
                            allowColumnResizing={true}
                            className="mz-table"
                            height="100%"
                            rowAlternationEnabled={false}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
                            noDataText={cargando ? 'Cargando...' : 'Sin datos para mostrar'}
                            onRowPrepared={(e) => {
                                if (e.rowType === 'data') {
                                    if (e.data.tipoLinea === 'Asignación') {
                                        e.rowElement.style.background = '#dbeafe';
                                        e.rowElement.style.fontWeight = '600';
                                    } else if (e.data.tipoLinea === 'Demanda') {
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

                            {/* grupoKey — texto invisible para el usuario */}
                            <Column
                                dataField="grupoKey"
                                caption="Especialidad / Servicio"
                                groupIndex={0}
                                defaultSortOrder="asc"
                                visible={false}
                                allowFiltering={false}
                                allowHeaderFiltering={false}
                                groupCellRender={() => (
                                    <span style={{ color: 'transparent', userSelect: 'none', fontSize: 1 }}>
                                        &nbsp;
                                    </span>
                                )}
                            />

                            <Column dataField="especialidad" caption="Especialidad" width={160} />
                            <Column dataField="servicio" caption="Servicio" width={150} />
                            <Column dataField="año" caption="Año" width={70} />
                            <Column dataField="mutuaOferta" caption="Mutua Ofertante" width={160} />
                            <Column dataField="centro" caption="Centro" width={180} />
                            <Column dataField="provincia" caption="Provincia" width={120} />
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
                                    cell.data.tipoLinea === 'Asignación' ? (
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                            <div
                                                style={{ cursor: 'pointer', color: '#2f5da8', fontSize: 18 }}
                                                title="Editar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/admin/OfertaDemanda/GestionOferta/ficha/${cell.data.ofertaId}`);
                                                }}
                                            >
                                                <i className="ri-edit-line"></i>
                                            </div>
                                            <div
                                                style={{ cursor: 'pointer', color: '#c62828', fontSize: 18 }}
                                                title="Eliminar"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    const ok = await dxConfirm('¿Seguro que desea eliminar esta oferta?', 'Confirmar eliminación');
                                                    if (ok) {
                                                        fetch(`${API}/ListaOfertas/${cell.data.ofertaId}`, { method: 'DELETE' })
                                                            .then(res => {
                                                                if (res.ok) {
                                                                    notify('Oferta eliminada correctamente', 'success', 2000);
                                                                    setDatos(prev => prev.filter(d => d.ofertaId !== cell.data.ofertaId));
                                                                } else {
                                                                    notify('Error al eliminar la oferta', 'error', 3000);
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

                </div>
            </div>
        </React.Fragment>
    );
};

export default GestionOferta;