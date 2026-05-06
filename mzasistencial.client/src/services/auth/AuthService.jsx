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
        const datosUsuario = AuthService.getUserData();
        return datosUsuario && datosUsuario.usuarioId ? datosUsuario.usuarioId : '';
    },
    removeUserData: () => {
        localStorage.removeItem('UsuarioActual');
    },
    isTokenValid: () => {
        const datosUsuario = AuthService.getUserData();
        return datosUsuario !== null && !!datosUsuario.usuario;
    }
};

export default AuthService;