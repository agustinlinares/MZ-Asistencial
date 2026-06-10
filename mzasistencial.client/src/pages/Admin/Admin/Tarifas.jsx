import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";
import notify from "devextreme/ui/notify";
import { confirm as dxConfirm } from "devextreme/ui/dialog";
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
    Scrolling,
    Sorting,
    ColumnFixing,
    Pager,
    Toolbar,
    Item,
} from "devextreme-react/data-grid";
import FichaTarifa from "./FichaTarifa";
import "./Admin.css";
import "../../../styles/FichaGlobal.css";

const API_URL = "/api/Tarifas";

const Tarifas = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);

    const [tarifas, setTarifas] = useState([]);
    const [selectedTarifa, setSelectedTarifa] = useState(null);
    const [fichaInitialData, setFichaInitialData] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [modalCopiar, setModalCopiar] = useState(false);
    const [copiarOrigenId, setCopiarOrigenId] = useState(null);
    const [copiarAño, setCopiarAño] = useState(new Date().getFullYear().toString());
    const [copiarDescripcion, setCopiarDescripcion] = useState("");
    const [copiarAjuste, setCopiarAjuste] = useState(0);
    const [copiando, setCopiando] = useState(false);

    const cargarDatos = () => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(setTarifas)
            .catch(() => {
                console.error("Error cargando tarifas");
                notify(t("Error al cargar las tarifas"), "error", 3000);
            });
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleNuevo = () => {
        setMenuAbierto(false);
        setFichaInitialData(null);
        setSelectedTarifa({});
    };

    const abrirModalCopiar = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current?.instance();
        const selected = grid?.getSelectedRowsData?.() || [];
        setCopiarOrigenId(selected[0]?.tarifaId ?? null);
        setCopiarAño(new Date().getFullYear().toString());
        setCopiarDescripcion("");
        setCopiarAjuste(0);
        setModalCopiar(true);
    };

    const handleCopiarTarifa = async () => {
        if (!copiarOrigenId) {
            notify(t("Seleccione la tarifa que desea copiar"), "warning", 3000);
            return;
        }
        if (!copiarAño?.trim()) {
            notify(t("Indique el año de la nueva tarifa"), "warning", 3000);
            return;
        }

        setCopiando(true);
        try {
            const res = await fetch(`${API_URL}/copiar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tarifaOrigenId: copiarOrigenId,
                    nuevoAño: copiarAño.trim(),
                    nuevaDescripcion: copiarDescripcion.trim() || null,
                    ajustePorcentaje: parseFloat(copiarAjuste) || 0,
                }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.mensaje || t("Error al copiar"));
            }
            const data = await res.json();
            setModalCopiar(false);
            setFichaInitialData(data);
            setSelectedTarifa({});
            notify(t("Tarifa copiada. Revise los datos y pulse Aceptar para guardar."), "success", 4000);
        } catch (ex) {
            notify(ex.message || t("Error al copiar"), "error", 3500);
        } finally {
            setCopiando(false);
        }
    };

    const cerrarFicha = () => {
        setSelectedTarifa(null);
        setFichaInitialData(null);
    };

    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current?.instance();
        if (!grid) return;
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Tarifas");
        exportDataGrid({ component: grid, worksheet, autoFilterEnabled: true }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: "application/octet-stream" }), "ListaTarifas.xlsx");
            });
        });
    };

    const handleExportarPDF = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current?.instance();
        if (!grid) return;
        import("devextreme/pdf_exporter").then(({ exportDataGrid: exportPDF }) => {
            import("jspdf").then(({ jsPDF }) => {
                const doc = new jsPDF({ orientation: "landscape" });
                exportPDF({ jsPDFDocument: doc, component: grid, indent: 5 }).then(() => {
                    doc.save("ListaTarifas.pdf");
                });
            });
        });
    };

    const handleEliminar = async (id) => {
        const ok = await dxConfirm(
            t("¿Está seguro de que desea eliminar esta tarifa y todas sus líneas?"),
            t("Confirmar eliminación")
        );
        if (!ok) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (res.ok) {
                notify(t("Tarifa eliminada"), "success", 2000);
                cargarDatos();
            } else {
                notify(t("Error al eliminar la tarifa"), "error", 3000);
            }
        } catch {
            notify(t("Error de conexión"), "error", 3000);
        }
    };

    if (selectedTarifa) {
        return (
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <FichaTarifa
                    tarifa={selectedTarifa}
                    initialData={fichaInitialData}
                    onClose={cerrarFicha}
                    onSaved={cargarDatos}
                />
            </div>
        );
    }

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                <div className="header-page">
                    <div className="title">{t("LISTA TARIFAS")}</div>
                    <div className="header-actions-side">
                        <div className="acciones-container" ref={menuRef}>
                            <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                <i className="ri-settings-3-line" />
                                {t("Acciones")}
                            </div>

                            {menuAbierto && (
                                <div className="acciones-menu">
                                    <div className="acciones-item" onClick={handleNuevo}>
                                        <i className="ri-add-line" style={{ color: "#1976d2" }} />
                                        {t("Nuevo")}
                                    </div>
                                    <div className="acciones-item" onClick={abrirModalCopiar}>
                                        <i className="ri-file-copy-line" style={{ color: "#6a1b9a" }} />
                                        {t("Copiar tarifa")}
                                    </div>
                                    <div className="acciones-item" onClick={handleExportarExcel}>
                                        <i className="ri-file-excel-2-line" style={{ color: "#2e7d32" }} />
                                        {t("Exportar a Excel")}
                                    </div>
                                    <div className="acciones-item" onClick={handleExportarPDF}>
                                        <i className="ri-file-pdf-line" style={{ color: "#c62828" }} />
                                        {t("Exportar a PDF")}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ padding: "0 20px 20px 20px" }}>
                    <div style={{ height: "calc(100vh - 180px)", width: "100%" }}>
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={tarifas}
                            keyExpr="tarifaId"
                            showBorders
                            columnAutoWidth
                            allowColumnResizing
                            className="mz-table"
                            height="100%"
                            rowAlternationEnabled
                            showRowLines
                            showColumnLines
                            wordWrapEnabled={false}
                            noDataText={t("Sin datos para mostrar")}
                            onRowDblClick={(e) => setSelectedTarifa(e.data)}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={20} />
                            <Pager
                                visible
                                allowedPageSizes={[10, 20, 50, 100]}
                                displayMode="full"
                                showPageSizeSelector
                                showInfo
                                showNavigationButtons
                            />
                            <Toolbar>
                                <Item location="after" name="searchPanel" />
                                <Item location="after" name="columnChooserButton" />
                            </Toolbar>
                            <SearchPanel visible width={240} placeholder={t("buscar")} />
                            <FilterRow visible applyFilter="auto" />
                            <HeaderFilter visible />
                            <Selection mode="single" />
                            <GroupPanel
                                visible
                                emptyPanelText={t(
                                    "Arrastre una columna aquí para agrupar por dicha columna"
                                )}
                            />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled mode="select" />
                            <Export enabled allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <ColumnFixing enabled />

                            <Column dataField="tarifaId" caption={t("Código")} width={90} />
                            <Column dataField="tarifa" caption={t("Tarifa")} minWidth={280} />
                            <Column dataField="año" caption={t("Año")} width={90} />
                            <Column
                                caption={t("Acciones")}
                                width={100}
                                fixed
                                fixedPosition="right"
                                alignment="center"
                                cellRender={({ data }) => (
                                    <div className="ficha-row-actions">
                                        <i
                                            className="ri-edit-line edit-icon"
                                            title={t("Editar")}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTarifa(data);
                                            }}
                                        />
                                        <i
                                            className="ri-delete-bin-line delete-icon"
                                            title={t("Eliminar")}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminar(data.tarifaId);
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </DataGrid>
                    </div>
                </div>
            </div>

            {modalCopiar && (
                <div
                    className="tarifas-modal-overlay"
                    onClick={() => !copiando && setModalCopiar(false)}
                >
                    <div className="tarifas-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="ficha-modal-header">
                            <span className="ficha-modal-title">{t("Copiar tarifa de otro año")}</span>
                        </div>
                        <div style={{ padding: "20px" }}>
                            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                                {t(
                                    "Seleccione una tarifa existente. Se creará una ficha nueva con las mismas líneas (aún no guardada hasta pulsar Aceptar en la ficha)."
                                )}
                            </p>
                            <div className="ficha-field" style={{ marginBottom: 14 }}>
                                <label>{t("Tarifa origen")}</label>
                                <select
                                    value={copiarOrigenId ?? ""}
                                    onChange={(e) =>
                                        setCopiarOrigenId(e.target.value ? parseInt(e.target.value, 10) : null)
                                    }
                                >
                                    <option value="">{t("— Seleccionar —")}</option>
                                    {tarifas.map((tr) => (
                                        <option key={tr.tarifaId} value={tr.tarifaId}>
                                            {tr.tarifa} ({tr.año}) — #{tr.tarifaId}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="ficha-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div className="ficha-field">
                                    <label>{t("Año nuevo")}</label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={copiarAño}
                                        onChange={(e) => setCopiarAño(e.target.value)}
                                    />
                                </div>
                                <div className="ficha-field">
                                    <label>{t("Ajuste importes (%)")}</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={copiarAjuste}
                                        onChange={(e) => setCopiarAjuste(e.target.value)}
                                        title={t("Ej: 5 aumenta un 5%, -10 reduce un 10%")}
                                    />
                                </div>
                            </div>
                            <div className="ficha-field" style={{ marginTop: 14 }}>
                                <label>{t("Nueva descripción (opcional)")}</label>
                                <input
                                    type="text"
                                    value={copiarDescripcion}
                                    onChange={(e) => setCopiarDescripcion(e.target.value)}
                                    placeholder={t("Si se deja vacío se genera automáticamente")}
                                />
                            </div>
                            <div
                                className="ficha-header-btns"
                                style={{ marginTop: 20, justifyContent: "flex-end" }}
                            >
                                <button
                                    className="ficha-btn-primary"
                                    onClick={handleCopiarTarifa}
                                    disabled={copiando}
                                >
                                    {copiando ? t("Copiando...") : t("Continuar")}
                                </button>
                                <button
                                    className="ficha-btn-secondary"
                                    onClick={() => setModalCopiar(false)}
                                    disabled={copiando}
                                >
                                    {t("Cancelar")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tarifas;
