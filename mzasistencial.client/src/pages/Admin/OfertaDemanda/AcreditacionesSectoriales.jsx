import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './Centros.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useLogError } from '../../../hooks/useLogError';
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
    const userData = AuthService.getUserData();
    const esAdmin  = userData?.perfilId === 1;
    const mutuaId  = userData?.mutuaId || null;

    const logError = useLogError("Acreditaciones sectoriales");

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
                const url = !esAdmin && mutuaId
                    ? `/api/AcreditacionesSectoriales?mutuaId=${mutuaId}`
                    : '/api/AcreditacionesSectoriales';
                const respuesta = await fetch(url, {
                    method: 'GET',
                    headers: authHeaders(),
                });
                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setAcreditaciones(datos);
                } else {
                    logError(`Fallo al cargar acreditaciones sectoriales. Estado: ${respuesta.status}`);
                    console.error('Error cargando acreditaciones sectoriales:', respuesta.status);
                }
            } catch (error) {
                logError("Error crítico de conexión al cargar acreditaciones sectoriales", error);
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

    const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const MESES_LABEL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    const fetchDisponibilidad = async (año) => {
        const resp = await fetch(`/api/AcreditacionesSectoriales/informe-disponibilidad?año=${año}`, {
            headers: authHeaders(),
        });
        if (!resp.ok) throw new Error('Error al cargar el informe de disponibilidad');
        return await resp.json();
    };

    const handleIndividualesPDF = async (año) => {
        try {
            const datos = await fetchDisponibilidad(año);
            const cabeceras = ['Provincia','Localidad','Especialidad','Servicio',...MESES_LABEL,'Total'];
            const filas = datos.map(r =>
                `<tr>
                    <td>${r.provincia ?? '—'}</td><td>${r.localidad ?? '—'}</td>
                    <td>${r.especialidad ?? '—'}</td><td>${r.servicio ?? '—'}</td>
                    <td>${r.pendienteEnero}</td><td>${r.pendienteFebrero}</td><td>${r.pendienteMarzo}</td>
                    <td>${r.pendienteAbril}</td><td>${r.pendienteMayo}</td><td>${r.pendienteJunio}</td>
                    <td>${r.pendienteJulio}</td><td>${r.pendienteAgosto}</td><td>${r.pendienteSeptiembre}</td>
                    <td>${r.pendienteOctubre}</td><td>${r.pendienteNoviembre}</td><td>${r.pendienteDiciembre}</td>
                    <td><strong>${r.pendienteTotal}</strong></td>
                </tr>`
            ).join('');
            const tabla = `<table>
                <thead><tr>${cabeceras.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>${filas}</tbody></table>`;
            abrirVentanaPDF(`Informe Individual de Disponibilidad ${new Date().getFullYear()}`, tabla);
        } catch (e) { console.error(e); }
    };

    const handleIndividualesExcel = async (año) => {
        try {
            const datos = await fetchDisponibilidad(año);
            const wb = new Workbook();
            const ws = wb.addWorksheet('Individual');
            ws.columns = [
                { header: 'Provincia',    key: 'provincia',    width: 18 },
                { header: 'Localidad',    key: 'localidad',    width: 18 },
                { header: 'Especialidad', key: 'especialidad', width: 20 },
                { header: 'Servicio',     key: 'servicio',     width: 20 },
                ...MESES_LABEL.map((m, i) => ({ header: m, key: MESES[i].toLowerCase(), width: 10 })),
                { header: 'Total', key: 'total', width: 10 },
            ];
            ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A5FA8' } };
            datos.forEach(r => ws.addRow({
                provincia: r.provincia, localidad: r.localidad,
                especialidad: r.especialidad, servicio: r.servicio,
                ene: r.pendienteEnero, feb: r.pendienteFebrero, mar: r.pendienteMarzo,
                abr: r.pendienteAbril, may: r.pendienteMayo, jun: r.pendienteJunio,
                jul: r.pendienteJulio, ago: r.pendienteAgosto, sep: r.pendienteSeptiembre,
                oct: r.pendienteOctubre, nov: r.pendienteNoviembre, dic: r.pendienteDiciembre,
                total: r.pendienteTotal,
            }));
            const buffer = await wb.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `informe_individual_${new Date().getFullYear()}.xlsx`);
        } catch (e) { console.error(e); }
    };

    const handleAnualesExcel = async (año) => {
        try {
            const datos = await fetchDisponibilidad(año);
            // Anual: agrupar por Especialidad+Servicio sumando totales
            const agrupado = Object.values(
                datos.reduce((acc, r) => {
                    const key = `${r.especialidad}||${r.servicio}`;
                    if (!acc[key]) acc[key] = { especialidad: r.especialidad, servicio: r.servicio, total: 0 };
                    acc[key].total += r.pendienteTotal;
                    return acc;
                }, {})
            );
            const wb = new Workbook();
            const ws = wb.addWorksheet('Anual');
            ws.columns = [
                { header: 'Especialidad', key: 'especialidad', width: 22 },
                { header: 'Servicio',     key: 'servicio',     width: 22 },
                { header: 'Total Disponible', key: 'total',   width: 18 },
            ];
            ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A5FA8' } };
            agrupado.forEach(r => ws.addRow(r));
            const buffer = await wb.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `informe_anual_${new Date().getFullYear()}.xlsx`);
        } catch (e) { console.error(e); }
    };

    const handleAnualesPDF = async (año) => {
        try {
            const datos = await fetchDisponibilidad(año);
            const agrupado = Object.values(
                datos.reduce((acc, r) => {
                    const key = `${r.especialidad}||${r.servicio}`;
                    if (!acc[key]) acc[key] = { especialidad: r.especialidad, servicio: r.servicio, total: 0 };
                    acc[key].total += r.pendienteTotal;
                    return acc;
                }, {})
            );
            const filas = agrupado.map(r =>
                `<tr><td>${r.especialidad ?? '—'}</td><td>${r.servicio ?? '—'}</td><td><strong>${r.total}</strong></td></tr>`
            ).join('');
            const tabla = `<table>
                <thead><tr><th>Especialidad</th><th>Servicio</th><th>Total Disponible</th></tr></thead>
                <tbody>${filas}</tbody></table>`;
            abrirVentanaPDF(`Informe Anual de Disponibilidad ${new Date().getFullYear()}`, tabla);
        } catch (e) { console.error(e); }
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
                logError(`Fichero ${id} no encontrado en el servidor para descarga. Estado: ${respuesta.status}`);
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
            logError(`Error al descargar el fichero ID: ${id}`, error);
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
                                    <i className="ri-settings-3-line"></i>
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

                                        {esAdmin && (
                                            <>
                                                <div className="acciones-item" onClick={() => { setMenuAbierto(false); handleIndividualesExcel(new Date().getFullYear()); }}>
                                                    <i className="ri-file-excel-2-line"></i>
                                                    {t('Informe Acr. Individuales (Excel)')}
                                                </div>

                                                <div className="acciones-item" onClick={() => { setMenuAbierto(false); handleIndividualesPDF(new Date().getFullYear()); }}>
                                                    <i className="ri-file-pdf-line"></i>
                                                    {t('Informe Acr. Individuales (PDF)')}
                                                </div>

                                                <div className="acciones-item" onClick={() => { setMenuAbierto(false); handleAnualesExcel(new Date().getFullYear()); }}>
                                                    <i className="ri-file-excel-2-line"></i>
                                                    {t('Informe Acr. Anuales (Excel)')}
                                                </div>

                                                <div className="acciones-item" onClick={() => { setMenuAbierto(false); handleAnualesPDF(new Date().getFullYear()); }}>
                                                    <i className="ri-file-pdf-line"></i>
                                                    {t('Informe Acr. Anuales (PDF)')}
                                                </div>
                                            </>
                                        )}
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
