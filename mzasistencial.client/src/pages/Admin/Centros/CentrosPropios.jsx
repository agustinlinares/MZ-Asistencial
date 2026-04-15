import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Centros.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FichaCliente from './FichaCliente';
import DataGrid, { Column, Paging, SearchPanel, FilterRow, HeaderFilter, Selection, GroupPanel, Grouping, ColumnChooser, Export, Scrolling, Sorting, ColumnFixing, Pager } from "devextreme-react/data-grid";

const API_URL = "/api/CentrosPropios";

const onExporting = (e) => {
    e.component.beginUpdate();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({ component: e.component, worksheet, autoFilterEnabled: true }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CentrosPropios.xlsx');
        });
    });
    e.cancel = true;
};

const CentrosPropios = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [centros, setCentros] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(API_URL)
            .then(res => { if (!res.ok) throw new Error('Error ' + res.status); return res.json(); })
            .then(data => setCentros(data))
            .catch(err => console.error('Error cargando centros:', err));
    }, []);

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">
                    <div className="title" style={{ padding: '10px 15px', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {t('LISTA CENTROS PROPIOS')}
                    </div>
                    <div className="table-container" style={{ padding: '0 20px 20px 20px', position: 'relative' }}>
                        {selectedCliente && (
                            <FichaCliente cliente={selectedCliente} onClose={() => setSelectedCliente(null)} />
                        )}
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={centros}
                            keyExpr="centroId"
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
                            <Pager visible={true} allowedPageSizes={[10, 20, 50, 100]} displayMode="full" showPageSizeSelector={true} showInfo={true} showNavigationButtons={true} />
                            <SearchPanel visible={true} width={240} placeholder={t('buscar')} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible={true} />
                            <Selection mode="multiple" allowSelectAll={true} />
                            <GroupPanel visible={true} placeholder={t('Drag a column header here to group by that column')} />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled={true} mode="select" />
                            <Export enabled={true} allowExportSelectedData={true} />
                            <Sorting mode="multiple" />
                            <ColumnFixing enabled={true} />
                            <Column dataField="localizador" caption="Localizador" width={110} />
                            <Column dataField="centroId" caption="No" width={80} />
                            <Column dataField="mutuaId" caption="Mutua" width={90} />
                            <Column dataField="centro" caption="Centro" width={200} />
                            <Column dataField="cp" caption="C.P." width={80} />
                            <Column dataField="poblacionId" caption="Poblacion" width={100} />
                            <Column dataField="telefono" caption="Telefono" width={120} />
                            <Column dataField="desactivado" caption="Desactivado" width={110} alignment="center"
                                cellRender={(cell) => (
                                    <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:'10px', fontSize:'11px', fontWeight:600, background: cell.value ? '#ffebee' : '#e8f5e9', color: cell.value ? '#c62828' : '#2e7d32' }}>
                                        {cell.value ? 'Si' : 'No'}
                                    </span>
                                )}
                            />
                            <Column caption="Acciones" width={80} fixed={true} fixedPosition="right" alignment="center"
                                cellRender={() => (
                                    <div style={{ color: '#2f5da8', cursor: 'pointer', textAlign:'center' }}>
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
