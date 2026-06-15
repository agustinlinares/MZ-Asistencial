import React, { useEffect, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import './GestionReserva.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import DataGrid, {
    Column, Paging, SearchPanel, FilterRow, HeaderFilter,
    Selection, ColumnChooser, Export, Scrolling, Sorting,
    ColumnFixing, Pager, Toolbar, Item, Summary, TotalItem, Grouping, GroupPanel
} from "devextreme-react/data-grid";

import { useLogError } from '../../../hooks/useLogError';

import { useTranslation } from "react-i18next";
import CitacionesService from "../../../services/admin/CitacionesService";
import AuthService from "../../../services/auth/AuthService";
import TablaCitaciones from "./TablaCitaciones";

const SolicitarCitacion = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [citaciones, setCitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [showNuevaSolicitud, setShowNuevaSolicitud] = useState(false);
    const menuRef = useRef(null);

    const logError = useLogError("Solicitar citación");
    
    // Ficha Citacion State
    const [showFicha, setShowFicha] = useState(false);
    const [citacionSeleccionada, setCitacionSeleccionada] = useState(null);

    // Filtros
    const [filtros, setFiltros] = useState({
        vista: 'Desagrupada',
        anio: new Date().getFullYear(),
        estado: 'Todas',
        demandaId: '',
        citacionId: '',
        necesidad: ''
    });

    const [anios, setAnios] = useState([]);
    const [estados, setEstados] = useState([
        'Todas', 'Pendiente Consumir', 'Pendiente Conceder', 'Nula', 
        'Desierta', 'Consumidas', 'Confirmada', 'Caducadas', 'Rechazada'
    ]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const list = [];
        for (let y = currentYear + 1; y >= 2020; y--) list.push(y);
        setAnios(list);

        cargarDatos();

        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const cargarDatos = async (f = filtros) => {
        setLoading(true);
        let mid = 1;
        try {
            const user = AuthService.getUserData();
            const mid = user?.mutuaId || 1;

            const apiFilters = {
                Anio: f.anio,
                Estado: f.estado,
                DemandaId: f.demandaId || undefined,
                CitacionId: f.citacionId || undefined,
                Necesidad: f.necesidad || undefined
            };
            const data = await CitacionesService.getSolicitadas(mid, apiFilters);
            setCitaciones(data);
        } catch (error) {
            logError(`Fallo al cargar citaciones solicitadas (Mutua: ${mid || 'N/A'}, Filtros: ${JSON.stringify(f)})`, error);
            console.error("Error cargando citaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleLimpiarFiltros = () => {
        const initial = {
            vista: 'Desagrupada',
            anio: new Date().getFullYear(),
            estado: 'Todas',
            demandaId: '',
            citacionId: '',
            necesidad: ''
        };
        setFiltros(initial);
        cargarDatos(initial);
    };

    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('CitacionesSolicitadas');
        exportDataGrid({ component: grid, worksheet, autoFilterEnabled: true }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CitacionesSolicitadas.xlsx');
            });
        });
    };

    const handleExportarPDF = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        import('devextreme/pdf_exporter').then(({ exportDataGrid: exportPDF }) => {
            import('jspdf').then(({ jsPDF }) => {
                const doc = new jsPDF({ orientation: 'landscape' });
                exportPDF({ jsPDFDocument: doc, component: grid, indent: 5 }).then(() => {
                    doc.save('CitacionesSolicitadas.pdf');
                });
            });
        });
    };

    const getEstadoStyle = (estado) => {
        let color = '#757575';
        let bg = '#f5f5f5';
        switch (estado?.toUpperCase()) {
            case 'PENDIENTE': case 'PENDIENTE CONCEDER': color = '#e65100'; bg = '#fff3e0'; break;
            case 'CONFIRMADA': case 'CONCEDIDA': color = '#2e7d32'; bg = '#e8f5e9'; break;
            case 'RECHAZADA': color = '#c62828'; bg = '#ffebee'; break;
            case 'DESIERTA': color = '#d32f2f'; bg = '#fce4ec'; break;
            case 'CADUCADAS': color = '#616161'; bg = '#eeeeee'; break;
        }
        return {
            color, backgroundColor: bg,
            padding: '2px 8px', borderRadius: '12px',
            fontSize: '11px', fontWeight: 'bold',
            textTransform: 'uppercase'
        };
    };

    const handleRowDblClick = (e) => {
        setCitacionSeleccionada(e.data);
        setShowFicha(true);
    };

    return (
        <TablaCitaciones 
            modo="solicitud"
            titulo="GESTIÓN SOLICITUD DE CITACIÓN"
            createStore={CitacionesService.createSolicitadasStore}
            mutuaColumnField="MutuaOfertante"
            mutuaColumnCaption="Mutua Ofertante"
            hasNuevaSolicitud={false}
            hasBatchActions={false}
            hasRowActions={false}
        />
    );
};

export default SolicitarCitacion;
