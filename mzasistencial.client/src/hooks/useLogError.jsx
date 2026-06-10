import { useCallback } from 'react';
import AuthService from '../services/auth/AuthService';

export const useLogError = (moduloPorDefecto = 'React Frontend') => {
    
    const logError = useCallback(async (contextoDelError, errorOriginal, moduloSobreescrito) => {
        
        const userIdRaw = AuthService.getUserId();
        const usuarioId = userIdRaw ? parseInt(userIdRaw, 10) : null;
        
        const moduloFinal = moduloSobreescrito || moduloPorDefecto;

        let detalleError = '';
        let stackTrace = '';

        if (errorOriginal) {
            if (errorOriginal instanceof Error) {
                detalleError = errorOriginal.message;
                stackTrace = errorOriginal.stack;
            } else {
                detalleError = typeof errorOriginal === 'string' ? errorOriginal : JSON.stringify(errorOriginal);
                stackTrace = "No hay stack trace disponible";
            }
        }

        const payload = {
            descripcion: contextoDelError,
            Nombre_Modulo: moduloFinal, 
            usuarioId: usuarioId,
            detalleError: detalleError,
            comentarios: stackTrace
        };

        try {
            const token = AuthService.getToken();
            await fetch('/api/RegistroErrores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.error('Fallo al guardar log', e);
        }
    }, [moduloPorDefecto]); 

    return logError;
};

export default useLogError;