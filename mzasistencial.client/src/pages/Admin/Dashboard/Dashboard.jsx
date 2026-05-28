import React, { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./Dashboard.css";
import "../../../styles/FichaGlobal.css";

const API = "/api/Dashboard";

const YEAR_NOW = new Date().getFullYear();
const YEARS    = Array.from({ length: 10 }, (_, i) => YEAR_NOW - i);

// Colores para los gráficos de tarta
const COLORS_PRESUPUESTO  = ["#1976d2", "#42a5f5", "#90caf9", "#bbdefb"];
const COLORS_LIQUIDACION  = ["#2e7d32", "#66bb6a", "#a5d6a7", "#c8e6c9"];

const fmt = (v) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v ?? 0);

const pct = (l, i) => {
    if (!i || i === 0) return "—";
    const d = ((l - i) / Math.abs(i)) * 100;
    return (d >= 0 ? "+" : "") + d.toFixed(1) + "%";
};

// ─── Componente tabla I / L / D ───────────────────────────────────────────────
const TablaBloque = ({ titulo, icono, filas }) => (
    <div className="db-bloque">
        <div className="db-bloque-header">
            <i className={`ri-${icono} db-bloque-icon`}></i>
            <span>{titulo}</span>
        </div>
        <div className="db-tabla-wrap">
            <table className="db-tabla">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>I — Presupuesto</th>
                        <th>L — Liquidación</th>
                        <th>D — Diferencia</th>
                    </tr>
                </thead>
                <tbody>
                    {filas.map((f, idx) => {
                        const diff = (f.l ?? 0) - (f.i ?? 0);
                        return (
                            <tr key={idx}>
                                <td>{f.titulo}</td>
                                <td className="num">{fmt(f.i)}</td>
                                <td className="num">{fmt(f.l)}</td>
                                <td className={`num diff ${diff < 0 ? "neg" : diff > 0 ? "pos" : ""}`}>
                                    {fmt(diff)}
                                    <span className="pct">{pct(f.l, f.i)}</span>
                                </td>
                            </tr>
                        );
                    })}
                    {/* Fila de totales */}
                    <tr className="total-row">
                        <td>TOTAL</td>
                        <td className="num">{fmt(filas.reduce((s, f) => s + (f.i ?? 0), 0))}</td>
                        <td className="num">{fmt(filas.reduce((s, f) => s + (f.l ?? 0), 0))}</td>
                        <td className={`num diff ${filas.reduce((s, f) => s + (f.l ?? 0) - (f.i ?? 0), 0) < 0 ? "neg" : "pos"}`}>
                            {fmt(filas.reduce((s, f) => s + (f.l ?? 0) - (f.i ?? 0), 0))}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

// ─── Componente gráfico de tarta ──────────────────────────────────────────────
const GraficoTarta = ({ titulo, icono, datosPresupuesto, datosLiquidacion }) => {
    const [modo, setModo] = useState("presupuesto");
    const datos  = modo === "presupuesto" ? datosPresupuesto : datosLiquidacion;
    const colores = modo === "presupuesto" ? COLORS_PRESUPUESTO : COLORS_LIQUIDACION;
    const total  = datos.reduce((s, d) => s + (d.value ?? 0), 0);

    return (
        <div className="db-grafico-card">
            <div className="db-grafico-header">
                <div className="db-grafico-title">
                    <i className={`ri-${icono}`}></i>
                    <span>{titulo}</span>
                </div>
                <div className="db-toggle">
                    <button
                        className={modo === "presupuesto" ? "active" : ""}
                        onClick={() => setModo("presupuesto")}
                    >
                        Presupuesto
                    </button>
                    <button
                        className={modo === "liquidacion" ? "active" : ""}
                        onClick={() => setModo("liquidacion")}
                    >
                        Liquidación
                    </button>
                </div>
            </div>
            <div className="db-grafico-total">Total: {fmt(total)}</div>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={datos}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                    >
                        {datos.map((_, i) => (
                            <Cell key={i} fill={colores[i % colores.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// ─── Componente principal Dashboard ──────────────────────────────────────────
const Dashboard = () => {
    const [anio,    setAnio]    = useState(YEAR_NOW);
    const [mutuaId, setMutuaId] = useState(0);
    const [mutuas,  setMutuas]  = useState([]);
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    // Cargar lista de mutuas
    useEffect(() => {
        fetch("/api/Mutuas")
            .then(r => r.json())
            .then(d => setMutuas(d))
            .catch(() => {});
    }, []);

    // Cargar datos del dashboard
    const cargar = useCallback(() => {
        setLoading(true);
        setError(null);
        fetch(`${API}?anio=${anio}&mutuaId=${mutuaId}`)
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(d => setData(d))
            .catch(() => setError("Error al cargar los datos del dashboard."))
            .finally(() => setLoading(false));
    }, [anio, mutuaId]);

    useEffect(() => { cargar(); }, [cargar]);

    // Construir filas para cada bloque
    const buildFilas = (bloque) => {
        if (!bloque) return [];
        const { presupuesto = [], liquidacion = [] } = bloque;
        return presupuesto.map((p, i) => ({
            titulo: p.titulo,
            i: p.respuesta,
            l: liquidacion[i]?.respuesta ?? 0,
        }));
    };

    // Construir datos para gráfico de tarta
    const buildPie = (items) =>
        (items ?? []).map(it => ({ name: it.titulo, value: it.respuesta ?? 0 }));

    const bloques = data ? [
        {
            key: "centrosPropios",
            titulo: "Centros Propios",
            icono: "hospital-line",
            filas: buildFilas(data.centrosPropios),
            pieI: buildPie(data.centrosPropios?.presupuesto),
            pieL: buildPie(data.centrosPropios?.liquidacion),
        },
        {
            key: "conciertos",
            titulo: "Conciertos",
            icono: "shake-hands-line",
            filas: buildFilas(data.conciertos),
            pieI: buildPie(data.conciertos?.presupuesto),
            pieL: buildPie(data.conciertos?.liquidacion),
        },
        {
            key: "otrosConceptos",
            titulo: "Otros Conceptos",
            icono: "file-list-3-line",
            filas: buildFilas(data.otrosConceptos),
            pieI: buildPie(data.otrosConceptos?.presupuesto),
            pieL: buildPie(data.otrosConceptos?.liquidacion),
        },
    ] : [];

    return (
        <div className="db-container">
            {/* HEADER */}
            <div className="header-page">
                <div className="title">Dashboard</div>
                <div className="db-filtros">
                    <select
                        value={anio}
                        onChange={e => setAnio(Number(e.target.value))}
                        className="db-select"
                    >
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select
                        value={mutuaId}
                        onChange={e => setMutuaId(Number(e.target.value))}
                        className="db-select"
                    >
                        <option value={0}>Todas las mutuas</option>
                        {mutuas.map(m => (
                            <option key={m.mutuaId ?? m.id} value={m.mutuaId ?? m.id}>
                                {m.nombre ?? m.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* CONTENIDO */}
            <div className="db-content">
                {loading && <div className="db-loading"><i className="ri-loader-4-line spin"></i> Cargando…</div>}
                {error   && <div className="db-error">{error}</div>}

                {!loading && !error && data && (
                    <>
                        {/* GRÁFICOS DE TARTA — ahora arriba */}
                        <div className="db-section-title">
                            <i className="ri-pie-chart-line"></i> Distribución por Bloque
                        </div>
                        <div className="db-graficos">
                            {bloques.map(b => (
                                <GraficoTarta
                                    key={b.key}
                                    titulo={b.titulo}
                                    icono={b.icono}
                                    datosPresupuesto={b.pieI}
                                    datosLiquidacion={b.pieL}
                                />
                            ))}
                        </div>

                        {/* TABLAS COMPARATIVAS — ahora abajo */}
                        <div className="db-section-title" style={{ marginTop: 32 }}>
                            <i className="ri-table-line"></i> Comparativa Presupuesto / Liquidación
                        </div>
                        <div className="db-tablas">
                            {bloques.map(b => (
                                <TablaBloque
                                    key={b.key}
                                    titulo={b.titulo}
                                    icono={b.icono}
                                    filas={b.filas}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
