import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid as exportDataGridToExcel } from 'devextreme/excel_exporter';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import DataGrid, {
    Column, Paging, FilterRow, HeaderFilter, Selection,
    GroupPanel, Grouping, ColumnChooser, Export, Scrolling,
    Sorting, ColumnFixing, Pager, Toolbar, Item
} from "devextreme-react/data-grid";
import { useTranslation } from "react-i18next";
import '../Centros/FichaFinca.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5118/api';

const Ejercicios = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);

    const [menuAbierto, setMenuAbierto] = useState(false);
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setMenuAbierto(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        setCargando(true);
        fetch(`${API}/Ejercicios`)
            .then(res => res.json())
            .then(data => setDatos(data))
            .catch(err => console.error('Error al cargar ejercicios:', err))
            .finally(() => setCargando(false));
    }, []);

    const exportToExcel = () => {
        const context = dataGridRef.current.instance();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Lista Ejercicios');
        exportDataGridToExcel({ component: context, worksheet, autoFilterEnabled: true })
            .then(() => workbook.xlsx.writeBuffer()
                .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ListaEjercicios.xlsx')));
        setMenuAbierto(false);
    };

    const exportToPdf = () => {
        const doc = new jsPDF('l', 'mm', 'a4');
        const context = dataGridRef.current.instance();
        exportDataGridToPdf({ jsPDFDocument: doc, component: context })
            .then(() => doc.save('ListaEjercicios.pdf'));
        setMenuAbierto(false);
    };

    return (
        <div className="finca-container-inline">
            <div className="finca-inline-content">

                {/* HEADER */}
                <div className="finca-modal-header">
                    <span className="finca-modal-title">{t('EJERCICIOS')}</span>
                    <div className="acciones-container" ref={menuRef} style={{ marginTop: '20px' }}>
                        <div className="acciones-btn" onClick={() => setMenuAbierto(v => !v)} style={{ marginLeft: '20px', fontSize: '15px' }}>
                            <i className="ri-settings-3-line"></i>
                            {t('Exportar')}
                        </div>
                        {menuAbierto && (
                            <div className="acciones-menu">
                                <div className="acciones-item" onClick={exportToExcel}>
                                    <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                    {t('Exportar a Excel')}
                                </div>
                                <div className="acciones-item" onClick={exportToPdf}>
                                    <i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i>
                                    {t('Exportar a PDF')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* TABLA */}
                <div className="finca-tab-content" style={{ padding: '16px' }}>
                    <DataGrid
                        ref={dataGridRef}
                        dataSource={datos}
                        keyExpr="año"
                        showBorders={true}
                        columnAutoWidth={false}
                        allowColumnResizing={true}
                        className="mz-table"
                        rowAlternationEnabled={true}
                        showRowLines={true}
                        showColumnLines={true}
                        wordWrapEnabled={false}
                        width="100%"
                        noDataText={cargando ? 'Cargando...' : 'Sin datos para mostrar'}
                    >
                        <Scrolling mode="standard" showScrollbar="always" />
                        <Paging defaultPageSize={25} />
                        <Pager visible={true} allowedPageSizes={[10, 25, 50]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                        <FilterRow visible={true} applyFilter="auto" />
                        <HeaderFilter visible searchMode="contains" />
                        <Selection mode="multiple" allowSelectAll />
                        <GroupPanel visible={true} emptyPanelText="Arrastra una columna aqui para agrupar" />
                        <Grouping autoExpandAll={false} />
                        <ColumnChooser enabled mode="select" />
                        <Export enabled fileName="ListaEjercicios" allowExportSelectedData />
                        <Sorting mode="multiple" />
                        <ColumnFixing enabled />
                        <Toolbar>
                            <Item name="groupPanel" />
                            <Item name="columnChooserButton" />
                            <Item name="exportButton" />
                        </Toolbar>

                        <Column dataField="año" caption="Año" width={300} alignment="center" cssClass="dx-cell-large" />
                        <Column dataField="fechaApertura" caption="Fecha de Apertura" dataType="date" format="dd/MM/yyyy" width={600} alignment="center" cssClass="dx-cell-large" />
                        <Column dataField="fechaCierre" caption="Fecha de Cierre" dataType="date" format="dd/MM/yyyy" width={600} alignment="center" cssClass="dx-cell-large" />

                    </DataGrid>
                </div>
            </div>
        </div>
    );
};

export default Ejercicios;