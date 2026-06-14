import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "./Centros.css";
import { useLogError } from '../../../hooks/useLogError';

const API_URL = "/api/Icg06Hos";

// ─── Valor por defecto para un bloque de fila ────────────────────────────────
const filaVacia = () => ({
    pacIngresados: null,
    estancias: null,
    primConsProg: null,
    primConsProgVideo: null,
    primConsNoProg: null,
    primConsNoProgVideo: null,
    consSuc: null,
    consSucVideo: null,
    sesRehab: null,
    consEnf: null,
    diagRm: null,
    diagEco: null,
    diagTac: null,
    diagRadio: null,
    interQuir: null,
    otrasPruebas: null,
    estBiom: null,
    persUrgNoIngr: null,
});

// ─── Cabeceras de columnas ───────────────────────────────────────────────────
const COLS_BLQ1 = [
    { key: "pacIngresados",      label: "Pacientes Ingresados" },
    { key: "estancias",          label: "Estancias Causadas" },
    { key: "primConsProg",       label: "Primeras consultas (Program.)" },
    { key: "primConsProgVideo",  label: "Primeras consultas (Program.) Videocons." },
    { key: "primConsNoProg",     label: "Primeras consultas (No Program.)" },
    { key: "primConsNoProgVideo",label: "Primeras consultas (No Program.) Videocons." },
    { key: "consSuc",            label: "Consultas Sucesivas" },
    { key: "consSucVideo",       label: "Consultas Sucesivas Videocons." },
    { key: "sesRehab",           label: "Sesiones de Rehabilitación" },
    { key: "consEnf",            label: "Consultas de Enfermería" },
];

const COLS_BLQ2 = [
    { key: "diagRm",        label: "Diagnósticos por la imagen (Resson. Magnética)" },
    { key: "diagEco",       label: "Diagnósticos por la imagen (Ecografía)" },
    { key: "diagTac",       label: "Diagnósticos por la imagen (TAC)" },
    { key: "diagRadio",     label: "Diagnósticos por la imagen (Radiografías)" },
    { key: "interQuir",     label: "Intervenciones Quirúrgicas" },
    { key: "otrasPruebas",  label: "Otras Pruebas Practicadas" },
    { key: "estBiom",       label: "Estudios Biomecánicos" },
    { key: "persUrgNoIngr", label: "Pers.Atend. Urgenc. No Ingres." },
];

const FILAS = [
    { id: "mutuas",  label: "De otras Mutuas de A.T. y E.P." },
    { id: "egss",    label: "De E. G. de la S.S. y otras Adm. Públicas" },
    { id: "otros",   label: "Otros" },
];

