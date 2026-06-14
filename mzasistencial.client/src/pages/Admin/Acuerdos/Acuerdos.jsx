import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import '../../../styles/FichaGlobal.css';
import './Acuerdos.css';
import { useLogError } from '../../../hooks/useLogError';

const API = '/api';

// ── Formateadores ─────────────────────────────────────────────────────────────
const fmtNum = (v) =>
    Math.round(Number(v) || 0).toLocaleString('es-ES');

const fmtEur = (v) =>
    (Number(v) || 0).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }) + ' €';

const Acuerdos = () => {
    const { t } = useTranslation();

    const logError = useLogError("Acuerdos");

    const [mutuas, setMutuas] = useState([]);
    const [anos, setAnos] = useState([]);
    const [mutuaSeleccionada, setMutuaSeleccionada] = useState('');
    const [anoSeleccionado, setAnoSeleccionado] = useState('');

    const [seccionMutua, setSeccionMutua] = useState(true);
    const [seccionProvincia, setSeccionProvincia] = useState(false);
    const [seccionTipoServicio, setSeccionTipoServicio] = useState(false);

    const [tabMutua, setTabMutua] = useState('oferta');
    const [tabProvincia, setTabProvincia] = useState('oferta');
    const [tabTipoServicio, setTabTipoServicio] = useState('oferta');

    const [datosMutuaOferta, setDatosMutuaOferta] = useState([]);
    const [datosMutuaDemanda, setDatosMutuaDemanda] = useState([]);
    const [datosProvinciaOferta, setDatosProvinciaOferta] = useState([]);
    const [datosProvinciaDemanda, setDatosProvinciaDemanda] = useState([]);
    const [datosTipoServicioOferta, setDatosTipoServicioOferta] = useState([]);
    const [datosTipoServicioDemanda, setDatosTipoServicioDemanda] = useState([]);

    useEffect(() => {
        fetch(`${API}/Mutuas`)
            .then(res => res.json())
            .then(data => setMutuas(data))
            .catch(err => logError("Error al cargar mutuas", err));

        fetch(`${API}/InformesAcuerdos`)
            .then(res => res.json())
            .then(data => {
                const anosUnicos = [...new Set(data.map(i => i.año))]
                    .filter(Boolean)
                    .sort((a, b) => b - a);
                setAnos(anosUnicos);
            })
            .catch(err => logError("Error al cargar años", err));
    }, []);

    useEffect(() => {
        if (!mutuaSeleccionada || !anoSeleccionado) return;
        const params = `mutuaId=${mutuaSeleccionada}&anio=${anoSeleccionado}`;

        fetch(`${API}/AcuerdosBI/mutuas/oferta?${params}`)
            .then(res => res.json()).then(setDatosMutuaOferta).catch(err => logError("Error al cargar datos de acuerdos (mutuas/oferta)", err));
        fetch(`${API}/AcuerdosBI/mutuas/demanda?${params}`)
            .then(res => res.json()).then(setDatosMutuaDemanda).catch(err => logError("Error al cargar datos de acuerdos (mutuas/demanda)", err));
        fetch(`${API}/AcuerdosBI/provincias/oferta?${params}`)
            .then(res => res.json()).then(setDatosProvinciaOferta).catch(err => logError("Error al cargar datos de acuerdos (provincias/oferta)", err));
        fetch(`${API}/AcuerdosBI/provincias/demanda?${params}`)
            .then(res => res.json()).then(setDatosProvinciaDemanda).catch(err => logError("Error al cargar datos de acuerdos (provincias/demanda)", err));
        fetch(`${API}/AcuerdosBI/tiposervicio/oferta?${params}`)
            .then(res => res.json()).then(setDatosTipoServicioOferta).catch(err => logError("Error al cargar datos de acuerdos (tiposervicio/oferta)", err));
        fetch(`${API}/AcuerdosBI/tiposervicio/demanda?${params}`)
            .then(res => res.json()).then(setDatosTipoServicioDemanda).catch(err => logError("Error al cargar datos de acuerdos (tiposervicio/demanda)", err));
    }, [mutuaSeleccionada, anoSeleccionado]);

    // ── Estilos pie de tabla ──────────────────────────────────────────────────
    const tfootTr = { fontWeight: 700, background: '#f0f4ff', borderTop: '2px solid #1a5fa8' };
    const tdTot = { textAlign: 'right', padding: '8px 6px' };
    const tdLbl = { padding: '8px 12px' };

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content">

                <div className="header-page">
                    <div className="title">{t('Acuerdos')}</div>
                </div>

                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', background: '#fafafa' }}>
                    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div className="ficha-field" style={{ minWidth: 220, maxWidth: 300 }}>
                            <label>Mutua</label>
                            <select value={mutuaSeleccionada} onChange={e => setMutuaSeleccionada(e.target.value)}>
                                <option value="">-- Selecciona una mutua --</option>
                                {mutuas.map(m => (
                                    <option key={m.numeroId} value={m.numeroId}>{m.mutua}</option>
                                ))}
                            </select>
                        </div>
                        <div className="ficha-field" style={{ minWidth: 120, maxWidth: 180 }}>
                            <label>Año</label>
                            <select value={anoSeleccionado} onChange={e => setAnoSeleccionado(e.target.value)}>
                                <option value="">-- Selecciona un año --</option>
                                {anos.map(ano => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="ficha-tab-content">

                    {/* ── SECCION MUTUA ──────────────────────────────────────── */}
                    <div className="acuerdos-seccion">
                        <div className="acuerdos-seccion-header" onClick={() => setSeccionMutua(!seccionMutua)}>
                            <span>Acuerdos Bilaterales o Multilaterales Mutua</span>
                            <span>{seccionMutua ? '−' : '+'}</span>
                        </div>
                        {seccionMutua && (
                            <div className="acuerdos-seccion-content">
                                <div className="ficha-tabs" style={{ padding: 0, marginBottom: 12 }}>
                                    <button className={`ficha-tab ${tabMutua === 'oferta' ? 'active' : ''}`} onClick={() => setTabMutua('oferta')}>Oferta</button>
                                    <button className={`ficha-tab ${tabMutua === 'demanda' ? 'active' : ''}`} onClick={() => setTabMutua('demanda')}>Demanda</button>
                                </div>
                                {(() => {
                                    const datos = tabMutua === 'oferta' ? datosMutuaOferta : datosMutuaDemanda;
                                    const totalNum = datos.reduce((s, r) => s + (Number(r.numServicios) || 0), 0);
                                    const totalEur = datos.reduce((s, r) => s + (Number(r.contraprestacionEconomica) || 0), 0);
                                    return (
                                        <table className="acuerdos-tabla">
                                            <thead>
                                                <tr>
                                                    <th>Num Mutua</th>
                                                    <th>Mutua {tabMutua === 'oferta' ? 'Demandante' : 'Ofertante'}</th>
                                                    <th style={{ textAlign: 'right' }}>Num Servicios</th>
                                                    <th style={{ textAlign: 'right' }}>Contraprestación Económica</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {datos.length === 0 ? (
                                                    <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999', padding: 16 }}>Sin datos para mostrar</td></tr>
                                                ) : datos.map((row, i) => (
                                                    <tr key={i}>
                                                        <td>{row.numMutua}</td>
                                                        <td>{row.mutuaNombre}</td>
                                                        <td style={{ textAlign: 'right' }}>{fmtNum(row.numServicios)}</td>
                                                        <td style={{ textAlign: 'right' }}>{fmtEur(row.contraprestacionEconomica)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {datos.length > 0 && (
                                                <tfoot>
                                                    <tr style={tfootTr}>
                                                        <td colSpan={2} style={tdLbl}>TOTAL</td>
                                                        <td style={tdTot}>{fmtNum(totalNum)}</td>
                                                        <td style={tdTot}>{fmtEur(totalEur)}</td>
                                                    </tr>
                                                </tfoot>
                                            )}
                                        </table>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    {/* ── SECCION PROVINCIA ──────────────────────────────────── */}
                    <div className="acuerdos-seccion">
                        <div className="acuerdos-seccion-header" onClick={() => setSeccionProvincia(!seccionProvincia)}>
                            <span>Acuerdos Bilaterales o Multilaterales Provincia</span>
                            <span>{seccionProvincia ? '−' : '+'}</span>
                        </div>
                        {seccionProvincia && (
                            <div className="acuerdos-seccion-content">
                                <div className="ficha-tabs" style={{ padding: 0, marginBottom: 12 }}>
                                    <button className={`ficha-tab ${tabProvincia === 'oferta' ? 'active' : ''}`} onClick={() => setTabProvincia('oferta')}>Oferta</button>
                                    <button className={`ficha-tab ${tabProvincia === 'demanda' ? 'active' : ''}`} onClick={() => setTabProvincia('demanda')}>Demanda</button>
                                </div>
                                {(() => {
                                    const datos = tabProvincia === 'oferta' ? datosProvinciaOferta : datosProvinciaDemanda;
                                    const isDem = tabProvincia === 'demanda';
                                    const totalNum = datos.reduce((s, r) => s + (Number(r.numServicios) || 0), 0);
                                    const totalEur = datos.reduce((s, r) => s + (Number(r.contraprestacionEconomica) || 0), 0);
                                    const totalNumT = datos.reduce((s, r) => s + (Number(r.numServiciosTerceros) || 0), 0);
                                    const totalEurT = datos.reduce((s, r) => s + (Number(r.contraprestacionEconomicaTerceros) || 0), 0);
                                    const cols = isDem ? 6 : 4;
                                    return (
                                        <table className="acuerdos-tabla">
                                            <thead>
                                                <tr>
                                                    <th>Num Provincia</th>
                                                    <th>Provincia</th>
                                                    <th style={{ textAlign: 'right' }}>Num Servicios</th>
                                                    <th style={{ textAlign: 'right' }}>Contraprestación Económica</th>
                                                    {isDem && <th style={{ textAlign: 'right' }}>Num Servicios Terceros</th>}
                                                    {isDem && <th style={{ textAlign: 'right' }}>Contraprestación Económica Terceros</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {datos.length === 0 ? (
                                                    <tr><td colSpan={cols} style={{ textAlign: 'center', color: '#999', padding: 16 }}>Sin datos para mostrar</td></tr>
                                                ) : datos.map((row, i) => (
                                                    <tr key={i}>
                                                        <td>{row.numProvincia}</td>
                                                        <td>{row.provincia}</td>
                                                        <td style={{ textAlign: 'right' }}>{fmtNum(row.numServicios)}</td>
                                                        <td style={{ textAlign: 'right' }}>{fmtEur(row.contraprestacionEconomica)}</td>
                                                        {isDem && <td style={{ textAlign: 'right' }}>{fmtNum(row.numServiciosTerceros)}</td>}
                                                        {isDem && <td style={{ textAlign: 'right' }}>{fmtEur(row.contraprestacionEconomicaTerceros)}</td>}
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {datos.length > 0 && (
                                                <tfoot>
                                                    <tr style={tfootTr}>
                                                        <td colSpan={2} style={tdLbl}>TOTAL</td>
                                                        <td style={tdTot}>{fmtNum(totalNum)}</td>
                                                        <td style={tdTot}>{fmtEur(totalEur)}</td>
                                                        {isDem && <td style={tdTot}>{fmtNum(totalNumT)}</td>}
                                                        {isDem && <td style={tdTot}>{fmtEur(totalEurT)}</td>}
                                                    </tr>
                                                </tfoot>
                                            )}
                                        </table>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    {/* ── SECCION TIPO SERVICIO ──────────────────────────────── */}
                    <div className="acuerdos-seccion">
                        <div className="acuerdos-seccion-header" onClick={() => setSeccionTipoServicio(!seccionTipoServicio)}>
                            <span>Acuerdos Bilaterales o Multilaterales Tipo de Servicio</span>
                            <span>{seccionTipoServicio ? '−' : '+'}</span>
                        </div>
                        {seccionTipoServicio && (
                            <div className="acuerdos-seccion-content">
                                <div className="ficha-tabs" style={{ padding: 0, marginBottom: 12 }}>
                                    <button className={`ficha-tab ${tabTipoServicio === 'oferta' ? 'active' : ''}`} onClick={() => setTabTipoServicio('oferta')}>Oferta</button>
                                    <button className={`ficha-tab ${tabTipoServicio === 'demanda' ? 'active' : ''}`} onClick={() => setTabTipoServicio('demanda')}>Demanda</button>
                                </div>
                                {(() => {
                                    const datos = tabTipoServicio === 'oferta' ? datosTipoServicioOferta : datosTipoServicioDemanda;
                                    const isDem = tabTipoServicio === 'demanda';
                                    const totalNum = datos.reduce((s, r) => s + (Number(r.numServicios) || 0), 0);
                                    const totalEur = datos.reduce((s, r) => s + (Number(r.contraprestacionEconomica) || 0), 0);
                                    const totalNumT = datos.reduce((s, r) => s + (Number(r.numServiciosTerceros) || 0), 0);
                                    const totalEurT = datos.reduce((s, r) => s + (Number(r.contraprestacionEconomicaTerceros) || 0), 0);
                                    const cols = isDem ? 6 : 4;
                                    return (
                                        <table className="acuerdos-tabla">
                                            <thead>
                                                <tr>
                                                    <th>Tipo de Servicio</th>
                                                    <th>Tipo Servicio</th>
                                                    <th style={{ textAlign: 'right' }}>Num Servicios</th>
                                                    <th style={{ textAlign: 'right' }}>Contraprestación Económica</th>
                                                    {isDem && <th style={{ textAlign: 'right' }}>Num Servicios Terceros</th>}
                                                    {isDem && <th style={{ textAlign: 'right' }}>Contraprestación Económica Terceros</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {datos.length === 0 ? (
                                                    <tr><td colSpan={cols} style={{ textAlign: 'center', color: '#999', padding: 16 }}>Sin datos para mostrar</td></tr>
                                                ) : datos.map((row, i) => (
                                                    <tr key={i}>
                                                        <td>{row.tipoServicio}</td>
                                                        <td>{row.tipoServicioNombre}</td>
                                                        <td style={{ textAlign: 'right' }}>{fmtNum(row.numServicios)}</td>
                                                        <td style={{ textAlign: 'right' }}>{fmtEur(row.contraprestacionEconomica)}</td>
                                                        {isDem && <td style={{ textAlign: 'right' }}>{fmtNum(row.numServiciosTerceros)}</td>}
                                                        {isDem && <td style={{ textAlign: 'right' }}>{fmtEur(row.contraprestacionEconomicaTerceros)}</td>}
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {datos.length > 0 && (
                                                <tfoot>
                                                    <tr style={tfootTr}>
                                                        <td colSpan={2} style={tdLbl}>TOTAL</td>
                                                        <td style={tdTot}>{fmtNum(totalNum)}</td>
                                                        <td style={tdTot}>{fmtEur(totalEur)}</td>
                                                        {isDem && <td style={tdTot}>{fmtNum(totalNumT)}</td>}
                                                        {isDem && <td style={tdTot}>{fmtEur(totalEurT)}</td>}
                                                    </tr>
                                                </tfoot>
                                            )}
                                        </table>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Acuerdos;