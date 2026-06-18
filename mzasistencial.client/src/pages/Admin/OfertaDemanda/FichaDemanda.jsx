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
    return isNaN(d.getTime()) ? fecha : d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Componente de campo corporativo
const CampoCorporate = ({ label, value }) => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '11px', color: '#1a5fa8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</label>
        <input
            type="text"
            readOnly
            value={value || ''}
            style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '7px 10px',
                borderRadius: '3px',
                width: '100%',
                color: '#334155',
                fontSize: '13px',
                boxSizing: 'border-box'
            }}
        />
    </div>
);

// ─── Componente FichaIndividual ────────────────────────────────────
const FichaIndividual = ({ datos, onAnular, onSalir, onAceptar, onAdjuntar }) => {
    const subs = datos.subSolicitudes || datos.SubSolicitudes || [];
    const dataSourceDocumentos = datos.documentos || datos.Documentos || [];

    const confirmadaBD = subs.find(s => getEstado(s) === '3');
    const yaConfirmada = !!confirmadaBD;

    const [selectedId, setSelectedId] = useState(null);
    const activeId = yaConfirmada ? getId(confirmadaBD) : selectedId;

    const fileInputRef = useRef(null);

    const [isAnularModalOpen, setIsAnularModalOpen] = useState(false);
    const [tipoAnulacion, setTipoAnulacion] = useState("");
    const [motivoAnulacion, setMotivoAnulacion] = useState("");

    const ejecutarAnulacion = async () => {
        if (!tipoAnulacion) return notify('Debes seleccionar un Tipo de Anulación', 'warning', 2000);
        await onAnular({ tipoAnulacion, motivoAnulacion });
        setIsAnularModalOpen(false);
        setSelectedId(null);
        setTipoAnulacion("");
        setMotivoAnulacion("");
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
                        <SelectBox height={90} value={motivoAnulacion} onValueChanged={(e) => setMotivoAnulacion(e.value)} />
                    </div>
                    <button onClick={ejecutarAnulacion} className="ficha-btn-danger" style={{ width: '100%' }}>Confirmar Anulación</button>
                </div>
            </Popup>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '14px 25px', borderBottom: '1px solid #e2e8f0', marginBottom: '25px' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>Ficha Gestión Demanda</span>
                <div style={{ display: 'flex', gap: '6px' }}>

                    {!yaConfirmada && selectedId && (
                        <button onClick={() => onAceptar(selectedId)} style={{ backgroundColor: '#81c784', color: '#fff', border: '1px solid #71b774', borderRadius: '3px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                            <i className="dx-icon-check" style={{ fontSize: '14px' }}></i> Aceptar Oferta
                        </button>
                    )}

                    <button onClick={() => setIsAnularModalOpen(true)} style={{ backgroundColor: '#e57373', color: '#fff', border: '1px solid #d56363', borderRadius: '3px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                        <i className="dx-icon-trash" style={{ fontSize: '14px' }}></i> Anular
                    </button>

                    <button onClick={() => window.print()} style={{ backgroundColor: '#428bca', color: '#fff', border: '1px solid #357ebd', borderRadius: '3px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                        <i className="dx-icon-print" style={{ fontSize: '14px' }}></i> Imprimir Ficha
                    </button>

                    <button onClick={onSalir} style={{ backgroundColor: '#428bca', color: '#fff', border: '1px solid #357ebd', borderRadius: '3px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                        <i className="dx-icon-clear" style={{ fontSize: '14px' }}></i> Salir
                    </button>
                </div>
            </div>

            <div style={{ padding: '0 25px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <CampoCorporate label="Mutua Solicitante" value={get(datos, 'mutuaSolicitante')} />
                    <CampoCorporate label="Demanda ID" value={get(datos, 'demandaId')} />
                    <CampoCorporate label="Mutua Ofertante" value={get(datos, 'mutuaOfertante')} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <CampoCorporate label="Centro" value={get(datos, 'centro')} />
                    <CampoCorporate label="Especialidad" value={get(datos, 'especialidad')} />
                    <CampoCorporate label="Servicio" value={get(datos, 'servicio')} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <CampoCorporate label="Localidad" value={get(datos, 'localidad')} />
                    <CampoCorporate label="Provincia" value={get(datos, 'provincia')} />
                    <CampoCorporate label="Estado" value={get(datos, 'estado')} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                    <CampoCorporate label="Año" value={get(datos, 'año') || (get(datos, 'fechaSolicitud') ? new Date(get(datos, 'fechaSolicitud')).getFullYear() : '')} />
                    <CampoCorporate label="Fecha Solicitud" value={fmt(get(datos, 'fechaSolicitud'))} />
                    <CampoCorporate label="Fecha Asignación" value={fmt(get(datos, 'fechaAsignacion'))} />
                </div>

                <div style={{ overflowX: 'auto', marginBottom: 25 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '10px', borderRight: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', background: '#1a5fa8', color: '#fff' }}></th>
                                {MESES_NOMBRES.map(mes => (
                                    <th key={mes} style={{ padding: '10px', borderRight: '1px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', fontWeight: 'bold', textAlign: 'center', background: '#1a5fa8', color: '#fff', textTransform: 'uppercase', fontSize: '11px' }}>{mes}</th>
                                ))}
                                <th style={{ padding: '10px', borderBottom: '2px solid #cbd5e1', fontWeight: 'bold', textAlign: 'center', background: '#1a5fa8', color: '#fff', textTransform: 'uppercase', fontSize: '11px' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '10px', borderRight: '1px solid #cbd5e1', fontWeight: 'bold', background: '#f8fafc', color: '#475569', textAlign: 'center', textTransform: 'uppercase', fontSize: '11px' }}>DEMANDA</td>
                                {MESES_KEYS.map(mes => {
                                    const val = get(datos, mes);
                                    return (
                                        <td key={mes} style={{ padding: '6px 8px', borderRight: '1px solid #cbd5e1', background: '#fff' }}>
                                            <input
                                                type="text"
                                                readOnly
                                                value={val !== undefined && val !== null ? val : 0}
                                                style={{ width: '100%', textAlign: 'right', border: '1px solid #cbd5e1', borderRadius: '3px', backgroundColor: '#f8fafc', padding: '4px 6px', boxSizing: 'border-box', color: '#334155', fontWeight: '500' }}
                                            />
                                        </td>
                                    );
                                })}
                                <td style={{ padding: '6px 8px', background: '#fff' }}>
                                    <input
                                        type="text"
                                        readOnly
                                        value={totalDemanda}
                                        style={{ width: '100%', textAlign: 'right', border: '1px solid #cbd5e1', borderRadius: '3px', backgroundColor: '#f8fafc', padding: '4px 6px', boxSizing: 'border-box', color: '#1a5fa8', fontWeight: 'bold' }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', borderBottom: '3px solid #1a5fa8', marginTop: '10px' }}>
                    <div style={{ background: '#1a5fa8', color: '#fff', padding: '6px 25px', fontSize: '12px', fontWeight: 'bold', marginBottom: '-3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Subsolicitudes
                    </div>
                </div>

                <div style={{ border: '1px solid #cbd5e1', borderTop: 'none', marginBottom: 30 }}>
                    <DataGrid
                        dataSource={subs}
                        keyExpr={d => getId(d)}
                        className="mz-table"
                        rowAlternationEnabled={true}
                        columnAutoWidth={true}
                        hoverStateEnabled={!yaConfirmada}
                        onRowClick={(e) => {
                            if (yaConfirmada) return;
                            const clickedId = getId(e.data);
                            setSelectedId(selectedId === clickedId ? null : clickedId);
                        }}
                        onRowPrepared={(e) => {
                            if (e.rowType === 'data') {
                                e.rowElement.style.cursor = 'pointer';

                                // Colorea de azul únicamente la subsolicitud marcada
                                if (activeId === getId(e.data)) {
                                    const celdas = e.rowElement.querySelectorAll('td');
                                    celdas.forEach(td => {
                                        td.style.setProperty('background-color', '#0056b3', 'important');
                                        td.style.setProperty('color', '#ffffff', 'important');
                                    });
                                }
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

                <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '11px', color: '#1a5fa8', textTransform: 'uppercase' }}>Necesidades para el Servicio</label>
                        <textarea
                            readOnly
                            value={get(datos, 'necesidadesServicio') || get(datos, 'descripcion') || ''}
                            style={{ height: '80px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px', color: '#334155', fontSize: '13px', resize: 'none', outline: 'none' }}
                        ></textarea>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '11px', color: '#1a5fa8', textTransform: 'uppercase' }}>Contestación a las necesidades para el servicio</label>
                        <textarea
                            readOnly
                            value={get(datos, 'plazos') || ''}
                            style={{ height: '80px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px', color: '#334155', fontSize: '13px', resize: 'none', outline: 'none' }}
                        ></textarea>
                    </div>
                </div>

                {/* Zona de Documentación Adjunta Interactiva */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                onAdjuntar(e.target.files[0]);
                            }
                            e.target.value = null;
                        }}
                    />
                    <button onClick={() => fileInputRef.current.click()} style={{ backgroundColor: '#428bca', color: '#fff', border: '1px solid #357ebd', borderRadius: '3px', padding: '6px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>Adjuntar</button>
                </div>

                <DataGrid
                    dataSource={dataSourceDocumentos}
                    className="mz-table"
                    rowAlternationEnabled={true}
                    hoverStateEnabled={true}
                    onRowClick={(e) => {
                        const nombreFisico = get(e.data, 'nombre');
                        if (nombreFisico) {
                            window.open(`${API}/ListaDemandas/documento/${nombreFisico}`, '_blank');
                        }
                    }}
                    onRowPrepared={(e) => {
                        if (e.rowType === 'data') {
                            // cursor interactivo
                            e.rowElement.style.cursor = 'pointer';
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

// ─── Componente Contenedor Principal ──────────────────────────
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

    const handleAceptar = async (subSolId) => {
        const res = await fetch(`${API}/ListaDemandas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                estadoId: 3,
                subSolId: subSolId
            })
        });
        if (res.ok) {
            notify('Oferta aceptada y rechazadas las competidoras', 'success', 2000);
            cargarDatos();
        } else {
            notify('Error al procesar la aceptación en el servidor', 'error', 3000);
        }
    };

    const handleAdjuntar = async (file) => {
        const formData = new FormData();
        formData.append("fichero", file);

        const res = await fetch(`${API}/ListaDemandas/${id}/adjuntar`, {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            notify(`Subido y verificado con éxito: ${file.name}`, 'success', 2000);
            cargarDatos();
        } else {
            const errorData = await res.json();
            notify(errorData.error || 'Error al validar el archivo', 'error', 4000);
        }
    };

    if (cargando) return <div>Cargando...</div>;
    return (datos?.tipoId === 2 || datos?.TipoId === 2)
        ? <FichaIndividual
            datos={datos}
            onAnular={handleAnular}
            onSalir={() => navigate(-1)}
            onAceptar={handleAceptar}
            onAdjuntar={handleAdjuntar}
        />
        : <div>Ficha Anual</div>;
};

export default FichaDemanda;