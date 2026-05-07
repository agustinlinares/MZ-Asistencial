// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '@services/auth/AuthService';

const PrivateRoute = () => {
    if (!AuthService.isTokenValid()) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default PrivateRoute;
