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

const GestionOferta = () => {
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
    const [ofertaEditando, setOfertaEditando] = useState(null);

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

    // --- FUNCIONES DE EXPORTACIÓN MANUAL ---
    const exportToExcel = () => {
        const context = dataGridRef.current.instance;
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Lista Ofertas');

        exportDataGridToExcel({
            component: context,
            worksheet,
            autoFilterEnabled: true
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ListaOfertas.xlsx');
            });
        });
    };

    const exportToPdf = () => {
        const doc = new jsPDF();
        const context = dataGridRef.current.instance;

        exportDataGridToPdf({
            jsPDFDocument: doc,
            component: context
        }).then(() => {
            doc.save('ListaOfertas.pdf');
        });
    };

    // --- LÓGICA DE BÚSQUEDA ---
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

    const handleGuardarEdicion = () => {
        fetch(`${API}/ListaOfertas/${ofertaEditando.ofertaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ofertaEditando),
        })
            .then(res => {
                if (res.ok) {
                    setOfertaEditando(null);
                    buscarRef.current();
                } else {
                    alert('Error al guardar');
                }
            })
            .catch(err => console.error('Error:', err));
    };

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    {/* HEADER */}
                    <div className="header-page">
                        <div className="title">{t('LISTA OFERTAS')}</div>
                        <div className="acciones-container" ref={menuRef}>
                            <div className="acciones-btn" onClick={() => setMenuAbierto(v => !v)}>
                                <i className="ri-settings-3-line"></i>
                                {t('Acciones')}
                            </div>
                            {menuAbierto && (
                                <div className="acciones-menu">
                                    <div className="acciones-item" onClick={() => { setMenuAbierto(false); }}>
                                        <i className="ri-add-line" style={{ color: '#1976d2' }}></i>
                                        {t('Nueva Oferta')}
                                    </div>
                                    <div className="acciones-item" onClick={() => {
                                        setMenuAbierto(false);
                                        exportToExcel();
                                    }}>
                                        <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                        {t('Exportar a Excel')}
                                    </div>
                                    <div className="acciones-item" onClick={() => {
                                        setMenuAbierto(false);
                                        exportToPdf();
                                    }}>
                                        <i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i>
                                        {t('Exportar a PDF')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FILTROS PRINCIPALES */}
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
                            keyExpr="ofertaId"
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
                            <Export enabled allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <ColumnFixing enabled />
                            <Toolbar>
                                <Item name="groupPanel" />
                                <Item name="columnChooserButton" />
                                <Item location="after" name="searchPanel" />
                            </Toolbar>

                            <Column dataField="año" caption="Año" width={70} fixed fixedPosition="left" />
                            <Column dataField="mutuaOferta" caption="Mutua Oferta" width={160} fixed fixedPosition="left" />
                            <Column dataField="centro" caption="Centro" width={180} />
                            <Column dataField="provincia" caption="Provincia" width={120} />
                            <Column dataField="localidad" caption="Localidad" width={120} />
                            <Column dataField="especialidad" caption="Especialidad" width={160} />
                            <Column dataField="tipoMovimiento" caption="Tipo Movimiento" width={140} />
                            <Column dataField="servicio" caption="Servicio" width={150} />
                            <Column dataField="estado" caption="Estado" width={140} />
                            <Column dataField="demandaId" caption="Num. Pet." width={90} />
                            <Column dataField="peticionesPendientesAsignar" caption="Pet. Pend. Asig." width={110} />

                            {/* Meses */}
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
                                                fetch(`${API}/ListaOfertas/${cell.data.ofertaId}`)
                                                    .then(res => res.json())
                                                    .then(data => setOfertaEditando(data))
                                                    .catch(err => console.error('Error:', err));
                                            }}
                                        >
                                            <i className="ri-edit-line"></i>
                                        </div>
                                        <div
                                            style={{ cursor: 'pointer', color: '#c62828', fontSize: 18 }}
                                            title="Eliminar"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Seguro que desea eliminar esta oferta?')) {
                                                    fetch(`${API}/ListaOfertas/${cell.data.ofertaId}`, { method: 'DELETE' })
                                                        .then(res => {
                                                            if (res.ok) {
                                                                setDatos(prev => prev.filter(d => d.ofertaId !== cell.data.ofertaId));
                                                            } else {
                                                                alert('Error al eliminar la oferta');
                                                            }
                                                        })
                                                        .catch(err => console.error('Error:', err));
                                                }
                                            }}
                                        >
                                            <i className="ri-delete-bin-line"></i>
                                        </div>
                                    </div>
                                )}
                            />
                        </DataGrid>
                    </div>

                    {/* MODAL EDICION */}
                    {ofertaEditando && (
                        <div style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                        }}>
                            <div style={{
                                background: '#fff', borderRadius: 8, width: 620,
                                maxHeight: '90vh', overflow: 'auto',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                            }}>
                                <div className="ficha-modal-header">
                                    <span className="ficha-modal-title">Editar Oferta #{ofertaEditando.ofertaId}</span>
                                    <div className="ficha-header-btns">
                                        <button className="ficha-btn-primary" onClick={handleGuardarEdicion}>Guardar</button>
                                        <button className="ficha-btn-secondary" onClick={() => setOfertaEditando(null)}>Cancelar</button>
                                    </div>
                                </div>
                                <div style={{ padding: 20 }}>
                                    <div className="ficha-grid">
                                        <div className="ficha-field">
                                            <label>Estado</label>
                                            <select
                                                value={ofertaEditando.estadoId || ''}
                                                onChange={e => setOfertaEditando(prev => ({ ...prev, estadoId: parseInt(e.target.value) }))}
                                            >
                                                {estados.filter(e => e.estadoId !== null).map(e => (
                                                    <option key={e.estadoId} value={e.estadoId}>{e.estado}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="ficha-field">
                                            <label>Nota Contestacion</label>
                                            <input
                                                type="text"
                                                value={ofertaEditando.notaContestacion || ''}
                                                onChange={e => setOfertaEditando(prev => ({ ...prev, notaContestacion: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 20 }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#1a5fa8', textTransform: 'uppercase', marginBottom: 12 }}>
                                            Plazas por mes
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                                            {['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].map(mes => (
                                                <div className="ficha-field" key={mes}>
                                                    <label>{mes.charAt(0).toUpperCase() + mes.slice(1)}</label>
                                                    <input
                                                        type="number"
                                                        value={ofertaEditando[mes] || 0}
                                                        onChange={e => setOfertaEditando(prev => ({ ...prev, [mes]: parseInt(e.target.value) || 0 }))}
                                                    />
                                                </div>
                                            ))}
                                        </div>
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

export default GestionOferta;