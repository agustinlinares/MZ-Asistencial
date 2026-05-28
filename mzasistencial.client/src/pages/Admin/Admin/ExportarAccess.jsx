import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './Admin.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import AuthService from "../../../services/auth/AuthService";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
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
import notify from 'devextreme/ui/notify';

const TIPOS_CENTRO = [
    { id: 1, nombre: 'Propios' },
    { id: 2, nombre: 'Conciertos' },
];

const authHeaders = () => {
    const token = AuthService.getToken();
    return { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
};

const ExportarAccess = () => {
    UseProtectedRoute();
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);

    const [ficheros, setFicheros]     = useState([]);
    const [mutuas, setMutuas]         = useState([]);
    const [años, setAños]             = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false);

    const [popupVisible, setPopupVisible] = useState(false);
    const [form, setForm]   = useState({ mutuaId: '', año: '', tipoCentroId: '' });
    const [cargando, setCargando] = useState(false);

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [rowToDelete, setRowToDelete]       = useState(null);

    const userData    = AuthService.getUserData();
    const esAdmin     = userData?.perfilId === 1;
    const usuarioId   = userData?.usuarioId || 0;

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setMenuAbierto(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [resFich, resMut, resAños] = await Promise.all([
                    fetch('/api/ExportarAccess', { headers: authHeaders() }),
                    fetch('/api/ExportarAccess/mutuas', { headers: authHeaders() }),
                    fetch('/api/ExportarAccess/años', { headers: authHeaders() }),
                ]);
                if (resFich.ok)  setFicheros(await resFich.json());
                if (resMut.ok)   setMutuas(await resMut.json());
                if (resAños.ok)  setAños(await resAños.json());
            } catch (err) {
                console.error('Error cargando datos:', err);
            }
        };
        cargarDatos();
    }, []);

    const cargarFicheros = async () => {
        try {
            const resp = await fetch('/api/ExportarAccess', { headers: authHeaders() });
            if (resp.ok) setFicheros(await resp.json());
        } catch (err) {
            console.error('Error recargando ficheros:', err);
        }
    };

    const handleDescargar = async (row) => {
        try {
            const token = AuthService.getToken();
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const resp = await fetch(`/api/ExportarAccess/${row.ficheroGeneradoId}/download`, { headers });
            if (!resp.ok) { notify(t('Fichero no encontrado en el servidor.'), 'error', 3000); return; }
            const blob = await resp.blob();
            saveAs(blob, row.nombreFichero || `fichero_${row.ficheroGeneradoId}.accdb`);
        } catch {
            notify(t('Error al descargar el fichero.'), 'error', 3000);
        }
    };

    const handleGuardar = async () => {
        if (!form.mutuaId || !form.año || !form.tipoCentroId) {
            notify(t('Completa todos los campos.'), 'warning', 3000);
            return;
        }
        setCargando(true);
        try {
            const token = AuthService.getToken();
            const headers = {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            };
            const body = JSON.stringify({
                mutuaId:     parseInt(form.mutuaId, 10),
                año:         parseInt(form.año, 10),
                tipoCentroId: parseInt(form.tipoCentroId, 10),
            });
            const resp = await fetch(`/api/ExportarAccess?usuarioId=${usuarioId}`, {
                method: 'POST', headers, body,
            });
            if (resp.ok) {
                notify(t('Fichero registrado correctamente.'), 'success', 3000);
                cerrarPopup();
                await cargarFicheros();
            } else {
                const err = await resp.json().catch(() => ({}));
                notify(err.message || t('Error al guardar.'), 'error', 3000);
            }
        } catch {
            notify(t('Error al guardar.'), 'error', 3000);
        } finally {
            setCargando(false);
        }
    };

    const pedirConfirmacionEliminar = (row) => {
        setRowToDelete(row);
        setConfirmVisible(true);
    };

    const confirmarEliminar = async () => {
        if (!rowToDelete) return;
        setConfirmVisible(false);
        try {
            const token = AuthService.getToken();
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const resp = await fetch(
                `/api/ExportarAccess/${rowToDelete.ficheroGeneradoId}?usuarioId=${usuarioId}`,
                { method: 'DELETE', headers }
            );
            if (resp.ok) {
                notify(t('Fichero eliminado correctamente.'), 'success', 3000);
                await cargarFicheros();
            } else {
                notify(t('No se pudo eliminar el fichero.'), 'error', 3000);
            }
        } catch {
            notify(t('Error al eliminar el fichero.'), 'error', 3000);
        }
        setRowToDelete(null);
    };

    const cancelarEliminar = () => {
        setConfirmVisible(false);
        setRowToDelete(null);
    };

    const cerrarPopup = () => {
        setPopupVisible(false);
        setForm({ mutuaId: '', año: '', tipoCentroId: '' });
    };

    const renderFicheroLink = (cellData) => {
        const row = cellData.data;
        if (!row.nombreFichero) return <span>—</span>;
        return (
            <span
                className="fichero-link"
                onClick={(e) => { e.stopPropagation(); handleDescargar(row); }}
            >
                {row.nombreFichero}
            </span>
        );
    };

    const renderAcciones = (cellData) => {
        const row = cellData.data;
        return (
            <div className="ficheros-acciones">
                {esAdmin && (
                    <button
                        className="fich-btn fich-btn-delete"
                        title="Eliminar"
                        onClick={(e) => { e.stopPropagation(); pedirConfirmacionEliminar(row); }}
                    >
                        <i className="ri-delete-bin-line" />
                    </button>
                )}
            </div>
        );
    };

    const onExporting = (e) => {
        e.component.beginUpdate();
        const workbook   = new Workbook();
        const worksheet  = workbook.addWorksheet('FicherosGenerados');
        exportDataGrid({ component: e.component, worksheet, autoFilterEnabled: true })
            .then(() => workbook.xlsx.writeBuffer())
            .then(buffer => saveAs(
                new Blob([buffer], { type: 'application/octet-stream' }),
                'ficheros_generados.xlsx'
            ));
        e.cancel = true;
    };

    return (
        <React.Fragment>
            <div className="ficheros-page">

                {/* ── Cabecera ─────────────────────────────────────────── */}
                <div className="ficheros-header">
                    <div className="ficheros-title">
                        <i className="ri-database-2-line" />
                        LISTA FICHEROS GENERADOS
                    </div>

                    <div className="ficheros-header-right">
                        <div className="acciones-container" ref={menuRef}>
                            <button className="fich-btn-menu" onClick={() => setMenuAbierto(!menuAbierto)}>
                                <i className="ri-more-2-fill" />
                                <span>Acciones</span>
                            </button>

                            {menuAbierto && (
                                <div className="fich-acciones-menu">
                                    <div className="fich-menu-header">
                                        <span>Acciones</span>
                                        <i className="ri-close-line" onClick={() => setMenuAbierto(false)} />
                                    </div>

                                    {esAdmin && (
                                        <div className="fich-menu-item" onClick={() => { setMenuAbierto(false); setPopupVisible(true); }}>
                                            <i className="ri-add-line" /> Nuevo
                                        </div>
                                    )}

                                    <div className="fich-menu-item" onClick={() => {
                                        setMenuAbierto(false);
                                        const instance = dataGridRef.current?.instance();
                                        if (!instance) return;
                                        const wb = new Workbook();
                                        const ws = wb.addWorksheet('FicherosGenerados');
                                        exportDataGrid({ component: instance, worksheet: ws, autoFilterEnabled: true })
                                            .then(() => wb.xlsx.writeBuffer())
                                            .then(buffer => saveAs(
                                                new Blob([buffer], { type: 'application/octet-stream' }),
                                                'ficheros_generados.xlsx'
                                            ));
                                    }}>
                                        <i className="ri-file-excel-2-line" /> Exportar a Excel
                                    </div>

                                    <div className="fich-menu-item" onClick={() => {
                                        setMenuAbierto(false);
                                        const instance = dataGridRef.current?.instance();
                                        instance?.exportToPdf?.({ fileName: 'ficheros_generados.pdf' });
                                    }}>
                                        <i className="ri-file-pdf-line" /> Exportar a PDF
                                    </div>

                                    <div className="fich-menu-item" onClick={() => setMenuAbierto(false)}>
                                        <i className="ri-settings-3-line" /> Generar Plantillas
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── DataGrid ─────────────────────────────────────────── */}
                <div className="ficheros-grid-wrap">
                    <DataGrid
                        ref={dataGridRef}
                        dataSource={ficheros}
                        keyExpr="ficheroGeneradoId"
                        showBorders={true}
                        columnAutoWidth={true}
                        allowColumnResizing={true}
                        onExporting={onExporting}
                        className="mz-table ficheros-grid"
                        rowAlternationEnabled={true}
                        showRowLines={true}
                        showColumnLines={true}
                        wordWrapEnabled={false}
                        hoverStateEnabled={true}
                    >
                        <Toolbar>
                            <Item location="before">
                                <div className="fich-drag-hint">Arrastra una columna aquí para agrupar por dicha columna</div>
                            </Item>
                            <Item location="after" name="searchPanel" />
                            <Item location="after" name="columnChooserButton" />
                        </Toolbar>

                        <Scrolling mode="standard" showScrollbar="always" />
                        <Paging defaultPageSize={25} />
                        <Pager visible={true} allowedPageSizes={true} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                        <SearchPanel visible width={240} placeholder="buscar" />
                        <FilterRow visible={true} applyFilter="auto" />
                        <HeaderFilter visible searchMode="contains" />
                        <Selection mode="multiple" allowSelectAll />
                        <Grouping autoExpandAll={false} />
                        <ColumnChooser enabled mode="select" />
                        <Export enabled fileName="FicherosGenerados" allowExportSelectedData />
                        <Sorting mode="multiple" />
                        <FilterPanel visible />
                        <ColumnFixing enabled />

                        <Column dataField="numeroMutua"  caption="Nº"               width={70} alignment="center" />
                        <Column dataField="nombreMutua"  caption="Mutua"             minWidth={160} />
                        <Column
                            dataField="nombreFichero"
                            caption="Fichero Generado"
                            minWidth={260}
                            cellRender={renderFicheroLink}
                        />
                        <Column dataField="usuarioAlta"  caption="Usuario"           width={120} />
                        <Column
                            dataField="fechaAlta"
                            caption="Fecha Alta"
                            dataType="date"
                            format="dd/MM/yyyy"
                            width={110}
                        />
                        <Column dataField="horaAlta"     caption="Hora Alta"         width={90} alignment="center" />
                        <Column dataField="estado"       caption="Estado"            width={110} />
                        <Column dataField="tipoCentro"   caption="Tipo"              width={110} />
                        <Column
                            caption="Acciones"
                            width={80}
                            alignment="center"
                            allowSorting={false}
                            allowFiltering={false}
                            cellRender={renderAcciones}
                        />
                    </DataGrid>
                </div>
            </div>

            {/* ── Popup Ficha Generar Fichero ───────────────────────────── */}
            {popupVisible && (
                <div className="fich-popup-overlay">
                    <div className="fich-popup">
                        <div className="fich-popup-title">
                            <span>Ficha Generar Fichero</span>
                            <div className="fich-popup-title-btns">
                                <button className="fich-popup-btn-accept" onClick={handleGuardar} disabled={cargando}>
                                    <i className="ri-check-line" /> {cargando ? 'Guardando...' : 'Aceptar'}
                                </button>
                                <button className="fich-popup-btn-cancel" onClick={cerrarPopup}>
                                    <i className="ri-close-line" /> Salir
                                </button>
                            </div>
                        </div>

                        <div className="fich-popup-body">
                            <div className="fich-popup-row">
                                <div className="fich-popup-field fich-popup-field-full">
                                    <label>Mutua</label>
                                    <select
                                        className="fich-select"
                                        value={form.mutuaId}
                                        onChange={e => setForm({ ...form, mutuaId: e.target.value })}
                                    >
                                        <option value=""></option>
                                        {mutuas.map(m => (
                                            <option key={m.mutuaId} value={m.mutuaId}>
                                                {m.numeroMutua} — {m.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="fich-popup-row">
                                <div className="fich-popup-field">
                                    <label>Año</label>
                                    <select
                                        className="fich-select"
                                        value={form.año}
                                        onChange={e => setForm({ ...form, año: e.target.value })}
                                    >
                                        <option value=""></option>
                                        {años.map(a => (
                                            <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="fich-popup-field">
                                    <label>Tipo de Centro</label>
                                    <select
                                        className="fich-select"
                                        value={form.tipoCentroId}
                                        onChange={e => setForm({ ...form, tipoCentroId: e.target.value })}
                                    >
                                        <option value=""></option>
                                        {TIPOS_CENTRO.map(tc => (
                                            <option key={tc.id} value={tc.id}>{tc.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal Confirmar Eliminar ─────────────────────────────── */}
            {confirmVisible && (
                <div className="fich-popup-overlay">
                    <div className="fich-confirm">
                        <div className="fich-confirm-title">
                            <span>¡Atención!</span>
                            <div className="fich-popup-title-btns">
                                <button className="fich-popup-btn-accept" onClick={confirmarEliminar}>
                                    <i className="ri-check-line" /> Aceptar
                                </button>
                                <button className="fich-popup-btn-cancel" onClick={cancelarEliminar}>
                                    <i className="ri-close-line" /> Cancelar
                                </button>
                            </div>
                        </div>
                        <div className="fich-confirm-body">
                            <div className="fich-confirm-icon">
                                <i className="ri-question-line" />
                            </div>
                            <p>
                                ¿Desea eliminar el fichero:{' '}
                                <strong>{rowToDelete?.nombreFichero ?? rowToDelete?.ficheroGeneradoId}</strong> de la lista?
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default ExportarAccess;
