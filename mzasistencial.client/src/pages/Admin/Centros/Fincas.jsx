import React, { useEffect, useRef, useState } from "react";
import './Centros.css';
import { SelectBox } from "devextreme-react/select-box";
import { CheckBox } from "devextreme-react/check-box";
import '../../../styles/FichaGlobal.css';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import FichaFinca from './FichaFinca';
import FincasService from "../../../services/admin/FincasService";
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
    Summary,
    TotalItem
} from "devextreme-react/data-grid";

import { useTranslation } from "react-i18next";
import notify from 'devextreme/ui/notify';
import { confirm as dxConfirm } from 'devextreme/ui/dialog';

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
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Fincas.xlsx');
        });
    });
    e.cancel = true;
};

// ✅ Sin token — usamos sessionStorage para autenticación
const authHeaders = () => ({ 'Content-Type': 'application/json' });

const Fincas = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [fincas, setFincas] = useState([]);
    const [selectedFinca, setSelectedFinca] = useState(null);
    const [centros, setCentros] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [anio, setAnio] = useState("2025");
    const [soloConCoste, setSoloConCoste] = useState(false);
    const YEARS = ["2022", "2023", "2024", "2025", "2026"];
    const menuRef = useRef(null);

    useEffect(() => {
        const fetchFincas = async () => {
            try {
                const fincasData = await FincasService.getAll(anio);
                setFincas(fincasData);
            } catch (error) {
                console.error('Error fetching fincas:', error);
            }
        };

        // ✅ Endpoint corregido: /api/CentrosPropios en lugar de /api/centros/lookup
        const fetchCentros = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('UsuarioActual') || sessionStorage.getItem('user') || '{}');
                const perfilId = userData?.perfilId ?? userData?.perfilID ?? '';
                const respuesta = await fetch(`/api/CentrosPropios?perfilId=${perfilId}`, { headers: authHeaders() });
                if (respuesta.ok) {
                    const data = await respuesta.json();
                    // ✅ Mapear al formato { id, nombre } que usa FichaFinca
                    setCentros(data.map(c => ({ id: c.centroId, nombre: c.centro })));
                }
            } catch (error) {
                console.error('Error al cargar centros:', error);
            }
        };

        fetchFincas();
        fetchCentros();
    }, [anio]);

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const recargarFincas = async () => {
        try {
            setFincas(await FincasService.getAll(anio));
        } catch (error) {
            console.error('Error al recargar fincas:', error);
        }
    };

    const handleSaveFinca = async (data) => {
        try {
            await FincasService.save(data);
            notify('Finca guardada correctamente', 'success', 2000);
            setSelectedFinca(null);
            await recargarFincas();
        } catch (error) {
            console.error('Error al guardar finca:', error);
            notify(`Error al guardar: ${error.message}`, 'error', 3000);
        }
    };

    const handleEliminar = async (id) => {
        const ok = await dxConfirm(t('¿Está seguro de que desea eliminar esta finca?'), 'Confirmar eliminación');
        if (!ok) return;
        try {
            await FincasService.delete(id);
            notify('Finca eliminada correctamente', 'success', 2000);
            await recargarFincas();
        } catch (error) {
            console.error('Error al eliminar finca:', error);
            notify('Error al eliminar la finca', 'error', 3000);
        }
    };

    const handleNuevo = () => {
        setMenuAbierto(false);
        setSelectedFinca({});
    };

    const handleExportarExcel = () => {
        setMenuAbierto(false);
        FincasService.exportToExcel(dataGridRef.current.instance());
    };

    const handleExportarPDF = () => {
        setMenuAbierto(false);
        FincasService.exportToPDF(dataGridRef.current.instance());
    };

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    {!selectedFinca && (
                        <div className="header-page">

                            <div className="title">{t('Patrimonio y Fincas Registrales')}</div>

                            <div className="header-actions-side" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div className="filter-controls">
                                    <div className="year-selector-wrap">
                                        <span className="year-label">{t('Año')}:</span>
                                        <SelectBox
                                            items={YEARS}
                                            value={anio}
                                            onValueChanged={(e) => setAnio(e.value)}
                                            width={100}
                                        />
                                    </div>

                                    <div className="cost-toggle-container">
                                        <CheckBox
                                            text={t('Solo con coste')}
                                            value={soloConCoste}
                                            onValueChanged={(e) => setSoloConCoste(e.value)}
                                        />
                                    </div>
                                </div>

                            <div className="acciones-container" ref={menuRef}>
                                <div
                                    className="acciones-btn"
                                    onClick={() => setMenuAbierto(v => !v)}
                                >
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-item" onClick={handleNuevo}>
                                            <i className="ri-add-line" style={{ color: '#1976d2' }}></i>
                                            {t('Nuevo')}
                                        </div>

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
                )}

                    <div className="table-container tabla-contenedor">
                        {selectedFinca ? (
                            <FichaFinca
                                finca={selectedFinca}
                                centros={centros}
                                onClose={() => setSelectedFinca(null)}
                                onSave={handleSaveFinca}
                            />
                        ) : (
                            <div className="grid-wrapper-fincas" style={{ height: 'calc(100vh - 190px)', width: '100%' }}>
                                <DataGrid
                                    onRowClick={(e) => setSelectedFinca(e.data)}
                                    ref={dataGridRef}
                                    dataSource={soloConCoste ? fincas.filter(f => (f.Coste || 0) > 0) : fincas}
                                    keyExpr="Finca_id"
                                    showBorders={true}
                                    columnAutoWidth={true}
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
                                    <Paging defaultPageSize={25} />
                                    <Pager visible={true} allowedPageSizes={[10, 25, 50, 100]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                                    
                                    <Toolbar>
                                        <Item location="after" name="searchPanel" />
                                        <Item location="after" name="columnChooserButton" />
                                    </Toolbar>

                                    <SearchPanel visible width={240} placeholder={t('buscar')} />
                                    <ColumnChooser enabled mode="select" />
                                    <Export enabled fileName="Fincas" allowExportSelectedData />
                                    
                                    <FilterRow visible={true} applyFilter="auto" />
                                    <HeaderFilter visible searchMode='contains' />
                                    <Selection mode="multiple" allowSelectAll />
                                    <Grouping autoExpandAll={false} />
                                    
                                    <Sorting mode="multiple" />
                                    <FilterPanel visible />
                                    <ColumnFixing enabled />

                                    <Column dataField="Finca_id" caption="Finca ID" width={90} />
                                    <Column dataField="Centro_id" caption="Centro ID" width={90} />
                                    <Column dataField="Localizador" caption="Localizador" width={130} />
                                    <Column dataField="Centro" caption="Centro" width={180} />
                                    <Column dataField="Direccion" caption="Dirección" width={220} />
                                    <Column dataField="Utilizacion" caption="Utilización" width={120} />
                                    <Column dataField="Superficie" caption="Superficie" width={100} format="#,##0.00 m²" />
                                    <Column 
                                        dataField="TipoFinca" 
                                        caption="Tipo" 
                                        width={120} 
                                        cellRender={(cell) => {
                                            const TIPOS_FINCA = ['SÓTANO', 'PLANTA BAJA', 'PISO', 'LOCAL', 'GARAJE', 'TRASTERO'];
                                            return cell.value != null ? (TIPOS_FINCA[cell.value] || cell.value) : '—';
                                        }}
                                    />
                                    <Column 
                                        dataField="Coste" 
                                        caption="Coste" 
                                        width={110} 
                                        format="#,##0.00 €"
                                        cellRender={(cell) => (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: !cell.value ? '#d32f2f' : 'inherit' }}>
                                                <span>{cell.text}</span>
                                                {!cell.value && <i className="ri-error-warning-line" title={t('Sin coste declarado para este ejercicio')} style={{ fontSize: '16px' }}></i>}
                                            </div>
                                        )}
                                    />
                                    <Column dataField="F_Alquiler" caption="F. Alquiler" dataType="date" width={110} />
                                    <Column dataField="Referencia_Catastral" caption="Ref. Catastral" width={160} />
                                    <Column dataField="F_Inscripcion" caption="F. Inscripción" dataType="date" width={110} />
                                    <Column dataField="F_Baja" caption="F. Baja" dataType="date" width={110} />
                                    <Column dataField="Titularidad" caption="Titularidad" width={180} />
                                    <Column dataField="FechaAlta" caption="Creado" dataType="date" visible={false} width={150} format="dd/MM/yyyy HH:mm" />
                                    <Column dataField="FechaModificacion" caption="Modificado" dataType="date" visible={false} width={150} format="dd/MM/yyyy HH:mm" />
                                    
                                    <Summary>
                                        <TotalItem column="Finca_id" displayFormat="TOTAL" />
                                        <TotalItem column="Superficie" summaryType="sum" displayFormat="{0}" valueFormat="#,##0.00" />
                                        <TotalItem column="Coste" summaryType="sum" displayFormat="{0}" valueFormat="#,##0.00" />
                                    </Summary>

                                    <Column
                                        caption="Acciones"
                                        width={80}
                                        fixed={true}
                                        fixedPosition="right"
                                        alignment="center"
                                        cellRender={(cell) => (
                                            <div className="ficha-row-actions">
                                                <i 
                                                    className="ri-edit-line edit-icon" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFinca(cell.data);
                                                    }}
                                                    title={t('Editar')}
                                                />
                                                <i 
                                                    className="ri-delete-bin-line delete-icon" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEliminar(cell.data.Finca_id);
                                                    }}
                                                    title={t('Eliminar')}
                                                />
                                            </div>
                                        )}
                                    />
                                </DataGrid>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Fincas;