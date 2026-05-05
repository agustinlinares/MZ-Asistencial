import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FichaFinca from "./FichaFinca";
import FincasService from "../../../services/admin/FincasService";

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
                setCentros(await FincasService.getCentrosLookup());
            } catch (e) { console.error(e); }
        };
        fetchCentros();
    }, []);

    const handleSave = async (data) => {
        try {
            await FincasService.save(data);
            navigate('/admin/Centros/Fincas');
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
