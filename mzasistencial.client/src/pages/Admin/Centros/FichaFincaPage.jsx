import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FichaFinca from "./FichaFinca";
import AuthService from "../../../services/auth/AuthService";

const authHeaders = () => {
    const token = AuthService.getToken();
    return { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
};

const FichaFincaPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isNew = id === 'nueva';

    const [finca] = useState(() => isNew ? {} : (location.state?.finca ?? null));
    const [centros, setCentros] = useState([]);

    useEffect(() => {
        if (!isNew && !location.state?.finca) {
            navigate('/admin/Centros/Fincas', { replace: true });
            return;
        }
        const fetchCentros = async () => {
            try {
                const res = await fetch('/api/centros/lookup', { headers: authHeaders() });
                if (res.ok) setCentros(await res.json());
            } catch (e) { console.error(e); }
        };
        fetchCentros();
    }, []);

    const handleSave = async (data) => {
        try {
            const isEdit = !!data.finca_id;
            const url = isEdit ? `/api/FincasRegistrales/${data.finca_id}` : '/api/FincasRegistrales';
            const method = isEdit ? 'PUT' : 'POST';
            const payload = {
                Finca_id: parseInt(data.finca_id) || 0,
                Centro_id: parseInt(data.centro_id) || 0,
                Mutua: data.mutua || null,
                Direccion: data.direccion || null,
                Superficie: data.superficie !== '' && data.superficie != null ? parseFloat(data.superficie) : null,
                Coste: data.coste !== '' && data.coste != null ? parseFloat(data.coste) : null,
                F_Alquiler: data.f_adquisicion || null,
                Referencia_Catastral: data.ref_catastral || null,
                F_Inscripcion: data.f_inscripcion || null,
                F_Baja: data.f_baja || null,
                TipoFinca: data.tipo_finca_idx != null ? parseInt(data.tipo_finca_idx) : null,
                Titularidad: data.titularidad || null,
                OtrosDatos: data.otros_datos || null,
                Utilizacion: data.utilizacion || null,
                DireccionGoogle: data.dir_google || null,
            };
            const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
            if (res.ok) {
                navigate('/admin/Centros/Fincas');
            } else {
                alert(`Error al guardar: ${res.status} ${res.statusText}`);
            }
        } catch (error) {
            console.error('Error al guardar finca:', error);
            alert(`Error: ${error.message}`);
        }
    };

    if (!finca) return null;

    return (
        <FichaFinca
            finca={finca}
            centros={centros}
            onClose={() => navigate('/admin/Centros/Fincas')}
            onSave={handleSave}
        />
    );
};

export default FichaFincaPage;
