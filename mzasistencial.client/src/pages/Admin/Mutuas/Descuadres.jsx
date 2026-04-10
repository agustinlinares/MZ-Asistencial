import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Mutuas.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
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

import { useTranslation } from "react-i18next";

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

const Descuadres = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);

    // const { isAuthenticated } = UseProtectedRoute();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         console.error('No está registradoel usuario');
    //         // navigate('/'); 
    //     }
    // }, [isAuthenticated, navigate]); 

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">
                            {t('Lista de descuadres')}
                        </div>

                        <div className="acciones-container">
                            <div className="acciones-btn">
                                {t('Acciones')}
                                <i className="ri-more-2-fill"></i>
                            </div>

                            <div className="acciones-menu">
                                <div className="acciones-item">
                                    <i className="ri-add-line"></i>
                                    Nuevo
                                </div>
                                <div className="acciones-item">
                                    <i className="ri-file-excel-2-line"></i>
                                    Exportar Excel
                                </div>
                                <div className="acciones-item">
                                    <i className="ri-file-pdf-line"></i>
                                    Exportar PDF
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={sampleData}
                            keyExpr="CodigoPersona"
                            showBorders={true}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            onExporting={onExporting}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
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
                            <Export enabled fileName="Casos" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <FilterPanel visible />
                            <ColumnFixing enabled />



                            {/* ── COLUMNAS ─────────────────────────────────────────────────── */}

                            <Column dataField="id" caption="Nº" width={80} />
                            <Column dataField="mutua" caption="Mutua" width={150} />
                            <Column dataField="gastoPersonal" caption="Gasto Personal" width={130} />
                            <Column dataField="gastoCorrientes" caption="Gasto Corrientes" width={130} />
                            <Column dataField="gastosFinancieros" caption="Gastos Financieros" width={130} />
                            <Column dataField="amortizacion" caption="Amortización" width={130} />
                            <Column dataField="totalCostePropios" caption="TOTAL COSTE PROPIOS" width={150} />
                            <Column dataField="costeConciertos" caption="Coste conciertos" width={130} />
                            <Column dataField="aplicacion258_1" caption="Aplicacion 258.1" width={130} />
                            <Column dataField="aplicacion258_2" caption="Aplicacion 258.2" width={130} />
                            <Column dataField="restoArt25" caption="Resto art. 25" width={130} />
                            <Column dataField="totalArticulo25" caption="TOTAL ARTÍCULO 25" width={150} />
                            <Column dataField="inversionNueva" caption="Inversión nueva" width={130} />
                            <Column dataField="reposicion" caption="Reposición" width={130} />
                            <Column dataField="ingresosServicios" caption="Ingresos proced. prest. Servicios" width={220} />
                            <Column dataField="totalOtrosConceptos" caption="TOTAL OTROS CONCEPTOS" width={180} />
                            <Column dataField="totalGeneral" caption="TOTAL GENERAL" width={150} />
                            <Column dataField="propiosConf" caption="Propios conf." width={130} />
                            <Column dataField="propiosNoConf" caption="Propios no conf." width={130} />
                            <Column dataField="concertConf" caption="Concert. conf." width={130} />
                            <Column dataField="concertNoConf" caption="Concert. no conf." width={130} />
                        </DataGrid>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Descuadres;