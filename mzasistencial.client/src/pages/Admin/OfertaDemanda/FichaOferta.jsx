import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import notify from 'devextreme/ui/notify';
import '../../../styles/FichaGlobal.css';

const API = '/api';
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_LABEL = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MESES_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const Campo = ({ label, value }) => (
    <div className="ficha-field">
        <label>{label}</label>
        <input type="text" readOnly value={value || ''} style={{ background: '#f5f5f5' }} />
    </div>
);

const TabBtn = ({ label, activa, onClick }) => (
    <button onClick={onClick} style={{
        padding: '8px 24px', border: 'none', cursor: 'pointer',
        background: activa ? '#1a5fa8' : '#f0f4ff',
        color: activa ? '#fff' : '#1a5fa8',
        fontWeight: 600, fontSize: 13,
        borderRadius: '4px 4px 0 0', marginRight: 4,
    }}>{label}</button>
);

// ─── Tabla HTML responsive ────────────────────────────────────────────────────
const TablaFilas = ({ filas, onRowClick }) => (
    <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, tableLayout: 'fixed' }}>
            <colgroup>
                <col style={{ width: '16%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '5%' }} />
                {MESES.map((_, i) => <col key={i} style={{ width: '3.5%' }} />)}
                <col style={{ width: '5%' }} />
            </colgroup>
            <thead>
                <tr style={{ background: '#f0f4ff', borderBottom: '2px solid #1a5fa8' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#1a5fa8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Mutua Ofertante</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#1a5fa8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Centro</th>
                    <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 700, color: '#1a5fa8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Estado</th>
                    <th style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 700, color: '#1a5fa8' }}>Pet.</th>
                    {MESES_LABEL.map(m => (
                        <th key={m} style={{ padding: '8px 2px', textAlign: 'center', fontWeight: 700, color: '#1a5fa8' }}>{m}</th>
                    ))}
                    <th style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 700, color: '#1a5fa8' }}>Total</th>
                </tr>
            </thead>
            <tbody>
                {filas.length === 0 ? (
                    <tr><td colSpan={17} style={{ textAlign: 'center', padding: 20, color: '#999' }}>Sin peticiones</td></tr>
                ) : filas.map((row, i) => (
                    <tr
                        key={row.rowKey || i}
                        onClick={() => onRowClick(row)}
                        style={{ cursor: 'pointer', background: i % 2 === 0 ? '#fff' : '#f9fbff', borderBottom: '1px solid #e8eef8' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#f9fbff'}
                    >
                        <td style={{ padding: '7px 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.mutuaOferta || '-'}</td>
                        <td style={{ padding: '7px 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.centro || '-'}</td>
                        <td style={{ padding: '7px 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.estado || '-'}</td>
                        <td style={{ padding: '7px 4px', textAlign: 'center' }}>{row.demandaId || '-'}</td>
                        {MESES.map(m => (
                            <td key={m} style={{ padding: '7px 2px', textAlign: 'center' }}>{row[m] ?? 0}</td>
                        ))}
                        <td style={{ padding: '7px 4px', textAlign: 'center', fontWeight: 700 }}>{row.total ?? 0}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const FichaOferta = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [tabActiva, setTabActiva] = useState('anuales');
    const [listadoAnual, setListadoAnual] = useState([]);
    const [listadoInd, setListadoInd] = useState([]);
    const [cargandoLista, setCargandoLista] = useState(false);

    useEffect(() => {
        fetch(`${API}/ListaOfertas/${id}`)
            .then(r => { if (!r.ok) throw new Error('No encontrado'); return r.json(); })
            .then(data => setDatos(data))
            .catch(err => setError(err.message))
            .finally(() => setCargando(false));
    }, [id]);

    useEffect(() => {
        if (!datos) return;
        let activo = true;
        setCargandoLista(true);
        const filtroBase = { año: datos.año, vistaAgrupada: false };

        Promise.all([
            fetch(`${API}/ListaOfertas/lista`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...filtroBase, tipo: 'Anuales' }),
            }).then(r => r.json()),
            fetch(`${API}/ListaOfertas/lista`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...filtroBase, tipo: 'Individuales' }),
            }).then(r => r.json()),
        ])
            .then(([anuales, individuales]) => {
                if (!activo) return;
                const misma = (row) =>
                    row.especialidad === datos.especialidad &&
                    row.servicio === datos.servicio;
                setListadoAnual(anuales.filter(r => misma(r)));
                setListadoInd(individuales.filter(r => misma(r)));
            })
            .catch(console.error)
            .finally(() => { if (activo) setCargandoLista(false); });

        return () => { activo = false; };
    }, [datos]);

    if (cargando) return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Cargando ficha...</div>;
    if (error) return <div style={{ padding: 40, textAlign: 'center', color: '#c62828' }}>Error: {error}</div>;
    if (!datos) return null;

    const todasFilas = [...listadoAnual, ...listadoInd];
    const filasAsig = todasFilas.filter(r => r.tipoLinea === 'Asignación');
    const filasDem = todasFilas.filter(r => r.tipoLinea === 'Demanda');
    const sumarMes = (filas, mes) => filas.reduce((s, r) => s + (r[mes] || 0), 0);
    const totAsig = MESES.map(m => sumarMes(filasAsig, m));
    const totDem = MESES.map(m => sumarMes(filasDem, m));
    const totalAsig = totAsig.reduce((a, b) => a + b, 0);
    const totalDem = totDem.reduce((a, b) => a + b, 0);

    const filasGrid = tabActiva === 'anuales'
        ? listadoAnual.filter(r => r.tipoLinea === 'Demanda')
        : listadoInd.filter(r => r.tipoLinea === 'Demanda');

    const handleRowClick = (row) => {
        if (row?.ofertaId) {
            navigate(`/admin/OfertaDemanda/GestionOferta/detalle/${row.ofertaId}`);
        } else {
            notify('Esta demanda aún no tiene oferta asignada', 'warning', 2000);
        }
    };

    return (
        <div
            className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0"
            style={{ overflowY: 'auto', height: '100%' }}
        >
            <div className="file-box" style={{ height: 'auto', minHeight: 0 }}>

                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">Ficha Gestión Oferta</span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-secondary" onClick={() => navigate(-1)}>
                            <i className="ri-close-line" style={{ marginRight: 6 }} />Salir
                        </button>
                    </div>
                </div>

                <div style={{ padding: 24 }}>

                    {/* CAMPOS DE AGRUPACIÓN */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                        <Campo label="Mutua Ofertante" value={datos.mutuaOferta} />
                        <Campo label="Centro" value={datos.centro} />
                        <Campo label="Especialidad" value={datos.especialidad} />
                        <Campo label="Servicio" value={datos.servicio} />
                    </div>

                    {/* TABLA TOTALES */}
                    <div style={{ overflowX: 'auto', marginBottom: 24 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr style={{ background: '#1a5fa8', color: '#fff' }}>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', width: 160 }}></th>
                                    {MESES_FULL.map(m => (
                                        <th key={m} style={{ padding: '8px 6px', textAlign: 'center', minWidth: 55 }}>{m}</th>
                                    ))}
                                    <th style={{ padding: '8px 6px', textAlign: 'center', width: 65 }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: '#dbeafe' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1a5fa8' }}>ASIGNACION TOTAL</td>
                                    {totAsig.map((v, i) => (
                                        <td key={i} style={{ padding: '4px 6px', textAlign: 'center' }}>
                                            <div style={{ background: '#1a2a4a', color: '#fff', borderRadius: 3, padding: '2px 4px', textAlign: 'center', fontSize: 11 }}>
                                                {v}
                                            </div>
                                        </td>
                                    ))}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700 }}>{totalAsig}</td>
                                </tr>
                                <tr style={{ background: '#eff6ff' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#555' }}>DEMANDA TOTAL</td>
                                    {totDem.map((v, i) => (
                                        <td key={i} style={{ padding: '8px 6px', textAlign: 'center', color: '#555' }}>{v}</td>
                                    ))}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#555' }}>{totalDem}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* PESTAÑAS */}
                    <div style={{ borderBottom: '2px solid #1a5fa8', display: 'flex', marginBottom: 0 }}>
                        <TabBtn label="Anual" activa={tabActiva === 'anuales'} onClick={() => setTabActiva('anuales')} />
                        <TabBtn label="Individual" activa={tabActiva === 'individuales'} onClick={() => setTabActiva('individuales')} />
                    </div>

                    <div style={{ border: '1px solid #1a5fa8', borderTop: 'none', marginBottom: 24 }}>
                        {cargandoLista ? (
                            <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>Cargando...</div>
                        ) : (
                            <TablaFilas filas={filasGrid} onRowClick={handleRowClick} />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FichaOferta;