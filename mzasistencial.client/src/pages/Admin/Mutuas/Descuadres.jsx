import React, { useEffect, useRef, useState, useCallback } from "react";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { useTranslation } from "react-i18next";
import '../../../styles/FichaGlobal.css';
import { useLogError } from '../../../hooks/useLogError';

const API = '/api';

// ─── Helpers de estilos ───────────────────────────────────────────────────────
const thS = (width, color = '#1976d2') => ({
    padding: '7px 6px', textAlign: 'center', minWidth: width, width,
    fontWeight: 700, fontSize: 10.5, borderRight: '1px solid rgba(255,255,255,0.2)',
    background: color, color: '#fff', whiteSpace: 'nowrap',
});
const tdS = (center = true, bold = false, color = 'inherit') => ({
    padding: '5px 7px', textAlign: center ? 'right' : 'left',
    borderBottom: '1px solid #eee', borderRight: '1px solid #f0f0f0',
    fontWeight: bold ? 700 : 400, color, fontSize: 12, whiteSpace: 'nowrap',
});

const fmt = (v) =>
    v == null ? '—' : Number(v).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Componente principal ─────────────────────────────────────────────────────
const Descuadres = () => {
    const { t } = useTranslation();
    const menuRef = useRef(null);

    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);

    const logError = useLogError("Descuadres");

    // ── Obtener usuario de sesión ────────────────────────────────────────────
    const getUsuarioSesion = () => {
        try {
            const u = JSON.parse(localStorage.getItem('UsuarioActual') || '{}');
            return {
                usuarioId: u?.usuarioId ?? 0,
                mutuaIdSesion: u?.mutuaId ?? 0,
                anio: u?.anio ?? new Date().getFullYear(),
                // Ahora extraemos y exponemos el perfil de forma segura
                perfilId: u?.perfilId ?? u?.perfil_id ?? 0,
            };
        } catch (err) {
            logError("Fallo al recuperar o parsear el UsuarioActual desde localStorage", err);
            return { usuarioId: 0, mutuaIdSesion: 0, anio: new Date().getFullYear(), perfilId: 0 };
        }
    };

    // ── Cargar / recalcular ──────────────────────────────────────────────────
    // El backend ejecuta: borrar → recalcular → insertar → actualizar contadores
    const cargar = useCallback(async () => {
        setCargando(true);
        setError(null);
        const { usuarioId, mutuaIdSesion, anio, perfilId } = getUsuarioSesion();
        try {
            const res = await fetch(
                `${API}/Descuadres?perfilId=${perfilId}&usuarioId=${usuarioId}&mutuaIdSesion=${mutuaIdSesion}&anio=${anio}`
            );
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = await res.json();
            setDatos(data);
        } catch (err) {
            logError(`Fallo crítico en el proceso de descuadres (Mutua: ${mutuaIdSesion}, Año: ${anio})`, err);
            setError(err.message || 'Error al cargar los descuadres');
        } finally {
            setCargando(false);
        }
    }, [logError]);

    useEffect(() => { cargar(); }, [cargar]);

    useEffect(() => {
        const h = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setMenuAbierto(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // ── Exportar Excel ───────────────────────────────────────────────────────
    const exportToExcel = async () => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Descuadres');

        worksheet.addRow([
            'Mutua',
            'Gasto Personal', 'G. Corrientes', 'G. Financieros', 'Amortización',
            'TOTAL COSTE PROPIOS',
            'Medios Ajenos', 'Aplic. 258.1', 'Aplic. 258.2', 'Resto Art.25',
            'TOTAL ART. 25',
            'Inv. Nueva', 'Reposición', 'Ingresos Serv.',
            'TOTAL OTROS CONCEPTOS',
            'TOTAL GENERAL',
            'Propios Conf.', 'Propios No Conf.', 'Concert. Conf.', 'Concert. No Conf.',
        ]);

        datos.forEach(row => {
            worksheet.addRow([
                row.mutua,
                row.gastoPersonal, row.gastoCorrientes, row.gastosFinancieros, row.amortizacion,
                row.totalCostePropios,
                row.costeConciertos, row.aplicacion2581, row.aplicacion2582, row.restoArt25,
                row.totalArticulo25,
                row.inversionNueva, row.reposicion, row.ingresosServicios,
                row.totalOtrosConceptos,
                row.totalGeneral,
                row.propiosConf, row.propiosNoConf, row.concertConf, row.concertNoConf,
            ]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Descuadres.xlsx');
    };

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">

                {/* HEADER */}
                <div className="header-page">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="title">{t('Descuadres')}</div>
                        {error && (
                            <span style={{ fontSize: 13, color: '#c62828', fontWeight: 500 }}>
                                {error}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
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
                                        {t('Recalcular')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* TABLA */}
                <div className="table-container" style={{ overflowX: 'auto' }}>
                    {cargando ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                            <i className="ri-loader-4-line" style={{ fontSize: 24, marginRight: 8 }} />
                            Calculando descuadres...
                        </div>
                    ) : (
                        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
                            <thead>
                                {/* Fila 1 — grupos */}
                                <tr>
                                    <th style={thS(50)}>Nr</th>
                                    <th style={{ ...thS(160), textAlign: 'left' }}>Mutua</th>

                                    <th colSpan={4} style={thS('auto', '#1565c0')}>COSTE PROPIOS</th>
                                    <th style={thS(130, '#0d47a1')}>TOTAL COSTE PROPIOS</th>

                                    <th colSpan={4} style={thS('auto', '#0277bd')}>ARTÍCULO 25</th>
                                    <th style={thS(110, '#01579b')}>TOTAL ART. 25</th>

                                    <th colSpan={3} style={thS('auto', '#006064')}>OTROS CONCEPTOS</th>
                                    <th style={thS(130, '#004d40')}>TOTAL OTROS</th>

                                    <th style={thS(120, '#0d47a1')}>TOTAL GENERAL</th>

                                    <th colSpan={4} style={thS('auto', '#455a88')}>REGISTROS</th>
                                </tr>
                                {/* Fila 2 — subcolumnas */}
                                <tr>
                                    <th style={{ ...thS(50, '#e3f2fd'), color: '#1565c0' }}></th>
                                    <th style={{ ...thS(160, '#e3f2fd'), color: '#1565c0', textAlign: 'left' }}></th>

                                    {['Gasto Personal', 'G. Corrientes', 'G. Financieros', 'Amortización'].map(l =>
                                        <th key={l} style={{ ...thS(105, '#e3f2fd'), color: '#1565c0' }}>{l}</th>
                                    )}
                                    <th style={{ ...thS(130, '#bbdefb'), color: '#0d47a1', fontWeight: 800 }}></th>

                                    {['Medios Ajenos', 'Aplic. 258.1', 'Aplic. 258.2', 'Resto Art.25'].map(l =>
                                        <th key={l} style={{ ...thS(105, '#e1f5fe'), color: '#0277bd' }}>{l}</th>
                                    )}
                                    <th style={{ ...thS(110, '#b3e5fc'), color: '#01579b', fontWeight: 800 }}></th>

                                    {['Inv. Nueva', 'Reposición', 'Ingresos Serv.'].map(l =>
                                        <th key={l} style={{ ...thS(105, '#e0f7fa'), color: '#006064' }}>{l}</th>
                                    )}
                                    <th style={{ ...thS(130, '#b2ebf2'), color: '#004d40', fontWeight: 800 }}></th>

                                    <th style={{ ...thS(120, '#bbdefb'), color: '#0d47a1', fontWeight: 800 }}></th>

                                    {['Propios Conf.', 'Propios No Conf.', 'Concert. Conf.', 'Concert. No Conf.'].map(l =>
                                        <th key={l} style={{ ...thS(95, '#ecf0fb'), color: '#455a88' }}>{l}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {datos.length === 0 ? (
                                    <tr>
                                        <td colSpan={21} style={{ textAlign: 'center', padding: 30, color: '#999' }}>
                                            Sin datos para mostrar
                                        </td>
                                    </tr>
                                ) : datos.map((row, i) => (
                                    <tr key={row.mutuaId} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                                        <td style={tdS(true)}>{row.mutuaId}</td>
                                        <td style={tdS(false)}><strong>{row.mutua}</strong></td>

                                        {/* Coste propios — solo lectura */}
                                        <td style={tdS(true)}>{fmt(row.gastoPersonal)}</td>
                                        <td style={tdS(true)}>{fmt(row.gastoCorrientes)}</td>
                                        <td style={tdS(true)}>{fmt(row.gastosFinancieros)}</td>
                                        <td style={tdS(true)}>{fmt(row.amortizacion)}</td>
                                        <td style={tdS(true, true, '#0d47a1')}>{fmt(row.totalCostePropios)}</td>

                                        {/* Artículo 25 — solo lectura */}
                                        <td style={tdS(true)}>{fmt(row.costeConciertos)}</td>
                                        <td style={tdS(true)}>{fmt(row.aplicacion2581)}</td>
                                        <td style={tdS(true)}>{fmt(row.aplicacion2582)}</td>
                                        <td style={tdS(true)}>{fmt(row.restoArt25)}</td>
                                        <td style={tdS(true, true, '#01579b')}>{fmt(row.totalArticulo25)}</td>

                                        {/* Otros conceptos — solo lectura */}
                                        <td style={tdS(true)}>{fmt(row.inversionNueva)}</td>
                                        <td style={tdS(true)}>{fmt(row.reposicion)}</td>
                                        <td style={tdS(true)}>{fmt(row.ingresosServicios)}</td>
                                        <td style={tdS(true, true, '#004d40')}>{fmt(row.totalOtrosConceptos)}</td>

                                        {/* Total general */}
                                        <td style={tdS(true, true, '#0d47a1')}>{fmt(row.totalGeneral)}</td>

                                        {/* Registros — contadores */}
                                        <td style={tdS(true)}>{row.propiosConf ?? 0}</td>
                                        <td style={tdS(true)}>{row.propiosNoConf ?? 0}</td>
                                        <td style={tdS(true)}>{row.concertConf ?? 0}</td>
                                        <td style={tdS(true)}>{row.concertNoConf ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* PIE */}
                <div style={{ padding: '10px 25px', fontSize: 11, color: '#888', borderTop: '1px solid #eee', display: 'flex', gap: 20 }}>
                    <span>Los datos se recalculan automáticamente cada vez que se abre esta pantalla.</span>
                    <span>Los registros (Conf./No Conf.) provienen de las vistas de validación del sistema.</span>
                </div>

            </div>
        </div>
    );
};

export default Descuadres;