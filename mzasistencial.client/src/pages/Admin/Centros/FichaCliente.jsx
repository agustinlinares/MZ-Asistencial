import React, { useState } from "react";
import './FichaCliente.css';

const FichaCliente = ({ cliente, onClose }) => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="ficha-overlay">
      <div className="ficha-container">

        <div className="Header">
          <div className="titleFicha"> Ficha Centros Propios</div>
          <div className="ComboBotones">
              <button className="ficha-close-btn" onClick={onClose}> ☑ Aceptar</button>
              <button className="ficha-close-btn" onClick={onClose}>× Salir</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="ficha-tabs">
          <button
            className={`tab-button ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={`tab-button ${activeTab === "DatosUtilizacion" ? "active" : ""}`}
            onClick={() => setActiveTab("DatosUtilizacion")}
          >
            Datos Utilización
          </button>
          <button
            className={`tab-button ${activeTab === "RegistroICG" ? "active" : ""}`}
            onClick={() => setActiveTab("RegistroICG")}
          >
            Registro ICG
          </button>
          <button
            className={`tab-button ${activeTab === "FincasRegistrales" ? "active" : ""}`}
            onClick={() => setActiveTab("FincasRegistrales")}
          >
            Fincas Registrales
          </button>
          <button
            className={`tab-button ${activeTab === "Especialidades" ? "active" : ""}`}
            onClick={() => setActiveTab("Especialidades")}
          >
            Especialidades/ Serv.Disponibles
          </button>
          <button
            className={`tab-button ${activeTab === "Catalogo" ? "active" : ""}`}
            onClick={() => setActiveTab("Catalogo")}
          >
            Catálogo completa de servicios
          </button>
        </div>

        {/* PESTAÑAS CON FILTROS DIFERENTES */}
        <div className="tab-content">
          {activeTab === "general" && (
            <div className="filtros-box general">
                <div>
                  <div className="filtros-content">
                      <div className="filtro-item">
                        <label>Localizador</label>
                        <input type="text" value={cliente.Localizador || ""} readOnly />
                      </div>
                      <div className="filtro-item">
                        <label>Tipo de Centro</label>
                        <input type="text" value={cliente.TipoCentro || ""} readOnly />
                      </div>
                      <div className="filtro-item">
                        <label>Centro ID</label>
                        <input type="text" value={cliente.CentroID || ""} readOnly />
                      </div>
                      <div className="filtro-item">
                        <label>Centro</label>
                        <input type="text" value={cliente.Centro || ""} readOnly />
                      </div>

                      <div className="filtro-item">
                        <label>Mutua</label>
                        <select value={cliente.Mutua || ""}>
                          <option>603 - ACTIVA MUTUA 2008</option>
                        </select>
                      </div>
                      <div className="filtro-item">
                        <label>Provincia</label>
                        <select value={cliente.Provincia || ""}>
                          <option>Córdoba</option>
                        </select>
                      </div>
                      <div className="filtro-item">
                      <label>Población</label>
                      <select value={cliente.Poblacion || ""}>
                          <option>Córdoba</option>
                      </select>
                      </div>
                      <div className="filtro-item">
                      <label>Código Postal</label>
                      <select value={cliente.CodigoPostal || ""}>
                          <option>14004</option>
                      </select>
                      </div>

                      <div className="filtro-item">
                      <label>Vía Pública</label>
                      <select value={cliente.ViaPublica || ""}>
                          <option>AVENIDA</option>
                      </select>
                      </div>
                      <div className="filtro-item">
                      <label>Dirección</label>
                      <input type="text" value={cliente.Direccion || ""} readOnly />
                      </div>
                      <div className="filtro-item">
                      <label>Número</label>
                      <input type="text" value={cliente.Numero || ""} readOnly />
                      </div>
                      <div className="filtro-item">
                      <label>Piso</label>
                      <input type="text" value={cliente.Piso || ""} readOnly />
                      </div>

                      <div className="filtro-item">
                      <label>Puerta</label>
                      <input type="text" value={cliente.Puerta || ""} readOnly />
                      </div>
                      <div className="filtro-item">
                      <label>Servicios Especiales</label>
                      <select value={cliente.ServiciosEspeciales || ""}>
                          <option>Servicios Centrales</option>
                      </select>
                      </div>
                      <div className="filtro-item">
                      <label>Teléfono</label>
                      <input type="text" value={cliente.Telefono || ""} readOnly />
                      </div>
                      <div className="filtro-item">
                      <label>Dirección Google</label>
                      <input type="text" value={cliente.DireccionGoogle || ""} readOnly />
                      </div>

                      {/* NUEVOS CAMPOS */}
                      <div className="filtro-item">
                      <label>Verificar dirección Google</label>
                      <input type="text" value={cliente.VerificarDireccionGoogle || ""} />
                      </div>

                      <div className="filtro-item">
                      <label>Dirección electrónica</label>
                      <input type="email" value={cliente.Email || "cordoba@activamutua.es"} />
                      </div>

                      <div className="filtro-item">
                      <label>Persona de contacto</label>
                      <input type="text" value={cliente.PersonaContacto || ""} />
                      </div>

                      <div className="filtro-item">
                      <label>Otros Datos</label>
                      <input type="text" value={cliente.OtrosDatos || ""} />
                      </div>

                      <div className="filtro-item">
                      <label>Autorización / Comunicación</label>
                      <input type="date" value={cliente.Autorizacion || ""} />
                      </div>

                      <div className="filtro-item">
                      <label>Puesta en funcionamiento</label>
                      <input type="date" value={cliente.PuestaFuncionamiento || ""} />
                      </div>

                      <div className="filtro-item">
                      <label>Calificación de suficiencia</label>
                      <input type="date" value={cliente.Calificacion || ""} />
                      </div>

                      <div className="filtro-item">
                      <label>Centro Inicial</label>
                      <input type="date" value={cliente.CentroInicial || ""} />
                      </div>
                  </div>
                </div>
                
              </div>
          )}

          {activeTab === "DatosUtilizacion" && (
            <div className="filtros-box DatosUtilizacion">
              {/* Tipo de Centro */}
              <div className="bloque">
                <label className="bloque-titulo">Tipo de Centro</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="tipoCentro" />
                    Centro NO Sanitario
                  </label>
                  <label>
                    <input type="radio" name="tipoCentro" defaultChecked />
                    Hospitales y Ambulatorios
                  </label>
                </div>
              </div>

              {/* Actividades */}
              <div className="bloque">
                <label className="bloque-titulo">Actividades del Centro</label>
                <span className="bloque-sub">Selecciona las actividades del centro:</span>

                <div className="checkbox-grid">
                  <label><input type="checkbox" /> Asistencia sanitaria Hospitalaria</label>
                  <label><input type="checkbox" defaultChecked /> Asistencia sanitaria ambulatoria</label>
                  <label><input type="checkbox" /> Solamente rehabilitación</label>
                  <label><input type="checkbox" defaultChecked /> Control administrativo de IT</label>
                  <label><input type="checkbox" defaultChecked /> Prevención R.L seguridad social</label>
                  <label><input type="checkbox" /> Otras Actividades</label>
                  <label><input type="checkbox" defaultChecked /> Administración general de la Mutua</label>
                </div>
              </div>

              {/* Motivo de baja */}
              <div className="bloque">
                <label className="bloque-titulo">Motivo de la baja</label>
                <textarea defaultValue="Dado de alta en 003-UMIVALE ACTIVA"></textarea>
              </div>

              {/* Fila fechas */}
              <div className="fila">
                <div className="filtro-item">
                  <label>Fecha de baja</label>
                  <input type="date" defaultValue="2022-12-31" />
                </div>

                <div className="filtro-item justifyCenter">
                  <label>Traslado</label>
                  <input type="checkbox" className="checkbox-center" />
                </div>

                <div className="filtro-item justifyCenter">
                  <label>Centro Desactivado</label>
                  <input type="checkbox" className="checkbox-center" />
                </div>
              </div>

              {/* Nuevo centro */}
              <div className="bloque">
                <label className="bloque-titulo">Nuevo Centro</label>
                <input type="text" />
              </div>

            </div>
          )}

          {activeTab === "RegistroICG" && (
            <div className="filtros-box">
              <div className="filtros-content">
                {/* vacío */}
              </div>
            </div>
          )}

          {activeTab === "FincasRegistrales" && (
            <div className="filtros-box">
              <div className="filtros-content">
                {/* vacío */}
              </div>
            </div>
          )}

          {activeTab === "Especialidades" && (
            <div className="filtros-box">
              <div className="filtros-content">
                {/* vacío */}
              </div>
            </div>
          )}

          {activeTab === "Catalogo" && (
            <div className="filtros-box">
              <div className="filtros-content">
                {/* vacío */}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default FichaCliente;