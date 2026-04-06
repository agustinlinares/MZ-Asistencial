import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Proveedores.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    FilterRow,
    HeaderFilter,
    Selection,
    GroupPanel,
    Grouping,
    ColumnChooser,
    Export,
    Scrolling,
    Sorting,
    FilterPanel,
    ColumnFixing,
    Pager,
    Toolbar,
    Item,
    Lookup
} from "devextreme-react/data-grid";

import { useTranslation } from "react-i18next";

// ─── LOOKUP DATA ─────────────────────────────────────────────────────────────
const services = ["Vivienda", "Empleo", "Salud Mental", "Formación", "Jurídico", "Becas"];
const genders = ["Hombre", "Mujer", "No binario", "Prefiere no indicar"];
const nationalities = ["Española", "Marroquí", "Rumana", "Colombiana", "Venezolana", "Senegalesa", "Otra"];
const functionalDiversity = ["Ninguna", "Física", "Intelectual", "Sensorial", "Psíquica", "Múltiple"];
const studyLevels = ["Sin estudios", "Primaria", "ESO", "Bachillerato", "FP Básica", "FP Media", "FP Superior", "Universidad"];
const courses = ["1º ESO", "2º ESO", "3º ESO", "4º ESO", "1º Bach", "2º Bach", "1º FP", "2º FP", "Universidad"];
const titulations = ["Sin titulación", "Graduado ESO", "Bachiller", "FP", "Grado Universitario", "Máster"];
const laborSituation = ["Desempleado", "Empleado", "Estudiante", "En prácticas", "Autónomo", "Inactivo"];
const incomeOrigin = ["Sin ingresos", "Trabajo", "Prestación", "Pensión", "RGI/IMV", "Familia", "Otros"];
const riskLevels = ["Alto", "Medio", "Bajo"];
const statusList = ["Urgente", "En revisión", "Resuelto"];
// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const sampleData = [
    {
        CodigoPersona: "P-0041", Servicio: "Vivienda", Nombre: "Laura", Apellido: "Martínez",
        Apellido2: "Sánchez", FechaNacimiento: new Date("2002-04-12"), DNI: "12345678A",
        Género: "Mujer", Nacionalidad: "Española", OrigenNacional: "Madrid",
        DiversidadFuncional: "Ninguna", Telefono1: 612345678, Telefono2: null,
        CorreoElectronico: "laura.m@email.com", NivelEstudios: "ESO",
        Colegio: "IES Cervantes", Curso: "4º ESO", ConExpedienteEnEPI: true,
        TitulacionAlcanzada: "Sin titulación", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Riesgo alto de abandono escolar.", Riesgo: "Alto", Estado: "Urgente",
    },
    {
        CodigoPersona: "P-0038", Servicio: "Empleo", Nombre: "Carlos", Apellido: "Díaz",
        Apellido2: "López", FechaNacimiento: new Date("2005-09-23"), DNI: "87654321B",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Marruecos",
        DiversidadFuncional: "Ninguna", Telefono1: 698765432, Telefono2: 912345678,
        CorreoElectronico: "carlos.d@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Lope de Vega", Curso: "2º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Desempleado",
        ProcedenciaDeIngresos: "RGI/IMV", ConExpedienteEnCSM: false,
        Observaciones: "", Riesgo: "Medio", Estado: "En revisión",
    },
    {
        CodigoPersona: "P-0035", Servicio: "Formación", Nombre: "Amira", Apellido: "Khalil",
        Apellido2: "", FechaNacimiento: new Date("2000-11-05"), DNI: "11223344C",
        Género: "Mujer", Nacionalidad: "Senegalesa", OrigenNacional: "Dakar",
        DiversidadFuncional: "Ninguna", Telefono1: 654321987, Telefono2: null,
        CorreoElectronico: "amira.k@email.com", NivelEstudios: "FP Media",
        Colegio: "", Curso: "2º FP", ConExpedienteEnEPI: true,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "En prácticas",
        ProcedenciaDeIngresos: "Trabajo", ConExpedienteEnCSM: false,
        Observaciones: "Proceso de inserción laboral activo.", Riesgo: "Bajo", Estado: "Resuelto",
    },
    {
        CodigoPersona: "P-0030", Servicio: "Salud Mental", Nombre: "Javier", Apellido: "Ruiz",
        Apellido2: "García", FechaNacimiento: new Date("2003-07-18"), DNI: "99887766D",
        Género: "Hombre", Nacionalidad: "Española", OrigenNacional: "Barcelona",
        DiversidadFuncional: "Psíquica", Telefono1: 677889900, Telefono2: null,
        CorreoElectronico: "", NivelEstudios: "ESO", Colegio: "IES Picasso",
        Curso: "3º ESO", ConExpedienteEnEPI: true, TitulacionAlcanzada: "Sin titulación",
        SituacionLaboral: "Desempleado", ProcedenciaDeIngresos: "Prestación",
        ConExpedienteEnCSM: true, Observaciones: "Sin contacto 48h. Requiere visita urgente.",
        Riesgo: "Alto", Estado: "Urgente",
    },
    {
        CodigoPersona: "P-0028", Servicio: "Jurídico", Nombre: "Sofía", Apellido: "Torres",
        Apellido2: "Vega", FechaNacimiento: new Date("2001-02-28"), DNI: "44556677E",
        Género: "Mujer", Nacionalidad: "Colombiana", OrigenNacional: "Bogotá",
        DiversidadFuncional: "Ninguna", Telefono1: 611223344, Telefono2: 933221100,
        CorreoElectronico: "sofia.t@email.com", NivelEstudios: "Universidad",
        Colegio: "UAM", Curso: "Universidad", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Grado Universitario", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Pendiente resolución expediente.", Riesgo: "Medio", Estado: "En revisión",
    },
    {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    },
    {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    }, {
        CodigoPersona: "P-0025", Servicio: "Becas", Nombre: "Ahmed", Apellido: "Benali",
        Apellido2: "", FechaNacimiento: new Date("2004-06-14"), DNI: "55443322F",
        Género: "Hombre", Nacionalidad: "Marroquí", OrigenNacional: "Casablanca",
        DiversidadFuncional: "Física", Telefono1: 622334455, Telefono2: null,
        CorreoElectronico: "ahmed.b@email.com", NivelEstudios: "Bachillerato",
        Colegio: "IES Europa", Curso: "1º Bach", ConExpedienteEnEPI: false,
        TitulacionAlcanzada: "Graduado ESO", SituacionLaboral: "Estudiante",
        ProcedenciaDeIngresos: "Familia", ConExpedienteEnCSM: false,
        Observaciones: "Beca solicitada pendiente de validación.", Riesgo: "Bajo", Estado: "En revisión",
    },
];

