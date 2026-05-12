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
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'acreditaciones_sectoriales.xlsx');
        });
    });
    e.cancel = true;
};

const AcreditacionesSectoriales = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);
    const [acreditaciones, setAcreditaciones] = useState([]);
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
                const respuesta = await fetch('/api/AcreditacionesSectoriales', {
                    method: 'GET',
                    headers: authHeaders(),
                });
                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setAcreditaciones(datos);
                } else {
                    console.error('Error cargando acreditaciones sectoriales:', respuesta.status);
                }
            } catch (error) {
                console.error('Error conectando con la API:', error);
            }
        };
        cargarDatos();
    }, []);

    const COLS = [
        { field: 'nombreFichero',    label: 'Nombre Fichero' },
        { field: 'tipoAcreditacion', label: 'Tipo Acreditación' },
        { field: 'servicio',         label: 'Servicio' },
        { field: 'especialidad',     label: 'Especialidad' },
        { field: 'poblacion',        label: 'Población' },
        { field: 'provincia',        label: 'Provincia' },
        { field: 'mutua',            label: 'Mutua' },
        { field: 'fechaAlta',        label: 'Fecha Alta' },
    ];

    const fmtFecha = (val) => val ? new Date(val).toLocaleDateString('es-ES') : '—';
    const fmtVal   = (row, col) => col.field === 'fechaAlta' ? fmtFecha(row[col.field]) : (row[col.field] ?? '—');

    const abrirVentanaPDF = (titulo, cuerpoHtml) => {
        const estilos = `
            body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; color: #222; }
            h2 { font-size: 14px; margin-bottom: 14px; color: #1a5fa8; }
            h3 { font-size: 12px; margin: 16px 0 6px; color: #2d3748; border-bottom: 1px solid #cbd5e0; padding-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
            th { background: #1a5fa8; color: #fff; padding: 7px 10px; text-align: left; font-size: 11px; }
            td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) td { background: #f7fafc; }
            @media print { body { margin: 10px; } }`;
        const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
            <title>${titulo}</title><style>${estilos}</style></head>
            <body><h2>${titulo}</h2>${cuerpoHtml}</body></html>`;
        const win = window.open('', '_blank', 'width=1000,height=650');
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); win.close(); }, 400);
    };

    const handleImprimir = () => {
        const filas = acreditaciones.map(row =>
            `<tr>${COLS.map(c => `<td>${fmtVal(row, c)}</td>`).join('')}</tr>`
        ).join('');
        const tabla = `<table>
            <thead><tr>${COLS.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
            <tbody>${filas}</tbody></table>`;
        abrirVentanaPDF('Lista de Acreditaciones Sectoriales', tabla);
    };

    const handleIndividualesPDF = () => {
        const filas = acreditaciones.map(row =>
            `<tr>${COLS.map(c => `<td>${fmtVal(row, c)}</td>`).join('')}</tr>`
        ).join('');
        const tabla = `<table>
            <thead><tr>${COLS.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
            <tbody>${filas}</tbody></table>`;
        abrirVentanaPDF('Informe de Acreditaciones Individuales', tabla);
    };

    const handleAnualesExcel = async () => {
        const wb = new Workbook();
        const años = [...new Set(acreditaciones.map(r =>
            r.fechaAlta ? new Date(r.fechaAlta).getFullYear() : 'Sin fecha'
        ))].sort();

        for (const año of años) {
            const ws = wb.addWorksheet(String(año));
            ws.columns = COLS.map(c => ({ header: c.label, key: c.field, width: 22 }));
            ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A5FA8' } };
            const filas = acreditaciones.filter(r =>
                (r.fechaAlta ? new Date(r.fechaAlta).getFullYear() : 'Sin fecha') === año
            );
            filas.forEach(row => {
                const r = {};
                COLS.forEach(c => { r[c.field] = c.field === 'fechaAlta' ? fmtFecha(row[c.field]) : (row[c.field] ?? ''); });
                ws.addRow(r);
            });
        }
        const buffer = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'informe_acreditaciones_anuales.xlsx');
    };

    const handleAnualesPDF = () => {
        const años = [...new Set(acreditaciones.map(r =>
            r.fechaAlta ? new Date(r.fechaAlta).getFullYear() : 'Sin fecha'
        ))].sort();

        const cuerpo = años.map(año => {
            const filas = acreditaciones
                .filter(r => (r.fechaAlta ? new Date(r.fechaAlta).getFullYear() : 'Sin fecha') === año)
                .map(row => `<tr>${COLS.map(c => `<td>${fmtVal(row, c)}</td>`).join('')}</tr>`)
                .join('');
            return `<h3>Año ${año}</h3>
                <table>
                    <thead><tr>${COLS.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
                    <tbody>${filas}</tbody>
                </table>`;
        }).join('');

        abrirVentanaPDF('Informe Anual de Acreditaciones', cuerpo);
    };

    const handleRowClick = async (e) => {
        const id = e.data?.ficheroId;
        if (!id) return;

        try {
            const respuesta = await fetch(`/api/AcreditacionesSectoriales/${id}/download`, {
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

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">{t('Lista de Acreditaciones Sectoriales')}</div>

                        <div className="header-actions-side">
                            <div className="acciones-container" ref={menuRef}>
                                <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                    <i className="ri-more-2-fill"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-menu-header">
                                            <span>{t('Cerrar opciones')}</span>
                                            <i className="ri-close-line" onClick={() => setMenuAbierto(false)} />
                                        </div>

                                        <div className="acciones-item" onClick={() => { setMenuAbierto(false); handleImprimir(); }}>
                                            <i className="ri-printer-line"></i>
                                            {t('Imprimir')}
                                        </div>

                                        <div className="acciones-item" onClick={() => {
                                            setMenuAbierto(false);
                                            const instance = dataGridRef.current?.instance();
                                            if (!instance) return;
                                            const wb = new Workbook();
                                            const ws = wb.addWorksheet('Acreditaciones');
                                            exportDataGrid({ component: instance, worksheet: ws, autoFilterEnabled: true })
                                                .then(() => wb.xlsx.writeBuffer())
                                                .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'acreditaciones_sectoriales.xlsx'));
                                        }}>
                                            <i className="ri-file-excel-2-line"></i>
                                            {t('Informe Acr. Individuales (Excel)')}
                                        </div>

                                        <div className="acciones-item" onClick={() => { setMenuAbierto(false); handleIndividualesPDF(); }}>
                                            <i className="ri-file-pdf-line"></i>
                                            {t('Informe Acr. Individuales (PDF)')}
                                        </div>

                                        <div className="acciones-item" onClick={() => { setMenuAbierto(false); handleAnualesExcel(); }}>
                                            <i className="ri-file-excel-2-line"></i>
                                            {t('Informe Acr. Anuales (Excel)')}
                                        </div>

                                        <div className="acciones-item" onClick={() => { setMenuAbierto(false); handleAnualesPDF(); }}>
                                            <i className="ri-file-pdf-line"></i>
                                            {t('Informe Acr. Anuales (PDF)')}
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
                            <Export enabled fileName="AcreditacionesSectoriales" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <FilterPanel visible />
                            <ColumnFixing enabled />

                            <Column dataField="nombreFichero" caption={t('Nombre Fichero')} minWidth={200} />
                            <Column dataField="tipoAcreditacion" caption={t('Tipo Acreditación')} width={180} />
                            <Column dataField="servicio" caption={t('Servicio')} width={160} />
                            <Column dataField="especialidad" caption={t('Especialidad')} width={160} />
                            <Column dataField="poblacion" caption={t('Población')} width={150} />
                            <Column dataField="provincia" caption={t('Provincia')} width={130} />
                            <Column dataField="mutua" caption={t('Mutua')} width={150} />
                            <Column
                                dataField="fechaAlta"
                                caption={t('Fecha Alta')}
                                dataType="date"
                                format="dd/MM/yyyy"
                                width={120}
                            />
                        </DataGrid>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AcreditacionesSectoriales;
