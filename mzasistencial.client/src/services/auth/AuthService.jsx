// src/services/authService.js
const AuthService = {
    setUserData: (data) => {
        localStorage.setItem('UsuarioActual', JSON.stringify(data));
    },
    getUserData: () => {
        const datosUsuario = localStorage.getItem('UsuarioActual');
        return datosUsuario ? JSON.parse(datosUsuario) : null;
    },
    getToken: () => {
        const datosUsuario = AuthService.getUserData(); // Usa getUserData para obtener el objeto parseado
        return datosUsuario && datosUsuario.token ? datosUsuario.token : null;
    },
    getUser: () => {
        const datosUsuario = AuthService.getUserData(); // Usa getUserData para obtener el objeto parseado
        return datosUsuario && datosUsuario.usuario ? datosUsuario.usuario : '';
    },
    getUserId: () => {
        const datosUsuario = AuthService.getUserData(); // Usa getUserData para obtener el objeto parseado
        return datosUsuario && datosUsuario.usuario_id ? datosUsuario.usuario_id : '';
    },
    removeUserData: () => {
        localStorage.removeItem('UsuarioActual');
    },
    isTokenValid: () => {
        const token = AuthService.getToken(); // Usa AuthService.getToken()
        if (!token) return false;

        try {
            // Decodificación manual del token
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) return false;

            // Decodificar payload
            const payloadBase64 = tokenParts[1];
            const decodedPayload = JSON.parse(
                window.atob(
                    payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
                )
            );

            // Verificar expiración
            return decodedPayload.exp * 1000 > Date.now();
        } catch (error) {
            return false;
        }
    }
};

export default AuthService;