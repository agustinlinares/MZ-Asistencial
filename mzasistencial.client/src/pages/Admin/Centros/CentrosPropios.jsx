import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './Centros.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataGrid, {
    Column, Paging, SearchPanel, FilterRow, HeaderFilter,
    Selection, GroupPanel, Grouping, ColumnChooser, Export,
    Scrolling, Sorting, ColumnFixing, Pager
} from "devextreme-react/data-grid";

const API_URL = "/api/CentrosPropios";

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
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [validando, setValidando] = useState(false);
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        fetch(API_URL)
            .then(res => { if (!res.ok) throw new Error('Error ' + res.status); return res.json(); })
            .then(data => setCentros(data))
            .catch(err => console.error('Error cargando centros:', err));
    }, []);

    // Cierra el menú al hacer clic fuera
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
        navigate('/admin/Centros/FichaCentroPropio', { state: { cliente: {} } });
    };

    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance;
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
        const grid = dataGridRef.current.instance;
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
                setMsg({ ok: true, text: `${ids.length} registro(s) validado(s) correctamente.` });
                // Recargar datos
                fetch(API_URL)
                    .then(r => r.json())
                    .then(data => setCentros(data));
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

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                {/* HEADER */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {t('LISTA CENTROS PROPIOS')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {msg && (
                            <span style={{ fontSize: 12.5, color: msg.ok ? '#2e7d32' : '#c62828', fontWeight: 500 }}>
                                {msg.text}
                            </span>
                        )}
                        {/* BOTÓN ACCIONES */}
                        <div ref={menuRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => setMenuAbierto(v => !v)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    background: '#1a3a5c', color: '#fff', border: 'none',
                                    borderRadius: 5, padding: '7px 16px', fontSize: 13,
                                    fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                Acciones <span style={{ fontSize: 10 }}>▼</span>
                            </button>
                            {menuAbierto && (
                                <div style={{
                                    position: 'absolute', top: '100%', right: 0, marginTop: 4,
                                    background: '#fff', border: '1px solid #e0e6ed',
                                    borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                    minWidth: 180, zIndex: 999
                                }}>
                                    {[
                                        { icon: '➕', label: 'Nuevo', action: handleNuevo, color: '#1976d2' },
                                        { icon: '📊', label: 'Exportar a Excel', action: handleExportarExcel, color: '#2e7d32' },
                                        { icon: '📄', label: 'Exportar a PDF', action: handleExportarPDF, color: '#c62828' },
                                        { icon: '✅', label: validando ? 'Validando...' : 'Validar Registros', action: handleValidar, color: '#e65100' },
                                    ].map(({ icon, label, action, color }) => (
                                        <button key={label} onClick={action} style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            width: '100%', padding: '10px 16px', border: 'none',
                                            background: 'none', cursor: 'pointer', fontSize: 13,
                                            color: '#2c3e50', textAlign: 'left',
                                            borderBottom: '1px solid #f0f4f8'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f0f4f8'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                        >
                                            <span style={{ color }}>{icon}</span> {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* TABLA */}
                <div style={{ padding: '0 20px 20px 20px' }}>
                    <DataGrid
                        ref={dataGridRef}
                        dataSource={centros}
                        keyExpr="centroId"
                        showBorders={true}
                        columnAutoWidth={false}
                        allowColumnResizing={true}
                        onExporting={handleExportarExcel}
                        className="mz-table"
                        rowAlternationEnabled={true}
                        showRowLines={true}
                        showColumnLines={true}
                        wordWrapEnabled={false}
                        noDataText={t('Sin datos para mostrar')}
                        onRowDblClick={(e) => navigate('/admin/Centros/FichaCentroPropio', { state: { cliente: e.data } })}
                    >
                        <Scrolling mode="standard" showScrollbar="always" />
                        <Paging defaultPageSize={20} />
                        <Pager visible={true} allowedPageSizes={[10, 20, 50, 100]} displayMode="full" showPageSizeSelector={true} showInfo={true} showNavigationButtons={true} />
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
                        <Column dataField="desactivado" caption="Desactivado" width={110} alignment="center" cellRender={DesactivadoCell} />
                        <Column
                            caption="Acciones" width={80} fixed={true} fixedPosition="right" alignment="center"
                            cellRender={() => React.createElement('div', {
                                style: { color: '#2f5da8', cursor: 'pointer', textAlign: 'center' }
                            }, React.createElement('i', { className: 'ri-edit-line' }))}
                        />
                    </DataGrid>
                </div>
            </div>
        </div>
    );
};

export default CentrosPropios;