// ─── Mapeo API → estado local ────────────────────────────────────────────────
function apiToState(d) {
    return {
        idIcg:    d.idIcg,
        año:      d.año,
        centroId: d.centroId,
        mutuas: {
            pacIngresados:       d.pitrmutHos,
            estancias:           d.esttrmutHos,
            primConsProg:        d.primConsHosProg,
            primConsProgVideo:   d.primConsHosProgVideo,
            primConsNoProg:      d.primConsHosNoProg,
            primConsNoProgVideo: d.primConsHosNoProgVideo,
            consSuc:             d.conssucHos,
            consSucVideo:        d.conssucHosVideo,
            sesRehab:            d.sesrehabtrmutHos,
            consEnf:             d.consEnfHos,
            diagRm:              d.pradtrmutHosRm,
            diagEco:             d.pradtrmutHosEco,
            diagTac:             d.pradtrmutHosTac,
            diagRadio:           d.pradtrmutHosRadio,
            interQuir:           d.iquirtrmutHos,
            otrasPruebas:        d.oppracttrmutHos,
            estBiom:             d.pruBiomHos,
            persUrgNoIngr:       d.paurnointrmutHos,
        },
        egss: {
            pacIngresados:       d.pitrmutArt82Hos,
            estancias:           d.esttrmutArt82Hos,
            primConsProg:        d.primConsArt82HosProg,
            primConsProgVideo:   d.primConsArt82HosProgVideo,
            primConsNoProg:      d.primConsArt82HosNoProg,
            primConsNoProgVideo: d.primConsArt82HosNoProgVideo,
            consSuc:             d.conssucArt82Hos,
            consSucVideo:        d.conssucArt82HosVideo,
            sesRehab:            d.srehabtrmutArt82Hos,
            consEnf:             d.consEnfArt82Hos,
            diagRm:              d.prmydtrmutArt82HosRm,
            diagEco:             d.prmydtrmutArt82HosEco,
            diagTac:             d.prmydtrmutArt82HosTac,
            diagRadio:           d.prmydtrmutArt82HosRadio,
            interQuir:           d.iquirtrmutArt82Hos,
            otrasPruebas:        d.opptrmutArt82Hos,
            estBiom:             d.prueBiomArt82Hos,
            persUrgNoIngr:       d.paurgNoIngrArt82Hos,
        },
        otros: {
            pacIngresados:       d.piotrmutArt12Hos,
            estancias:           d.estotrmutArt12Hos,
            primConsProg:        d.primConsotrmutArt12HosProg,
            primConsProgVideo:   d.primConsotrmutArt12HosProgVideo,
            primConsNoProg:      d.primConsotrmutArt12HosNoProg,
            primConsNoProgVideo: d.primConsotrmutArt12HosNoProgVideo,
            consSuc:             d.conssucotrmutArt12Hos,
            consSucVideo:        d.conssucotrmutArt12HosVideo,
            sesRehab:            d.srehabotrmutArt12Hos,
            consEnf:             d.consEnfotrmutArt12Hos,
            diagRm:              d.pradotrmutArt12HosRm,
            diagEco:             d.pradotrmutArt12HosEco,
            diagTac:             d.pradotrmutArt12HosTac,
            diagRadio:           d.pradotrmutArt12HosRadio,
            interQuir:           d.iquirotrmutArt12Hos,
            otrasPruebas:        d.oppotrmutArt12Hos,
            estBiom:             d.pruBiomotrmutArt12Hos,
            persUrgNoIngr:       d.paurniotrmutArt12Hos,
        },
    };
}

// ─── Mapeo estado local → API ────────────────────────────────────────────────
function stateToApi(s) {
    const m = s.mutuas;
    const g = s.egss;
    const o = s.otros;
    return {
        idIcg:    s.idIcg,
        año:      s.año,
        centroId: s.centroId,
        // Bloque 1 — Otras Mutuas
        pitrmutHos:             m.pacIngresados,
        esttrmutHos:            m.estancias,
        primConsHosProg:        m.primConsProg,
        primConsHosProgVideo:   m.primConsProgVideo,
        primConsHosNoProg:      m.primConsNoProg,
        primConsHosNoProgVideo: m.primConsNoProgVideo,
        conssucHos:             m.consSuc,
        conssucHosVideo:        m.consSucVideo,
        sesrehabtrmutHos:       m.sesRehab,
        consEnfHos:             m.consEnf,
        // Bloque 2 — Otras Mutuas
        pradtrmutHosRm:    m.diagRm,
        pradtrmutHosEco:   m.diagEco,
        pradtrmutHosTac:   m.diagTac,
        pradtrmutHosRadio: m.diagRadio,
        iquirtrmutHos:     m.interQuir,
        oppracttrmutHos:   m.otrasPruebas,
        pruBiomHos:        m.estBiom,
        paurnointrmutHos:  m.persUrgNoIngr,
        // Bloque 1 — EG SS
        pitrmutArt82Hos:             g.pacIngresados,
        esttrmutArt82Hos:            g.estancias,
        primConsArt82HosProg:        g.primConsProg,
        primConsArt82HosProgVideo:   g.primConsProgVideo,
        primConsArt82HosNoProg:      g.primConsNoProg,
        primConsArt82HosNoProgVideo: g.primConsNoProgVideo,
        conssucArt82Hos:             g.consSuc,
        conssucArt82HosVideo:        g.consSucVideo,
        srehabtrmutArt82Hos:         g.sesRehab,
        consEnfArt82Hos:             g.consEnf,
        // Bloque 2 — EG SS
        prmydtrmutArt82HosRm:    g.diagRm,
        prmydtrmutArt82HosEco:   g.diagEco,
        prmydtrmutArt82HosTac:   g.diagTac,
        prmydtrmutArt82HosRadio: g.diagRadio,
        iquirtrmutArt82Hos:      g.interQuir,
        opptrmutArt82Hos:        g.otrasPruebas,
        prueBiomArt82Hos:        g.estBiom,
        paurgNoIngrArt82Hos:     g.persUrgNoIngr,
        // Bloque 1 — Otros
        piotrmutArt12Hos:                o.pacIngresados,
        estotrmutArt12Hos:               o.estancias,
        primConsotrmutArt12HosProg:      o.primConsProg,
        primConsotrmutArt12HosProgVideo: o.primConsProgVideo,
        primConsotrmutArt12HosNoProg:    o.primConsNoProg,
        primConsotrmutArt12HosNoProgVideo: o.primConsNoProgVideo,
        conssucotrmutArt12Hos:           o.consSuc,
        conssucotrmutArt12HosVideo:      o.consSucVideo,
        srehabotrmutArt12Hos:            o.sesRehab,
        consEnfotrmutArt12Hos:           o.consEnf,
        // Bloque 2 — Otros
        pradotrmutArt12HosRm:    o.diagRm,
        pradotrmutArt12HosEco:   o.diagEco,
        pradotrmutArt12HosTac:   o.diagTac,
        pradotrmutArt12HosRadio: o.diagRadio,
        iquirotrmutArt12Hos:     o.interQuir,
        oppotrmutArt12Hos:       o.otrasPruebas,
        pruBiomotrmutArt12Hos:   o.estBiom,
        paurniotrmutArt12Hos:    o.persUrgNoIngr,
    };
}

