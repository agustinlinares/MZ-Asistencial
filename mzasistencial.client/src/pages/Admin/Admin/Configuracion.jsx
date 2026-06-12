import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SelectBox from "devextreme-react/select-box";
import '../../../styles/FichaGlobal.css';

const API = '/api';

const hoy = () => new Date().toISOString().slice(0, 10);

const esBloqueadoHoy = (desde, hasta) => {
    const hoyStr = hoy();
    return desde && hasta && hoyStr >= desde && hoyStr <= hasta;
};

const TABS = ['General', 'Replicar la Disponibilidad de Oferta', 'Replicar Catálogo de Servicios'];

const Configuracion = () => {
    const { t } = useTranslation();

    const [tabActiva, setTabActiva] = useState(0);

    // ── TAB GENERAL ──────────────────────────────────────────
    const [form,      setForm]      = useState(null);
    const [original,  setOriginal]  = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [msg,       setMsg]       = useState(null);
    const [cargando,  setCargando]  = useState(true);

    // ── AÑOS Y MUTUAS ────────────────────────────────────────
    const [añosOrigen,  setAñosOrigen]  = useState([]);
    const [añosDestino, setAñosDestino] = useState([]);
    const [mutuas,      setMutuas]      = useState([]);

    // ── TAB DISPONIBILIDAD ───────────────────────────────────
    const [dispAnioOrigen,  setDispAnioOrigen]  = useState(null);
    const [dispAnioDestino, setDispAnioDestino] = useState(null);
    const [dispMutua,       setDispMutua]       = useState(null);
    const [dispMsg,         setDispMsg]         = useState(null);
    const [dispCargando,    setDispCargando]    = useState(false);

    // ── TAB CATÁLOGO ─────────────────────────────────────────
    const [catAnioOrigen,  setCatAnioOrigen]  = useState(null);
    const [catAnioDestino, setCatAnioDestino] = useState(null);
    const [catMutua,       setCatMutua]       = useState(null);
    const [catMsg,         setCatMsg]         = useState(null);
    const [catCargando,    setCatCargando]    = useState(false);

    useEffect(() => {
        setCargando(true);
        fetch(`${API}/ConfiguracionAdministracion`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data) { setForm(data); setOriginal(data); }
            })
            .catch(() => setMsg({ ok: false, text: 'Error al cargar la configuracion.' }))
            .finally(() => setCargando(false));

        fetch(`${API}/ConfiguracionAdministracion/años`)
            .then(r => r.ok ? r.json() : { aniosOrigen: [], aniosDestino: [] })
            .then(data => {
                setAñosOrigen(data.aniosOrigen ?? []);
                setAñosDestino(data.aniosDestino ?? []);
                if (data.aniosOrigen?.length > 0) {
                    setDispAnioOrigen(data.aniosOrigen[0]);
                    setCatAnioOrigen(data.aniosOrigen[0]);
                }
                if (data.aniosDestino?.length > 0) {
                    setDispAnioDestino(data.aniosDestino[0]);
                    setCatAnioDestino(data.aniosDestino[0]);
                }
            })
            .catch(() => {});

        fetch(`${API}/ConfiguracionAdministracion/mutuas`)
            .then(r => r.ok ? r.json() : [])
            .then(data => setMutuas(data))
            .catch(() => {});
    }, []);

    const set = (key) => (e) => {
        const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        setForm(f => ({ ...f, [key]: val }));
    };

    const haycambios = form && original && JSON.stringify(form) !== JSON.stringify(original);

    const handleGuardar = async () => {
        if (!form) return;
        setGuardando(true);
        setMsg(null);
        try {
            const user = JSON.parse(localStorage.getItem('UsuarioActual') || '{}');
            const body = { ...form, usuarioModificacionId: user?.usuarioId ?? null };
            const res = await fetch(`${API}/ConfiguracionAdministracion/${form.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'Error al guardar');
            }
            const updated = await res.json();
            setForm(updated);
            setOriginal(updated);
            setMsg({ ok: true, text: 'Configuracion guardada correctamente.' });
        } catch (err) {
            setMsg({ ok: false, text: err.message || 'Error al guardar.' });
        } finally {
            setGuardando(false);
            setTimeout(() => setMsg(null), 5000);
        }
    };

    const handleCancelar = () => {
        setForm(original);
        setMsg(null);
    };

    const handleReplicarDisponibilidad = async () => {
        if (!dispAnioOrigen || !dispAnioDestino || !dispMutua) {
            setDispMsg({ ok: false, text: 'Debes seleccionar año origen, año destino y mutua.' });
            return;
        }
        setDispCargando(true);
        setDispMsg(null);
        try {
            const res = await fetch(`${API}/ConfiguracionAdministracion/replicar-disponibilidad`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ anioOrigen: dispAnioOrigen, anioDestino: dispAnioDestino, mutuaId: dispMutua }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (res.status === 409) {
                    const confirmar = window.confirm(data.message || '¿Desea sustituir los datos existentes?');
                    if (confirmar) {
                        const res2 = await fetch(`${API}/ConfiguracionAdministracion/replicar-disponibilidad`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ anioOrigen: dispAnioOrigen, anioDestino: dispAnioDestino, mutuaId: dispMutua, forzar: true }),
                        });
                        const data2 = await res2.json().catch(() => ({}));
                        setDispMsg({ ok: res2.ok, text: data2.message || (res2.ok ? 'Replicado correctamente.' : 'Error al replicar.') });
                    }
                } else {
                    setDispMsg({ ok: false, text: data.message || 'Error al replicar.' });
                }
            } else {
                setDispMsg({ ok: true, text: data.message || 'Disponibilidad replicada correctamente.' });
            }
        } catch {
            setDispMsg({ ok: false, text: 'Error de conexión.' });
        } finally {
            setDispCargando(false);
        }
    };

    const handleReplicarCatalogo = async () => {
        if (!catAnioOrigen || !catAnioDestino || !catMutua) {
            setCatMsg({ ok: false, text: 'Debes seleccionar año origen, año destino y mutua.' });
            return;
        }
        setCatCargando(true);
        setCatMsg(null);
        try {
            const res = await fetch(`${API}/ConfiguracionAdministracion/replicar-catalogo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ anioOrigen: catAnioOrigen, anioDestino: catAnioDestino, mutuaId: catMutua }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (res.status === 409) {
                    const confirmar = window.confirm(data.message || '¿Desea sustituir los datos existentes?');
                    if (confirmar) {
                        const res2 = await fetch(`${API}/ConfiguracionAdministracion/replicar-catalogo`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ anioOrigen: catAnioOrigen, anioDestino: catAnioDestino, mutuaId: catMutua, forzar: true }),
                        });
                        const data2 = await res2.json().catch(() => ({}));
                        setCatMsg({ ok: res2.ok, text: data2.message || (res2.ok ? 'Replicado correctamente.' : 'Error al replicar.') });
                    }
                } else {
                    setCatMsg({ ok: false, text: data.message || 'Error al replicar.' });
                }
            } else {
                setCatMsg({ ok: true, text: data.message || 'Catálogo replicado correctamente.' });
            }
        } catch {
            setCatMsg({ ok: false, text: 'Error de conexión.' });
        } finally {
            setCatCargando(false);
        }
    };

    if (cargando) return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Cargando configuracion...</div>;
    if (!form)    return <div style={{ padding: 40, textAlign: 'center', color: '#c62828' }}>No se pudo cargar la configuracion.</div>;

    const bloqueadoHoy = esBloqueadoHoy(form.fechaBloqueoDesde, form.fechaBloqueoHasta);

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">

                {/* HEADER */}
                <div className="header-page">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="title">Ficha Configuracion Administracion</div>
                        {msg && (
                            <span style={{ fontSize: 13, color: msg.ok ? '#2e7d32' : '#c62828', fontWeight: 500 }}>
                                {msg.ok ? '✓' : '✗'} {msg.text}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {tabActiva === 0 && haycambios && (
                            <button onClick={handleCancelar} style={{ background: '#e0e0e0', color: '#333', border: 'none', borderRadius: 5, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                Cancelar
                            </button>
                        )}
                        {tabActiva === 0 && (
                            <button
                                onClick={handleGuardar}
                                disabled={guardando || !haycambios}
                                style={{ background: haycambios ? '#1976d2' : '#90caf9', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 20px', fontSize: 13, fontWeight: 600, cursor: haycambios ? 'pointer' : 'default' }}>
                                <i className="ri-save-line" style={{ marginRight: 6 }} />
                                {guardando ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        )}
                        {tabActiva !== 0 && (
                            <button onClick={() => setTabActiva(0)} style={{ background: '#e0e0e0', color: '#333', border: 'none', borderRadius: 5, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                ✗ Cancelar
                            </button>
                        )}
                    </div>
                </div>

                {/* TABS */}
                <div style={{ display: 'flex', borderBottom: '2px solid #e0e0e0', padding: '0 24px', background: '#fafafa' }}>
                    {TABS.map((tab, i) => (
                        <button
                            key={i}
                            onClick={() => setTabActiva(i)}
                            style={{
                                padding: '10px 22px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: tabActiva === i ? 700 : 400,
                                color: tabActiva === i ? '#1976d2' : '#555',
                                borderBottom: tabActiva === i ? '3px solid #1976d2' : '3px solid transparent',
                                marginBottom: -2,
                                transition: 'all 0.15s',
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* TAB GENERAL */}
                {tabActiva === 0 && (
                    <div style={{ padding: '28px 32px', maxWidth: 820 }}>
                        <div style={{ marginBottom: 36 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <i className="ri-lock-line" style={{ fontSize: 20, color: '#1976d2' }} />
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a2a4a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Periodo de Bloqueo de Disponibilidad
                                </h3>
                                <span style={{
                                    padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                                    background: bloqueadoHoy ? '#ffebee' : '#e8f5e9',
                                    color: bloqueadoHoy ? '#c62828' : '#2e7d32',
                                }}>
                                    {bloqueadoHoy ? 'BLOQUEADO AHORA' : 'Sin bloqueo activo'}
                                </span>
                            </div>
                            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
                                Durante este periodo, los usuarios no podran modificar la disponibilidad mensual de especialidades en Centros Propios.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                                <div className="ficha-field">
                                    <label>Fecha de inicio del bloqueo</label>
                                    <input type="date" value={form.fechaBloqueoDesde || ''} onChange={set('fechaBloqueoDesde')} />
                                </div>
                                <div className="ficha-field">
                                    <label>Fecha de fin del bloqueo</label>
                                    <input type="date" value={form.fechaBloqueoHasta || ''} onChange={set('fechaBloqueoHasta')} />
                                </div>
                            </div>
                            {form.fechaBloqueoDesde && form.fechaBloqueoHasta && form.fechaBloqueoDesde > form.fechaBloqueoHasta && (
                                <p style={{ color: '#c62828', fontSize: 12, marginTop: 8 }}>
                                    La fecha de inicio debe ser anterior a la fecha de fin.
                                </p>
                            )}
                        </div>

                        <hr style={{ border: 'none', borderTop: '1.5px solid #edf2f7', marginBottom: 32 }} />

                        <div style={{ marginBottom: 36 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <i className="ri-service-line" style={{ fontSize: 20, color: '#7b1fa2' }} />
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a2a4a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Parametros de Servicios
                                </h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                                <div className="ficha-field">
                                    <label>Minimo de Servicios</label>
                                    <input type="number" min={0} value={form.minimoServicios ?? 0} onChange={set('minimoServicios')} />
                                </div>
                                <div className="ficha-field">
                                    <label>Ratio de Servicios</label>
                                    <input type="number" min={0} step="0.01" value={form.ratioServicios ?? 0} onChange={set('ratioServicios')} />
                                </div>
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1.5px solid #edf2f7', marginBottom: 32 }} />

                        <div style={{ marginBottom: 36 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <i className="ri-time-line" style={{ fontSize: 20, color: '#e65100' }} />
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a2a4a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Plazos (dias)
                                </h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                                <div className="ficha-field">
                                    <label>Plazo respuesta demandas anuales</label>
                                    <input type="number" min={0} value={form.plazoRespuestaDemandasAnuales ?? 0} onChange={set('plazoRespuestaDemandasAnuales')} />
                                </div>
                                <div className="ficha-field">
                                    <label>Plazo respuesta demanda anual tras aviso</label>
                                    <input type="number" min={0} value={form.plazoRespuestaDemandaAnualTrasAviso ?? 0} onChange={set('plazoRespuestaDemandaAnualTrasAviso')} />
                                </div>
                                <div className="ficha-field">
                                    <label>Plazo contestacion respuesta recibida</label>
                                    <input type="number" min={0} value={form.plazoContestacionRespuestaRecibida ?? 0} onChange={set('plazoContestacionRespuestaRecibida')} />
                                </div>
                                <div className="ficha-field">
                                    <label>Plazo ejecucion procesos automaticos</label>
                                    <input type="number" min={0} value={form.plazoEjecucionProcesosAutomaticos ?? 0} onChange={set('plazoEjecucionProcesosAutomaticos')} />
                                </div>
                            </div>
                        </div>

                        {form.fechaModificacion && (
                            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                                Ultima modificacion: {new Date(form.fechaModificacion).toLocaleString('es-ES')}
                            </p>
                        )}
                    </div>
                )}

                {/* TAB DISPONIBILIDAD */}
                {tabActiva === 1 && (
                    <div style={{ padding: '28px 32px' }}>
                        <div style={{ background: '#f5f7fa', border: '1px solid #e0e0e0', borderRadius: 6, padding: '12px 18px', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: '#475569' }}>
                                Replica de disponibilidad de especialidades médicas y servicios sanitarios disponibles
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 40px', maxWidth: 900 }}>
                            <div className="ficha-field">
                                <label>Año del que replicar la Disponibilidad</label>
                                <SelectBox
                                    items={añosOrigen}
                                    value={dispAnioOrigen}
                                    onValueChanged={e => setDispAnioOrigen(e.value)}
                                    placeholder="Selecciona un año"
                                    width="100%"
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Año en que replicar la Disponibilidad</label>
                                <SelectBox
                                    items={añosDestino}
                                    value={dispAnioDestino}
                                    onValueChanged={e => setDispAnioDestino(e.value)}
                                    placeholder="Selecciona un año"
                                    width="100%"
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Mutua</label>
                                <SelectBox
                                    dataSource={mutuas}
                                    displayExpr="mutua"
                                    valueExpr="mutuaId"
                                    value={dispMutua}
                                    onValueChanged={e => setDispMutua(e.value)}
                                    placeholder="Selecciona una mutua"
                                    width="100%"
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                {dispMsg && (
                                    <span style={{ fontSize: 13, color: dispMsg.ok ? '#2e7d32' : '#c62828', fontWeight: 500, marginRight: 16 }}>
                                        {dispMsg.ok ? '✓' : '✗'} {dispMsg.text}
                                    </span>
                                )}
                                <button
                                    onClick={handleReplicarDisponibilidad}
                                    disabled={dispCargando}
                                    style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 5, padding: '8px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                    {dispCargando ? 'Replicando...' : 'Replicar Disponibilidad'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB CATÁLOGO */}
                {tabActiva === 2 && (
                    <div style={{ padding: '28px 32px' }}>
                        <div style={{ background: '#f5f7fa', border: '1px solid #e0e0e0', borderRadius: 6, padding: '12px 18px', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: '#475569' }}>
                                Réplica del Catálogo de Servicios de los centros de una mutua en específico
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 40px', maxWidth: 900 }}>
                            <div className="ficha-field">
                                <label>Año del que replicar el Catálogo</label>
                                <SelectBox
                                    items={añosOrigen}
                                    value={catAnioOrigen}
                                    onValueChanged={e => setCatAnioOrigen(e.value)}
                                    placeholder="Selecciona un año"
                                    width="100%"
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Año en que replicar el Catálogo</label>
                                <SelectBox
                                    items={añosDestino}
                                    value={catAnioDestino}
                                    onValueChanged={e => setCatAnioDestino(e.value)}
                                    placeholder="Selecciona un año"
                                    width="100%"
                                />
                            </div>
                            <div className="ficha-field">
                                <label>Mutua</label>
                                <SelectBox
                                    dataSource={mutuas}
                                    displayExpr="mutua"
                                    valueExpr="mutuaId"
                                    value={catMutua}
                                    onValueChanged={e => setCatMutua(e.value)}
                                    placeholder="Selecciona una mutua"
                                    width="100%"
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                {catMsg && (
                                    <span style={{ fontSize: 13, color: catMsg.ok ? '#2e7d32' : '#c62828', fontWeight: 500, marginRight: 16 }}>
                                        {catMsg.ok ? '✓' : '✗'} {catMsg.text}
                                    </span>
                                )}
                                <button
                                    onClick={handleReplicarCatalogo}
                                    disabled={catCargando}
                                    style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 5, padding: '8px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                    {catCargando ? 'Replicando...' : 'Replicar Catálogo'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Configuracion;