import React, { useState, useEffect } from 'react';
import { DataGrid, Column, Paging, Toolbar, Item } from 'devextreme-react/data-grid';
import { TextBox, TextArea, RadioGroup, FileUploader, ProgressBar } from 'devextreme-react';
import { useTranslation } from 'react-i18next';
import notify from 'devextreme/ui/notify';
import CitacionesService from '../../../services/admin/CitacionesService';

const FichaCitacion = ({ visible, onHiding, citacion, modo, onSave }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [documentos, setDocumentos] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [conceder, setConceder] = useState(null);
    const [contestacion, setContestacion] = useState(citacion?.Contestacion || '');
    
    const [mensualidades, setMensualidades] = useState([]);
    const [citacionMeses, setCitacionMeses] = useState({
        Ene: 0, Feb: 0, Mar: 0, Abr: 0, May: 0, Jun: 0, Jul: 0, Ago: 0, Sep: 0, Oct: 0, Nov: 0, Dic: 0
    });

    useEffect(() => {
        if (visible && citacion) {
            setContestacion(citacion.Contestacion || '');
            setConceder(null);
            
            setMensualidades([
                {
                    tipo: 'RESERVA',
                    Ene: citacion.DemandaEne, Feb: citacion.DemandaFeb, Mar: citacion.DemandaMar, Abr: citacion.DemandaAbr,
                    May: citacion.DemandaMay, Jun: citacion.DemandaJun, Jul: citacion.DemandaJul, Ago: citacion.DemandaAgo,
                    Sep: citacion.DemandaSep, Oct: citacion.DemandaOct, Nov: citacion.DemandaNov, Dic: citacion.DemandaDic,
                    Total: citacion.DemandaTotal
                },
                {
                    tipo: 'CONSUMO',
                    Ene: citacion.ConsumoEne, Feb: citacion.ConsumoFeb, Mar: citacion.ConsumoMar, Abr: citacion.ConsumoAbr,
                    May: citacion.ConsumoMay, Jun: citacion.ConsumoJun, Jul: citacion.ConsumoJul, Ago: citacion.ConsumoAgo,
                    Sep: citacion.ConsumoSep, Oct: citacion.ConsumoOct, Nov: citacion.ConsumoNov, Dic: citacion.ConsumoDic,
                    Total: citacion.ConsumoTotal
                }
            ]);

            setCitacionMeses({
                Ene: citacion.Ene || 0, Feb: citacion.Feb || 0, Mar: citacion.Mar || 0, Abr: citacion.Abr || 0,
                May: citacion.May || 0, Jun: citacion.Jun || 0, Jul: citacion.Jul || 0, Ago: citacion.Ago || 0,
                Sep: citacion.Sep || 0, Oct: citacion.Oct || 0, Nov: citacion.Nov || 0, Dic: citacion.Diciembre || 0
            });

            cargarDocumentos(citacion.CitacionId);
            cargarHistorial(citacion.CitacionId);
        }
    }, [visible, citacion]);

    const cargarHistorial = async (id) => {
        try {
            const data = await CitacionesService.getHistorial(id);
            setHistorial(data);
        } catch (e) {
            console.error("Error cargando historial", e);
        }
    };

    const cargarDocumentos = async (id) => {
        try {
            const data = await CitacionesService.getDocumentos(id);
            setDocumentos(data);
        } catch (e) {
            console.error("Error cargando documentos", e);
        }
    };

    const handleImprimir = () => {
        window.print();
    };

    const handleRechazar = async () => {
        const motivo = window.prompt(t('Indica el motivo del rechazo:'));
        if (!motivo || !motivo.trim()) return;
        try {
            await CitacionesService.updateRechazo(citacion.CitacionId, motivo.trim());
            notify(t('Citación rechazada'), 'warning', 2000);
            onSave();
            onHiding();
        } catch {
            notify(t('Error al rechazar la citación'), 'error', 2000);
        }
    };

    const handleUploadDocumentos = async (e) => {
        const files = e.value;
        if (files && files.length > 0) {
            try {
                await CitacionesService.uploadDocumentos(citacion.CitacionId, files);
                notify(t('Documentos subidos correctamente'), 'success', 2000);
                cargarDocumentos(citacion.CitacionId);
                cargarHistorial(citacion.CitacionId);
                e.component.reset(); // clear uploader
            } catch {
                notify(t('Error al subir documentos'), 'error', 2000);
            }
        }
    };

    const handleDownloadDocumento = (e) => {
        CitacionesService.descargarDocumento(citacion.CitacionId, e.row.data.DocId);
    };

    const renderDownloadButton = (cellData) => {
        return (
            <i 
                className="dx-icon-download" 
                style={{ cursor: 'pointer', fontSize: '18px', color: '#1976d2' }} 
                onClick={() => handleDownloadDocumento(cellData)}
                title={t('Descargar')}
            ></i>
        );
    };

    const handleGuardarConcesion = async () => {
        if (conceder === null) {
            notify(t('Debe indicar si concede o no la citación'), 'error', 2000);
            return;
        }

        try {
            if (conceder === true) {
                // Aquí deberíamos pasar los meses si el backend lo soporta, o actualizar la citación
                const payload = {
                    ...citacionMeses,
                    Diciembre: citacionMeses.Dic
                };
                await CitacionesService.updateEstado(citacion.CitacionId, 2, contestacion, payload); // 2 = Concedida
                notify(t('Citación concedida'), 'success', 2000);
            } else {
                if (!contestacion || !contestacion.trim()) {
                    notify(t('Debe indicar el motivo del rechazo en la contestación'), 'error', 2000);
                    return;
                }
                await CitacionesService.updateRechazo(citacion.CitacionId, contestacion);
                notify(t('Citación rechazada'), 'warning', 2000);
            }
            onSave();
            cargarHistorial(citacion.CitacionId);
            onHiding();
        } catch {
            notify(t('Error al guardar'), 'error', 2000);
        }
    };

    const handleMesChange = (mes, value) => {
        const val = parseInt(value, 10) || 0;
        setCitacionMeses(prev => ({ ...prev, [mes]: val }));
    };

    const calcularTotalCitacion = () => {
        return Object.values(citacionMeses).reduce((acc, val) => acc + (parseInt(val, 10) || 0), 0);
    };

    if (!citacion) return null;

    const isPendiente = citacion.EstadoId === 1;
    const isConfirmada = citacion.EstadoId === 2;

    // Calcular SLA (96 horas)
    let hoursLeft = 0;
    let slaColor = '#1976d2';
    if (isPendiente && citacion.FechaAltaSolicitud) {
        const diffMs = new Date() - new Date(citacion.FechaAltaSolicitud);
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        hoursLeft = 96 - diffHrs;
        if (hoursLeft < 24) slaColor = '#c62828';
        else if (hoursLeft < 48) slaColor = '#f57c00';
    }

    return (
        <div className="ficha-container-inline" role="region" aria-label={t('Ficha Citación')}>
            <div className="ficha-inline-content" tabIndex={-1}>
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">
                        <i className="ri-file-text-line"></i> {modo === 'concesion' ? t('Gestión de Concesión') : t('Detalle de Solicitud')} | {citacion.CitacionId}
                    </span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-secondary" onClick={handleImprimir}>
                            <i className="ri-printer-line"></i> {t('Imprimir Ficha')}
                        </button>
                        
                        {isConfirmada && (
                            <button className="ficha-btn-secondary" style={{ color: '#c62828', borderColor: '#c62828' }} onClick={handleRechazar}>
                                <i className="ri-close-line"></i> {t('Rechazar cita')}
                            </button>
                        )}

                        {modo === 'concesion' && isPendiente && (
                            <button className="ficha-btn-primary" onClick={handleGuardarConcesion}>
                                <i className="ri-save-line"></i> {t('Guardar')}
                            </button>
                        )}
                        <button className="ficha-btn-secondary" onClick={onHiding}>
                            <i className="ri-close-line"></i> {t('Salir')}
                        </button>
                    </div>
                </div>

                <div className="ficha-content-premium" style={{ padding: '15px 25px', overflowY: 'auto', height: 'calc(100% - 60px)' }}>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px' }}>
                    <div className="form-group">
                        <label>{t('ID Citación')}</label>
                        <TextBox readOnly value={citacion.CitacionId?.toString()} />
                    </div>
                    <div className="form-group">
                        <label>{t('ID Demanda')}</label>
                        <TextBox readOnly value={citacion.DemandaId?.toString()} />
                    </div>
                    <div className="form-group">
                        <label>{t('Mutua Solicitante')}</label>
                        <TextBox readOnly value={citacion.MutuaSolicitante} />
                    </div>
                    <div className="form-group">
                        <label>{t('Mutua Ofertante')}</label>
                        <TextBox readOnly value={citacion.MutuaOfertante} />
                    </div>
                    
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>{t('Especialidad')}</label>
                        <TextBox readOnly value={citacion.Especialidad} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>{t('Servicio')}</label>
                        <TextBox readOnly value={citacion.Servicio} />
                    </div>

                    <div className="form-group">
                        <label>{t('Provincia')}</label>
                        <TextBox readOnly value={citacion.Provincia} />
                    </div>
                    <div className="form-group">
                        <label>{t('Localidad')}</label>
                        <TextBox readOnly value={citacion.Localidad} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>{t('Centro')}</label>
                        <TextBox readOnly value={citacion.Centro} />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 3' }}>
                        <label>{t('Dirección')}</label>
                        <TextBox readOnly value={citacion.Direccion} />
                    </div>
                    <div className="form-group">
                        <label>{t('Teléfono')}</label>
                        <TextBox readOnly value={citacion.Telefono} />
                    </div>

                    <div className="form-group">
                        <label>{t('Fecha Solicitud Citación')}</label>
                        <TextBox readOnly value={citacion.FechaAltaSolicitud ? new Date(citacion.FechaAltaSolicitud).toLocaleDateString() : ''} />
                    </div>
                    <div className="form-group">
                        <label>{t('Estado')}</label>
                        <TextBox readOnly value={citacion.Estado} />
                    </div>
                    <div className="form-group">
                        <label>{t('Fecha Respuesta Citación')}</label>
                        <TextBox readOnly value={citacion.FechaContestacion ? new Date(citacion.FechaContestacion).toLocaleDateString() : ''} />
                    </div>
                </div>

                {isPendiente && (
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: hoursLeft <= 0 ? '#ffebee' : '#f5f5f5', borderRadius: '8px', borderLeft: `5px solid ${hoursLeft <= 0 ? '#c62828' : slaColor}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ color: hoursLeft <= 0 ? '#c62828' : '#333' }}>
                                {hoursLeft <= 0 ? t('¡Atención! Plazo SLA Caducado') : t('Plazo de Respuesta (SLA: 96h)')}
                            </strong>
                            {hoursLeft > 0 && <span style={{ fontWeight: 'bold', color: slaColor }}>{hoursLeft}h restantes</span>}
                        </div>
                        {hoursLeft > 0 && (
                            <ProgressBar 
                                min={0} 
                                max={96} 
                                value={96 - hoursLeft} 
                                showStatus={false}
                                elementAttr={{ style: `height: 8px; margin-top: 10px;` }}
                            />
                        )}
                    </div>
                )}

                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label>{t('Necesidades para la Citación')}</label>
                    <TextArea readOnly height={80} value={citacion.Necesidad} />
                </div>

                {modo === 'concesion' && (
                    <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <label style={{ marginRight: '15px', fontWeight: 'bold' }}>{t('¿Conceder Citación?')}</label>
                            <RadioGroup 
                                items={[{ text: 'Sí', value: true }, { text: 'No', value: false }]} 
                                layout="horizontal" 
                                valueExpr="value"
                                displayExpr="text"
                                value={conceder}
                                onValueChanged={e => setConceder(e.value)}
                                readOnly={!isPendiente}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('Contestación a las Necesidades para la citación:')}</label>
                            <TextArea 
                                height={80} 
                                value={contestacion}
                                onValueChanged={e => setContestacion(e.value)}
                                readOnly={!isPendiente}
                            />
                        </div>
                    </div>
                )}
                {modo === 'solicitud' && citacion.Contestacion && (
                    <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{t('¿Solicitud Aceptada?')}</span>
                            <span>{citacion.EstadoId === 2 ? 'Sí' : 'No'}</span>
                        </div>
                        <div className="form-group">
                            <label>{t('Contestación a las Necesidades para la citación:')}</label>
                            <TextArea readOnly height={80} value={citacion.Contestacion} />
                        </div>
                    </div>
                )}

                <div style={{ marginBottom: '30px', overflowX: 'auto' }}>
                    <table className="tabla-mensualidades">
                        <thead>
                            <tr>
                                <th></th>
                                <th>{t('Enero')}</th><th>{t('Febrero')}</th><th>{t('Marzo')}</th><th>{t('Abril')}</th>
                                <th>{t('Mayo')}</th><th>{t('Junio')}</th><th>{t('Julio')}</th><th>{t('Agosto')}</th>
                                <th>{t('Septiembre')}</th><th>{t('Octubre')}</th><th>{t('Noviembre')}</th><th>{t('Diciembre')}</th>
                                <th>{t('Total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mensualidades.map((row, idx) => (
                                <tr key={idx}>
                                    <td className="row-header">{row.tipo}</td>
                                    <td><TextBox readOnly value={row.Ene?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Feb?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Mar?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Abr?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.May?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Jun?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Jul?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Ago?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Sep?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Oct?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Nov?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Dic?.toString() || '0'} className="mes-input" /></td>
                                    <td><TextBox readOnly value={row.Total?.toString() || '0'} className="mes-input total-input" /></td>
                                </tr>
                            ))}
                            <tr>
                                <td className="row-header">CITACION</td>
                                {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(mes => (
                                    <td key={mes}>
                                        <TextBox 
                                            readOnly={!(modo === 'concesion' && isPendiente && conceder === true)}
                                            value={citacionMeses[mes]?.toString()} 
                                            onValueChanged={(e) => handleMesChange(mes, e.value)}
                                            className="mes-input citacion-input" 
                                        />
                                    </td>
                                ))}
                                <td>
                                    <TextBox readOnly value={calcularTotalCitacion().toString()} className="mes-input total-input" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <div className="premium-tab">
                        {t('Documentación anexa')}
                    </div>
                    <div className="premium-tab-container">
                    <DataGrid
                        dataSource={documentos}
                        showBorders={true}
                        keyExpr="DocId"
                        rowAlternationEnabled={true}
                    >
                        <Paging defaultPageSize={5} />
                        <Column dataField="DocId" caption={t('Doc ID')} width={80} />
                        <Column dataField="Nombre" caption={t('Nombre Fichero')} />
                        <Column dataField="FechaAlta" caption={t('Fecha Alta')} dataType="date" format="dd/MM/yyyy HH:mm" />
                        <Column dataField="UsuarioAlta" caption={t('Usuario Alta')} />
                        <Column dataField="MutuaId" caption={t('Mutua')} />
                        <Column caption={t('Acciones')} cellRender={renderDownloadButton} width={100} alignment="center" />
                    </DataGrid>
                    
                    {modo === 'solicitud' && (
                        <div style={{ marginTop: '15px' }}>
                            <FileUploader 
                                selectButtonText={t('Seleccionar archivos')} 
                                labelText={t('o arrastre los archivos aquí')} 
                                accept="*" 
                                uploadMode="useButtons" 
                                multiple={true} 
                                onValueChanged={handleUploadDocumentos}
                            />
                        </div>
                    )}
                </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <div className="premium-tab" style={{ background: 'linear-gradient(135deg, #475569 0%, #334155 100%)' }}>
                        {t('Historial de Cambios')}
                    </div>
                    <div className="premium-tab-container" style={{ borderTop: '3px solid #334155' }}>
                    <DataGrid
                        dataSource={historial}
                        showBorders={true}
                        keyExpr="RegistroId"
                        rowAlternationEnabled={true}
                    >
                        <Paging defaultPageSize={5} />
                        <Column dataField="Fecha" caption={t('Fecha')} dataType="datetime" format="dd/MM/yyyy HH:mm:ss" width={150} sortOrder="desc" />
                        <Column dataField="UsuarioId" caption={t('Usuario')} width={100} />
                        <Column dataField="Accion" caption={t('Acción')} />
                    </DataGrid>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default FichaCitacion;
