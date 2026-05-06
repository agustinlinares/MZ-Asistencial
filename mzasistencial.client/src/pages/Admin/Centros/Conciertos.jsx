import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Centros.css';
import '../../../styles/FichaGlobal.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    Lookup,
    Toolbar,
    Item
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
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Conciertos.xlsx');
        });
    })
    e.cancel = true;
};

const Conciertos = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [rows, setRows] = useState([]);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        let active = true;
        const loadData = async () => {
            try {
                const response = await fetch("/api/IcgConciertos");
                if (response.ok) {
                    const data = await response.json();
                    if (active) setRows(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Error loading conciertos:", err);
                if (active) setRows([]);
            }
        };
        loadData();
        return () => { active = false; };
    }, []);

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">
                    <div className="header-page">
                        <div className="title">
                            {t('LISTA REGISTROS ICG CONCIERTOS')}
                        </div>

                        <div className="header-actions-side">
                            <div className="acciones-container" ref={menuRef}>
                                <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-item" onClick={() => { setMenuAbierto(false); dataGridRef.current?.instance().exportToExcel(false); }}>
                                            <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                            {t('Exportar Excel')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="table-container" style={{ padding: '0 20px 20px 20px' }}>
                        <div style={{ height: 'calc(100vh - 180px)', width: '100%' }}>
                            <DataGrid
                                ref={dataGridRef}
                                dataSource={rows}
                                keyExpr="Id_Icg"
                                showBorders={true}
                                columnAutoWidth={false}
                                allowColumnResizing={true}
                                onExporting={onExporting}
                                className="mz-table"
                                height="100%"
                                rowAlternationEnabled={true}
                                showRowLines={true}
                                showColumnLines={true}
                                wordWrapEnabled={false}
                                noDataText={t('Sin datos para mostrar')}
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

                            <Toolbar>
                                <Item location="after" name="searchPanel" />
                                <Item location="after" name="columnChooserButton" />
                            </Toolbar>

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

                            <Column dataField="Id_Icg" caption="Id_Icg" width={90} />
                            <Column dataField="Localizador" caption="Localizador" width={110} />
                            <Column dataField="Concierto_id" caption="Concierto_id" width={110} />
                            <Column dataField="CodCASA" caption="Cód. CASA" width={110} />
                            <Column dataField="Mutua" caption="Mutua" width={140} />
                            <Column dataField="Centro_id" caption="Centro_id" width={100} />
                            <Column dataField="Centro" caption="Centro" width={180} />
                            <Column dataField="Poblacion" caption="Población" width={140} />
                            <Column dataField="Provincia" caption="Provincia" width={140} />
                            <Column dataField="AsistenciaSanitar" caption="Asistencia Sanitar." width={130} format="#,##0.00" />
                            <Column dataField="IncapacidadTemp" caption="Incapacidad Temp." width={130} format="#,##0.00" />
                            <Column dataField="Gastos" caption="Gastos" width={100} format="#,##0.00" />
                            <Column dataField="Articulo25" caption="Articulo 25" width={100} format="#,##0.00" />
                            <Column dataField="Total" caption="Total" width={110} format="#,##0.00" />

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
                                                console.log('Editar concierto:', cellData.data.Id_Icg);
                                            }}
                                            title={t('Editar')}
                                        />
                                        <i 
                                            className="ri-delete-bin-line delete-icon" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm(t('¿Está seguro de que desea eliminar este registro?'))) {
                                                    console.log('Eliminar concierto:', cellData.data.Id_Icg);
                                                }
                                            }}
                                            title={t('Eliminar')}
                                        />
                                    </div>
                                )}
                            />
                        </DataGrid>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Conciertos;