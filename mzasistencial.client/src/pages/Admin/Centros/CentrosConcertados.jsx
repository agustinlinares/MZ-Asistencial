import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './Centros.css';
import '../../../styles/FichaGlobal.css';
import { saveAs } from 'file-saver-es';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportDataGridToExcel } from 'devextreme/excel_exporter';
import { exportDataGrid } from 'devextreme/excel_exporter';
import AuthService from "../../../services/auth/AuthService";
import FichaCentroConcertado from "./FichaCentroConcertado";
import DataGrid, {
    Column, Paging, SearchPanel, FilterRow, HeaderFilter,
    Selection, Grouping, ColumnChooser, Export,
    Scrolling, Sorting, FilterPanel, ColumnFixing,
    Pager, Toolbar, Item
} from "devextreme-react/data-grid";

import { useTranslation } from "react-i18next";
import notify from 'devextreme/ui/notify';
import { custom } from 'devextreme/ui/dialog';
import { confirm as dxConfirm } from 'devextreme/ui/dialog';

import { useLogError } from '../../../hooks/useLogError';

const onExporting = (e) => {
    if (e.format === 'pdf') {
        const doc = new jsPDF();
        exportDataGridToPdf({
            jsPDFDocument: doc,
            component: e.component,
            indent: 5,
        }).then(() => {
            doc.save('CentrosConcertados.pdf');
        });
    } else {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Centros');
        
        exportDataGridToExcel({
            component: e.component,
            worksheet: worksheet,
            autoFilterEnabled: true,
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CentrosConcertados.xlsx');
            });
        });
        e.cancel = true; 
    }
};

