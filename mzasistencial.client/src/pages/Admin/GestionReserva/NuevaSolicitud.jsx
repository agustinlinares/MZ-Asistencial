import React, { useState } from 'react';
import { Popup } from 'devextreme-react/popup';
import { TextBox, NumberBox, SelectBox, TextArea, Button } from 'devextreme-react';
import { useTranslation } from 'react-i18next';
import CitacionesService from '../../../services/admin/CitacionesService';
import notify from 'devextreme/ui/notify';
import { useLogError } from '../../../hooks/useLogError';

const NuevaSolicitud = ({ visible, onHiding, onSave, mutuaId }) => {
    const { t } = useTranslation();
    const logError = useLogError("Nueva solicitud");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        anio: new Date().getFullYear(),
        mes: new Date().getMonth() + 1,
        cantidad: 1,
        necesidad: '',
        especialidadId: null,
        servicioId: null,
        centroId: null
    });

    const handleSave = async () => {
        if (!formData.necesidad) {
            notify(t('Por favor, indique la necesidad de la solicitud'), 'error', 2000);
            return;
        }

        if (formData.anio < 2000 || formData.anio > 2100) {
            notify(t('El año debe estar entre 2000 y 2100'), 'error', 2000);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                Anio: formData.anio,
                Necesidad: formData.necesidad,
                Total: formData.cantidad,
                // Puedes añadir más campos si los selectbox estuvieran implementados
            };

            await CitacionesService.create(mutuaId, payload);
            
            notify(t('Solicitud creada correctamente'), 'success', 2000);
            onSave();
            onHiding();
        } catch (error) {
            logError(`Fallo al crear nueva solicitud para Mutua ID: ${mutuaId}, Año: ${formData.anio}`, error);
            
            console.error("Error guardando solicitud:", error);
            notify(t('Error al crear la solicitud'), 'error', 2000);
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div className="ficha-container-inline" role="region" aria-label={t('Nueva Solicitud de Citación')}>
            <div className="ficha-inline-content" tabIndex={-1}>
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">
                        <i className="ri-file-add-line"></i> {t('Nueva Solicitud de Citación')}
                    </span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={handleSave} disabled={loading}>
                            <i className="ri-save-line"></i> {t('Crear Solicitud')}
                        </button>
                        <button className="ficha-btn-secondary" onClick={onHiding}>
                            <i className="ri-close-line"></i> {t('Cancelar')}
                        </button>
                    </div>
                </div>

                <div className="ficha-content-premium" style={{ 
                    padding: '40px 20px', 
                    overflowY: 'auto', 
                    height: 'calc(100% - 60px)',
                    background: '#f1f5f9',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}>
                    <div className="form-card-premium" style={{ 
                        width: '100%',
                        maxWidth: '650px', 
                        background: '#ffffff', 
                        borderRadius: '12px', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e2e8f0',
                        padding: '35px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '25px'
                    }}>
                        <div style={{ borderBottom: '1px solid #edf2f7', paddingBottom: '18px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="ri-file-text-line" style={{ color: '#1a5fa8' }}></i>
                                {t('Datos de la Solicitud')}
                            </h3>
                            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                                {t('Complete los datos requeridos a continuación para iniciar el trámite de una nueva solicitud de citación.')}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group-premium" style={{ marginBottom: 0 }}>
                                <label style={{ color: '#1a5fa8', textTransform: 'uppercase', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em' }}>
                                    <i className="ri-calendar-line"></i> {t('Año de la Solicitud')}
                                </label>
                                <NumberBox 
                                    value={formData.anio} 
                                    onValueChanged={e => setFormData({...formData, anio: e.value})}
                                    className="premium-input"
                                    showSpinButtons={true}
                                />
                            </div>

                            <div className="input-group-premium" style={{ marginBottom: 0 }}>
                                <label style={{ color: '#1a5fa8', textTransform: 'uppercase', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em' }}>
                                    <i className="ri-numbers-line"></i> {t('Cantidad / Mensualidad')}
                                </label>
                                <NumberBox 
                                    min={1}
                                    value={formData.cantidad}
                                    onValueChanged={e => setFormData({...formData, cantidad: e.value})}
                                    className="premium-input"
                                    showSpinButtons={true}
                                />
                            </div>
                        </div>

                        <div className="input-group-premium" style={{ marginBottom: 0 }}>
                            <label style={{ color: '#1a5fa8', textTransform: 'uppercase', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em' }}>
                                <i className="ri-message-3-line"></i> {t('Necesidad / Concepto')}
                            </label>
                            <TextArea 
                                height={150}
                                value={formData.necesidad}
                                onValueChanged={e => setFormData({...formData, necesidad: e.value})}
                                placeholder={t('Ej: Urgencia dental, Tratamiento rehabilitador...')}
                                className="premium-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NuevaSolicitud;
