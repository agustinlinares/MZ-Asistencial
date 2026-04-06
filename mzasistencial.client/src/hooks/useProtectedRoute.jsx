import { useEffect } from 'react';
import AuthService from '@services/auth/AuthService';
import { useNavigate } from 'react-router-dom';

const UseProtectedRoute = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!AuthService.isTokenValid()) {
            navigate('/'); // Redirige a la página de inicio de sesión
        }
    }, [navigate]);

    return {
        isAuthenticated: AuthService.isTokenValid(),
        token: AuthService.getToken(),
    };
};

export default UseProtectedRoute;