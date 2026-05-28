import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Admin.css';
import '../../../styles/FichaGlobal.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import AuthService from "../../../services/auth/AuthService";
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
    Pager,
    Toolbar,
    Item,
    GroupPanel
} from "devextreme-react/data-grid";
import { useTranslation } from "react-i18next";
import notify from 'devextreme/ui/notify';

import { createStore } from 'devextreme-aspnet-data-nojquery';

const RegistrosActividad = () => {
    UseProtectedRoute();
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);
    const [menuAbierto, setMenuAbierto] = useState(false);

    // Creamos el CustomStore para conexión nativa DevExtreme <-> .NET
    const dataSource = React.useMemo(() => {
        return createStore({
            key: 'registroId',
            loadUrl: '/api/RegistrosActividad',
            onBeforeSend: (method, ajaxOptions) => {
                const token = AuthService.getToken();
                if (token) {
                    ajaxOptions.headers = {
                        Authorization: `Bearer ${token}`
                    };
                }
            }
        });
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

    const onExporting = (e) => {
        e.component.beginUpdate();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Registros Actividad');
        exportDataGrid({ component: e.component, worksheet, autoFilterEnabled: true })
            .then(() => workbook.xlsx.writeBuffer())
            .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'registros_actividad.xlsx'));
        e.component.endUpdate();
        e.cancel = true;
    };

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">{t('Registros de Actividad')}</div>

                        <div className="header-actions-side">
                            <div className="acciones-container" ref={menuRef}>
                                <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-item" onClick={() => {
                                            setMenuAbierto(false);
                                            const instance = dataGridRef.current?.instance();
                                            if (!instance) return;
                                            const wb = new Workbook();
                                            const ws = wb.addWorksheet('Registros Actividad');
                                            exportDataGrid({ component: instance, worksheet: ws, autoFilterEnabled: true })
                                                .then(() => wb.xlsx.writeBuffer())
                                                .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'registros_actividad.xlsx'));
                                        }}>
                                            <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                            {t('Exportar a Excel')}
                                        </div>
                                        
                                        <div className="acciones-item" onClick={() => {
                                            setMenuAbierto(false);
                                            dataGridRef.current?.instance()?.refresh();
                                        }}>
                                            <i className="ri-refresh-line" style={{ color: '#1976d2' }}></i>
                                            {t('Actualizar Datos')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="table-container" style={{ padding: '0 25px 25px 25px' }}>
                        <div style={{ height: 'calc(100vh - 220px)', width: '100%' }}>
                            <DataGrid
                                ref={dataGridRef}
                                dataSource={dataSource}
                                remoteOperations={true}
                                keyExpr="registroId"
                                showBorders={true}
                                columnAutoWidth={true}
                                allowColumnResizing={true}
                                onExporting={onExporting}
                                className="mz-table"
                                height="100%"
                                rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={true}
                            hoverStateEnabled={true}
                        >
                            <GroupPanel visible={true} emptyPanelText={t('Arrastre una columna aquí para agrupar por dicha columna')} />
                            <Toolbar>
                                <Item location="after" name="groupPanel" />
                                <Item location="after" name="searchPanel" />
                                <Item location="after" name="columnChooserButton" />
                            </Toolbar>

                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={25} />
                            <Pager visible={true} allowedPageSizes={true} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            <SearchPanel visible width={240} placeholder={t('buscar')} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible searchMode="contains" />
                            <Selection mode="single" />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled mode="select" />
                            <Export enabled fileName="Registros Actividad" />
                            <Sorting mode="multiple" />
                            <FilterPanel visible />
                            <ColumnFixing enabled />

                            <Column dataField="mutua" caption={t('Mutua')} minWidth={150} />
                            <Column dataField="usuario" caption={t('Usuario')} width={150} />
                            <Column
                                dataField="fecha"
                                caption={t('Fecha')}
                                dataType="datetime"
                                format="dd/MM/yyyy HH:mm"
                                width={160}
                                sortOrder="desc"
                            />
                            <Column dataField="accion" caption={t('Acción')} minWidth={300} />
                        </DataGrid>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default RegistrosActividad;