// ─── Estilos inline (misma línea visual que FichaCliente.css) ────────────────
const st = {
    wrap: { fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 13, padding: "16px 20px" },
    toolbar: { display: "flex", gap: 8, marginBottom: 14, alignItems: "center" },
    filtro: { display: "flex", alignItems: "center", gap: 6 },
    filtroLabel: { fontSize: 12, color: "#555" },
    filtroInput: {
        border: "1px solid #d0d0d0", borderRadius: 3, padding: "4px 8px",
        fontSize: 12.5, height: 28, outline: "none", width: 80,
    },
    btn: (color) => ({
        border: "none", borderRadius: 4, padding: "5px 18px",
        fontSize: 12.5, fontFamily: "inherit", cursor: "pointer",
        fontWeight: 500, background: color, color: "#fff", transition: "background 0.15s",
    }),
    status: (ok) => ({
        fontSize: 12, color: ok ? "#2e7d32" : "#c62828", marginLeft: 8,
    }),
    bloque: {
        background: "#fafafa", border: "1px solid #e0e0e0",
        borderRadius: 4, marginBottom: 16, overflow: "auto",
    },
    bloqueTitle: {
        padding: "8px 14px", fontSize: 12.5, fontWeight: 600,
        color: "#1976d2", borderBottom: "1px solid #e0e0e0", background: "#f0f4ff",
    },
    table: { borderCollapse: "collapse", width: "100%", minWidth: 900 },
    thRow: { background: "#f5f5f5" },
    th: {
        border: "1px solid #e0e0e0", padding: "6px 10px",
        fontSize: 11.5, fontWeight: 600, color: "#444",
        whiteSpace: "nowrap", textAlign: "center",
    },
    thLabel: {
        border: "1px solid #e0e0e0", padding: "6px 10px",
        fontSize: 11.5, fontWeight: 600, color: "#444",
        textAlign: "left", minWidth: 220,
    },
    td: {
        border: "1px solid #e0e0e0", padding: "3px 6px",
        textAlign: "center", background: "#fff",
    },
    tdLabel: {
        border: "1px solid #e0e0e0", padding: "5px 10px",
        fontSize: 12.5, color: "#333", background: "#fff", whiteSpace: "nowrap",
    },
    input: {
        border: "none", borderBottom: "1px solid #bbb",
        width: 70, textAlign: "right", fontSize: 12.5,
        fontFamily: "inherit", outline: "none", background: "transparent",
        padding: "2px 4px",
    },
};

