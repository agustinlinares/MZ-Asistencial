import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/LoginPage/LoginPage";


// Layouts
const AdminLayout = lazy(() => import("@layouts/AdminLayout"));
const ResumendeGastos = lazy(() => import('@pages/Admin/ResumendeGastos/ResumendeGastos'));

const Proveedores = lazy(() => import("@pages/Admin/Proveedores/Proveedores"));
const Delegaciones = lazy(() => import("@pages/Admin/Proveedores/Delegaciones"));

const Mutuas = lazy(() => import("@pages/Admin/Mutuas/Mutuas"));
const Descuadres = lazy(() => import("@pages/Admin/Mutuas/Descuadres"));

const Acuerdos = lazy(() => import("@pages/Admin/Acuerdos/Acuerdos"));
const PlantillasAcuerdos = lazy(() => import("@pages/Admin/Acuerdos/PlantillasAcuerdos"));
const Analisis = lazy(() => import("@pages/Admin/Acuerdos/Analisis"));

const CentrosPropios = lazy(() => import("@pages/Admin/Centros/CentrosPropios"));
const CentrosConcertados = lazy(() => import("@pages/Admin/Centros/CentrosConcertados"));
const Conciertos = lazy(() => import("@pages/Admin/Centros/Conciertos"));
const Fincas = lazy(() => import("@pages/Admin/Centros/Fincas"));
const ControlDuplicados = lazy(() => import("@pages/Admin/Centros/ControlDuplicados"));

const ICGCentrosPropios = lazy(() => import("@pages/Admin/ICG/ICGCentrosPropios"));
const ICGPlantillasICG = lazy(() => import("@pages/Admin/ICG/ICGPlantillasICG"));
const ICGConciertos = lazy(() => import("@pages/Admin/ICG/ICGConciertos"));

const GestionOferta = lazy(() => import("@pages/Admin/OfertaDemanda/GestionOferta"));
const GestionDemanda = lazy(() => import("@pages/Admin/OfertaDemanda/GestionDemanda"));
const AcreditacionesSectoriales = lazy(() => import("@pages/Admin/OfertaDemanda/AcreditacionesSectoriales"));
const AcreditacionesIndividuales = lazy(() => import("@pages/Admin/OfertaDemanda/AcreditacionesIndividuales"));
const GenerarInformes = lazy(() => import("@pages/Admin/OfertaDemanda/GenerarInformes"));

const SolicitarCitacion = lazy(() => import("@pages/Admin/GestionReserva/SolicitarCitacion"));
const ConcederCitacion = lazy(() => import("@pages/Admin/GestionReserva/ConcederCitacion"));

const CuadroMedico = lazy(() => import("@pages/Admin/CuadroMedico/CuadroMedico"));

const AnalisisView = lazy(() => import("@pages/Admin/Analisis/AnalisisView"));
const AnalisisSense = lazy(() => import("@pages/Admin/Analisis/AnalisisSense"));

const Usuarios = lazy(() => import("@pages/Admin/Admin/Usuarios"));
const Perfiles = lazy(() => import("@pages/Admin/Admin/Perfiles"));
const PresupuestosLiquidados = lazy(() => import("@pages/Admin/Admin/PresupuestosLiquidados"));
const Ejercicios = lazy(() => import("@pages/Admin/Admin/Ejercicios"));
const Ficheros = lazy(() => import("@pages/Admin/Admin/Ficheros"));
const ExportarAccess = lazy(() => import("@pages/Admin/Admin/ExportarAccess"));
const RegistrosActividad = lazy(() => import("@pages/Admin/Admin/RegistrosActividad"));
const RegistrosError = lazy(() => import("@pages/Admin/Admin/RegistrosError"));
const CIEP = lazy(() => import("@pages/Admin/Admin/CIEP"));
const Tarifas = lazy(() => import("@pages/Admin/Admin/Tarifas"));
const TiposDemanda = lazy(() => import("@pages/Admin/Admin/TiposDemanda"));
const Configuracion = lazy(() => import("@pages/Admin/Admin/Configuracion"));
const Mantenimiento = lazy(() => import("@pages/Admin/Admin/Mantenimiento"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="loadingPage">Cargando...</div>}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="admin" element={<PrivateRoute />}>
                    <Route element={<AdminLayout />}>

                        <Route path="resumendeGastos" element={<ResumendeGastos />} />

                        <Route path="Proveedores">
                            <Route path="Proveedores" element={<Proveedores />} />
                            <Route path="Delegaciones" element={<Delegaciones />} />
                        </Route>

                        <Route path="Mutuas">
                            <Route path="Mutuas" element={<Mutuas />} />
                            <Route path="Descuadres" element={<Descuadres />} />
                        </Route>

                        <Route path="Acuerdos">
                            <Route path="Acuerdos" element={<Acuerdos />} />
                            <Route path="PlantillasAcuerdos" element={<PlantillasAcuerdos />} />
                            <Route path="Analisis" element={<Analisis />} />
                        </Route>

                        <Route path="Centros">
                            <Route path="CentrosPropios" element={<CentrosPropios />} />
                            <Route path="CentrosConcertados" element={<CentrosConcertados />} />
                            <Route path="Conciertos" element={<Conciertos />} />
                            <Route path="Fincas" element={<Fincas />} />
                            <Route path="ControlDuplicados" element={<ControlDuplicados />} />
                        </Route>

                        <Route path="ICG">
                            <Route path="ICGCentrosPropios" element={<ICGCentrosPropios />} />
                            <Route path="ICGConciertos" element={<ICGConciertos />} />
                            <Route path="ICGPlantillasICG" element={<ICGPlantillasICG />} />
                        </Route>

                        <Route path="OfertaDemanda">
                            <Route path="GestionOferta" element={<GestionOferta />} />
                            <Route path="GestionDemanda" element={<GestionDemanda />} />
                            <Route path="AcreditacionesSectoriales" element={<AcreditacionesSectoriales />} />
                            <Route path="AcreditacionesIndividuales" element={<AcreditacionesIndividuales />} />
                            <Route path="GenerarInformes" element={<GenerarInformes />} />
                        </Route>

                        <Route path="GestionReserva">
                            <Route path="SolicitarCitacion" element={<SolicitarCitacion />} />
                            <Route path="ConcederCitacion" element={<ConcederCitacion />} />
                        </Route>

                        <Route path="CuadroMedico" element={<CuadroMedico />} />

                        <Route path="Analisis">
                            <Route path="AnalisisView" element={<AnalisisView />} />
                            <Route path="AnalisisSense" element={<AnalisisSense />} />
                        </Route>

                        <Route path="Admin">
                            <Route path="Usuarios" element={<Usuarios />} />
                            <Route path="Perfiles" element={<Perfiles />} />
                            <Route path="PresupuestosLiquidados" element={<PresupuestosLiquidados />} />
                            <Route path="Ejercicios" element={<Ejercicios />} />
                            <Route path="Ficheros" element={<Ficheros />} />
                            <Route path="ExportarAccess" element={<ExportarAccess />} />
                            <Route path="RegistrosActividad" element={<RegistrosActividad />} />
                            <Route path="RegistrosError" element={<RegistrosError />} />
                            <Route path="CIEP" element={<CIEP />} />
                            <Route path="Tarifas" element={<Tarifas />} />
                            <Route path="TiposDemanda" element={<TiposDemanda />} />
                            <Route path="Configuracion" element={<Configuracion />} />
                            <Route path="Mantenimiento" element={<Mantenimiento />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
