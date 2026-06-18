import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid, Column, Paging } from 'devextreme-react/data-grid';
import { confirm as dxConfirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import AuthService from '../../../services/auth/AuthService';
import { useLogError } from '../../../hooks/useLogError';

const TabRegistrosICG = ({ conciertoId }) => {
    const logError = useLogError("Tab Registros ICG");
    const [registros, setRegistros] = useState([]);

    const cargarRegistros = useCallback(async () => {
        try {
            const res = await fetch(`/api/IcgConciertos`, {
                headers: { 'Authorization': `Bearer ${AuthService.getToken()}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Filtra para mostrar solo los registros que pertenecen a este concierto
                const filtrados = data.filter(r => r.concierto_id === conciertoId || r.Concierto_id === conciertoId);
                setRegistros(filtrados);
            }
        } catch (error) {
            logError("Error al cargar registros ICG", error);
        }
    }, [conciertoId, logError]);

    useEffect(() => {
        cargarRegistros();
    }, [cargarRegistros]);

    const handleEliminarICG = async (idIcg) => {
        // Cuadro de confirmación
        const ok = await dxConfirm("¿Eliminar este registro anual ICG07 de la base de datos? El concierto no se borrará.", "Confirmar eliminación");
        if (!ok) return;

        try {
            // Ataca directamente al endpoint del controlador IcgConciertos
            const res = await fetch(`/api/IcgConciertos/${idIcg}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${AuthService.getToken()}` }
            });

            if (res.ok) {
                notify("Registro ICG07 eliminado correctamente", "success", 3000);
                cargarRegistros(); // Recarga local del grid interno
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Error del servidor al intentar borrar el registro.");
            }
        } catch (error) {
            logError(`Fallo al eliminar el registro ICG ID: ${idIcg}`, error);
            notify(error.message, "error", 4000);
        }
    };

    return (
        <div className="ficha-grid" style={{ marginTop: '10px', width: '100%' }}>
            <DataGrid
                dataSource={registros}
                showBorders={true}
                rowAlternationEnabled={true}
                noDataText="No hay actividad ICG vinculada a este concierto."
                width="100%"            
                columnAutoWidth={true}  
                wordWrapEnabled={true}  
            >
                <Paging enabled={false} />
                
                <Column dataField="id_Icg" caption="ID" alignment="center" width={60} />
                <Column dataField="total" caption="Coste Total" dataType="number" format="#,##0.00 €" alignment="right" width={120} />
                <Column dataField="asistenciaSanitaria" caption="Asist. San." dataType="number" format="#,##0.00 €" alignment="right" />
                <Column dataField="incapacidadTemp" caption="Incap. Temp." dataType="number" format="#,##0.00 €" alignment="right" />
                <Column 
                    dataField="confirmar" 
                    caption="Validado" 
                    dataType="boolean" 
                    alignment="center" 
                    width={90}
                    cellRender={(c) => c.value 
                        ? <i className="ri-check-line" style={{ color: '#2e7d32', fontSize: '18px', fontWeight: 'bold' }}></i> 
                        : <i className="ri-close-line" style={{ color: '#d32f2f', fontSize: '18px', fontWeight: 'bold' }}></i>
                    } 
                />

                <Column
                    caption="Acciones"
                    width={80}
                    alignment="center"
                    allowExporting={false}
                    cellRender={(cellData) => (
                        <div className="ficha-row-actions">
                            <i 
                                className="ri-delete-bin-line delete-icon" 
                                onClick={() => handleEliminarICG(cellData.data.id_Icg || cellData.data.Id_Icg)} 
                                title="Eliminar registro ICG07"
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                    )}
                />
            </DataGrid>
        </div>
    );
};

export default TabRegistrosICG;