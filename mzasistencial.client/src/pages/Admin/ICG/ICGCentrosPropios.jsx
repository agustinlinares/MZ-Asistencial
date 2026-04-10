import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './ICG.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FichaCliente from './FichaCliente'; // ajusta la ruta según donde esté el archivo

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

const ICGCentrosPropios = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [selectedCliente, setSelectedCliente] = useState(null); // fila seleccionada

    // const { isAuthenticated } = UseProtectedRoute();
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                </div>
            </div>
        </React.Fragment>
    );
};

export default ICGCentrosPropios;