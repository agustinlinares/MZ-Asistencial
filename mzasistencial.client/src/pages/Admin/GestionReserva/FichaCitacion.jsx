import React, { useState, useEffect } from 'react';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
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
    
    // Tabla de mensualidades
    const [mensualidades, setMensualidades] = useState([]);

    useEffect(() => {
        if (visible && citacion) {
            setContestacion(citacion.Contestacion || '');
            setConceder(null);
            
            // Construir los datos para la tabla de mensualidades
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
                },
                {
                    tipo: 'CITACION',
                    Ene: citacion.Ene, Feb: citacion.Feb, Mar: citacion.Mar, Abr: citacion.Abr,
                    May: citacion.May, Jun: citacion.Jun, Jul: citacion.Jul, Ago: citacion.Ago,
                    Sep: citacion.Sep, Oct: citacion.Oct, Nov: citacion.Nov, Dic: citacion.Diciembre,
                    Total: citacion.Total
                }
            ]);

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
                await CitacionesService.updateEstado(citacion.CitacionId, 2, contestacion); // 2 = Concedida
                notify(t('Citación concedida'), 'success', 2000);
            } else {
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

    if (!citacion) return null;

    const isPendiente = citacion.EstadoId === 1;

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
        <Popup
            visible={visible}
            onHiding={onHiding}
            dragEnabled={false}
            hideOnOutsideClick={true}
            showCloseButton={true}
            showTitle={true}
            title={modo === 'concesion' ? t('Gestión de Concesión') : t('Detalle de Solicitud')}
            width="85vw"
            height="90vh"
            wrapperAttr={{ class: 'ficha-global-popup' }}
        >
            <Position at="center" my="center" />
            {/* Header buttons */}
            <ToolbarItem location="after" options={{ icon: 'print', text: t('Imprimir Ficha'), onClick: handleImprimir, stylingMode: 'text' }} />
            {modo === 'concesion' && isPendiente && (
                <ToolbarItem location="after" options={{ icon: 'close', text: t('Rechazar cita'), onClick: handleRechazar, stylingMode: 'text', elementAttr: { style: 'color: #c62828;' } }} />
            )}
            {modo === 'concesion' && isPendiente && (
                <ToolbarItem location="after" options={{ icon: 'save', text: t('Guardar'), onClick: handleGuardarConcesion, stylingMode: 'contained', type: 'default' }} />
            )}
            <ToolbarItem location="after" options={{ icon: 'revert', text: t('Salir'), onClick: onHiding, stylingMode: 'text' }} />

            <div className="ficha-content-premium" style={{ padding: '15px 25px', overflowY: 'auto', height: 'calc(100% - 40px)' }}>
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
                     <div className="form-group" style={{ marginBottom: '20px' }}>
                         <label>{t('Contestación recibida:')}</label>
                         <TextArea readOnly height={80} value={citacion.Contestacion} />
                     </div>
                )}

                <div style={{ marginBottom: '30px' }}>
                    <DataGrid
                        dataSource={mensualidades}
                        showBorders={true}
                        showRowLines={true}
                        showColumnLines={true}
                        rowAlternationEnabled={true}
                    >
                        <Column dataField="tipo" caption="" width={120} />
                        <Column dataField="Ene" caption="Enero" alignment="center" />
                        <Column dataField="Feb" caption="Febrero" alignment="center" />
                        <Column dataField="Mar" caption="Marzo" alignment="center" />
                        <Column dataField="Abr" caption="Abril" alignment="center" />
                        <Column dataField="May" caption="Mayo" alignment="center" />
                        <Column dataField="Jun" caption="Junio" alignment="center" />
                        <Column dataField="Jul" caption="Julio" alignment="center" />
                        <Column dataField="Ago" caption="Agosto" alignment="center" />
                        <Column dataField="Sep" caption="Septiembre" alignment="center" />
                        <Column dataField="Oct" caption="Octubre" alignment="center" />
                        <Column dataField="Nov" caption="Noviembre" alignment="center" />
                        <Column dataField="Dic" caption="Diciembre" alignment="center" />
                        <Column dataField="Total" caption="Total" alignment="center" cssClass="font-weight-bold" />
                    </DataGrid>
                </div>

                <div>
                    <h5 style={{ borderBottom: '2px solid #1976d2', paddingBottom: '5px', marginBottom: '15px' }}>{t('Documentación anexa')}</h5>
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

                <div>
                    <h5 style={{ borderBottom: '2px solid #1976d2', paddingBottom: '5px', marginBottom: '15px' }}>{t('Historial de Cambios')}</h5>
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
        </Popup>
    );
};

export default FichaCitacion;
