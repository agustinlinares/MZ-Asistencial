import React, { useState, useEffect, useRef } from "react";
import DataGrid, { Column, Scrolling } from "devextreme-react/data-grid";
import notify from 'devextreme/ui/notify';
import { confirm as dxConfirm } from 'devextreme/ui/dialog';
import { conciertosService } from "../../../services/admin/ConciertosService";

const TabDocumentos = ({ conciertoId }) => {
    const [documentos, setDocumentos] = useState([]);
    const [fileObj, setFileObj] = useState(null);
    const [form, setForm] = useState({ titulo: '', observaciones: '' });
    const fileInputRef = useRef(null);

    const cargarDocumentos = async () => {
        const data = await conciertosService.obtenerDocumentos(conciertoId);
        setDocumentos(data);
    };

    useEffect(() => { cargarDocumentos(); }, [conciertoId]);

    const handleUpload = async () => {
        if (!fileObj) {
            notify("Debe seleccionar un fichero", "error", 2000);
            return;
        }

        try {
            await conciertosService.subirDocumento(conciertoId, fileObj, form.titulo, form.observaciones);
            notify("Fichero subido y registrado correctamente", "success", 2000);
            
            // Limpiar formulario
            setFileObj(null);
            setForm({ titulo: '', observaciones: '' });
            if (fileInputRef.current) fileInputRef.current.value = "";
            
            cargarDocumentos();
        } catch (error) {
            notify(`Error de validación: ${error.message}`, "error", 4000);
        }
    };

    const handleEliminar = async (docId) => {
        const ok = await dxConfirm("Se eliminará permanentemente de la BD y del servidor. ¿Continuar?", "Borrar Archivo");
        if (!ok) return;

        try {
            await conciertosService.eliminarDocumento(docId);
            notify("Documento eliminado físicamente", "success", 2000);
            cargarDocumentos();
        } catch (error) {
            notify("Error al eliminar", "error", 3000);
        }
    };

    return (
        <div>
            <div className="ficha-grid" style={{ marginBottom: '15px', backgroundColor: '#eef2f5', padding: '10px' }}>
                <div className="ficha-field">
                    <label>Fichero Físico</label>
                    <input type="file" ref={fileInputRef} onChange={e => setFileObj(e.target.files[0])} />
                </div>
                <div className="ficha-field">
                    <label>Título del Doc.</label>
                    <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
                </div>
                <div className="ficha-field">
                    <label>Observaciones</label>
                    <input type="text" value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} />
                </div>
                <div className="ficha-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button className="ficha-btn-primary" onClick={handleUpload}>Subir Doc</button>
                </div>
            </div>

            <DataGrid dataSource={documentos} showBorders height={300}>
                <Scrolling mode="standard" />
                <Column dataField="titulo" caption="Título" width={150} />
                <Column dataField="documento" caption="Archivo Físico (Nombre)" />
                <Column dataField="fechaAlta" caption="Fecha Alta" dataType="date" width={110} />
                <Column dataField="observaciones" caption="Observaciones" />
                <Column 
                    caption="Acciones" 
                    width={80} 
                    alignment="center"
                    cellRender={(cell) => (
                        <i className="ri-delete-bin-line delete-icon" onClick={() => handleEliminar(cell.data.documentoId)} title="Eliminar del Disco" />
                    )} 
                />
            </DataGrid>
        </div>
    );
};
export default TabDocumentos;