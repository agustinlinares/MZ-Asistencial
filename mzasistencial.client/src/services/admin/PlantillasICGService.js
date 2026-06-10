const BASE_URL = '/api/PlantillasICG';

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

const PlantillasICGService = {
    // Obtener la lista de plantillas subidas
    getInformes: async (mutuaId, anio) => {
        let url = `${BASE_URL}/informes?anio=${anio}`;
        if (mutuaId) url += `&mutuaId=${encodeURIComponent(mutuaId)}`;

        const response = await fetch(url, { headers: authHeaders() });
        if (!response.ok) throw new Error('Error al cargar informes ICG');
        return await response.json();
    },

    // Generar la plantilla en CSV o XML
    generarPlantilla: async (mutuaId, anio, tipo, formato) => {
        const params = new URLSearchParams({
            anio: anio,
            tipo: tipo,
            formato: formato
        });
        if (mutuaId) params.append('mutuaId', mutuaId);

        const response = await fetch(`${BASE_URL}/generar?${params.toString()}`, {
            method: 'GET',
            headers: authHeaders(),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al generar la plantilla');
        }

        // Descargar el fichero (CSV o XML)
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Plantilla_${tipo}_${anio}.${formato.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    },

    // Subir un fichero (Ficha Doc. Adjunto)
    subirPlantilla: async (formData) => {
        const userStr = localStorage.getItem('UsuarioActual') || sessionStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const token = user?.token || localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        // FormData permite mandar el fichero físico y los datos en multipart/form-data
        const response = await fetch(`${BASE_URL}/subir`, {
            method: 'POST',
            body: formData,
            headers: headers
            // fetch configura automáticamente el boundary de multipart/form-data al mandar formData
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al subir la plantilla');
        }

        return await response.json();
    },

    // Procesar plantillas pendientes
    procesarPlantillas: async () => {
        const response = await fetch(`${BASE_URL}/procesar`, {
            method: 'POST',
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error('Error al procesar las plantillas');
        return await response.json();
    },
    
    // Obtener el año máximo y la mutua del usuario (si no es admin)
    getDatosIniciales: async () => {
        const response = await fetch(`${BASE_URL}/iniciales`, { headers: authHeaders() });
        if (!response.ok) throw new Error('Error al cargar datos iniciales');
        return await response.json();
    },

    // Eliminar un informe
    eliminarPlantilla: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al eliminar la plantilla');
        }
        return await response.json();
    }
};

export default PlantillasICGService;
