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
                        <i className="ri-file-text-line"></i> {t('Nueva Solicitud de Citación')}
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

                <div className="ficha-content-premium" style={{ padding: '25px', overflowY: 'auto', height: 'calc(100% - 60px)' }}>
                    <div className="form-section" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="input-group-premium">
                            <label><i className="ri-calendar-line"></i> {t('Año de la Solicitud')}</label>
                            <NumberBox 
                                value={formData.anio} 
                                onValueChanged={e => setFormData({...formData, anio: e.value})}
                                className="premium-input"
                                showSpinButtons={true}
                            />
                        </div>
                        
                        <div className="input-group-premium">
                            <label><i className="ri-message-3-line"></i> {t('Necesidad / Concepto')}</label>
                            <TextArea 
                                height={120}
                                value={formData.necesidad}
                                onValueChanged={e => setFormData({...formData, necesidad: e.value})}
                                placeholder={t('Ej: Urgencia dental, Tratamiento rehabilitador...')}
                                className="premium-input"
                            />
                        </div>

                        <div className="input-group-premium">
                            <label><i className="ri-numbers-line"></i> {t('Cantidad / Mensualidad')}</label>
                            <NumberBox 
                                min={1}
                                value={formData.cantidad}
                                onValueChanged={e => setFormData({...formData, cantidad: e.value})}
                                className="premium-input"
                                showSpinButtons={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NuevaSolicitud;
