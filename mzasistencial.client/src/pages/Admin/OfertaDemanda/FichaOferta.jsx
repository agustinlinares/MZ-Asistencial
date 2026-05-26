import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataGrid, {
    Column, FilterRow, HeaderFilter, Scrolling, Sorting, Paging, Pager,
} from "devextreme-react/data-grid";
import { confirm as dxConfirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { useTranslation } from "react-i18next";
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

const Campo = ({ label, value, readOnly = true }) => (
    <div className="ficha-field">
        <label>{label}</label>
        <input type="text" readOnly={readOnly} value={value || ''} style={{ background: readOnly ? '#f5f5f5' : '#fff' }} />
    </div>
);

// ─── Ficha Anual ─────────────────────────────────────────────────────────────
const FichaAnual = ({ datos, estados, onGuardar, onSalir }) => {
    const [form, setForm] = useState(datos);

    useEffect(() => { setForm(datos); }, [datos]);

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const totalAsig = MESES.reduce((s, m) => s + (form[m] || 0), 0);
    const totalDem = MESES.reduce((s, m) => s + (form[`demanda${m.charAt(0).toUpperCase() + m.slice(1)}`] || 0), 0);

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                {/* Header */}
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">Ficha Gestión Oferta</span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={() => onGuardar(form)}>Guardar</button>
                        <button className="ficha-btn-secondary" onClick={onSalir}>Salir</button>
                    </div>
                </div>

                <div style={{ padding: 24 }}>
                    {/* Fila 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                        <Campo label="ID Demanda" value={form.demandaId} />
                        <Campo label="Mutua Ofertante" value={form.mutuaOferta} />
                        <Campo label="Centro" value={form.centro} />
                        <Campo label="Especialidad" value={form.especialidad} />
                        <Campo label="Servicio" value={form.servicio} />
                        <Campo label="Localidad" value={form.localidad} />
                        <Campo label="Provincia" value={form.provincia} />
                        <Campo label="Dirección Centro" value={form.direccionCentro} />
                        <Campo label="Teléfono" value={form.telefono} />
                        <Campo label="Fecha Solicitud" value={fmt(form.fechaSolicitud)} />
                        <Campo label="Fecha Asignación" value={fmt(form.fechaAsignacion)} />
                        <Campo label="Fecha Confirmación" value={fmt(form.fechaConfirmacion)} />
                    </div>

                    {/* Estado — editable */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                        <div className="ficha-field">
                            <label>Estado Demanda</label>
                            <select
                                value={form.estadoId || ''}
                                onChange={e => set('estadoId', parseInt(e.target.value))}
                            >
                                {(estados || []).filter(e => e.estadoId !== null).map(e => (
                                    <option key={e.estadoId} value={e.estadoId}>{e.estado}</option>
                                ))}
                            </select>
                        </div>
                        <div className="ficha-field">
                            <label>Nota Contestación</label>
                            <input type="text" value={form.notaContestacion || ''}
                                onChange={e => set('notaContestacion', e.target.value)} />
                        </div>
                    </div>

                    {/* Tabla meses */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr style={{ background: '#1a5fa8', color: '#fff' }}>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', width: 160 }}></th>
                                    {MESES_LABEL.map(m => (
                                        <th key={m} style={{ padding: '8px 6px', textAlign: 'center', minWidth: 70 }}>{m}</th>
                                    ))}
                                    <th style={{ padding: '8px 6px', textAlign: 'center', width: 70 }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: '#dbeafe' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1a5fa8' }}>ASIGNACION TOTAL</td>
                                    {MESES.map(m => (
                                        <td key={m} style={{ padding: '4px 6px', textAlign: 'center' }}>
                                            <input
                                                type="number" min={0}
                                                value={form[m] ?? 0}
                                                onChange={e => set(m, parseInt(e.target.value) || 0)}
                                                style={{ width: 55, textAlign: 'center', border: '1px solid #ccc', borderRadius: 3, padding: '2px 4px' }}
                                            />
                                        </td>
                                    ))}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700 }}>{totalAsig}</td>
                                </tr>
                                <tr style={{ background: '#eff6ff' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#555' }}>DEMANDA TOTAL</td>
                                    {MESES.map(m => {
                                        const key = `demanda${m.charAt(0).toUpperCase() + m.slice(1)}`;
                                        return (
                                            <td key={m} style={{ padding: '8px 6px', textAlign: 'center', color: '#555' }}>
                                                {form[key] ?? 0}
                                            </td>
                                        );
                                    })}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#555' }}>{totalDem}</td>
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
const FichaIndividual = ({ datos, estados, onGuardar, onSalir }) => {
    const [form, setForm] = useState(datos);
    const [tabActiva, setTab] = useState('individual');

    useEffect(() => { setForm(datos); }, [datos]);

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const totalAsig = MESES.reduce((s, m) => s + (form[m] || 0), 0);
    const totalDem = MESES.reduce((s, m) => s + (form[`demanda${m.charAt(0).toUpperCase() + m.slice(1)}`] || 0), 0);

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                {/* Header */}
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">Ficha Gestión Oferta</span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={() => onGuardar(form)}>Guardar</button>
                        <button className="ficha-btn-secondary" onClick={onSalir}>Salir</button>
                    </div>
                </div>

                <div style={{ padding: 24 }}>
                    {/* Campos descriptivos */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                        <Campo label="Mutua Ofertante" value={form.mutuaOferta} />
                        <Campo label="Centro" value={form.centro} />
                        <Campo label="Especialidad" value={form.especialidad} />
                        <Campo label="Servicio" value={form.servicio} />
                        <div className="ficha-field">
                            <label>Estado</label>
                            <select
                                value={form.estadoId || ''}
                                onChange={e => set('estadoId', parseInt(e.target.value))}
                            >
                                {(estados || []).filter(e => e.estadoId !== null).map(e => (
                                    <option key={e.estadoId} value={e.estadoId}>{e.estado}</option>
                                ))}
                            </select>
                        </div>
                        <div className="ficha-field">
                            <label>Nota Contestación</label>
                            <input type="text" value={form.notaContestacion || ''}
                                onChange={e => set('notaContestacion', e.target.value)} />
                        </div>
                    </div>

                    {/* Tabla meses */}
                    <div style={{ overflowX: 'auto', marginBottom: 24 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                                <tr style={{ background: '#1a5fa8', color: '#fff' }}>
                                    <th style={{ padding: '8px 12px', textAlign: 'left', width: 160 }}></th>
                                    {MESES_LABEL.map(m => (
                                        <th key={m} style={{ padding: '8px 6px', textAlign: 'center', minWidth: 70 }}>{m}</th>
                                    ))}
                                    <th style={{ padding: '8px 6px', textAlign: 'center', width: 70 }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: '#dbeafe' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1a5fa8' }}>ASIGNACION TOTAL</td>
                                    {MESES.map(m => (
                                        <td key={m} style={{ padding: '4px 6px', textAlign: 'center' }}>
                                            <input
                                                type="number" min={0}
                                                value={form[m] ?? 0}
                                                onChange={e => set(m, parseInt(e.target.value) || 0)}
                                                style={{ width: 55, textAlign: 'center', border: '1px solid #ccc', borderRadius: 3, padding: '2px 4px' }}
                                            />
                                        </td>
                                    ))}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700 }}>{totalAsig}</td>
                                </tr>
                                <tr style={{ background: '#eff6ff' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#555' }}>DEMANDA TOTAL</td>
                                    {MESES.map(m => {
                                        const key = `demanda${m.charAt(0).toUpperCase() + m.slice(1)}`;
                                        return (
                                            <td key={m} style={{ padding: '8px 6px', textAlign: 'center', color: '#555' }}>
                                                {form[key] ?? 0}
                                            </td>
                                        );
                                    })}
                                    <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 700, color: '#555' }}>{totalDem}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Pestañas */}
                    <div style={{ borderBottom: '2px solid #1a5fa8', display: 'flex', marginBottom: 16 }}>
                        {['anual', 'individual'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setTab(tab)}
                                style={{
                                    padding: '8px 24px', border: 'none', cursor: 'pointer',
                                    background: tabActiva === tab ? '#1a5fa8' : '#f0f4ff',
                                    color: tabActiva === tab ? '#fff' : '#1a5fa8',
                                    fontWeight: 600, fontSize: 13, borderRadius: '4px 4px 0 0',
                                    marginRight: 4,
                                }}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Grid subsolicitudes */}
                    {tabActiva === 'individual' && (
                        <DataGrid
                            dataSource={form.subSolicitudes || []}
                            keyExpr="subSolId"
                            showBorders={true}
                            columnAutoWidth={false}
                            allowColumnResizing={true}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            noDataText="Sin subsolicitudes"
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} allowedPageSizes={[10, 25]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            <FilterRow visible={true} />
                            <HeaderFilter visible />
                            <Sorting mode="multiple" />

                            <Column dataField="mutuaOfertante" caption="Mutua Ofertante" width={160} />
                            <Column dataField="centro" caption="Centro" width={180} />
                            <Column dataField="contestacion" caption="Contestación" width={150} />
                            <Column dataField="contestacionPlazos" caption="Contest. Plazos" width={130} />
                            <Column dataField="fechaSolicitud" caption="Fecha Solicitud" width={140} dataType="datetime" format="dd/MM/yyyy HH:mm" />
                            <Column dataField="fechaAsignacion" caption="Fecha Asignación" width={140} dataType="datetime" format="dd/MM/yyyy HH:mm" />
                            <Column dataField="fechaConfirmacion" caption="Fecha Confirmación" width={140} dataType="datetime" format="dd/MM/yyyy HH:mm" />
                            <Column dataField="ene" caption="Ene" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="feb" caption="Feb" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="mar" caption="Mar" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="abr" caption="Abr" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="may" caption="May" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="jun" caption="Jun" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="jul" caption="Jul" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="ago" caption="Ago" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="sep" caption="Sep" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="oct" caption="Oct" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="nov" caption="Nov" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="dic" caption="Dic" width={50} alignment="center" allowFiltering={false} />
                            <Column dataField="total" caption="Total" width={70} alignment="center" allowFiltering={false} />
                            <Column dataField="estado" caption="Estado" width={130} />
                        </DataGrid>
                    )}

                    {tabActiva === 'anual' && (
                        <div style={{ padding: 20, color: '#888', fontSize: 13 }}>
                            Vista anual — sin subsolicitudes individuales.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const FichaOferta = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    useTranslation();

    const [datos, setDatos] = useState(null);
    const [estados, setEstados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Cargar estados
        fetch(`${API}/ListaOfertas/estados`)
            .then(r => r.json())
            .then(data => setEstados([{ estadoId: null, estado: 'Todas' }, ...data]))
            .catch(() => { });

        // Cargar ficha
        fetch(`${API}/ListaOfertas/${id}`)
            .then(r => {
                if (!r.ok) throw new Error('No encontrado');
                return r.json();
            })
            .then(data => setDatos(data))
            .catch(err => setError(err.message))
            .finally(() => setCargando(false));
    }, [id]);

    const handleGuardar = async (form) => {
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
                if (r.ok) {
                    notify('Oferta guardada correctamente', 'success', 2000);
                    navigate(-1);
                } else {
                    notify('Error al guardar la oferta', 'error', 3000);
                }
            })
            .catch(() => notify('Error de conexión', 'error', 3000));
    };

    const handleSalir = () => navigate(-1);

    if (cargando) return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Cargando ficha...</div>;
    if (error) return <div style={{ padding: 40, textAlign: 'center', color: '#c62828' }}>Error: {error}</div>;
    if (!datos) return null;

    // TipoId 2 = Individual, 1 = Anual (o null = Anual por defecto)
    return datos.tipoId === 2
        ? <FichaIndividual datos={datos} estados={estados} onGuardar={handleGuardar} onSalir={handleSalir} />
        : <FichaAnual datos={datos} estados={estados} onGuardar={handleGuardar} onSalir={handleSalir} />;
};

export default FichaOferta;