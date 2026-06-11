import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './ICG.css';
import '../../../styles/FichaGlobal.css'; // Aplicamos estilo premium y estandarizado
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useLogError } from '../../../hooks/useLogError';
import { useNavigate } from "react-router-dom";
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    FilterRow,
    HeaderFilter,
    Selection,
    Grouping,
    GroupPanel,
    ColumnChooser,
    Export,
    Scrolling,
    Sorting,
    FilterPanel,
    ColumnFixing,
    Pager,
    Toolbar,
    Item
} from "devextreme-react/data-grid";
import { SelectBox } from "devextreme-react/select-box";
import { Popup } from "devextreme-react/popup";
import { FileUploader } from "devextreme-react/file-uploader";
import { LoadPanel } from 'devextreme-react/load-panel';
import { useTranslation } from "react-i18next";
import notify from "devextreme/ui/notify";
import { custom } from 'devextreme/ui/dialog';
import PlantillasICGService from "../../../services/admin/PlantillasICGService";

// Las constantes harcodeadas se han eliminado para obtenerlas de forma dinámica

// Utility para sacar info del usuario actual
const getUserInfo = () => {
    try {
        const user = JSON.parse(localStorage.getItem('UsuarioActual') || sessionStorage.getItem('user') || '{}');
        const isAdmin = user.perfilId === 1 || user.perfilID === 1 || user.rol === 'Administrador' || user.Rol === 'Administrador' || user.perfil === 'Administrador';
        return {
            nombre: user.nombre || user.Nombre || 'Usuario',
            mutua: user.mutua || user.Mutua || '',
            isAdmin
        };
    } catch {
        return { nombre: 'Usuario', mutua: '', isAdmin: false };
    }
};

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
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PlantillasICG.xlsx');
        });
    })
    e.cancel = true;
};

