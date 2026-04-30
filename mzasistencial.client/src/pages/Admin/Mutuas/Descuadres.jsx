import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import DataGrid, {
    Column, Paging, SearchPanel, FilterRow, HeaderFilter,
    Selection, Grouping, ColumnChooser, Export, Scrolling,
    Sorting, FilterPanel, ColumnFixing, Pager, Toolbar, Item,
} from "devextreme-react/data-grid";
import { useTranslation } from "react-i18next";
import '../../../styles/FichaGlobal.css';

const API = 'https://localhost:7132/api';

const onExporting = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Descuadres');
    exportDataGrid({ component: e.component, worksheet, autoFilterEnabled: true })
        .then(() => workbook.xlsx.writeBuffer()
            .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Descuadres.xlsx')));
    e.cancel = true;
};

const Descuadres = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        fetch(`${API}/Descuadres`)
            .then(res => res.json())
            .then(data => setDatos(data))
            .catch(err => console.error('Error al cargar descuadres:', err));
    }, []);

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content">

                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">{t('Lista de descuadres')}</span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={() => dataGridRef.current?.instance.exportToExcel(false)}>
                            📥 Exportar Excel
                        </button>
                    </div>
                </div>

                <div className="ficha-tab-content" style={{ padding: '16px' }}>
                    <DataGrid
                        ref={dataGridRef}
                        dataSource={datos}
                        keyExpr="mutuaId"
                        showBorders={true}
                        columnAutoWidth={true}
                        allowColumnResizing={true}
                        onExporting={onExporting}
                        className="mz-table"
                        rowAlternationEnabled={true}
                        showRowLines={true}
                        showColumnLines={true}
                        wordWrapEnabled={false}
                        noDataText="Sin datos para mostrar"
                    >
                        <Scrolling mode="standard" showScrollbar="always" />
                        <Paging defaultPageSize={25} />
                        <Pager visible={true} allowedPageSizes={[10, 25, 50]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                        <SearchPanel visible width={240} placeholder={t('Buscar...')} />
                        <FilterRow visible={true} applyFilter="auto" />
                        <HeaderFilter visible searchMode="contains" />
                        <Selection mode="multiple" allowSelectAll />
                        <Grouping autoExpandAll={false} />
                        <ColumnChooser enabled mode="select" />
                        <Export enabled fileName="Descuadres" allowExportSelectedData />
                        <Sorting mode="multiple" />
                        <FilterPanel visible />
                        <ColumnFixing enabled />
                        <Toolbar>
                            <Item name="searchPanel" />
                            <Item name="columnChooserButton" />
                            <Item name="exportButton" />
                        </Toolbar>
                        <Column dataField="mutuaId" caption="Nº" width={80} fixed fixedPosition="left" />
                        <Column dataField="mutua" caption="Mutua" width={150} fixed fixedPosition="left" />
                        <Column dataField="gastoPersonal" caption="Gasto Personal" width={130} />
                        <Column dataField="gastoCorrientes" caption="Gasto Corrientes" width={130} />
                        <Column dataField="gastosFinancieros" caption="Gastos Financieros" width={130} />
                        <Column dataField="amortizacion" caption="Amortización" width={130} />
                        <Column dataField="totalCostePropios" caption="TOTAL COSTE PROPIOS" width={150} />
                        <Column dataField="costeConciertos" caption="Coste conciertos" width={130} />
                        <Column dataField="aplicacion2581" caption="Aplicacion 258.1" width={130} />
                        <Column dataField="aplicacion2582" caption="Aplicacion 258.2" width={130} />
                        <Column dataField="restoArt25" caption="Resto art. 25" width={130} />
                        <Column dataField="totalArticulo25" caption="TOTAL ARTÍCULO 25" width={150} />
                        <Column dataField="inversionNueva" caption="Inversión nueva" width={130} />
                        <Column dataField="reposicion" caption="Reposición" width={130} />
                        <Column dataField="ingresosServicios" caption="Ingresos proced. prest. Servicios" width={220} />
                        <Column dataField="totalOtrosConceptos" caption="TOTAL OTROS CONCEPTOS" width={180} />
                        <Column dataField="totalGeneral" caption="TOTAL GENERAL" width={150} fixed fixedPosition="right" />
                        <Column dataField="propiosConf" caption="Propios conf." width={130} />
                        <Column dataField="propiosNoConf" caption="Propios no conf." width={130} />
                        <Column dataField="concertConf" caption="Concert. conf." width={130} />
                        <Column dataField="concertNoConf" caption="Concert. no conf." width={130} />
                    </DataGrid>
                </div>
            </div>
        </div>
    );
};

export default Descuadres;