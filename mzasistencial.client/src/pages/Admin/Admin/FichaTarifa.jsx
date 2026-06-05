import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import notify from "devextreme/ui/notify";
import { confirm as dxConfirm } from "devextreme/ui/dialog";
import DataGrid, {
    Column,
    Paging,
    FilterRow,
    HeaderFilter,
    Pager,
    Scrolling,
    Sorting,
    Export,
    Lookup,
    Editing,
} from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";
import "../../../styles/FichaGlobal.css";

const API_URL = "/api/Tarifas";

const emptyForm = () => ({
    tarifaId: 0,
    descripcion: "",
    año: new Date().getFullYear().toString(),
    porcentaje: 0,
    activo: false,
});

const mapDetalleKeys = (detalles) =>
    (detalles || []).map((d, i) => ({
        ...d,
        _key: d.tarifaDetalleId > 0 ? `d-${d.tarifaDetalleId}` : `new-${i}-${Date.now()}`,
        ciep: d.ciep || "No Consta",
        ciepId: d.ciepId ?? null,
    }));

const aplicarFicha = (data) => ({
    form: {
        tarifaId: data.tarifaId || 0,
        descripcion: data.descripcion || "",
        año: data.año || "",
        porcentaje: data.porcentaje ?? 0,
        activo: !!data.activo,
    },
    detalles: mapDetalleKeys(data.detalles),
});

