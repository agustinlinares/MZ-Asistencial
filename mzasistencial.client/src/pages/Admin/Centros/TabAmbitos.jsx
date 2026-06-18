import React, { useState, useEffect } from "react";
import DataGrid, { Column, Scrolling } from "devextreme-react/data-grid";
import notify from 'devextreme/ui/notify';
import { conciertosService } from "../../../services/admin/ConciertosService";
import AuthService from "../../../services/auth/AuthService";

const TabAmbitos = ({ conciertoId }) => {
    const [ambitos, setAmbitos] = useState([]);
    const [opts, setOpts] = useState({ provincias: [], poblaciones: [] });
    const [form, setForm] = useState({ provinciaId: '', poblacionId: '', cp: '' });

    const cargarAmbitos = async () => {
        const data = await conciertosService.obtenerAmbitos(conciertoId);
        setAmbitos(data);
    };

    useEffect(() => {
        cargarAmbitos();
        fetch('/api/AuxProvincias', { headers: { 'Authorization': `Bearer ${AuthService.getToken()}` } })
            .then(r => r.json()).then(provincias => setOpts(prev => ({ ...prev, provincias })));
    }, [conciertoId]);

    // Cascada Poblaciones
    useEffect(() => {
        if (!form.provinciaId) return;
        fetch(`/api/AuxPoblaciones/${form.provinciaId}`, { headers: { 'Authorization': `Bearer ${AuthService.getToken()}` } })
            .then(r => r.json()).then(poblaciones => setOpts(prev => ({ ...prev, poblaciones })));
    }, [form.provinciaId]);

    const handleAdd = async () => {
        if (!form.poblacionId || !form.cp) {
            notify("Población y CP son obligatorios", "error", 2000);
            return;
        }
        try {
            await conciertosService.crearAmbito(conciertoId, {
                ambitoId: 1, 
                poblacionId: form.poblacionId,
                cp: form.cp
            });
            notify("Ámbito añadido", "success", 2000);
            setForm({ provinciaId: '', poblacionId: '', cp: '' });
            cargarAmbitos();
        } catch (error) {
            notify("Error al añadir ámbito", "error", 3000);
        }
    };

    const handleEliminar = async (ambitoId) => {
        try {
            await conciertosService.eliminarAmbito(conciertoId, ambitoId);
            notify("Ámbito eliminado", "success", 2000);
            cargarAmbitos();
        } catch (error) {
            notify("Error al eliminar", "error", 3000);
        }
    };

    return (
        <div>
            <div className="ficha-grid" style={{ marginBottom: '15px', backgroundColor: '#f9f9f9', padding: '10px' }}>
                <div className="ficha-field">
                    <label>Provincia</label>
                    <select value={form.provinciaId} onChange={e => setForm({ ...form, provinciaId: e.target.value, poblacionId: '' })}>
                        <option value="">— Seleccionar —</option>
                        {opts.provincias.map(p => <option key={p.provinciaId} value={p.provinciaId}>{p.provincia}</option>)}
                    </select>
                </div>
                <div className="ficha-field">
                    <label>Población</label>
                    <select value={form.poblacionId} onChange={e => setForm({ ...form, poblacionId: e.target.value })} disabled={!form.provinciaId}>
                        <option value="">— Seleccionar —</option>
                        {opts.poblaciones.map(p => <option key={p.poblacionId} value={p.poblacionId}>{p.poblacion}</option>)}
                    </select>
                </div>
                <div className="ficha-field">
                    <label>C.P.</label>
                    <input type="text" value={form.cp} onChange={e => setForm({ ...form, cp: e.target.value })} />
                </div>
                <div className="ficha-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button className="ficha-btn-primary" onClick={handleAdd}>Añadir</button>
                </div>
            </div>

            <DataGrid dataSource={ambitos} showBorders height={300}>
                <Scrolling mode="standard" />
                <Column dataField="cp" caption="CP" width={100} />
                <Column dataField="poblacionId" caption="ID Población" />
                <Column 
                    caption="Acciones" 
                    width={80} 
                    alignment="center"
                    cellRender={(cellData) => (
                        <i className="ri-delete-bin-line delete-icon" onClick={() => handleEliminar(cellData.data.id)} title="Eliminar" />
                    )} 
                />
            </DataGrid>
        </div>
    );
};
export default TabAmbitos;