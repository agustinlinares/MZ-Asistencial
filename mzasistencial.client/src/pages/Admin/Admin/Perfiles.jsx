import React, { useEffect, useState, useRef } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import DataGrid, {
    Column, Paging, Pager, SearchPanel, FilterRow, HeaderFilter,
    Selection, GroupPanel, Grouping, ColumnChooser, Toolbar, Item,
    Scrolling, Sorting, ColumnFixing
} from 'devextreme-react/data-grid';
import { usuariosService } from '../../../services/admin/UsuariosService';
import notify from 'devextreme/ui/notify';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { useTranslation } from "react-i18next";
import './Admin.css';

const Perfiles = () => {
    UseProtectedRoute();
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);
    const [perfiles, setPerfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuAbierto, setMenuAbierto] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await usuariosService.getPerfiles();
            setPerfiles(data);
        } catch (error) {
            notify(error.message, 'error', 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        if (!grid) return;
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Perfiles');
        
        exportDataGrid({
            component: grid,
            worksheet,
            autoFilterEnabled: true
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Perfiles.xlsx');
            });
        });
    };

    const handleExportarPDF = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        if (!grid) return;
        import('devextreme/pdf_exporter').then(({ exportDataGrid: exportPDF }) => {
            import('jspdf').then(({ jsPDF }) => {
                const doc = new jsPDF({ orientation: 'portrait' });
                exportPDF({
                    jsPDFDocument: doc,
                    component: grid,
                    indent: 5,
                }).then(() => {
                    doc.save('Perfiles.pdf');
                });
            });
        });
    };

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">
                    <div className="header-page">
                        <div className="title">
                            {t('Perfiles')}
                        </div>
                        <div className="header-actions-side">
                            <div className="acciones-container" ref={menuRef}>
                                <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-item" onClick={handleExportarExcel}>
                                            <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                            {t('Exportar a Excel')}
                                        </div>
                                        <div className="acciones-item" onClick={handleExportarPDF}>
                                            <i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i>
                                            {t('Exportar a PDF')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="table-container tabla-contenedor">
                        <div className="grid-wrapper-usuarios" style={{ height: 'calc(100vh - 190px)', width: '100%' }}>
                            <DataGrid
                                ref={dataGridRef}
                                dataSource={perfiles}
                                showBorders={true}
                                rowAlternationEnabled={true}
                                columnAutoWidth={true}
                                className="mz-table"
                                height="100%"
                            >
                                <Scrolling mode="standard" showScrollbar="always" />
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[10, 20, 50, 100]} displayMode="full" showPageSizeSelector={true} showInfo={true} showNavigationButtons={true} />
                                
                                <Toolbar>
                                    <Item location="after" name="searchPanel" />
                                    <Item location="after" name="columnChooserButton" />
                                </Toolbar>

                                <SearchPanel visible={true} width={240} placeholder={t('Buscar...')} />
                                <FilterRow visible={true} applyFilter="auto" />
                                <HeaderFilter visible={true} />
                                <Selection mode="single" />
                                <GroupPanel visible={true} emptyPanelText={t('Arrastre una columna aquí para agrupar por dicha columna')} />
                                <Grouping autoExpandAll={false} />
                                <ColumnChooser enabled={true} mode="select" />
                                <Sorting mode="multiple" />
                                <ColumnFixing enabled={true} />

                                <Column dataField="perfilId" caption={t('Código Perfil')} dataType="number" alignment="left" />
                                <Column dataField="perfil" caption={t('Perfil')} dataType="string" />
                            </DataGrid>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Perfiles;