import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './GestionReserva.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import DataGrid, {
    Column, Paging, SearchPanel, FilterRow, HeaderFilter,
    Selection, ColumnChooser, Scrolling, Sorting,
    ColumnFixing, Pager, Toolbar, Item, Summary, TotalItem, Grouping, GroupPanel
} from "devextreme-react/data-grid";

import { useTranslation } from "react-i18next";
import CitacionesService from "../../../services/admin/CitacionesService";
import AuthService from "../../../services/auth/AuthService";
import notify from 'devextreme/ui/notify';
import { custom } from 'devextreme/ui/dialog';

import NuevaSolicitud from "./NuevaSolicitud";
import FichaCitacion from "./FichaCitacion";

const TablaCitaciones = ({
    modo,
    titulo,
    createStore,
    mutuaColumnField,
    mutuaColumnCaption,
    hasNuevaSolicitud = false,
    hasBatchActions = false,
    hasRowActions = false
}) => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [showNuevaSolicitud, setShowNuevaSolicitud] = useState(false);
    const menuRef = useRef(null);

    // Ficha Citacion State
    const [showFicha, setShowFicha] = useState(false);
    const [citacionSeleccionada, setCitacionSeleccionada] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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

    const cargarDatos = (f = filtros) => {
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
            
            const store = createStore(mid, apiFilters);
            setDataSource(store);
            
        } catch (error) {
            console.error("Error cargando citaciones:", error);
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

    const handleSelectionChanged = (e) => {
        setSelectedRowKeys(e.selectedRowKeys);
    };

    const handleRowDblClick = (e) => {
        setCitacionSeleccionada(e.data);
        setShowFicha(true);
    };

    // Acciones de fila (Concesiones)
    const handleConceder = async (citacion) => {
        try {
            await CitacionesService.updateEstado(citacion.CitacionId, 2, '');
            notify(t('Citación concedida correctamente'), 'success', 2000);
            cargarDatos();
        } catch {
            notify(t('Error al conceder la citación'), 'error', 2000);
        }
    };

    const handleRechazar = async (citacion) => {
        const motivo = window.prompt(t('Indica el motivo del rechazo:'));
        if (!motivo || !motivo.trim()) return;
        try {
            await CitacionesService.updateRechazo(citacion.CitacionId, motivo.trim());
            notify(t('Citación rechazada'), 'warning', 2000);
            cargarDatos();
        } catch {
            notify(t('Error al rechazar la citación'), 'error', 2000);
        }
    };

    // Acciones en Lote
    const handleConcederLote = async () => {
        if (selectedRowKeys.length === 0) return;
        
        let dialog = custom({
            title: t("Conceder en lote"),
            messageHtml: `<b>${t("Contestación genérica para estas citaciones:")}</b><br/><textarea id='bulkContestacion' style='width:100%; height:80px; margin-top:10px;'></textarea>`,
            buttons: [
                { text: t("Conceder"), onClick: () => document.getElementById('bulkContestacion').value },
                { text: t("Cancelar"), onClick: () => null }
            ]
        });

        const result = await dialog.show();
        if (result !== null) {
            try {
                await CitacionesService.updateEstadoLote(selectedRowKeys, 2, result);
                notify(t('Citaciones concedidas correctamente'), 'success', 2000);
                setSelectedRowKeys([]);
                cargarDatos();
            } catch (err) {
                notify(t('Error al conceder'), 'error', 2000);
            }
        }
    };

    const handleRechazarLote = async () => {
        if (selectedRowKeys.length === 0) return;
        
        let dialog = custom({
            title: t("Rechazar en lote"),
            messageHtml: `<b>${t("Motivo de rechazo para estas citaciones:")}</b><br/><textarea id='bulkMotivo' style='width:100%; height:80px; margin-top:10px;'></textarea>`,
            buttons: [
                { text: t("Rechazar"), onClick: () => document.getElementById('bulkMotivo').value },
                { text: t("Cancelar"), onClick: () => null }
            ]
        });

        const result = await dialog.show();
        if (result !== null) {
            try {
                await CitacionesService.updateRechazoLote(selectedRowKeys, result);
                notify(t('Citaciones rechazadas correctamente'), 'success', 2000);
                setSelectedRowKeys([]);
                cargarDatos();
            } catch (err) {
                notify(t('Error al rechazar'), 'error', 2000);
            }
        }
    };

    // Exportaciones
    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Citaciones');
        exportDataGrid({ component: grid, worksheet, autoFilterEnabled: true }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `Citaciones_${modo}.xlsx`);
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
                    doc.save(`Citaciones_${modo}.pdf`);
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
            default: break;
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
                {!showFicha && (
                    <>
                        <div className="header-page">
                            <div className="title">{t(titulo)}</div>
                            <div className="header-actions-side">
                                <div className="acciones-container" ref={menuRef}>
                                    <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                        <i className="ri-settings-3-line"></i> {t('Acciones')}
                                    </div>
                                    {menuAbierto && (
                                        <div className="acciones-menu">
                                            {hasNuevaSolicitud && (
                                                <div className="acciones-item" onClick={() => { setMenuAbierto(false); setShowNuevaSolicitud(true); }}>
                                                    <i className="ri-add-line" style={{ color: '#1976d2' }}></i> {t('Nueva Solicitud')}
                                                </div>
                                            )}
                                            <div className="acciones-item" onClick={handleExportarExcel}><i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i> {t('Exportar Excel')}</div>
                                            <div className="acciones-item" onClick={handleExportarPDF}><i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i> {t('Exportar PDF')}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {hasNuevaSolicitud && (
                            <NuevaSolicitud 
                                visible={showNuevaSolicitud}
                                onHiding={() => setShowNuevaSolicitud(false)}
                                onSave={() => cargarDatos()}
                                mutuaId={AuthService.getUserData()?.mutuaId}
                            />
                        )}

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
                    </>
                )}

                <div className="table-container" style={{ padding: showFicha ? '0' : '0 20px 20px 20px', height: showFicha ? 'calc(100vh - 60px)' : 'auto' }}>
                    {showFicha ? (
                        <FichaCitacion 
                            visible={showFicha}
                            onHiding={() => setShowFicha(false)}
                            citacion={citacionSeleccionada}
                            modo={modo}
                            onSave={cargarDatos}
                        />
                    ) : (
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={dataSource}
                            remoteOperations={true}
                            keyExpr="CitacionId"
                            columnAutoWidth={false}
                            allowColumnResizing={true}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={true}
                            height="100%"
                            onRowDblClick={handleRowDblClick}
                            selectedRowKeys={hasBatchActions ? selectedRowKeys : undefined}
                            onSelectionChanged={hasBatchActions ? handleSelectionChanged : undefined}
                            onRowPrepared={(e) => {
                                if (e.rowType === 'data' && (e.data.EstadoId === 6 || e.data?.Estado?.toUpperCase() === 'RECHAZADA')) {
                                    e.rowElement.style.backgroundColor = '#ffebee';
                                }
                            }}
                        >
                            <Toolbar>
                                {hasBatchActions && (
                                    <Item location="before">
                                        {selectedRowKeys.length > 1 && (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button className="btn-guardar" onClick={handleConcederLote}>
                                                    <i className="ri-check-line"></i> {t('Conceder Seleccionadas')} ({selectedRowKeys.length})
                                                </button>
                                                <button className="btn-cancelar" onClick={handleRechazarLote} style={{ backgroundColor: '#c62828', color: 'white', border: 'none' }}>
                                                    <i className="ri-close-line"></i> {t('Rechazar Seleccionadas')} ({selectedRowKeys.length})
                                                </button>
                                            </div>
                                        )}
                                    </Item>
                                )}
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
                            
                            {hasBatchActions ? (
                                <Selection mode="multiple" showCheckBoxesMode="always" />
                            ) : (
                                <Selection mode="single" />
                            )}
                            
                            <ColumnChooser enabled mode="select" />
                            <Sorting mode="multiple" />
                            <ColumnFixing enabled />
                            
                            {filtros.vista === 'Agrupada' && <Grouping autoExpandAll={false} />}
                            {filtros.vista === 'Agrupada' && <GroupPanel visible={true} />}

                            <Column dataField="Anio" caption={t('Año')} width={90} alignment="center" groupIndex={filtros.vista === 'Agrupada' ? 0 : undefined} />
                            <Column dataField="DemandaId" caption={t('Demanda')} visible={false} groupIndex={filtros.vista === 'Agrupada' ? 1 : undefined} />
                            <Column dataField="MutuaOfertante" caption={t('Mutua Ofertante')} width={180} />
                            <Column dataField="MutuaSolicitante" caption={t('Mutua Demandante')} width={180} />
                            <Column dataField="Centro" caption={t('Centro')} width={180} />
                            <Column dataField="Provincia" caption={t('Provincia')} width={120} />
                            <Column dataField="Localidad" caption={t('Localidad')} width={120} />
                            <Column dataField="Especialidad" caption={t('Especialidad')} width={180} />
                            <Column dataField="TipoMovimiento" caption={t('Tipo Movimiento')} width={160} />
                            <Column dataField="Servicio" caption={t('Servicio')} width={160} />
                            
                            <Column caption={t('Mensualidades')} alignment="center">
                                <Column dataField="Ene" caption="Ene" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="Feb" caption="Feb" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="Mar" caption="Mar" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="Abr" caption="Abr" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="May" caption="May" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="Jun" caption="Jun" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="Jul" caption="Jul" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="Ago" caption="Ago" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="Sep" caption="Sep" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="Oct" caption="Oct" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="Nov" caption="Nov" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                                <Column dataField="Diciembre" caption="Dic" width={60} alignment="center" allowFiltering={false} allowHeaderFiltering={false} allowSorting={false} />
                            </Column>

                            <Column dataField="Total" caption={t('Total')} width={80} alignment="center" />
                            <Column dataField="Estado" caption={t('Estado')} width={140} alignment="center" cellRender={(cell) => <span style={getEstadoStyle(cell.value)}>{cell.value || t('PENDIENTE')}</span>} />
                            <Column dataField="FechaAltaSolicitud" caption={t('Fecha Solicitud')} dataType="date" width={130} format="dd/MM/yyyy" />

                            {hasRowActions && (
                                <Column 
                                    caption={t('Acciones')} 
                                    width={100} 
                                    fixed={true} 
                                    fixedPosition="right" 
                                    alignment="center"
                                    cellRender={(cell) => {
                                        const isPendiente = cell.data.EstadoId === 1 || cell.data.Estado?.toUpperCase() === 'PENDIENTE' || cell.data.Estado?.toUpperCase() === 'PENDIENTE CONCEDER';
                                        const isConfirmada = cell.data.EstadoId === 2 || cell.data.Estado?.toUpperCase() === 'CONFIRMADA' || cell.data.Estado?.toUpperCase() === 'CONCEDIDA';
                                        return (
                                            <div className="ficha-row-actions">
                                                {isPendiente && (
                                                    <i className="ri-checkbox-circle-line edit-icon" title={t('Conceder')} style={{ color: '#2e7d32', cursor: 'pointer', marginRight: '8px' }} onClick={() => handleConceder(cell.data)} />
                                                )}
                                                {(isPendiente || isConfirmada) && (
                                                    <i className="ri-close-circle-line delete-icon" title={t('Rechazar')} style={{ color: '#c62828', cursor: 'pointer' }} onClick={() => handleRechazar(cell.data)} />
                                                )}
                                            </div>
                                        );
                                    }}
                                />
                            )}

                            <Summary>
                                <TotalItem column="Total" summaryType="sum" displayFormat="Total: {0}" />
                            </Summary>
                        </DataGrid>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TablaCitaciones;
