import React, { useEffect, useRef, useState } from "react";
import DataGrid, {
    Column, SearchPanel, FilterRow, HeaderFilter, Selection,
    Grouping, ColumnChooser, Export, Sorting, FilterPanel, ColumnFixing,
    Scrolling, Paging, Pager, Toolbar, Item
} from "devextreme-react/data-grid";
import { confirm as dxConfirm } from 'devextreme/ui/dialog'; 
import { presupuestosLiquidadosService } from "@services/admin/presupuestosLiquidadosService";
import FichaPresupuestoLiquidado from "./FichaPresupuestoLiquidado";
import './Admin.css';

const PresupuestosLiquidados = () => {
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);
    const [gridInstance, setGridInstance] = useState(null);
    const [presupuestos, setPresupuestos] = useState([]);
    
    // Estados de navegación y UI
    const [vistaActual, setVistaActual] = useState('lista');
    const [idSeleccionado, setIdSeleccionado] = useState(null);
    const [menuAccionesAbierto, setMenuAccionesAbierto] = useState(false);

    const cargarDatos = async () => {
        try {
            const datos = await presupuestosLiquidadosService.obtenerTodos();
            setPresupuestos(datos);
        } catch (error) {
            console.error("Error al cargar presupuestos", error);
        }
    };

    useEffect(() => {
        cargarDatos();
        
        // Cerrar menú al hacer clic fuera
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuAccionesAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const abrirFicha = (id = null) => {
        setIdSeleccionado(id);
        setVistaActual('ficha');
    };

    const cerrarFicha = () => {
        setVistaActual('lista');
        setIdSeleccionado(null);
        cargarDatos();
    };

    const darDeBajaPresupuesto = async (id) => {
        try {
            await presupuestosLiquidadosService.eliminar(id);
            cargarDatos();
        } catch (error) {
            console.error("Error al eliminar", error);
        }
    };

    const exportarManualExcel = (soloSeleccionados) => {
        if (gridInstance) {
            // DevExtreme maneja la selección automáticamente si pasas la config adecuada
            gridInstance.exportToExcel(soloSeleccionados); 
        }
    };

    const exportarManualPDF = () => {
        if (gridInstance) {
            gridInstance.exportToPdf();
        }
    };

    const [mutuas, setMutuas] = useState([]);

    const cargarCatalogos = async () => {
        try {
            const response = await fetch('/api/Mutuas');
            if (response.ok) {
                const data = await response.json();
                console.log("👉 Mutuas recibidas del backend:", data);
                setMutuas(data); 
            }
        } catch (error) {
            console.error("Error al cargar mutuas", error);
        }
    };

    // Modificamos el useEffect inicial para que llame a ambas cargas
    useEffect(() => {
        cargarDatos();
        cargarCatalogos();
        
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuAccionesAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (vistaActual === 'ficha') {
        return <FichaPresupuestoLiquidado idPresupuesto={idSeleccionado} onCerrar={cerrarFicha} />;
    }

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">
                    
                    <div className="header-page">
                        <div className="title">
                            Presupuestos Liquidados
                        </div>

                        {/* El menú de acciones solo se muestra si estamos en la vista de lista */}
                        {vistaActual === 'lista' && (
                            <div className="acciones-container" ref={menuRef}>
                                <div 
                                    className="acciones-btn"
                                    onClick={() => setMenuAccionesAbierto(v => !v)}
                                >
                                    <i className="ri-settings-3-line"></i>
                                    Acciones
                                </div>

                                {menuAccionesAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-item" onClick={() => { abrirFicha(null); setMenuAccionesAbierto(false); }}>
                                            <i className="ri-add-line" style={{ color: '#1a5fa8' }}></i>
                                            Nuevo presupuesto
                                        </div>

                                        <div className="acciones-item" onClick={() => { exportarManualExcel(false); setMenuAccionesAbierto(false); }}>
                                            <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                            Exportar todo a Excel
                                        </div>

                                        <div className="acciones-item" onClick={() => { exportarManualExcel(true); setMenuAccionesAbierto(false); }}>
                                            <i className="ri-file-excel-2-fill" style={{ color: '#2e7d32' }}></i>
                                            Exportar seleccionadas (Excel)
                                        </div>

                                        <div className="acciones-item" onClick={() => { exportarManualPDF(); setMenuAccionesAbierto(false); }}>
                                            <i className="ri-file-pdf-line" style={{ color: '#d32f2f' }}></i>
                                            Exportar todo a PDF
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CONTENEDOR PRINCIPAL: Alterna entre Ficha y Grid calcando vuestra lógica */}
                    <div className="table-container tabla-contenedor">
                        {vistaActual === 'ficha' ? (
                            <FichaPresupuestoLiquidado 
                                idPresupuesto={idSeleccionado} 
                                onCerrar={cerrarFicha} 
                                mutuas={mutuas}
                            />
                        ) : (
                            <div className="grid-wrapper-centros" style={{ height: 'calc(100vh - 180px)', width: '100%' }}>
                                <DataGrid
                                    ref={dataGridRef}
                                    onInitialized={(e) => setGridInstance(e.component)}
                                    dataSource={presupuestos}
                                    keyExpr="idPresupuesto"
                                    showBorders={true}
                                    columnAutoWidth={true}
                                    allowColumnResizing={true}
                                    className="mz-table"
                                    height="100%"
                                    rowAlternationEnabled={true}
                                    showRowLines={true}
                                    showColumnLines={true}
                                    wordWrapEnabled={false}
                                    onRowDblClick={(e) => abrirFicha(e.data.idPresupuesto)}
                                >
                                    <Scrolling mode="standard" showScrollbar="always" />
                                    <Paging defaultPageSize={25} />
                                    <Pager visible={true} allowedPageSizes={true} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                                    
                                    <Toolbar>
                                        <Item location="after" name="searchPanel" />
                                        <Item location="after" name="columnChooserButton" />
                                    </Toolbar>

                                    <SearchPanel visible width={240} placeholder="Buscar" />
                                    <FilterRow visible={true} applyFilter="auto" />
                                    <HeaderFilter visible searchMode='contains' />
                                    <Selection mode="multiple" allowSelectAll />
                                    <Grouping autoExpandAll={false} />
                                    <ColumnChooser enabled={true} mode="select" />
                                    <Export enabled={true} formats={['xlsx', 'pdf']} fileName="PresupuestosLiquidados" allowExportSelectedData />
                                    <Sorting mode="multiple" />
                                    <FilterPanel visible />
                                    <ColumnFixing enabled />

                                    <Column dataField="año" caption="Año" alignment="center" width={100} dataType="string" />
                                    <Column dataField="mutuaNombre" caption="Mutua" alignment="left" dataType="string" />
                                    <Column dataField="totalCentrosPropios" caption="Total Centros Propios" dataType="number" format="#,##0.00 €" />
                                    <Column dataField="totalCentrosConcertados" caption="Total Centros Concertados" dataType="number" format="#,##0.00 €" />
                                    <Column dataField="totalOtrosConceptos" caption="Total Otros Conceptos" dataType="number" format="#,##0.00 €" />
                                    <Column dataField="totalGeneral" caption="Total" dataType="number" format="#,##0.00 €" cssClass="font-weight-bold" />
                                    
                                    <Column
                                        caption="Acciones"
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
                                                        abrirFicha(cellData.data.idPresupuesto);
                                                    }}
                                                    title="Editar"
                                                />
                                                <i 
                                                    className="ri-delete-bin-line delete-icon" 
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        const ok = await dxConfirm(
                                                            '¿Está seguro de que desea eliminar este presupuesto?', 
                                                            'Confirmar baja'
                                                        );
                                                        if (ok) {
                                                            darDeBajaPresupuesto(cellData.data.idPresupuesto); 
                                                        }
                                                    }}
                                                    title="Eliminar"
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

export default PresupuestosLiquidados;