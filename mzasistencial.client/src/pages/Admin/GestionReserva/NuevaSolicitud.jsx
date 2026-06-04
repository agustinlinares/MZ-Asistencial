import React, { useState } from 'react';
import { Popup } from 'devextreme-react/popup';
import { TextBox, NumberBox, SelectBox, TextArea, Button } from 'devextreme-react';
import { useTranslation } from 'react-i18next';
import CitacionesService from '../../../services/admin/CitacionesService';
import notify from 'devextreme/ui/notify';
import { useLogError } from '../../../hooks/useLogError';

const NuevaSolicitud = ({ visible, onHiding, onSave, mutuaId }) => {
    const { t } = useTranslation();
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

    return (
        <Popup
            visible={visible}
            onHiding={onHiding}
            dragEnabled={false}
            hideOnOutsideClick={true}
            showCloseButton={true}
            showTitle={true}
            title={t('Nueva Solicitud de Citación')}
            container=".file-box"
            width={550}
            height="auto"
            wrapperAttr={{ class: 'nueva-solicitud-popup' }}
        >
            <div className="nueva-solicitud-content">
                <div className="form-section">
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
                            height={110}
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

                <div className="modal-footer-premium">
                    <Button 
                        text={t('Cancelar')} 
                        onClick={onHiding}
                        className="btn-cancel-premium"
                    />
                    <Button 
                        text={t('Crear Solicitud')} 
                        type="default" 
                        onClick={handleSave}
                        disabled={loading}
                        className="btn-create-premium"
                    />
                </div>
            </div>
        </Popup>
    );
};

export default NuevaSolicitud;
