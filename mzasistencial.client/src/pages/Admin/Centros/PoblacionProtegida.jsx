import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "./Centros.css";
import { useLogError } from '../../../hooks/useLogError';

const API_URL = "/api/Icg06PoblacionProtegida";

// ─── Mapeo API → estado local ────────────────────────────────────────────────
function apiToState(d) {
    return {
        idIcg:    d.idIcg,
        año:      d.año,
        centroId: d.centroId,
        // A efectos administrativos
        pobpr25kmAd:    d.pobpr25kmAd,
        pobpr50kmAd:    d.pobpr50kmAd,
        pobprmas50Ad:   d.pobprmas50Ad,
        // Limítrofes administrativos
        obs25kmAd:      d.obs25kmAd    ?? "",
        obs50kmAd:      d.obs50kmAd    ?? "",
        obsmas50kmAd:   d.obsmas50kmAd ?? "",
        // A efectos sanitarios CP
        pobpr25kmCp:    d.pobpr25kmCp,
        pobpr50kmCp:    d.pobpr50kmCp,
        pobprmas50Cp:   d.pobprmas50Cp,
        // A efectos sanitarios ITCC
        pobpr25kmItcc:  d.pobpr25kmItcc,
        pobpr50kmItcc:  d.pobpr50kmItcc,
        pobprmas50Itcc: d.pobprmas50Itcc,
        // Limítrofes sanitarios
        obs25km:        d.obs25km    ?? "",
        obs50km:        d.obs50km    ?? "",
        obsmas50km:     d.obsmas50km ?? "",
    };
}

function stateToApi(s) {
    return {
        idIcg:    s.idIcg,
        año:      s.año,
        centroId: s.centroId,
        pobpr25kmAd:    s.pobpr25kmAd,
        pobpr50kmAd:    s.pobpr50kmAd,
        pobprmas50Ad:   s.pobprmas50Ad,
        obs25kmAd:      s.obs25kmAd    || null,
        obs50kmAd:      s.obs50kmAd    || null,
        obsmas50kmAd:   s.obsmas50kmAd || null,
        pobpr25kmCp:    s.pobpr25kmCp,
        pobpr50kmCp:    s.pobpr50kmCp,
        pobprmas50Cp:   s.pobprmas50Cp,
        pobpr25kmItcc:  s.pobpr25kmItcc,
        pobpr50kmItcc:  s.pobpr50kmItcc,
        pobprmas50Itcc: s.pobprmas50Itcc,
        obs25km:        s.obs25km    || null,
        obs50km:        s.obs50km    || null,
        obsmas50km:     s.obsmas50km || null,
    };
}

// ─── Helper: suma 3 valores decimales ────────────────────────────────────────
const sumar = (...vals) => vals.reduce((acc, v) => acc + (parseFloat(v) || 0), 0).toFixed(2);

