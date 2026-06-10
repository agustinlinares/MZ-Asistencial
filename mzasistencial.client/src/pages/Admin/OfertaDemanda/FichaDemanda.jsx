import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataGrid, { Column, FilterRow } from "devextreme-react/data-grid";
import { Popup } from 'devextreme-react/popup';
import { SelectBox } from 'devextreme-react/select-box';
import { TextArea } from 'devextreme-react/text-area';
import notify from 'devextreme/ui/notify';
import '../../../styles/FichaGlobal.css';

const API = '/api';
const MESES_NOMBRES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MESES_KEYS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const get = (obj, key) => {
    if (!obj) return undefined;
    if (obj[key] !== undefined) return obj[key];
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    if (obj[pascalKey] !== undefined) return obj[pascalKey];
    const upperKey = key.toUpperCase();
    if (obj[upperKey] !== undefined) return obj[upperKey];
    return undefined;
};

const getId = (item) => item?.subSolId || item?.SubSolId;
const getEstado = (item) => String(item?.estadoId || item?.EstadoId);

const fmt = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? fecha : d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const Campo = ({ label, value }) => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#333' }}>{label}</label>
        <input
            type="text"
            readOnly
            value={value || ''}
            style={{
                background: '#fff',
                border: '1px solid #ccc',
                padding: '6px 8px',
                borderRadius: '2px',
                width: '100%',
                color: '#555',
                fontSize: '13px',
                boxSizing: 'border-box'
            }}
        />
    </div>
);

