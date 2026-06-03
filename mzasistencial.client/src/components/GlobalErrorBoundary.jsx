import React from 'react';
import AuthService from '../services/auth/AuthService';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary capturó un error: ", error, errorInfo);
        
        // Registrar error en la base de datos
        const userIdRaw = AuthService.getUserId();
        const usuarioId = userIdRaw ? parseInt(userIdRaw, 10) : null;
        
        const payload = {
            descripcion: "Error en renderizado de React",
            modulo: "React Global ErrorBoundary",
            usuarioId: usuarioId,
            detalleError: `${error.message}\n\nStack:\n${errorInfo.componentStack}`
        };

        const token = AuthService.getToken();
        fetch('/api/RegistroErrores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(payload)
        }).catch(e => console.error("Fallo al enviar error al backend:", e));
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                    <h2 style={{ color: '#d32f2f' }}>Algo ha ido mal en la pantalla</h2>
                    <p>La aplicación ha encontrado un error inesperado al intentar mostrar esta página.</p>
                    <p>El error ha sido registrado automáticamente para nuestro equipo técnico.</p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        style={{ padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>
                        Volver a inicio
                    </button>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default GlobalErrorBoundary;
