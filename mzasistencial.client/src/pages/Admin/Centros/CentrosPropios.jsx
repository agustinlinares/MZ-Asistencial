import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Centros.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FichaCliente from './FichaCliente'; // ajusta la ruta según donde esté el archivo

import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    FilterRow,
    HeaderFilter,
    Selection,
    GroupPanel,
    Grouping,
    ColumnChooser,
    Export,
    Scrolling,
    Sorting,
    FilterPanel,
    ColumnFixing,
    Pager,
    Toolbar,
    Item,
    Lookup
} from "devextreme-react/data-grid";
// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const sampleData = [];

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
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'estaciones.xlsx');
        });
    })
    e.cancel = true;
};

const CentrosPropios = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [selectedCliente, setSelectedCliente] = useState(null); // fila seleccionada

    // const { isAuthenticated } = UseProtectedRoute();
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="title"> {t('LISTA CENTROS PROPIOS')}</div>

                    <div className="legend-container">
                        <div className="legend-item">
                            <span className="red-square"></span>
                            {t('Centro de Baja')}
                        </div>
                    </div>
                    
                        <div className="table-container" style={{ position: "relative" }}>
                            <DataGrid
                                ref={dataGridRef}
                                dataSource={sampleData}
                                keyExpr="id"
                                showBorders={true}
                                columnAutoWidth={true}
                                allowColumnResizing={true}
                                onExporting={onExporting}
                                className="mz-table"
                                rowAlternationEnabled={true}
                                showRowLines={true}
                                showColumnLines={true}
                                wordWrapEnabled={false}
                                onRowClick={(e) => setSelectedCliente(e.data)}
                            >

                            {/* <div className="tabla-contenedor"> */}
                                {selectedCliente && (
                                    <FichaCliente 
                                        cliente={selectedCliente} 
                                        onClose={() => setSelectedCliente(null)} 
                                    />
                                )}
                            {/* </div>   */}

                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={25} />
                            <Pager visible={true} allowedPageSizes={true} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            <SearchPanel visible width={240} placeholder={t('buscar')} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible searchMode='contains' />
                            <Selection mode="multiple" allowSelectAll />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled mode="select" />
                            <Export enabled fileName="Casos" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <FilterPanel visible />
                            <ColumnFixing enabled />



                            {/* ── COLUMNAS ─────────────────────────────────────────────────── */}

                            <Column dataField="localizador" caption="Localizador" width={120} />
                            <Column dataField="id" caption="Nº" width={80} />
                            <Column dataField="mutua" caption="Mutua" width={150} />
                            <Column dataField="centroId" caption="Centro ID" width={100} />
                            <Column dataField="centro" caption="Centro" width={180} />
                            <Column dataField="cp" caption="C.P." width={80} />
                            <Column dataField="provincia" caption="Provincia" width={130} />
                            <Column dataField="poblacion" caption="Población" width={150} />
                            <Column dataField="telefono" caption="Teléfono" width={120} />
                            <Column dataField="mapa" caption="Mapa" width={80} />
                            <Column dataField="desactivado" caption="Desactivado" width={100} />
                            <Column dataField="acciones" caption="Acciones" width={100} />
                        </DataGrid>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CentrosPropios;