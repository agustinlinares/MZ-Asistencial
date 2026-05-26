const API_URL = "/api/PresupuestosLiquidados"; 

export const presupuestosLiquidadosService = {
    obtenerTodos: async () => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los presupuestos.");
        return await response.json();
    },

    obtenerPorId: async (id) => {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el presupuesto.");
        return await response.json();
    },

    insertar: async (datos) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || "Error al crear el presupuesto.");
        }
        return await response.json();
    },

    actualizar: async (id, datos) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        if (!response.ok) throw new Error("Error al actualizar el presupuesto.");
        return true;
    },

    eliminar: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Error al eliminar el presupuesto.");
        return true;
    }
};