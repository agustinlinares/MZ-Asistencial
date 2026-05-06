import AuthService from "../auth/AuthService";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';

const authHeaders = () => {
    const token = AuthService.getToken();
    return { 
        'Authorization': token ? `Bearer ${token}` : '', 
        'Content-Type': 'application/json' 
    };
};

const FincasService = {
    async getAll(anio = null) {
        const url = anio ? `/api/FincasRegistrales?anio=${anio}` : '/api/FincasRegistrales';
        const res = await fetch(url, { headers: authHeaders() });
        if (!res.ok) throw new Error('Error al cargar fincas');
        return await res.json();
    },

    async getCentrosLookup() {
        const res = await fetch('/api/centros/lookup', { headers: authHeaders() });
        if (!res.ok) throw new Error('Error al cargar centros');
        return await res.json();
    },

    async save(data) {
        const isEdit = !!data.finca_id;
        const url = isEdit ? `/api/FincasRegistrales/${data.finca_id}` : '/api/FincasRegistrales';
        const method = isEdit ? 'PUT' : 'POST';
        
        const payload = {
            Finca_id: parseInt(data.finca_id) || 0,
            Centro_id: parseInt(data.centro_id) || 0,
            Mutua: data.mutua || null,
            Direccion: data.direccion || null,
            Numero: data.numero || null,
            Piso: data.piso || null,
            Puerta: data.puerta || null,
            Superficie: data.superficie !== '' && data.superficie != null ? parseFloat(data.superficie) : null,
            Coste: data.coste !== '' && data.coste != null ? parseFloat(data.coste) : null,
            F_Alquiler: data.f_adquisicion || null,
            Referencia_Catastral: data.ref_catastral || null,
            F_Inscripcion: data.f_inscripcion || null,
            F_Baja: data.f_baja || null,
            TipoFinca: data.tipo_finca_idx != null ? parseInt(data.tipo_finca_idx) : null,
            Titularidad: data.titularidad || null,
            OtrosDatos: data.otros_datos || null,
            Utilizacion: data.utilizacion || null,
            DireccionGoogle: data.dir_google || null,
            Latitud: data.latitud || null,
            Longitud: data.longitud || null,
        };

        const res = await fetch(url, { 
            method, 
            headers: authHeaders(), 
            body: JSON.stringify(payload) 
        });
        
        if (!res.ok) throw new Error(`Error al guardar: ${res.status}`);
        return isEdit ? data : await res.json();
    },

    async delete(id) {
        const res = await fetch(`/api/FincasRegistrales/${id}`, { 
            method: 'DELETE', 
            headers: authHeaders() 
        });
        if (!res.ok) throw new Error('Error al eliminar');
        return true;
    },

    async exportToExcel(gridInstance) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Fincas');

        await exportDataGrid({
            component: gridInstance,
            worksheet,
            autoFilterEnabled: true
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'Fincas.xlsx');
    },

    async exportToPDF(gridInstance) {
        const { exportDataGrid } = await import('devextreme/pdf_exporter');
        const { jsPDF } = await import('jspdf');
        
        const doc = new jsPDF({ orientation: 'landscape' });
        await exportDataGrid({
            jsPDFDocument: doc,
            component: gridInstance,
            indent: 5,
        });
        doc.save('Fincas.pdf');
    },

    async getCostes(fincaId) {
        const res = await fetch(`/api/FincasRegistrales/${fincaId}/costes`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Error al cargar costes');
        return await res.json();
    },

    async saveCoste(fincaId, coste) {
        const isEdit = !!coste.Id;
        const url = isEdit 
            ? `/api/FincasRegistrales/${fincaId}/costes/${coste.Id}`
            : `/api/FincasRegistrales/${fincaId}/costes`;
        const method = isEdit ? 'PUT' : 'POST';
        const payload = isEdit ? coste : { ...coste, FincaId: fincaId };

        const res = await fetch(url, {
            method,
            headers: authHeaders(),
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Error al guardar coste');
        return await res.json();
    },

    async deleteCoste(fincaId, id) {
        const res = await fetch(`/api/FincasRegistrales/${fincaId}/costes/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (!res.ok) throw new Error('Error al eliminar coste');
        return true;
    }
};

export default FincasService;