// ─── Estilos ─────────────────────────────────────────────────────────────────
const st = {
    wrap:         { fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 13, padding: "16px 20px" },
    toolbar:      { display: "flex", gap: 8, marginBottom: 16, alignItems: "center" },
    filtro:       { display: "flex", alignItems: "center", gap: 6 },
    filtroLabel:  { fontSize: 12, color: "#555" },
    filtroInput:  { border: "1px solid #d0d0d0", borderRadius: 3, padding: "4px 8px", fontSize: 12.5, height: 28, outline: "none", width: 80 },
    btn: (c) =>   ({ border: "none", borderRadius: 4, padding: "5px 18px", fontSize: 12.5, fontFamily: "inherit", cursor: "pointer", fontWeight: 500, background: c, color: "#fff" }),
    status: (ok) =>({ fontSize: 12, color: ok ? "#2e7d32" : "#c62828", marginLeft: 8 }),

    seccion:      { border: "1px solid #e0e0e0", borderRadius: 4, marginBottom: 16, overflow: "hidden" },
    seccionTitle: { padding: "7px 14px", fontSize: 12.5, fontWeight: 600, color: "#1976d2", background: "#e8f4fd", borderBottom: "1px solid #c8e3f7" },
    seccionBody:  { padding: "18px 20px", background: "#fff" },

    grid4:        { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px 24px" },
    grid3:        { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px 24px" },

    field:        { display: "flex", flexDirection: "column", gap: 4 },
    label:        { fontSize: 11.5, color: "#555", fontWeight: 500 },
    input:        { border: "none", borderBottom: "1px solid #aaa", padding: "4px 2px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "transparent", width: "100%", color: "#212121" },
    inputTotal:   { border: "none", borderBottom: "1px solid #aaa", padding: "4px 2px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "transparent", width: "100%", color: "#1976d2", fontWeight: 600 },
};

// ─── Campo numérico reutilizable ──────────────────────────────────────────────
const CampoNum = ({ label, value, onChange, disabled }) => (
    <div style={st.field}>
        <label style={st.label}>{label}</label>
        <input
            type="number" step="0.01" style={st.input}
            value={value ?? ""}
            onChange={e => onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
            disabled={disabled}
            onFocus={e => (e.target.style.borderBottomColor = "#1976d2")}
            onBlur={e => (e.target.style.borderBottomColor = "#aaa")}
        />
    </div>
);

// ─── Campo texto reutilizable ─────────────────────────────────────────────────
const CampoTxt = ({ label, value, onChange, disabled }) => (
    <div style={st.field}>
        <label style={st.label}>{label}</label>
        <input
            type="text" style={st.input}
            value={value ?? ""}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            onFocus={e => (e.target.style.borderBottomColor = "#1976d2")}
            onBlur={e => (e.target.style.borderBottomColor = "#aaa")}
        />
    </div>
);

// ─── Campo total (solo lectura, calculado) ────────────────────────────────────
const CampoTotal = ({ label, value }) => (
    <div style={st.field}>
        <label style={st.label}>{label}</label>
        <input type="text" style={st.inputTotal} value={value} readOnly />
    </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const PoblacionProtegida = ({ centroId: centroIdProp, año: añoProp }) => {
    const { t } = useTranslation();

    const [centroId, setCentroId] = useState(centroIdProp ?? "");
    const [año,      setAño]      = useState(añoProp      ?? new Date().getFullYear());
    const [datos,    setDatos]    = useState(null);
    const [loading,  setLoading]  = useState(false);
    const [saving,   setSaving]   = useState(false);
    const [msg,      setMsg]      = useState(null);

    const logError = useLogError("Población protegida");

    const cargar = useCallback(async () => {
        if (!centroId || !año) return;
        setLoading(true); setMsg(null);
        try {
            const res = await fetch(`${API_URL}?centroId=${centroId}&año=${año}`);
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
            setDatos(apiToState(await res.json()));
        } catch {
            logError(`Fallo al cargar población protegida para Centro: ${centroId}, Año: ${año}`, error);
            setMsg({ ok: false, text: "No se encontraron datos para ese centro/año." });
            setDatos(null);
        } finally { setLoading(false); }
    }, [centroId, año]);

    useEffect(() => { if (centroIdProp) cargar(); }, [centroIdProp, cargar]);

    const guardar = async () => {
        if (!datos) return;
        setSaving(true); setMsg(null);
        try {
            const res = await fetch(`${API_URL}/${datos.idIcg}`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stateToApi(datos)),
            });
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
            setMsg({ ok: true, text: "Guardado correctamente." });
        } catch {
            logError(`Fallo al guardar población protegida para ICG ID: ${datos?.idIcg}`, error);
            setMsg({ ok: false, text: "Error al guardar. Inténtalo de nuevo." });
        } finally { setSaving(false); }
    };

    const set = (campo, valor) => setDatos(prev => ({ ...prev, [campo]: valor }));
    const dis = !datos;

    return (
        <div style={st.wrap}>
            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            <div style={st.toolbar}>
                <div style={st.filtro}>
                    <label style={st.filtroLabel}>Centro ID</label>
                    <input style={st.filtroInput} type="number" value={centroId} onChange={e => setCentroId(e.target.value)} />
                </div>
                <div style={st.filtro}>
                    <label style={st.filtroLabel}>Año</label>
                    <input style={st.filtroInput} type="number" value={año} onChange={e => setAño(e.target.value)} />
                </div>
                <button style={st.btn("#1976d2")} onClick={cargar} disabled={loading || !centroId || !año}>
                    {loading ? "Cargando…" : "Cargar"}
                </button>
                {datos && (
                    <button style={st.btn("#2e7d32")} onClick={guardar} disabled={saving}>
                        {saving ? "Guardando…" : "Guardar"}
                    </button>
                )}
                {msg && <span style={st.status(msg.ok)}>{msg.text}</span>}
            </div>

            {/* ── Sección 1: A efectos administrativos ────────────────────── */}
            <div style={st.seccion}>
                <div style={st.seccionTitle}>A efectos administrativos</div>
                <div style={st.seccionBody}>
                    <div style={st.grid4}>
                        <CampoNum label="En un radio de 25 km"       value={datos?.pobpr25kmAd}  onChange={v => set("pobpr25kmAd", v)}  disabled={dis} />
                        <CampoNum label="En un radio de 50 km"       value={datos?.pobpr50kmAd}  onChange={v => set("pobpr50kmAd", v)}  disabled={dis} />
                        <CampoNum label="En un radio de más de 50 km" value={datos?.pobprmas50Ad} onChange={v => set("pobprmas50Ad", v)} disabled={dis} />
                        <CampoTotal
                            label="Total población protegida"
                            value={sumar(datos?.pobpr25kmAd, datos?.pobpr50kmAd, datos?.pobprmas50Ad)}
                        />
                    </div>
                </div>
            </div>

            {/* ── Sección 2: Poblaciones limítrofes (administrativos) ──────── */}
            <div style={st.seccion}>
                <div style={st.seccionTitle}>Poblaciones limítrofes</div>
                <div style={st.seccionBody}>
                    <div style={st.grid3}>
                        <CampoTxt label="En un radio de 25 km"        value={datos?.obs25kmAd}    onChange={v => set("obs25kmAd", v)}    disabled={dis} />
                        <CampoTxt label="En un radio de 50 km"        value={datos?.obs50kmAd}    onChange={v => set("obs50kmAd", v)}    disabled={dis} />
                        <CampoTxt label="En un radio de más de 50 km" value={datos?.obsmas50kmAd} onChange={v => set("obsmas50kmAd", v)} disabled={dis} />
                    </div>
                </div>
            </div>

            {/* ── Sección 3: A efectos sanitarios. Por conting. profesionales  */}
            <div style={st.seccion}>
                <div style={st.seccionTitle}>A efectos sanitarios. Por conting. profesionales</div>
                <div style={st.seccionBody}>
                    <div style={st.grid4}>
                        <CampoNum label="En un radio de 25 km"        value={datos?.pobpr25kmCp}   onChange={v => set("pobpr25kmCp", v)}   disabled={dis} />
                        <CampoNum label="En un radio de 50 km"        value={datos?.pobpr50kmCp}   onChange={v => set("pobpr50kmCp", v)}   disabled={dis} />
                        <CampoNum label="En un radio de más de 50 km" value={datos?.pobprmas50Cp}  onChange={v => set("pobprmas50Cp", v)}  disabled={dis} />
                        <CampoTotal
                            label="Total población protegida"
                            value={sumar(datos?.pobpr25kmCp, datos?.pobpr50kmCp, datos?.pobprmas50Cp)}
                        />
                    </div>
                </div>
            </div>

            {/* ── Sección 4: A efectos sanitarios. Por IT conting. comunes ─── */}
            <div style={st.seccion}>
                <div style={st.seccionTitle}>A efectos sanitarios. Por IT conting. comunes</div>
                <div style={st.seccionBody}>
                    <div style={st.grid4}>
                        <CampoNum label="En un radio de 25 km"        value={datos?.pobpr25kmItcc}   onChange={v => set("pobpr25kmItcc", v)}   disabled={dis} />
                        <CampoNum label="En un radio de 50 km"        value={datos?.pobpr50kmItcc}   onChange={v => set("pobpr50kmItcc", v)}   disabled={dis} />
                        <CampoNum label="En un radio de más de 50 km" value={datos?.pobprmas50Itcc}  onChange={v => set("pobprmas50Itcc", v)}  disabled={dis} />
                        <CampoTotal
                            label="Total población protegida"
                            value={sumar(datos?.pobpr25kmItcc, datos?.pobpr50kmItcc, datos?.pobprmas50Itcc)}
                        />
                    </div>
                </div>
            </div>

            {/* ── Sección 5: Poblaciones limítrofes (sanitarios) ──────────── */}
            <div style={st.seccion}>
                <div style={st.seccionTitle}>Poblaciones limítrofes</div>
                <div style={st.seccionBody}>
                    <div style={st.grid3}>
                        <CampoTxt label="En un radio de 25 km"        value={datos?.obs25km}    onChange={v => set("obs25km", v)}    disabled={dis} />
                        <CampoTxt label="En un radio de 50 km"        value={datos?.obs50km}    onChange={v => set("obs50km", v)}    disabled={dis} />
                        <CampoTxt label="En un radio de más de 50 km" value={datos?.obsmas50km} onChange={v => set("obsmas50km", v)} disabled={dis} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoblacionProtegida;
