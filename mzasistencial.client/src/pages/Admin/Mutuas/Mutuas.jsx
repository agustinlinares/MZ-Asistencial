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
    Position,  //Posicion para el ColumnChooser
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
import notify from 'devextreme/ui/notify';
import { confirm as dxConfirm } from 'devextreme/ui/dialog';

import { loadMessages, locale } from 'devextreme/localization';

// Sobreescribimos solo el texto del ColumnChooser
loadMessages({
    'es': {
        'dxDataGrid-columnChooserTitle': 'Columnas',
    }
});
locale('es');


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



    // Bandera para saber si el chooser está abierto
    // Usamos useRef en lugar de useState para evitar re-renders
    const chooserAbiertoRef = useRef(false);

    useEffect(() => {
        const handleMouseDown = (e) => {
            const grid = dataGridRef.current?.instance();
            if (!grid) return;

            const button = document.querySelector('.dx-datagrid-column-chooser-button');
            const wrapper = document.querySelector('.dx-datagrid-column-chooser-mode-select');

            // Click en el botón
            if (button && button.contains(e.target)) {
                if (chooserAbiertoRef.current) {
                    grid.hideColumnChooser();
                    // onHiding se encarga de poner la bandera a false
                } else {
                    setTimeout(() => {
                        chooserAbiertoRef.current = true;
                    }, 0);
                }
                return;
            }

            // Click fuera del wrapper -> cerramos
            if (chooserAbiertoRef.current && wrapper && !wrapper.contains(e.target)) {
                grid.hideColumnChooser();
                // onHiding se encarga de poner la bandera a false
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, []);
    

    //Conectamos Backend con Frontend
    //Extraemos el fetch a una función reutilizable
    const cargarMutuas = () => {
        fetch("/api/mutuas")
            .then(response => response.json())
            .then(data => setMutuas(data))
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
        //const grid = dataGridRef.current.instance();
        const grid = dataGridRef.current?.instance();
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
        //const grid = dataGridRef.current.instance();
        const grid = dataGridRef.current?.instance();
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


    //Eliminar mutua
    const handleEliminar = async (id) => {
        const ok = await dxConfirm('¿Está seguro de que desea eliminar esta mutua?', 'Confirmar eliminación');
        if (!ok) return;

        // Usuario de sesión
        const userData = JSON.parse(
            localStorage.getItem('UsuarioActual') ||
            sessionStorage.getItem('user') ||
            '{}'
        );

        const usuarioId = userData.usuarioId || userData.UsuarioId || null;

        try {
            const res = await fetch(`/api/mutuas/${id}`, { method: 'DELETE' });
            const res = await fetch(`/api/mutuas/${id}?usuarioId=${usuarioId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                notify('Mutua eliminada correctamente', 'success', 2000);
                cargarMutuas();
            } else {
                notify('Error al eliminar la mutua', 'error', 3000);
            }
        } catch (error) {
            console.error('Error al eliminar mutua:', error);
            notify('Error de conexión al eliminar', 'error', 3000);
        }
    };

    //Estrucutra de flujo
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
                            {t('Lista de Mutuas')}
                        </div>

                        <div className="acciones-container" ref={menuRef}>
                            <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                <i className="ri-settings-3-line"></i>
                                {t('Acciones')}
                            </div>

                            {menuAbierto && (
                                <div className="acciones-menu">
                                    <div className="acciones-item" onClick={handleNuevo}>
                                        <i className="ri-add-line" style={{ color: '#1976d2' }}></i>
                                        Añadir Mutua
                                    </div>

                                    <div className="acciones-item" onClick={handleExportarExcel}>
                                        <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                        Exportar Excel
                                    </div>

                                    <div className="acciones-item" onClick={handleExportarPDF}>
                                        <i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i>
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
                            onRowDblClick={(e) => setSelectedMutua(e.data)} // Al hacer doble click guarda la fila para cargar su ficha
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
                            
                            <Toolbar>
                                <Item location="after" name="searchPanel" />
                                <Item location="after" name="columnChooserButton" />
                            </Toolbar>
                            <SearchPanel visible width={240} placeholder={t('buscar')} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible searchMode='contains' />
                            <Selection mode="multiple" allowSelectAll />
                            <Grouping autoExpandAll={false} />
                            
                            <ColumnChooser enabled mode="select"
                            //Ocultamos ???
                                onHiding={() => { chooserAbiertoRef.current = false; }} // Sincroniza cuando DevExtreme cierra
                            >
                                <Position
                                    my="right top"
                                    at="right bottom"
                                    of=".dx-datagrid-column-chooser-button"
                                />
                            </ColumnChooser>

                            <Export enabled fileName="Casos" allowExportSelectedData 
                            //Ocultamos
                            />

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

                            <Column dataField="numeroMutua" caption="Número de Mutua" fixed={true} fixedPosition="left"width={180} />

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
                                caption={t('Acciones')}
                                                          alignment="center"
                                cellRender={(cellData) => (
                                    <div className="ficha-row-actions">
                                        <i 
                                            className="ri-edit-line edit-icon" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedMutua(cellData.data);
                                            }}
                                            title={t('Editar')}
                                        />
                                        <i 
                                            className="ri-delete-bin-line delete-icon" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminar(cellData.data.numeroId);
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
        </React.Fragment>
    );
};

export default Mutuas;