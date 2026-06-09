import React from "react";
import CitacionesService from "../../../services/admin/CitacionesService";
import TablaCitaciones from "./TablaCitaciones";

const ConcederCitacion = () => {
    return (
        <TablaCitaciones 
            modo="concesion"
            titulo="GESTIÓN CONCESIÓN DE CITACIÓN"
            createStore={CitacionesService.createRecibidasStore}
            mutuaColumnField="MutuaSolicitante"
            mutuaColumnCaption="Mutua Solicitante"
            hasNuevaSolicitud={false}
            hasBatchActions={true}
            hasRowActions={true}
        />
    );
};

export default ConcederCitacion;