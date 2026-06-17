import React, { useEffect, useRef, useState } from "react";
import DataGrid, {
    Column, Paging, FilterRow, HeaderFilter,
    GroupPanel, Grouping, ColumnChooser, Scrolling,
    Sorting, ColumnFixing, Pager, Toolbar, Item
} from "devextreme-react/data-grid";
import SelectBox from "devextreme-react/select-box";
import { useTranslation } from "react-i18next";
import '../Centros/FichaFinca.css';
import { useLogError } from '../../../hooks/useLogError';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5118/api';

const CIEP = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);
    const nuevoCiepRef = useRef(null);
    const editCiepRef = useRef(null);

    const [menuAbierto, setMenuAbierto] = useState(false);
    const [datos, setDatos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [cargando, setCargando] = useState(false);

    const [nuevoCiep, setNuevoCiep] = useState('');
    const [nuevaEspecialidad, setNuevaEspecialidad] = useState(null);
    const [mostrarNueva, setMostrarNueva] = useState(false);

    const [editandoId, setEditandoId] = useState(null);
    const [editCiep, setEditCiep] = useState('');
    const [editEspecialidad, setEditEspecialidad] = useState(null);

    const logError = useLogError("CIEP");

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setMenuAbierto(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        cargarDatos();
        cargarEspecialidades();
    }, []);

    useEffect(() => {
        if (mostrarNueva && nuevoCiepRef.current)
            nuevoCiepRef.current.focus();
    }, [mostrarNueva]);

    const cargarDatos = () => {
        setCargando(true);
        fetch(`${API}/CIEP`)
            .then(res => res.json())
            .then(data => setDatos(data))
            .catch(err => logError('Error al cargar datos CIEP', err))
            .finally(() => setCargando(false));
    };

    const cargarEspecialidades = () => {
        fetch(`${API}/CIEP/especialidades`)
            .then(res => res.json())
            .then(data => setEspecialidades(data))
            .catch(err => logError('Error al cargar especialidades', err));
    };

    const handleAnadir = () => {
        if (!nuevoCiep || !nuevaEspecialidad) return;
        fetch(`${API}/CIEP`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ciep: nuevoCiep, especialidadId: nuevaEspecialidad })
        })
            .then(() => {
                setNuevoCiep('');
                setNuevaEspecialidad(null);
                setMostrarNueva(false);
                cargarDatos();
            });
    };

    const handleEditar = (row) => {
        setEditandoId(row.ciepId);
        setEditCiep(row.ciep);
        setEditEspecialidad(row.especialidadId);
    };

    const handleGuardarEdicion = (id) => {
        fetch(`${API}/CIEP/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ciepId: id, ciep: editCiep, especialidadId: editEspecialidad })
        })
            .then(() => {
                setEditandoId(null);
                cargarDatos();
            });
    };

    const handleEliminar = (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return;
        fetch(`${API}/CIEP/${id}`, { method: 'DELETE' })
            .then(() => setDatos(prev => prev.filter(d => d.ciepId !== id)));
    };

    // Estilos de celda para la tabla manual
    const tdStyle = { padding: '8px 12px', borderBottom: '1px solid #e0e0e0', fontSize: 14 };
    const thStyle = { padding: '10px 12px', background: '#f0f4fa', color: '#1a5fa8', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #e0e0e0' };

    return (
        <div className="finca-container-inline">
            <div className="finca-inline-content">

                {/* HEADER */}
                <div className="finca-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px' }}>
                    <span className="finca-modal-title">{t('LISTA CIEP')}</span>
                    <div className="acciones-container" ref={menuRef}>
                        <div className="acciones-btn" onClick={() => setMenuAbierto(v => !v)}>
                            <i className="ri-settings-3-line"></i>
                            {t('Acciones')}
                        </div>
                        {menuAbierto && (
                            <div className="acciones-menu">
                                <div className="acciones-item" onClick={() => { setMostrarNueva(true); setMenuAbierto(false); }}>
                                    <i className="ri-add-line" style={{ color: '#1976d2' }}></i>
                                    {t('Nuevo CIEP')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* FILA NUEVA — fuera del DataGrid */}
                {mostrarNueva && (
                    <div style={{ padding: '0 16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ ...thStyle, width: 150, textAlign: 'center' }}>Código</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Especialidad</th>
                                    <th style={{ ...thStyle, width: 300, textAlign: 'center' }}>C.I.E.P.</th>
                                    <th style={{ ...thStyle, width: 150, textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: '#f0f7ff' }}>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}></td>
                                    <td style={tdStyle}>
                                        <SelectBox
                                            dataSource={especialidades}
                                            displayExpr="especialidad"
                                            valueExpr="especialidadId"
                                            value={nuevaEspecialidad}
                                            onValueChanged={e => setNuevaEspecialidad(e.value)}
                                            placeholder="Selecciona especialidad"
                                            width="100%"
                                        />
                                    </td>
                                    <td style={tdStyle}>
                                        <input
                                            ref={nuevoCiepRef}
                                            value={nuevoCiep}
                                            onChange={e => setNuevoCiep(e.target.value)}
                                            placeholder="Código CIEP"
                                            style={{ border: '1px solid #cbd5e1', borderRadius: 4, padding: '6px 10px', width: '100%', fontSize: 14 }}
                                        />
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <i className="ri-check-line"
                                            style={{ cursor: 'pointer', color: '#2e7d32', fontSize: 20, marginRight: 10 }}
                                            title="Guardar"
                                            onClick={handleAnadir}
                                        />
                                        <i className="ri-close-line"
                                            style={{ cursor: 'pointer', color: '#c62828', fontSize: 20 }}
                                            title="Cancelar"
                                            onClick={() => { setMostrarNueva(false); setNuevoCiep(''); setNuevaEspecialidad(null); }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TABLA */}
                <div className="finca-tab-content" style={{ padding: '0 16px 16px' }}>
                    <DataGrid
                        ref={dataGridRef}
                        dataSource={datos}
                        keyExpr="ciepId"
                        showBorders={true}
                        columnAutoWidth={false}
                        allowColumnResizing={true}
                        className="mz-table"
                        rowAlternationEnabled={true}
                        showRowLines={true}
                        showColumnLines={true}
                        wordWrapEnabled={false}
                        width="100%"
                        noDataText={cargando ? 'Cargando...' : 'Sin datos para mostrar'}
                    >
                        <Scrolling mode="standard" showScrollbar="always" />
                        <Paging defaultPageSize={25} />
                        <Pager visible={true} allowedPageSizes={[10, 25, 50]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                        <FilterRow visible={true} applyFilter="auto" />
                        <HeaderFilter visible searchMode="contains" />
                        <GroupPanel visible={true} emptyPanelText="Arrastra una columna aqui para agrupar" />
                        <Grouping autoExpandAll={false} />
                        <ColumnChooser enabled mode="select" />
                        <Sorting mode="multiple" />
                        <ColumnFixing enabled />
                        <Toolbar>
                            <Item name="groupPanel" />
                            <Item name="columnChooserButton" />
                        </Toolbar>

                        <Column
                            dataField="ciepId"
                            caption="Código"
                            width={150}
                            alignment="center"
                            cssClass="dx-cell-large"
                        />
                        <Column
                            dataField="especialidad"
                            caption="Especialidad"
                            alignment="center"
                            cssClass="dx-cell-large"
                            cellRender={(cell) => {
                                if (editandoId === cell.data.ciepId) {
                                    return (
                                        <SelectBox
                                            dataSource={especialidades}
                                            displayExpr="especialidad"
                                            valueExpr="especialidadId"
                                            value={editEspecialidad}
                                            onValueChanged={e => setEditEspecialidad(e.value)}
                                            width="100%"
                                        />
                                    );
                                }
                                return cell.value;
                            }}
                        />
                        <Column
                            dataField="ciep"
                            caption="C.I.E.P."
                            width={300}
                            alignment="center"
                            cssClass="dx-cell-large"
                            cellRender={(cell) => {
                                if (editandoId === cell.data.ciepId) {
                                    return (
                                        <input
                                            defaultValue={editCiep}
                                            onChange={e => setEditCiep(e.target.value)}
                                            style={{ border: '1px solid #cbd5e1', borderRadius: 4, padding: '4px 8px', width: '100%', fontSize: 14 }}
                                        />
                                    );
                                }
                                return cell.value;
                            }}
                        />
                        <Column
                            caption="Acciones"
                            width={150}
                            alignment="center"
                            allowFiltering={false}
                            allowHeaderFiltering={false}
                            allowSorting={false}
                            cssClass="dx-cell-large"
                            cellRender={(cell) => {
                                if (editandoId === cell.data.ciepId) {
                                    return (
                                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                            <i className="ri-check-line"
                                                style={{ cursor: 'pointer', color: '#2e7d32', fontSize: 20 }}
                                                title="Guardar"
                                                onClick={(e) => { e.stopPropagation(); handleGuardarEdicion(cell.data.ciepId); }}
                                            />
                                            <i className="ri-close-line"
                                                style={{ cursor: 'pointer', color: '#c62828', fontSize: 20 }}
                                                title="Cancelar"
                                                onClick={(e) => { e.stopPropagation(); setEditandoId(null); }}
                                            />
                                        </div>
                                    );
                                }
                                return (
                                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                        <i className="ri-edit-line"
                                            style={{ cursor: 'pointer', color: '#2f5da8', fontSize: 18 }}
                                            title="Editar"
                                            onClick={(e) => { e.stopPropagation(); handleEditar(cell.data); }}
                                        />
                                        <i className="ri-add-line"
                                            style={{ cursor: 'pointer', color: '#2e7d32', fontSize: 18 }}
                                            title="Añadir"
                                            onClick={(e) => { e.stopPropagation(); setMostrarNueva(true); }}
                                        />
                                        <i className="ri-delete-bin-line"
                                            style={{ cursor: 'pointer', color: '#c62828', fontSize: 18 }}
                                            title="Eliminar"
                                            onClick={(e) => { e.stopPropagation(); handleEliminar(cell.data.ciepId); }}
                                        />
                                    </div>
                                );
                            }}
                        />
                    </DataGrid>
                </div>
            </div>
        </div>
    );
};

export default CIEP;