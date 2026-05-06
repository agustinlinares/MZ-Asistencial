import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './Centros.css';
import '../../../styles/FichaGlobal.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FichaCentroPropio from "./FichaCentroPropio";
import DataGrid, {
    Column, Paging, SearchPanel, FilterRow, HeaderFilter,
    Selection, GroupPanel, Grouping, ColumnChooser, Export,
    Scrolling, Sorting, ColumnFixing, Pager, Toolbar, Item
} from "devextreme-react/data-grid";

const API_URL = "/api/CentrosPropios";

// ✅ Helper: obtener usuario de sesión
const getUsuarioSesion = () => {
    try {
        const raw = sessionStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

// ✅ Helper: determinar si el usuario es admin (perfilId === 1)
const esAdmin = () => {
    const user = getUsuarioSesion();
    return user?.perfilId === 1;
};

const MapaCell = (cell) => {
    const d = cell.data;
    if (d.latitud && d.longitud) {
        return React.createElement('a', {
            href: 'https://maps.google.com/?q=' + d.latitud + ',' + d.longitud,
            target: '_blank', rel: 'noreferrer',
            onClick: (e) => e.stopPropagation(),
            style: { color: '#1976d2', textDecoration: 'none' }
        }, 'Ver');
    }
    return React.createElement('span', { style: { color: '#aaa' } }, '-');
};

const DesactivadoCell = (cell) => {
    return React.createElement('span', {
        style: {
            display: 'inline-block', padding: '2px 10px', borderRadius: '10px',
            fontSize: '11px', fontWeight: 600,
            background: cell.value ? '#ffebee' : '#e8f5e9',
            color: cell.value ? '#c62828' : '#2e7d32'
        }
    }, cell.value ? 'Si' : 'No');
};

const CentrosPropios = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [centros, setCentros] = useState([]);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [validando, setValidando] = useState(false);
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const admin = esAdmin();

    useEffect(() => {
        const user = getUsuarioSesion();
        const perfilId = user?.perfilId ?? '';
        fetch(`${API_URL}?perfilId=${perfilId}`)
            .then(res => { if (!res.ok) throw new Error('Error ' + res.status); return res.json(); })
            .then(data => setCentros(data))
            .catch(err => console.error('Error cargando centros:', err));
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

    const handleNuevo = () => {
        setMenuAbierto(false);
        setSelectedCentro({});
    };

    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        if (!grid) return;
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('CentrosPropios');
        exportDataGrid({ component: grid, worksheet, autoFilterEnabled: true }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CentrosPropios.xlsx');
            });
        });
    };

    const handleExportarPDF = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        if (!grid) return;
        import('devextreme/pdf_exporter').then(({ exportDataGrid: exportPDF }) => {
            import('jspdf').then(({ jsPDF }) => {
                const doc = new jsPDF({ orientation: 'landscape' });
                exportPDF({
                    jsPDFDocument: doc,
                    component: grid,
                    indent: 5,
                }).then(() => {
                    doc.save('CentrosPropios.pdf');
                });
            });
        });
    };

    const handleValidar = async () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        if (!grid) return;
        const selectedRows = grid.getSelectedRowsData();
        if (selectedRows.length === 0) {
            setMsg({ ok: false, text: 'Selecciona al menos un registro para validar.' });
            setTimeout(() => setMsg(null), 3000);
            return;
        }
        setValidando(true);
        try {
            const ids = selectedRows.map(r => r.centroId);
            const res = await fetch(`${API_URL}/validar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ids),
            });
        if (res.ok) {
            setMsg({ ok: true, text: `Registros validados correctamente.` });
            cargarDatos();
        } else {
            setMsg({ ok: false, text: 'Error al validar los registros.' });
        }
        } catch {
            setMsg({ ok: false, text: 'Error de conexión al validar.' });
        } finally {
            setValidando(false);
            setTimeout(() => setMsg(null), 4000);
        }
    };

    const handleSaveCentro = async (data) => {
        try {
            const res = await fetch(`${API_URL}/${data.centroId || ""}`, {
                method: data.centroId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setSelectedCentro(null);
                cargarDatos();
            }
        } catch {
            // silently handled
        }
    };

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                {/* HEADER */}
                {!selectedCentro && (
                    <div className="header-page">
                        <div className="title">
                            {t('LISTA CENTROS PROPIOS')}
                        </div>
                        <div className="header-actions-side">
                            {msg && (
                                <span className="msg-feedback" style={{ color: msg.ok ? '#2e7d32' : '#c62828' }}>
                                    {msg.text}
                                </span>
                            )}
                            <div className="acciones-container" ref={menuRef}>
                                <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAbierto && (
                                    <div className="acciones-menu">
                                        {/* ✅ Solo admin puede crear nuevos centros */}
                                        {admin && (
                                            <div className="acciones-item" onClick={handleNuevo}>
                                                <i className="ri-add-line" style={{ color: '#1976d2' }}></i>
                                                {t('Nuevo')}
                                            </div>
                                        )}

                                        <div className="acciones-item" onClick={handleExportarExcel}>
                                            <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                            {t('Exportar a Excel')}
                                        </div>

                                        <div className="acciones-item" onClick={handleExportarPDF}>
                                            <i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i>
                                            {t('Exportar a PDF')}
                                        </div>

                                        {/* ✅ Solo admin puede validar registros */}
                                        {admin && (
                                            <div className="acciones-item" onClick={handleValidar}>
                                                <i className="ri-checkbox-circle-line" style={{ color: '#e65100' }}></i>
                                                {validando ? t('Validando...') : t('Validar Registros')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TABLA */}
                <div style={{ padding: '0 20px 20px 20px' }}>
                    {selectedCentro ? (
                        <FichaCentroPropio
                            cliente={selectedCentro}
                            onClose={() => setSelectedCentro(null)}
                            onSave={handleSaveCentro}
                        />
                    ) : (
                        <div style={{ height: 'calc(100vh - 180px)', width: '100%' }}>
                            <DataGrid
                                ref={dataGridRef}
                                dataSource={centros}
                                keyExpr="centroId"
                                showBorders={true}
                                columnAutoWidth={false}
                                allowColumnResizing={true}
                                onExporting={handleExportarExcel}
                                className="mz-table"
                                height="100%"
                                rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
                            noDataText={t('Sin datos para mostrar')}
                            onRowDblClick={(e) => setSelectedCentro(e.data)}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={20} />
                            <Pager visible={true} allowedPageSizes={[10, 20, 50, 100]} displayMode="full" showPageSizeSelector={true} showInfo={true} showNavigationButtons={true} />
                            
                            <Toolbar>
                                <Item location="after" name="searchPanel" />
                                <Item location="after" name="columnChooserButton" />
                            </Toolbar>

                            <SearchPanel visible={true} width={240} placeholder={t('buscar')} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible={true} />
                            <Selection mode="multiple" allowSelectAll={true} />
                            <GroupPanel visible={true} />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled={true} mode="select" />
                            <Export enabled={true} allowExportSelectedData={true} />
                            <Sorting mode="multiple" />
                            <ColumnFixing enabled={true} />
                            <Column dataField="localizador" caption="Localizador" width={110} />
                            <Column dataField="centroId" caption="No" width={80} />
                            <Column dataField="mutuaId" caption="Mutua" width={90} />
                            <Column dataField="codigoMz" caption="Centro ID" width={100} />
                            <Column dataField="centro" caption="Centro" width={200} />
                            <Column dataField="cp" caption="C.P." width={80} />
                            <Column dataField="provincia" caption="Provincia" width={130} />
                            <Column dataField="poblacionId" caption="Poblacion" width={100} />
                            <Column dataField="telefono" caption="Telefono" width={120} />
                            <Column dataField="latitud" caption="Mapa" width={90} alignment="center" cellRender={MapaCell} />
                            {/* ✅ Solo admin ve la columna Desactivado */}
                            {admin && (
                                <Column dataField="desactivado" caption="Desactivado" width={110} alignment="center" cellRender={DesactivadoCell} />
                            )}
                            <Column
                                caption="Acciones" width={100} fixed={true} fixedPosition="right" alignment="center"
                                cellRender={(cell) => (
                                    <div className="ficha-row-actions">
                                        <i 
                                            className="ri-edit-line edit-icon" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedCentro(cell.data);
                                            }}
                                            title={t('Editar')}
                                        />
                                        <i 
                                            className="ri-delete-bin-line delete-icon" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // TODO: Implementar eliminar si es necesario
                                                if (window.confirm(t('¿Está seguro de que desea eliminar este centro?'))) {
                                                    console.log('Eliminar centro:', cell.data.centroId);
                                                }
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
    );
};

export default CentrosPropios;
