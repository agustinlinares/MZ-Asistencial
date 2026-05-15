const API_URL = '/api';

const CitacionesService = {
    getSolicitadas: async (mutuaId, filters = {}) => {
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
            );
            const params = new URLSearchParams(cleanFilters).toString();
            const response = await fetch(`${API_URL}/citaciones/solicitadas/${mutuaId}?${params}`);
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
            const response = await fetch(`${API_URL}/citaciones/recibidas/${mutuaId}?${params}`);
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
                method: 'PUT'
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
                method: 'PUT'
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
                headers: { 'Content-Type': 'application/json' },
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
