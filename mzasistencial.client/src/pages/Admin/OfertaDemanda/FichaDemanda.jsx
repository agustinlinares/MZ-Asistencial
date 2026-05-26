import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataGrid, {
    Column, FilterRow, HeaderFilter, Scrolling, Sorting, Paging, Pager,
} from "devextreme-react/data-grid";
import { confirm as dxConfirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import '../../../styles/FichaGlobal.css';

const API = '/api';
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_LABEL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const fmt = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const Campo = ({ label, value }) => (
    <div className="ficha-field">
        <label>{label}</label>
        <input type="text" readOnly value={value || ''} style={{ background: '#f5f5f5' }} />
    </div>
);

// ─── Ficha Anual ─────────────────────────────────────────────────────────────
const FichaAnual = ({ datos, onImprimir, onSalir }) => {
    const totalDemanda = MESES.reduce((s, m) => s + (datos[m] || 0), 0);
    const totalOferta = MESES.reduce((s, m) => s + (datos[`oferta${m.charAt(0).toUpperCase() + m.slice(1)}`] || 0), 0);

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                {/* Header */}
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">Ficha Gestión Demanda</span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-secondary" onClick={onImprimir}>
                            <i className="ri-printer-line" style={{ marginRight: 6 }} />
                            Imprimir Ficha
                        </button>
                        <button className="ficha-btn-secondary" onClick={onSalir}>
                            <i className="ri-close-line" style={{ marginRight: 6 }} />
                            Salir
                        </button>
                    </div>
                </div>

                <div style={{ padding: 24 }}>
                    {/* Fila 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                        <Campo label="ID Demanda" value={datos.demandaId} />
                        <Campo label="Mutua Ofertante" value={datos.mutuaOfertante} />
                        <Campo label="Centro" value={datos.centro} />
                        <Campo label="Especialidad" value={datos.especialidad} />
                        <Campo label="Servicio" value={datos.servicio} />
                        <Campo label="Localidad" value={datos.localidad} />
                        <Campo label="Provincia" value={datos.provincia} />
                        <Campo label="Dirección Centro" value={datos.direccionCentro} />
                        <Campo label="Teléfono" value={datos.telefono} />
                        <Campo label="Fecha Solicitud" value={fmt(datos.fechaSolicitud)} />
                        <Campo label="Fecha Asignación" value={fmt(datos.fechaAsignacion)} />
                        <Campo label="Fecha Confirmación" value={fmt(datos.fechaConfirmacion)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 24 }}>
                        <Campo label="Estado Demanda" value={datos.estado} />
                    </div>

                    {/* Tabla meses */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr style={{ background: '#1a5fa8', color: '#fff' }}>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', width: 130 }}></th>
                                    {MESES_LABEL.map(m => (
                                        <th key={m} style={{ padding: '8px 6px', textAlign: 'center', minWidth: 65 }}>{m}</th>
                                    ))}
                                    <th style={{ padding: '8px 6px', textAlign: 'center', width: 70 }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: '#dbeafe' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1a5fa8' }}>DEMANDA</td>
                                    {MESES.map(m => (
                                        <td key={m} style={{ padding: '8px 6px', textAlign: 'center' }}>
                                            <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '2px 4px', textAlign: 'center', fontSize: 11, minWidth: 40 }}>
                                                {datos[m] ?? 0}
                                            </div>
                                        </td>
                                    ))}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700 }}>{totalDemanda}</td>
                                </tr>
                                <tr style={{ background: '#eff6ff' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#555' }}>OFERTA OFRECIDA</td>
                                    {MESES.map(m => {
                                        const key = `oferta${m.charAt(0).toUpperCase() + m.slice(1)}`;
                                        return (
                                            <td key={m} style={{ padding: '8px 6px', textAlign: 'center' }}>
                                                <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '2px 4px', textAlign: 'center', fontSize: 11, minWidth: 40 }}>
                                                    {datos[key] ?? 0}
                                                </div>
                                            </td>
                                        );
                                    })}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#555' }}>{totalOferta}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Ficha Individual ─────────────────────────────────────────────────────────