const ICGPlantillasICG = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const navigate = useNavigate();

    // Estado local del usuario
    const userInfo = getUserInfo();

    // Datos Dinámicos
    const [tiposLista, setTiposLista] = useState([]);
    const [mutuasLista, setMutuasLista] = useState([]);
    const [aniosLista, setAniosLista] = useState([]);
    const [plantillasLista, setPlantillasLista] = useState([]);

    // Filtros Generales
    const [tipo, setTipo] = useState("");
    const [mutua, setMutua] = useState(null);
    const [anio, setAnio] = useState(new Date().getFullYear().toString());
    const [plantilla, setPlantilla] = useState("CSV");

    // Grid Data
    const [informes, setInformes] = useState([]);
    const [cargando, setCargando] = useState(false);

    const logError = useLogError("Plantillas ICG");

    // Modal de Subir Plantilla
    const [popupVisible, setPopupVisible] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        mutua: "",
        anio: new Date().getFullYear().toString(),
        tipoICG: "",
        fichero: null,
        usuario: userInfo.nombre,
        fechaSubida: new Date().toLocaleString()
    });

    // Helper: Saber si la mutua es obligatoria según el tipo
    const isMutuaRequired = (tipoSeleccionado) => {
        return ["ICG06", "ICG07", "FINCAS"].includes(tipoSeleccionado);
    };

    // Carga inicial (Valores por defecto)
    useEffect(() => {
        const fetchDatosIniciales = async () => {
            try {
                const datos = await PlantillasICGService.getDatosIniciales();
                setTiposLista(datos.tipos || []);
                setMutuasLista(datos.mutuas || []);
                setAniosLista(datos.anios || []);
                setPlantillasLista(datos.plantillas || []);

                const currentAnio = new Date().getFullYear().toString();
                setAnio(currentAnio);
                setUploadForm(prev => ({ ...prev, anio: currentAnio }));
                
                if (datos.tipos && datos.tipos.length > 0) {
                    setTipo(datos.tipos[2] || datos.tipos[0]); // Por defecto FINCAS si existe, si no el primero
                }
                
                if (!userInfo.isAdmin && userInfo.mutua) {
                    const mutuaMatch = datos.mutuas?.find(m => m.nombre === userInfo.mutua);
                    if (mutuaMatch) {
                        setMutua(mutuaMatch.id);
                        setUploadForm(prev => ({ ...prev, mutua: mutuaMatch.id }));
                    }
                }
            } catch (error) {
                logError("Fallo al inicializar datos del formulario de plantillas", error);
                console.error("Error al cargar datos iniciales:", error);
            }
        };
        fetchDatosIniciales();
    }, []);

    // Cargar la Grid
    const cargarGrid = async () => {
        try {
            setCargando(true);
            const data = await PlantillasICGService.getInformes(mutua, anio);
            setInformes(data);
        } catch (error) {
            logError(`Fallo al cargar informes (Mutua: ${mutua}, Año: ${anio})`, error);
            // Si el backend aún no está listo, ponemos una tabla vacía para no bloquear la UI
            setInformes([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarGrid();
    }, [mutua, anio]);

    const handleGenerarPlantilla = async () => {
        // Validaciones: Tipos 1, 2, 3 obligan a Mutua y Tipo
        const tiposEstrictos = ["ICG06", "ICG07", "FINCAS"];
        
        if (!tipo) {
            notify(t("Debe seleccionar el Tipo de ICG"), "error", 3000);
            return;
        }

        if (tiposEstrictos.includes(tipo)) {
            if (!mutua) {
                notify(t("Debe seleccionar una Mutua para este tipo de ICG"), "error", 3000);
                return;
            }
            if (!anio) {
                notify(t("Debe seleccionar un Año para este tipo de ICG"), "error", 3000);
                return;
            }
        }

        try {
            setCargando(true);
            await PlantillasICGService.generarPlantilla(mutua, anio, tipo, plantilla);
            notify(t("Plantilla descargada correctamente"), "success", 2000);
        } catch (error) {
            logError(`Fallo al generar plantilla para Mutua: ${mutua}, Año: ${anio}, Tipo: ${tipo}`, error);
            notify(error.message, "error", 4000);
        } finally {
            setCargando(false);
        }
    };

    const handleProcesarPlantillas = async () => {
        try {
            setCargando(true);
            await PlantillasICGService.procesarPlantillas();
            notify(t("Plantillas procesadas correctamente"), "success", 2000);
            cargarGrid();
        } catch (error) {
            logError("Fallo crítico al procesar todas las plantillas en lote", error);
            notify(error.message, "error", 4000);
        } finally {
            setCargando(false);
        }
    };

    const handleSubirAceptar = async () => {
        // Validaciones obligatorias en orden (respetando la regla de mutua opcional)
        if (isMutuaRequired(uploadForm.tipoICG) && !uploadForm.mutua) {
            notify(t("Mutua seleccionada obligatoria"), "error", 3000);
            return;
        }
        if (!uploadForm.anio) {
            notify(t("Año seleccionado obligatorio"), "error", 3000);
            return;
        }
        if (!uploadForm.tipoICG) {
            notify(t("Tipo de ICG seleccionado obligatorio"), "error", 3000);
            return;
        }
        if (!uploadForm.fichero) {
            notify(t("Fichero adjuntado obligatorio"), "error", 3000);
            return;
        }

            try {
            setCargando(true);
            const formData = new FormData();
            if (uploadForm.mutua) formData.append('mutuaId', uploadForm.mutua);
            formData.append('anio', uploadForm.anio);
            formData.append('tipoICG', uploadForm.tipoICG);
            formData.append('fichero', uploadForm.fichero);

            await PlantillasICGService.subirPlantilla(formData);
            
            notify(t("Fichero subido correctamente"), "success", 2000);
            setPopupVisible(false);
            setUploadForm({ ...uploadForm, fichero: null });
            cargarGrid();
        } catch (error) {
            logError(`Fallo al subir fichero para Tipo ICG: ${uploadForm.tipoICG}, Año: ${uploadForm.anio}`, error);
            notify(error.message, "error", 4000);
        } finally {
            setCargando(false);
        }
    };

    const handleDelete = async (row) => {
        let dialog = custom({
            title: t("Confirmar eliminación"),
            messageHtml: `${t("¿Estás seguro de que deseas eliminar el informe")} <b>${row.data.Informe}</b>?`,
            buttons: [{
                text: t("Sí, eliminar"),
                type: "danger",
                onClick: (e) => { return true; }
            }, {
                text: t("Cancelar"),
                onClick: (e) => { return false; }
            }]
        });

        const dialogResult = await dialog.show();
        if (dialogResult) {
            try {
                setCargando(true);
                await PlantillasICGService.eliminarPlantilla(row.data.Id);
                notify(t("Informe eliminado correctamente"), "success", 2000);
                cargarGrid();
            } catch (error) {
                logError(`Fallo al eliminar informe ID: ${row.data.Id}`, error);
                notify(error.message, "error", 4000);
            } finally {
                setCargando(false);
            }
        }
    };

    return (
        <React.Fragment>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                position={{ of: '#root' }}
                visible={cargando}
                showIndicator={true}
                showPane={true}
                shading={true}
                message={t("Cargando...")}
            />
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">
                    
                    {/* ENCABEZADO */}
                    <div className="header-page">
                        <div className="title">
                            {t('PLANTILLAS ICG')}
                        </div>
                        <div className="header-actions-side" style={{ display: 'flex', gap: '15px' }}>
                            <button className="acciones-btn" onClick={() => setPopupVisible(true)}>
                                <i className="ri-file-upload-line" style={{ color: '#1a5fa8' }}></i> {t('Subir Plantilla')}
                            </button>
                            <button className="acciones-btn" onClick={handleProcesarPlantillas}>
                                <i className="ri-settings-4-line" style={{ color: '#1a5fa8' }}></i> {t('Procesar Plantillas')}
                            </button>
                        </div>
                    </div>

                    {/* DATOS GENERALES (Filtros) */}
                    <div className="ficha-section" style={{ padding: "20px 25px 0 25px", marginBottom: "15px" }}>
                        <p className="ficha-section-title" style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px" }}>
                            <i className="ri-folder-info-line"></i> {t('Datos Generales')}
                        </p>
                        <div className="ficha-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                            <div className="ficha-field">
                                <label>{t('Tipo')}</label>
                                <SelectBox
                                    items={tiposLista}
                                    value={tipo}
                                    onValueChanged={(e) => setTipo(e.value)}
                                    placeholder={t("Seleccionar Tipo")}
                                />
                            </div>
                            <div className="ficha-field">
                                <label>{t('Mutua')}</label>
                                <SelectBox
                                    items={mutuasLista}
                                    value={mutua}
                                    valueExpr="id"
                                    displayExpr="nombre"
                                    onValueChanged={(e) => setMutua(e.value)}
                                    placeholder={t("Seleccionar Mutua")}
                                    showClearButton={true}
                                    disabled={!isMutuaRequired(tipo) || (!userInfo.isAdmin && !!userInfo.mutua)}
                                />
                            </div>
                            <div className="ficha-field">
                                <label>{t('Año')}</label>
                                <SelectBox
                                    items={aniosLista}
                                    value={anio}
                                    onValueChanged={(e) => setAnio(e.value)}
                                    placeholder={t("Seleccionar Año")}
                                />
                            </div>
                            <div className="ficha-field">
                                <label>{t('Plantilla')}</label>
                                <SelectBox
                                    items={plantillasLista}
                                    value={plantilla}
                                    onValueChanged={(e) => setPlantilla(e.value)}
                                />
                            </div>
                        </div>

                        {/* Botones de acción de filtros */}
                        <div style={{ display: "flex", gap: "15px", marginTop: "20px", justifyContent: "flex-end" }}>
                            <button className="ficha-btn-primary" onClick={handleGenerarPlantilla}>
                                <i className="ri-file-download-line"></i> {t('Generar Plantilla')}
                            </button>
                        </div>
                    </div>

                    {/* GRID DE DATOS */}
                    <div className="table-container">
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={informes}
                            keyExpr="Id"
                            showBorders={true}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            onExporting={onExporting}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
                            hoverStateEnabled={true}
                            noDataText={cargando ? t("Cargando...") : t("No hay datos")}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={25} />
                            <Pager visible={true} allowedPageSizes={[10, 25, 50, 100]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible searchMode='contains' />
                            <Selection mode="multiple" allowSelectAll />
                            <Grouping autoExpandAll={false} contextMenuEnabled={true} />
                            <GroupPanel visible={true} emptyPanelText={t('Arrastre una columna aquí para agrupar por dicha columna')} />
                            <ColumnChooser enabled mode="select" />
                            <Export enabled fileName="PlantillasICG" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <ColumnFixing enabled />

                            <Column dataField="Informe" caption={t('Informe')} width={280} />
                            <Column dataField="ResultadoInforme" caption={t('Resultado Informe')} width={150} />
                            <Column dataField="EstadoInforme" caption={t('Estado Informe')} width={180} />
                            <Column dataField="TipoICG" caption={t('TipoICG')} width={100} />
                            <Column dataField="Mutua" caption={t('Mutua')} width={150} />
                            <Column dataField="Anio" caption={t('Año')} width={100} />
                            <Column dataField="Mes" caption={t('Mes')} width={120} />
                            <Column dataField="Usuario" caption={t('Usuario')} width={150} />
                            <Column dataField="FechaAlta" caption={t('Fecha Alta')} dataType="datetime" format="dd/MM/yyyy HH:mm:ss" width={180} />
                            
                            <Column
                                caption={t('Acciones')}
                                width={80}
                                fixed={true}
                                fixedPosition="right"
                                alignment="center"
                                cellRender={(cell) => (
                                    <div className="ficha-row-actions">
                                        <i 
                                            className="ri-delete-bin-line delete-icon" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(cell);
                                            }}
                                            title={t('Eliminar')}
                                        />
                                    </div>
                                )}
                            />
                        </DataGrid>
                    </div>

                </div>
            </div>

            {/* MODAL FICHA DOC. ADJUNTO */}
            <Popup
                visible={popupVisible}
                onHiding={() => setPopupVisible(false)}
                dragEnabled={true}
                hideOnOutsideClick={false}
                showCloseButton={false}
                showTitle={false}
                width={650}
                height="auto"
                wrapperAttr={{ class: "ficha-popup-wrapper" }}
            >
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title" style={{ fontSize: "16px", fontWeight: "bold", textTransform: "uppercase" }}>
                        {t('FICHA DOC. ADJUNTO')}
                    </span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={handleSubirAceptar}>
                            <i className="ri-check-line"></i> {t('Aceptar')}
                        </button>
                        <button className="ficha-btn-secondary" onClick={() => setPopupVisible(false)}>
                            <i className="ri-close-line"></i> {t('Salir')}
                        </button>
                    </div>
                </div>
                
                <div style={{ padding: "20px" }}>
                    <div className="ficha-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: "15px" }}>
                        <div className="ficha-field">
                            <label>{t('Tipo ICG')}</label>
                            <SelectBox
                                items={tiposLista}
                                value={uploadForm.tipoICG}
                                onValueChanged={(e) => {
                                    setUploadForm(prev => {
                                        const newForm = {...prev, tipoICG: e.value};
                                        if (!isMutuaRequired(e.value)) {
                                            newForm.mutua = null; // Limpiamos la mutua si no hace falta
                                        }
                                        return newForm;
                                    });
                                }}
                                placeholder=""
                            />
                        </div>
                        <div className="ficha-field">
                            <label>{t('Mutua')}</label>
                            <SelectBox
                                items={mutuasLista}
                                value={uploadForm.mutua}
                                valueExpr="id"
                                displayExpr="nombre"
                                onValueChanged={(e) => setUploadForm({...uploadForm, mutua: e.value})}
                                placeholder=""
                                disabled={!isMutuaRequired(uploadForm.tipoICG) || (!userInfo.isAdmin && !!userInfo.mutua)}
                            />
                        </div>
                    </div>
                    
                    <div className="ficha-grid" style={{ gridTemplateColumns: "1fr", marginBottom: "15px" }}>
                        <div className="ficha-field">
                            <label>{t('Año')}</label>
                            <SelectBox
                                items={aniosLista}
                                value={uploadForm.anio}
                                onValueChanged={(e) => setUploadForm({...uploadForm, anio: e.value})}
                                placeholder=""
                            />
                        </div>
                    </div>

                    <div className="ficha-grid" style={{ gridTemplateColumns: "1fr", marginBottom: "15px" }}>
                        <div className="ficha-field">
                            <label>{t('Fichero')}</label>
                            <div className="uploader-btn-derecha" style={{ border: "1px solid #d1d5db", padding: "5px", borderRadius: "6px", backgroundColor: "#fff" }}>
                                <FileUploader
                                    selectButtonText={t('Examinar...')}
                                    labelText={t('Ningún archivo seleccionado')}
                                    accept=".csv, .xml"
                                    uploadMode="useForm"
                                    onValueChanged={(e) => {
                                        setUploadForm({...uploadForm, fichero: e.value[0]});
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="ficha-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        <div className="ficha-field">
                            <label>{t('Usuario')}</label>
                            <input type="text" value={uploadForm.usuario} readOnly className="ficha-input-readonly" style={{ backgroundColor: "#eef5fd" }} />
                        </div>
                        <div className="ficha-field">
                            <label>{t('Fecha de Subida')}</label>
                            <input type="text" value={uploadForm.fechaSubida} readOnly className="ficha-input-readonly" style={{ backgroundColor: "#eef5fd" }} />
                        </div>
                    </div>
                </div>
            </Popup>
        </React.Fragment>
    );
};

export default ICGPlantillasICG;