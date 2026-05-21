import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './Admin.css';
import '../OfertaDemanda/Centros.css';
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
import { Popup } from 'devextreme-react/popup';
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
    const [popupVisible, setPopupVisible] = useState(false);
    const [form, setForm] = useState({ descripcion: '', fecha: '', areaId: '' });
    const [archivo, setArchivo] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(false);

    const userData = AuthService.getUserData();
    const esAdmin = userData?.perfilId === 1;
    const usuarioId = userData?.usuarioId || 0;

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const cargarFicheros = async () => {
        try {
            const resp = await fetch('/api/Ficheros', { headers: authHeaders() });
            if (resp.ok) setFicheros(await resp.json());
        } catch (error) {
            console.error('Error cargando ficheros:', error);
        }
    };

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

    const handleRowClick = async (e) => {
        const id = e.data?.ficheroId;
        if (!id) return;

        try {
            const respuesta = await fetch(`/api/Ficheros/${id}/download?usuarioId=${usuarioId}`, {
                headers: authHeaders(),
            });

            if (!respuesta.ok) {
                notify(t('Fichero no encontrado en el servidor.'), 'error', 3000);
                return;
            }

            const contentDisposition = respuesta.headers.get('Content-Disposition');
            let nombreFichero = e.data?.descripción || e.data?.nombreFichero || `fichero_${id}`;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match?.[1]) nombreFichero = match[1].replace(/['"]/g, '');
            }

            const blob = await respuesta.blob();
            saveAs(blob, nombreFichero);
        } catch (error) {
            console.error('Error descargando fichero:', error);
            notify(t('Error al descargar el fichero.'), 'error', 3000);
        }
    };

    const handleEliminarClick = () => {
        if (!pendingDelete) {
            setPendingDelete(true);
            notify(t('Pulsa de nuevo para confirmar la eliminación.'), 'warning', 4000);
            setTimeout(() => setPendingDelete(false), 4000);
        } else {
            setPendingDelete(false);
            confirmarEliminar();
        }
    };

    const confirmarEliminar = async () => {
        const instance = dataGridRef.current?.instance();
        const seleccionados = instance?.getSelectedRowsData() ?? [];

        if (seleccionados.length === 0) {
            notify(t('Selecciona al menos un fichero para eliminar.'), 'warning', 3000);
            return;
        }

        let errores = 0;
        for (const row of seleccionados) {
            try {
                const token = AuthService.getToken();
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                const resp = await fetch(`/api/Ficheros/${row.ficheroId}?usuarioId=${usuarioId}`, {
                    method: 'DELETE',
                    headers,
                });
                if (!resp.ok) errores++;
            } catch {
                errores++;
            }
        }

        if (errores === 0) {
            notify(t('Ficheros eliminados correctamente.'), 'success', 3000);
        } else {
            notify(t('Algunos ficheros no pudieron eliminarse.'), 'error', 3000);
        }

        await cargarFicheros();
        instance?.clearSelection();
        setMenuAbierto(false);
    };

    const handleCrearFichero = async () => {
        if (!archivo) {
            notify(t('Debes seleccionar un fichero.'), 'warning', 3000);
            return;
        }

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
                method: 'POST',
                headers,
                body: formData,
            });

            if (resp.ok) {
                notify(t('Fichero creado correctamente.'), 'success', 3000);
                setPopupVisible(false);
                setForm({ descripcion: '', fecha: '', areaId: '' });
                setArchivo(null);
                await cargarFicheros();
            } else {
                const err = await resp.json().catch(() => ({}));
                notify(err.message || t('Error al crear el fichero.'), 'error', 3000);
            }
        } catch (error) {
            console.error('Error creando fichero:', error);
            notify(t('Error al crear el fichero.'), 'error', 3000);
        } finally {
            setCargando(false);
        }
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

    const cerrarPopup = () => {
        setPopupVisible(false);
        setForm({ descripcion: '', fecha: '', areaId: '' });
        setArchivo(null);
    };

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">{t('Gestión de Ficheros')}</div>

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

                                        <div className="acciones-item" onClick={() => {
                                            setMenuAbierto(false);
                                            const instance = dataGridRef.current?.instance();
                                            if (!instance) return;
                                            const wb = new Workbook();
                                            const ws = wb.addWorksheet('Ficheros');
                                            exportDataGrid({ component: instance, worksheet: ws, autoFilterEnabled: true })
                                                .then(() => wb.xlsx.writeBuffer())
                                                .then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ficheros.xlsx'));
                                        }}>
                                            <i className="ri-file-excel-2-line"></i>
                                            {t('Exportar Excel')}
                                        </div>

                                        {esAdmin && (
                                            <>
                                                <div className="acciones-item" onClick={() => { setMenuAbierto(false); setPopupVisible(true); }}>
                                                    <i className="ri-upload-2-line"></i>
                                                    {t('Nuevo Fichero')}
                                                </div>

                                                <div className="acciones-item" onClick={handleEliminarClick}>
                                                    <i className="ri-delete-bin-line"></i>
                                                    {pendingDelete ? t('¿Confirmar eliminación?') : t('Eliminar seleccionados')}
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
                            dataSource={ficheros}
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
                            <Export enabled fileName="Ficheros" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <FilterPanel visible />
                            <ColumnFixing enabled />

                            <Column dataField="descripción"   caption={t('Descripción')}   minWidth={200} />
                            <Column dataField="area"          caption={t('Área')}           width={150} />
                            <Column
                                dataField="fecha"
                                caption={t('Vigencia')}
                                dataType="date"
                                format="dd/MM/yyyy"
                                width={120}
                            />
                            <Column
                                dataField="fechaAlta"
                                caption={t('Fecha Alta')}
                                dataType="date"
                                format="dd/MM/yyyy"
                                width={120}
                            />
                            <Column dataField="nombreFichero" caption={t('Fichero')}        width={220} />
                        </DataGrid>
                    </div>
                </div>
            </div>

            <Popup
                visible={popupVisible}
                onHiding={cerrarPopup}
                title={t('Nuevo Fichero')}
                width={480}
                height="auto"
                dragEnabled={false}
                showCloseButton={true}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '8px 0' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>{t('Descripción')}</label>
                        <input
                            type="text"
                            value={form.descripcion}
                            onChange={e => setForm({ ...form, descripcion: e.target.value })}
                            style={{ width: '100%', padding: '6px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                            placeholder={t('Descripción del fichero')}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>{t('Área')}</label>
                        <select
                            value={form.areaId}
                            onChange={e => setForm({ ...form, areaId: e.target.value })}
                            style={{ width: '100%', padding: '6px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                        >
                            <option value="">{t('Selecciona un área')}</option>
                            {areas.map(a => (
                                <option key={a.areaId} value={a.areaId}>{a.area}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>{t('Vigencia')}</label>
                        <input
                            type="date"
                            value={form.fecha}
                            onChange={e => setForm({ ...form, fecha: e.target.value })}
                            style={{ width: '100%', padding: '6px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>{t('Fichero')} *</label>
                        <input
                            type="file"
                            onChange={e => setArchivo(e.target.files[0] || null)}
                            style={{ fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button
                            onClick={cerrarPopup}
                            style={{ padding: '7px 18px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', background: '#fff', fontSize: '14px' }}
                        >
                            {t('Cancelar')}
                        </button>
                        <button
                            onClick={handleCrearFichero}
                            disabled={cargando}
                            style={{ padding: '7px 18px', border: 'none', borderRadius: '4px', cursor: cargando ? 'not-allowed' : 'pointer', background: '#2f5da8', color: '#fff', fontSize: '14px' }}
                        >
                            {cargando ? t('Subiendo...') : t('Guardar')}
                        </button>
                    </div>
                </div>
            </Popup>
        </React.Fragment>
    );
};

export default Ficheros;
