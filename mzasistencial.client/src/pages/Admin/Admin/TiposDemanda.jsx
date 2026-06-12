import '../../../styles/FichaGlobal.css';

import React, { useEffect, useState, useRef } from 'react';

import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { jsPDF } from 'jspdf';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportDataGridToExcel } from 'devextreme/excel_exporter';

import { useTranslation } from 'react-i18next';

import { confirm as dxConfirm } from 'devextreme/ui/dialog';
import { TextBox } from 'devextreme-react/text-box';
import { SelectBox } from 'devextreme-react/select-box';
import { DateBox } from 'devextreme-react/date-box';
import { CheckBox } from 'devextreme-react/check-box';
import notify from 'devextreme/ui/notify';

import DataGrid, {
  Column, Paging, Pager, FilterRow, Selection, Export
} from 'devextreme-react/data-grid';

import { tiposDemandaService } from '@/services/admin/TiposDemandaService';

// Generador del array de años dinámico (limitado estrictamente al año actual)
const AÑOS_DISPONIBLES = (() => {
    const añoActual = new Date().getFullYear();
    return Array.from({ length: añoActual - 2015 + 1 }, (_, i) => 2015 + i).reverse();
})();

// Función auxiliar para convertir ISO a YYYY-MM-DD para el <input type="date">
const parseDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) return dateStr.split('T')[0];
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        const dia = parts[0].padStart(2, '0');
        const mes = parts[1].padStart(2, '0');
        const ano = parts[2];
        return `${ano}-${mes}-${dia}`;
    }
    return dateStr;
};

// Calcular si la fecha de hoy entra en el rango
const calcularSiEsActivo = (fechaDesdeStr, fechaHastaStr) => {
    if (!fechaDesdeStr || !fechaHastaStr) return false;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const desde = new Date(fechaDesdeStr);
    desde.setHours(0, 0, 0, 0);

    const hasta = new Date(fechaHastaStr);
    hasta.setHours(0, 0, 0, 0);

    return hoy >= desde && hoy <= hasta;
};

