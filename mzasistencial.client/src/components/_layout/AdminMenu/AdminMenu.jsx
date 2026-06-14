import React, { useState } from 'react';
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import * as rdd from 'react-device-detect';

import './AdminMenu.css'

function AdminMenu() {
    const { t } = useTranslation();
    const [ISMOBILE] = useState(rdd.isMobile);

    // Inicialización limpia desde el localStorage
    const [user] = useState(() => {
        const userData = JSON.parse(localStorage.getItem('UsuarioActual') || 'null');
        return userData;
    });

    // Estados para submenús
    const [openProveedores, setOpenProveedores] = useState(false);
    const [openMutuas, setOpenMutuas] = useState(false);
    const [openAcuerdos, setOpenAcuerdos] = useState(false);
    const [openCentros, setOpenCentros] = useState(false);
    const [openICG, setOpenICG] = useState(false);
    const [openOfertaDemanda, setOpenOfertaDemanda] = useState(false);
    const [openGestionReserva, setOpenGestionReserva] = useState(false);
    const [openAnalisis, setOpenAnalisis] = useState(false);
    const [openAdmin, setOpenAdmin] = useState(false);

    return (
        <div id="cover-admin-nav">
            <nav id="admin-nav">
                <div className='item-logo-admin'>
                    <div id="logo-cliente" className="logos-inner">
                        <img src="/assets/img/logos/mercanza_logo.png" alt='Mercanza' />
                    </div>
                </div>

                <ul id="list-menuadmin">
                    <li>
                        <NavLink to="ResumendeGastos" end>
                            <i className="ri-dashboard-fill"></i>
                            <span>{t('Resumen de Gastos')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="Dashboard" end>
                            <i className="ri-pie-chart-2-line"></i>
                            <span>{t('Dashboard')}</span>
                        </NavLink>
                    </li>

                    <li className="menu-group">
                        <div
                            className="menu-title"
                            onClick={() => setOpenProveedores(!openProveedores)}
                        >
                            <i className="ri-community-line"></i>
                            <span>{t('Proveedores')}</span>
                            <i className={`ri-arrow-down-s-line arrow ${openProveedores ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openProveedores ? 'open' : ''}`}>
                            <li><NavLink to="proveedores/proveedores">{t('Proveedores')}</NavLink></li>
                            <li><NavLink to="proveedores/delegaciones">{t('Delegaciones')}</NavLink></li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div
                            className="menu-title"
                            onClick={() => setOpenMutuas(!openMutuas)}
                        >
                            <i className="ri-hand-heart-line"></i>
                            <span>{t('Mutuas')}</span>
                            <i className={`ri-arrow-down-s-line arrow ${openMutuas ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openMutuas ? 'open' : ''}`}>
                            <li><NavLink to="Mutuas/Mutuas">{t('Mutuas')}</NavLink></li>

                            {(user?.perfilId === 1 || user?.perfilId === 4) && (
                                <li><NavLink to="Mutuas/Descuadres">{t('Descuadres')}</NavLink></li>
                            )}
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div
                            className="menu-title"
                            onClick={() => setOpenAcuerdos(!openAcuerdos)}
                        >
                            <i className="ri-file-list-3-line"></i>
                            <span>{t('Acuerdos')}</span>
                            <i className={`ri-arrow-down-s-line arrow ${openAcuerdos ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openAcuerdos ? 'open' : ''}`}>
                            <li><NavLink to="Acuerdos/Acuerdos">{t('Acuerdos')}</NavLink></li>
                            <li><NavLink to="Acuerdos/PlantillasAcuerdos">{t('Plantillas Acuerdos')}</NavLink></li>
                            <li><NavLink to="Acuerdos/Analisis">{t('Análisis')}</NavLink></li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div
                            className="menu-title"
                            onClick={() => setOpenCentros(!openCentros)}
                        >
                            <i className="ri-hospital-line"></i>
                            <span>{t('Centros')}</span>
                            <i className={`ri-arrow-down-s-line arrow ${openCentros ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openCentros ? 'open' : ''}`}>
                            <li><NavLink to="Centros/CentrosPropios">{t('Centros Propios')}</NavLink></li>
                            <li><NavLink to="Centros/CentrosConcertados">{t('Centros Concertados')}</NavLink></li>
                            <li><NavLink to="Centros/Conciertos">{t('Conciertos')}</NavLink></li>
                            <li><NavLink to="Centros/Fincas">{t('Fincas')}</NavLink></li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div
                            className="menu-title"
                            onClick={() => setOpenICG(!openICG)}
                        >
                            <i className="ri-file-chart-line"></i>
                            <span>{t('ICG')}</span>
                            <i className={`ri-arrow-down-s-line arrow ${openICG ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openICG ? 'open' : ''}`}>
                            <li><NavLink to="ICG/ICGCentrosPropios">{t('Centros Propios')}</NavLink></li>
                            <li><NavLink to="ICG/ICGConciertos">{t('Conciertos')}</NavLink></li>
                            <li><NavLink to="ICG/ICGPlantillasICG">{t('Plantillas ICG')}</NavLink></li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div
                            className="menu-title"
                            onClick={() => setOpenOfertaDemanda(!openOfertaDemanda)}
                        >
                            <i className="ri-bar-chart-grouped-line"></i>
                            <span>{t('Oferta Demanda')}</span>
                            <i className={`ri-arrow-down-s-line arrow ${openOfertaDemanda ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openOfertaDemanda ? 'open' : ''}`}>
                            <li><NavLink to="OfertaDemanda/GestionOferta">{t('Gestión Oferta')}</NavLink></li>
                            <li><NavLink to="OfertaDemanda/GestionDemanda">{t('Gestión Demanda')}</NavLink></li>
                            <li><NavLink to="OfertaDemanda/AcreditacionesSectoriales">{t('Acreditaciones Sectoriales')}</NavLink></li>
                            <li><NavLink to="OfertaDemanda/AcreditacionesIndividuales">{t('Acreditaciones Individuales')}</NavLink></li>
                            <li><NavLink to="OfertaDemanda/GenerarInformes">{t('Generar Informes')}</NavLink></li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div
                            className="menu-title"
                            onClick={() => setOpenGestionReserva(!openGestionReserva)}
                        >
                            <i className="ri-calendar-event-line"></i>
                            <span>{t('Gestión Reserva')}</span>
                            <i className={`ri-arrow-down-s-line arrow ${openGestionReserva ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openGestionReserva ? 'open' : ''}`}>
                            <li><NavLink to="GestionReserva/SolicitarCitacion">{t('Solicitar Citación')}</NavLink></li>
                            <li><NavLink to="GestionReserva/ConcederCitacion">{t('Conceder Citación')}</NavLink></li>
                        </ul>
                    </li>

                    <li>
                        <NavLink to="CuadroMedico" end>
                            <i className="ri-map-pin-user-line"></i>
                            <span>{t('Cuadro médico')}</span>
                        </NavLink>
                    </li>

                    <li className="menu-group">
                        <div
                            className="menu-title"
                            onClick={() => setOpenAnalisis(!openAnalisis)}
                        >
                            <i className="ri-pie-chart-2-line"></i>
                            <span>{t('Análisis')}</span>
                            <i className={`ri-arrow-down-s-line arrow ${openAnalisis ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openAnalisis ? 'open' : ''}`}>
                            <li><NavLink to="Analisis/AnalisisView">{t('Análisis View')}</NavLink></li>
                            <li><NavLink to="Analisis/AnalisisSense">{t('Análisis Sense')}</NavLink></li>
                        </ul>
                    </li>

                    <li className="menu-group">
                        <div
                            className="menu-title"
                            onClick={() => setOpenAdmin(!openAdmin)}
                        >
                            <i className="ri-settings-4-line"></i>
                            <span>{t('Administración')}</span>
                            <i className={`ri-arrow-down-s-line arrow ${openAdmin ? 'open' : ''}`}></i>
                        </div>

                        <ul className={`submenu ${openAdmin ? 'open' : ''}`}>
                            <li><NavLink to="Admin/Usuarios">{t('Usuarios')}</NavLink></li>
                            <li><NavLink to="Admin/Perfiles">{t('Perfiles')}</NavLink></li>
                            <li><NavLink to="Admin/PresupuestosLiquidados">{t('Presupuestos Liquidados')}</NavLink></li>
                            <li><NavLink to="Admin/Ejercicios">{t('Ejercicios')}</NavLink></li>
                            <li><NavLink to="Admin/Ficheros">{t('Ficheros')}</NavLink></li>
                            <li><NavLink to="Admin/ExportarAccess">{t('Exportar a Access')}</NavLink></li>
                            <li><NavLink to="Admin/RegistrosActividad">{t('Registros Actividad')}</NavLink></li>
                            <li><NavLink to="Admin/RegistrosError">{t('Registros Error')}</NavLink></li>
                            <li><NavLink to="Admin/CIEP">{t('CIEP')}</NavLink></li>
                            <li><NavLink to="Admin/Tarifas">{t('Tarifas')}</NavLink></li>
                            <li><NavLink to="Admin/TiposDemanda">{t('Tipos Demanda')}</NavLink></li>
                            <li><NavLink to="Admin/Configuracion">{t('Configuración')}</NavLink></li>
                            <li><NavLink to="Admin/Mantenimiento">{t('Mantenimiento')}</NavLink></li>
                        </ul>
                    </li>
                </ul>


                <div className="user-profile-sidebar" style={{
                    padding: '15px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>
                        {user?.nombre?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {user?.nombre || t('Usuario')}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {user?.perfilId === 1 ? 'Administrador' : user?.perfilId === 2 ? 'Usuario' : user?.perfilId === 4 ? 'Supervisor' : t('Usuario')}
                        </div>
                    </div>
                </div>

                <div className='logo-app-menu'>
                    <img className="logo-app" alt="MZ" src="/assets/img/logos/mercanza_logo.png"></img>
                </div>
            </nav>
        </div>
    );
}

export default AdminMenu;