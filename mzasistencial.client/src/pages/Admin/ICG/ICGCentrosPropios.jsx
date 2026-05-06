import React, { useEffect, useRef, useState } from "react";
import './ICG.css';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataGrid, {
    Column, Paging, SearchPanel, FilterRow, HeaderFilter,
    Selection, GroupPanel, Grouping, ColumnChooser, Export, Toolbar, Item,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import SelectBox from "devextreme-react/select-box";

const API_CENTROS = "/api/CentrosPropios";
const YEAR_NOW    = new Date().getFullYear();
const YEARS       = Array.from({ length: 10 }, (_, i) => YEAR_NOW - i);

// ─── Helper: campos de plantilla por grupo de personal ───────────────────────
const cp = (prefijo, label) => [
    { key: `${prefijo}NumPers`,          label: `${label} · Nº personas` },
    { key: `${prefijo}GastPers`,         label: `${label} · Gasto personal` },
    { key: `${prefijo}HorasCp`,          label: `${label} · Horas ASCP` },
    { key: `${prefijo}HorasCc`,          label: `${label} · Horas ASCC` },
    { key: `${prefijo}HorasIt`,          label: `${label} · Horas IT` },
    { key: `${prefijo}HorasAtep`,        label: `${label} · Horas AT/EP` },
    { key: `${prefijo}HorasAgm`,         label: `${label} · Horas AGM` },
    { key: `${prefijo}NumPersSustInt`,   label: `${label} · Nº personas sustitución` },
    { key: `${prefijo}GastPersSustInt`,  label: `${label} · Gasto sustitución` },
    { key: `${prefijo}HorasPersSustInt`, label: `${label} · Horas sustitución` },
];

// ─── Campos de pestañas asistenciales ────────────────────────────────────────
const camposHos = [
    { key: "pitrmutHos",                          label: "PI trmut HOS" },
    { key: "esttrmutHos",                         label: "Estancias trmut HOS" },
    { key: "primConsHosProg",                     label: "1ª Consulta HOS (Prog.)" },
    { key: "primConsHosProgVideo",                label: "1ª Consulta HOS (Prog. Vídeo)" },
    { key: "primConsHosNoProg",                   label: "1ª Consulta HOS (No Prog.)" },
    { key: "primConsHosNoProgVideo",              label: "1ª Consulta HOS (No Prog. Vídeo)" },
    { key: "conssucHos",                          label: "Cons. sucesivas HOS" },
    { key: "conssucHosVideo",                     label: "Cons. sucesivas HOS (Vídeo)" },
    { key: "consEnfHos",                          label: "Cons. enfermería HOS" },
    { key: "sesrehabtrmutHos",                    label: "Sesiones rehabilitación trmut HOS" },
    { key: "pradtrmutHosRm",                      label: "Pruebas diagnósticas trmut HOS (RM)" },
    { key: "pradtrmutHosEco",                     label: "Pruebas diagnósticas trmut HOS (Eco)" },
    { key: "pradtrmutHosTac",                     label: "Pruebas diagnósticas trmut HOS (TAC)" },
    { key: "pradtrmutHosRadio",                   label: "Pruebas diagnósticas trmut HOS (Radio)" },
    { key: "iquirtrmutHos",                       label: "Intervenciones quirúrgicas trmut HOS" },
    { key: "oppracttrmutHos",                     label: "Otras prácticas trmut HOS" },
    { key: "paurnointrmutHos",                    label: "PA urgencias no ingreso trmut HOS" },
    { key: "pruBiomHos",                          label: "Pruebas biomecánicas HOS" },
    { key: "pitrmutArt82Hos",                     label: "PI trmut Art.82 HOS" },
    { key: "esttrmutArt82Hos",                    label: "Estancias trmut Art.82 HOS" },
    { key: "primConsArt82HosProg",                label: "1ª Consulta Art.82 HOS (Prog.)" },
    { key: "primConsArt82HosProgVideo",           label: "1ª Consulta Art.82 HOS (Prog. Vídeo)" },
    { key: "primConsArt82HosNoProg",              label: "1ª Consulta Art.82 HOS (No Prog.)" },
    { key: "primConsArt82HosNoProgVideo",         label: "1ª Consulta Art.82 HOS (No Prog. Vídeo)" },
    { key: "conssucArt82Hos",                     label: "Cons. sucesivas Art.82 HOS" },
    { key: "conssucArt82HosVideo",                label: "Cons. sucesivas Art.82 HOS (Vídeo)" },
    { key: "consEnfArt82Hos",                     label: "Cons. enfermería Art.82 HOS" },
    { key: "srehabtrmutArt82Hos",                 label: "Sesiones rehabilitación Art.82 HOS" },
    { key: "prmydtrmutArt82HosRm",                label: "Pruebas diagnósticas Art.82 HOS (RM)" },
    { key: "prmydtrmutArt82HosEco",               label: "Pruebas diagnósticas Art.82 HOS (Eco)" },
    { key: "prmydtrmutArt82HosTac",               label: "Pruebas diagnósticas Art.82 HOS (TAC)" },
    { key: "prmydtrmutArt82HosRadio",             label: "Pruebas diagnósticas Art.82 HOS (Radio)" },
    { key: "iquirtrmutArt82Hos",                  label: "Intervenciones quirúrgicas Art.82 HOS" },
    { key: "opptrmutArt82Hos",                    label: "Otras prácticas Art.82 HOS" },
    { key: "paurgNoIngrArt82Hos",                 label: "PA urgencias no ingreso Art.82 HOS" },
    { key: "prueBiomArt82Hos",                    label: "Pruebas biomecánicas Art.82 HOS" },
    { key: "piotrmutArt12Hos",                    label: "PI otros trmut Art.12 HOS" },
    { key: "estotrmutArt12Hos",                   label: "Estancias otros trmut Art.12 HOS" },
    { key: "primConsotrmutArt12HosProg",          label: "1ª Consulta otros trmut Art.12 HOS (Prog.)" },
    { key: "primConsotrmutArt12HosProgVideo",     label: "1ª Consulta otros trmut Art.12 HOS (Prog. Vídeo)" },
    { key: "primConsotrmutArt12HosNoProg",        label: "1ª Consulta otros trmut Art.12 HOS (No Prog.)" },
    { key: "primConsotrmutArt12HosNoProgVideo",   label: "1ª Consulta otros trmut Art.12 HOS (No Prog. Vídeo)" },
    { key: "conssucotrmutArt12Hos",               label: "Cons. sucesivas otros trmut Art.12 HOS" },
    { key: "conssucotrmutArt12HosVideo",          label: "Cons. sucesivas otros trmut Art.12 HOS (Vídeo)" },
    { key: "consEnfotrmutArt12Hos",               label: "Cons. enfermería otros trmut Art.12 HOS" },
    { key: "srehabotrmutArt12Hos",                label: "Sesiones rehabilitación otros trmut Art.12 HOS" },
    { key: "pradotrmutArt12HosRm",                label: "Pruebas diagnósticas otros trmut Art.12 HOS (RM)" },
    { key: "pradotrmutArt12HosEco",               label: "Pruebas diagnósticas otros trmut Art.12 HOS (Eco)" },
    { key: "pradotrmutArt12HosTac",               label: "Pruebas diagnósticas otros trmut Art.12 HOS (TAC)" },
    { key: "pradotrmutArt12HosRadio",             label: "Pruebas diagnósticas otros trmut Art.12 HOS (Radio)" },
    { key: "iquirotrmutArt12Hos",                 label: "Intervenciones quirúrgicas otros trmut Art.12 HOS" },
    { key: "oppotrmutArt12Hos",                   label: "Otras prácticas otros trmut Art.12 HOS" },
    { key: "paurniotrmutArt12Hos",                label: "PA urgencias no ingreso otros trmut Art.12 HOS" },
    { key: "pruBiomotrmutArt12Hos",               label: "Pruebas biomecánicas otros trmut Art.12 HOS" },
];

const camposAmb = [
    { key: "pacenArt82",                    label: "PA centro Art.82" },
    { key: "primConsArt82Prog",             label: "1ª Consulta Art.82 (Prog.)" },
    { key: "primConsArt82ProgVideo",        label: "1ª Consulta Art.82 (Prog. Vídeo)" },
    { key: "primConsArt82NoProg",           label: "1ª Consulta Art.82 (No Prog.)" },
    { key: "primConsArt82NoProgVideo",      label: "1ª Consulta Art.82 (No Prog. Vídeo)" },
    { key: "conssucArt82",                  label: "Cons. sucesivas Art.82" },
    { key: "conssucArt82Video",             label: "Cons. sucesivas Art.82 (Vídeo)" },
    { key: "sesrehabArt82",                 label: "Sesiones rehabilitación Art.82" },
    { key: "consEnfArt82",                  label: "Cons. enfermería Art.82" },
    { key: "pradArt82Rm",                   label: "Pruebas diagnósticas Art.82 (RM)" },
    { key: "pradArt82Eco",                  label: "Pruebas diagnósticas Art.82 (Eco)" },
    { key: "pradArt82Tac",                  label: "Pruebas diagnósticas Art.82 (TAC)" },
    { key: "pradArt82Radio",                label: "Pruebas diagnósticas Art.82 (Radio)" },
    { key: "iquircenArt82",                 label: "Intervenciones quirúrgicas Art.82" },
    { key: "oppractArt82",                  label: "Otras prácticas Art.82" },
    { key: "pruBiomArt82",                  label: "Pruebas biomecánicas Art.82" },
    { key: "paotmutArt12",                  label: "PA otros trmut Art.12" },
    { key: "primConsotmutArt12Prog",        label: "1ª Consulta otros trmut Art.12 (Prog.)" },
    { key: "primConsotmutArt12ProgVideo",   label: "1ª Consulta otros trmut Art.12 (Prog. Vídeo)" },
    { key: "primConotmutArt12NoProg",       label: "1ª Consulta otros trmut Art.12 (No Prog.)" },
    { key: "primConotmutArt12NoProgVideo",  label: "1ª Consulta otros trmut Art.12 (No Prog. Vídeo)" },
    { key: "conssucotmutArt12",             label: "Cons. sucesivas otros trmut Art.12" },
    { key: "conssucotmutArt12Video",        label: "Cons. sucesivas otros trmut Art.12 (Vídeo)" },
    { key: "sesrehabotmutArt12",            label: "Sesiones rehabilitación otros trmut Art.12" },
    { key: "consEnfotmutArt12",             label: "Cons. enfermería otros trmut Art.12" },
    { key: "pradotmutArt12Rm",              label: "Pruebas diagnósticas otros trmut Art.12 (RM)" },
    { key: "pradotmutArt12Eco",             label: "Pruebas diagnósticas otros trmut Art.12 (Eco)" },
    { key: "pradotmutArt12Tac",             label: "Pruebas diagnósticas otros trmut Art.12 (TAC)" },
    { key: "pradotmutArt12Radio",           label: "Pruebas diagnósticas otros trmut Art.12 (Radio)" },
    { key: "iquirotmutArt12",               label: "Intervenciones quirúrgicas otros trmut Art.12" },
    { key: "oppractotmutArt12",             label: "Otras prácticas otros trmut Art.12" },
    { key: "pruBiomotmutArt12",             label: "Pruebas biomecánicas otros trmut Art.12" },
    { key: "paotrosArt12",                  label: "PA otros Art.12" },
    { key: "primConotrosArt12Prog",         label: "1ª Consulta otros Art.12 (Prog.)" },
    { key: "primConotrosArt12ProgVideo",    label: "1ª Consulta otros Art.12 (Prog. Vídeo)" },
    { key: "primConotrosArt12NoProg",       label: "1ª Consulta otros Art.12 (No Prog.)" },
    { key: "primConotrosArt12NoProgVideo",  label: "1ª Consulta otros Art.12 (No Prog. Vídeo)" },
    { key: "conssucotrosArt12",             label: "Cons. sucesivas otros Art.12" },
    { key: "conssucotrosArt12Video",        label: "Cons. sucesivas otros Art.12 (Vídeo)" },
    { key: "sesrehabotrosArt12",            label: "Sesiones rehabilitación otros Art.12" },
    { key: "consEnfotrosArt12",             label: "Cons. enfermería otros Art.12" },
    { key: "pradotrosArt12Rm",              label: "Pruebas diagnósticas otros Art.12 (RM)" },
    { key: "pradotrosArt12Eco",             label: "Pruebas diagnósticas otros Art.12 (Eco)" },
    { key: "pradotrosArt12Tac",             label: "Pruebas diagnósticas otros Art.12 (TAC)" },
    { key: "pradotrosArt12Radio",           label: "Pruebas diagnósticas otros Art.12 (Radio)" },
    { key: "iquirotrosArt12",               label: "Intervenciones quirúrgicas otros Art.12" },
    { key: "oppractotrosArt12",             label: "Otras prácticas otros Art.12" },
    { key: "pruBiomotrosArt12",             label: "Pruebas biomecánicas otros Art.12" },
];

const camposConvHos = [
    { key: "pitrmutConvSecBilMultHos",                   label: "PI trmut Conv. Sec. Bil. Mult. HOS" },
    { key: "esttrmutConvSecBilMultHos",                  label: "Estancias trmut Conv. Sec. Bil. Mult. HOS" },
    { key: "primConsConvSecBilMultHosProg",              label: "1ª Consulta Conv. (Prog.)" },
    { key: "primConsConvSecBilMultHosProgVideo",         label: "1ª Consulta Conv. (Prog. Vídeo)" },
    { key: "primConsConvSecBilMultHosNoProg",            label: "1ª Consulta Conv. (No Prog.)" },
    { key: "primConsConvSecBilMultHosNoProgVideo",       label: "1ª Consulta Conv. (No Prog. Vídeo)" },
    { key: "conssucConvSecBilMultHos",                   label: "Cons. sucesivas Conv. HOS" },
    { key: "conssucConvSecBilMultHosVideo",              label: "Cons. sucesivas Conv. HOS (Vídeo)" },
    { key: "consEnfConvSecBilMultHos",                   label: "Cons. enfermería Conv. HOS" },
    { key: "srehabtrmutConvSecBilMultHos",               label: "Sesiones rehabilitación Conv. HOS" },
    { key: "prmydtrmutConvSecBilMultHosRm",              label: "Pruebas diagnósticas Conv. HOS (RM)" },
    { key: "prmydtrmutConvSecBilMultHosEco",             label: "Pruebas diagnósticas Conv. HOS (Eco)" },
    { key: "prmydtrmutConvSecBilMultHosTac",             label: "Pruebas diagnósticas Conv. HOS (TAC)" },
    { key: "prmydtrmutConvSecBilMultHosRadio",           label: "Pruebas diagnósticas Conv. HOS (Radio)" },
    { key: "iquirtrmutConvSecBilMultHos",                label: "Intervenciones quirúrgicas Conv. HOS" },
    { key: "opptrmutConvSecBilMultHos",                  label: "Otras prácticas Conv. HOS" },
    { key: "paurgNoIngrConvSecBilMultHos",               label: "PA urgencias no ingreso Conv. HOS" },
    { key: "prueBiomConvSecBilMultHos",                  label: "Pruebas biomecánicas Conv. HOS" },
];

const camposConvAmb = [
    { key: "pacenConvSectBilMult",                  label: "PA centro Conv. Sect." },
    { key: "primConsConvSectBilMultProg",            label: "1ª Consulta Conv. Sect. (Prog.)" },
    { key: "primConsConvSectBilMultProgVideo",       label: "1ª Consulta Conv. Sect. (Prog. Vídeo)" },
    { key: "primConsConvSectBilMultNoProg",          label: "1ª Consulta Conv. Sect. (No Prog.)" },
    { key: "primConsConvSectBilMultNoProgVideo",     label: "1ª Consulta Conv. Sect. (No Prog. Vídeo)" },
    { key: "conssucConvSectBilMult",                 label: "Cons. sucesivas Conv. Sect." },
    { key: "conssucConvSectBilMultVideo",            label: "Cons. sucesivas Conv. Sect. (Vídeo)" },
    { key: "sesrehabConvSectBilMult",                label: "Sesiones rehabilitación Conv. Sect." },
    { key: "consEnfConvSectBilMult",                 label: "Cons. enfermería Conv. Sect." },
    { key: "pradConvSectBilMultRm",                  label: "Pruebas diagnósticas Conv. Sect. (RM)" },
    { key: "pradConvSectBilMultEco",                 label: "Pruebas diagnósticas Conv. Sect. (Eco)" },
    { key: "pradConvSectBilMultTac",                 label: "Pruebas diagnósticas Conv. Sect. (TAC)" },
    { key: "pradConvSectBilMultRadio",               label: "Pruebas diagnósticas Conv. Sect. (Radio)" },
    { key: "iquircenConvSectBilMult",                label: "Intervenciones quirúrgicas Conv. Sect." },
    { key: "oppractConvSectBilMult",                 label: "Otras prácticas Conv. Sect." },
    { key: "pruBiomConvSectBilMult",                 label: "Pruebas biomecánicas Conv. Sect." },
];

const camposItHos = [
    { key: "pitrmutHos",             label: "PI trmut HOS" },
    { key: "esttrmutHos",            label: "Estancias trmut HOS" },
    { key: "primConsHosProg",        label: "1ª Consulta HOS (Prog.)" },
    { key: "primConsHosProgVideo",   label: "1ª Consulta HOS (Prog. Vídeo)" },
    { key: "primConsHosNoProg",      label: "1ª Consulta HOS (No Prog.)" },
    { key: "primConsHosNoProgVideo", label: "1ª Consulta HOS (No Prog. Vídeo)" },
    { key: "conssucHos",             label: "Cons. sucesivas HOS" },
    { key: "conssucHosVideo",        label: "Cons. sucesivas HOS (Vídeo)" },
    { key: "consEnfHos",             label: "Cons. enfermería HOS" },
    { key: "sesrehabtrmutHos",       label: "Sesiones rehabilitación HOS" },
    { key: "pradtrmutHosRm",         label: "Pruebas diagnósticas HOS (RM)" },
    { key: "pradtrmutHosEco",        label: "Pruebas diagnósticas HOS (Eco)" },
    { key: "pradtrmutHosTac",        label: "Pruebas diagnósticas HOS (TAC)" },
    { key: "pradtrmutHosRadio",      label: "Pruebas diagnósticas HOS (Radio)" },
    { key: "iquirtrmutHos",          label: "Intervenciones quirúrgicas HOS" },
    { key: "oppracttrmutHos",        label: "Otras prácticas HOS" },
    { key: "paurnointrmutHos",       label: "PA urgencias no ingreso HOS" },
    { key: "pruBiomHos",             label: "Pruebas biomecánicas HOS" },
];

const camposItAmb = [
    { key: "paotmutArt12",                 label: "PA otros trmut Art.12" },
    { key: "primConsotmutArt12Prog",       label: "1ª Consulta otros trmut Art.12 (Prog.)" },
    { key: "primConsotmutArt12ProgVideo",  label: "1ª Consulta otros trmut Art.12 (Prog. Vídeo)" },
    { key: "primConotmutArt12NoProg",      label: "1ª Consulta otros trmut Art.12 (No Prog.)" },
    { key: "primConotmutArt12NoProgVideo", label: "1ª Consulta otros trmut Art.12 (No Prog. Vídeo)" },
    { key: "conssucotmutArt12",            label: "Cons. sucesivas otros trmut Art.12" },
    { key: "conssucotmutArt12Video",       label: "Cons. sucesivas otros trmut Art.12 (Vídeo)" },
    { key: "sesrehabotmutArt12",           label: "Sesiones rehabilitación otros trmut Art.12" },
    { key: "consEnfotmutArt12",            label: "Cons. enfermería otros trmut Art.12" },
    { key: "pradotmutArt12Rm",             label: "Pruebas diagnósticas otros trmut Art.12 (RM)" },
    { key: "pradotmutArt12Eco",            label: "Pruebas diagnósticas otros trmut Art.12 (Eco)" },
    { key: "pradotmutArt12Tac",            label: "Pruebas diagnósticas otros trmut Art.12 (TAC)" },
    { key: "pradotmutArt12Radio",          label: "Pruebas diagnósticas otros trmut Art.12 (Radio)" },
    { key: "iquirotmutArt12",              label: "Intervenciones quirúrgicas otros trmut Art.12" },
    { key: "oppractotmutArt12",            label: "Otras prácticas otros trmut Art.12" },
    { key: "pruBiomotmutArt12",            label: "Pruebas biomecánicas otros trmut Art.12" },
];

const camposOtrasHos = [
    { key: "pitrmutArt82Hos",             label: "PI trmut Art.82 HOS" },
    { key: "esttrmutArt82Hos",            label: "Estancias trmut Art.82 HOS" },
    { key: "primConsArt82HosProg",        label: "1ª Consulta Art.82 HOS (Prog.)" },
    { key: "primConsArt82HosProgVideo",   label: "1ª Consulta Art.82 HOS (Prog. Vídeo)" },
    { key: "primConsArt82HosNoProg",      label: "1ª Consulta Art.82 HOS (No Prog.)" },
    { key: "primConsArt82HosNoProgVideo", label: "1ª Consulta Art.82 HOS (No Prog. Vídeo)" },
    { key: "conssucArt82Hos",             label: "Cons. sucesivas Art.82 HOS" },
    { key: "conssucArt82HosVideo",        label: "Cons. sucesivas Art.82 HOS (Vídeo)" },
    { key: "consEnfArt82Hos",             label: "Cons. enfermería Art.82 HOS" },
    { key: "srehabtrmutArt82Hos",         label: "Sesiones rehabilitación Art.82 HOS" },
    { key: "prmydtrmutArt82HosRm",        label: "Pruebas diagnósticas Art.82 HOS (RM)" },
    { key: "prmydtrmutArt82HosEco",       label: "Pruebas diagnósticas Art.82 HOS (Eco)" },
    { key: "prmydtrmutArt82HosTac",       label: "Pruebas diagnósticas Art.82 HOS (TAC)" },
    { key: "prmydtrmutArt82HosRadio",     label: "Pruebas diagnósticas Art.82 HOS (Radio)" },
    { key: "iquirtrmutArt82Hos",          label: "Intervenciones quirúrgicas Art.82 HOS" },
    { key: "opptrmutArt82Hos",            label: "Otras prácticas Art.82 HOS" },
    { key: "paurgNoIngrArt82Hos",         label: "PA urgencias no ingreso Art.82 HOS" },
    { key: "prueBiomArt82Hos",            label: "Pruebas biomecánicas Art.82 HOS" },
];

const camposOtrasAmb = [
    { key: "pacenArt82",               label: "PA centro Art.82" },
    { key: "primConsArt82Prog",        label: "1ª Consulta Art.82 (Prog.)" },
    { key: "primConsArt82ProgVideo",   label: "1ª Consulta Art.82 (Prog. Vídeo)" },
    { key: "primConsArt82NoProg",      label: "1ª Consulta Art.82 (No Prog.)" },
    { key: "primConsArt82NoProgVideo", label: "1ª Consulta Art.82 (No Prog. Vídeo)" },
    { key: "conssucArt82",             label: "Cons. sucesivas Art.82" },
    { key: "conssucArt82Video",        label: "Cons. sucesivas Art.82 (Vídeo)" },
    { key: "sesrehabArt82",            label: "Sesiones rehabilitación Art.82" },
    { key: "consEnfArt82",             label: "Cons. enfermería Art.82" },
    { key: "pradArt82Rm",              label: "Pruebas diagnósticas Art.82 (RM)" },
    { key: "pradArt82Eco",             label: "Pruebas diagnósticas Art.82 (Eco)" },
    { key: "pradArt82Tac",             label: "Pruebas diagnósticas Art.82 (TAC)" },
    { key: "pradArt82Radio",           label: "Pruebas diagnósticas Art.82 (Radio)" },
    { key: "iquircenArt82",            label: "Intervenciones quirúrgicas Art.82" },
    { key: "oppractArt82",             label: "Otras prácticas Art.82" },
    { key: "pruBiomArt82",             label: "Pruebas biomecánicas Art.82" },
];

const camposAsProHos = camposOtrasHos;

const camposAsPro = [
    { key: "actidesde",                    label: "Activo desde" },
    { key: "actihasta",                    label: "Activo hasta" },
    { key: "pacen25km",                    label: "PA centro ≤25km" },
    { key: "pacen50km",                    label: "PA centro ≤50km" },
    { key: "pacen50km1",                   label: "PA centro >50km" },
    { key: "primConsProg25km",             label: "1ª Consulta Prog. ≤25km" },
    { key: "primConsProg50km",             label: "1ª Consulta Prog. ≤50km" },
    { key: "primConsProg50km1",            label: "1ª Consulta Prog. >50km" },
    { key: "primConsProgVideo25km",        label: "1ª Consulta Prog. Vídeo ≤25km" },
    { key: "primConsProgVideo50km",        label: "1ª Consulta Prog. Vídeo ≤50km" },
    { key: "primConsProgVideo50km1",       label: "1ª Consulta Prog. Vídeo >50km" },
    { key: "primConsNoProg25km",           label: "1ª Consulta No Prog. ≤25km" },
    { key: "primConsNoProg50km",           label: "1ª Consulta No Prog. ≤50km" },
    { key: "primConsNoProg50km1",          label: "1ª Consulta No Prog. >50km" },
    { key: "primConsNoProgVideo25km",      label: "1ª Consulta No Prog. Vídeo ≤25km" },
    { key: "primConsNoProgVideo50km",      label: "1ª Consulta No Prog. Vídeo ≤50km" },
    { key: "primConsNoProgVideo50km1",     label: "1ª Consulta No Prog. Vídeo >50km" },
    { key: "conssuc25km",                  label: "Cons. sucesivas ≤25km" },
    { key: "conssuc50km",                  label: "Cons. sucesivas ≤50km" },
    { key: "conssuc50km1",                 label: "Cons. sucesivas >50km" },
    { key: "conssuc25kmVideo",             label: "Cons. sucesivas Vídeo ≤25km" },
    { key: "conssuc50kmVideo",             label: "Cons. sucesivas Vídeo ≤50km" },
    { key: "conssuc50km1Video",            label: "Cons. sucesivas Vídeo >50km" },
    { key: "consEnftrmutCentro",           label: "Cons. enfermería trmut centro" },
    { key: "sesrehabtrmutCentro",          label: "Sesiones rehabilitación trmut centro" },
    { key: "pradtrmutRm",                  label: "Pruebas diagnósticas trmut (RM)" },
    { key: "pradtrmutEco",                 label: "Pruebas diagnósticas trmut (Eco)" },
    { key: "pradtrmutTac",                 label: "Pruebas diagnósticas trmut (TAC)" },
    { key: "pradtrmutRadio",               label: "Pruebas diagnósticas trmut (Radio)" },
    { key: "iquirtrmut",                   label: "Intervenciones quirúrgicas trmut" },
    { key: "otrpptrmut",                   label: "Otras prácticas trmut" },
    { key: "pruBiomtrmut",                 label: "Pruebas biomecánicas trmut" },
    { key: "primConsotmutArt12Prog",       label: "1ª Consulta otros trmut Art.12 (Prog.)" },
    { key: "primConsotmutArt12ProgVideo",  label: "1ª Consulta otros trmut Art.12 (Prog. Vídeo)" },
    { key: "primConotmutArt12NoProg",      label: "1ª Consulta otros trmut Art.12 (No Prog.)" },
    { key: "primConotmutArt12NoProgVideo", label: "1ª Consulta otros trmut Art.12 (No Prog. Vídeo)" },
    { key: "conssucotmutArt12",            label: "Cons. sucesivas otros trmut Art.12" },
    { key: "conssucotmutArt12Video",       label: "Cons. sucesivas otros trmut Art.12 (Vídeo)" },
    { key: "consEnfotmutArt12",            label: "Cons. enfermería otros trmut Art.12" },
    { key: "sesrehabotmutArt12",           label: "Sesiones rehabilitación otros trmut Art.12" },
    { key: "pradotmutArt12Rm",             label: "Pruebas diagnósticas otros trmut Art.12 (RM)" },
    { key: "pradotmutArt12Eco",            label: "Pruebas diagnósticas otros trmut Art.12 (Eco)" },
    { key: "pradotmutArt12Tac",            label: "Pruebas diagnósticas otros trmut Art.12 (TAC)" },
    { key: "pradotmutArt12Radio",          label: "Pruebas diagnósticas otros trmut Art.12 (Radio)" },
    { key: "iquirotmutArt12",              label: "Intervenciones quirúrgicas otros trmut Art.12" },
    { key: "oppractotmutArt12",            label: "Otras prácticas otros trmut Art.12" },
    { key: "pruBiomotmutArt12",            label: "Pruebas biomecánicas otros trmut Art.12" },
    { key: "numPersAtendTotalTraMut",      label: "Nº personas atendidas total trmut" },
];

// ─── Mapa completo de campos por pestaña ─────────────────────────────────────
const CAMPOS = {
    generales: [
        { key: "nfincreg",      label: "Nº de fincas registradas" },
        { key: "suptotConst",   label: "Superficie total construida (m²)" },
        { key: "otrasObservac", label: "Otras observaciones", type: "text" },
    ],
    economicos: [
        { key: "gasfinAscp",            label: "Gastos financiación ASCP" },
        { key: "gasfinAscc",            label: "Gastos financiación ASCC" },
        { key: "gasfinCit",             label: "Gastos financiación CIT" },
        { key: "gasfinPss",             label: "Gastos financiación PSS" },
        { key: "gasfinAg",              label: "Gastos financiación AG" },
        { key: "gasbienescysAscp",      label: "Bienes y servicios ASCP" },
        { key: "gasbienescysAscc",      label: "Bienes y servicios ASCC" },
        { key: "gasbienescysCit",       label: "Bienes y servicios CIT" },
        { key: "gasbienescysPss",       label: "Bienes y servicios PSS" },
        { key: "gasbienescysAg",        label: "Bienes y servicios AG" },
        { key: "amortizAscp",           label: "Amortizaciones ASCP" },
        { key: "amortizAscc",           label: "Amortizaciones ASCC" },
        { key: "amortizCit",            label: "Amortizaciones CIT" },
        { key: "amortizPss",            label: "Amortizaciones PSS" },
        { key: "amortizAg",             label: "Amortizaciones AG" },
        { key: "inversionesNuevas",     label: "Inversiones nuevas" },
        { key: "inversionesReposicion", label: "Inversiones reposición" },
        { key: "factejercsist",         label: "Facturación ejercicio sistema" },
        { key: "factejercresto",        label: "Facturación ejercicio resto" },
        { key: "factejerotrmutuasCp",   label: "Facturación otras mutuas CP" },
        { key: "factejerotrmutuasCc",   label: "Facturación otras mutuas CC" },
        { key: "factpendcobro",         label: "Facturación pendiente cobro" },
    ],
    plantilla: [
        ...cp("persSanitMedArt6",       "Médicos (Art.6)"),
        ...cp("persSanitMedEspArt6",    "Médicos Especialistas (Art.6)"),
        ...cp("persSanitMedGesArt6",    "Médicos Gestión (Art.6)"),
        { key: "persSanitArt7DuenumPers",           label: "DUE · Nº personas" },
        { key: "persSanitArt7DuegastPers",          label: "DUE · Gasto personal" },
        { key: "persSanitArt7DuehorasCp",           label: "DUE · Horas ASCP" },
        { key: "persSanitArt7DuehorasCc",           label: "DUE · Horas ASCC" },
        { key: "persSanitArt7DuehorasIt",           label: "DUE · Horas IT" },
        { key: "persSanitArt7DuehorasAtep",         label: "DUE · Horas AT/EP" },
        { key: "persSanitArt7DuehorasAgm",          label: "DUE · Horas AGM" },
        { key: "persSanitArt7DuenumPersSustInt",    label: "DUE · Nº personas sustitución" },
        { key: "persSanitArt7DuegastPersSustInt",   label: "DUE · Gasto sustitución" },
        { key: "persSanitArt7DuehorasPersSustInt",  label: "DUE · Horas sustitución" },
        ...cp("persSanitArt7Fis",       "Fisioterapeutas (Art.7)"),
        ...cp("persSanitArt7Psico",     "Psicólogos (Art.7)"),
        ...cp("persSanitArt7TrSoc",     "Trabajadores Sociales (Art.7)"),
        ...cp("persSanitArt7TerOcu",    "Terapeutas Ocupacionales (Art.7)"),
        { key: "persSanitArt7TecRxnumPers",          label: "Técnicos RX · Nº personas" },
        { key: "persSanitArt7TecRxgastPers",         label: "Técnicos RX · Gasto personal" },
        { key: "persSanitArt7TecRxhorasCp",          label: "Técnicos RX · Horas ASCP" },
        { key: "persSanitArt7TecRxhorasCc",          label: "Técnicos RX · Horas ASCC" },
        { key: "persSanitArt7TecRxhorasIt",          label: "Técnicos RX · Horas IT" },
        { key: "persSanitArt7TecRxhorasAtep",        label: "Técnicos RX · Horas AT/EP" },
        { key: "persSanitArt7TecRxhorasAgm",         label: "Técnicos RX · Horas AGM" },
        { key: "persSanitArt7TecRxnumPersSustInt",   label: "Técnicos RX · Nº personas sustitución" },
        { key: "persSanitArt7TecRxgastPersSustInt",  label: "Técnicos RX · Gasto sustitución" },
        { key: "persSanitArt7TecRxhorasPersSustInt", label: "Técnicos RX · Horas sustitución" },
        ...cp("persSanitArt7Rest",      "Resto Personal Sanitario (Art.7)"),
        { key: "persSanitGradSupNumPers",            label: "Grado Superior · Nº personas" },
        { key: "persSanitGradSupGastPers",           label: "Grado Superior · Gasto personal" },
        { key: "persSanitGradSupHorasCp1",           label: "Grado Superior · Horas ASCP" },
        { key: "persSanitGradSupHorasCc1",           label: "Grado Superior · Horas ASCC" },
        { key: "persSanitGradSupHorasIt",            label: "Grado Superior · Horas IT" },
        { key: "persSanitGradSupHorasAtep",          label: "Grado Superior · Horas AT/EP" },
        { key: "persSanitGradSupHorasAgm",           label: "Grado Superior · Horas AGM" },
        { key: "persSanitGradSupNumPersSustInt",     label: "Grado Superior · Nº personas sustitución" },
        { key: "persSanitGradSupGastPersSustInt",    label: "Grado Superior · Gasto sustitución" },
        { key: "persSanitGradSupHorasPersSustInt",   label: "Grado Superior · Horas sustitución" },
        ...cp("persSanitGradMedAuxEnf", "Auxiliares Enfermería"),
        ...cp("persSanitGradMedRest",   "Auxiliares Farmacia y Grado Medio"),
        ...cp("restPersSanit",          "Resto Personal Sanitario"),
        ...cp("persDirCen",             "Director de Centro"),
        ...cp("persAdmin",              "Administración"),
        ...cp("persTecPre",             "Técnicos de Prevención"),
        ...cp("persNoAdmin",            "No Administración"),
    ],
    area: [
        { key: "numcamas",    label: "Número de camas" },
        { key: "numquirof",   label: "Número de quirófanos" },
        { key: "numdiano",    label: "Número de días no laborables" },
        { key: "numdcierre",  label: "Número de días de cierre" },
        { key: "horarioDe",   label: "Horario desde", type: "text" },
        { key: "horarioA",    label: "Horario hasta", type: "text" },
        { key: "tipoHorario", label: "Tipo de horario" },
        { key: "traslNdirec", label: "Traslado / Nueva dirección", type: "text" },
    ],
    poblacion: [
        { key: "pobpr25kmAd",    label: "Población protegida ≤25km - AD" },
        { key: "pobpr50kmAd",    label: "Población protegida ≤50km - AD" },
        { key: "pobprmas50Ad",   label: "Población protegida >50km - AD" },
        { key: "obs25kmAd",      label: "Observaciones ≤25km - AD", type: "text" },
        { key: "obs50kmAd",      label: "Observaciones ≤50km - AD", type: "text" },
        { key: "obsmas50kmAd",   label: "Observaciones >50km - AD", type: "text" },
        { key: "pobpr25kmCp",    label: "Población protegida ≤25km - CP" },
        { key: "pobpr50kmCp",    label: "Población protegida ≤50km - CP" },
        { key: "pobprmas50Cp",   label: "Población protegida >50km - CP" },
        { key: "pobpr25kmItcc",  label: "Población protegida ≤25km - ITCC" },
        { key: "pobpr50kmItcc",  label: "Población protegida ≤50km - ITCC" },
        { key: "pobprmas50Itcc", label: "Población protegida >50km - ITCC" },
        { key: "obs25km",        label: "Observaciones ≤25km", type: "text" },
        { key: "obs50km",        label: "Observaciones ≤50km", type: "text" },
        { key: "obsmas50km",     label: "Observaciones >50km", type: "text" },
    ],
    hos:      camposHos,
    amb:      camposAmb,
    convHos:  camposConvHos,
    convAmb:  camposConvAmb,
    itHos:    camposItHos,
    itAmb:    camposItAmb,
    otrasHos: camposOtrasHos,
    otrasAmb: camposOtrasAmb,
    asProHos: camposAsProHos,
    asPro:    camposAsPro,
};

const TABS = [
    { key: "generales",      label: "Datos Generales",           api: "Icg06DatosGenerales" },
    { key: "economicos",     label: "Datos Económicos",          api: "Icg06DatosEconomicos" },
    { key: "plantilla",      label: "Datos de Plantilla",        api: "Icg06DatosPlantilla" },
    { key: "area",           label: "Área Asistencial",          api: "Icg06AreaAsistencial" },
    { key: "poblacion",      label: "Población Protegida",       api: "Icg06PoblacionProtegida" },
    { key: "especialidades", label: "Especialidades / Servicios",api: "Icg06Especialidad" },
    { key: "hos",            label: "Act. Sust. Conciertos (H)", api: "Icg06Hos",     hospitalario: true },
    { key: "amb",            label: "Act. Sust. Conciertos",     api: "Icg06Amb" },
    { key: "convHos",        label: "Conv. Sectorial ITCC (H)",  api: "Icg06ConvHos", hospitalario: true },
    { key: "convAmb",        label: "Conv. Sectorial ITCC",      api: "Icg06ConvAmb" },
    { key: "itHos",          label: "Control IT CC (H)",         api: "Icg06ItHos",   hospitalario: true },
    { key: "itAmb",          label: "Control IT CC",             api: "Icg06ItAmb" },
    { key: "otrasHos",       label: "Otras Asistencias (H)",     api: "Icg06OtrasHos",hospitalario: true },
    { key: "otrasAmb",       label: "Otras Asistencias",         api: "Icg06OtrasAmb" },
    { key: "asProHos",       label: "AS Cont. Prof. (H)",        api: "Icg06AsProHos",hospitalario: true },
    { key: "asPro",          label: "AS Cont. Profesionales",    api: "Icg06AsPro" },
];

// ─── Estilos ──────────────────────────────────────────────────────────────────
const st = {
    page:       { fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 13, padding: "16px 20px" },
    header:     { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
    title:      { fontSize: 17, fontWeight: 700, color: "#1976d2", flex: 1 },
    yearWrap:   { display: "flex", alignItems: "center", gap: 8 },
    yearLabel:  { fontSize: 13, color: "#555" },
    backBtn:    { marginBottom: 14 },
    fichaWrap:  { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 6 },
    fichaHead:  { background: "#1976d2", color: "#fff", borderRadius: "6px 6px 0 0", padding: "12px 20px" },
    fichaTitle: { fontSize: 15, fontWeight: 700 },
    fichaAnio:  { fontSize: 13, opacity: 0.85, marginTop: 2 },
    tabBar:     { display: "flex", flexWrap: "wrap", gap: 2, padding: "10px 12px 0", borderBottom: "2px solid #e0e0e0", background: "#fafafa" },
    tab: (a) => ({
        padding: "7px 14px", fontSize: 12.5, cursor: "pointer", border: "none",
        borderBottom: a ? "2px solid #1976d2" : "2px solid transparent",
        background: "none", color: a ? "#1976d2" : "#555",
        fontWeight: a ? 700 : 400, outline: "none", marginBottom: -2,
    }),
    tabContent: { padding: "16px 20px", overflowY: "auto", maxHeight: "calc(100vh - 280px)", paddingBottom: "40px" },
    loading:    { color: "#888", padding: 20 },
    nodata:     { color: "#c00", padding: 20 },
    fieldGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "10px 20px" },
    field:      { display: "flex", flexDirection: "column" },
    fieldLabel: { fontSize: 10.5, color: "#1565c0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 },
    fieldInput: { border: "1px solid #d0d0d0", borderRadius: 3, padding: "4px 8px", fontSize: 13, outline: "none", background: "#fff", color: "#222", width: "100%", boxSizing: "border-box", fontFamily: "inherit" },
    saveBar:    { display: "flex", gap: 10, marginTop: 16, alignItems: "center" },
    saveBtn:    { border: "none", borderRadius: 4, padding: "6px 22px", fontSize: 13, cursor: "pointer", fontWeight: 600, background: "#2e7d32", color: "#fff" },
    msg: (ok)  => ({ fontSize: 12.5, color: ok ? "#2e7d32" : "#c62828" }),
};

// ─── Helper formato numérico ──────────────────────────────────────────────────
const fmtNum = (val) =>
    val === null || val === undefined
        ? <span style={{ color: "#bbb" }}>—</span>
        : <span>{Number(val).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;

// ─── TabContent ───────────────────────────────────────────────────────────────
const TabContent = ({ centroId, año, tabKey, apiName }) => {
    const [datos,   setDatos]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const [msg,     setMsg]     = useState(null);

    useEffect(() => {
        setLoading(true); setMsg(null); setDatos(null);
        fetch(`/api/${apiName}?centroId=${centroId}&a%C3%B1o=${año}`)
            .then(r => r.ok ? r.json() : null)
            .then(d  => setDatos(d))
            .catch(() => setDatos(null))
            .finally(() => setLoading(false));
    }, [centroId, año, apiName]);

    const handleChange = (key, val) =>
        setDatos(prev => ({ ...prev, [key]: val === "" ? null : val }));

    const guardar = async () => {
        if (!datos) return;
        setSaving(true); setMsg(null);
        try {
            const id  = datos.idIcg ?? datos.id;
            const res = await fetch(`/api/${apiName}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });
            if (!res.ok) throw new Error();
            setMsg({ ok: true, text: "Guardado correctamente." });
        } catch {
            setMsg({ ok: false, text: "Error al guardar." });
        } finally { setSaving(false); }
    };

    if (loading) return <div style={st.loading}>Cargando…</div>;
    if (!datos)  return <div style={st.nodata}>No hay datos para este centro y año.</div>;

    const camposList = (CAMPOS[tabKey] || []).length > 0
        ? CAMPOS[tabKey].map(c => ({ ...c, type: c.type || "number" }))
        : Object.keys(datos)
            .filter(k => !["idIcg","id","centroId","año"].includes(k))
            .map(k => ({ key: k, label: k, type: typeof datos[k] === "number" ? "number" : "text" }));

    return (
        <div>
            <div style={st.saveBar}>
                <button style={st.saveBtn} onClick={guardar} disabled={saving}>
                    {saving ? "Guardando\u2026" : "Guardar"}
                </button>
                {msg && <span style={st.msg(msg.ok)}>{msg.text}</span>}
            </div>
            <div style={st.fieldGrid}>
                {camposList.map(({ key, label, type = "number" }) => (
                    <div key={key} style={type === "text" ? { ...st.field, gridColumn: "span 2" } : st.field}>
                        <span style={st.fieldLabel}>{label}</span>
                        {type === "text" ? (
                            <textarea
                                style={{ ...st.fieldInput, minHeight: 60, resize: "vertical", padding: "6px 8px" }}
                                value={datos[key] ?? ""}
                                onChange={e => handleChange(key, e.target.value)}
                                placeholder="Escriba aquí..."
                            />
                        ) : (
                            <input
                                style={{
                                    ...st.fieldInput,
                                    color: (datos[key] === null || datos[key] === "") ? "#bbb" : "#222",
                                }}
                                type="number"
                                value={datos[key] ?? ""}
                                onChange={e => handleChange(key, e.target.value)}
                                placeholder="0"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── FichaICG06 ───────────────────────────────────────────────────────────────
const FichaICG06 = ({ centro, año, onBack }) => {
    const [tabActiva, setTabActiva] = useState("generales");
    const [esHospitalario, setEsHospitalario] = useState(true);
    const tab = TABS.find(t => t.key === tabActiva);
    const tabsVisibles = TABS.filter(t => !t.hospitalario || esHospitalario);

    return (
        <div>
            <div style={st.backBtn}>
                <Button text="← Volver a la lista" onClick={onBack} stylingMode="outlined" />
            </div>
            <div style={st.fichaWrap}>
                <div style={st.fichaHead}>
                    <div style={st.fichaTitle}>ICG06 — {centro.centro} ({centro.localizador})</div>
                    <div style={st.fichaAnio}>Año: {año} · Centro ID: {centro.centroId}</div>
                </div>
                <div style={st.tabBar}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "6px 12px", background: "#f0f4f8", borderBottom: "1px solid #e0e0e0" }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#1565c0", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                            <input type="checkbox" checked={esHospitalario} onChange={e => { setEsHospitalario(e.target.checked); setTabActiva("generales"); }} />
                            Centro Hospitalario
                        </label>
                    </div>
                    {tabsVisibles.map(t => (
                        <button key={t.key} style={st.tab(tabActiva === t.key)} onClick={() => setTabActiva(t.key)}>
                            {t.label}
                        </button>
                    ))}
                </div>
                <div style={st.tabContent}>
                    {tab && (
                        <TabContent
                            key={`${centro.centroId}-${año}-${tabActiva}`}
                            centroId={centro.centroId}
                            año={año}
                            tabKey={tabActiva}
                            apiName={tab.api}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const ICGCentrosPropios = () => {
    const { t }       = useTranslation();
    const dataGridRef = useRef(null);

    const [centros,            setCentros]            = useState([]);
    const [icgData,            setIcgData]            = useState([]);
    const [loading,            setLoading]            = useState(true);
    const [año,                setAño]                = useState(YEAR_NOW);
    const [centroSeleccionado, setCentroSeleccionado] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Cargar listado de centros (una sola vez)
    useEffect(() => {
        const user     = JSON.parse(sessionStorage.getItem('user'));
        const perfilId = user?.perfilId ?? '';
        fetch(`${API_CENTROS}?perfilId=${perfilId}`)
            .then(r => r.ok ? r.json() : [])
            .then(d => setCentros(d))
            .catch(() => setCentros([]));
    }, []);

    // Cargar datos ICG calculados cuando cambia el año
    useEffect(() => {
        setLoading(true);
        fetch(`/api/ListadoPropiosIcg?a%C3%B1o=${año}`)
            .then(r => r.ok ? r.json() : [])
            .then(d => setIcgData(d))
            .catch(() => setIcgData([]))
            .finally(() => setLoading(false));
    }, [año]);

    // Cruzar centros con datos ICG del año seleccionado
    const dataSource = centros.map(c => {
        const icg = icgData.find(i => i.centroId === c.centroId) || {};
        return {
            ...c,
            cap1GastosPersonal:       icg.cap1_GastosPersonal       ?? null,
            cap2GastosCorrientes:     icg.cap2_GastosCorrientes     ?? null,
            cap3GastosFinancieros:    icg.cap3_GastosFinancieros     ?? null,
            cuenta68Amortizaciones:   icg.cuenta68_Amortizaciones   ?? null,
            art32OtrosIngresos:       icg.art32_OtrosIngresos       ?? null,
            art62InversionNueva:      icg.art62_InversionNueva      ?? null,
            art63InversionReposicion: icg.art63_InversionReposicion ?? null,
            totalGastos:              icg.totalGastos               ?? null,
            totalInversion:           icg.totalInversion            ?? null,
            tieneIcg:                 !!icg.idIcg,
        };
    });

    const onExporting = (e) => {
        const workbook = new Workbook();
        const sheet    = workbook.addWorksheet("CentrosPropios");
        exportDataGrid({ component: e.component, worksheet: sheet, autoFilterEnabled: true })
            .then(() => workbook.xlsx.writeBuffer())
            .then(buf => saveAs(new Blob([buf], { type: "application/octet-stream" }), `CentrosPropios_ICG_${año}.xlsx`));
        e.cancel = true;
    };

    if (centroSeleccionado) {
        return (
            <div className="ficha-container-inline">
                <div className="ficha-inline-content">
                    <FichaICG06
                        centro={centroSeleccionado}
                        año={año}
                        onBack={() => setCentroSeleccionado(null)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                <div className="header-page">
                    <div className="title">
                        {t('Lista Centros Propios — ICG06')}
                    </div>
                    <div className="header-actions-side">
                        <div className="year-selector-wrap">
                            <span className="year-label">{t('Año')}:</span>
                            <SelectBox items={YEARS} value={año} onValueChanged={e => setAño(e.value)} width={100} />
                        </div>

                        <div className="acciones-container" ref={menuRef}>
                            <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                <i className="ri-settings-3-line"></i>
                                {t('Acciones')}
                            </div>

                            {menuAbierto && (
                                <div className="acciones-menu">
                                    <div className="acciones-item" onClick={() => { setMenuAbierto(false); dataGridRef.current?.instance().exportToExcel(false); }}>
                                        <i className="ri-file-excel-2-line"></i>
                                        {t('Exportar Excel')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="table-container" style={{ padding: '0 20px 20px 20px' }}>
            <DataGrid
                ref={dataGridRef}
                dataSource={dataSource}
                showBorders
                rowAlternationEnabled
                columnAutoWidth
                allowColumnResizing
                allowColumnReordering
                onExporting={onExporting}
                noDataText={loading ? "Cargando…" : "No hay centros disponibles"}
            >
                <SearchPanel visible placeholder="Buscar…" />
                <FilterRow visible />
                <HeaderFilter visible />
                <GroupPanel visible />
                <Grouping autoExpandAll={false} />
                <ColumnChooser enabled />
                <Selection mode="single" />
                <Export enabled allowExportSelectedData />
                <Paging defaultPageSize={20} />
                <Toolbar>
                    <Item location="after" name="searchPanel" />
                    <Item location="after" name="columnChooserButton" />
                </Toolbar>

                {/* ── Identificación ── */}
                <Column dataField="localizador" caption="Localizador"  width={110} />
                <Column dataField="mutuaId"     caption="Mutua"        width={70}  />
                <Column dataField="centroId"    caption="Centro ID"    width={90}  />
                <Column dataField="centro"      caption="Centro"       minWidth={200} />
                <Column dataField="cp"          caption="C.P."         width={80}  />
                <Column dataField="provincia"   caption="Provincia"    width={130} />
                <Column dataField="telefono"    caption="Teléfono"     width={130} />
                <Column dataField="desactivado" caption="Desactivado"  width={110}
                    cellRender={({ value }) => (
                        <span style={{ color: value ? "#c62828" : "#2e7d32", fontWeight: 600 }}>
                            {value ? "Sí" : "No"}
                        </span>
                    )}
                />

                {/* ── Vistas calculadas ICG ── */}
                <Column dataField="cap1GastosPersonal"
                    caption="Cap. 1 - Personal"
                    width={140} dataType="number"
                    cellRender={({ value }) => fmtNum(value)}
                />
                <Column dataField="cap2GastosCorrientes"
                    caption="Cap. 2 - Corrientes"
                    width={145} dataType="number"
                    cellRender={({ value }) => fmtNum(value)}
                />
                <Column dataField="cap3GastosFinancieros"
                    caption="Cap. 3 - Financieros"
                    width={145} dataType="number"
                    cellRender={({ value }) => fmtNum(value)}
                />
                <Column dataField="cuenta68Amortizaciones"
                    caption="Cta. 68 - Amortiz."
                    width={140} dataType="number"
                    cellRender={({ value }) => fmtNum(value)}
                />
                <Column dataField="art32OtrosIngresos"
                    caption="Art. 32 - Ingresos"
                    width={140} dataType="number"
                    cellRender={({ value }) => fmtNum(value)}
                />
                <Column dataField="art62InversionNueva"
                    caption="Art. 62 - Inv. Nueva"
                    width={145} dataType="number"
                    cellRender={({ value }) => fmtNum(value)}
                />
                <Column dataField="art63InversionReposicion"
                    caption="Art. 63 - Inv. Repos."
                    width={150} dataType="number"
                    cellRender={({ value }) => fmtNum(value)}
                />
                <Column dataField="totalGastos"
                    caption="Total Gastos"
                    width={130} dataType="number"
                    cellRender={({ value }) => (
                        <span style={{ fontWeight: 700, color: "#1565c0" }}>
                            {value === null || value === undefined ? "—" :
                                Number(value).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    )}
                />
                <Column dataField="totalInversion"
                    caption="Total Inversión"
                    width={130} dataType="number"
                    cellRender={({ value }) => (
                        <span style={{ fontWeight: 700, color: "#2e7d32" }}>
                            {value === null || value === undefined ? "—" :
                                Number(value).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    )}
                />

                {/* ── Acceso a ficha ICG ── */}
                <Column caption="ICG06" width={110}
                    cellRender={({ data }) => (
                        <button
                            style={{
                                border: "none", borderRadius: 3, padding: "3px 12px",
                                background: data.tieneIcg ? "#1976d2" : "#90a4ae",
                                color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600
                            }}
                            onClick={() => setCentroSeleccionado(data)}
                        >
                            {data.tieneIcg ? "Ver ficha" : "Sin ICG"}
                        </button>
                    )}
                />
                    </DataGrid>
                </div>
            </div>
        </div>
    );
};

export default ICGCentrosPropios;