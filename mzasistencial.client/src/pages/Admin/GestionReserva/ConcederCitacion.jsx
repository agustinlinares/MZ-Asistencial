import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CitacionesService from "../../../services/admin/CitacionesService";
import TablaCitaciones from "./TablaCitaciones";
import { useLogError } from '../../../hooks/useLogError';
import AuthService from "../../../services/auth/AuthService";
import notify from 'devextreme/ui/notify';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/pdf_exporter';

const ConcederCitacion = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [citaciones, setCitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);

    const logError = useLogError("Conceder citación");
    // Ficha Citacion State
    const [showFicha, setShowFicha] = useState(false);
    const [citacionSeleccionada, setCitacionSeleccionada] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
            mid = user?.mutuaId || 1;
            

            const apiFilters = {
                Anio: f.anio,
                Estado: f.estado,
                DemandaId: f.demandaId || undefined,
                CitacionId: f.citacionId || undefined,
                Necesidad: f.necesidad || undefined
            };
            const data = await CitacionesService.getRecibidas(mid, apiFilters);
            setCitaciones(data);
        } catch (error) {
            logError("Fallo al cargar el listado de citaciones recibidas", error);
            console.error("Error cargando citaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConceder = async (citacion) => {
        let mid = 1;
        try {
            await CitacionesService.updateEstado(citacion.CitacionId, 2, '');
            notify(t('Citación concedida correctamente'), 'success', 2000);
            cargarDatos();
        } catch {
            logError(`Fallo al conceder la citación ID: ${citacion.CitacionId}`, error);
            notify(t('Error al conceder la citación'), 'error', 2000);
        }
    };

    const handleRechazar = async (citacion) => {
        const motivo = window.prompt(t('Indica el motivo del rechazo:'));
        if (!motivo || !motivo.trim()) return;
        let mid = 1;
        try {
            await CitacionesService.updateRechazo(citacion.CitacionId, motivo.trim());
            notify(t('Citación rechazada'), 'warning', 2000);
            cargarDatos();
        } catch {
            logError(`Fallo al rechazar la citación ID: ${citacion.CitacionId}`, error);
            notify(t('Error al rechazar la citación'), 'error', 2000);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleLimpiarFiltros = () => {
        setFiltros({
            vista: 'Desagrupada',
            anio: new Date().getFullYear(),
            estado: 'Todas',
            demandaId: '',
            citacionId: '',
            necesidad: ''
        });
        cargarDatos();
    };

    const handleSelectionChanged = (e) => {
        setSelectedRowKeys(e.selectedRowKeys);
    };

    const handleConcederLote = async () => {
        if (selectedRowKeys.length === 0) return;
        
        let dialog = custom({
            title: "Conceder en lote",
            messageHtml: "<b>Contestación genérica para estas citaciones:</b><br/><textarea id='bulkContestacion' style='width:100%; height:80px; margin-top:10px;'></textarea>",
            buttons: [
                { text: "Conceder", onClick: () => document.getElementById('bulkContestacion').value },
                { text: "Cancelar", onClick: () => null }
            ]
        });

        const result = await dialog.show();
        if (result) {
            let mid = 1;
        try {
                await CitacionesService.updateEstadoLote(selectedRowKeys, 2, result);
                notify(t('Citaciones concedidas correctamente'), 'success', 2000);
                setSelectedRowKeys([]);
                cargarDatos();
            } catch (err) {
                notify(t('Error al conceder'), 'error', 2000);
            }
        }
    };

    const handleRechazarLote = async () => {
        if (selectedRowKeys.length === 0) return;
        
        let dialog = custom({
            title: "Rechazar en lote",
            messageHtml: "<b>Motivo de rechazo para estas citaciones:</b><br/><textarea id='bulkMotivo' style='width:100%; height:80px; margin-top:10px;'></textarea>",
            buttons: [
                { text: "Rechazar", onClick: () => document.getElementById('bulkMotivo').value },
                { text: "Cancelar", onClick: () => null }
            ]
        });

        const result = await dialog.show();
        if (result) {
            let mid = 1;
        try {
                await CitacionesService.updateRechazoLote(selectedRowKeys, result);
                notify(t('Citaciones rechazadas correctamente'), 'success', 2000);
                setSelectedRowKeys([]);
                cargarDatos();
            } catch (err) {
                notify(t('Error al rechazar'), 'error', 2000);
            }
        }
    };

    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('CitacionesRecibidas');
        exportDataGrid({ component: grid, worksheet, autoFilterEnabled: true }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CitacionesRecibidas.xlsx');
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
                    doc.save('CitacionesRecibidas.pdf');
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
