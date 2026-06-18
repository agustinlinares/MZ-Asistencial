import AuthService from "../auth/AuthService";

const API_URL = "/api/Conciertos";

const getHeaders = (isFormData = false) => {
    const token = AuthService.getToken();
    const headers = { 'Authorization': token ? `Bearer ${token}` : '' };
    if (!isFormData) headers['Content-Type'] = 'application/json';
    return headers;
};

export const conciertosService = {
    // --- PRINCIPALES ---
    obtenerTodos: async () => {
        const res = await fetch(API_URL, { headers: getHeaders() });
        if (!res.ok) throw new Error("Error al obtener los conciertos");
        return await res.json();
    },

    obtenerSinAutorizar: async () => {
        const res = await fetch(`${API_URL}/sin-autorizar`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Error al obtener conciertos sin autorizar");
        return await res.json();
    },

    obtenerPorId: async (id) => {
        const res = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Error al obtener el concierto");
        return await res.json();
    },

    crear: async (datos) => {
        const res = await fetch(API_URL, { method: "POST", headers: getHeaders(), body: JSON.stringify(datos) });
        if (!res.ok) throw new Error("Error al crear el concierto");
        return await res.json();
    },

    actualizar: async (id, datos) => {
        const res = await fetch(`${API_URL}/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(datos) });
        if (!res.ok) throw new Error("Error al actualizar el concierto");
        return true;
    },

    eliminarConcierto: async (id) => {
        const res = await fetch(`${API_URL}/${id}`, { 
            method: "DELETE", 
            headers: getHeaders() 
        });

        if (!res.ok) {
            // Intenta capturar el error exacto que manda C#, si no, texto genérico
            try {
                const errorData = await res.json();
                throw new Error(errorData.message || "No se pudo eliminar el concierto.");
            } catch {
                throw new Error("Error del servidor al intentar borrar el concierto completo.");
            }
        }
        
        // Si devuelve 204 (NoContent) todo ha ido perfecto
        return true; 
    },

    // --- COMBOS AUXILIARES ---
    obtenerTiposAsistencia: async (anio) => {
        const res = await fetch(`${API_URL}/tipos-asistencia?anio=${anio}`, { headers: getHeaders() });
        if (!res.ok) return [];
        return await res.json();
    },

    obtenerCentrosAdhesion: async () => {
        const res = await fetch(`${API_URL}/centros-adhesion`, { headers: getHeaders() });
        if (!res.ok) return [];
        return await res.json();
    },

    // --- SUB-RECURSOS ---
    obtenerAmbitos: async (id) => {
        const res = await fetch(`${API_URL}/${id}/Ambitos`, { headers: getHeaders() });
        return res.ok ? await res.json() : [];
    },
    
    crearAmbito: async (id, datos) => {
        const res = await fetch(`${API_URL}/${id}/Ambitos`, { method: "POST", headers: getHeaders(), body: JSON.stringify(datos) });
        if (!res.ok) throw new Error("Error al añadir ámbito");
        return await res.json();
    },

    eliminarAmbito: async (id, ambitoId) => {
        const res = await fetch(`${API_URL}/${id}/Ambitos/${ambitoId}`, { method: "DELETE", headers: getHeaders() });
        if (!res.ok) throw new Error("Error al eliminar ámbito");
        return true;
    },

    obtenerEspecialidades: async (id) => {
        const res = await fetch(`${API_URL}/${id}/Especialidades`, { headers: getHeaders() });
        return res.ok ? await res.json() : [];
    },

    obtenerDocumentos: async (id) => {
        const res = await fetch(`${API_URL}/${id}/Documentos`, { headers: getHeaders() });
        return res.ok ? await res.json() : [];
    },

    subirDocumento: async (id, file, titulo, observaciones) => {
        const formData = new FormData();
        formData.append("File", file);
        formData.append("Titulo", titulo || '');
        formData.append("Observaciones", observaciones || '');

        const res = await fetch(`${API_URL}/${id}/Documentos/Upload`, {
            method: "POST",
            headers: getHeaders(true),
            body: formData
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    actualizarMetadatosDocumento: async (id, docId, datos) => {
        const res = await fetch(`${API_URL}/${id}/Documentos/${docId}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(datos) });
        if (!res.ok) throw new Error("Error al actualizar metadatos");
        return true;
    },

    eliminarDocumento: async (docId) => {
        const res = await fetch(`${API_URL}/Documentos/${docId}`, { method: "DELETE", headers: getHeaders() });
        if (!res.ok) throw new Error("Error al eliminar documento físico");
        return true;
    }
};