const formatToDateOnly = (dateSource) => {
    if (!dateSource) return null;
    const date = new Date(dateSource);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const TiposDemanda = () => {
    const { t } = useTranslation();
    
    const gridRef = useRef(null);
    const menuRef = useRef(null);
    const [gridInstance, setGridInstance] = useState(null);
    
    const [dataSource, setDataSource] = useState([]);
    const [auxTipos, setAuxTipos] = useState([]);
    
    const [menuAccionesAbierto, setMenuAccionesAbierto] = useState(false);
    const [vistaActual, setVistaActual] = useState('grid');
    
    // Estado del formulario
    const [form, setForm] = useState({});
    // Estado de errores (para la clase 'error' de FichaGlobal)
    const [errors, setErrors] = useState({});

    useEffect(() => {
        cargarDatosPrincipales();
        tiposDemandaService.getAuxiliar()
            .then(setAuxTipos)
            .catch(err => console.error("Fallo al cargar auxiliares", err));
    }, []);

    const cargarDatosPrincipales = async () => {
        try {
            const data = await tiposDemandaService.getAll();
            setDataSource(data);
        } catch (error) {
            console.error("Error al cargar la tabla principal", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuAccionesAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Exportaciones 
    const exportarManualExcel = (soloSeleccionados) => {
        if (!gridInstance) return;
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('TiposDemanda');
        exportDataGridToExcel({
            component: gridInstance, worksheet, autoFilterEnabled: true, selectedRowsOnly: soloSeleccionados
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'TiposDemanda.xlsx');
            });
        });
    };

    const exportarManualPDF = () => {
        if (!gridInstance) return;
        const doc = new jsPDF();
        exportDataGridToPdf({
            jsPDFDocument: doc, component: gridInstance, indent: 5,
        }).then(() => doc.save('TiposDemanda.pdf'));
    };

    // Lógica de la Ficha 
    const abrirFichaNueva = () => {
        setForm({ activo: true, año: "" }); 
        setErrors({});
        setVistaActual('ficha');
        setMenuAccionesAbierto(false);
    };

    const abrirFichaEdicion = (data) => {
        setForm({
            ...data,
            periodoDesde: data.periodoDesde ? new Date(data.periodoDesde) : null,
            periodoHasta: data.periodoHasta ? new Date(data.periodoHasta) : null
        });
        setErrors({});
        setVistaActual('ficha');
    };

    const cerrarFicha = () => {
        setVistaActual('grid');
        setForm({});
        setErrors({});
    };

    const handleChange = (field, value) => {
        setForm(prev => {
            const nuevosDatos = { ...prev, [field]: value };

            // Si cambia la fecha inicial, extraemos el Año automáticamente
            if (field === 'periodoDesde' && value) {
                const fecha = new Date(value);
                if (!isNaN(fecha.getTime())) {
                    nuevosDatos.año = fecha.getFullYear();
                } else {
                    nuevosDatos.año = "";
                }
            }

            // Si cambia cualquier fecha, recalcula Activo
            if (field === 'periodoDesde' || field === 'periodoHasta') {
                if (nuevosDatos.periodoDesde && nuevosDatos.periodoHasta) {
                    nuevosDatos.activo = calcularSiEsActivo(nuevosDatos.periodoDesde, nuevosDatos.periodoHasta);
                }
            }

            return nuevosDatos;
        });

        // Limpiamos el error visual al instante si el usuario escribe
        if (errors[field] && value) {
            setErrors(prev => ({ ...prev, [field]: false }));
            if (field === 'periodoDesde') setErrors(prev => ({ ...prev, año: false }));
        }
    };

    const handleSave = async () => {
        const newErrors = {};
        const camposFaltantes = [];

        if (!form.año) { newErrors.año = true; camposFaltantes.push(t('Año')); }
        if (!form.nombre?.trim()) { newErrors.nombre = true; camposFaltantes.push(t('Nombre')); }
        if (!form.tipoId) { newErrors.tipoId = true; camposFaltantes.push(t('Tipo demanda')); }
        if (!form.periodoDesde) { newErrors.periodoDesde = true; camposFaltantes.push(t('Periodo Vigencia Desde')); }
        if (!form.periodoHasta) { newErrors.periodoHasta = true; camposFaltantes.push(t('Periodo Vigencia Hasta')); }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            let mensajeError = camposFaltantes.length === 1 
                ? `${t('Falta rellenar el campo obligatorio')}: ${camposFaltantes[0]}`
                : t('Hay varios campos obligatorios sin rellenar.');
            
            notify(mensajeError, 'error', 4500);
            return;
        }

        // Formateamos las fechas a string 'YYYY-MM-DD' justo antes de enviar a la API
        const payload = {
            ...form,
            periodoDesde: formatToDateOnly(form.periodoDesde),
            periodoHasta: formatToDateOnly(form.periodoHasta)
        };

        try {
            if (form.tipoDemandaId) {
                await tiposDemandaService.update(form.tipoDemandaId, payload);
                notify(t('Registro actualizado correctamente'), 'success', 3000);
            } else {
                await tiposDemandaService.create(payload);
                notify(t('Registro creado correctamente'), 'success', 3000);
            }
            cerrarFicha();
            cargarDatosPrincipales();
        } catch (error) {
            console.error("Error al guardar:", error);
            notify(t("Error interno al guardar en la base de datos."), 'error', 4500);
        }
    };

    const handleDelete = async (id) => {
        const ok = await dxConfirm(t('¿Está seguro de que desea eliminar este registro?'), t('Confirmar eliminación'));
        if (ok) {
            try {
                await tiposDemandaService.delete(id);
                cargarDatosPrincipales();
                notify(t('Registro eliminado'), 'success', 3000);
            } catch (error) {
                notify(t("No se pudo eliminar el registro."), 'error', 4500);
            }
        }
    };

    // Vista ficha
    if (vistaActual === 'ficha') {
        return (
            <div className="ficha-container-inline">
                <div className="ficha-inline-content">
                    
                    <div className="ficha-modal-header">
                        <span className="ficha-modal-title">
                            Ficha Tipo Demanda | {form.tipoDemandaId ? 'Editar' : 'Nuevo'}
                        </span>
                        <div className="ficha-header-btns">
                            <button className="ficha-btn-primary" onClick={handleSave}>Aceptar</button>
                            <button className="ficha-btn-secondary" onClick={cerrarFicha}>Salir</button>
                        </div>
                    </div>

                    <div className="ficha-tab-content">
                        <div className="ficha-grid">
                            
                            <div className="ficha-field">
                                <label>{t('Año')} *</label>
                                {/* HTML Nativo: Hereda tu clase 'readonly' perfectamente */}
                                <input 
                                    className={`readonly ${errors.año ? 'error' : ''}`} 
                                    type="text" 
                                    value={form.año || ''} 
                                    readOnly 
                                    placeholder={t('Se calcula automáticamente')} 
                                />
                            </div>

                            <div className="ficha-field">
                                <label>{t('Nombre')} *</label>
                                <input 
                                    className={errors.nombre ? 'error' : ''} 
                                    type="text" 
                                    value={form.nombre || ''} 
                                    onChange={e => handleChange('nombre', e.target.value)} 
                                />
                            </div>

                            <div className="ficha-field">
                                <label>{t('Tipo Demanda')} *</label>
                                <select 
                                    className={errors.tipoId ? 'error' : ''} 
                                    value={form.tipoId || ''} 
                                    onChange={e => handleChange('tipoId', e.target.value)}
                                >
                                    <option value="">Seleccionar</option>
                                    {auxTipos.map(t => <option key={t.tipoId} value={t.tipoId}>{t.tipo}</option>)}
                                </select>
                            </div>

                            <div className="ficha-field" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <label>{t('Activo')}</label>
                                <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '8px' }}>
                                    <CheckBox
                                        value={form.activo}
                                        readOnly={true} 
                                    />
                                </div>
                            </div>

                            <div className="ficha-field">
                                <label>{t('Fecha Vigencia Desde')} *</label>
                                <DateBox
                                    className={errors.periodoDesde ? 'error' : ''}
                                    value={form.periodoDesde}
                                    onValueChanged={e => handleChange('periodoDesde', e.value)}
                                    displayFormat="dd/MM/yyyy"
                                    useMaskBehavior={true}
                                />
                            </div>

                            <div className="ficha-field">
                                <label>{t('Fecha Vigencia Hasta')} *</label>
                                <DateBox
                                    className={errors.periodoHasta ? 'error' : ''}
                                    value={form.periodoHasta}
                                    onValueChanged={e => handleChange('periodoHasta', e.value)}
                                    displayFormat="dd/MM/yyyy"
                                    useMaskBehavior={true}
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // Vista tabla
    return (
        <React.Fragment>
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
            
            <div className="header-page" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="title">{t('Tipos de demanda')}</div>
                
                <div className="acciones-container" ref={menuRef} style={{ position: 'relative' }}>
                <div className="acciones-btn" onClick={() => setMenuAccionesAbierto(v => !v)} style={{ cursor: 'pointer', padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ri-settings-3-line"></i> {t('Acciones')}
                </div>

                {menuAccionesAbierto && (
                    <div className="acciones-menu" style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', border: '1px solid #ccc', zIndex: 1000, minWidth: '250px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <div className="acciones-item" onClick={abrirFichaNueva} style={{ padding: '10px', cursor: 'pointer', display: 'flex', gap: '10px' }}>
                            <i className="ri-add-line" style={{ color: '#1a5fa8' }}></i> {t('Nuevo tipo de demanda')}
                        </div>
                        <div className="acciones-item" onClick={() => { exportarManualExcel(false); setMenuAccionesAbierto(false); }} style={{ padding: '10px', cursor: 'pointer', display: 'flex', gap: '10px' }}>
                            <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i> {t('Exportar todo a Excel')}
                        </div>
                        <div className="acciones-item" onClick={() => { exportarManualExcel(true); setMenuAccionesAbierto(false); }} style={{ padding: '10px', cursor: 'pointer', display: 'flex', gap: '10px' }}>
                            <i className="ri-file-excel-2-fill" style={{ color: '#2e7d32' }}></i> {t('Exportar seleccionadas (Excel)')}
                        </div>
                        <div className="acciones-item" onClick={() => { exportarManualPDF(); setMenuAccionesAbierto(false); }} style={{ padding: '10px', cursor: 'pointer', display: 'flex', gap: '10px' }}>
                            <i className="ri-file-pdf-line" style={{ color: '#d32f2f' }}></i> {t('Exportar todo a PDF')}
                        </div>
                    </div>
                )}
                </div>
            </div>

            <DataGrid
                ref={gridRef}
                onInitialized={(e) => setGridInstance(e.component)}
                dataSource={dataSource}
                keyExpr="tipoDemandaId"
                showBorders={true}
                rowAlternationEnabled={true}
                allowColumnReordering={true}
            >
                <Selection mode="multiple" showCheckBoxesMode="always" />
                <FilterRow visible={true} />
                <Paging defaultPageSize={10} />
                <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} showInfo={true} />
                <Export enabled={false} />

                <Column dataField="tipoDemandaId" caption="Código" width={90} alignment="center" />
                <Column dataField="año" caption="Año" width={90} alignment="center" />
                <Column dataField="nombre" caption="Tipo de Demanda" />
                <Column dataField="periodoDesde" caption="Fecha Desde" dataType="date" format="dd/MM/yyyy" alignment="center" />
                <Column dataField="periodoHasta" caption="Fecha Hasta" dataType="date" format="dd/MM/yyyy" alignment="center" />
                <Column dataField="activo" caption="Activa" alignment="center" width={100} cellRender={(data) => data.value ? "Sí" : "No"} />

                <Column
                    caption={t('ACCIONES')}
                    width={100}
                    fixed={true}
                    fixedPosition="right"
                    alignment="center"
                    cellRender={(cellData) => (
                        <div className="ficha-row-actions" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <i 
                                className="ri-edit-line edit-icon" 
                                style={{ color: '#1a5fa8', cursor: 'pointer', fontSize: '18px' }}
                                title={t('Editar')}
                                onClick={(e) => { e.stopPropagation(); abrirFichaEdicion(cellData.data); }}
                            />
                            <i 
                                className="ri-delete-bin-line delete-icon" 
                                style={{ color: '#d32f2f', cursor: 'pointer', fontSize: '18px' }}
                                title={t('Eliminar')}
                                onClick={(e) => { e.stopPropagation(); handleDelete(cellData.data.tipoDemandaId); }}
                            />
                        </div>
                    )}
                />
            </DataGrid>

            </div>
        </div>
        </React.Fragment>
    );
};

export default TiposDemanda;