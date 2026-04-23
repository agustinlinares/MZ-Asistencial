import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Mutuas.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import FichaMutua from './FichaMutua'; // Importamos la ficha
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
    Lookup
} from "devextreme-react/data-grid";

import { useTranslation } from "react-i18next";


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
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Mutuas.xlsx');
        });
    })
    e.cancel = true;
};

const Mutuas = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);

    const [mutuas, setMutuas] = useState([]);

    const [selectedMutua, setSelectedMutua] = useState(null); // Estado para la mutua seleccionada

    //Menú para acciones
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);

    // const { isAuthenticated } = UseProtectedRoute();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         console.error('No está registradoel usuario');
    //         // navigate('/'); 
    //     }
    // }, [isAuthenticated, navigate]); 


    // Al montar el componente cargamos los datos
    useEffect(() => {
        cargarMutuas();
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

    

    //Conectamos Backend con Frontend
    //Extraemos el fetch a una función reutilizable
    const cargarMutuas = () => {
        fetch("/api/mutuas")
            .then(response => response.json())
            .then(data => {
                console.log("Datos recibidos:", data);
                setMutuas(data);
            })
            .catch(error => console.error("Error cargando mutuas:", error));
    };

    // Función que cierra la ficha Y recarga los datos
    const handleCerrarFicha = () => {
        setSelectedMutua(null);
        cargarMutuas(); // recarga la lista con los datos actualizados
    };

    // Abrir ficha vacia
    const handleNuevo = () => {
        setMenuAbierto(false);
        setSelectedMutua({}); // Ficha vacia
    };

    //Exportar a excel
    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        if (!grid) return;

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Mutuas');

        exportDataGrid({
            component: grid,
            worksheet,
            autoFilterEnabled: true
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'Mutuas.xlsx');
            });
        });
    };

    //Exportar a PDF
    const handleExportarPDF = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        if (!grid) return;

        import('devextreme/pdf_exporter').then(({ exportDataGrid }) => {
            import('jspdf').then(({ jsPDF }) => {
                const doc = new jsPDF({ orientation: 'landscape' });

                exportDataGrid({
                    jsPDFDocument: doc,
                    component: grid,
                    indent: 5,
                }).then(() => {
                    doc.save('Mutuas.pdf');
                });
            });
        });
    };

    //Estrucutra de flijo
    // Si hay mutua seleccionada mostramos la ficha
    if (selectedMutua) {
        return (
            <FichaMutua
                mutua={selectedMutua}
                onClose={handleCerrarFicha}
            />
        );
    }

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">
                            {t('Lista de mutuas')}
                        </div>

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
                                        <i className="ri-add-line"></i>
                                        Nuevo
                                    </div>

                                    <div className="acciones-item" onClick={handleExportarExcel}>
                                        <i className="ri-file-excel-2-line"></i>
                                        Exportar Excel
                                    </div>

                                    <div className="acciones-item" onClick={handleExportarPDF}>
                                        <i className="ri-file-pdf-line"></i>
                                        Exportar PDF
                                    </div>
                                </div>
                            )}
                        </div>  
                    </div>

                    <div className="table-container" style={{ position: 'relative' }}>

                        {/* Si hay una mutua seleccionada, mostramos la ficha */}
                        {selectedMutua && (
                            <FichaMutua
                                mutua={selectedMutua}
                                //onClose={() => setSelectedMutua(null)}
                                onClose={handleCerrarFicha}
                            />
                        )}

                        <DataGrid
                            ref={dataGridRef}
                            dataSource={mutuas}
                            //dataSource={sampleData}
                            keyExpr="numeroId"
                            onRowDblClick={(e) => setSelectedMutua(e.data)} // Al hacer doble click guarda la fila para cargar sus fichas
                            //keyExpr="CodigoPersona"
                            showBorders={true}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            onExporting={onExporting}
                            className="mz-table"
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



                            {/* ── COLUMNAS ─────────────────────────────────────────────────── */}
                            

                            <Column
                                //dataField="id"
                                dataField="numeroId"
                                caption="Nº"
                                fixed={true}
                                fixedPosition="left"
                                width={80}
                            />

                            <Column dataField="numeroMutua" caption="Número de Mutua" fixed={true} fixedPosition="left"width={160} />

                            <Column
                                //dataField="mutua"
                                dataField="mutua"
                                caption="Mutua"
                                fixed={true}
                                fixedPosition="left"
                                width={150}
                            />


                            <Column dataField="direccion" caption="Dirección" width={250} />
                            <Column dataField="cp" caption="C.P" width={100} />
                            <Column dataField="poblacion" caption="Población" width={150} />
                            <Column dataField="provincia" caption="Provincia" width={150} />


                            <Column
                                dataField="acciones"
                                caption="Acciones"
                                fixed={true}
                                fixedPosition="right"
                                width={130}
                                alignment="center"
                                cellRender={(cellData) => (
                                    <div 
                                        style={{ color: '#2f5da8', cursor: 'pointer', textAlign: 'center' }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Evita conflictos con el grid
                                            setSelectedMutua(cellData.data); //Abre solo con un click
                                        }}
                                    >
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

export default Mutuas;