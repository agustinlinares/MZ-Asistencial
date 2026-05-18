import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './GestionReserva.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import DataGrid, {
    Column, Paging, SearchPanel, FilterRow, HeaderFilter,
    Selection, ColumnChooser, Export, Scrolling, Sorting,
    ColumnFixing, Pager, Toolbar, Item, Summary, TotalItem, Grouping, GroupPanel
} from "devextreme-react/data-grid";

import { useTranslation } from "react-i18next";
import CitacionesService from "../../../services/admin/CitacionesService";
import AuthService from "../../../services/auth/AuthService";
import NuevaSolicitud from "./NuevaSolicitud";

const SolicitarCitacion = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [citaciones, setCitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [showNuevaSolicitud, setShowNuevaSolicitud] = useState(false);
    const menuRef = useRef(null);

    // Filtros
    const [filtros, setFiltros] = useState({
        vista: 'Desagrupada',
        anio: new Date().getFullYear(),
        estado: 'Todas',
        demandaId: '',
        citacionId: '',
        necesidad: ''
    });

    const [anios, setAnios] = useState([]);
    const [estados, setEstados] = useState([
        'Todas', 'Pendiente Consumir', 'Pendiente Conceder', 'Nula', 
        'Desierta', 'Consumidas', 'Confirmada', 'Caducadas', 'Rechazada'
    ]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const list = [];
        for (let y = currentYear + 1; y >= 2020; y--) list.push(y);
        setAnios(list);

        cargarDatos();

        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const cargarDatos = async (f = filtros) => {
        setLoading(true);
        try {
            const user = AuthService.getUserData();
            const mid = user?.mutuaId || 1;

            const apiFilters = {
                Anio: f.anio,
                Estado: f.estado,
                DemandaId: f.demandaId || undefined,
                CitacionId: f.citacionId || undefined,
                Necesidad: f.necesidad || undefined
            };
            const data = await CitacionesService.getSolicitadas(mid, apiFilters);
            setCitaciones(data);
        } catch (error) {
            console.error("Error cargando citaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleLimpiarFiltros = () => {
        const initial = {
            vista: 'Desagrupada',
            anio: new Date().getFullYear(),
            estado: 'Todas',
            demandaId: '',
            citacionId: '',
            necesidad: ''
        };
        setFiltros(initial);
        cargarDatos(initial);
    };

    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('CitacionesSolicitadas');
        exportDataGrid({ component: grid, worksheet, autoFilterEnabled: true }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CitacionesSolicitadas.xlsx');
            });
        });
    };

    const handleExportarPDF = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        import('devextreme/pdf_exporter').then(({ exportDataGrid: exportPDF }) => {
            import('jspdf').then(({ jsPDF }) => {
                const doc = new jsPDF({ orientation: 'landscape' });
                exportPDF({ jsPDFDocument: doc, component: grid, indent: 5 }).then(() => {
                    doc.save('CitacionesSolicitadas.pdf');
                });
            });
        });
    };

    const getEstadoStyle = (estado) => {
        let color = '#757575';
        let bg = '#f5f5f5';
        switch (estado?.toUpperCase()) {
            case 'PENDIENTE': case 'PENDIENTE CONCEDER': color = '#e65100'; bg = '#fff3e0'; break;
            case 'CONFIRMADA': case 'CONCEDIDA': color = '#2e7d32'; bg = '#e8f5e9'; break;
            case 'RECHAZADA': color = '#c62828'; bg = '#ffebee'; break;
            case 'DESIERTA': color = '#d32f2f'; bg = '#fce4ec'; break;
            case 'CADUCADAS': color = '#616161'; bg = '#eeeeee'; break;
        }
        return {
            color, backgroundColor: bg,
            padding: '2px 8px', borderRadius: '12px',
            fontSize: '11px', fontWeight: 'bold',
            textTransform: 'uppercase'
        };
    };

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                <div className="header-page">
                    <div className="title">{t('GESTIÓN SOLICITUD DE CITACIÓN')}</div>
                    <div className="header-actions-side">
                        <div className="acciones-container" ref={menuRef}>
                            <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                <i className="ri-settings-3-line"></i> {t('Acciones')}
                            </div>
                            {menuAbierto && (
                                <div className="acciones-menu">
                                    <div className="acciones-item" onClick={() => { setMenuAbierto(false); setShowNuevaSolicitud(true); }}>
                                        <i className="ri-add-line" style={{ color: '#1976d2' }}></i> {t('Nueva Solicitud')}
                                    </div>
                                    <div className="acciones-item" onClick={handleExportarExcel}><i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i> {t('Exportar Excel')}</div>
                                    <div className="acciones-item" onClick={handleExportarPDF}><i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i> {t('Exportar PDF')}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <NuevaSolicitud 
                    visible={showNuevaSolicitud}
                    onHiding={() => setShowNuevaSolicitud(false)}
                    onSave={() => {
                        cargarDatos();
                    }}
                    mutuaId={AuthService.getUserData()?.mutuaId}
                />

                <div className="filter-panel-premium">
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>{t('Vista')}</label>
                            <div className="radio-group">
                                <label className={filtros.vista === 'Agrupada' ? 'active' : ''}>
                                    <input type="radio" name="vista" value="Agrupada" checked={filtros.vista === 'Agrupada'} onChange={handleFilterChange} />
                                    {t('Agrupada')}
                                </label>
                                <label className={filtros.vista === 'Desagrupada' ? 'active' : ''}>
                                    <input type="radio" name="vista" value="Desagrupada" checked={filtros.vista === 'Desagrupada'} onChange={handleFilterChange} />
                                    {t('Desagrupada')}
                                </label>
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>{t('Año')}</label>
                            <select name="anio" value={filtros.anio} onChange={handleFilterChange}>
                                {anios.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className="filter-group" style={{ flex: 2 }}>
                            <label>{t('Estado')}</label>
                            <select name="estado" value={filtros.estado} onChange={handleFilterChange}>
                                {estados.map(e => <option key={e} value={e}>{t(e)}</option>)}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>{t('Demanda ID')}</label>
                            <input type="number" name="demandaId" value={filtros.demandaId} onChange={handleFilterChange} placeholder="Ex: 123" />
                        </div>
                    </div>
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>{t('Citación ID')}</label>
                            <input type="number" name="citacionId" value={filtros.citacionId} onChange={handleFilterChange} placeholder="Ex: 456" />
                        </div>
                        <div className="filter-group" style={{ flex: 3 }}>
                            <label>{t('Necesidades Citación')}</label>
                            <input type="text" name="necesidad" value={filtros.necesidad} onChange={handleFilterChange} placeholder={t('Buscar en necesidades...')} />
                        </div>
                        <div className="filter-group actions">
                            <button className="btn-buscar" onClick={() => cargarDatos()}>
                                <i className="ri-search-line"></i>
                                {t('Buscar')}
                            </button>
                            <button className="btn-limpiar" onClick={handleLimpiarFiltros}>
                                <i className="ri-eraser-line"></i>
                                {t('Limpiar Filtros')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-container" style={{ padding: '0 20px 20px 20px' }}>
                    <DataGrid
                        ref={dataGridRef}
                        dataSource={citaciones}
                        keyExpr="CitacionId"
                        showBorders={true}
                        columnAutoWidth={true}
                        allowColumnResizing={true}
                        className="mz-table"
                        rowAlternationEnabled={true}
                        showRowLines={true}
                        showColumnLines={true}
                        wordWrapEnabled={false}
                        height="calc(100vh - 340px)"
                    >
                        <Toolbar>
                            <Item location="after" name="searchPanel" />
                            <Item location="after" name="columnChooserButton" />
                            <Item location="after">
                                <div className="refresh-button" onClick={() => cargarDatos()} title={t('Actualizar')}>
                                    <i className="ri-refresh-line"></i>
                                </div>
                            </Item>
                        </Toolbar>

                        <Scrolling mode="standard" showScrollbar="always" />
                        <Paging defaultPageSize={20} />
                        <Pager visible={true} allowedPageSizes={[10, 20, 50]} showPageSizeSelector showInfo showNavigationButtons />
                        <SearchPanel visible width={240} placeholder={t('buscar')} />
                        <FilterRow visible={true} />
                        <HeaderFilter visible />
                        <Selection mode="single" />
                        <ColumnChooser enabled mode="select" />
                        <Sorting mode="multiple" />
                        <ColumnFixing enabled />
                        
                        {filtros.vista === 'Agrupada' && <Grouping autoExpandAll={false} />}
                        {filtros.vista === 'Agrupada' && <GroupPanel visible={true} />}

                        <Column dataField="DemandaId" caption={t('Demanda')} width={90} groupIndex={filtros.vista === 'Agrupada' ? 0 : undefined} />
                        <Column dataField="Anio" caption={t('Año')} width={80} alignment="center" />
                        <Column dataField="MutuaOfertante" caption={t('Mutua Ofertante')} width={150} />
                        <Column dataField="Centro" caption={t('Centro')} width={200} />
                        <Column dataField="Especialidad" caption={t('Especialidad')} width={150} />
                        <Column dataField="Servicio" caption={t('Servicio')} width={150} />
                        
                        <Column caption={t('Mensualidades')} alignment="center">
                            <Column dataField="Ene" caption="Ene" width={45} />
                            <Column dataField="Feb" caption="Feb" width={45} />
                            <Column dataField="Mar" caption="Mar" width={45} />
                            <Column dataField="Abr" caption="Abr" width={45} />
                            <Column dataField="May" caption="May" width={45} />
                            <Column dataField="Jun" caption="Jun" width={45} />
                            <Column dataField="Jul" caption="Jul" width={45} />
                            <Column dataField="Ago" caption="Ago" width={45} />
                            <Column dataField="Sep" caption="Sep" width={45} />
                            <Column dataField="Oct" caption="Oct" width={45} />
                            <Column dataField="Nov" caption="Nov" width={45} />
                            <Column dataField="Diciembre" caption="Dic" width={45} />
                        </Column>

                        <Column dataField="Total" caption={t('Total')} width={70} alignment="center" />
                        <Column dataField="Estado" caption={t('Estado')} width={140} alignment="center" cellRender={(cell) => <span style={getEstadoStyle(cell.value)}>{cell.value || t('PENDIENTE')}</span>} />
                        <Column dataField="FechaAltaSolicitud" caption={t('Fecha Solicitud')} dataType="date" width={110} format="dd/MM/yyyy" />

                        <Summary>
                            <TotalItem column="Total" summaryType="sum" displayFormat="Total: {0}" />
                        </Summary>
                    </DataGrid>
                </div>
            </div>
        </div>
    );
};

export default SolicitarCitacion;