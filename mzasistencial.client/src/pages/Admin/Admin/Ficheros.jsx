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

const authHeaders = () => {
    const token = AuthService.getToken();
    return { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
};

const Ficheros = () => {
    UseProtectedRoute();
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);

    const [ficheros, setFicheros] = useState([]);
    const [areas, setAreas] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false);

    // Popup crear fichero
    const [popupVisible, setPopupVisible] = useState(false);
    const [form, setForm] = useState({ descripcion: '', fecha: '', areaId: '', autor: '' });
    const [archivo, setArchivo] = useState(null);
    const [archivoNombre, setArchivoNombre] = useState('');
    const [cargando, setCargando] = useState(false);

    // Modal confirmar eliminar
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);

    const userData = AuthService.getUserData();
    const esAdmin = userData?.perfilId === 1;
    const usuarioId = userData?.usuarioId || 0;
    const usuarioNombre = userData?.nombre || userData?.usuario || 'Usuario';

    // Cerrar menú al click fuera
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Carga inicial
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [resFicheros, resAreas] = await Promise.all([
                    fetch('/api/Ficheros', { headers: authHeaders() }),
                    fetch('/api/Ficheros/areas', { headers: authHeaders() }),
                ]);
                if (resFicheros.ok) setFicheros(await resFicheros.json());
                if (resAreas.ok) setAreas(await resAreas.json());
            } catch (error) {
                console.error('Error cargando datos:', error);
            }
        };
        cargarDatos();
    }, []);

    const cargarFicheros = async () => {
        try {
            const resp = await fetch('/api/Ficheros', { headers: authHeaders() });
            if (resp.ok) setFicheros(await resp.json());
        } catch (error) {
            console.error('Error cargando ficheros:', error);
        }
    };

    // Descargar fichero al hacer click en la fila
    const handleRowClick = async (e) => {
        const id = e.data?.ficheroId;
        if (!id) return;
        try {
            const respuesta = await fetch(`/api/Ficheros/${id}/download?usuarioId=${usuarioId}`, {
                headers: authHeaders(),
            });
            if (!respuesta.ok) { notify(t('Fichero no encontrado en el servidor.'), 'error', 3000); return; }
            const contentDisposition = respuesta.headers.get('Content-Disposition');
            let nombreFichero = e.data?.descripcion || e.data?.nombreFichero || `fichero_${id}`;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match?.[1]) nombreFichero = match[1].replace(/['"]/g, '');
            }
            const blob = await respuesta.blob();
            saveAs(blob, nombreFichero);
        } catch (error) {
            notify(t('Error al descargar el fichero.'), 'error', 3000);
        }
    };

    // Crear fichero
    const handleCrearFichero = async () => {
        if (!archivo) { notify(t('Debes seleccionar un fichero.'), 'warning', 3000); return; }
        setCargando(true);
        try {
            const formData = new FormData();
            if (form.descripcion) formData.append('descripcion', form.descripcion);
            if (form.fecha) formData.append('fecha', form.fecha);
            if (form.areaId) formData.append('areaId', form.areaId);
            formData.append('archivo', archivo);

            const token = AuthService.getToken();
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const resp = await fetch(`/api/Ficheros?usuarioId=${usuarioId}`, {
                method: 'POST', headers, body: formData,
            });
            if (resp.ok) {
                notify(t('Fichero creado correctamente.'), 'success', 3000);
                cerrarPopup();
                await cargarFicheros();
            } else {
                const err = await resp.json().catch(() => ({}));
                notify(err.message || t('Error al crear el fichero.'), 'error', 3000);
            }
        } catch (error) {
            notify(t('Error al crear el fichero.'), 'error', 3000);
        } finally {
            setCargando(false);
        }
    };

    // Eliminar
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
            const resp = await fetch(`/api/Ficheros/${rowToDelete.ficheroId}?usuarioId=${usuarioId}`, {
                method: 'DELETE', headers,
            });
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
        setForm({ descripcion: '', fecha: '', areaId: '', autor: '' });
        setArchivo(null);
        setArchivoNombre('');
    };

    const onExporting = (e) => {
        e.component.beginUpdate();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Ficheros');
        exportDataGrid({ component: e.component, worksheet, autoFilterEnabled: true })
            .then(() => workbook.xlsx.writeBuffer())
            .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ficheros.xlsx'));
        e.cancel = true;
    };

    const handleArchivoChange = (e) => {
        const file = e.target.files[0] || null;
        setArchivo(file);
        setArchivoNombre(file ? file.name : '');
    };

    // Renderizador de columna Acciones
    const renderAcciones = (cellData) => {
        const row = cellData.data;
        return (
            <div className="ficheros-acciones">
                <button
                    className="fich-btn fich-btn-edit"
                    title="Editar"
                    onClick={(e) => { e.stopPropagation(); /* editar futuro */ }}
                >
                    <i className="ri-edit-line" />
                </button>
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

    return (
        <React.Fragment>
            <div className="ficheros-page">

                {/* ── Cabecera ─────────────────────────────────────────── */}
                <div className="ficheros-header">
                    <div className="ficheros-title">
                        <i className="ri-folder-3-line" />
                        LISTA FICHEROS
                    </div>

                    <div className="ficheros-header-right">
                        {esAdmin && (
                            <button
                                className="fich-btn-primary"
                                onClick={() => { setForm(f => ({ ...f, autor: usuarioNombre })); setPopupVisible(true); }}
                            >
                                <i className="ri-add-line" /> Nuevo Fichero
                            </button>
                        )}

                        <div className="acciones-container" ref={menuRef}>
                            <button className="fich-btn-menu" onClick={() => setMenuAbierto(!menuAbierto)}>
                                <i className="ri-more-2-fill" />
                                <span>Cerrar opciones</span>
                            </button>

                            {menuAbierto && (
                                <div className="fich-acciones-menu">
                                    <div className="fich-menu-header">
                                        <span>Cerrar opciones</span>
                                        <i className="ri-close-line" onClick={() => setMenuAbierto(false)} />
                                    </div>
                                    <div className="fich-menu-item" onClick={() => {
                                        setMenuAbierto(false);
                                        const instance = dataGridRef.current?.instance();
                                        if (!instance) return;
                                        const wb = new Workbook();
                                        const ws = wb.addWorksheet('Ficheros');
                                        exportDataGrid({ component: instance, worksheet: ws, autoFilterEnabled: true })
                                            .then(() => wb.xlsx.writeBuffer())
                                            .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ficheros.xlsx'));
                                    }}>
                                        <i className="ri-file-excel-2-line" /> Exportar a Excel
                                    </div>
                                    <div className="fich-menu-item" onClick={() => {
                                        setMenuAbierto(false);
                                        const instance = dataGridRef.current?.instance();
                                        instance?.exportToPdf?.({ fileName: 'ficheros.pdf' });
                                    }}>
                                        <i className="ri-file-pdf-line" /> Exportar a PDF
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
                        keyExpr="ficheroId"
                        showBorders={true}
                        columnAutoWidth={true}
                        allowColumnResizing={true}
                        onExporting={onExporting}
                        onRowClick={handleRowClick}
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
                        <Export enabled fileName="Ficheros" allowExportSelectedData />
                        <Sorting mode="multiple" />
                        <FilterPanel visible />
                        <ColumnFixing enabled />

                        <Column dataField="nombreFichero" caption="Fichero" minWidth={220} />
                        <Column dataField="area" caption="Área" width={180} />
                        <Column dataField="descripcion" caption="Descripción" minWidth={180} />
                        <Column dataField="usuario" caption="Usuario" width={120} />
                        <Column
                            dataField="fechaAlta"
                            caption="Fecha"
                            dataType="date"
                            format="dd/MM/yyyy"
                            width={110}
                        />
                        <Column
                            caption="Acciones"
                            width={90}
                            alignment="center"
                            allowSorting={false}
                            allowFiltering={false}
                            cellRender={renderAcciones}
                        />
                    </DataGrid>
                </div>
            </div>

            {/* ── Popup Ficha Fichero ──────────────────────────────────── */}
            {popupVisible && (
                <div className="fich-popup-overlay">
                    <div className="fich-popup">
                        {/* Título */}
                        <div className="fich-popup-title">
                            <span>Ficha Fichero</span>
                            <div className="fich-popup-title-btns">
                                <button className="fich-popup-btn-accept" onClick={handleCrearFichero} disabled={cargando}>
                                    <i className="ri-check-line" /> {cargando ? 'Subiendo...' : 'Aceptar'}
                                </button>
                                <button className="fich-popup-btn-cancel" onClick={cerrarPopup}>
                                    <i className="ri-close-line" /> Salir
                                </button>
                            </div>
                        </div>

                        {/* Cuerpo */}
                        <div className="fich-popup-body">
                            {/* Fila 1: Fecha + Área */}
                            <div className="fich-popup-row">
                                <div className="fich-popup-field">
                                    <label>Fecha</label>
                                    <input
                                        type="date"
                                        className="fich-input"
                                        value={form.fecha}
                                        onChange={e => setForm({ ...form, fecha: e.target.value })}
                                    />
                                </div>
                                <div className="fich-popup-field">
                                    <label>Área</label>
                                    <select
                                        className="fich-select"
                                        value={form.areaId}
                                        onChange={e => setForm({ ...form, areaId: e.target.value })}
                                    >
                                        <option value=""></option>
                                        {areas.map(a => (
                                            <option key={a.areaId} value={a.areaId}>{a.area}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Fila 2: Autor */}
                            <div className="fich-popup-row">
                                <div className="fich-popup-field">
                                    <label>Autor</label>
                                    <input
                                        type="text"
                                        className="fich-input fich-readonly"
                                        value={usuarioNombre}
                                        readOnly
                                    />
                                </div>
                                <div className="fich-popup-field" />
                            </div>

                            {/* Fila 3: Fichero */}
                            <div className="fich-popup-row">
                                <div className="fich-popup-field fich-popup-field-full">
                                    <label>Fichero</label>
                                    <div className="fich-file-wrap">
                                        <input
                                            type="text"
                                            className="fich-input fich-file-text"
                                            placeholder="Seleccionar un archiv..."
                                            value={archivoNombre}
                                            readOnly
                                        />
                                        <label className="fich-file-btn">
                                            Examinar...
                                            <input type="file" className="fich-file-hidden" onChange={handleArchivoChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Fila 4: Descripción */}
                            <div className="fich-popup-row">
                                <div className="fich-popup-field fich-popup-field-full">
                                    <label>Descripción</label>
                                    <textarea
                                        className="fich-textarea"
                                        rows={4}
                                        value={form.descripcion}
                                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                                    />
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
                                <strong>{rowToDelete?.nombreFichero ?? rowToDelete?.ficheroId}</strong> de la lista?
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default Ficheros;