const FichaTarifa = ({ tarifa, initialData, onClose, onSaved }) => {
    const { t } = useTranslation();
    const modalRef = useRef(null);
    const detalleGridRef = useRef(null);

    const [form, setForm] = useState(emptyForm());
    const [detalles, setDetalles] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [ciepCache, setCiepCache] = useState({});
    const [guardando, setGuardando] = useState(false);
    const [cargando, setCargando] = useState(false);

    const esNuevo = !tarifa?.tarifaId;

    const cargarCiepEspecialidad = async (especialidadId) => {
        if (!especialidadId) return [];
        if (ciepCache[especialidadId]) return ciepCache[especialidadId];
        const res = await fetch(`${API_URL}/ciep/${especialidadId}`);
        const data = res.ok ? await res.json() : [{ ciepId: null, ciep: "No Consta" }];
        setCiepCache((prev) => ({ ...prev, [especialidadId]: data }));
        return data;
    };

    useEffect(() => {
        modalRef.current?.focus();
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        fetch(`${API_URL}/especialidades`)
            .then((r) => (r.ok ? r.json() : []))
            .then(setEspecialidades)
            .catch(() => setEspecialidades([]));
    }, []);

    useEffect(() => {
        if (initialData) {
            const { form: f, detalles: d } = aplicarFicha(initialData);
            setForm(f);
            setDetalles(d);
            const espIds = [...new Set(d.map((x) => x.especialidadId).filter(Boolean))];
            espIds.forEach((id) => cargarCiepEspecialidad(id));
            return;
        }

        if (esNuevo) {
            setForm(emptyForm());
            setDetalles([]);
            return;
        }

        setCargando(true);
        fetch(`${API_URL}/${tarifa.tarifaId}`)
            .then((r) => {
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then((data) => {
                const { form: f, detalles: d } = aplicarFicha(data);
                setForm(f);
                setDetalles(d);
                const espIds = [...new Set(d.map((x) => x.especialidadId).filter(Boolean))];
                espIds.forEach((id) => cargarCiepEspecialidad(id));
            })
            .catch(() => notify(t("Error al cargar la tarifa"), "error", 3000))
            .finally(() => setCargando(false));
    }, [tarifa, esNuevo, initialData, t]);

    const set = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm((f) => ({ ...f, [key]: val }));
    };

    const exportarDetalleGrid = (formato) => {
        const grid = detalleGridRef.current?.instance();
        if (!grid) return;

        if (formato === "pdf") {
            import("devextreme/pdf_exporter").then(({ exportDataGrid: exportPDF }) => {
                import("jspdf").then(({ jsPDF }) => {
                    const doc = new jsPDF({ orientation: "landscape" });
                    exportPDF({ jsPDFDocument: doc, component: grid, indent: 5 }).then(() => {
                        doc.save(`Tarifa_${form.descripcion || "detalle"}.pdf`);
                    });
                });
            });
            return;
        }

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Detalle");
        exportDataGrid({ component: grid, worksheet, autoFilterEnabled: true }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(
                    new Blob([buffer], { type: "application/octet-stream" }),
                    `Tarifa_${form.descripcion || "detalle"}.xlsx`
                );
            });
        });
    };

    const handleDuplicarFila = (rowData) => {
        const idx = detalles.findIndex((d) => d._key === rowData._key);
        const copia = {
            ...rowData,
            tarifaDetalleId: 0,
            _key: `dup-${Date.now()}`,
        };
        const next = [...detalles];
        next.splice(idx + 1, 0, copia);
        setDetalles(next);
    };

    const handleEliminarFila = async (rowData) => {
        const ok = await dxConfirm(
            t("¿Eliminar esta línea de la tarifa?"),
            t("Confirmar eliminación")
        );
        if (!ok) return;
        setDetalles((prev) => prev.filter((d) => d._key !== rowData._key));
    };

    const onRowUpdating = async (e) => {
        if (
            e.newData.especialidadId !== undefined &&
            e.newData.especialidadId !== e.oldData.especialidadId
        ) {
            const esp = especialidades.find((x) => x.especialidadId === e.newData.especialidadId);
            e.newData.especialidad = esp?.especialidad ?? "";
            e.newData.ciepId = null;
            e.newData.ciep = "No Consta";
            if (e.newData.especialidadId) {
                await cargarCiepEspecialidad(e.newData.especialidadId);
            }
        }

        if (e.newData.ciepId !== undefined && e.newData.ciepId !== e.oldData.ciepId) {
            const espId = e.newData.especialidadId ?? e.oldData.especialidadId;
            const lista = espId ? ciepCache[espId] || (await cargarCiepEspecialidad(espId)) : [];
            const item = lista.find((c) => c.ciepId === e.newData.ciepId) || lista.find((c) => !c.ciepId);
            e.newData.ciep = item?.ciep ?? "No Consta";
            if (!e.newData.ciepId) e.newData.ciepId = null;
        }
    };

    const onEditorPreparing = (e) => {
        if (e.parentType !== "dataRow") return;

        if (e.dataField === "ciepId") {
            const espId = e.row?.data?.especialidadId;
            e.editorName = "dxSelectBox";
            e.editorOptions = {
                dataSource: espId ? ciepCache[espId] || [] : [{ ciepId: null, ciep: "No Consta" }],
                valueExpr: "ciepId",
                displayExpr: "ciep",
                searchEnabled: true,
                disabled: !espId,
                placeholder: espId ? t("Seleccionar CIEP...") : t("Seleccione especialidad primero"),
                onOpened: async () => {
                    if (espId && !ciepCache[espId]) {
                        await cargarCiepEspecialidad(espId);
                        e.component.option("dataSource", ciepCache[espId]);
                    }
                },
            };
        }
    };

    const onEditingStart = async (e) => {
        const espId = e.data?.especialidadId;
        if (espId) await cargarCiepEspecialidad(espId);
    };

    const handleGuardar = async () => {
        if (!form.descripcion?.trim()) {
            notify(t("La descripción es obligatoria"), "warning", 3000);
            return;
        }
        if (!form.año?.trim()) {
            notify(t("El año es obligatorio"), "warning", 3000);
            return;
        }

        setGuardando(true);
        try {
            const payload = {
                tarifaId: form.tarifaId,
                descripcion: form.descripcion.trim(),
                año: form.año.trim(),
                porcentaje: parseFloat(form.porcentaje) || 0,
                activo: form.activo,
                detalles: detalles.map((d) => ({
                    tarifaDetalleId: d.tarifaDetalleId || 0,
                    tarifaId: form.tarifaId,
                    servicio: d.servicio,
                    importe: d.importe,
                    especialidadId: d.especialidadId,
                    ciepId: d.ciepId || null,
                    observaciones: d.observaciones,
                    servicioId: d.servicioId,
                    altaTec: d.altaTec,
                })),
            };

            const url = esNuevo || !form.tarifaId ? API_URL : `${API_URL}/${form.tarifaId}`;
            const method = esNuevo || !form.tarifaId ? "POST" : "PUT";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.mensaje || t("Error al guardar"));
            }

            notify(t("Tarifa guardada correctamente"), "success", 2500);
            onSaved?.();
            onClose();
        } catch (ex) {
            notify(ex.message || t("Error al guardar"), "error", 3500);
        } finally {
            setGuardando(false);
        }
    };

    const agregarLinea = () => {
        setDetalles((prev) => [
            ...prev,
            {
                _key: `new-${Date.now()}`,
                tarifaDetalleId: 0,
                servicio: "",
                importe: null,
                especialidadId: null,
                especialidad: "",
                ciepId: null,
                ciep: "No Consta",
                observaciones: "",
            },
        ]);
    };

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content" ref={modalRef} tabIndex={-1}>
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">
                        <i className="ri-price-tag-3-line" /> {t("Ficha Tarifa")}
                        {initialData && (
                            <span style={{ fontSize: 12, color: "#64748b", marginLeft: 8 }}>
                                ({t("copia — guarde con Aceptar")})
                            </span>
                        )}
                    </span>
                    <div className="ficha-header-btns">
                        <button
                            className="ficha-btn-primary"
                            onClick={handleGuardar}
                            disabled={guardando || cargando}
                        >
                            <i className="ri-check-line" />{" "}
                            {guardando ? t("Guardando...") : t("Aceptar")}
                        </button>
                        <button className="ficha-btn-secondary" onClick={onClose} disabled={guardando}>
                            <i className="ri-close-line" /> {t("Salir")}
                        </button>
                    </div>
                </div>

                <div
                    className="ficha-tab-content"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "calc(100vh - 120px)",
                        padding: "16px 20px",
                    }}
                >
                    <div
                        className="ficha-grid-3"
                        style={{
                            gridTemplateColumns: "2fr 1fr 1fr 120px",
                            marginBottom: 16,
                            flexShrink: 0,
                        }}
                    >
                        <div className="ficha-field">
                            <label>{t("Descripcion")}</label>
                            <input
                                type="text"
                                value={form.descripcion}
                                onChange={set("descripcion")}
                                disabled={cargando}
                            />
                        </div>
                        <div className="ficha-field">
                            <label>{t("Año")}</label>
                            <input
                                type="text"
                                value={form.año}
                                onChange={set("año")}
                                maxLength={4}
                                disabled={cargando}
                            />
                        </div>
                        <div className="ficha-field">
                            <label>{t("Porcentaje")}</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.porcentaje}
                                onChange={set("porcentaje")}
                                disabled={cargando}
                            />
                        </div>
                        <div className="ficha-field" style={{ alignItems: "flex-start" }}>
                            <label>{t("Activo")}</label>
                            <input
                                type="checkbox"
                                checked={form.activo}
                                onChange={set("activo")}
                                disabled={cargando}
                                style={{ width: 18, height: 18, marginTop: 6 }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 20,
                            marginBottom: 8,
                            flexShrink: 0,
                        }}
                    >
                        <button
                            type="button"
                            className="ficha-link-btn"
                            onClick={() =>
                                notify(
                                    t(
                                        "Seleccione especialidad y luego CIEP en cada línea. Use + para duplicar una línea."
                                    ),
                                    "info",
                                    4500
                                )
                            }
                        >
                            <i className="ri-question-line" style={{ color: "#1a5fa8" }} /> {t("Información")}
                        </button>
                        <button type="button" className="ficha-link-btn" onClick={() => exportarDetalleGrid("excel")}>
                            <i className="ri-file-excel-2-line" style={{ color: "#2e7d32" }} /> {t("Exportar a Excel")}
                        </button>
                        <button type="button" className="ficha-link-btn" onClick={() => exportarDetalleGrid("pdf")}>
                            <i className="ri-file-pdf-line" style={{ color: "#c62828" }} /> {t("Exportar a PDF")}
                        </button>
                    </div>

                    <div style={{ flex: 1, minHeight: 0 }}>
                        <DataGrid
                            ref={detalleGridRef}
                            dataSource={detalles}
                            keyExpr="_key"
                            showBorders
                            columnAutoWidth
                            allowColumnResizing
                            className="mz-table"
                            height="100%"
                            rowAlternationEnabled
                            showRowLines
                            showColumnLines
                            noDataText={t("Sin datos para mostrar")}
                            onRowUpdating={onRowUpdating}
                            onEditorPreparing={onEditorPreparing}
                            onEditingStart={onEditingStart}
                        >
                            <Editing
                                mode="row"
                                allowUpdating
                                allowAdding={false}
                                allowDeleting={false}
                                useIcons={false}
                            />
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={50} />
                            <Pager
                                visible
                                allowedPageSizes={[25, 50, 100]}
                                displayMode="full"
                                showPageSizeSelector
                                showInfo
                                showNavigationButtons
                            />
                            <FilterRow visible applyFilter="auto" />
                            <HeaderFilter visible />
                            <Sorting mode="multiple" />
                            <Export enabled allowExportSelectedData={false} />

                            <Column dataField="servicio" caption={t("Servicio")} minWidth={280} />
                            <Column dataField="especialidadId" caption={t("Especialidad")} minWidth={160}>
                                <Lookup
                                    dataSource={especialidades}
                                    valueExpr="especialidadId"
                                    displayExpr="especialidad"
                                />
                            </Column>
                            <Column
                                dataField="importe"
                                caption={t("Importe")}
                                dataType="number"
                                format="#,##0.##"
                                width={100}
                            />
                            <Column
                                dataField="ciepId"
                                caption="CIEP"
                                width={140}
                                calculateDisplayValue={(row) => row.ciep || "No Consta"}
                            />
                            <Column dataField="observaciones" caption={t("Observaciones")} minWidth={140} />
                            <Column
                                caption={t("Acciones")}
                                width={120}
                                fixed
                                fixedPosition="right"
                                alignment="center"
                                allowEditing={false}
                                cellRender={({ data }) => (
                                    <div className="ficha-row-actions">
                                        <i
                                            className="ri-edit-line edit-icon"
                                            title={t("Editar")}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const grid = detalleGridRef.current?.instance();
                                                const idx = detalles.findIndex((d) => d._key === data._key);
                                                if (grid && idx >= 0) grid.editRow(idx);
                                            }}
                                        />
                                        <i
                                            className="ri-add-line edit-icon"
                                            title={t("Duplicar línea")}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDuplicarFila(data);
                                            }}
                                        />
                                        <i
                                            className="ri-delete-bin-line delete-icon"
                                            title={t("Eliminar")}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminarFila(data);
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </DataGrid>
                    </div>

                    <div style={{ marginTop: 10, flexShrink: 0 }}>
                        <button type="button" className="ficha-btn-secondary" onClick={agregarLinea}>
                            <i className="ri-add-line" /> {t("Añadir línea")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FichaTarifa;
