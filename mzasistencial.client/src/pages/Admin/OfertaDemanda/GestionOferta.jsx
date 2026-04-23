import React, { useEffect, useRef, useState, useCallback } from "react";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import DataGrid, {
    Column,
    Paging,
    FilterRow,
    HeaderFilter,
    Selection,
    GroupPanel,
    Grouping,
    ColumnChooser,
    Export,
    Scrolling,
    Sorting,
    ColumnFixing,
    Pager,
    Toolbar,
    Item,
} from "devextreme-react/data-grid";
import DateBox from "devextreme-react/date-box";
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import RadioGroup from "devextreme-react/radio-group";
import { useTranslation } from "react-i18next";
import './Centros.css';

const API = 'http://localhost:5118/api';
const TIPOS = ['Todos', 'Anuales', 'Individuales'];
const VISTAS = ['Agrupada', 'Desagrupada'];

const onExporting = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Lista Ofertas');
    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ListaOfertas.xlsx');
        });
    });
    e.cancel = true;
};

const GestionOferta = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const buscarRef = useRef(null);

    const [tipo, setTipo] = useState('Todos');
    const [vista, setVista] = useState('Agrupada');
    const [añoSeleccionado, setAñoSeleccionado] = useState(null);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
    const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);

    const [fechaSolicitudDesde, setFechaSolicitudDesde] = useState(null);
    const [fechaSolicitudHasta, setFechaSolicitudHasta] = useState(null);
    const [fechaAsignacionDesde, setFechaAsignacionDesde] = useState(null);
    const [fechaAsignacionHasta, setFechaAsignacionHasta] = useState(null);
    const [fechaConfirmacionDesde, setFechaConfirmacionDesde] = useState(null);
    const [fechaConfirmacionHasta, setFechaConfirmacionHasta] = useState(null);
    const [necesidadesServicio, setNecesidadesServicio] = useState('');
    const [contestacionNecesidades, setContestacionNecesidades] = useState('');
    const [demandaId, setDemandaId] = useState('');

    const [años, setAños] = useState([]);
    const [estados, setEstados] = useState([]);
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(false);

    const ejecutarBusqueda = useCallback((filtros) => {
        fetch(`${API}/ListaOfertas/lista`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filtros),
        })
            .then(res => res.json())
            .then(data => setDatos(data))
            .catch(err => console.error('Error:', err))
            .finally(() => setCargando(false));
    }, []);

    const buscar = useCallback(() => {
        setCargando(true);
        ejecutarBusqueda({
            año: añoSeleccionado,
            estadoId: estadoSeleccionado,
            tipo: tipo === 'Todos' ? null : tipo,
            vistaAgrupada: vista === 'Agrupada',
            fechaSolicitudDesde: fechaSolicitudDesde || null,
            fechaSolicitudHasta: fechaSolicitudHasta || null,
            fechaAsignacionDesde: fechaAsignacionDesde || null,
            fechaAsignacionHasta: fechaAsignacionHasta || null,
            fechaConfirmacionDesde: fechaConfirmacionDesde || null,
            fechaConfirmacionHasta: fechaConfirmacionHasta || null,
            necesidadesServicio: necesidadesServicio || null,
            contestacionNecesidades: contestacionNecesidades || null,
            demandaId: demandaId ? parseInt(demandaId) : null,
        });
    }, [
        añoSeleccionado, estadoSeleccionado, tipo, vista,
        fechaSolicitudDesde, fechaSolicitudHasta,
        fechaAsignacionDesde, fechaAsignacionHasta,
        fechaConfirmacionDesde, fechaConfirmacionHasta,
        necesidadesServicio, contestacionNecesidades, demandaId,
        ejecutarBusqueda
    ]);

    // Guardar referencia actualizada de buscar
    useEffect(() => {
        buscarRef.current = buscar;
    }, [buscar]);

    // Carga inicial de combos
    useEffect(() => {
        fetch(`${API}/ListaOfertas/años`)
            .then(res => res.json())
            .then(data => {
                setAños(data);
                if (data.length > 0) setAñoSeleccionado(data[0]);
            })
            .catch(err => console.error('Error al cargar años:', err));

        fetch(`${API}/ListaOfertas/estados`)
            .then(res => res.json())
            .then(data => {
                const todos = [{ estadoId: null, estado: 'Todas' }, ...data];
                setEstados(todos);
                const estadoPendiente = data.find(e =>
                    e.estado?.toLowerCase().includes('pendiente asign')
                );
                setEstadoSeleccionado(estadoPendiente ? estadoPendiente.estadoId : null);
            })
            .catch(err => console.error('Error al cargar estados:', err));
    }, []);

    // Lanzar búsqueda cuando cambian filtros principales
    useEffect(() => {
        if (añoSeleccionado !== null) {
            buscarRef.current();
        }
    }, [añoSeleccionado, estadoSeleccionado, tipo]);

    const limpiarFiltros = () => {
        setFechaSolicitudDesde(null);
        setFechaSolicitudHasta(null);
        setFechaAsignacionDesde(null);
        setFechaAsignacionHasta(null);
        setFechaConfirmacionDesde(null);
        setFechaConfirmacionHasta(null);
        setNecesidadesServicio('');
        setContestacionNecesidades('');
        setDemandaId('');
    };

    return (
        <React.Fragment>
            <div
                className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 m-0 p-0"
                style={{ overflowY: 'auto', height: '100%' }}
            >
                <div className="file-box">
                    <div className="title">{t('LISTA OFERTAS')}</div>

                    <div style={{
                        padding: '12px 16px',
                        background: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        marginBottom: 8
                    }}>
                        {/* Fila 1: Tipo / Año / Estado */}
                        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Tipo</div>
                                <RadioGroup
                                    items={TIPOS}
                                    value={tipo}
                                    onValueChanged={e => setTipo(e.value)}
                                    layout="horizontal"
                                />
                            </div>
                            <div style={{ minWidth: 200 }}>
                                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Año</div>
                                <SelectBox
                                    items={años}
                                    value={añoSeleccionado}
                                    onValueChanged={e => setAñoSeleccionado(e.value)}
                                    placeholder="Selecciona un año"
                                    width={200}
                                />
                            </div>
                            <div style={{ minWidth: 220 }}>
                                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Estado</div>
                                <SelectBox
                                    dataSource={estados}
                                    displayExpr="estado"
                                    valueExpr="estadoId"
                                    value={estadoSeleccionado}
                                    onValueChanged={e => setEstadoSeleccionado(e.value)}
                                    placeholder="Selecciona un estado"
                                    width={220}
                                />
                            </div>
                        </div>

                        {/* Fila 2: Vista / Botón Filtros */}
                        <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Vista</div>
                                <RadioGroup
                                    items={VISTAS}
                                    value={vista}
                                    onValueChanged={e => setVista(e.value)}
                                    layout="horizontal"
                                />
                            </div>
                            <button
                                type="button"
                                className="boton-action"
                                style={{ marginTop: 16 }}
                                onClick={() => setFiltrosExpandidos(!filtrosExpandidos)}
                            >
                                {filtrosExpandidos ? '− Filtros' : '+ Filtros'}
                            </button>
                        </div>

                        {/* Filtros avanzados */}
                        {filtrosExpandidos && (
                            <div style={{
                                marginTop: 16,
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '12px 24px'
                            }}>
                                <div>
                                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Fecha Solicitud Desde</div>
                                    <DateBox value={fechaSolicitudDesde} onValueChanged={e => setFechaSolicitudDesde(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Fecha Solicitud Hasta</div>
                                    <DateBox value={fechaSolicitudHasta} onValueChanged={e => setFechaSolicitudHasta(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Fecha Asignación Desde</div>
                                    <DateBox value={fechaAsignacionDesde} onValueChanged={e => setFechaAsignacionDesde(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Fecha Asignación Hasta</div>
                                    <DateBox value={fechaAsignacionHasta} onValueChanged={e => setFechaAsignacionHasta(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Fecha Confirmación Desde</div>
                                    <DateBox value={fechaConfirmacionDesde} onValueChanged={e => setFechaConfirmacionDesde(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Fecha Confirmación Hasta</div>
                                    <DateBox value={fechaConfirmacionHasta} onValueChanged={e => setFechaConfirmacionHasta(e.value)} displayFormat="dd/MM/yyyy" showClearButton width="100%" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Necesidades para el Servicio</div>
                                    <TextBox value={necesidadesServicio} onValueChanged={e => setNecesidadesServicio(e.value)} showClearButton width="100%" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Contestación a las Necesidades para el Servicio</div>
                                    <TextBox value={contestacionNecesidades} onValueChanged={e => setContestacionNecesidades(e.value)} showClearButton width="100%" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Demanda ID</div>
                                    <TextBox value={demandaId} onValueChanged={e => setDemandaId(e.value)} showClearButton width="100%" />
                                </div>
                                <div style={{ gridColumn: '3', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 8 }}>
                                    <button type="button" className="boton-action" onClick={limpiarFiltros}>
                                        Limpiar Filtros de Búsqueda
                                    </button>
                                    <button type="button" className="boton-action" onClick={buscar}>
                                        Buscar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabla */}
                    <div className="table-container">
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={datos}
                            keyExpr="ofertaId"
                            showBorders={true}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            onExporting={onExporting}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
                            noDataText={cargando ? 'Cargando...' : 'Sin datos para mostrar'}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={25} />
                            <Pager visible={true} allowedPageSizes={[10, 25, 50]} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible searchMode="contains" />
                            <Selection mode="multiple" allowSelectAll />
                            <GroupPanel visible={vista === 'Agrupada'} />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled mode="select" />
                            <Export enabled fileName="ListaOfertas" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <ColumnFixing enabled />
                            <Toolbar>
                                <Item name="groupPanel" />
                                <Item name="columnChooserButton" />
                                <Item name="exportButton" />
                            </Toolbar>
                            <Column dataField="año" caption="Año" width={70} fixed fixedPosition="left" />
                            <Column dataField="mutuaOferta" caption="Mutua Oferta" width={160} fixed fixedPosition="left" />
                            <Column dataField="centro" caption="Centro" width={180} />
                            <Column dataField="provincia" caption="Provincia" width={120} />
                            <Column dataField="localidad" caption="Localidad" width={120} />
                            <Column dataField="especialidad" caption="Especialidad" width={160} />
                            <Column dataField="tipoMovimiento" caption="Tipo Movimiento" width={140} />
                            <Column dataField="servicio" caption="Servicio" width={150} />
                            <Column dataField="demandaId" caption="Num. Pet." width={90} />
                            <Column dataField="peticionesPendientesAsignar" caption="Pet. Pend. Asig." width={110} />
                            <Column dataField="ene" caption="Ene" width={55} alignment="center" />
                            <Column dataField="feb" caption="Feb" width={55} alignment="center" />
                            <Column dataField="mar" caption="Mar" width={55} alignment="center" />
                            <Column dataField="abr" caption="Abr" width={55} alignment="center" />
                            <Column dataField="may" caption="May" width={55} alignment="center" />
                            <Column dataField="jun" caption="Jun" width={55} alignment="center" />
                            <Column dataField="jul" caption="Jul" width={55} alignment="center" />
                            <Column dataField="ago" caption="Ago" width={55} alignment="center" />
                            <Column dataField="sep" caption="Sep" width={55} alignment="center" />
                            <Column dataField="oct" caption="Oct" width={55} alignment="center" />
                            <Column dataField="nov" caption="Nov" width={55} alignment="center" />
                            <Column dataField="dic" caption="Dic" width={55} alignment="center" />
                            <Column dataField="total" caption="Total" width={70} alignment="center" fixed fixedPosition="right" />
                            <Column
                                caption="Acción"
                                width={80}
                                fixed
                                fixedPosition="right"
                                cellRender={() => (
                                    <button type="button" className="boton-action" style={{ padding: '2px 8px', fontSize: 11 }}>
                                        ...
                                    </button>
                                )}
                            />
                        </DataGrid>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default GestionOferta;