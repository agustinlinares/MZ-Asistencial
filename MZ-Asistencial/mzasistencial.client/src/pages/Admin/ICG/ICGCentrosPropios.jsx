import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './ICG.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    FilterRow,
    HeaderFilter,
    Selection,
    GroupPanel,
    Grouping,
    ColumnChooser,
    Export,
    Toolbar,
    Item,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import SelectBox from "devextreme-react/select-box";

const API_CENTROS  = "/api/CentrosPropios";
const API_ICG06    = "/api/Icg06DatosGenerales";

// ─── Año actual y lista de años ───────────────────────────────────────────────
const YEAR_NOW = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => YEAR_NOW - i);

// ─── Ficha ICG06 con pestañas ─────────────────────────────────────────────────
const TABS = [
    { key: "generales",    label: "Datos Generales" },
    { key: "economicos",   label: "Datos Económicos" },
    { key: "plantilla",    label: "Datos de Plantilla" },
    { key: "area",         label: "Área Asistencial" },
    { key: "poblacion",    label: "Población Protegida" },
    { key: "especialidades", label: "Especialidades / Servicios" },
    { key: "hos",          label: "Act. Sust. Conciertos (H)" },
    { key: "amb",          label: "Act. Sust. Conciertos" },
    { key: "convHos",      label: "Conv. Sectorial ITCC (H)" },
    { key: "convAmb",      label: "Conv. Sectorial ITCC" },
    { key: "itHos",        label: "Control IT CC (H)" },
    { key: "itAmb",        label: "Control IT CC" },
    { key: "otrasHos",     label: "Otras Asistencias (H)" },
    { key: "otrasAmb",     label: "Otras Asistencias" },
    { key: "asProHos",     label: "AS Cont. Profesionales (H)" },
    { key: "asPro",        label: "AS Cont. Profesionales" },
];

