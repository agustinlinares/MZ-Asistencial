import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import * as rdd from 'react-device-detect';
import Accordion, { Item } from 'devextreme-react/accordion';

import './AdminMenu.css'

function AdminMenu(props) {
    const { t } = useTranslation();
    const [ISMOBILE] = useState(rdd.isMobile);
    const location = useLocation();
    const [openProveedores, setOpenProveedores] = useState(false);
    const [openMutuas, setOpenMutuas] = useState(false);
    const [openAcuerdos, setOpenAcuerdos] = useState(false);
    const [openCentros, setOpenCentros] = useState(false);
    const [openICG, setOpenICG] = useState(false);
    const [openOfertaDemanda, setOpenOfertaDemanda] = useState(false);
    const [openGestionReserva, setOpenGestionReserva] = useState(false);
    const [openAnalisis, setOpenAnalisis] = useState(false);
    const [openAdmin, setOpenAdmin] = useState(false);

    useEffect(() => {


    }, [location.pathname]);

    return (
        <div id="cover-admin-nav">
            <nav id="admin-nav">
                <div className='item-logo-admin'>
                    <div id="logo-cliente" className="logos-inner">
                        <img src="/assets/img/logos/mercanza_logo.jpg" alt='Mercanza' />
                    </div>
                </div>
                <ul id="list-menuadmin">
                    <li>
                        <NavLink to="ResumendeGastos" end>
                            <i className="ri-stack-overflow-line"></i>{t('Resumen de Gastos')}
                        </NavLink>
                    </li>

                    <li className="menu-group">
                        <div 
                            className="menu-title"
                            onClick={() => setOpenProveedores(!openProveedores)}
                        >
                            <i className="ri-group-line"></i>
                            {t('Proveedores')}

                            {/* Flecha */}
                            <i className={`ri-arrow-down-s-line arrow ${openProveedores ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openProveedores ? 'open' : ''}`}>
                            <li>
                                <NavLink to="proveedores/proveedores">
                                    {t('Proveedores')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="proveedores/delegaciones">
                                    {t('Delegaciones')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div 
                            className="menu-title"
                            onClick={() => setOpenMutuas(!openMutuas)}
                        >
                            <i className="ri-puzzle-line"></i>
                            {t('Mutuas')}

                            {/* Flecha */}
                            <i className={`ri-arrow-down-s-line arrow ${openMutuas ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openMutuas ? 'open' : ''}`}>
                            <li>
                                <NavLink to="Mutuas/Mutuas">
                                    {t('Mutuas')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Mutuas/Descuadres">
                                    {t('Descuadres')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div 
                            className="menu-title"
                            onClick={() => setOpenAcuerdos(!openAcuerdos)}
                        >
                            <i className="ri-edit-box-line"></i>
                            {t('Acuerdos')}

                            {/* Flecha */}
                            <i className={`ri-arrow-down-s-line arrow ${openAcuerdos ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openAcuerdos ? 'open' : ''}`}>
                            <li>
                                <NavLink to="Acuerdos/Acuerdos">
                                    {t('Acuerdos')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Acuerdos/PlantillasAcuerdos">
                                    {t('Plantillas Acuerdos')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Acuerdos/Analisis">
                                    {t('Analisis')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div 
                            className="menu-title"
                            onClick={() => setOpenCentros(!openCentros)}
                        >
                            <i className="ri-thumb-up-line"></i>
                            {t('Centros')}

                            {/* Flecha */}
                            <i className={`ri-arrow-down-s-line arrow ${openCentros ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openCentros ? 'open' : ''}`}>
                            <li>
                                <NavLink to="Centros/CentrosPropios">
                                    {t('Centros Propios')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Centros/CentrosConcertados">
                                    {t('Centros Concertados')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Centros/Conciertos">
                                    {t('Conciertos')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Centros/Fincas">
                                    {t('Fincas')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Centros/ControlDuplicados">
                                    {t('Control centros concertado duplicados')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div 
                            className="menu-title"
                            onClick={() => setOpenICG(!openICG)}
                        >
                            <i className="ri-search-line"></i>
                            {t('ICG')}

                            {/* Flecha */}
                            <i className={`ri-arrow-down-s-line arrow ${openICG ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openICG ? 'open' : ''}`}>
                            <li>
                                <NavLink to="ICG/ICGCentrosPropios">
                                    {t('Centros Propios')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="ICG/ICGConciertos">
                                    {t('Conciertos')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="ICG/ICGPlantillasICG">
                                    {t('Plantillas ICG')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div 
                            className="menu-title"
                            onClick={() => setOpenOfertaDemanda(!openOfertaDemanda)}
                        >
                            <i className="ri-stack-overflow-line"></i>
                            {t('Oferta Demanda')}

                            {/* Flecha */}
                            <i className={`ri-arrow-down-s-line arrow ${openOfertaDemanda ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openOfertaDemanda ? 'open' : ''}`}>
                            <li>
                                <NavLink to="OfertaDemanda/GestionOferta">
                                    {t('Gestión Oferta')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="OfertaDemanda/GestionDemanda">
                                    {t('Gestión Demanda')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="OfertaDemanda/AcreditacionesSectoriales">
                                    {t('Acreditaciones Sectoriales')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="OfertaDemanda/AcreditacionesIndividuales">
                                    {t('Acreditaciones Individuales')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="OfertaDemanda/GenerarInformes">
                                    {t('Generar Informes')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div 
                            className="menu-title"
                            onClick={() => setOpenGestionReserva(!openGestionReserva)}
                        >
                            <i className="ri-stack-overflow-line"></i>
                            {t('Gestión Reserva')}

                            {/* Flecha */}
                            <i className={`ri-arrow-down-s-line arrow ${openGestionReserva ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openGestionReserva ? 'open' : ''}`}>
                            <li>
                                <NavLink to="GestionReserva/SolicitarCitacion">
                                    {t('Solicitar Citación')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="GestionReserva/ConcederCitacion">
                                    {t('Conceder Citación')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <NavLink to="CuadroMedico" end>
                            <i className="ri-map-2-line"></i>{t('Cuadro médico')}
                        </NavLink>
                    </li>

                    <li className="menu-group">
                        <div 
                            className="menu-title"
                            onClick={() => setOpenAnalisis(!openAnalisis)}
                        >
                            <i className="ri-dashboard-3-line"></i>
                            {t('Análisis')}

                            {/* Flecha */}
                            <i className={`ri-arrow-down-s-line arrow ${openAnalisis ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openAnalisis ? 'open' : ''}`}>
                            <li>
                                <NavLink to="Analisis/AnalisisView">
                                    {t('Análisis View')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Analisis/AnalisisSense">
                                    {t('Análisis Sense')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                     <li className="menu-group">
                        <div 
                            className="menu-title"
                            onClick={() => setOpenAdmin(!openAdmin)}
                        >
                            <i className="ri-mind-map"></i>
                            {t('Admin')}

                            {/* Flecha */}
                            <i className={`ri-arrow-down-s-line arrow ${openAdmin ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openAdmin ? 'open' : ''}`}>
                            <li>
                                <NavLink to="Admin/Usuarios">
                                    {t('Usuarios')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/Perfiles">
                                    {t('Perfiles')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/PresupuestosLiquidados">
                                    {t('Presupuestos Liquidados')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/Ejercicios">
                                    {t('Ejercicios')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/Ficheros">
                                    {t('Ficheros')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/ExportarAccess">
                                    {t('Exportar a Access')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/RegistrosActividad">
                                    {t('Registros Actividad')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/RegistrosError">
                                    {t('Registros Error')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/CIEP">
                                    {t('CIEP')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/Tarifas">
                                    {t('Tarifas')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/TiposDemanda">
                                    {t('Tipos Demanda')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/Configuracion">
                                    {t('Configuracion')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="Admin/Mantenimiento">
                                    {t('Mantenimiento')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>

                </ul>
                <div className='logo-app-menu'>
                    <img className="logo-app" alt="MZ" src="/assets/img/logos/mercanza_logo.jpg"></img>
                </div>
            </nav>

        </div>
    );
}

export default AdminMenu;