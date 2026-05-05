import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import AuthService from '@services/auth/AuthService';
import { Workbook } from 'exceljs';
import './Acuerdos.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
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
    FilterPanel,
    ColumnFixing,
    Pager,
    Toolbar,
    Item,
    Lookup,
    Editing
} from "devextreme-react/data-grid";

import { useTranslation } from "react-i18next";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import FileUploader from "devextreme-react/file-uploader";
import Button from "devextreme-react/button";

// ─── CONSTANTES ──────────────────────────────────────────────────────────────

const acuerdosTipos = [
    { id: 1, nombre: "Acuerdo 1 (Acuerdos mutua)" },
    { id: 2, nombre: "Acuerdo 2 (Acuerdo provincia)" },
    { id: 3, nombre: "Acuerdo 3 (Acuerdos tipo de servicio)" },
];

const sampleData = [];

const onExporting = (e) => {
    e.component.beginUpdate();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'estaciones.xlsx');
        });
    });
    e.cancel = true;
};

// Valida extensión .xlsx y magic bytes (ZIP: 50 4B 03 04)
const validateXlsx = (file) =>
    new Promise((resolve) => {
        if (!file.name.toLowerCase().endsWith('.xlsx')) {
            resolve(false);
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            const arr = new Uint8Array(ev.target.result);
            resolve(arr[0] === 0x50 && arr[1] === 0x4B && arr[2] === 0x03 && arr[3] === 0x04);
        };
        reader.readAsArrayBuffer(file.slice(0, 4));
    });

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const PlantillasAcuerdos = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const [popupVisible, setPopupVisible] = useState(false);
    const [acuerdos, setAcuerdos] = useState([]);
    const [mutuasList, setMutuasList] = useState([]);

    const currentYear = new Date().getFullYear();
    const añosList = Array.from({ length: currentYear - 2008 + 1 }, (_, i) => 2008 + i).reverse();

    const sessionUsuario = AuthService.getUser();

    const emptyForm = {
        mutua: null,
        año: currentYear,
        tipoAcuerdoId: null,
    };

    const [formData, setFormData] = useState(emptyForm);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [errors, setErrors] = useState({});

    // ── Fetch ────────────────────────────────────────────────────────────────

    const fetchAcuerdos = () => {
        fetch('https://localhost:7132/api/PlantillasAcuerdo')
            .then(r => r.json())
            .then(data => setAcuerdos(data))
            .catch(err => console.error('Error al cargar acuerdos:', err));
    };
    //Aquí vamos a traer todas las plantilla de la base de datos y las vamos a cargar todas las plantillas en el data grid

    const fetchMutuas = () => {
        fetch('https://localhost:7132/api/PlantillasAcuerdo/mutuas')
            .then(r => r.json())
            .then(data => setMutuasList(data.map(m => m.mutua)))
            .catch(err => console.error('Error al cargar mutuas:', err));
    };
    //Aquí vamos a traer mutuas de la tabla mutuas

    useEffect(() => {
        fetchAcuerdos();
        fetchMutuas();
    }, []);
//Después las cargamos en el useEffect
    // ── DataGrid handlers ────────────────────────────────────────────────────

    const onRowUpdating = (e) => {
        const updatedData = { ...e.oldData, ...e.newData };
        fetch(`https://localhost:7132/api/PlantillasAcuerdo/${e.key}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        }).catch(err => console.error('Error al actualizar:', err));
    };

    const onRowRemoving = (e) => {
        fetch(`https://localhost:7132/api/PlantillasAcuerdo/${e.key}`, {
            method: 'DELETE',
        }).catch(err => console.error('Error al eliminar:', err));
    };

    // ── Popup handlers ───────────────────────────────────────────────────────

    const handlePopupHide = () => {
        setPopupVisible(false);
        setFormData(emptyForm);
        setSelectedFile(null);
        setFileName("");
        setErrors({});
    };

    const clearFieldError = (field) =>
        setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!file.name.toLowerCase().endsWith('.xlsx')) {
                setFileName("");
                setSelectedFile(null);
                setErrors(prev => ({ ...prev, fichero: "Solo se permiten archivos Excel (.xlsx)." }));
                e.target.value = ""; // Limpiar el input
                return;
            }
            setFileName(file.name);
            setSelectedFile(file);
            clearFieldError('fichero');
        } else {
            setFileName("");
            setSelectedFile(null);
        }
    };

    const handleProcesar = () => {
        fetch('https://localhost:7132/api/PlantillasAcuerdo/procesar', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                fetchAcuerdos(); // Recargar la tabla para ver los estados en 2
            } else {
                console.error("Error procesando plantillas");
            }
        })
        .catch(error => console.error('Error al procesar:', error));
    };

    const handleSave = async () => {
        // Validar campos obligatorios en orden
        if (!formData.mutua) {
            setErrors({ mutua: "La mutua es obligatoria." });
            return;
        }
        if (!formData.año) {
            setErrors({ año: "El año es obligatorio." });
            return;
        }
        if (!formData.tipoAcuerdoId) {
            setErrors({ tipoAcuerdoId: "El acuerdo es obligatorio." });
            return;
        }
        if (!selectedFile) {
            setErrors({ fichero: "El fichero es obligatorio." });
            return;
        }

        setErrors({});

        const isValidXlsx = await validateXlsx(selectedFile);
        if (!isValidXlsx) {
            setErrors({ fichero: "Solo se permiten ficheros .xlsx válidos." });
            return;
        }

        const data = new FormData();
        data.append("File", selectedFile);
        data.append("Mutua", formData.mutua);
        data.append("Año", formData.año);
        data.append("TipoAcuerdoId", formData.tipoAcuerdoId);
        data.append("Mes", new Date().getMonth() + 1);
        data.append("Usuario", sessionUsuario);

        fetch('https://localhost:7132/api/PlantillasAcuerdo', {
            method: 'POST',
            body: data,
        })
            .then(response => {
                if (response.ok) {
                    handlePopupHide();
                    fetchAcuerdos();
                } else {
                    return response.text().then(msg => { throw new Error(msg || "Error al guardar el registro."); });
                }
            })
            .catch(err => setErrors({ general: err.message }));
    };

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">{t('PLANTILLAS ACUERDOS')}</div>

                        <div className="header-actions-side">
                            <div className="acciones-container" ref={menuRef}>
                                <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-item" onClick={() => { setMenuAbierto(false); setPopupVisible(true); }}>
                                            <i className="ri-add-line" style={{ color: '#1a5fa8' }}></i>
                                            {t('Nueva Plantilla')}
                                        </div>
                                        <div className="acciones-item" onClick={() => { setMenuAbierto(false); handleProcesar(); }}>
                                            <i className="ri-refresh-line" style={{ color: '#e65100' }}></i>
                                            {t('Procesar')}
                                        </div>
                                        <div className="acciones-item" onClick={() => { setMenuAbierto(false); onExporting({ component: dataGridRef.current.instance() }); }}>
                                            <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                            {t('Exportar Excel')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={acuerdos}
                            keyExpr="id"
                            showBorders={true}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            onExporting={onExporting}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
                            onRowUpdating={onRowUpdating}
                            onRowRemoving={onRowRemoving}
                        >
                            <Toolbar>
                                <Item location="after" name="searchPanel" />
                                <Item location="after" name="columnChooserButton" />
                            </Toolbar>
                            <Editing mode="row" allowUpdating={true} allowDeleting={true} useIcons={true} />
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={25} />
                            <Pager visible={true} allowedPageSizes={true} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            <SearchPanel visible width={240} placeholder={t('buscar')} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible searchMode='contains' />
                            <Selection mode="multiple" allowSelectAll />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled mode="select" />
                            <Export enabled fileName="Casos" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <FilterPanel visible />
                            <ColumnFixing enabled />

                            <Column dataField="informe" caption="Informe" />
                            <Column dataField="estadoInforme" caption="Estado Informe" />
                            <Column dataField="tipoAcuerdo" caption="Tipo de acuerdo" />
                            <Column dataField="mutua" caption="Mutua" />
                            <Column dataField="año" caption="Año" />
                            <Column dataField="mes" caption="Mes" />
                            <Column dataField="usuario" caption="Usuario" />
                            <Column dataField="fechaAlta" caption="Fecha Alta" />
                        </DataGrid>
                    </div>
                </div>
            </div>

            <Popup
                visible={popupVisible}
                onHiding={handlePopupHide}
                dragEnabled={true}
                closeOnOutsideClick={true}
                showCloseButton={false}
                title="FICHA DOC. ADJUNTO"
                width={700}
                height="auto"
                className="popup-ficha-doc"
            >
                <ToolbarItem
                    widget="dxButton"
                    toolbar="top"
                    location="after"
                    options={{
                        text: "Aceptar",
                        type: "default",
                        icon: "todo",
                        onClick: handleSave,
                        elementAttr: { class: "btn-aceptar-popup" }
                    }}
                />
                <ToolbarItem
                    widget="dxButton"
                    toolbar="top"
                    location="after"
                    options={{
                        text: "Salir",
                        type: "normal",
                        icon: "close",
                        onClick: handlePopupHide,
                        elementAttr: { class: "btn-salir-popup" }
                    }}
                />

                <div className="popup-container">
                    {/* Error general */}
                    {errors.general && (
                        <div className="field-error mb-2">{errors.general}</div>
                    )}

                    {/* FILA 1: Mutua y Año */}
                    <div className="popup-row">
                        <div className="popup-field">
                            <label>Mutua <span className="required">*</span></label>
                            <SelectBox
                                items={mutuasList}
                                value={formData.mutua}
                                onValueChanged={(e) => { setFormData({ ...formData, mutua: e.value }); clearFieldError('mutua'); }}
                                placeholder=""
                                isValid={!errors.mutua}
                            />
                            {errors.mutua && <div className="field-error">{errors.mutua}</div>}
                        </div>

                        <div className="popup-field">
                            <label>Año <span className="required">*</span></label>
                            <SelectBox
                                items={añosList}
                                value={formData.año}
                                onValueChanged={(e) => { setFormData({ ...formData, año: e.value }); clearFieldError('año'); }}
                                placeholder=""
                                isValid={!errors.año}
                            />
                            {errors.año && <div className="field-error">{errors.año}</div>}
                        </div>
                    </div>

                    {/* FILA 2: Acuerdo */}
                    <div className="popup-row">
                        <div className="popup-field">
                            <label>Acuerdo <span className="required">*</span></label>
                            <SelectBox
                                items={acuerdosTipos}
                                value={formData.tipoAcuerdoId}
                                displayExpr="nombre"
                                valueExpr="id"
                                onValueChanged={(e) => { setFormData({ ...formData, tipoAcuerdoId: e.value }); clearFieldError('tipoAcuerdoId'); }}
                                placeholder=""
                                isValid={!errors.tipoAcuerdoId}
                            />
                            {errors.tipoAcuerdoId && <div className="field-error">{errors.tipoAcuerdoId}</div>}
                        </div>
                        <div className="popup-field"></div>
                    </div>

                    {/* FILA 3: Fichero */}
                    <div className="popup-row mt-3">
                        <div className="popup-field full">
                            <label>Fichero <span className="required">*</span></label>
                            <div className={`file-uploader-custom${errors.fichero ? ' is-invalid' : ''}`}>
                                <input
                                    type="text"
                                    className="file-text-mock"
                                    placeholder="Seleccionar un archivo..."
                                    value={fileName}
                                    readOnly
                                />
                                <div className="file-btn-mock">
                                    <span>Examinar...</span>
                                    <input
                                        type="file"
                                        className="file-input-hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                            {errors.fichero && <div className="field-error">{errors.fichero}</div>}
                        </div>
                    </div>

                    {/* FILA 4: Usuario y Fecha de subida (solo lectura) */}
                    <div className="popup-row mt-2">
                        <div className="popup-field">
                            <label>Usuario</label>
                            <TextBox value={sessionUsuario} readOnly stylingMode="filled" />
                        </div>

                        <div className="popup-field">
                            <label>Fecha de Subida</label>
                            <TextBox value={new Date().toLocaleString()} readOnly stylingMode="filled" />
                        </div>
                    </div>
                </div>
            </Popup>
        </React.Fragment>
    );
};

export default PlantillasAcuerdos;