// ─── Componente principal ────────────────────────────────────────────────────
const ActuacionesSustentadasH = ({ centroId: centroIdProp, año: añoProp }) => {
    const { t } = useTranslation();

    const [centroId, setCentroId] = useState(centroIdProp ?? "");
    const [año,      setAño]      = useState(añoProp      ?? new Date().getFullYear());
    const [datos,    setDatos]    = useState(null);
    const [loading,  setLoading]  = useState(false);
    const [saving,   setSaving]   = useState(false);
    const [msg,      setMsg]      = useState(null); // { ok, text }

    const logError = useLogError("Actuaciones sustentadas");

    // ── Carga ──────────────────────────────────────────────────────────────
    const cargar = useCallback(async () => {
        if (!centroId || !año) return;
        setLoading(true);
        setMsg(null);
        try {
            const res = await fetch(`${API_URL}?centroId=${centroId}&año=${año}`);
            if (!res.ok) throw new Error("No encontrado");
            const json = await res.json();
            setDatos(apiToState(json));
        } catch {
            logError(`Fallo al cargar actuaciones para Centro: ${centroId}, Año: ${año}`, error);
            setMsg({ ok: false, text: "No se encontraron datos para ese centro/año." });
            setDatos(null);
        } finally {
            setLoading(false);
        }
    }, [centroId, año, logError]);

    useEffect(() => {
        if (centroIdProp) cargar();
    }, [centroIdProp, cargar]);

    // ── Guardar ────────────────────────────────────────────────────────────
    const guardar = async () => {
        if (!datos) return;
        setSaving(true);
        setMsg(null);
        try {
            const res = await fetch(`${API_URL}/${datos.idIcg}`, {
                method:  "PUT",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(stateToApi(datos)),
            });
            if (!res.ok) throw new Error();
            setMsg({ ok: true, text: "Guardado correctamente." });
        } catch {
            logError(`Fallo al guardar actuaciones para ICG ID: ${datos?.idIcg}`, error);
            setMsg({ ok: false, text: "Error al guardar. Inténtalo de nuevo." });
        } finally {
            setSaving(false);
        }
    };

    // ── Cambio de campo ────────────────────────────────────────────────────
    const handleChange = (fila, campo, valor) => {
        setDatos(prev => ({
            ...prev,
            [fila]: { ...prev[fila], [campo]: valor === "" ? null : Number(valor) },
        }));
    };

    // ── Render tabla ───────────────────────────────────────────────────────
    const renderTabla = (cols, titulo) => (
        <div style={st.bloque}>
            <div style={st.bloqueTitle}>{titulo}</div>
            <div style={{ overflowX: "auto" }}>
                <table style={st.table}>
                    <thead>
                        <tr style={st.thRow}>
                            <th style={st.thLabel}></th>
                            {cols.map(c => (
                                <th key={c.key} style={st.th}>{c.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {FILAS.map(fila => (
                            <tr key={fila.id}>
                                <td style={st.tdLabel}>{fila.label}</td>
                                {cols.map(col => (
                                    <td key={col.key} style={st.td}>
                                        <input
                                            type="number"
                                            min="0"
                                            style={st.input}
                                            value={datos?.[fila.id]?.[col.key] ?? ""}
                                            onChange={e => handleChange(fila.id, col.key, e.target.value)}
                                            disabled={!datos}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={st.wrap}>
            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            <div style={st.toolbar}>
                <div style={st.filtro}>
                    <label style={st.filtroLabel}>Centro ID</label>
                    <input
                        style={st.filtroInput}
                        type="number"
                        value={centroId}
                        onChange={e => setCentroId(e.target.value)}
                    />
                </div>
                <div style={st.filtro}>
                    <label style={st.filtroLabel}>Año</label>
                    <input
                        style={st.filtroInput}
                        type="number"
                        value={año}
                        onChange={e => setAño(e.target.value)}
                    />
                </div>
                <button
                    style={st.btn("#1976d2")}
                    onClick={cargar}
                    disabled={loading || !centroId || !año}
                >
                    {loading ? "Cargando…" : "Cargar"}
                </button>
                {datos && (
                    <button
                        style={st.btn("#2e7d32")}
                        onClick={guardar}
                        disabled={saving}
                    >
                        {saving ? "Guardando…" : "Guardar"}
                    </button>
                )}
                {msg && (
                    <span style={st.status(msg.ok)}>{msg.text}</span>
                )}
            </div>

            {/* ── Tablas ──────────────────────────────────────────────────── */}
            {renderTabla(COLS_BLQ1, "Hospitalización y Consultas")}
            {renderTabla(COLS_BLQ2, "Diagnóstico e Intervenciones")}
        </div>
    );
};

export default ActuacionesSustentadasH;
