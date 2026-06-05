import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './Centros.css';
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
} from "devextreme-react/data-grid";
import { useTranslation } from "react-i18next";

const authHeaders = () => {
    const token = AuthService.getToken();
    return { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
};

const AcreditacionesIndividuales = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);
    const [acreditaciones, setAcreditaciones] = useState([]);
    const usuarioId = AuthService.getUserData()?.usuarioId || 0;
    const [menuAbierto, setMenuAbierto] = useState(false);

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
        const cargarDatos = async () => {
            try {
                const [resDatos, resAño] = await Promise.all([
                    fetch(`/api/AcreditacionesIndividuales?usuarioId=${usuarioId}`, { headers: authHeaders() }),
                    fetch('/api/AcreditacionesIndividuales/max-year', { headers: authHeaders() }),
                ]);

                if (resDatos.ok) {
                    const datos = await resDatos.json();
                    setAcreditaciones(datos);

                    if (resAño.ok) {
                        const { año } = await resAño.json();
                        setTimeout(() => {
                            dataGridRef.current?.instance()?.columnOption('año', 'filterValue', año);
                        }, 0);
                    }
                }
            } catch (error) {
                console.error('Error cargando acreditaciones individuales:', error);
            }
        };
        cargarDatos();
    }, []);

    const handleRowClick = async (e) => {
        const id = e.data?.ficheroId;
        if (!id) return;

        try {
            const respuesta = await fetch(`/api/AcreditacionesIndividuales/${id}/download`, {
                method: 'GET',
                headers: authHeaders(),
            });

            if (!respuesta.ok) {
                console.error('Fichero no encontrado en el servidor.');
                return;
            }

            const contentDisposition = respuesta.headers.get('Content-Disposition');
            let nombreFichero = e.data?.nombreFichero || `acreditacion_${id}.pdf`;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match?.[1]) nombreFichero = match[1].replace(/['"]/g, '');
            }

            const blob = await respuesta.blob();
            saveAs(blob, nombreFichero);
        } catch (error) {
            console.error('Error descargando el fichero:', error);
        }
    };

    const onExporting = (e) => {
        e.component.beginUpdate();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Acreditaciones Individuales');
        exportDataGrid({ component: e.component, worksheet, autoFilterEnabled: true })
            .then(() => workbook.xlsx.writeBuffer())
            .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'acreditaciones_individuales.xlsx'));
        e.cancel = true;
    };

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">{t('Lista de Acreditaciones Individuales')}</div>

                        <div className="header-actions-side">
                            <div className="acciones-container" ref={menuRef}>
                                <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-menu-header">
                                            <span>{t('Cerrar opciones')}</span>
                                            <i className="ri-close-line" onClick={() => setMenuAbierto(false)} />
                                        </div>

                                        <div className="acciones-item" onClick={() => {
                                            setMenuAbierto(false);
                                            const instance = dataGridRef.current?.instance();
                                            if (!instance) return;
                                            const wb = new Workbook();
                                            const ws = wb.addWorksheet('Acreditaciones Individuales');
                                            exportDataGrid({ component: instance, worksheet: ws, autoFilterEnabled: true })
                                                .then(() => wb.xlsx.writeBuffer())
                                                .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'acreditaciones_individuales.xlsx'));
                                        }}>
                                            <i className="ri-file-excel-2-line"></i>
                                            {t('Exportar Excel')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={acreditaciones}
                            keyExpr="ficheroId"
                            showBorders={true}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            onExporting={onExporting}
                            onRowClick={handleRowClick}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
                            hoverStateEnabled={true}
                        >
                            <Toolbar>
                                <Item location="after" name="searchPanel" />
                                <Item location="after" name="columnChooserButton" />
                            </Toolbar>

                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={25} />
                            <Pager visible={true} allowedPageSizes={true} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            <SearchPanel visible width={240} placeholder={t('buscar')} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible searchMode="contains" />
                            <Selection mode="multiple" allowSelectAll />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled mode="select" />
                            <Export enabled fileName="AcreditacionesIndividuales" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <FilterPanel visible />
                            <ColumnFixing enabled />

                            <Column dataField="nombreFichero" caption={t('Nombre Fichero')} minWidth={200} />
                            <Column dataField="servicio"      caption={t('Servicio')}       width={160} />
                            <Column dataField="especialidad"  caption={t('Especialidad')}   width={160} />
                            <Column dataField="poblacion"     caption={t('Población')}      width={150} />
                            <Column dataField="provincia"     caption={t('Provincia')}      width={130} />
                            <Column dataField="mutua"         caption={t('Mutua')}          width={150} />
                            <Column dataField="demandaId"     caption={t('Demanda')}        width={100} />
                            <Column
                                dataField="fechaAlta"
                                caption={t('Fecha Alta')}
                                dataType="date"
                                format="dd/MM/yyyy"
                                width={120}
                            />
                            <Column
                                dataField="año"
                                caption={t('Año')}
                                dataType="number"
                                width={80}
                            />
                        </DataGrid>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AcreditacionesIndividuales;
