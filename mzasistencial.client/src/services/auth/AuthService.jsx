const AuthService = {
    setUserData: (data) => {
        localStorage.setItem('UsuarioActual', JSON.stringify(data));
    },
    getUserData: () => {
        const datos = localStorage.getItem('UsuarioActual');
        return datos ? JSON.parse(datos) : null;
    },
    getToken: () => {
        const datos = AuthService.getUserData();
        return datos?.token ?? null;
    },
    getUser: () => {
        const datos = AuthService.getUserData();
        return datos?.usuario ?? '';
    },
    getUserId: () => {
        const datos = AuthService.getUserData();
        return datos?.usuarioId ?? '';
    },
    getPerfilId: () => {
        const datos = AuthService.getUserData();
        return datos?.perfilId ?? null;
    },
    removeUserData: () => {
        localStorage.removeItem('UsuarioActual');
    },
    isTokenValid: () => {
        const token = AuthService.getToken();
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },
    // Helper para fetch autenticado
    fetch: (url, options = {}) => {
        const token = AuthService.getToken();
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(options.headers ?? {})
            }
        });
    }
};

export default AuthService;