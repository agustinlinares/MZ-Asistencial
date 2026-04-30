import React, { useEffect, useRef, useState } from "react";
import './Centros.css';
import FincasService from "../../../services/admin/FincasService";
import FichaFinca from './FichaFinca';
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
} from "devextreme-react/data-grid";

import { useTranslation } from "react-i18next";


const Fincas = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [fincas, setFincas] = useState([]);
    const [selectedFinca, setSelectedFinca] = useState(null);
    const [centros, setCentros] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);


    useEffect(() => {
        const loadData = async () => {
            try {
                const [fincasData, centrosData] = await Promise.all([
                    FincasService.getAll(),
                    FincasService.getCentrosLookup()
                ]);
                setFincas(fincasData);
                setCentros(centrosData);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        loadData();
    }, []);

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
            setFincas(await FincasService.getAll());
        } catch (error) {
            console.error('Error al recargar fincas:', error);
        }
    };

    const handleSaveFinca = async (data) => {
        try {
            await FincasService.save(data);
            setSelectedFinca(null);
            await recargarFincas();
        } catch (error) {
            console.error('Error al guardar finca:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm(t('¿Está seguro de que desea eliminar esta finca?'))) return;
        try {
            await FincasService.delete(id);
            await recargarFincas();
        } catch (error) {
            console.error('Error al eliminar finca:', error);
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
                            <div className="title"> {t('LISTA FINCAS')}</div>

                            <div className="acciones-container" ref={menuRef}>
                                <div 
                                    className="acciones-btn"
                                    onClick={() => setMenuAbierto(v => !v)}
                                >
                                    {t('Acciones')}
                                    <i className="ri-more-2-fill"></i>
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
                            <>
                                <div className="grid-wrapper-fincas" style={{ height: 'calc(100vh - 190px)', width: '100%' }}>

                                    <DataGrid
                                        onRowDblClick={(e) => setSelectedFinca(e.data)}
                                        ref={dataGridRef}
                                        dataSource={fincas}
                                        keyExpr="Finca_id"
                                        showBorders={true}
                                        columnAutoWidth={true}
                                        allowColumnResizing={true}
                                        onExporting={(e) => FincasService.exportToExcel(e.component)}
                                        className="mz-table"
                                        height="100%"
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

                                    <Column dataField="Finca_id" caption="Finca ID" width={90} />
                                    <Column dataField="Centro_id" caption="Centro ID" width={90} />
                                    <Column dataField="Localizador" caption="Localizador" width={130} />
                                    <Column dataField="Centro" caption="Centro" width={180} />
                                    <Column 
                                        caption="Dirección" 
                                        width={250} 
                                        cellRender={(cell) => (
                                            <span>
                                                {cell.data.Direccion} {cell.data.Numero ? `nº ${cell.data.Numero}` : ''}
                                                {cell.data.Piso ? `, ${cell.data.Piso}` : ''} {cell.data.Puerta ? `- ${cell.data.Puerta}` : ''}
                                            </span>
                                        )}
                                    />
                                    <Column dataField="Utilizacion" caption="Utilización" width={120} />
                                    <Column dataField="Superficie" caption="Superficie" width={110} format="#,##0.00 m²" />
                                    <Column dataField="TipoFinca" caption="Tipo" width={120} />
                                    <Column dataField="Coste" caption="Coste" width={110} format="#,##0.00 €" />
                                    <Column dataField="F_Alquiler" caption="F. Alquiler" dataType="date" width={110} displayFormat="dd/MM/yyyy" />
                                    <Column dataField="Referencia_Catastral" caption="Ref. Catastral" width={160} />
                                    <Column dataField="F_Inscripcion" caption="F. Inscripción" dataType="date" width={110} displayFormat="dd/MM/yyyy" />
                                    <Column dataField="F_Baja" caption="F. Baja" dataType="date" width={110} displayFormat="dd/MM/yyyy" />
                                    <Column dataField="Titularidad" caption="Titularidad" width={180} />
                                    <Column
                                        caption={t('Acciones')}
                                        width={100}
                                        fixed={true}
                                        fixedPosition="right"
                                        alignment="center"
                                        cellRender={(cell) => (
                                            <div className="grid-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                                <div 
                                                    className="action-icon edit"
                                                    style={{ cursor: 'pointer', color: '#2f5da8', fontSize: '18px' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFinca(cell.data);
                                                    }}
                                                    title={t('Editar')}
                                                >
                                                    <i className="ri-edit-line"></i>
                                                </div>
                                                <div 
                                                    className="action-icon delete"
                                                    style={{ cursor: 'pointer', color: '#c62828', fontSize: '18px' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEliminar(cell.data.Finca_id);
                                                    }}
                                                    title={t('Eliminar')}
                                                >
                                                    <i className="ri-delete-bin-line"></i>
                                                </div>
                                            </div>
                                        )}
                                    />
                                    </DataGrid>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Fincas;