const onExporting = (e) => {
    e.component.beginUpdate();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'estaciones.xlsx');
        });
    })
    e.cancel = true;
};

const Delegaciones = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);

    // const { isAuthenticated } = UseProtectedRoute();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         console.error('No está registradoel usuario');
    //         // navigate('/'); 
    //     }
    // }, [isAuthenticated, navigate]); 

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="header-page">
                        <div className="title">
                            {t('Lista de delegaciones')}
                        </div>

                        <div className="acciones-container">
                            <div className="acciones-btn">
                                {t('Acciones')}
                                <i className="ri-more-2-fill"></i>
                            </div>

                            <div className="acciones-menu">
                                <div className="acciones-item">
                                    <i className="ri-add-line"></i>
                                    Nuevo
                                </div>
                                <div className="acciones-item">
                                    <i className="ri-file-excel-2-line"></i>
                                    Exportar Excel
                                </div>
                                <div className="acciones-item">
                                    <i className="ri-file-pdf-line"></i>
                                    Exportar PDF
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={sampleData}
                            keyExpr="CodigoPersona"
                            showBorders={true}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            onExporting={onExporting}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={25} />
                            <Pager visible={true} allowedPageSizes={true} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            <SearchPanel visible width={240} placeholder={t('buscar')} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible searchMode='contains' />
                            <Selection mode="multiple" allowSelectAll />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled mode="select" />
                            <Export enabled fileName="Casos" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <FilterPanel visible />
                            <ColumnFixing enabled />



                            {/* ── COLUMNAS ─────────────────────────────────────────────────── */}

                            <Column
                                dataField="CodigoPersona"
                                caption="Código Persona"
                                fixed={true}
                                fixedPosition="left"
                                width={130}
                            />

                            <Column
                                dataField="Nombre"
                                fixed={true}
                                fixedPosition="left"
                                width={110}
                            />

                            <Column dataField="Apellido" width={120} />
                            <Column dataField="Apellido2" caption="Apellido 2" width={120} />

                            <Column dataField="Riesgo" width={100}>
                                <Lookup dataSource={riskLevels} />
                            </Column>

                            <Column dataField="Estado" width={120}>
                                <Lookup dataSource={statusList} />
                            </Column>

                            <Column dataField="Servicio" width={130}>
                                <Lookup dataSource={services} />
                            </Column>

                            <Column
                                dataField="FechaNacimiento"
                                caption="Fecha Nacimiento"
                                dataType="date"
                                width={150}
                            />

                            <Column dataField="DNI" width={110} />

                            <Column dataField="Género" width={120}>
                                <Lookup dataSource={genders} />
                            </Column>

                            <Column dataField="Nacionalidad" width={130}>
                                <Lookup dataSource={nationalities} />
                            </Column>

                            <Column dataField="OrigenNacional" caption="Origen nacional" width={140} />

                            <Column dataField="DiversidadFuncional" caption="Div. Funcional" width={140}>
                                <Lookup dataSource={functionalDiversity} />
                            </Column>

                            <Column dataField="Telefono1" caption="Teléfono 1" dataType="number" width={130} />
                            <Column dataField="Telefono2" caption="Teléfono 2" dataType="number" width={130} />
                            <Column dataField="CorreoElectronico" caption="Correo electrónico" width={210} />

                            <Column dataField="NivelEstudios" caption="Nivel Estudios" width={140}>
                                <Lookup dataSource={studyLevels} />
                            </Column>

                            <Column dataField="Colegio" caption="Centro" width={160} />

                            <Column dataField="Curso" width={110}>
                                <Lookup dataSource={courses} />
                            </Column>

                            <Column
                                dataField="ConExpedienteEnEPI"
                                caption="Con expediente en EPI"
                                dataType="boolean"
                                width={170}
                            />

                            <Column dataField="TitulacionAlcanzada" caption="Titulación alcanzada" width={170}>
                                <Lookup dataSource={titulations} />
                            </Column>

                            <Column dataField="SituacionLaboral" caption="Situación laboral" width={150}>
                                <Lookup dataSource={laborSituation} />
                            </Column>

                            <Column dataField="ProcedenciaDeIngresos" caption="Procedencia de ingresos" width={190}>
                                <Lookup dataSource={incomeOrigin} />
                            </Column>

                            <Column
                                dataField="ConExpedienteEnCSM"
                                caption="Con expediente en CSM"
                                dataType="boolean"
                                width={175}
                            />

                            <Column dataField="Observaciones" width={250} />
                        </DataGrid>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Delegaciones;