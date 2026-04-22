import React, { useState, useEffect } from "react";
import './FichaMutua.css';

// Recibimos dos props:
// - mutua: los datos de la fila que clickó el usuario
// - onClose: la función para cerrar la ficha
const FichaMutua = ({ mutua, onClose }) => {

    // Estado que controla qué pestaña está activa
    // Por defecto empieza en "general"
    const [activeTab, setActiveTab] = useState("general");

    // Estado para guardar los datos completos de la mutua -segun el DTO-
    // Empieza con los datos básicos que ya tenemos de la lista
    const [datosMutua, setDatosMutua] = useState(mutua);

    // Cuando se abre la ficha, pedimos los datos del DTO
    // useEffect se ejecuta automáticamente cuando el componente aparece en pantalla
    useEffect(() => {
        fetch(`/api/mutuas/${mutua.nº}`)
            .then(response => response.json())
            .then(data => {
                console.log("Datos completos del DTO:", data);
                setDatosMutua(data); // Guardamos los datos detallados en el DTO
            })
            .catch(error => console.error("Error cargando ficha mutua:", error));
    }, []); // Se ejecuta esto solo una vez, al abrirse.

    return (
        <div className="ficha-overlay">
            <div className="ficha-container">

                {/* ── HEADER ──────────────────────────────────────── */}
                <div className="Header">
                    <div className="titleFicha">
                        Ficha Mutua | {datosMutua.numeroMutua} | {datosMutua.nº}
                    </div>
                    <div className="ComboBotones">
                        <button className="ficha-close-btn" onClick={onClose}>
                            ☑ Aceptar
                        </button>
                        <button className="ficha-close-btn" onClick={onClose}>
                            × Salir
                        </button>
                    </div>
                </div>

                {/* ── PESTAÑAS ────────────────────────────────────── */}
                {/* Cada botón cambia activeTab a su valor */}
                <div className="ficha-tabs">
                    <button
                        className={`tab-button ${activeTab === "general" ? "active" : ""}`}
                        onClick={() => setActiveTab("general")}
                    >
                        General
                    </button>
                    <button
                        className={`tab-button ${activeTab === "centrosPropios" ? "active" : ""}`}
                        onClick={() => setActiveTab("centrosPropios")}
                    >
                        Centros Propios
                    </button>
                    <button
                        className={`tab-button ${activeTab === "conciertos" ? "active" : ""}`}
                        onClick={() => setActiveTab("conciertos")}
                    >
                        Conciertos
                    </button>
                    <button
                        className={`tab-button ${activeTab === "especialidadesPropios" ? "active" : ""}`}
                        onClick={() => setActiveTab("especialidadesPropios")}
                    >
                        Especialidades / Serv. (Propios)
                    </button>
                    <button
                        className={`tab-button ${activeTab === "especialidadesConciertos" ? "active" : ""}`}
                        onClick={() => setActiveTab("especialidadesConciertos")}
                    >
                        Especialidades / Serv. (Conciertos)
                    </button>
                </div>

                {/* ── CONTENIDO DE CADA PESTAÑA ───────────────────── */}
                <div className="tab-content">

                    {/* PESTAÑA GENERAL — muestra los datos de la mutua */}
                    {activeTab === "general" && (
                        <div className="filtros-box general">
                            <div className="filtros-content">

                                <div className="filtro-item">
                                    <label>Mutua</label>
                                    <input type="text" value={datosMutua.mutua || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    <label>Código Razón Social</label>
                                    <input type="text" value={datosMutua.razonSocial || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    <label>Provincia</label>
                                    <input type="text" value={datosMutua.provincia || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    <label>Población</label>
                                    <input type="text" value={datosMutua.poblacion || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    <label>Dirección</label>
                                    <input type="text" value={datosMutua.direccion || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    <label>Código Postal</label>
                                    <input type="text" value={datosMutua.cp || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    <label>Telefono</label>
                                    <input type="text" value={datosMutua.telefono || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    <label>Fax</label>
                                    <input type="text" value={datosMutua.fax || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    <label>Dirección Electrónica</label>
                                    <input type="text" value={datosMutua.direccionElectronica || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    <label>Persona de Contacto</label>
                                    <input type="text" value={datosMutua.personaContacto || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    <label>Número de Mutua</label>
                                    <input type="text" value={datosMutua.numeroMutua || ""} readOnly />
                                </div>

                                <div className="filtro-item">
                                    
                                </div>

                            </div>
                        </div>
                    )}

                    {/* PESTAÑAS CENTROS PROPIOS — ??? */}
                    {activeTab === "centrosPropios" && (
                        <div className="filtros-box">
                            <p>Centros Propios</p>
                        </div>
                    )}

                    {/* PESTAÑAS CONCIERTOS — ??? */}
                    {activeTab === "conciertos" && (
                        <div className="filtros-box">
                            <p>Conciertos</p>
                        </div>
                    )}

                    {/* PESTAÑAS ESPECIALIDADES /SERV. (PROPIOS) — ??? */}
                    {activeTab === "especialidadesPropios" && (
                        <div className="filtros-box">
                            <p>Especialidades / Serv. (Propios)</p>
                        </div>
                    )}

                    {/* PESTAÑAS ESPECIALIDADES /SERV. (CONCIERTOS) — ??? */}
                    {activeTab === "especialidadesConciertos" && (
                        <div className="filtros-box">
                            <p>Especialidades / Serv. (Conciertos)</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FichaMutua;