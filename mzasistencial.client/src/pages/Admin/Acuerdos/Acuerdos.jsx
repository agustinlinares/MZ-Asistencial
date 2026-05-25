import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import '../../../styles/FichaGlobal.css';
import './Acuerdos.css';

const API = '/api';

const Acuerdos = () => {
    const { t } = useTranslation();

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
            .catch(err => console.error('Error al cargar mutuas:', err));

        fetch(`${API}/InformesAcuerdos`)
            .then(res => res.json())
            .then(data => {
                const anosUnicos = [...new Set(data.map(i => i.año))]
                    .filter(Boolean)
                    .sort((a, b) => b - a);
                setAnos(anosUnicos);
            })
            .catch(err => console.error('Error al cargar anos:', err));
    }, []);

    useEffect(() => {
        if (!mutuaSeleccionada || !anoSeleccionado) return;
        const params = `mutuaId=${mutuaSeleccionada}&anio=${anoSeleccionado}`;

        fetch(`${API}/AcuerdosBI/mutuas/oferta?${params}`)
            .then(res => res.json()).then(setDatosMutuaOferta).catch(console.error);
        fetch(`${API}/AcuerdosBI/mutuas/demanda?${params}`)
            .then(res => res.json()).then(setDatosMutuaDemanda).catch(console.error);
        fetch(`${API}/AcuerdosBI/provincias/oferta?${params}`)
            .then(res => res.json()).then(setDatosProvinciaOferta).catch(console.error);
        fetch(`${API}/AcuerdosBI/provincias/demanda?${params}`)
            .then(res => res.json()).then(setDatosProvinciaDemanda).catch(console.error);
        fetch(`${API}/AcuerdosBI/tiposervicio/oferta?${params}`)
            .then(res => res.json()).then(setDatosTipoServicioOferta).catch(console.error);
        fetch(`${API}/AcuerdosBI/tiposervicio/demanda?${params}`)
            .then(res => res.json()).then(setDatosTipoServicioDemanda).catch(console.error);
    }, [mutuaSeleccionada, anoSeleccionado]);

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

                    {/* SECCION MUTUA */}
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
                                <table className="acuerdos-tabla">
                                    <thead>
                                        <tr>
                                            <th>Num Mutua</th>
                                            <th>Mutua {tabMutua === 'oferta' ? 'Demandante' : 'Ofertante'}</th>
                                            <th>Num Servicios</th>
                                            <th>Contraprestación Económica</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(tabMutua === 'oferta' ? datosMutuaOferta : datosMutuaDemanda).length === 0 ? (
                                            <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999', padding: 16 }}>Sin datos para mostrar</td></tr>
                                        ) : (
                                            (tabMutua === 'oferta' ? datosMutuaOferta : datosMutuaDemanda).map((row, i) => (
                                                <tr key={i}>
                                                    <td>{row.numMutua}</td>
                                                    <td>{row.mutuaNombre}</td>
                                                    <td>{row.numServicios}</td>
                                                    <td>{row.contraprestacionEconomica}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* SECCION PROVINCIA */}
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
                                <table className="acuerdos-tabla">
                                    <thead>
                                        <tr>
                                            <th>Num Provincia</th>
                                            <th>Provincia</th>
                                            <th>Num Servicios</th>
                                            <th>Contraprestación Económica</th>
                                            {tabProvincia === 'demanda' && <th>Num Servicios Terceros</th>}
                                            {tabProvincia === 'demanda' && <th>Contraprestación Económica Terceros</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(tabProvincia === 'oferta' ? datosProvinciaOferta : datosProvinciaDemanda).length === 0 ? (
                                            <tr><td colSpan={tabProvincia === 'oferta' ? 4 : 6} style={{ textAlign: 'center', color: '#999', padding: 16 }}>Sin datos para mostrar</td></tr>
                                        ) : (
                                            (tabProvincia === 'oferta' ? datosProvinciaOferta : datosProvinciaDemanda).map((row, i) => (
                                                <tr key={i}>
                                                    <td>{row.numProvincia}</td>
                                                    <td>{row.provincia}</td>
                                                    <td>{row.numServicios}</td>
                                                    <td>{row.contraprestacionEconomica}</td>
                                                    {tabProvincia === 'demanda' && <td>{row.numServiciosTerceros}</td>}
                                                    {tabProvincia === 'demanda' && <td>{row.contraprestacionEconomicaTerceros}</td>}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* SECCION TIPO SERVICIO */}
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
                                    const totalNumServicios = datos.reduce((s, r) => s + (r.numServicios || 0), 0);
                                    const totalContraprestacion = datos.reduce((s, r) => s + (r.contraprestacionEconomica || 0), 0);
                                    const totalNumServiciosTerceros = datos.reduce((s, r) => s + (r.numServiciosTerceros || 0), 0);
                                    const totalContraprestacionTerceros = datos.reduce((s, r) => s + (r.contraprestacionEconomicaTerceros || 0), 0);

                                    return (
                                        <table className="acuerdos-tabla">
                                            <thead>
                                                <tr>
                                                    <th>Tipo de Servicio</th>
                                                    <th>Tipo Servicio</th>
                                                    <th>Num Servicios</th>
                                                    <th>Contraprestación Económica</th>
                                                    {tabTipoServicio === 'demanda' && <th>Num Servicios Terceros</th>}
                                                    {tabTipoServicio === 'demanda' && <th>Contraprestación Económica Terceros</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {datos.length === 0 ? (
                                                    <tr><td colSpan={tabTipoServicio === 'oferta' ? 4 : 6} style={{ textAlign: 'center', color: '#999', padding: 16 }}>Sin datos para mostrar</td></tr>
                                                ) : (
                                                    datos.map((row, i) => (
                                                        <tr key={i}>
                                                            <td>{row.tipoServicio}</td>
                                                            <td>{row.tipoServicioNombre}</td>
                                                            <td style={{ textAlign: 'right' }}>{row.numServicios}</td>
                                                            <td style={{ textAlign: 'right' }}>{(row.contraprestacionEconomica || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
                                                            {tabTipoServicio === 'demanda' && <td style={{ textAlign: 'right' }}>{row.numServiciosTerceros}</td>}
                                                            {tabTipoServicio === 'demanda' && <td style={{ textAlign: 'right' }}>{(row.contraprestacionEconomicaTerceros || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>}
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                            {datos.length > 0 && (
                                                <tfoot>
                                                    <tr style={{ fontWeight: 700, background: '#f0f4ff', borderTop: '2px solid #1a5fa8' }}>
                                                        <td colSpan={2} style={{ padding: '8px 12px' }}>TOTAL</td>
                                                        <td style={{ textAlign: 'right', padding: '8px 6px' }}>{totalNumServicios}</td>
                                                        <td style={{ textAlign: 'right', padding: '8px 6px' }}>{totalContraprestacion.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
                                                        {tabTipoServicio === 'demanda' && <td style={{ textAlign: 'right', padding: '8px 6px' }}>{totalNumServiciosTerceros}</td>}
                                                        {tabTipoServicio === 'demanda' && <td style={{ textAlign: 'right', padding: '8px 6px' }}>{totalContraprestacionTerceros.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>}
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