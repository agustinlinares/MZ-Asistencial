import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MapaUbicador } from '../../../components/MapaUbicador'; 
import AuthService from "../../../services/auth/AuthService";
import notify from 'devextreme/ui/notify';

const authHeaders = () => {
    const token = AuthService.getToken();
    return { 
        'Authorization': token ? `Bearer ${token}` : '', 
        'Content-Type': 'application/json' 
    };
};

const FichaMapaCentro = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const location = useLocation();
    const { datosFila, apiEndpoint, tituloFicha } = location.state || {}; 

    const tituloAMostrar = tituloFicha || 'Editar Ubicación';

    const [form, setForm] = useState({ latitud: '', longitud: '', direccion: '' });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (datosFila && apiEndpoint) {
            setForm({
                ...datosFila, 
                latitud: datosFila.latitud || '',
                longitud: datosFila.longitud || '',
                direccion: datosFila.direccion || ''
            });
            setCargando(false);
        } else {
            notify('Error: Faltan datos de inicialización. Vuelve a la tabla.', 'error', 4000);
            setCargando(false);
        }
    }, [datosFila, apiEndpoint]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const payload = { 
                ...form, 
                centro_id: parseInt(id),
                Centro_id: parseInt(id), 
                mapaValidado: !!(form.latitud && form.longitud) 
            };

            const response = await fetch(apiEndpoint, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                notify('Ubicación guardada correctamente', 'success', 3000);
                navigate(-1);
            } else {
                const errorText = await response.text();
                console.error("Rechazado por el servidor:", errorText);
                notify('Error al guardar. Revisa la consola.', 'error', 4000);
            }
        } catch (error) {
            console.error("Error guardando:", error);
        }
    };

    if (cargando) return <div>Cargando mapa...</div>;

    return (
        <div className="ficha-global">
            <div className="ficha-header-btns" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span className="ficha-modal-title">
                    {tituloAMostrar}
                </span>
                
                <div>
                    <button className="ficha-btn-primary" onClick={handleSave}>Aceptar</button>
                    <button className="ficha-btn-secondary" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>Salir</button>
                </div>
            </div>

            <div className="tab-content">
                <MapaUbicador form={form} onChange={handleChange} />
            </div>
        </div>
    );
};

export default FichaMapaCentro;