// ─── Estilos inline ───────────────────────────────────────────────────────────
const st = {
    page:       { fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 13, padding: "16px 20px" },
    header:     { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
    title:      { fontSize: 17, fontWeight: 700, color: "#1976d2", flex: 1 },
    yearWrap:   { display: "flex", alignItems: "center", gap: 8 },
    yearLabel:  { fontSize: 13, color: "#555" },
    backBtn:    { marginBottom: 14 },
    fichaWrap:  { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 6, padding: "0 0 16px 0" },
    fichaHead:  { background: "#1976d2", color: "#fff", borderRadius: "6px 6px 0 0", padding: "12px 20px", display: "flex", alignItems: "center", gap: 16 },
    fichaTitle: { fontSize: 15, fontWeight: 700 },
    fichaAnio:  { fontSize: 13, opacity: 0.85 },
    tabBar:     { display: "flex", flexWrap: "wrap", gap: 2, padding: "10px 12px 0", borderBottom: "2px solid #e0e0e0" },
    tab: (active) => ({
        padding: "7px 14px", fontSize: 12.5, cursor: "pointer", border: "none",
        borderBottom: active ? "2px solid #1976d2" : "2px solid transparent",
        background: "none", color: active ? "#1976d2" : "#555",
        fontWeight: active ? 700 : 400, outline: "none",
        marginBottom: -2,
    }),
    tabContent: { padding: "16px 20px" },
    loading:    { color: "#888", padding: 20 },
    nodata:     { color: "#c00", padding: 20 },
    fieldWrap:  { display: "flex", flexWrap: "wrap", gap: "12px 24px" },
    field:      { display: "flex", flexDirection: "column", minWidth: 180 },
    fieldLabel: { fontSize: 11, color: "#888", marginBottom: 2 },
    fieldVal:   { fontSize: 13, color: "#222", fontWeight: 500 },
    fieldInput: { border: "1px solid #d0d0d0", borderRadius: 3, padding: "4px 8px", fontSize: 13, outline: "none", width: 160, background: "#fff", color: "#222" },
    saveBar:    { display: "flex", gap: 10, marginTop: 14, alignItems: "center" },
    saveBtn:    { border: "none", borderRadius: 4, padding: "6px 22px", fontSize: 13, cursor: "pointer", fontWeight: 600, background: "#2e7d32", color: "#fff" },
    msg: (ok) => ({ fontSize: 12.5, color: ok ? "#2e7d32" : "#c62828" }),
};

// ─── Componente genérico de campos de una sección ─────────────────────────────
const SeccionCampos = ({ datos, onChange, campos }) => (
    <div style={st.fieldWrap}>
        {campos.map(({ key, label, type = "text" }) => (
            <div key={key} style={st.field}>
                <span style={st.fieldLabel}>{label}</span>
                <input
                    style={st.fieldInput}
                    type={type}
                    value={datos?.[key] ?? ""}
                    onChange={e => onChange(key, e.target.value)}
                />
            </div>
        ))}
    </div>
);

// ─── Contenido de pestaña con carga desde API ─────────────────────────────────
const TabContent = ({ centroId, año, tabKey }) => {
    const [datos,   setDatos]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const [msg,     setMsg]     = useState(null);

    const endpoint = {
        generales:     `/api/Icg06DatosGenerales?centroId=${centroId}&año=${año}`,
        economicos:    `/api/Icg06DatosEconomicos?centroId=${centroId}&año=${año}`,
        plantilla:     `/api/Icg06DatosPlantilla?centroId=${centroId}&año=${año}`,
        area:          `/api/Icg06AreaAsistencial?centroId=${centroId}&año=${año}`,
        poblacion:     `/api/Icg06PoblacionProtegida?centroId=${centroId}&año=${año}`,
        especialidades:`/api/Icg06Especialidad?centroId=${centroId}&año=${año}`,
        hos:           `/api/Icg06Hos?centroId=${centroId}&año=${año}`,
        amb:           `/api/Icg06Amb?centroId=${centroId}&año=${año}`,
        convHos:       `/api/Icg06ConvHos?centroId=${centroId}&año=${año}`,
        convAmb:       `/api/Icg06ConvAmb?centroId=${centroId}&año=${año}`,
        itHos:         `/api/Icg06ItHos?centroId=${centroId}&año=${año}`,
        itAmb:         `/api/Icg06ItAmb?centroId=${centroId}&año=${año}`,
        otrasHos:      `/api/Icg06OtrasHos?centroId=${centroId}&año=${año}`,
        otrasAmb:      `/api/Icg06OtrasAmb?centroId=${centroId}&año=${año}`,
        asProHos:      `/api/Icg06AsProHos?centroId=${centroId}&año=${año}`,
        asPro:         `/api/Icg06AsPro?centroId=${centroId}&año=${año}`,
    }[tabKey];

    const putEndpoint = {
        generales:     `/api/Icg06DatosGenerales`,
        economicos:    `/api/Icg06DatosEconomicos`,
        plantilla:     `/api/Icg06DatosPlantilla`,
        area:          `/api/Icg06AreaAsistencial`,
        poblacion:     `/api/Icg06PoblacionProtegida`,
        especialidades:`/api/Icg06Especialidad`,
        hos:           `/api/Icg06Hos`,
        amb:           `/api/Icg06Amb`,
        convHos:       `/api/Icg06ConvHos`,
        convAmb:       `/api/Icg06ConvAmb`,
        itHos:         `/api/Icg06ItHos`,
        itAmb:         `/api/Icg06ItAmb`,
        otrasHos:      `/api/Icg06OtrasHos`,
        otrasAmb:      `/api/Icg06OtrasAmb`,
        asProHos:      `/api/Icg06AsProHos`,
        asPro:         `/api/Icg06AsPro`,
    }[tabKey];

    useEffect(() => {
        setLoading(true); setMsg(null); setDatos(null);
        fetch(endpoint)
            .then(r => r.ok ? r.json() : null)
            .then(d => setDatos(d))
            .catch(() => setDatos(null))
            .finally(() => setLoading(false));
    }, [endpoint]);

    const handleChange = (key, val) =>
        setDatos(prev => ({ ...prev, [key]: val === "" ? null : val }));

    const guardar = async () => {
        if (!datos) return;
        setSaving(true); setMsg(null);
        try {
            const id = datos.idIcg ?? datos.id;
            const res = await fetch(`${putEndpoint}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });
            if (!res.ok) throw new Error();
            setMsg({ ok: true, text: "Guardado correctamente." });
        } catch {
            setMsg({ ok: false, text: "Error al guardar." });
        } finally { setSaving(false); }
    };

    if (loading) return <div style={st.loading}>Cargando…</div>;
    if (!datos)  return <div style={st.nodata}>No hay datos para este centro y año.</div>;

    // Renderizar campos dinámicamente a partir de las claves del DTO
    const campos = Object.keys(datos)
        .filter(k => k !== "idIcg" && k !== "id" && k !== "centroId" && k !== "año")
        .map(k => ({
            key: k,
            label: k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()),
            type: typeof datos[k] === "number" ? "number" : "text",
        }));

    return (
        <div>
            <SeccionCampos datos={datos} onChange={handleChange} campos={campos} />
            <div style={st.saveBar}>
                <button style={st.saveBtn} onClick={guardar} disabled={saving}>
                    {saving ? "Guardando…" : "Guardar"}
                </button>
                {msg && <span style={st.msg(msg.ok)}>{msg.text}</span>}
            </div>
        </div>
    );
};

// ─── Ficha ICG06 ─────────────────────────────────────────────────────────────
const FichaICG06 = ({ centro, año, onBack }) => {
    const [tabActiva, setTabActiva] = useState("generales");

    return (
        <div>
            <div style={st.backBtn}>
                <Button text="← Volver a la lista" onClick={onBack} stylingMode="outlined" />
            </div>
            <div style={st.fichaWrap}>
                <div style={st.fichaHead}>
                    <div>
                        <div style={st.fichaTitle}>
                            ICG06 — {centro.centro} ({centro.localizador})
                        </div>
                        <div style={st.fichaAnio}>Año: {año} · Centro ID: {centro.centroId}</div>
                    </div>
                </div>
                <div style={st.tabBar}>
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            style={st.tab(tabActiva === tab.key)}
                            onClick={() => setTabActiva(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div style={st.tabContent}>
                    <TabContent
                        key={`${centro.centroId}-${año}-${tabActiva}`}
                        centroId={centro.centroId}
                        año={año}
                        tabKey={tabActiva}
                    />
                </div>
            </div>
        </div>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const ICGCentrosPropios = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const navigate    = useNavigate();

    const [centros,         setCentros]         = useState([]);
    const [loading,         setLoading]         = useState(true);
    const [año,             setAño]             = useState(YEAR_NOW);
    const [centroSeleccionado, setCentroSeleccionado] = useState(null);

    // Cargar lista de centros propios
    useEffect(() => {
        setLoading(true);
        fetch(API_CENTROS)
            .then(r => r.ok ? r.json() : [])
            .then(d => setCentros(d))
            .catch(() => setCentros([]))
            .finally(() => setLoading(false));
    }, []);

    // Exportar a Excel
    const onExporting = (e) => {
        const workbook = new Workbook();
        const sheet    = workbook.addWorksheet("CentrosPropios");
        exportDataGrid({ component: e.component, worksheet: sheet, autoFilterEnabled: true })
            .then(() => workbook.xlsx.writeBuffer())
            .then(buf => saveAs(new Blob([buf], { type: "application/octet-stream" }), "CentrosPropios.xlsx"));
        e.cancel = true;
    };

    // Si hay centro seleccionado → mostrar ficha
    if (centroSeleccionado) {
        return (
            <div style={st.page}>
                <FichaICG06
                    centro={centroSeleccionado}
                    año={año}
                    onBack={() => setCentroSeleccionado(null)}
                />
            </div>
        );
    }

    // Lista de centros
    return (
        <div style={st.page}>
            <div style={st.header}>
                <div style={st.title}>LISTA CENTROS PROPIOS — ICG06</div>
                <div style={st.yearWrap}>
                    <span style={st.yearLabel}>Año:</span>
                    <SelectBox
                        items={YEARS}
                        value={año}
                        onValueChanged={e => setAño(e.value)}
                        width={100}
                    />
                </div>
            </div>

            <DataGrid
                ref={dataGridRef}
                dataSource={centros}
                showBorders
                rowAlternationEnabled
                columnAutoWidth
                allowColumnResizing
                allowColumnReordering
                wordWrapEnabled={false}
                onExporting={onExporting}
                noDataText={loading ? "Cargando…" : "No hay centros disponibles"}
            >
                <SearchPanel visible placeholder="Buscar…" />
                <FilterRow visible />
                <HeaderFilter visible />
                <GroupPanel visible />
                <Grouping autoExpandAll={false} />
                <ColumnChooser enabled />
                <Selection mode="single" />
                <Export enabled allowExportSelectedData />
                <Paging defaultPageSize={20} />

                <Toolbar>
                    <Item name="groupPanel" />
                    <Item name="searchPanel" />
                    <Item name="columnChooserButton" />
                    <Item name="exportButton" />
                </Toolbar>

                <Column dataField="localizador"  caption="Localizador"   width={110} />
                <Column dataField="no"            caption="Nº"            width={70}  />
                <Column dataField="mutuaId"       caption="Mutua"         width={70}  />
                <Column dataField="centroId"      caption="Centro ID"     width={90}  />
                <Column dataField="centro"        caption="Centro"        minWidth={200} />
                <Column dataField="cp"            caption="C.P."          width={80}  />
                <Column dataField="provincia"     caption="Provincia"     width={130} />
                <Column dataField="poblacionId"   caption="Población"     width={100} />
                <Column dataField="telefono"      caption="Teléfono"      width={130} />
                <Column dataField="desactivado"   caption="Desactivado"   width={110}
                    cellRender={({ value }) => (
                        <span style={{ color: value ? "#c62828" : "#2e7d32", fontWeight: 600 }}>
                            {value ? "Sí" : "No"}
                        </span>
                    )}
                />
                <Column
                    caption="ICG06"
                    width={110}
                    cellRender={({ data }) => (
                        <button
                            style={{
                                border: "none", borderRadius: 3, padding: "3px 12px",
                                background: "#1976d2", color: "#fff", fontSize: 12,
                                cursor: "pointer", fontWeight: 600,
                            }}
                            onClick={() => setCentroSeleccionado(data)}
                        >
                            Ver ficha
                        </button>
                    )}
                />
            </DataGrid>
        </div>
    );
};

export default ICGCentrosPropios;