// ─── Componente FichaIndividual ──────────────────────────────────────────────
const FichaIndividual = ({ datos, onAnular, onRechazar, onSalir }) => {
    const subs = datos.subSolicitudes || datos.SubSolicitudes || [];
    const dataSourceDocumentos = datos.documentos || datos.Documentos || [];

    const confirmadaBD = subs.find(s => getEstado(s) === '3');
    const yaConfirmada = !!confirmadaBD;

    const [selectedId, setSelectedId] = useState(null);
    const activeId = yaConfirmada ? getId(confirmadaBD) : selectedId;

    const subsVisibles = activeId ? subs.filter(s => getId(s) === activeId) : subs;

    const fileInputRef = useRef(null);

    const [isAnularModalOpen, setIsAnularModalOpen] = useState(false);
    const [tipoAnulacion, setTipoAnulacion] = useState("");
    const [motivoAnulacion, setMotivoAnulacion] = useState("");

    const [isRechazarModalOpen, setIsRechazarModalOpen] = useState(false);
    const [motivoRechazo, setMotivoRechazo] = useState("");

    const ejecutarAnulacion = async () => {
        if (!tipoAnulacion) return notify('Debes seleccionar un Tipo de Anulación', 'warning', 2000);
        await onAnular({ tipoAnulacion, motivoAnulacion });
        setIsAnularModalOpen(false);
        setSelectedId(null);
        setTipoAnulacion("");
        setMotivoAnulacion("");
    };

    const ejecutarRechazo = async () => {
        if (!motivoRechazo.trim()) return notify('Debes escribir un motivo de rechazo', 'warning', 2000);
        await onRechazar({ motivoRechazo });
        setIsRechazarModalOpen(false);
        setSelectedId(null);
        setMotivoRechazo("");
    };

    const totalDemanda = MESES_KEYS.reduce((sum, mes) => sum + (parseInt(get(datos, mes)) || 0), 0);

    return (
        <div className="file-box" style={{ padding: '0px', height: '100%', overflowY: 'auto', backgroundColor: '#fff' }}>

            <Popup visible={isAnularModalOpen} onHiding={() => setIsAnularModalOpen(false)} title="Anulación de demanda" width={500} height="auto">
                <div style={{ padding: 10 }}>
                    <div className="ficha-field" style={{ marginBottom: 20 }}>
                        <label>Tipo de Anulación</label>
                        <SelectBox items={["Alta del Empleado", "Error en la Solicitud", "Otros Motivos"]} value={tipoAnulacion} onValueChanged={(e) => setTipoAnulacion(e.value)} />
                    </div>
                    <div className="ficha-field" style={{ marginBottom: 20 }}>
                        <label>Motivo</label>
                        <TextArea height={90} value={motivoAnulacion} onValueChanged={(e) => setMotivoAnulacion(e.value)} />
                    </div>
                    <button onClick={ejecutarAnulacion} className="ficha-btn-danger" style={{ width: '100%' }}>Confirmar Anulación</button>
                </div>
            </Popup>

            <Popup visible={isRechazarModalOpen} onHiding={() => setIsRechazarModalOpen(false)} title="Rechazar cita" width={500} height="auto">
                <div style={{ padding: 10 }}>
                    <div className="ficha-field" style={{ marginBottom: 20 }}>
                        <label>Motivo de Rechazo</label>
                        <TextArea height={90} value={motivoRechazo} onValueChanged={(e) => setMotivoRechazo(e.value)} placeholder="Indica el motivo..." />
                    </div>
                    <button onClick={ejecutarRechazo} className="ficha-btn-danger" style={{ width: '100%' }}>Confirmar Rechazo</button>
                </div>
            </Popup>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e9ecef', padding: '12px 20px', borderBottom: '1px solid #ddd', marginBottom: '25px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#000', textTransform: 'uppercase' }}>Ficha Gestión Demanda</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => setIsAnularModalOpen(true)} style={{ backgroundColor: '#ff0000', color: '#fff', border: '1px solid #cc0000', borderRadius: '3px', padding: '5px 12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                        <i className="dx-icon-trash" style={{ fontSize: '14px' }}></i> Anular
                    </button>

                    {yaConfirmada && (
                        <button onClick={() => setIsRechazarModalOpen(true)} style={{ backgroundColor: '#f0ad4e', color: '#fff', border: '1px solid #eea236', borderRadius: '3px', padding: '5px 12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                            <i className="dx-icon-close" style={{ fontSize: '14px' }}></i> Rechazar cita
                        </button>
                    )}

                    <button onClick={() => window.print()} style={{ backgroundColor: '#428bca', color: '#fff', border: '1px solid #357ebd', borderRadius: '3px', padding: '5px 12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                        <i className="dx-icon-print" style={{ fontSize: '14px' }}></i> Imprimir Ficha
                    </button>

                    <button onClick={onSalir} style={{ backgroundColor: '#428bca', color: '#fff', border: '1px solid #357ebd', borderRadius: '3px', padding: '5px 12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                        <i className="dx-icon-clear" style={{ fontSize: '14px' }}></i> Salir
                    </button>
                </div>
            </div>

            <div style={{ padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 3fr 3fr', gap: 20, marginBottom: 15 }}>
                    <Campo label="ID Demanda" value={get(datos, 'demandaId')} />
                    <Campo label="Especialidad" value={get(datos, 'especialidad')} />
                    <Campo label="Servicio" value={get(datos, 'servicio')} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 3fr 3fr', gap: 20, marginBottom: 15 }}>
                    <Campo label="Localidad" value={get(datos, 'localidad')} />
                    <Campo label="Fecha Solicitud" value={fmt(get(datos, 'fechaSolicitud'))} />
                    <Campo label="Fecha Confirmación" value={fmt(get(datos, 'fechaConfirmacion'))} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 6fr', gap: 20, marginBottom: 30 }}>
                    <Campo label="Estado Demanda" value={get(datos, 'estado')} />
                    <div></div>
                </div>

                <div style={{ overflowX: 'auto', marginBottom: 20 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc', fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '8px', borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc', background: '#fff' }}></th>
                                {MESES_NOMBRES.map(mes => (
                                    <th key={mes} style={{ padding: '8px', borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc', fontWeight: 'bold', textAlign: 'center', background: '#fff', color: '#000' }}>{mes}</th>
                                ))}
                                <th style={{ padding: '8px', borderBottom: '1px solid #ccc', fontWeight: 'bold', textAlign: 'center', background: '#fff', color: '#000' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '8px', borderRight: '1px solid #ccc', fontWeight: 'bold', background: '#fff', color: '#000', textAlign: 'center' }}>DEMANDA</td>
                                {MESES_KEYS.map(mes => {
                                    const val = get(datos, mes);
                                    return (
                                        <td key={mes} style={{ padding: '4px 8px', borderRight: '1px solid #ccc', background: '#fff' }}>
                                            <input
                                                type="text"
                                                readOnly
                                                value={val !== undefined && val !== null ? val : 0}
                                                style={{ width: '100%', textAlign: 'right', border: '1px solid #b3d4f5', borderRadius: '2px', backgroundColor: '#e6f2ff', padding: '3px 5px', boxSizing: 'border-box', color: '#000' }}
                                            />
                                        </td>
                                    );
                                })}
                                <td style={{ padding: '4px 8px', background: '#fff' }}>
                                    <input
                                        type="text"
                                        readOnly
                                        value={totalDemanda}
                                        style={{ width: '100%', textAlign: 'right', border: '1px solid #b3d4f5', borderRadius: '2px', backgroundColor: '#e6f2ff', padding: '3px 5px', boxSizing: 'border-box', color: '#000' }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', borderBottom: '3px solid #0078d7', marginTop: '10px' }}>
                    <div style={{ background: '#0078d7', color: '#fff', padding: '6px 25px', fontSize: '13px', fontWeight: 'bold', marginBottom: '-3px' }}>
                        Subsolicitudes
                    </div>
                </div>

                <div style={{ border: '1px solid #ccc', borderTop: 'none', marginBottom: 30 }}>
                    <DataGrid
                        dataSource={subsVisibles}
                        keyExpr={d => getId(d)}
                        className="mz-table"
                        rowAlternationEnabled={true}
                        hoverStateEnabled={!yaConfirmada}
                        onRowClick={(e) => {
                            if (yaConfirmada) return;
                            const clickedId = getId(e.data);
                            setSelectedId(selectedId === clickedId ? null : clickedId);
                        }}
                        onRowPrepared={(e) => {
                            if (e.rowType === 'data' && activeId === getId(e.data)) {
                                e.rowElement.style.backgroundColor = '#0056b3';
                                e.rowElement.style.color = '#ffffff';
                            }
                        }}
                    >
                        <FilterRow visible={true} />
                        <Column width={40} alignment="center" caption="#" cellRender={(cell) => (
                            <input
                                type="radio"
                                checked={activeId === getId(cell.data)}
                                readOnly
                                style={{ cursor: yaConfirmada ? 'not-allowed' : 'pointer', pointerEvents: 'none' }}
                            />
                        )} />
                        <Column caption="Mutua Ofertante" calculateCellValue={d => get(d, 'mutuaOfertante')} />
                        <Column caption="Centro" calculateCellValue={d => get(d, 'centro')} />
                        <Column caption="Contestación" calculateCellValue={d => get(d, 'contestacion')} />
                        <Column caption="Contestación Plazos" calculateCellValue={d => get(d, 'contestacionPlazos')} />
                        <Column caption="Fecha Asignación" cellRender={(c) => fmt(get(c.data, 'fechaAsignacion'))} />
                        <Column caption="Fecha Confirmación" cellRender={(c) => fmt(get(c.data, 'fechaConfirmacion'))} />

                        {MESES_KEYS.map((m, idx) => (
                            <Column
                                key={m}
                                caption={MESES_CORTOS[idx]}
                                width={50}
                                alignment="right"
                                calculateCellValue={d => {
                                    const val = get(d, m);
                                    return val !== undefined && val !== null ? val : 0;
                                }}
                            />
                        ))}
                        <Column caption="Tot..." width={55} alignment="right" calculateCellValue={d => get(d, 'total') ?? 0} />
                    </DataGrid>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#333', marginBottom: '5px' }}>Necesidades para el Servicio</label>
                        <textarea
                            readOnly
                            value={get(datos, 'necesidadesServicio') || get(datos, 'descripcion') || ''}
                            style={{ height: '80px', backgroundColor: '#e6f2ff', border: '1px solid #b3d4f5', borderRadius: '3px', padding: '8px', color: '#004085', fontSize: '13px', resize: 'none', outline: 'none' }}
                        ></textarea>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#333', marginBottom: '5px' }}>Plazos</label>
                        <textarea
                            readOnly
                            value={get(datos, 'plazos') || ''}
                            style={{ height: '80px', backgroundColor: '#e6f2ff', border: '1px solid #b3d4f5', borderRadius: '3px', padding: '8px', color: '#004085', fontSize: '13px', resize: 'none', outline: 'none' }}
                        ></textarea>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => { if (e.target.files[0]) notify(`Subido: ${e.target.files[0].name}`, 'info', 2000); e.target.value = null; }} />
                    <button onClick={() => fileInputRef.current.click()} style={{ backgroundColor: '#428bca', color: '#fff', border: '1px solid #357ebd', borderRadius: '3px', padding: '5px 15px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>Adjuntar</button>
                </div>
                <DataGrid
                    dataSource={dataSourceDocumentos}
                    className="mz-table"
                    rowAlternationEnabled={true}
                    onRowPrepared={(e) => {
                        if (e.rowType === 'data' && e.rowIndex === 0) {
                            e.rowElement.style.backgroundColor = '#0056b3';
                            e.rowElement.style.color = '#ffffff';
                        }
                    }}
                >
                    <Column caption="Fichero" calculateCellValue={d => get(d, 'nombreDocumento')} />
                    <Column caption="Mutua" calculateCellValue={d => get(d, 'mutua')} />
                    <Column caption="Usuario" calculateCellValue={d => get(d, 'usuario')} width={150} />
                    <Column caption="Fecha" width={140} cellRender={(c) => fmt(get(c.data, 'fechaAlta'))} />
                </DataGrid>
            </div>
        </div>
    );
};

const FichaDemanda = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);

    const cargarDatos = useCallback(() => {
        const timestamp = new Date().getTime();
        fetch(`${API}/ListaDemandas/${id}?t=${timestamp}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(setDatos)
            .finally(() => setCargando(false));
    }, [id]);

    useEffect(() => { cargarDatos(); }, [cargarDatos]);

    const handleAnular = async ({ tipoAnulacion, motivoAnulacion }) => {
        const res = await fetch(`${API}/ListaDemandas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estadoId: 9, motivoAnulacion: `${tipoAnulacion} - ${motivoAnulacion}` })
        });
        if (res.ok) { notify('Anulado', 'success'); cargarDatos(); }
    };

    const handleRechazar = async ({ motivoRechazo }) => {
        const res = await fetch(`${API}/ListaDemandas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estadoId: 8, motivoRechazo })
        });
        if (res.ok) { notify('Rechazado correctamente', 'success'); cargarDatos(); }
    };

    if (cargando) return <div>Cargando...</div>;
    return (datos?.tipoId === 2 || datos?.TipoId === 2)
        ? <FichaIndividual
            datos={datos}
            onRechazar={handleRechazar}
            onAnular={handleAnular}
            onSalir={() => navigate(-1)}
        />
        : <div>Ficha Anual</div>;
};

export default FichaDemanda;