// Helper para los headers que usa tu equipo
const authHeaders = () => {
    const token = AuthService.getToken();
    return { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
};

const CentrosConcertados = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const navigate = useNavigate();
    
    const logError = useLogError("Centros Concertados");

    const [centros, setCentros] = useState([]);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const [menuAccionesAbierto, setMenuAccionesAbierto] = useState(false);
    const menuRef = useRef(null);
    const [gridInstance, setGridInstance] = useState(null);

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
            const respuesta = await fetch('/api/CentrosConcertados', { 
                method: 'GET',
                headers: authHeaders() 
            });

            if (respuesta.ok) {
                const datos = await respuesta.json();
                setCentros(datos);
            } else {
                throw new Error(`Código de estado: ${respuesta.status}`);
            }
        } catch (error) {
            console.error("Error conectando con la API:", error);
            logError("Fallo al cargar el listado", error);
        }
    };

    const darDeBajaCentro = async (centroId) => {
        try {
            const response = await AuthService.fetch(`/api/CentrosConcertados/${centroId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                notify(t('Centro dado de baja correctamente'), 'success', 3000);
                cargarDatos();
            } else {
                const errorData = await response.json();
                notify(`${t('Error al dar de baja')}: ${errorData.message}`, 'error', 4000);
                throw new Error(errorData.message || 'Error desconocido al dar de baja');
            }
        } catch (error) {
            console.error("Error de red al borrar:", error);
            notify(t('Hubo un error de conexión al intentar dar de baja'), 'error', 4000);
            
            logError("Fallo al borrar", error);
        }
    };

    const reactivarCentro = async (id) => {
        try {
            const response = await fetch(`/api/CentrosConcertados/${id}/Reactivar`, {
                method: 'PUT', 
                headers: authHeaders()
            });

            if (response.ok) {
                notify('Centro reactivado correctamente', 'success', 3000);
                cargarDatos(); 
            } else {
                notify('Error al intentar reactivar el centro', 'error', 3000);
                throw new Error(`Error en reactivación. Estado: ${response.status}`);
            }
        } catch (error) {
            console.error("Error de red al reactivar:", error);
            logError(`Fallo al reactivar el centro con ID ${id}`, error, "CentrosConcertados");
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleSaveCentro = (data) => {
        // Cerramos la ficha visualmente
        setSelectedCentro(null); 
        
        // Refrescamos la tabla llamando de nuevo a la base de datos
        cargarDatos(); 
    };

    const exportarManualExcel = (soloSeleccionados) => {
        if (!gridInstance) {
            console.error("La instancia de la tabla aún no está lista.");
            return;
        }

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Main sheet');
        
        exportDataGrid({
            component: gridInstance, 
            worksheet: worksheet,
            autoFilterEnabled: true,
            selectedRowsOnly: soloSeleccionados 
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'centros_concertados.xlsx');
            });
        });
    };

    const exportarManualPDF = () => {
        if (!gridInstance) {
            console.error("El grid no está inicializado");
            return;
        }

        const doc = new jsPDF();
        
        exportDataGridToPdf({
            jsPDFDocument: doc,
            component: gridInstance, 
            indent: 5,
        }).then(() => {
            doc.save('CentrosConcertados.pdf');
        });
    };

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">
                            {t('Lista de Centros Concertados')}
                        </div>

                        {!selectedCentro && (
                            <div className="acciones-container" ref={menuRef}>
                                <div 
                                    className="acciones-btn"
                                    onClick={() => setMenuAccionesAbierto(v => !v)}
                                >
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAccionesAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-item" onClick={() => { setSelectedCentro({}); setMenuAccionesAbierto(false); }}>
                                            <i className="ri-add-line" style={{ color: '#1a5fa8' }}></i>
                                            {t('Nuevo Centro')}
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
                        )}
                    </div>

                    <div className="table-container tabla-contenedor">
                        {selectedCentro ? (
                            <FichaCentroConcertado 
                                cliente={selectedCentro} 
                                onClose={() => setSelectedCentro(null)} 
                                onSave={handleSaveCentro}
                            />
                        ) : (
                            <div className="grid-wrapper-centros" style={{ height: 'calc(100vh - 180px)', width: '100%' }}>
                                <DataGrid
                                    ref={dataGridRef}
                                    onInitialized={(e) => setGridInstance(e.component)}
                                    dataSource={centros}
                                    keyExpr="centro_id" 
                                    showBorders={true}
                                    columnAutoWidth={true}
                                    allowColumnResizing={true}
                                    onExporting={onExporting}
                                    className="mz-table"
                                    height="100%"
                                    rowAlternationEnabled={true}
                                    showRowLines={true}
                                    showColumnLines={true}
                                    wordWrapEnabled={false}
                                    onRowDblClick={(e) => setSelectedCentro(e.data)} // Abrimos ficha al doble clic

                                    onCellPrepared={(e) => {
                                        if (e.rowType === "data" && e.data.fechaBaja) {
                                            e.cellElement.style.setProperty("background-color", "#FA8702", "important");
                                            e.cellElement.style.setProperty("color", "#ffffff", "important");
                                        }
                                    }}
                                >
                                    <Scrolling mode="standard" showScrollbar="always" />
                                    <Paging defaultPageSize={25} />
                                    <Pager visible={true} allowedPageSizes={true} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                                    
                                    <Toolbar>
                                        <Item location="after" name="searchPanel" />
                                        <Item location="after" name="columnChooserButton" />
                                    </Toolbar>

                                    <SearchPanel visible width={240} placeholder={t('buscar')} />
                                    <FilterRow visible={true} applyFilter="auto" />
                                    <HeaderFilter visible searchMode='contains' />
                                    <Selection mode="multiple" allowSelectAll />
                                    <Grouping autoExpandAll={false} />
                                    <ColumnChooser enabled={true} mode="select" />
                                    <Export enabled={true} formats={['xlsx', 'pdf']} fileName="CentrosConcertados" allowExportSelectedData />
                                    <Sorting mode="multiple" />
                                    <FilterPanel visible />
                                    <ColumnFixing enabled />

                                    {/* ── COLUMNAS ── */}
                                    <Column dataField="ccn" caption="Localizador del centro" width={100} />
                                    <Column dataField="cif" caption="CIF" width={110} />
                                    <Column dataField="centro_id" caption="Centro ID" width={100} />
                                    <Column dataField="centro" caption="Centro" width={180} defaultSortOrder="asc" 
                                    defaultSortIndex={1} />
                                    <Column dataField="direccion" caption="Dirección" width={200} />
                                    <Column dataField="cp" caption="C.P." width={80} />
                                    <Column dataField="poblacion" caption="Población" width={150} /> 
                                    <Column dataField="provincia" caption="Provincia" width={130} />
                                    <Column dataField="fechaAlta" caption="Fecha Alta" dataType="date" width={110} />
                                    <Column dataField="fechaBaja" caption={t('Fecha Baja')} dataType="date" width={110} defaultSortOrder="asc" 
                                    defaultSortIndex={0}/>
                                    <Column 
                                    dataField="mapaValidado" 
                                    caption="Mapa" 
                                    width={80} 
                                    alignment="center"
                                    cellRender={(cellData) => {
                                        const isValidado = cellData.value === true;
                                        const esBaja = cellData.data.fechaBaja;
                                        
                                        return (
                                            <i 
                                                className={isValidado ? "ri-map-pin-2-fill" : "ri-close-circle-line"} 
                                                style={{ 
                                                    color: esBaja ? (isValidado ? '#ffffff' : 'rgba(255, 255, 255, 0.5)') : (isValidado ? '#2e7d32' : '#d32f2f'), 
                                                    fontSize: '18px', 
                                                    cursor: 'pointer' 
                                                }} 
                                                title={isValidado ? "Editar ubicación" : "Añadir ubicación"}
                                                onClick={() => navigate(`/admin/centros/concertados/${cellData.data.centro_id}/mapa-edicion`, { 
                                                    state: { 
                                                        datosFila: cellData.data,
                                                        apiEndpoint: `/api/CentrosConcertados/${cellData.data.centro_id}`,
                                                        tituloFicha: `Centro Concertado | ${cellData.data.centro || 'Editar Ubicación'}`
                                                    } 
                                                })}
                                            ></i>
                                        );
                                    }} 
                                />
                                    <Column
                                        caption={t('Acciones')}
                                        width={100}
                                        fixed={true}
                                        fixedPosition="right"
                                        alignment="center"
                                        allowExporting={false}
                                        cellRender={(cellData) => (
                                            <div className="ficha-row-actions">
                                                <i 
                                                    className="ri-edit-line edit-icon" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCentro(cellData.data);
                                                    }}
                                                    title={t('Editar')}
                                                />
                                                
                                                {cellData.data.fechaBaja ? (
                                                    <i 
                                                        className="ri-refresh-line" 
                                                        style={{ color: '#2e7d32', cursor: 'pointer', fontSize: '18px', marginLeft: '8px' }}
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            const ok = await dxConfirm(
                                                                t('¿Desea reactivar este centro concertado y quitar su fecha de baja?'), 
                                                                t('Confirmar alta')
                                                            );
                                                            if (ok) {
                                                                reactivarCentro(cellData.data.centro_id); 
                                                            }
                                                        }}
                                                        title={t('Dar de alta nuevamente')}
                                                    />
                                                ) : (
                                                    <i 
                                                        className="ri-delete-bin-line delete-icon" 
                                                        style={{ marginLeft: '8px' }}
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            const ok = await dxConfirm(
                                                                t('¿Está seguro de que desea dar de baja este centro?'), 
                                                                t('Confirmar baja')
                                                            );
                                                            if (ok) {
                                                                darDeBajaCentro(cellData.data.centro_id); 
                                                            }
                                                        }}
                                                        title={t('Eliminar')}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </DataGrid>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CentrosConcertados;