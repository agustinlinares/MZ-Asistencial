import React, { useState, useEffect } from "react";
import DataGrid, { Column, Scrolling } from "devextreme-react/data-grid";
import { conciertosService } from "../../../services/admin/ConciertosService";
import { useLogError } from '../../../hooks/useLogError';

const TabEspecialidades = ({ conciertoId }) => {
    const [especialidades, setEspecialidades] = useState([]);
    const logError = useLogError("TabEspecialidades");

    useEffect(() => {
        const cargarEspecialidades = async () => {
            try {
                // Obtiene los datos a través del servicio creado
                const data = await conciertosService.obtenerEspecialidades(conciertoId);
                setEspecialidades(data);
            } catch (error) {
                logError(`Fallo al cargar las especialidades del concierto ${conciertoId}`, error);
            }
        };
        
        if (conciertoId) {
            cargarEspecialidades();
        }
    }, [conciertoId, logError]);

    return (
        <div>
            <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                <i className="ri-information-line" style={{ marginRight: '5px' }}></i>
                Listado consolidado de especialidades y servicios cubiertos por este concierto.
            </div>

            <DataGrid 
                dataSource={especialidades} 
                showBorders={true} 
                noDataText="No hay especialidades o servicios asociados a este concierto"
                height={350}
                rowAlternationEnabled={true}
            >
                <Scrolling mode="standard" />
                
                <Column dataField="año" caption="Año" width={100} alignment="center" />
                <Column dataField="servicioId" caption="ID Servicio" width={120} alignment="center" />
                <Column dataField="especialidadId" caption="ID Especialidad" />
                <Column dataField="cantidad" caption="Cantidad" width={120} alignment="center" />
                <Column 
                    dataField="importeConIva" 
                    caption="Importe (IVA inc.)" 
                    width={150} 
                    alignment="right"
                    format={{ type: "currency", currency: "EUR", precision: 2 }} 
                />
            </DataGrid>
        </div>
    );
};

export default TabEspecialidades;