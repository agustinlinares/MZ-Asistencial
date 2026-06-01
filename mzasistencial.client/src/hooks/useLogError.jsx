import { useCallback } from 'react';
import AuthService from '../services/auth/AuthService';

export const useLogError = (moduloPorDefecto = 'React Frontend') => {
    
    const logError = useCallback(async (contextoDelError, errorOriginal, moduloSobreescrito) => {
        
        const userIdRaw = AuthService.getUserId();
        const usuarioId = userIdRaw ? parseInt(userIdRaw, 10) : null;
        
        const moduloFinal = moduloSobreescrito || moduloPorDefecto;

        let detalleError = '';
        if (errorOriginal) {
            detalleError = errorOriginal instanceof Error 
                ? errorOriginal.message 
                : typeof errorOriginal === 'string' 
                    ? errorOriginal 
                    : JSON.stringify(errorOriginal);
        }

        const payload = {
            descripcion: contextoDelError,
            modulo: moduloFinal, 
            usuarioId: usuarioId,
            detalleError: detalleError
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