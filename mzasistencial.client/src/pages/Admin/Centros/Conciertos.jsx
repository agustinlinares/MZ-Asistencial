import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { jsPDF } from 'jspdf';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportDataGridToExcel, exportDataGrid } from 'devextreme/excel_exporter';
import notify from 'devextreme/ui/notify';
import { confirm as dxConfirm } from 'devextreme/ui/dialog';
import DataGrid, {
    Column, Paging, SearchPanel, FilterRow, HeaderFilter,
    Selection, Grouping, ColumnChooser, Export, Scrolling, Sorting, FilterPanel, Pager, Toolbar, Item, ColumnFixing
} from "devextreme-react/data-grid";
import { conciertosService } from "../../../services/admin/ConciertosService";
import { useLogError } from '../../../hooks/useLogError';
import FichaConcierto from "./FichaConcierto";
import '../../../styles/FichaGlobal.css'; 

// Exportación del DataGrid
const onExporting = (e) => {
    if (e.format === 'pdf') {
        const doc = new jsPDF();
        exportDataGridToPdf({ jsPDFDocument: doc, component: e.component, indent: 5 })
            .then(() => doc.save('Conciertos.pdf'));
    } else {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Conciertos');
        exportDataGridToExcel({ component: e.component, worksheet: worksheet, autoFilterEnabled: true })
            .then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Conciertos.xlsx');
                });
            });
        e.cancel = true; 
    }
};

