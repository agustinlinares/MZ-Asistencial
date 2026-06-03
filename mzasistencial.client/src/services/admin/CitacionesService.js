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
    }
};

export default CitacionesService;