const FichaIndividual = ({ datos, onAnular, onImprimir, onAceptar, onRechazar, onSalir }) => {
    const totalDemanda = MESES.reduce((s, m) => s + (datos[m] || 0), 0);

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                {/* Header */}
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">Ficha Gestión Demanda</span>
                    <div className="ficha-header-btns">
                        <button
                            onClick={onAnular}
                            style={{ background: '#c62828', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                        >
                            <i className="ri-delete-bin-line" style={{ marginRight: 6 }} />
                            Anular
                        </button>
                        <button className="ficha-btn-secondary" onClick={onImprimir}>
                            <i className="ri-printer-line" style={{ marginRight: 6 }} />
                            Imprimir Ficha
                        </button>
                        <button className="ficha-btn-primary" onClick={onAceptar}>Aceptar</button>
                        <button className="ficha-btn-secondary" onClick={onRechazar}>Rechazar cita</button>
                        <button className="ficha-btn-secondary" onClick={onSalir}>
                            <i className="ri-close-line" style={{ marginRight: 6 }} />
                            Salir
                        </button>
                    </div>
                </div>

                <div style={{ padding: 24 }}>
                    {/* Campos */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                        <Campo label="ID Demanda" value={datos.demandaId} />
                        <Campo label="Especialidad" value={datos.especialidad} />
                        <Campo label="Servicio" value={datos.servicio} />
                        <Campo label="Localidad" value={datos.localidad} />
                        <Campo label="Fecha Solicitud" value={fmt(datos.fechaSolicitud)} />
                        <Campo label="Fecha Confirmación" value={fmt(datos.fechaConfirmacion)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 24 }}>
                        <Campo label="Estado Demanda" value={datos.estado} />
                    </div>

                    {/* Tabla meses */}
                    <div style={{ overflowX: 'auto', marginBottom: 24 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr style={{ background: '#1a5fa8', color: '#fff' }}>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', width: 120 }}></th>
                                    {MESES_LABEL.map(m => (
                                        <th key={m} style={{ padding: '8px 6px', textAlign: 'center', minWidth: 65 }}>{m}</th>
                                    ))}
                                    <th style={{ padding: '8px 6px', textAlign: 'center', width: 70 }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: '#dbeafe' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1a5fa8' }}>DEMANDA</td>
                                    {MESES.map(m => (
                                        <td key={m} style={{ padding: '8px 6px', textAlign: 'center' }}>
                                            <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '2px 4px', textAlign: 'center', fontSize: 11, minWidth: 40 }}>
                                                {datos[m] ?? 0}
                                            </div>
                                        </td>
                                    ))}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700 }}>{totalDemanda}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Grid Subsolicitudes */}
                    <div style={{ background: '#1a5fa8', color: '#fff', padding: '6px 16px', fontWeight: 700, fontSize: 13, borderRadius: '4px 4px 0 0', display: 'inline-block', marginBottom: 0 }}>
                        Subsolicitudes
                    </div>
                    <div style={{ marginBottom: 24, border: '1px solid #1a5fa8' }}>
                        <DataGrid
                            dataSource={datos.subSolicitudes || []}
                            keyExpr="subSolId"
                            showBorders={false}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            width="100%"
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            noDataText="Sin subsolicitudes"
                            onRowPrepared={(e) => {
                                if (e.rowType === 'data' && e.data.estadoId === 3) {
                                    e.rowElement.style.background = '#dbeafe';
                                    e.rowElement.style.fontWeight = '600';
                                }
                            }}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} allowedPageSizes={[10, 25]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            <FilterRow visible={true} />
                            <HeaderFilter visible />
                            <Sorting mode="multiple" />
                            <Column dataField="mutuaOfertante" caption="Mutua Ofertante" minWidth={120} />
                            <Column dataField="centro" caption="Centro" minWidth={130} />
                            <Column dataField="contestacion" caption="Contestación" minWidth={100} />
                            <Column dataField="contestacionPlazos" caption="Contest. Plazos" minWidth={100} />
                            <Column dataField="fechaAsignacion" caption="Fecha Asig." minWidth={110} dataType="datetime" format="dd/MM/yyyy HH:mm" />
                            <Column dataField="fechaConfirmacion" caption="Fecha Conf." minWidth={110} dataType="datetime" format="dd/MM/yyyy HH:mm" />
                            <Column dataField="ene" caption="Ene" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="feb" caption="Feb" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="mar" caption="Mar" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="abr" caption="Abr" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="may" caption="May" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="jun" caption="Jun" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="jul" caption="Jul" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="ago" caption="Ago" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="sep" caption="Sep" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="oct" caption="Oct" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="nov" caption="Nov" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="dic" caption="Dic" width={40} alignment="center" allowFiltering={false} />
                            <Column dataField="total" caption="Total" width={55} alignment="center" allowFiltering={false} />
                        </DataGrid>
                    </div>

                    {/* Necesidades + Plazos */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                        <div className="ficha-field">
                            <label style={{ fontWeight: 700, color: '#1a5fa8' }}>Necesidades para el Servicio</label>
                            <textarea readOnly value={datos.descripcion || ''} rows={4}
                                style={{ width: '100%', background: '#e8f0fe', border: '1px solid #c0d0f0', borderRadius: 4, padding: 8, fontSize: 12, resize: 'vertical', fontFamily: 'inherit', color: '#1a2a4a' }}
                            />
                        </div>
                        <div className="ficha-field">
                            <label style={{ fontWeight: 700, color: '#1a5fa8' }}>Plazos</label>
                            <textarea readOnly value={datos.plazos || ''} rows={4}
                                style={{ width: '100%', background: '#e8f0fe', border: '1px solid #c0d0f0', borderRadius: 4, padding: 8, fontSize: 12, resize: 'vertical', fontFamily: 'inherit', color: '#1a2a4a' }}
                            />
                        </div>
                    </div>

                    {/* Grid Documentos */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                        <button
                            onClick={() => notify('Funcionalidad de adjuntar pendiente de implementar', 'info', 2000)}
                            style={{ background: '#1a5fa8', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                        >
                            Adjuntar
                        </button>
                    </div>
                    <DataGrid
                        dataSource={datos.documentos || []}
                        keyExpr="documentoId"
                        showBorders={true}
                        columnAutoWidth={false}
                        allowColumnResizing={true}
                        className="mz-table"
                        rowAlternationEnabled={true}
                        showRowLines={true}
                        noDataText="Sin documentos adjuntos"
                    >
                        <Scrolling mode="standard" showScrollbar="always" />
                        <Paging defaultPageSize={10} />
                        <Pager visible={true} allowedPageSizes={[10, 25]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                        <FilterRow visible={true} />
                        <HeaderFilter visible />
                        <Sorting mode="multiple" />
                        <Column dataField="nombreDocumento" caption="Fichero" width={220} />
                        <Column dataField="mutua" caption="Mutua" width={200} />
                        <Column dataField="usuario" caption="Usuario" width={150} />
                        <Column dataField="fechaAlta" caption="Fecha" width={140} dataType="datetime" format="dd/MM/yyyy HH:mm" />
                    </DataGrid>
                </div>
            </div>
        </div>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const FichaDemanda = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API}/ListaDemandas/${id}`)
            .then(r => {
                if (!r.ok) throw new Error('No encontrado');
                return r.json();
            })
            .then(data => setDatos(data))
            .catch(err => setError(err.message))
            .finally(() => setCargando(false));
    }, [id]);

    const cambiarEstado = async (estadoId) => {
        const res = await fetch(`${API}/ListaDemandas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estadoId }),
        });
        if (res.ok) {
            notify('Demanda actualizada correctamente', 'success', 2000);
            navigate(-1);
        } else {
            notify('Error al actualizar la demanda', 'error', 3000);
        }
    };

    const handleAnular = async () => {
        const ok = await dxConfirm('¿Seguro que desea anular esta demanda?', 'Confirmar anulación');
        if (ok) await cambiarEstado(9);
    };
    const handleAceptar = async () => {
        const ok = await dxConfirm('¿Seguro que desea aceptar esta demanda?', 'Confirmar aceptación');
        if (ok) await cambiarEstado(3);
    };
    const handleRechazar = async () => {
        const ok = await dxConfirm('¿Seguro que desea rechazar esta demanda?', 'Confirmar rechazo');
        if (ok) await cambiarEstado(8);
    };
    const handleImprimir = () => window.print();
    const handleSalir = () => navigate(-1);

    if (cargando) return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Cargando ficha...</div>;
    if (error) return <div style={{ padding: 40, textAlign: 'center', color: '#c62828' }}>Error: {error}</div>;
    if (!datos) return null;

    // TipoId 1 = Anual, 2 = Individual
    return datos.tipoId === 2
        ? <FichaIndividual datos={datos} onAnular={handleAnular} onImprimir={handleImprimir} onAceptar={handleAceptar} onRechazar={handleRechazar} onSalir={handleSalir} />
        : <FichaAnual datos={datos} onImprimir={handleImprimir} onSalir={handleSalir} />;
};

export default FichaDemanda;