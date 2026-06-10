import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { AppProvider } from "./providers/AppProvider"

import 'bootstrap-css-only/css/bootstrap.css'
import 'devextreme/dist/css/dx.material.teal.light.compact.css'
import './index.css'

import.meta.glob(["./styles/**/*.css"], { eager: true });
import { locale, loadMessages } from 'devextreme/localization';
import esMessages from 'devextreme/localization/messages/es.json';

loadMessages(esMessages);
locale('es');


import AuthService from './services/auth/AuthService';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';

// Capturar errores no manejados fuera del ciclo de vida de React
const logGlobalError = (mensaje, stack) => {
    const userIdRaw = AuthService.getUserId();
    const usuarioId = userIdRaw ? parseInt(userIdRaw, 10) : null;
    const token = AuthService.getToken();
    
    fetch('/api/RegistroErrores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
            descripcion: "Error global no manejado (Window)",
            modulo: "React Global Exception Handler",
            usuarioId: usuarioId,
            detalleError: `${mensaje}\n\nStack:\n${stack}`
        })
    }).catch(e => console.error("Fallo al enviar error asíncrono", e));
};

window.addEventListener('error', (event) => {
    logGlobalError(event.message, event.error?.stack || 'No stack disponible');
});

window.addEventListener('unhandledrejection', (event) => {
    logGlobalError(event.reason?.message || 'Rechazo de promesa', event.reason?.stack || JSON.stringify(event.reason));
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GlobalErrorBoundary>
            <BrowserRouter>
                <Suspense fallback={<div>Cargando...</div>}>
                    <AppRoutes />
                </Suspense>
            </BrowserRouter>
        </GlobalErrorBoundary>
    </StrictMode>,
)