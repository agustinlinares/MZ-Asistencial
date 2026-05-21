import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import '../../../styles/FichaGlobal.css';

const API = '/api';

const hoy = () => new Date().toISOString().slice(0, 10);

const esBloqueadoHoy = (desde, hasta) => {
    const hoyStr = hoy();
    return desde && hasta && hoyStr >= desde && hoyStr <= hasta;
};

const Configuracion = () => {
    const { t } = useTranslation();

    const [form,      setForm]      = useState(null);
    const [original,  setOriginal]  = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [msg,       setMsg]       = useState(null);
    const [cargando,  setCargando]  = useState(true);

    useEffect(() => {
        setCargando(true);
        fetch(`${API}/ConfiguracionAdministracion`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data) { setForm(data); setOriginal(data); }
            })
            .catch(() => setMsg({ ok: false, text: 'Error al cargar la configuracion.' }))
            .finally(() => setCargando(false));
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
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body),
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

    if (cargando) return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Cargando configuracion...</div>;
    if (!form)    return <div style={{ padding: 40, textAlign: 'center', color: '#c62828' }}>No se pudo cargar la configuracion.</div>;

    const bloqueadoHoy = esBloqueadoHoy(form.fechaBloqueoDesde, form.fechaBloqueoHasta);

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">

                <div className="header-page">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="title">Configuracion de Administracion</div>
                        {msg && (
                            <span style={{ fontSize: 13, color: msg.ok ? '#2e7d32' : '#c62828', fontWeight: 500 }}>
                                {msg.ok ? '✓' : '✗'} {msg.text}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {haycambios && (
                            <button onClick={handleCancelar} style={{ background: '#e0e0e0', color: '#333', border: 'none', borderRadius: 5, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                Cancelar
                            </button>
                        )}
                        <button
                            onClick={handleGuardar}
                            disabled={guardando || !haycambios}
                            style={{ background: haycambios ? '#1976d2' : '#90caf9', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 20px', fontSize: 13, fontWeight: 600, cursor: haycambios ? 'pointer' : 'default' }}>
                            <i className="ri-save-line" style={{ marginRight: 6 }} />
                            {guardando ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </div>

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
            </div>
        </div>
    );
};

export default Configuracion;