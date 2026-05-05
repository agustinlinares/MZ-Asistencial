import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './Centros.css';
import '../../../styles/FichaGlobal.css';
import { saveAs } from 'file-saver-es';
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

const onExporting = (e) => {
    e.component.beginUpdate();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'centros_concertados.xlsx');
        });
    })
    e.cancel = true;
};

// Helper para los headers que usa tu equipo
const authHeaders = () => {
    const token = AuthService.getToken();
    return { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
};

const CentrosConcertados = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    
    // Estados simplificados para el patrón Master/Detail inline
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
                console.error("Error en la respuesta del servidor:", respuesta.status);
                }
        } catch (error) {
            console.error("Error conectando con la API:", error);
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

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">
                            {t('LISTA CENTROS CONCERTADOS')}
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
                                            <i className="ri-checkbox-circle-line" style={{ color: '#e65100' }}></i>
                                            {t('Exportar filas seleccionadas')}
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
                                    <Export enabled={true} fileName="CentrosConcertados" allowExportSelectedData />
                                    <Sorting mode="multiple" />
                                    <FilterPanel visible />
                                    <ColumnFixing enabled />

                                    {/* ── COLUMNAS ── */}
                                    <Column dataField="ccn" caption="CCN" width={100} />
                                    <Column dataField="cif" caption="CIF" width={110} />
                                    <Column dataField="centro_id" caption="Centro ID" width={100} />
                                    <Column dataField="centro" caption="Centro" width={180} />
                                    <Column dataField="direccion" caption="Dirección" width={200} />
                                    <Column dataField="cp" caption="C.P." width={80} />
                                    <Column dataField="poblacion" caption="Población" width={150} /> 
                                    <Column dataField="provincia" caption="Provincia" width={130} />
                                    <Column dataField="fechaAlta" caption="Fecha Alta" dataType="date" width={110} />
                                    <Column dataField="mapa" caption="Mapa" width={80} />
                                    <Column
                                        caption={t('Acciones')}
                                        width={100}
                                        fixed={true}
                                        fixedPosition="right"
                                        alignment="center"
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
                                                <i 
                                                    className="ri-delete-bin-line delete-icon" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm(t('¿Está seguro de que desea eliminar este centro?'))) {
                                                            console.log('Eliminar centro:', cellData.data.centro_id);
                                                        }
                                                    }}
                                                    title={t('Eliminar')}
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
        </React.Fragment>
    );
};

export default CentrosConcertados;