import React from "react";
import CitacionesService from "../../../services/admin/CitacionesService";
import TablaCitaciones from "./TablaCitaciones";

const SolicitarCitacion = () => {
    return (
        <TablaCitaciones 
            modo="solicitud"
            titulo="GESTIÓN SOLICITUD DE CITACIÓN"
            createStore={CitacionesService.createSolicitadasStore}
            mutuaColumnField="MutuaOfertante"
            mutuaColumnCaption="Mutua Ofertante"
            hasNuevaSolicitud={true}
            hasBatchActions={false}
            hasRowActions={false}
        />
    );
};

export default SolicitarCitacion;