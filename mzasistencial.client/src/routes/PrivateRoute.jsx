// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '@services/auth/AuthService';

const PrivateRoute = () => {
    // const isAuthenticated = AuthService.isTokenValid();

    // if (!isAuthenticated) {
    //     return <Navigate to="/" replace />; // Redirige a la página de registro
    // }

    return <Outlet />; // Renderiza las rutas hijas
};

export default PrivateRoute;