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

const taStyle = (editable = false) => ({
    width: '100%',
    background: editable ? '#fff' : '#e8f0fe',
    border: '1px solid #c0d0f0',
    borderRadius: 4, padding: 8, fontSize: 12,
    resize: 'vertical', fontFamily: 'inherit', color: '#1a2a4a'
});

const FichaOfertaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [datos, setDatos] = useState(null);
    const [estados, setEstados] = useState([]);
    const [form, setForm] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    useEffect(() => {
        fetch(`${API}/ListaOfertas/estados`)
            .then(r => r.json())
            .then(data => setEstados([{ estadoId: null, estado: 'Todas' }, ...data]))
            .catch(() => { });

        fetch(`${API}/ListaOfertas/${id}`)
            .then(r => { if (!r.ok) throw new Error('No encontrado'); return r.json(); })
            .then(data => { setDatos(data); setForm(data); })
            .catch(err => setError(err.message))
            .finally(() => setCargando(false));
    }, [id]);

    const handleGuardar = async () => {
        if (form.estadoId === 3) {
            const ok = await dxConfirm(
                '¿Seguro que desea confirmar esta oferta? El resto de subsolicitudes quedarán rechazadas.',
                'Confirmar asignación'
            );
            if (!ok) return;
        }
        if (form.estadoId === 8) {
            const ok = await dxConfirm(
                '¿Seguro que desea rechazar esta oferta? Todas las subsolicitudes quedarán rechazadas.',
                'Confirmar rechazo'
            );
            if (!ok) return;
        }

        fetch(`${API}/ListaOfertas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                estadoId: form.estadoId,
                notaContestacion: form.notaContestacion,
                contestacionPlazos: form.contestacionPlazos,
                ene: form.ene, feb: form.feb, mar: form.mar,
                abr: form.abr, may: form.may, jun: form.jun,
                jul: form.jul, ago: form.ago, sep: form.sep,
                oct: form.oct, nov: form.nov, dic: form.dic,
            }),
        })
            .then(r => {
                if (r.ok) { notify('Oferta guardada correctamente', 'success', 2000); navigate(-1); }
                else notify('Error al guardar la oferta', 'error', 3000);
            })
            .catch(() => notify('Error de conexión', 'error', 3000));
    };

    if (cargando) return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Cargando ficha...</div>;
    if (error) return <div style={{ padding: 40, textAlign: 'center', color: '#c62828' }}>Error: {error}</div>;
    if (!datos || !form) return null;

    const totalAsig = MESES.reduce((s, m) => s + (form[m] || 0), 0);
    const totalDem = MESES.reduce((s, m) => s + (form[`demanda${m.charAt(0).toUpperCase() + m.slice(1)}`] || 0), 0);

    return (
        <div
            className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0"
            style={{ overflowY: 'auto', height: '100%' }}
        >
            <div className="file-box" style={{ height: 'auto', minHeight: 0 }}>

                {/* HEADER */}
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">Ficha</span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-secondary" onClick={() => window.print()}>
                            <i className="ri-printer-line" style={{ marginRight: 6 }} />Imprimir Ficha
                        </button>
                        <button className="ficha-btn-primary" onClick={handleGuardar}>Guardar</button>
                        <button className="ficha-btn-secondary" onClick={() => navigate(-1)}>
                            <i className="ri-close-line" style={{ marginRight: 6 }} />Salir
                        </button>
                    </div>
                </div>

                <div style={{ padding: 24 }}>

                    {/* FILA 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                        <Campo label="Mutua Solicitante" value={datos.mutuaSolicitante} />
                        <Campo label="Demanda ID" value={datos.demandaId} />
                        <Campo label="Mutua Ofertante" value={datos.mutuaOferta} />
                    </div>

                    {/* FILA 2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                        <Campo label="Centro" value={datos.centro} />
                        <Campo label="Especialidad" value={datos.especialidad} />
                        <Campo label="Servicio" value={datos.servicio} />
                    </div>

                    {/* FILA 3 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                        <Campo label="Localidad" value={datos.localidad} />
                        <Campo label="Provincia" value={datos.provincia} />
                        <div className="ficha-field">
                            <label>Estado</label>
                            <select value={form.estadoId || ''} onChange={e => set('estadoId', parseInt(e.target.value))}>
                                {estados.filter(e => e.estadoId !== null).map(e => (
                                    <option key={e.estadoId} value={e.estadoId}>{e.estado}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* FILA 4 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                        <Campo label="Año" value={datos.año} />
                        <Campo label="Fecha Solicitud" value={fmt(datos.fechaSolicitud)} />
                        <Campo label="Fecha Asignacion" value={fmt(datos.fechaAsignacion)} />
                    </div>

                    {/* TABLA MESES */}
                    <div style={{ overflowX: 'auto', marginBottom: 24 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr style={{ background: '#1a5fa8', color: '#fff' }}>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', width: 150 }}></th>
                                    {MESES_LABEL.map(m => (
                                        <th key={m} style={{ padding: '8px 6px', textAlign: 'center', minWidth: 55 }}>{m}</th>
                                    ))}
                                    <th style={{ padding: '8px 6px', textAlign: 'center', width: 65 }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* DEMANDA */}
                                <tr style={{ background: '#eff6ff' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#555' }}>DEMANDA</td>
                                    {MESES.map(m => {
                                        const key = `demanda${m.charAt(0).toUpperCase() + m.slice(1)}`;
                                        return (
                                            <td key={m} style={{ padding: '8px 6px', textAlign: 'center' }}>
                                                <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '2px 6px', textAlign: 'center', fontSize: 11 }}>
                                                    {form[key] ?? 0}
                                                </div>
                                            </td>
                                        );
                                    })}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#555' }}>{totalDem}</td>
                                </tr>
                                {/* ASIGNACION TOTAL */}
                                <tr style={{ background: '#dbeafe' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1a5fa8' }}>ASIGNACION TOTAL</td>
                                    {MESES.map(m => (
                                        <td key={m} style={{ padding: '8px 6px', textAlign: 'center' }}>
                                            <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '2px 6px', textAlign: 'center', fontSize: 11 }}>
                                                {form[m] ?? 0}
                                            </div>
                                        </td>
                                    ))}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700 }}>{totalAsig}</td>
                                </tr>
                                {/* ASIGNAR — editable */}
                                <tr style={{ background: '#f0fdf4' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#2e7d32' }}>ASIGNAR</td>
                                    {MESES.map(m => (
                                        <td key={m} style={{ padding: '8px 6px', textAlign: 'center' }}>
                                            <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '2px 6px', textAlign: 'center', fontSize: 11 }}>
                                                {form[m] ?? 0}
                                            </div>
                                        </td>
                                    ))}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#2e7d32' }}>{totalAsig}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* NECESIDADES + CONTESTACIÓN */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
                        <div className="ficha-field">
                            <label style={{ fontWeight: 700, color: '#1a5fa8' }}>Necesidades para el Servicio</label>
                            <textarea readOnly value={datos.descripcion || ''} rows={3} style={taStyle(false)} />
                        </div>
                        <div className="ficha-field">
                            <label style={{ fontWeight: 700, color: '#1a5fa8' }}>Contestación a las Necesidades para el Servicio</label>
                            <textarea value={form.notaContestacion || ''} onChange={e => set('notaContestacion', e.target.value)} rows={3} style={taStyle(true)} />
                        </div>
                    </div>

                    {/* PLAZOS + CONTESTACIÓN PLAZOS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                        <div className="ficha-field">
                            <label style={{ fontWeight: 700, color: '#1a5fa8' }}>Plazos</label>
                            <textarea readOnly value={datos.plazos || ''} rows={3} style={taStyle(false)} />
                        </div>
                        <div className="ficha-field">
                            <label style={{ fontWeight: 700, color: '#1a5fa8' }}>Contestación a los Plazos</label>
                            <textarea value={form.contestacionPlazos || ''} onChange={e => set('contestacionPlazos', e.target.value)} rows={3} style={taStyle(true)} />
                        </div>
                    </div>

                    {/* DOCUMENTOS */}
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
                        width="100%"
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

export default FichaOfertaDetalle;