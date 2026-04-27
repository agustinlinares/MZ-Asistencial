import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './Centros.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import AuthService from "../../../services/auth/AuthService";
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
    })
    e.cancel = true;
};

const authHeaders = () => {
    const token = AuthService.getToken();
    return { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
};

const Fincas = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [fincas, setFincas] = useState([]);
    const [selectedFinca, setSelectedFinca] = useState(null);
    const [centros, setCentros] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);


    useEffect(() => {
        const fetchFincas = async () => {
            try {
                const respuesta = await fetch('/api/FincasRegistrales', { headers: authHeaders() });
                if (respuesta.ok) {
                    const data = await respuesta.json();
                    setFincas(data);
                }
            } catch (error) {
                console.error('Error al cargar fincas registrales:', error);
            }
        };
        const fetchCentros = async () => {
            try {
                const respuesta = await fetch('/api/centros/lookup', { headers: authHeaders() });
                if (respuesta.ok) {
                    const data = await respuesta.json();
                    setCentros(data);
                }
            } catch (error) {
                console.error('Error al cargar centros:', error);
            }
        };
        fetchFincas();
        fetchCentros();
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
            const respuesta = await fetch('/api/FincasRegistrales', { headers: authHeaders() });
            if (respuesta.ok) setFincas(await respuesta.json());
        } catch (error) {
            console.error('Error al recargar fincas:', error);
        }
    };

    const handleSaveFinca = async (data) => {
        try {
            const isEdit = !!data.finca_id;
            const url = isEdit
                ? `/api/FincasRegistrales/${data.finca_id}`
                : '/api/FincasRegistrales';
            const method = isEdit ? 'PUT' : 'POST';
            const payload = {
                Finca_id: parseInt(data.finca_id) || 0,
                Centro_id: parseInt(data.centro_id) || 0,
                Mutua: data.mutua || null,
                Direccion: data.direccion || null,
                Superficie: data.superficie !== '' && data.superficie != null ? parseFloat(data.superficie) : null,
                Coste: data.coste !== '' && data.coste != null ? parseFloat(data.coste) : null,
                F_Alquiler: data.f_adquisicion || null,
                Referencia_Catastral: data.ref_catastral || null,
                F_Inscripcion: data.f_inscripcion || null,
                F_Baja: data.f_baja || null,
                TipoFinca: data.tipo_finca_idx != null ? parseInt(data.tipo_finca_idx) : null,
                Titularidad: data.titularidad || null,
                OtrosDatos: data.otros_datos || null,
                Utilizacion: data.utilizacion || null,
                DireccionGoogle: data.dir_google || null,
                Latitud: data.latitud || null,
                Longitud: data.longitud || null,
            };
            const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
            if (res.ok) {
                setSelectedFinca(null);
                await recargarFincas();
            } else {
                alert(`Error al guardar: ${res.status} ${res.statusText}`);
            }
        } catch (error) {
            console.error('Error al guardar finca:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleNuevo = () => {
        setMenuAbierto(false);
        setSelectedFinca({});
    };

    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        if (!grid) return;

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Fincas');

        exportDataGrid({
            component: grid,
            worksheet,
            autoFilterEnabled: true
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'Fincas.xlsx');
            });
        });
    };

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
                    doc.save('Fincas.pdf');
                });
            });
        });
    };


    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

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
                                        <i className="ri-add-line"></i>
                                        {t('Nuevo')}
                                    </div>

                                    <div className="acciones-item" onClick={handleExportarExcel}>
                                        <i className="ri-file-excel-2-line"></i>
                                        {t('Exportar a Excel')}
                                    </div>

                                    <div className="acciones-item" onClick={handleExportarPDF}>
                                        <i className="ri-file-pdf-line"></i>
                                        {t('Exportar a PDF')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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
                                        onRowClick={(e) => setSelectedFinca(e.data)}
                                        ref={dataGridRef}
                                        dataSource={fincas}
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
                                    <Column dataField="Direccion" caption="Dirección" width={220} />
                                    <Column dataField="Utilizacion" caption="Utilización" width={120} />
                                    <Column dataField="Superficie" caption="Superficie" width={100} />
                                    <Column dataField="Coste" caption="Coste" width={100} />
                                    <Column dataField="F_Alquiler" caption="F. Alquiler" dataType="date" width={110} />
                                    <Column dataField="Referencia_Catastral" caption="Ref. Catastral" width={160} />
                                    <Column dataField="F_Inscripcion" caption="F. Inscripción" dataType="date" width={110} />
                                    <Column dataField="F_Baja" caption="F. Baja" dataType="date" width={110} />
                                    <Column dataField="Titularidad" caption="Titularidad" width={180} />
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
