import React, { useEffect, useRef, useState, useCallback } from "react";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { useTranslation } from "react-i18next";
import '../../../styles/FichaGlobal.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5118/api';

// ─── Columnas editables por el usuario ───────────────────────────────────────
const COLS_EDITABLES = [
    { field: 'gastoPersonal',     label: 'Gasto Personal',       grupo: 'propios' },
    { field: 'gastoCorrientes',   label: 'Gastos Corrientes',    grupo: 'propios' },
    { field: 'gastosFinancieros', label: 'Gastos Financieros',   grupo: 'propios' },
    { field: 'amortizacion',      label: 'Amortización',         grupo: 'propios' },
    { field: 'costeConciertos',   label: 'Medios Ajenos',        grupo: 'art25' },
    { field: 'aplicacion2581',    label: 'Aplicación 258.1',     grupo: 'art25' },
    { field: 'aplicacion2582',    label: 'Aplicación 258.2',     grupo: 'art25' },
    { field: 'restoArt25',        label: 'Resto Art. 25',        grupo: 'art25' },
    { field: 'inversionNueva',    label: 'Inversión Nueva',      grupo: 'otros' },
    { field: 'reposicion',        label: 'Reposición',           grupo: 'otros' },
    { field: 'ingresosServicios', label: 'Ingresos Servicios',   grupo: 'otros' },
];

// Columnas de solo lectura (calculadas o desde vistas)
const COLS_CALC = [
    { field: 'totalCostePropios',   label: 'TOTAL COSTE PROPIOS',   color: '#1565c0' },
    { field: 'totalArticulo25',     label: 'TOTAL ART. 25',         color: '#1565c0' },
    { field: 'totalOtrosConceptos', label: 'TOTAL OTROS CONCEPTOS', color: '#1565c0' },
    { field: 'totalGeneral',        label: 'TOTAL GENERAL',         color: '#b71c1c' },
];

const COLS_REG = [
    { field: 'propiosConf',   label: 'Propios Conf.' },
    { field: 'propiosNoConf', label: 'Propios No Conf.' },
    { field: 'concertConf',   label: 'Concert. Conf.' },
    { field: 'concertNoConf', label: 'Concert. No Conf.' },
];

// ─── Helpers de estilos ───────────────────────────────────────────────────────
const thS = (width, color = '#1976d2') => ({
    padding: '7px 6px', textAlign: 'center', minWidth: width, width,
    fontWeight: 700, fontSize: 10.5, borderRight: '1px solid rgba(255,255,255,0.2)',
    background: color, color: '#fff', whiteSpace: 'nowrap',
});
const tdS = (center = true, bold = false, color = 'inherit') => ({
    padding: '4px 5px', textAlign: center ? 'right' : 'left',
    borderBottom: '1px solid #eee', borderRight: '1px solid #f0f0f0',
    fontWeight: bold ? 700 : 400, color, fontSize: 12,
});

// ─── Calcular totales en el cliente ──────────────────────────────────────────
const calcTotales = (row) => {
    const n = (v) => Number(v) || 0;
    const totalCostePropios   = n(row.gastoPersonal) + n(row.gastoCorrientes) + n(row.gastosFinancieros) + n(row.amortizacion);
    const totalArticulo25     = n(row.costeConciertos) + n(row.aplicacion2581) + n(row.aplicacion2582) + n(row.restoArt25);
    const totalOtrosConceptos = n(row.inversionNueva) + n(row.reposicion) + n(row.ingresosServicios);
    const totalGeneral        = totalCostePropios + totalArticulo25 + totalOtrosConceptos;
    return { ...row, totalCostePropios, totalArticulo25, totalOtrosConceptos, totalGeneral };
};

