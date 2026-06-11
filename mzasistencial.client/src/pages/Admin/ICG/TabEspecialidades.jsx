import React, { useEffect, useState, useCallback } from "react";
import DataGrid, {
    Column,
    Editing,
    Paging,
    FilterRow,
    Toolbar,
    Item,
    RequiredRule,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { useLogError } from '../../../hooks/useLogError';

const API = "/api/Icg06Especialidad";

// ─── Estilos locales ─────────────────────────────────────────────────────────
const st = {
    wrap:    { padding: "4px 0" },
    toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    info:    { fontSize: 12, color: "#666" },
    loading: { color: "#888", padding: 16 },
    error:   { color: "#c62828", padding: 16 },
    msg: (ok) => ({
        fontSize: 12.5,
        color: ok ? "#2e7d32" : "#c62828",
        marginLeft: 12,
    }),
};

// ─── Componente principal ─────────────────────────────────────────────────────
const TabEspecialidades = ({ centroId, año }) => {
    const [rows,    setRows]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [msg,     setMsg]     = useState(null);

    const logError = useLogError("Tab especialidades");

    // ── Carga inicial ──────────────────────────────────────────────────────
    const cargar = useCallback(() => {
        setLoading(true);
        setError(null);
        fetch(`${API}?centroId=${centroId}&a%C3%B1o=${año}`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(d  => setRows(d))
            .catch(() => setError("No se pudieron cargar las especialidades."))
            .finally(() => setLoading(false));
    }, [centroId, año]);

    useEffect(() => { cargar(); }, [cargar]);

    // ── Insertar ───────────────────────────────────────────────────────────
    const onRowInserting = async (e) => {
        e.cancel = true; // cancelamos el comportamiento por defecto del grid

        const nuevo = {
            centroId,
            año,
            especialidad: e.data.especialidad ?? null,
            servicio:     e.data.servicio     ?? null,
            cantidad:     e.data.cantidad     ?? null,
        };

        try {
            const res = await fetch(API, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(nuevo),
            });
            if (!res.ok) throw new Error();
            mostrarMsg(true, "Especialidad añadida.");
            cargar();
        } catch {
            logError("Fallo al insertar nueva especialidad", error);
            mostrarMsg(false, "Error al añadir la especialidad.");
        }
    };

    // ── Actualizar ─────────────────────────────────────────────────────────
    const onRowUpdating = async (e) => {
        e.cancel = true;

        const actualizado = {
            ...e.oldData,
            ...e.newData,
            centroId,
            año,
        };

        try {
            const res = await fetch(`${API}/${actualizado.id}`, {
                method:  "PUT",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(actualizado),
            });
            if (!res.ok) throw new Error();
            mostrarMsg(true, "Especialidad actualizada.");
            cargar();
        } catch {
            logError(`Fallo al actualizar especialidad ID: ${actualizado.id}`, error);
            mostrarMsg(false, "Error al actualizar la especialidad.");
        }
    };

    // ── Eliminar ───────────────────────────────────────────────────────────
    const onRowRemoving = async (e) => {
        e.cancel = true;

        try {
            const res = await fetch(`${API}/${e.data.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            mostrarMsg(true, "Especialidad eliminada.");
            cargar();
        } catch {
            logError(`Fallo al eliminar especialidad ID: ${e.data.id}`, error);
            mostrarMsg(false, "Error al eliminar la especialidad.");
        }
    };

    const mostrarMsg = (ok, text) => {
        setMsg({ ok, text });
        setTimeout(() => setMsg(null), 3500);
    };

    // ── Render ─────────────────────────────────────────────────────────────
    if (loading) return <div style={st.loading}>Cargando especialidades…</div>;
    if (error)   return <div style={st.error}>{error}</div>;

    return (
        <div style={st.wrap}>
            <div style={st.toolbar}>
                <span style={st.info}>
                    {rows.length} especialidad{rows.length !== 1 ? "es" : ""} registrada{rows.length !== 1 ? "s" : ""}
                    {msg && <span style={st.msg(msg.ok)}>{msg.text}</span>}
                </span>
            </div>

            <DataGrid
                dataSource={rows}
                keyExpr="id"
                showBorders
                rowAlternationEnabled
                columnAutoWidth
                onRowInserting={onRowInserting}
                onRowUpdating={onRowUpdating}
                onRowRemoving={onRowRemoving}
                noDataText="Sin especialidades registradas para este centro y año."
            >
                <FilterRow visible />
                <Paging defaultPageSize={20} />

                <Editing
                    mode="row"
                    allowAdding
                    allowUpdating
                    allowDeleting
                    confirmDelete
                    useIcons
                />

                <Toolbar>
                    <Item name="addRowButton" showText="always" />
                </Toolbar>

                <Column
                    dataField="especialidad"
                    caption="Especialidad"
                    minWidth={200}
                >
                    <RequiredRule message="La especialidad es obligatoria." />
                </Column>

                <Column
                    dataField="servicio"
                    caption="Servicio"
                    minWidth={200}
                />

                <Column
                    dataField="cantidad"
                    caption="Cantidad"
                    dataType="number"
                    width={120}
                    alignment="right"
                />
            </DataGrid>
        </div>
    );
};

export default TabEspecialidades;
