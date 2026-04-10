import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Centros.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FichaCliente from './FichaCliente';

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
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CentrosPropios.xlsx');
        });
    })
    e.cancel = true;
};

const CentrosPropios = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">
                    <div className="title" style={{ padding: '10px 15px', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {t('LISTA REGISTROS ICG CENTROS PROPIOS')}
                    </div>

                    <div className="table-container" style={{ padding: '0 20px 20px 20px', position: 'relative' }}>
                        {selectedCliente && (
                            <FichaCliente
                                cliente={selectedCliente}
                                onClose={() => setSelectedCliente(null)}
                            />
                        )}

                        <DataGrid
                            ref={dataGridRef}
                            dataSource={sampleData}
                            keyExpr="Centro_id"
                            showBorders={true}
                            columnAutoWidth={false}
                            allowColumnResizing={true}
                            onExporting={onExporting}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
                            noDataText={t('Sin datos para mostrar')}
                            onRowClick={(e) => setSelectedCliente(e.data)}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={20} />
                            <Pager
                                visible={true}
                                allowedPageSizes={[10, 20, 50, 100]}
                                displayMode="full"
                                showPageSizeSelector={true}
                                showInfo={true}
                                showNavigationButtons={true}
                            />
                            <SearchPanel visible={true} width={240} placeholder={t('buscar')} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible={true} />
                            <Selection mode="multiple" allowSelectAll={true} />
                            <GroupPanel visible={true} placeholder={t('Arrastre una columna aquí para agrupar por dicha columna')} />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled={true} mode="select" />
                            <Export enabled={true} allowExportSelectedData={true} />
                            <Sorting mode="multiple" />
                            <ColumnFixing enabled={true} />

                            <Column dataField="Centro_id" caption="Centro_id" width={90} />
                            <Column dataField="Id_ICG" caption="Id_ICG" width={100} />
                            <Column dataField="Localizador" caption="Localizador" width={110} />
                            <Column dataField="Población" caption="Población" width={130} />
                            <Column dataField="Provincia" caption="Provincia" width={130} />
                            <Column dataField="Centro" caption="Centro" width={180} />
                            <Column dataField="Personal" caption="Personal" width={90} format="#,##0.00" />
                            <Column dataField="Corrientes" caption="Corrientes" width={90} format="#,##0.00" />
                            <Column dataField="Amort" caption="Amort." width={90} format="#,##0.00" />
                            <Column dataField="INuevas" caption="I.Nuevas" width={90} format="#,##0.00" />
                            <Column dataField="IReposicion" caption="I.Reposición" width={100} format="#,##0.00" />
                            <Column dataField="OtrosIng" caption="Otros Ing." width={100} format="#,##0.00" />
                            <Column dataField="GFinancieros" caption="G.Financieros" width={110} format="#,##0.00" />

                            <Column
                                dataField="Confirmar"
                                caption="Confirmar"
                                width={90}
                                alignment="center"
                            >
                                <Lookup
                                    dataSource={[
                                        { id: true, text: "Sí" },
                                        { id: false, text: "No" }
                                    ]}
                                    valueExpr="id"
                                    displayExpr="text"
                                />
                            </Column>

                            <Column
                                dataField="Acciones"
                                caption="Acciones"
                                width={80}
                                fixed={true}
                                fixedPosition="right"
                                alignment="center"
                                cellRender={() => (
                                    <div className="text-center" style={{ color: '#2f5da8', cursor: 'pointer' }}>
                                        <i className="ri-edit-line"></i>
                                    </div>
                                )}
                            />
                        </DataGrid>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CentrosPropios;