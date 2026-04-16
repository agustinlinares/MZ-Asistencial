import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import './Acuerdos.css';

const Acuerdos = () => {
    const { t } = useTranslation();

    const [mutuas, setMutuas] = useState([]);
    const [años, setAños] = useState([]);

    useEffect(() => {
        fetch('https://localhost:7132/api/Mutuas')
            .then(res => res.json())
            .then(data => setMutuas(data))
            .catch(err => console.error('Error al cargar mutuas:', err));

        fetch('https://localhost:7132/api/InformesAcuerdos')
            .then(res => res.json())
            .then(data => {
                const añosUnicos = [...new Set(data.map(i => i.año))]
                    .filter(Boolean)
                    .sort((a, b) => b - a);
                setAños(añosUnicos);
            })
            .catch(err => console.error('Error al cargar años:', err));
    }, []);

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">
                    <div className="title">{t('Acuerdos')}</div>
                    <div className="filtros-title">
                        {t('Filtros')}
                    </div>
                    <div className="filtros-content">
                        {/* FILTRO MUTUA */}
                        <div className="filtro-item">
                            <label>Mutua</label>
                            <select className="filtro-select">
                                <option value="">-- Selecciona una mutua --</option>
                                {mutuas.map(m => (
                                    <option key={m.mutuaId} value={m.mutuaId}>
                                        {m.numeroMutua} - {m.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* FILTRO AÑO */}
                        <div className="filtro-item">
                            <label>Año</label>
                            <select className="filtro-select">
                                <option value="">-- Selecciona un año --</option>
                                {años.map(año => (
                                    <option key={año} value={año}>
                                        {año}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Acuerdos;