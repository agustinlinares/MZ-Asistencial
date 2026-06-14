const API_URL = '/api/TiposDemanda';

// Formateo a 'yyyy-MM-dd' para que C# (DateOnly) no rechace la petición
const formatToDateOnly = (dateSource) => {
  if (!dateSource) return null;
  const date = new Date(dateSource);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const tiposDemandaService = {
  getAll: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Fallo al obtener datos');
    return response.json();
  },
  
  getAuxiliar: async () => {
    const response = await fetch(`${API_URL}/auxiliar`);
    if (!response.ok) throw new Error('Fallo al obtener catálogo');
    return response.json();
  },
  
  create: async (data) => {
    const payload = {
      ...data,
      periodoDesde: formatToDateOnly(data.periodoDesde),
      periodoHasta: formatToDateOnly(data.periodoHasta)
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Error del servidor al crear');
    }
    return response.json();
  },
  
  update: async (id, data) => {
    const payload = { ...data };
    if (data.periodoDesde) payload.periodoDesde = formatToDateOnly(data.periodoDesde);
    if (data.periodoHasta) payload.periodoHasta = formatToDateOnly(data.periodoHasta);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) throw new Error('Error al actualizar');
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar');
  }
};