const API_URL = '/api/Usuarios';

const getHeaders = () => {
  const userStr = localStorage.getItem('UsuarioActual') || sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = user?.token || localStorage.getItem('token') || sessionStorage.getItem('token');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const usuariosService = {
  getAll: async () => {
    const response = await fetch(API_URL, { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al obtener detalle del usuario');
    return response.json();
  },
  
  getPerfiles: async () => {
    const response = await fetch(`${API_URL}/perfiles`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al obtener perfiles');
    return response.json();
  },
  
  create: async (data) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const err = await response.text();
      let msg = 'Error al crear usuario';
      try { const parsed = JSON.parse(err); msg = parsed.message || JSON.stringify(parsed); } catch { msg = err || msg; }
      throw new Error(msg);
    }
    return response.json();
  },
  
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const err = await response.text();
      let msg = 'Error al actualizar usuario';
      try { const parsed = JSON.parse(err); msg = parsed.message || JSON.stringify(parsed); } catch { msg = err || msg; }
      throw new Error(msg);
    }
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      const err = await response.text();
      let msg = 'Error al dar de baja el usuario';
      try { const parsed = JSON.parse(err); msg = parsed.message || msg; } catch { msg = err || msg; }
      throw new Error(msg);
    }
  },

  changePassword: async (id, nuevaPassword) => {
    const response = await fetch(`${API_URL}/${id}/password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ nuevaPassword })
    });
    
    if (!response.ok) {
      const err = await response.text();
      let msg = 'Error al cambiar la contraseña';
      try { const parsed = JSON.parse(err); msg = parsed.message || msg; } catch { msg = err || msg; }
      throw new Error(msg);
    }
  }
};