const Conciertos = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);
    const logError = useLogError("Módulo Conciertos");

    const [conciertos, setConciertos] = useState([]);
    const [selectedConcierto, setSelectedConcierto] = useState(null);
    const [modoSinAutorizar, setModoSinAutorizar] = useState(false);
    
    // Estado para el menú desplegable y la instancia del grid (para exportar a mano)
    const [menuAccionesAbierto, setMenuAccionesAbierto] = useState(false);
    const [gridInstance, setGridInstance] = useState(null);

    // Cierra el menú de acciones si haces clic fuera de él
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAccionesAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const cargarDatos = async () => {
        try {
            const datos = modoSinAutorizar 
                ? await conciertosService.obtenerSinAutorizar() 
                : await conciertosService.obtenerTodos();
            setConciertos(datos);
        } catch (error) {
            console.error("Fallo detectado. Error devuelto por el backend:", error); 
            logError("Fallo al cargar el listado de conciertos", error);
            notify(t("Error al cargar los datos. Revisa la consola para más detalles."), "error", 4000);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [modoSinAutorizar]);

    const handleEliminar = async (conciertoId) => {
        const ok = await dxConfirm(t("¿Eliminar este concierto y todos sus datos asociados permanentemente?"), t("Confirmar eliminación"));
        if (!ok) return;

        try {
            await conciertosService.eliminarConcierto(conciertoId);
            notify(t("Concierto eliminado correctamente"), "success", 3000);
            cargarDatos();
        } catch (error) {
            logError(`Fallo al eliminar el concierto ID: ${conciertoId}`, error);
            notify(error.message || t("Error al eliminar el concierto"), "error", 5000);
        }
    };

    // Funciones de exportación
    const exportarManualExcel = (soloSeleccionados) => {
        if (!gridInstance) return;
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Conciertos');
        
        exportDataGrid({
            component: gridInstance, 
            worksheet: worksheet,
            autoFilterEnabled: true,
            selectedRowsOnly: soloSeleccionados 
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'conciertos.xlsx');
            });
        });
    };

    const exportarManualPDF = () => {
        if (!gridInstance) return;
        const doc = new jsPDF();
        exportDataGridToPdf({
            jsPDFDocument: doc,
            component: gridInstance, 
            indent: 5,
        }).then(() => {
            doc.save('conciertos.pdf');
        });
    };

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                
                {!selectedConcierto && (
                    <div className="header-page">
                        <div className="title">
                            {t('Listado de Conciertos')}
                        </div>

                        {/* Contenedor derecho */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                            
                            {/* Botón de Acciones */}
                            <div className="acciones-container" ref={menuRef}>
                                <div className="acciones-btn" onClick={() => setMenuAccionesAbierto(v => !v)}>
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAccionesAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-item" onClick={() => { setSelectedConcierto({}); setMenuAccionesAbierto(false); }}>
                                            <i className="ri-add-line" style={{ color: '#1a5fa8' }}></i>
                                            {t('Nuevo Concierto')}
                                        </div>
                                        <div className="acciones-item" onClick={() => { exportarManualExcel(false); setMenuAccionesAbierto(false); }}>
                                            <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                            {t('Exportar todo a Excel')}
                                        </div>
                                        <div className="acciones-item" onClick={() => { exportarManualExcel(true); setMenuAccionesAbierto(false); }}>
                                            <i className="ri-file-excel-2-fill" style={{ color: '#2e7d32' }}></i>
                                            {t('Exportar seleccionadas (Excel)')}
                                        </div>
                                        <div className="acciones-item" onClick={() => { exportarManualPDF(); setMenuAccionesAbierto(false); }}>
                                            <i className="ri-file-pdf-line" style={{ color: '#d32f2f' }}></i>
                                            {t('Exportar todo a PDF')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div 
                                className="acciones-btn"
                                onClick={() => setModoSinAutorizar(!modoSinAutorizar)}
                                style={{
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    backgroundColor: modoSinAutorizar ? '#e8f0fe' : '#ffffff',
                                    border: modoSinAutorizar ? '1px solid #1a5fa8' : '1px solid #dcdcdc',
                                    color: modoSinAutorizar ? '#1a5fa8' : '#333',
                                    cursor: 'pointer',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontWeight: modoSinAutorizar ? '500' : 'normal',
                                    fontSize: '13px'
                                }}
                            >
                                <i className={modoSinAutorizar ? "ri-filter-fill" : "ri-filter-line"}></i>
                                {t('Ver solo Sin Autorizar')}
                            </div>
                        </div>
                    </div>
                )}

                <div className="table-container tabla-contenedor">
                    {selectedConcierto ? (
                        <FichaConcierto 
                            concierto={selectedConcierto} 
                            onClose={() => { 
                                setSelectedConcierto(null); 
                                cargarDatos(); 
                            }}
                            onSave={() => { 
                                setSelectedConcierto(null); 
                                cargarDatos();  
                            }}
                        />
                    ) : (
                        <div className="grid-wrapper-centros" style={{ height: 'calc(100vh - 180px)', width: '100%' }}>
                            <DataGrid
                                ref={dataGridRef}
                                dataSource={conciertos}
                                onInitialized={(e) => setGridInstance(e.component)}
                                keyExpr="conciertoId"
                                showBorders={true}
                                columnAutoWidth={true}
                                wordWrapEnabled={true}
                                allowColumnResizing={true}
                                onExporting={onExporting}
                                className="mz-table"
                                height="100%"
                                rowAlternationEnabled={true}
                                showRowLines={true}
                                showColumnLines={true}
                                onRowDblClick={(e) => setSelectedConcierto(e.data)}
                            >
                                <Scrolling mode="standard" showScrollbar="always" />
                                <Paging defaultPageSize={25} />
                                <Pager visible={true} allowedPageSizes={true} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                                
                                <Toolbar>
                                    <Item location="after" name="searchPanel" />
                                    <Item location="after" name="columnChooserButton" />
                                </Toolbar>

                                <SearchPanel visible width={240} placeholder={t('buscar')} />
                                <FilterRow visible={true} applyFilter="auto" showOperationChooser={false} />
                                <HeaderFilter visible searchMode='contains' />
                                <Selection mode="multiple" allowSelectAll />
                                <Grouping autoExpandAll={false} />
                                <ColumnChooser enabled={true} mode="select" />
                                <Export enabled={true} formats={['xlsx', 'pdf']} fileName="Conciertos" allowExportSelectedData />
                                <Sorting mode="multiple" />
                                <FilterPanel visible />
                                <ColumnFixing enabled />

                                {/* Columnas ajustadas a la medida mínima del título */}
                                <Column dataField="localizador" caption="Localizador" minWidth={160} defaultSortOrder="asc" defaultSortIndex={0} />
                                <Column dataField="codigoMz" caption="Cód. MZ" minWidth={80} />
                                <Column dataField="centroNombre" caption="Centro" minWidth={110} />
                                <Column dataField="centroCif" caption="CIF" minWidth={70} />
                                <Column dataField="codigoCasa" caption="Cód. CASA" minWidth={90} />
                                <Column dataField="fechaAlta" caption="Fecha Alta" dataType="date" minWidth={95} />
                                <Column 
                                    dataField="autorizado" 
                                    caption="Autorizado" 
                                    dataType="boolean" 
                                    minWidth={150} 
                                    alignment="center"
                                    cellRender={(c) => c.value 
                                        ? <i className="ri-check-line" style={{ color: '#2e7d32', fontSize: '18px', fontWeight: 'bold' }}></i> 
                                        : <i className="ri-close-line" style={{ color: '#d32f2f', fontSize: '18px', fontWeight: 'bold' }}></i>
                                    } 
                                />
                                
                                <Column
                                    caption={t('Acciones')}
                                    width={100}
                                    minWidth={100}
                                    fixed={true}
                                    fixedPosition="right"
                                    alignment="center"
                                    allowExporting={false}
                                    cellRender={(cellData) => (
                                        <div className="ficha-row-actions">
                                            <i 
                                                className="ri-edit-line edit-icon" 
                                                onClick={(e) => { e.stopPropagation(); setSelectedConcierto(cellData.data); }} 
                                                title={t('Editar')} 
                                            />
                                            <i 
                                                className="ri-delete-bin-line delete-icon" 
                                                style={{ marginLeft: '8px' }} 
                                                onClick={(e) => { e.stopPropagation(); handleEliminar(cellData.data.conciertoId); }} 
                                                title={t('Eliminar ICG07')} 
                                            />
                                        </div>
                                    )}
                                />
                            </DataGrid>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Conciertos;