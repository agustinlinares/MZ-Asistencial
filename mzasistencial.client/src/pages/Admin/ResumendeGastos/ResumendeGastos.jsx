import React, { useState } from "react";
import './ResumendeGastos.css';
import { useTranslation } from "react-i18next";

import '../../../styles/FichaGlobal.css';

const ResumendeGastos = () => {
    const { t } = useTranslation();

    const [filtro, setFiltro] = useState("mercanza");

    return (
        <div className="resumen-gastos-container">
            <div className="header-page">
                <div className="title">{t('RESUMEN DE GASTOS')}</div>
            </div>

            <div className="content-page" id="home-page">
                <div className="row m-0 p-0 w-100">
                    {/* COLUMNA 1 */}

                    <div className="col-xxxl-4 col-xxl-4 col-xl-4 col-md-4 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                        <div className="columnsLayout panel">

                            {/* Icono + titulo */}
                            <div className="icon-header">
                                <i className="ri-home-line icon"></i> 
                                <div className="icon-title"> {t('Centros Propios')}</div>
                            </div>

                            {/* GRAFICO */}
                            <div className="col-12 mzh-45 row m-0 p-0 grafico">
                                <div className="grafico-selector-container">
                                    <select 
                                        className="grafico-selector"
                                        value={filtro}
                                        onChange={(e)=>setFiltro(e.target.value)}
                                    >
                                        <option value="mercanza">Mercanza</option>
                                        <option value="liquidación">Liquidación</option>
                                    </select>
                                </div>

                                <div className="grafico-area">
                                    <div className="grafico-placeholder">
                                        GRAFICO
                                    </div>
                                </div>
                            </div>
                            
                            {/* TABLA */}
                            <div className="col-12 mzh-50-20 row m-0 p-0 grafico2">
                                <div className="tabla-container">
                                    <table className="tabla-resumen">

                                        <thead>
                                            <tr>
                                                <th>Centros Propios</th>
                                                <th>Diferencia</th>
                                                <th>Mercanza</th>
                                                <th>Liquidación</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>Gastos de Personal (capítulo 1 presupuestos)</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>Gastos corrientes en bienes y servicios (Total capitulo 2 menos Artículo 25)</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>Gastos financieros (Capítulo 3 presupuestos)</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>Amortizaciones (Subg. 68 Cuenta del Rdo.Económico-Patrimonial)( * )</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>TOTAL COSTE CENTROS PROPIOS</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>
                                        </tbody>

                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA 2 */}
                    <div className="col-xxxl-4 col-xxl-4 col-xl-4 col-md-4 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 pr-0 pl-2">
                        <div className="columnsLayout panel">

                            {/* Icono + titulo */}
                            <div className="icon-header">
                                <i className="ri-group-line icon"></i> 
                                <div className="icon-title"> {t('Conciertos')}</div>
                            </div>

                            {/* GRAFICO */}
                            <div className="col-12 mzh-45 row m-0 p-0 grafico">
                                <div className="grafico-selector-container">
                                    <select 
                                        className="grafico-selector"
                                        value={filtro}
                                        onChange={(e)=>setFiltro(e.target.value)}
                                    >
                                        <option value="mercanza">Mercanza</option>
                                        <option value="liquidación">Liquidación</option>
                                    </select>
                                </div>

                                <div className="grafico-area">
                                    <div className="grafico-placeholder">
                                        GRAFICO
                                    </div>
                                </div>
                            </div>
                            
                            {/* TABLA */}
                            <div className="col-12 mzh-50-20 row m-0 p-0 grafico2">
                                <div className="tabla-container">
                                    <table className="tabla-resumen">

                                        <thead>
                                            <tr>
                                                <th>Centros Propios</th>
                                                <th>Diferencia</th>
                                                <th>Mercanza</th>
                                                <th>Liquidación</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>Gastos de Personal (capítulo 1 presupuestos)</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>Gastos corrientes en bienes y servicios (Total capitulo 2 menos Artículo 25)</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>Gastos financieros (Capítulo 3 presupuestos)</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>Amortizaciones (Subg. 68 Cuenta del Rdo.Económico-Patrimonial)( * )</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>TOTAL COSTE CENTROS PROPIOS</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>
                                        </tbody>

                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA 3 */}
                    <div className="col-xxxl-4 col-xxl-4 col-xl-4 col-md-4 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 pr-0 pl-2">
                        <div className="columnsLayout panel">

                            {/* Icono + titulo */}
                            <div className="icon-header">
                                <i className="ri-edit-box-line icon"></i> 
                                <div className="icon-title"> {t('Otros Conceptos')}</div>
                            </div>

                            {/* GRAFICO */}
                            <div className="col-12 mzh-45 row m-0 p-0 grafico">
                                <div className="grafico-selector-container">
                                    <select 
                                        className="grafico-selector"
                                        value={filtro}
                                        onChange={(e)=>setFiltro(e.target.value)}
                                    >
                                        <option value="mercanza">Mercanza</option>
                                        <option value="liquidación">Liquidación</option>
                                    </select>
                                </div>

                                <div className="grafico-area">
                                    <div className="grafico-placeholder">
                                        GRAFICO
                                    </div>
                                </div>
                            </div>
                            
                            {/* TABLA */}
                            <div className="col-12 mzh-50-20 row m-0 p-0 grafico2">
                                <div className="tabla-container">
                                    <table className="tabla-resumen">

                                        <thead>
                                            <tr>
                                                <th>Centros Propios</th>
                                                <th>Diferencia</th>
                                                <th>Mercanza</th>
                                                <th>Liquidación</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>Gastos de Personal (capítulo 1 presupuestos)</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>Gastos corrientes en bienes y servicios (Total capitulo 2 menos Artículo 25)</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>Gastos financieros (Capítulo 3 presupuestos)</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>Amortizaciones (Subg. 68 Cuenta del Rdo.Económico-Patrimonial)( * )</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>

                                            <tr>
                                                <td>TOTAL COSTE CENTROS PROPIOS</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                                <td>0.00</td>
                                            </tr>
                                        </tbody>

                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResumendeGastos;