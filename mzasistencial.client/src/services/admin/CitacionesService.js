const API_URL = '/api';

const authHeaders = () => {
    const userStr = localStorage.getItem('UsuarioActual') || sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const token = user?.token || localStorage.getItem('token') || sessionStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const CitacionesService = {
    getSolicitadas: async (mutuaId, filters = {}) => {
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
            );
            const params = new URLSearchParams(cleanFilters).toString();
            const response = await fetch(`${API_URL}/citaciones/solicitadas/${mutuaId}?${params}`, {
                headers: authHeaders()
            });
            if (!response.ok) throw new Error('Error al obtener citaciones solicitadas');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getRecibidas: async (mutuaId, filters = {}) => {
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
            );
            const params = new URLSearchParams(cleanFilters).toString();
            const response = await fetch(`${API_URL}/citaciones/recibidas/${mutuaId}?${params}`, {
                headers: authHeaders()
            });
            if (!response.ok) throw new Error('Error al obtener citaciones recibidas');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateEstado: async (citacionId, estadoId, contestacion) => {
        try {
            const response = await fetch(`${API_URL}/citaciones/${citacionId}/estado?estadoId=${estadoId}&contestacion=${contestacion}`, {
                method: 'PUT',
                headers: authHeaders()
            });
            if (!response.ok) throw new Error('Error al actualizar estado de citación');
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateRechazo: async (citacionId, motivo) => {
        try {
            const response = await fetch(`${API_URL}/citaciones/${citacionId}/rechazar?motivo=${motivo}`, {
                method: 'PUT',
                headers: authHeaders()
            });
            if (!response.ok) throw new Error('Error al rechazar citación');
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateEstadoLote: async (ids, estadoId, contestacion) => {
        try {
            const response = await fetch(`${API_URL}/citaciones/lote/estado`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ ids, estadoId, contestacion })
            });
            if (!response.ok) throw new Error('Error al actualizar estado en lote');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateRechazoLote: async (ids, motivo) => {
        try {
            const response = await fetch(`${API_URL}/citaciones/lote/rechazar`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ ids, motivo })
            });
            if (!response.ok) throw new Error('Error al rechazar en lote');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    create: async (mutuaId, data) => {
        try {
            const response = await fetch(`${API_URL}/citaciones/${mutuaId}`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al crear solicitud de citación');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getDocumentos: async (citacionId) => {
        try {
            const response = await fetch(`${API_URL}/citaciones/${citacionId}/documentos`, {
                headers: authHeaders()
            });
            if (!response.ok) throw new Error('Error al obtener documentos');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    uploadDocumentos: async (citacionId, files) => {
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            
            const headers = authHeaders();
            delete headers['Content-Type']; // Let the browser set it for FormData

            const response = await fetch(`${API_URL}/citaciones/${citacionId}/documentos`, {
                method: 'POST',
                headers: headers,
                body: formData
            });
            
            if (!response.ok) throw new Error('Error al subir documentos');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    descargarDocumento: (citacionId, docId) => {
        // Since we need to trigger a file download, we can either use fetch and create an object URL, 
        // or just open the URL directly. Because of authorization headers, we might need fetch.
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const userStr = localStorage.getItem('UsuarioActual') || sessionStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const actualToken = token || user?.token;

        fetch(`${API_URL}/citaciones/${citacionId}/documentos/${docId}`, {
            headers: {
                'Authorization': `Bearer ${actualToken}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = "documento";
            if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
                filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
            }
            return response.blob().then(blob => ({ blob, filename }));
        })
        .then(({ blob, filename }) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = decodeURIComponent(filename);
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(err => console.error('Error downloading file:', err));
    },

    getHistorial: async (citacionId) => {
        try {
            const response = await fetch(`${API_URL}/citaciones/${citacionId}/historial`, {
                headers: authHeaders()
            });
            if (!response.ok) throw new Error('Error al obtener historial');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

export default CitacionesService;
