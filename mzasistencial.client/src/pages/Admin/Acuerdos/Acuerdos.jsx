import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import './Acuerdos.css';

const API = 'https://localhost:7132/api';

const Acuerdos = () => {
    const { t } = useTranslation();

    // Filtros
    const [mutuas, setMutuas] = useState([]);
    const [años, setAños] = useState([]);
    const [mutuaSeleccionada, setMutuaSeleccionada] = useState('');
    const [añoSeleccionado, setAñoSeleccionado] = useState('');

    // Secciones colapsables
    const [seccionMutua, setSeccionMutua] = useState(false);
    const [seccionProvincia, setSeccionProvincia] = useState(false);
    const [seccionTipoServicio, setSeccionTipoServicio] = useState(false);

    // Pestañas activas
    const [tabMutua, setTabMutua] = useState('oferta');
    const [tabProvincia, setTabProvincia] = useState('oferta');
    const [tabTipoServicio, setTabTipoServicio] = useState('oferta');

    // Datos
    const [datosMutuaOferta, setDatosMutuaOferta] = useState([]);
    const [datosMutuaDemanda, setDatosMutuaDemanda] = useState([]);
    const [datosProvinciaOferta, setDatosProvinciaOferta] = useState([]);
    const [datosProvinciaDemanda, setDatosProvinciaDemanda] = useState([]);
    const [datosTipoServicioOferta, setDatosTipoServicioOferta] = useState([]);
    const [datosTipoServicioDemanda, setDatosTipoServicioDemanda] = useState([]);

    // Carga inicial de filtros
    useEffect(() => {
        fetch(`${API}/Mutuas`)
            .then(res => res.json())
            .then(data => setMutuas(data))
            .catch(err => console.error('Error al cargar mutuas:', err));

        fetch(`${API}/InformesAcuerdos`)
            .then(res => res.json())
            .then(data => {
                const añosUnicos = [...new Set(data.map(i => i.año))]
                    .filter(Boolean)
                    .sort((a, b) => b - a);
                setAños(añosUnicos);
            })
            .catch(err => console.error('Error al cargar años:', err));
    }, []);

    // Carga de datos cuando cambian los filtros
    useEffect(() => {
        if (!mutuaSeleccionada || !añoSeleccionado) return;

        const params = `mutuaId=${mutuaSeleccionada}&anio=${añoSeleccionado}`;

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

    }, [mutuaSeleccionada, añoSeleccionado]);

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 m-0 p-0" style={{ overflowY: 'auto', height: '100%' }}>

                {/* FILTROS */}
                <div style={{ width: '100%', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <div className="title">{t('Acuerdos')}</div>
                    <div className="filtros-box">
                        <div className="filtros-title">{t('Filtros')}</div>
                        <div className="filtros-content">
                            <div className="filtro-item">
                                <label>Mutua</label>
                                <select className="filtro-select" value={mutuaSeleccionada} onChange={e => setMutuaSeleccionada(e.target.value)}>
                                    <option value="">-- Selecciona una mutua --</option>
                                    {mutuas.map(m => (
                                        <option key={m.nº} value={m.nº}>
                                            {m.mutua}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filtro-item">
                                <label>Año</label>
                                <select className="filtro-select" value={añoSeleccionado} onChange={e => setAñoSeleccionado(e.target.value)}>
                                    <option value="">-- Selecciona un año --</option>
                                    {años.map(año => (
                                        <option key={año} value={año}>{año}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN MUTUA */}
                <div className="seccion-box">
                    <div className="seccion-header" onClick={() => setSeccionMutua(!seccionMutua)}>
                        <span>Acuerdos Bilaterales o Multilaterales Mutua</span>
                        <span>{seccionMutua ? '−' : '+'}</span>
                    </div>
                    {seccionMutua && (
                        <div className="seccion-content">
                            <div className="tabs">
                                <button className={tabMutua === 'oferta' ? 'tab activo' : 'tab'} onClick={() => setTabMutua('oferta')}>Oferta</button>
                                <button className={tabMutua === 'demanda' ? 'tab activo' : 'tab'} onClick={() => setTabMutua('demanda')}>Demanda</button>
                            </div>
                            <table className="tabla-datos">
                                <thead>
                                    <tr>
                                        <th>Num Mutua</th>
                                        <th>Mutua {tabMutua === 'oferta' ? 'Demandante' : 'Ofertante'}</th>
                                        <th>Num Servicios</th>
                                        <th>Contraprestacion Economica</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(tabMutua === 'oferta' ? datosMutuaOferta : datosMutuaDemanda).map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.numMutua}</td>
                                            <td>{row.mutuaNombre}</td>
                                            <td>{row.numServicios}</td>
                                            <td>{row.contraprestacionEconomica}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* SECCIÓN PROVINCIA */}
                <div className="seccion-box">
                    <div className="seccion-header" onClick={() => setSeccionProvincia(!seccionProvincia)}>
                        <span>Acuerdos Bilaterales o Multilaterales Provincia</span>
                        <span>{seccionProvincia ? '−' : '+'}</span>
                    </div>
                    {seccionProvincia && (
                        <div className="seccion-content">
                            <div className="tabs">
                                <button className={tabProvincia === 'oferta' ? 'tab activo' : 'tab'} onClick={() => setTabProvincia('oferta')}>Oferta</button>
                                <button className={tabProvincia === 'demanda' ? 'tab activo' : 'tab'} onClick={() => setTabProvincia('demanda')}>Demanda</button>
                            </div>
                            <table className="tabla-datos">
                                <thead>
                                    <tr>
                                        <th>Num Provincia</th>
                                        <th>Provincia</th>
                                        <th>Num Servicios</th>
                                        <th>Contraprestacion Economica</th>
                                        <th>Num Servicios Terceros</th>
                                        <th>Contraprestacion Economica Terceros</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(tabProvincia === 'oferta' ? datosProvinciaOferta : datosProvinciaDemanda).map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.numProvincia}</td>
                                            <td>{row.provincia}</td>
                                            <td>{row.numServicios}</td>
                                            <td>{row.contraprestacionEconomica}</td>
                                            <td>{row.numServiciosTerceros}</td>
                                            <td>{row.contraprestacionEconomicaTerceros}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* SECCIÓN TIPO SERVICIO */}
                <div className="seccion-box">
                    <div className="seccion-header" onClick={() => setSeccionTipoServicio(!seccionTipoServicio)}>
                        <span>Acuerdos Bilaterales o Multilaterales Tipo de Servicio</span>
                        <span>{seccionTipoServicio ? '−' : '+'}</span>
                    </div>
                    {seccionTipoServicio && (
                        <div className="seccion-content">
                            <div className="tabs">
                                <button className={tabTipoServicio === 'oferta' ? 'tab activo' : 'tab'} onClick={() => setTabTipoServicio('oferta')}>Oferta</button>
                                <button className={tabTipoServicio === 'demanda' ? 'tab activo' : 'tab'} onClick={() => setTabTipoServicio('demanda')}>Demanda</button>
                            </div>
                            <table className="tabla-datos">
                                <thead>
                                    <tr>
                                        <th>Tipo de Servicio</th>
                                        <th>Tipo Servicio</th>
                                        <th>Num Servicios</th>
                                        <th>Contraprestacion Economica</th>
                                        {tabTipoServicio === 'demanda' && <th>Num Servicios Terceros</th>}
                                        {tabTipoServicio === 'demanda' && <th>Contraprestacion Economica Terceros</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(tabTipoServicio === 'oferta' ? datosTipoServicioOferta : datosTipoServicioDemanda).map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.tipoServicio}</td>
                                            <td>{row.tipoServicioNombre}</td>
                                            <td>{row.numServicios}</td>
                                            <td>{row.contraprestacionEconomica}</td>
                                            {tabTipoServicio === 'demanda' && <td>{row.numServiciosTerceros}</td>}
                                            {tabTipoServicio === 'demanda' && <td>{row.contraprestacionEconomicaTerceros}</td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </React.Fragment>
    );
};

export default Acuerdos;