const fmt = (v) => v == null ? '—' : Number(v).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Componente principal ─────────────────────────────────────────────────────
const Descuadres = () => {
    const { t } = useTranslation();
    const menuRef = useRef(null);

    const [datos,        setDatos]        = useState([]);
    const [editando,     setEditando]     = useState({}); // { [mutuaId]: { ...campos } }
    const [guardando,    setGuardando]    = useState({}); // { [mutuaId]: true }
    const [msg,          setMsg]          = useState(null);
    const [menuAbierto,  setMenuAbierto]  = useState(false);
    const [cargando,     setCargando]     = useState(true);

    // ── Cargar datos ────────────────────────────────────────────────────────
    const cargar = useCallback(async () => {
        setCargando(true);
        try {
            const res = await fetch(`${API}/Descuadres`);
            const data = await res.json();
            setDatos(data.map(calcTotales));
            setEditando({});
        } catch (err) {
            console.error('Error al cargar descuadres:', err);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    useEffect(() => {
        const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // ── Edición inline ──────────────────────────────────────────────────────
    const handleChange = (mutuaId, field, value) => {
        const original = datos.find(d => d.mutuaId === mutuaId) || {};
        const current  = editando[mutuaId] || { ...original };
        const updated  = calcTotales({ ...current, [field]: value === '' ? 0 : Number(value) });
        setEditando(prev => ({ ...prev, [mutuaId]: updated }));
    };

    const getRow = (mutuaId) => {
        return editando[mutuaId] || datos.find(d => d.mutuaId === mutuaId) || {};
    };

    const hayEdicion = (mutuaId) => !!editando[mutuaId];

    // ── Guardar fila ────────────────────────────────────────────────────────
    const handleGuardar = async (mutuaId) => {
        const row = editando[mutuaId];
        if (!row) return;

        const user = JSON.parse(localStorage.getItem('UsuarioActual') || '{}');
        const usuarioId = user?.usuarioId ?? 0;

        setGuardando(prev => ({ ...prev, [mutuaId]: true }));
        try {
            const res = await fetch(`${API}/Descuadres/${mutuaId}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ ...row, mutuaId, usuarioId }),
            });
            if (!res.ok) throw new Error('Error al guardar');
            setMsg({ ok: true, text: `Mutua ${mutuaId} guardada correctamente.` });
            setEditando(prev => { const n = { ...prev }; delete n[mutuaId]; return n; });
            await cargar();
        } catch (err) {
            setMsg({ ok: false, text: err.message || 'Error al guardar.' });
        } finally {
            setGuardando(prev => ({ ...prev, [mutuaId]: false }));
            setTimeout(() => setMsg(null), 4000);
        }
    };

    const handleCancelar = (mutuaId) => {
        setEditando(prev => { const n = { ...prev }; delete n[mutuaId]; return n; });
    };

    // ── Guardar todos ───────────────────────────────────────────────────────
    const handleGuardarTodos = async () => {
        const ids = Object.keys(editando).map(Number);
        if (ids.length === 0) return;
        for (const id of ids) await handleGuardar(id);
    };

    // ── Exportar Excel ──────────────────────────────────────────────────────
    const exportToExcel = async () => {
        const workbook  = new Workbook();
        const worksheet = workbook.addWorksheet('Descuadres');

        const headers = ['Mutua', ...COLS_EDITABLES.map(c => c.label), ...COLS_CALC.map(c => c.label), ...COLS_REG.map(c => c.label)];
        worksheet.addRow(headers);

        datos.forEach(row => {
            worksheet.addRow([
                row.mutua,
                ...COLS_EDITABLES.map(c => Number(row[c.field]) || 0),
                ...COLS_CALC.map(c => Number(row[c.field]) || 0),
                ...COLS_REG.map(c => Number(row[c.field]) || 0),
            ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Descuadres.xlsx');
    };

    const pendientes = Object.keys(editando).length;

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">

                {/* HEADER */}
                <div className="header-page">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="title">{t('Descuadres')}</div>
                        {msg && (
                            <span style={{ fontSize: 13, color: msg.ok ? '#2e7d32' : '#c62828', fontWeight: 500 }}>
                                {msg.text}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        {pendientes > 0 && (
                            <>
                                <button
                                    onClick={handleGuardarTodos}
                                    style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                    <i className="ri-save-line" style={{ marginRight: 6 }} />
                                    Guardar todos ({pendientes})
                                </button>
                                <button
                                    onClick={() => setEditando({})}
                                    style={{ background: '#e0e0e0', color: '#333', border: 'none', borderRadius: 5, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                    Cancelar todo
                                </button>
                            </>
                        )}
                        <div className="acciones-container" ref={menuRef}>
                            <div className="acciones-btn" onClick={() => setMenuAbierto(v => !v)}>
                                <i className="ri-settings-3-line"></i> {t('Acciones')}
                            </div>
                            {menuAbierto && (
                                <div className="acciones-menu">
                                    <div className="acciones-item" onClick={() => { setMenuAbierto(false); exportToExcel(); }}>
                                        <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                        {t('Exportar a Excel')}
                                    </div>
                                    <div className="acciones-item" onClick={() => { setMenuAbierto(false); cargar(); }}>
                                        <i className="ri-refresh-line" style={{ color: '#1976d2' }}></i>
                                        {t('Recargar datos')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* TABLA */}
                <div className="table-container" style={{ overflowX: 'auto' }}>
                    {cargando ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Cargando datos...</div>
                    ) : (
                        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
                            <thead>
                                <tr>
                                    {/* Fija izquierda */}
                                    <th style={thS(60)}>Nr</th>
                                    <th style={{ ...thS(160), textAlign: 'left' }}>Mutua</th>

                                    {/* Coste Propios */}
                                    <th colSpan={4} style={thS('auto', '#1565c0')}>COSTE PROPIOS</th>
                                    <th style={thS(130, '#0d47a1')}>TOTAL COSTE PROPIOS</th>

                                    {/* Artículo 25 */}
                                    <th colSpan={4} style={thS('auto', '#4a148c')}>ARTÍCULO 25</th>
                                    <th style={thS(120, '#311b92')}>TOTAL ART. 25</th>

                                    {/* Otros */}
                                    <th colSpan={3} style={thS('auto', '#1b5e20')}>OTROS CONCEPTOS</th>
                                    <th style={thS(130, '#1b5e20')}>TOTAL OTROS</th>

                                    {/* Total general */}
                                    <th style={thS(130, '#b71c1c')}>TOTAL GENERAL</th>

                                    {/* Registros */}
                                    <th colSpan={4} style={thS('auto', '#37474f')}>REGISTROS</th>

                                    {/* Acciones */}
                                    <th style={thS(110, '#455a64')}>Acciones</th>
                                </tr>
                                <tr style={{ background: '#e3f2fd' }}>
                                    <th style={{ ...thS(60, '#e3f2fd'), color: '#333' }}></th>
                                    <th style={{ ...thS(160, '#e3f2fd'), color: '#333', textAlign: 'left' }}></th>
                                    {/* Propios */}
                                    {['Gasto Personal','G. Corrientes','G. Financieros','Amortización'].map(l =>
                                        <th key={l} style={{ ...thS(105, '#e3f2fd'), color: '#333' }}>{l}</th>
                                    )}
                                    <th style={{ ...thS(130, '#bbdefb'), color: '#0d47a1', fontWeight: 800 }}></th>
                                    {/* Art 25 */}
                                    {['Medios Ajenos','Aplic. 258.1','Aplic. 258.2','Resto Art.25'].map(l =>
                                        <th key={l} style={{ ...thS(105, '#f3e5f5'), color: '#4a148c' }}>{l}</th>
                                    )}
                                    <th style={{ ...thS(120, '#e1bee7'), color: '#311b92', fontWeight: 800 }}></th>
                                    {/* Otros */}
                                    {['Inv. Nueva','Reposición','Ingresos Serv.'].map(l =>
                                        <th key={l} style={{ ...thS(105, '#e8f5e9'), color: '#1b5e20' }}>{l}</th>
                                    )}
                                    <th style={{ ...thS(130, '#c8e6c9'), color: '#1b5e20', fontWeight: 800 }}></th>
                                    {/* Total general */}
                                    <th style={{ ...thS(130, '#ffcdd2'), color: '#b71c1c', fontWeight: 800 }}></th>
                                    {/* Registros */}
                                    {['Propios Conf.','Propios No Conf.','Concert. Conf.','Concert. No Conf.'].map(l =>
                                        <th key={l} style={{ ...thS(95, '#eceff1'), color: '#37474f' }}>{l}</th>
                                    )}
                                    <th style={{ ...thS(110, '#eceff1'), color: '#333' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {datos.length === 0 ? (
                                    <tr>
                                        <td colSpan={22} style={{ textAlign: 'center', padding: 30, color: '#999' }}>
                                            Sin datos para mostrar
                                        </td>
                                    </tr>
                                ) : datos.map((original, i) => {
                                    const row       = getRow(original.mutuaId);
                                    const editado   = hayEdicion(original.mutuaId);
                                    const guardandoFila = guardando[original.mutuaId];
                                    const bg        = editado ? '#fffde7' : (i % 2 === 0 ? '#fff' : '#f9f9f9');

                                    const inp = (field) => (
                                        <input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={row[field] ?? 0}
                                            onChange={e => handleChange(original.mutuaId, field, e.target.value)}
                                            style={{
                                                width: 90, textAlign: 'right', border: '1px solid #ccc',
                                                borderRadius: 3, padding: '2px 4px', fontSize: 11,
                                                background: editado ? '#fff9c4' : '#fff',
                                            }}
                                        />
                                    );

                                    return (
                                        <tr key={original.mutuaId} style={{ background: bg, outline: editado ? '2px solid #f9a825' : 'none', outlineOffset: -1 }}>
                                            <td style={tdS(true)}>{original.mutuaId}</td>
                                            <td style={tdS(false)}><strong>{original.mutua}</strong></td>

                                            {/* Coste Propios — editables */}
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('gastoPersonal')}</td>
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('gastoCorrientes')}</td>
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('gastosFinancieros')}</td>
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('amortizacion')}</td>
                                            <td style={tdS(true, true, '#0d47a1')}>{fmt(row.totalCostePropios)}</td>

                                            {/* Artículo 25 — editables */}
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('costeConciertos')}</td>
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('aplicacion2581')}</td>
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('aplicacion2582')}</td>
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('restoArt25')}</td>
                                            <td style={tdS(true, true, '#311b92')}>{fmt(row.totalArticulo25)}</td>

                                            {/* Otros — editables */}
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('inversionNueva')}</td>
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('reposicion')}</td>
                                            <td style={{ ...tdS(), padding: '2px 3px' }}>{inp('ingresosServicios')}</td>
                                            <td style={tdS(true, true, '#1b5e20')}>{fmt(row.totalOtrosConceptos)}</td>

                                            {/* Total general */}
                                            <td style={tdS(true, true, '#b71c1c')}>{fmt(row.totalGeneral)}</td>

                                            {/* Registros — solo lectura */}
                                            <td style={tdS(true)}>{original.propiosConf ?? 0}</td>
                                            <td style={tdS(true)}>{original.propiosNoConf ?? 0}</td>
                                            <td style={tdS(true)}>{original.concertConf ?? 0}</td>
                                            <td style={tdS(true)}>{original.concertNoConf ?? 0}</td>

                                            {/* Acciones */}
                                            <td style={{ ...tdS(true), padding: '3px 6px' }}>
                                                <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                                                    {editado ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleGuardar(original.mutuaId)}
                                                                disabled={guardandoFila}
                                                                title="Guardar"
                                                                style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                                                                {guardandoFila ? '...' : '✓'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelar(original.mutuaId)}
                                                                title="Cancelar"
                                                                style={{ background: '#e0e0e0', color: '#333', border: 'none', borderRadius: 4, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}>
                                                                ✕
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span style={{ color: '#aaa', fontSize: 11 }}>sin cambios</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* PIE con leyenda */}
                <div style={{ padding: '10px 25px', fontSize: 11, color: '#888', borderTop: '1px solid #eee', display: 'flex', gap: 20 }}>
                    <span>💡 Edita directamente los campos de cada fila y pulsa ✓ para guardar.</span>
                    <span>Los totales se calculan automáticamente.</span>
                    <span>Los registros (Conf./No Conf.) se calculan desde las validaciones del sistema.</span>
                </div>

            </div>
        </div>
    );
};

export default Descuadres;
