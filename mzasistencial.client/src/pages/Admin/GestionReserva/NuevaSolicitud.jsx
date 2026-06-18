import React, { useState } from 'react';
import { TextBox, NumberBox, SelectBox, TextArea } from 'devextreme-react';
import { useTranslation } from 'react-i18next';
import CitacionesService from '../../../services/admin/CitacionesService';
import notify from 'devextreme/ui/notify';
import { useLogError } from '../../../hooks/useLogError';

const NuevaSolicitud = ({ visible, onHiding, onSave, mutuaId }) => {
    const { t } = useTranslation();
    const logError = useLogError("Nueva solicitud");
    const [loading, setLoading] = useState(false);
    
    // Mock data for dropdowns until backend provides endpoints
    const movimientos = [{ id: 1, text: 'Reserva' }, { id: 2, text: 'Consumo' }];
    const mutuas = [{ id: 2, text: 'Mutua Universal' }, { id: 3, text: 'Asepeyo' }, { id: 4, text: 'Ibermutua' }];
    const especialidades = [{ id: 1, text: 'Traumatología' }, { id: 2, text: 'Rehabilitación' }];
    const servicios = [{ id: 1, text: 'Consultas Externas' }, { id: 2, text: 'Fisioterapia' }];
    const provincias = [{ id: 1, text: 'Madrid' }, { id: 2, text: 'Barcelona' }];
    const localidades = [{ id: 1, text: 'Madrid Centro' }, { id: 2, text: 'Hospitalet' }];
    const centros = [{ id: 1, text: 'Centro Médico A' }, { id: 2, text: 'Clínica B' }];

    const [formData, setFormData] = useState({
        anio: new Date().getFullYear(),
        necesidad: '',
        tipoMovimientoId: null,
        mutuaOfertanteId: null,
        especialidadId: null,
        servicioId: null,
        provinciaId: null,
        localidadId: null,
        centroId: null,
        telefono: '',
        direccion: '',
        meses: {
            Ene: 0, Feb: 0, Mar: 0, Abr: 0, May: 0, Jun: 0, 
            Jul: 0, Ago: 0, Sep: 0, Oct: 0, Nov: 0, Dic: 0
        }
    });

    const handleMesChange = (mes, value) => {
        let val = parseInt(value, 10) || 0;
        if (val < 0) val = 0;
        setFormData(prev => ({
            ...prev,
            meses: { ...prev.meses, [mes]: val }
        }));
    };

    const calcularTotal = () => {
        return Object.values(formData.meses).reduce((acc, val) => acc + (parseInt(val, 10) || 0), 0);
    };

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
                Total: calcularTotal(),
                Ene: formData.meses.Ene,
                Feb: formData.meses.Feb,
                Mar: formData.meses.Mar,
                Abr: formData.meses.Abr,
                May: formData.meses.May,
                Jun: formData.meses.Jun,
                Jul: formData.meses.Jul,
                Ago: formData.meses.Ago,
                Sep: formData.meses.Sep,
                Oct: formData.meses.Oct,
                Nov: formData.meses.Nov,
                Diciembre: formData.meses.Dic,
                TipoMovimientoId: formData.tipoMovimientoId,
                MutuaOfertanteId: formData.mutuaOfertanteId,
                EspecialidadId: formData.especialidadId,
                ServicioId: formData.servicioId,
                ProvinciaId: formData.provinciaId,
                LocalidadId: formData.localidadId,
                CentroId: formData.centroId,
                Telefono: formData.telefono,
                Direccion: formData.direccion
            };

            await CitacionesService.create(mutuaId, payload);
            
            notify(t('Solicitud creada correctamente'), 'success', 2000);
            onSave();
            onHiding();
        } catch (error) {
            logError(`Fallo al crear nueva solicitud para Mutua ID: ${mutuaId}`, error);
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
                        <i className="ri-file-add-line"></i> {t('Creación de Nueva Solicitud')}
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

                <div className="ficha-content-premium" style={{ padding: '15px 25px', overflowY: 'auto', height: 'calc(100% - 60px)' }}>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px' }}>
                        
                        <div className="form-group">
                            <label>{t('Tipo Movimiento')}</label>
                            <SelectBox 
                                items={movimientos} valueExpr="id" displayExpr="text"
                                value={formData.tipoMovimientoId}
                                onValueChanged={e => setFormData({...formData, tipoMovimientoId: e.value})}
                                placeholder={t('Seleccione...')}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('Mutua Ofertante')}</label>
                            <SelectBox 
                                items={mutuas} valueExpr="id" displayExpr="text"
                                value={formData.mutuaOfertanteId}
                                onValueChanged={e => setFormData({...formData, mutuaOfertanteId: e.value})}
                                placeholder={t('Seleccione...')}
                            />
                        </div>
                        
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>{t('Especialidad')}</label>
                            <SelectBox 
                                items={especialidades} valueExpr="id" displayExpr="text"
                                value={formData.especialidadId}
                                onValueChanged={e => setFormData({...formData, especialidadId: e.value})}
                                placeholder={t('Seleccione...')}
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>{t('Servicio')}</label>
                            <SelectBox 
                                items={servicios} valueExpr="id" displayExpr="text"
                                value={formData.servicioId}
                                onValueChanged={e => setFormData({...formData, servicioId: e.value})}
                                placeholder={t('Seleccione...')}
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('Provincia')}</label>
                            <SelectBox 
                                items={provincias} valueExpr="id" displayExpr="text"
                                value={formData.provinciaId}
                                onValueChanged={e => setFormData({...formData, provinciaId: e.value})}
                                placeholder={t('Seleccione...')}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('Localidad')}</label>
                            <SelectBox 
                                items={localidades} valueExpr="id" displayExpr="text"
                                value={formData.localidadId}
                                onValueChanged={e => setFormData({...formData, localidadId: e.value})}
                                placeholder={t('Seleccione...')}
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>{t('Centro')}</label>
                            <SelectBox 
                                items={centros} valueExpr="id" displayExpr="text"
                                value={formData.centroId}
                                onValueChanged={e => setFormData({...formData, centroId: e.value})}
                                placeholder={t('Seleccione...')}
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 3' }}>
                            <label>{t('Dirección')}</label>
                            <TextBox 
                                value={formData.direccion}
                                onValueChanged={e => setFormData({...formData, direccion: e.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('Teléfono')}</label>
                            <TextBox 
                                value={formData.telefono}
                                onValueChanged={e => setFormData({...formData, telefono: e.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('Año de la Solicitud')}</label>
                            <NumberBox 
                                value={formData.anio} 
                                onValueChanged={e => setFormData({...formData, anio: e.value})}
                                showSpinButtons={true}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px', overflowX: 'auto', marginTop: '20px' }}>
                        <div className="premium-tab">
                            {t('Desglose de Mensualidades')}
                        </div>
                        <table className="tabla-mensualidades" style={{ marginTop: '0', borderTop: 'none' }}>
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
                                <tr>
                                    <td className="row-header">CITACION</td>
                                    {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(mes => (
                                        <td key={mes}>
                                            <TextBox 
                                                value={formData.meses[mes]?.toString()} 
                                                onValueChanged={(e) => handleMesChange(mes, e.value)}
                                                className="mes-input citacion-input" 
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <TextBox readOnly value={calcularTotal().toString()} className="mes-input total-input" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label>{t('Necesidad / Concepto')}</label>
                        <TextArea 
                            height={80}
                            value={formData.necesidad}
                            onValueChanged={e => setFormData({...formData, necesidad: e.value})}
                            placeholder={t('Ej: Urgencia dental, Tratamiento rehabilitador...')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NuevaSolicitud;

