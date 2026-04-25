import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './Centros.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import AuthService from "../../../services/auth/AuthService";
import FichaCentroConcertado from "./FichaCentroConcertado";
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    FilterRow,
    HeaderFilter,
    Selection,
    Grouping,
    ColumnChooser,
    Export,
    Scrolling,
    Sorting,
    FilterPanel,
    ColumnFixing,
    Pager
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

    useEffect(() => {
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

        cargarDatos();
    }, []);

    // Función mockeada para cuando implementes el guardado
    const handleSaveCentro = async (data) => {
        console.log("Guardando centro:", data);
        // Aquí irá tu fetch PUT/POST en el futuro
        setSelectedCentro(null); // Cerramos la ficha al guardar
    };

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="title"> {t('LISTA CENTROS CONCERTADOS')}</div>

                    {/* Botones superiores solo visibles si estamos en el listado */}
                    {!selectedCentro && (
                        <div className="BotonesCombo" style={{ marginBottom: '10px', textAlign: 'right' }}>
                            <button 
                                className="btn btn-primary btn-sm mx-1" 
                                onClick={() => setSelectedCentro({})} // Objeto vacío para "Nuevo Centro"
                            >
                                + Nuevo Centro
                            </button>
                        </div>
                    )}

                    <div className="table-container tabla-contenedor">
                        {selectedCentro ? (
                            <FichaCentroConcertado 
                                cliente={selectedCentro} 
                                onClose={() => setSelectedCentro(null)} 
                                onSave={handleSaveCentro}
                            />
                        ) : (
                            <div className="grid-wrapper-centros" style={{ height: 'calc(100vh - 230px)', width: '100%' }}>
                                <DataGrid
                                    ref={dataGridRef}
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
                                    <SearchPanel visible width={240} placeholder={t('buscar')} />
                                    <FilterRow visible={true} applyFilter="auto" />
                                    <HeaderFilter visible searchMode='contains' />
                                    <Selection mode="multiple" allowSelectAll />
                                    <Grouping autoExpandAll={false} />
                                    <ColumnChooser enabled mode="select" />
                                    <Export enabled fileName="CentrosConcertados" allowExportSelectedData />
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
                                    <Column dataField="acciones" caption="Acciones" width={100} />
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