import React, { useState, useEffect } from "react";
import DataGrid, { Column, Scrolling, Paging, SearchPanel } from "devextreme-react/data-grid";
import './FichaCentroConcertado.css'; 

const ToolbarExport = () => (
    <div className="toolbar-export">
        <a href="#" className="btn-export">
            <i className="dx-icon-xlsxfile"></i> Exportar a Excel
        </a>
        <a href="#" className="btn-export">
            <i className="dx-icon-exportpdf"></i> Exportar a PDF
        </a>
    </div>
);

const FichaCentroConcertado = ({ cliente, onClose }) => {
  const [activeTab, setActiveTab] = useState("general");

  // Estado para el formulario
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (cliente) {
      setFormData({ ...cliente});
    }
  }, [cliente]);

  // Función para escribir en los inputs
  const handleChange = (e) => {
    const { name, defaultValue } = e.target;
    console.log(`Cambiando campo [${name}] a:`, defaultValue);
    setFormData({
      ...formData,
      [name]: defaultValue
    });
  };

  // Datos de ejemplo hasta que los endpoints sean reales)
  const datosICG = []; 
  const datosMutuas = [];
  const datosEspecialidades = [];

  return (
    <div className="ficha-overlay">
      <div className="ficha-container">

        <div className="Header">
          <div className="titleFicha">Ficha Centro Concertado</div>
          <div className="ComboBotones">
              {/* Aquí se puede enviar el formData a tu API al pulsar Aceptar */}
              <button className="ficha-close-btn" onClick={() => console.log("Guardando:", formData)}> ☑ Aceptar</button>
              <button className="ficha-close-btn" onClick={onClose}>× Salir</button>
          </div>
        </div>

        <div className="ficha-tabs">
          <button className={`tab-button ${activeTab === "general" ? "active" : ""}`} onClick={() => setActiveTab("general")}>General</button>
          <button className={`tab-button ${activeTab === "registroICG" ? "active" : ""}`} onClick={() => setActiveTab("registroICG")}>Registro ICG</button>
          <button className={`tab-button ${activeTab === "mutuasAsignadas" ? "active" : ""}`} onClick={() => setActiveTab("mutuasAsignadas")}>Mutuas Asignadas</button>
          <button className={`tab-button ${activeTab === "especialidades" ? "active" : ""}`} onClick={() => setActiveTab("especialidades")}>Especialidades / Serv.</button>
        </div>

        <div className="tab-content">
          
          {/* Pestaña general */}
          {activeTab === "general" && (
            <div className="filtros-box general">
                <div className="filtros-content">
                  
                  {/* Fila 1 */}
                  <div className="filtro-item">
                    <label>Localizador</label>
                    <input type="text" name="Localizador" defaultValue={formData.Localizador || ""} onChange={handleChange} />
                  </div>
                  <div className="filtro-item">
                    <label>Proveedor</label>
                    <select name="Proveedor" defaultValue={formData.Proveedor || ""} onChange={handleChange}>
                      <option></option>
                    </select>
                  </div>

                  {/* Fila 2 */}
                  <div className="filtro-item">
                    <label>Delegación</label>
                    <select name="Delegacion" defaultValue={formData.Delegacion || ""} onChange={handleChange}>
                      <option></option>
                    </select>
                  </div>
                  <div className="filtro-item">
                    <label>Centro</label>
                    <input type="text" name="Centro" defaultValue={formData.Centro || ""} onChange={handleChange} />
                  </div>

                  {/* Fila 3 */}
                  <div className="filtro-item">
                    <label>Provincia</label>
                    <select name="Provincia" defaultValue={formData.Provincia || ""} onChange={handleChange}>
                      <option>{formData.Provincia}</option>
                    </select>
                  </div>
                  <div className="filtro-item">
                    <label>Poblacion</label>
                    <select name="Poblacion" defaultValue={formData.Poblacion || ""} onChange={handleChange}>
                      <option>{formData.Poblacion}</option>
                    </select>
                  </div>

                  {/* Fila 4 */}
                  <div className="filtro-item">
                    <label>CIF / NIF</label>
                    <input type="text" name="Cif" defaultValue={formData.Cif || ""} onChange={handleChange} />
                  </div>
                  <div className="filtro-item">
                    <label>Código Postal</label>
                    <select name="CP" defaultValue={formData.CP || ""} onChange={handleChange}>
                      <option>{formData.CP}</option>
                    </select>
                  </div>
                  <div className="filtro-item">
                    <label>Dirección</label>
                    <input type="text" name="Direccion" defaultValue={formData.Direccion || ""} onChange={handleChange} />
                  </div>

                  {/* Fila 5 */}
                  <div className="filtro-item">
                    <label>Número</label>
                    <input type="text" name="Numero" defaultValue={formData.Numero || ""} onChange={handleChange} />
                  </div>
                  <div className="filtro-item">
                    <label>Teléfono</label>
                    <input type="text" name="Telefono" defaultValue={formData.Telefono || ""} onChange={handleChange} />
                  </div>
                  <div className="filtro-item">
                    <label>Nº de Registro Sanitario</label>
                    <input type="text" name="RegistroSanitario" defaultValue={formData.RegistroSanitario || ""} onChange={handleChange} />
                  </div>

                  {/* Fila 6 */}
                  <div className="filtro-item">
                    <label>Dirección Google</label>
                    <input type="text" name="DireccionGoogle" defaultValue={formData.DireccionGoogle || ""} onChange={handleChange} />
                  </div>
                  <div className="filtro-item justifyCenter">
                    <label>Verificar dirección Google</label>
                    <span>🌎</span>
                  </div>
                  <div className="filtro-item">
                    <label>Fecha de baja</label>
                    <input type="date" name="FechaBaja" defaultValue={formData.FechaBaja || ""} onChange={handleChange} />
                  </div>

                  {/* Textareas */}
                  <div className="bloque" style={{ width: "100%", marginTop: "15px" }}>
                    <label className="bloque-titulo">Comentarios</label>
                    <textarea name="Comentarios" defaultValue={formData.Comentarios || ""} onChange={handleChange} style={{ width: "100%", height: "60px" }}></textarea>
                  </div>

                  <div className="bloque" style={{ width: "100%", marginTop: "15px" }}>
                    <label className="bloque-titulo">Motivo de la baja</label>
                    <textarea name="MotivoBaja" defaultValue={formData.MotivoBaja || ""} onChange={handleChange} style={{ width: "100%", height: "60px" }}></textarea>
                  </div>

                </div>
            </div>
          )}

          {/* Pestaña de registro ICG */}
          {activeTab === "registroICG" && (
            <div className="filtros-box tab-tabla">
               <ToolbarExport />
               <DataGrid dataSource={datosICG} showBorders={true} noDataText="Sin datos para mostrar" height={400}>
                  <Scrolling mode="standard" />
                  <Column dataField="anyo" caption="Año" width={100} />
                  <Column dataField="mutua" caption="Mutua" />
                  <Column dataField="centro" caption="Centro" />
                  <Column dataField="fechaActualizacion" caption="Fecha de Actualización" dataType="date" width={150} />
                  <Column dataField="usuario" caption="Usuario" width={150} />
               </DataGrid>
            </div>
          )}

          {/* Pestaña de mutuas asignadas */}
          {activeTab === "mutuasAsignadas" && (
            <div className="filtros-box tab-tabla">
               <ToolbarExport />
               <DataGrid dataSource={datosMutuas} showBorders={true} noDataText="Sin datos para mostrar" height={400}>
                  <Scrolling mode="standard" />
                  <Column dataField="mutua" caption="Mutua" />
               </DataGrid>
            </div>
          )}

          {/* Pestaña de especialidades */}
          {activeTab === "especialidades" && (
            <div className="filtros-box tab-tabla">
               <ToolbarExport />
               <DataGrid dataSource={datosEspecialidades} showBorders={true} noDataText="Sin datos para mostrar" height={400}>
                  <Scrolling mode="standard" />
                  <Column dataField="anyo" caption="Año" width={100} />
                  <Column dataField="servicio" caption="Servicio" />
                  <Column dataField="especialidad" caption="Especialidad" />
                  <Column dataField="cantidad" caption="Cantidad" width={100} />
               </DataGrid>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FichaCentroConcertado;