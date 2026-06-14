import React, { useEffect, useState } from 'react';
import { NumberBox } from 'devextreme-react/number-box';
import { SelectBox } from 'devextreme-react/select-box';
import { custom } from 'devextreme/ui/dialog';
import { presupuestosLiquidadosService } from '@services/admin/presupuestosLiquidadosService';
import { useLogError } from '../../../hooks/useLogError';

const estadoInicial = {
    idPresupuesto: 0, año: '', mutuaId: null,
    presupuestoCapitulo1Propio: 0, presupuestoCapitulo2Propio: 0, presupuestoGastosFinancieros: 0, presupuestoCapitulo3Propio: 0,
    presupuestoCapitulo1Concertado: 0, presupuestoArticulo2581: 0, presupuestoArticulo2582: 0, presupuestoArticulo25Resto: 0,
    presupuestoCapitulo5Propio: 0, presupuestoCapitulo4Propio: 0, presupuestoCapitulo6Propio: 0
};

const FichaPresupuestoLiquidado = ({ idPresupuesto, onCerrar, mutuas }) => {
    const [form, setForm] = useState(estadoInicial);
    const [loading, setLoading] = useState(false);
    const esEdicion = Boolean(idPresupuesto);

    console.log("🔍 ¿Qué llega exactamente a la Ficha?:", mutuas);

    const añosLista = Array.from({ length: 20 }, (_, i) => (2007 + i).toString());

    const logError = useLogError("Presupuesto Liquidado");

    useEffect(() => {
        if (esEdicion) {
            cargarFicha();
        }
    }, [idPresupuesto]);

    const cargarFicha = async () => {
        try {
            const datos = await presupuestosLiquidadosService.obtenerPorId(idPresupuesto);
            setForm(datos);
        } catch (error) {
            console.error("Error al cargar la ficha:", error);
            logError("Fallo al cargar los datos de la ficha de presupuesto", error);
        }
    };

    const handleGuardar = async () => {
        try {
            setLoading(true);
            if (esEdicion) {
                await presupuestosLiquidadosService.actualizar(form.idPresupuesto, form);
            } else {
                await presupuestosLiquidadosService.insertar(form);
            }
            onCerrar(); 
        } catch (error) {
            logError(`Fallo al ${esEdicion ? "actualizar" : "insertar"} presupuesto liquidado`, error);
            
            const alertResult = custom({
                title: "Error al guardar",
                messageHtml: error.message || "No se pudo procesar la solicitud.",
                buttons: [{ text: "Aceptar" }]
            });
            alertResult.show();
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (campo, valor) => {
        setForm(prev => ({ ...prev, [campo]: valor }));
    };

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content" tabIndex={-1}>
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title font-weight-bold">
                        Ficha Presupuesto Liquidado | {esEdicion ? `${form.año}` : 'Nuevo'}
                    </span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={handleGuardar} disabled={loading}>Aceptar</button>
                        <button className="ficha-btn-secondary" onClick={onCerrar} disabled={loading}>Salir</button>
                    </div>
                </div>

                <div className="ficha-tab-content p-4" style={{ backgroundColor: '#fff', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <div className="row m-0">
                        <div className="col-md-6 mb-4">
                            <label className="form-label font-weight-bold text-primary">Año</label>
                            <SelectBox dataSource={añosLista} value={form.año} onValueChanged={(e) => handleChange('año', e.value)} disabled={esEdicion} /> 
                        </div>
                        <div className="col-md-6 mb-4">
                            <label className="form-label font-weight-bold text-primary">Mutua</label>
                            <SelectBox 
                                dataSource={mutuas}
                                valueExpr="numeroId" 
                                displayExpr="mutua"
                                value={form.mutuaId} 
                                onValueChanged={(e) => handleChange('mutuaId', e.value)} 
                                disabled={esEdicion} 
                                searchEnabled={true}
                                placeholder="Seleccione una mutua..."
                            />
                        </div>

                        {/* CENTROS PROPIOS */}
                        <div className="col-12 mt-3 mb-2"><h5 className="border-bottom pb-2 font-weight-bold">CENTROS PROPIOS</h5></div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Gastos de Personal</label>
                            <NumberBox value={form.presupuestoCapitulo1Propio} onValueChanged={(e) => handleChange('presupuestoCapitulo1Propio', e.value)} format="#,##0.00 €" />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Gast. corrientes en bienes/serv.</label>
                            <NumberBox value={form.presupuestoCapitulo2Propio} onValueChanged={(e) => handleChange('presupuestoCapitulo2Propio', e.value)} format="#,##0.00 €" />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Gastos Financieros</label>
                            <NumberBox value={form.presupuestoGastosFinancieros} onValueChanged={(e) => handleChange('presupuestoGastosFinancieros', e.value)} format="#,##0.00 €" />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Amortizaciones</label>
                            <NumberBox value={form.presupuestoCapitulo3Propio} onValueChanged={(e) => handleChange('presupuestoCapitulo3Propio', e.value)} format="#,##0.00 €" />
                        </div>

                        {/* CENTROS CONCERTADOS */}
                        <div className="col-12 mt-3 mb-2"><h5 className="border-bottom pb-2 font-weight-bold">CENTROS CONCERTADOS</h5></div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Artículo 25</label>
                            <NumberBox value={form.presupuestoCapitulo1Concertado} onValueChanged={(e) => handleChange('presupuestoCapitulo1Concertado', e.value)} format="#,##0.00 €" />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Artículo 258.1</label>
                            <NumberBox value={form.presupuestoArticulo2581} onValueChanged={(e) => handleChange('presupuestoArticulo2581', e.value)} format="#,##0.00 €" />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Artículo 258.2</label>
                            <NumberBox value={form.presupuestoArticulo2582} onValueChanged={(e) => handleChange('presupuestoArticulo2582', e.value)} format="#,##0.00 €" />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Resto del Artículo 25</label>
                            <NumberBox value={form.presupuestoArticulo25Resto} onValueChanged={(e) => handleChange('presupuestoArticulo25Resto', e.value)} format="#,##0.00 €" />
                        </div>

                        {/* OTROS CONCEPTOS */}
                        <div className="col-12 mt-3 mb-2"><h5 className="border-bottom pb-2 font-weight-bold">OTROS CONCEPTOS</h5></div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Inversiones Reposición</label>
                            <NumberBox value={form.presupuestoCapitulo5Propio} onValueChanged={(e) => handleChange('presupuestoCapitulo5Propio', e.value)} format="#,##0.00 €" />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Inversiones nuevas</label>
                            <NumberBox value={form.presupuestoCapitulo4Propio} onValueChanged={(e) => handleChange('presupuestoCapitulo4Propio', e.value)} format="#,##0.00 €" />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label text-secondary small font-weight-bold">Ingresos proced. prest. servicios</label>
                            <NumberBox value={form.presupuestoCapitulo6Propio} onValueChanged={(e) => handleChange('presupuestoCapitulo6Propio', e.value)} format="#,##0.00 €" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FichaPresupuestoLiquidado;