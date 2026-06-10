import React, { useState, useEffect, useRef, useCallback } from "react";
import DataGrid, { Column, Scrolling } from "devextreme-react/data-grid";
import '../../../styles/FichaGlobal.css';
import AuthService from "../../../services/auth/AuthService";
import { MapaUbicador } from '../../../components/MapaUbicador';
import notify from 'devextreme/ui/notify';
import { confirm as dxConfirm } from 'devextreme/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportDataGridToExcel } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { useLogError } from '../../../hooks/useLogError';

const authHeaders = () => {
    const token = AuthService.getToken();
    return { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
};

const TabGeneral = ({ form, onChange, errors, onGoToMap, opts }) => {
    
    const handleLocalizadorChange = (rawText) => {
        const numbers = rawText.replace(/\D/g, '').slice(0, 10);
    
        const match = numbers.match(/^(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,3})$/);
        
        if (match) {
            const formatted = match.slice(1).filter(Boolean).join('-');
            onChange('ccn', formatted);
        } else {
            onChange('ccn', '');
        } 
    };

    return (
        <div className="ficha-grid">
            <div className="ficha-field">
                <label>Localizador Centro</label>
                <input 
                    type="text" 
                    value={form.ccn || ''} 
                    onChange={(e) => handleLocalizadorChange(e.target.value)} 
                    placeholder="000-00-00-000"
                    className={errors.ccn ? 'error' : ''}
                />
            </div>

            <div className="ficha-field">
                <label>Proveedor</label>
                <select value={form.proveedor || ''} onChange={e => {
                    onChange('proveedor', e.target.value);
                    onChange('delegacion', '');
                }}>
                    <option value="">— Seleccionar —</option>
                    {opts.proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
            </div>

            <div className="ficha-field">
                <label>Delegación</label>
                <select value={form.delegacion || ''} onChange={e => onChange('delegacion', e.target.value)} disabled={!form.proveedor}>
                    <option value="">— Seleccionar —</option>
                    {opts.delegaciones.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </select>
            </div>

            <div className="ficha-field">
                <label>Centro</label>
                <input className={errors.centro ? 'error' : ''} type="text" value={form.centro || ''} onChange={e => onChange('centro', e.target.value)} />
            </div>

            <div className="ficha-field">
                <label>Provincia</label>
                <select className={errors.provincia ? 'error' : ''} value={form.provincia || ''} onChange={e => {
                    onChange('provincia', e.target.value);
                    onChange('poblacion', ''); 
                }}>
                    <option value="">— Seleccionar —</option>
                    {opts.provincias.map(p => (
                        <option key={p.provinciaId} value={p.provinciaId}>{p.provincia}</option>
                    ))}
                </select>
            </div>

            <div className="ficha-field">
                <label>Población</label>
                <select className={errors.poblacion ? 'error' : ''} value={form.poblacion || ''} onChange={e => onChange('poblacion', e.target.value)} disabled={!form.provincia}>
                    <option value="">— Seleccionar —</option>
                    {opts.poblaciones.map(p => (
                        <option key={p.poblacionId} value={p.poblacionId}>{p.poblacion}</option>
                    ))}
                </select>
            </div>

            <div className="ficha-field">
                <label>CIF / NIF</label>
                <input className={errors.cif ? 'error' : ''} type="text" value={form.cif || ''} onChange={e => onChange('cif', e.target.value)} />
            </div>
            
            <div className="ficha-field">
                <label>Código Postal</label>
                <input className={errors.cp ? 'error' : ''} type="text" value={form.cp || ''} onChange={e => onChange('cp', e.target.value)} />
            </div>

            <div className="ficha-field">
                <label>Dirección</label>
                <input 
                    className={errors.direccion ? 'error' : 'readonly'} 
                    type="text" 
                    value={form.direccion || ''} 
                    readOnly 
                    placeholder="⚠️ Ve a la pestaña Mapa para situar la dirección"
                    onClick={() => alert("La dirección se asigna automáticamente. Ve a la pestaña 'Mapa / Ubicación', busca la calle o haz clic en el mapa.")}
                />
            </div>

            <div className="ficha-field">
                <label>Teléfono</label>
                <input 
                    type="text" 
                    value={form.telefono ? form.telefono.trim() : ''} 
                    onChange={e => onChange('telefono', e.target.value)} 
                />
            </div>

            <div className="ficha-field">
                <label>Número</label>
                <input 
                    type="text" 
                    value={form.numero || ''} 
                    onChange={e => onChange('numero', e.target.value)} 
                />
            </div>

            <div className="ficha-field">
                <label>Nº de Registro Sanitario</label>
                <input 
                    type="number" 
                    value={form.numRegistroSanitario || ''} 
                    onChange={e => onChange('numRegistroSanitario', e.target.value)} 
                />
            </div>

            <div className="ficha-field">
                <label>Ubicación (Mapa)</label>
                <input 
                    className="readonly" 
                    type="text" 
                    value={form.latitud && form.longitud ? `🌐 ${form.latitud}, ${form.longitud}` : '📍 Falta situar en el mapa (Haz clic aquí)'} 
                    readOnly 
                    onClick={onGoToMap} 
                    style={{ 
                        cursor: 'pointer', 
                        borderBottom: errors.mapa ? '1px solid #dc3545' : '' 
                    }}
                />
            </div>

            <div className="ficha-field">
                <label>Fecha de alta</label>
                <input type="date" value={form.fecha_alta || ''} readOnly className="readonly" /> 
            </div>

            <div className="ficha-field">
                <label>Fecha de baja</label>
                <input type="date" value={form.fecha_baja || ''} onChange={e => onChange('fecha_baja', e.target.value)} />
            </div>

            <div className="ficha-field">
                <label>Comentarios</label>
                <textarea 
                    style={{ color: 'black', backgroundColor: 'white', border: '1px solid black' }}
                    value={form.comentarios || ''} 
                    onChange={e => onChange('comentarios', e.target.value)} 
                />
            </div>

            <div className="ficha-field">
                <label>Motivo de la baja</label>
                <textarea 
                    style={{ color: 'black', backgroundColor: 'white', border: '1px solid black' }}
                    value={form.motivoBaja || ''} 
                    onChange={e => onChange('motivoBaja', e.target.value)} 
                />
            </div>
        </div>
    );
};

/* ── PESTAÑAS DE TABLAS SECUNDARIAS ────────────────────────────── */
const TabDataGrid = ({ datos, children, nombreArchivo = 'Exportacion' }) => {
    const [gridInstance, setGridInstance] = useState(null);

    // Función para Excel
    const exportarExcel = () => {
        if (!gridInstance) return; // Si la tabla aún no existe, no hacemos nada
        
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Datos');

        exportDataGridToExcel({
            component: gridInstance, 
            worksheet: worksheet,
            autoFilterEnabled: true,
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${nombreArchivo}.xlsx`);
            });
        });
    };

    // Función para PDF
    const exportarPDF = () => {
        if (!gridInstance) return;
        
        const doc = new jsPDF();
        
        exportDataGridToPdf({
            jsPDFDocument: doc,
            component: gridInstance, 
            indent: 5,
        }).then(() => {
            doc.save(`${nombreArchivo}.pdf`);
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginBottom: '10px' }}>
                <button 
                    className="ficha-btn-secondary" 
                    style={{ padding: '6px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }} 
                    onClick={exportarExcel}
                >
                    <i className="ri-file-excel-2-line" style={{ color: '#2e7d32', fontSize: '16px' }}></i>
                    Excel
                </button>
                
                <button 
                    className="ficha-btn-secondary" 
                    style={{ padding: '6px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }} 
                    onClick={exportarPDF}
                >
                    <i className="ri-file-pdf-line" style={{ color: '#d32f2f', fontSize: '16px' }}></i>
                    PDF
                </button>
            </div>
            
            <DataGrid 
                onInitialized={(e) => setGridInstance(e.component)} 
                dataSource={datos} 
                showBorders={true} 
                noDataText="Sin datos para mostrar" 
                height={350}
            >
                <Scrolling mode="standard" />
                {children}
            </DataGrid>
        </div>
    );
};

/* ── COMPONENTE PRINCIPAL ──────────────────────────────────────── */
const FichaCentroConcertado = ({ cliente, onClose, onSave }) => { 
    const [activeTab, setActiveTab] = useState('general');
    const [mutuasAsignadas, setMutuasAsignadas] = useState([]);
    const [registrosICG, setRegistrosICG] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);

    const logError = useLogError("Ficha centros concertados");
    
    // Función para convertir fechas de DD/MM/YYYY o ISO a YYYY-MM-DD
    const parseDateForInput = (dateStr) => {
        if (!dateStr) return '';
        // Si ya viene con la T de SQL (ej. 2024-01-01T00:00:00)
        if (dateStr.includes('T')) return dateStr.split('T')[0];
        // Si viene en formato español (ej. 1/1/2024 o 01/01/2024)
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            const dia = parts[0].padStart(2, '0');
            const mes = parts[1].padStart(2, '0');
            const ano = parts[2];
            return `${ano}-${mes}-${dia}`;
        }
        return dateStr;
    };

    const [form, setForm] = useState({
        centro_id: cliente?.CentroId ?? cliente?.centro_id ?? '',
        localizador: cliente?.Localizador ?? cliente?.ccn ?? '',
        centro: cliente?.Centro ?? cliente?.centro ?? '',
        direccion: cliente?.Direccion ?? cliente?.direccion ?? '',
        cif: cliente?.Cifnif ?? cliente?.Cif ?? cliente?.cif ?? '',
        cp: cliente?.Cp ?? cliente?.cp ?? '',
        
        proveedor: cliente?.ProveedorId ?? cliente?.proveedorId ?? '',
        delegacion: cliente?.DelegacionId ?? cliente?.delegacionId ?? '',
        provincia: cliente?.ProvinciaId ?? cliente?.provinciaId ?? '',
        poblacion: cliente?.PoblacionId ?? cliente?.poblacionId ?? '',
        
        fecha_alta: cliente?.FechaAlta 
            ? parseDateForInput(cliente.FechaAlta) 
            : new Date().toISOString().split('T')[0], // La fecha de hoy
        fecha_baja: parseDateForInput(cliente?.FechaBaja ?? cliente?.fechaBaja),
        
        numero: cliente?.Numero ?? cliente?.numero ?? '', 
        telefono: cliente?.Telefono ?? cliente?.telefono ?? '', 
        numRegistroSanitario: cliente?.NumRegistroSanitario ?? cliente?.numRegistroSanitario ?? '', 
        comentarios: cliente?.Comentarios ?? cliente?.comentarios ?? '',
        motivoBaja: cliente?.MotivoBaja ?? cliente?.motivoBaja ?? '', 
        latitud: cliente?.latitud ?? cliente?.Latitud ?? '', 
        longitud: cliente?.longitud ?? cliente?.Longitud ?? ''
    });

    const esNuevo = !form.centro_id || form.centro_id === 0;

    const [datosMutuas, setDatosMutuas] = useState([]);

    const [opts, setOpts] = useState({ proveedores: [], delegaciones: [], provincias: [], poblaciones: [] });

    // Carga inicial de datos maestros (Provincias y Proveedores)
    useEffect(() => {
        const fetchMaestros = async () => {
            try {
                const headers = authHeaders();
                const resProv = await fetch('/api/AuxProvincias', { headers });
                const resProvdd = await fetch('/api/AuxProveedores', { headers }); 
                
                if (!resProv.ok) throw new Error(`Error ${resProv.status} al cargar Provincias`);
                if (!resProvdd.ok) throw new Error(`Error ${resProvdd.status} al cargar Proveedores`);

                const provincias = await resProv.json();
                const proveedores = await resProvdd.json();
                setOpts(prev => ({ ...prev, provincias, proveedores }));

            } catch (error) {
                logError("Fallo al cargar datos maestros (Provincias/Proveedores)", error);
                console.error("Error cargando maestros:", error);
            }
        };
        fetchMaestros();
    }, []);

    // Carga en cascada de Poblaciones cuando cambia la Provincia
    useEffect(() => {
        if (!form.provincia) {
            setOpts(prev => ({ ...prev, poblaciones: [] }));
            return;
        }
        fetch(`/api/AuxPoblaciones/${form.provincia}`, { headers: authHeaders() })
            .then(r => r.ok ? r.json() : [])
            .then(data => setOpts(prev => ({ ...prev, poblaciones: data })));
    }, [form.provincia]);

    // Carga en cascada de Delegaciones cuando cambia el Proveedor
    useEffect(() => {
        if (!form.proveedor) {
            setOpts(prev => ({ ...prev, delegaciones: [] }));
            return;
        }
        fetch(`/api/AuxDelegaciones/PorProveedor/${form.proveedor}`, { headers: authHeaders() })
            .then(r => r.ok ? r.json() : [])
            .then(data => setOpts(prev => ({ ...prev, delegaciones: data })));
    }, [form.proveedor]);

    // Cargar Mutuas Asignadas
    const cargarMutuasAsignadas = async (id) => {
        try {
            // Usamos la URL con M mayúscula del equipo para evitar el 404
            const response = await fetch(`/api/CentrosConcertados/${id}/Mutuas`, { 
                headers: authHeaders() 
            });
            if (response.ok) {
                const data = await response.json();
                setMutuasAsignadas(data);
            } else {
                throw new Error(`Error ${response.status} al cargar mutuas`);
            }
        } catch (error) {
            logError(`Fallo al cargar mutuas asignadas para el centro ID: ${id}`, error);
        }
    };

    // Cargar Registros ICG 
    const cargarRegistrosICG = async (id) => {
        try {
            const response = await fetch(`/api/RegistroICG/Concertado/${id}`, { 
                headers: authHeaders() 
            });
            if (response.ok) {
                const data = await response.json();
                setRegistrosICG(data);
            } else {
                throw new Error(`Error ${response.status} al cargar registros ICG`);
            }
        } catch (error) {
            logError(`Fallo al cargar los registros ICG para el centro ID: ${id}`, error);
        }
    };

    const cargarEspecialidades = async (id) => {
        try {
            const response = await fetch(`/api/CentrosConcertados/${id}/Especialidades`, { 
                headers: authHeaders() 
            });
            if (response.ok) {
                const data = await response.json();
                setEspecialidades(data);
            } else {
                throw new Error(`Error ${response.status} al cargar especialidades`);
            }
        } catch (error) {
            logError(`Fallo al cargar las especialidades para el centro ID: ${id}`, error);
        }
    };

    useEffect(() => {
        // Solo cargamos si el ID es válido y no es un centro nuevo (0)
        if (form.centro_id && form.centro_id !== 0) {
            cargarMutuasAsignadas(form.centro_id);
            cargarRegistrosICG(form.centro_id);
            cargarEspecialidades(form.centro_id);
        }
    }, [form.centro_id]);

    // Carga de las Mutuas Asignadas al abrir el modal
    useEffect(() => {
        // Si estamos creando un centro nuevo, no hacemos la petición
        if (!form.centro_id || form.centro_id === 0) {
            setDatosMutuas([]);
            return;
        }

        const fetchMutuasAsignadas = async () => {
            try {
                const response = await fetch(`/api/CentrosConcertados/${form.centro_id}/Mutuas`, {
                    headers: authHeaders()
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setDatosMutuas(data);
                } else {
                    logError(`Error del servidor al cargar mutuas para centro ID: ${form.centro_id}. Status: ${response.status}`);
                    console.error("Error en la respuesta del servidor al cargar mutuas");
                }
            } catch (error) {
                logError(`Fallo crítico al cargar mutuas para centro ID: ${form.centro_id}`, error);
                console.error("Error de red cargando mutuas:", error);
            }
        };

        fetchMutuasAsignadas();
    }, [form.centro_id]); // Se ejecuta cuando el ID del centro cambia

    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);

    useEffect(() => {
        modalRef.current?.focus();
        const handler = e => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleChange = useCallback((field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: false }));
    }, []);

    const handleSave = async () => {
        const newErrors = {};
        const regexLocalizador = /^\d{3}-\d{2}-\d{2}-\d{3}$/;

        // Campos de texto y selectores obligatorios
        if (!form.centro?.trim()) newErrors.centro = true;
        if (!form.provincia) newErrors.provincia = true;
        if (!form.poblacion) newErrors.poblacion = true;
        if (!form.direccion?.trim()) newErrors.direccion = true;
        if (!form.cif?.trim()) newErrors.cif = true;
        if (!form.cp?.trim()) newErrors.cp = true;

        // Validación del Localizador 
        if (!form.ccn) {
            newErrors.ccn = true;
        } else if (!regexLocalizador.test(form.ccn)) {
            newErrors.ccn = true;
            notify('El localizador debe estar completo y tener el formato 000-00-00-000.', 'error', 4000);
        }
        
        // Fecha de Alta
        if (!form.fecha_alta) newErrors.fecha_alta = true;

        // Localización (Mapa)
        if (!form.latitud || !form.longitud) {
            newErrors.mapa = true; 
        }

        // Validaciones de longitud (que no pete la BD)
        if (form.cp && form.cp.length > 5) {
            alert("El Código Postal no puede tener más de 5 caracteres");
            newErrors.cp = true;
        }
        if (form.telefono && form.telefono.length > 15) {
            alert("El teléfono es demasiado largo");
            newErrors.telefono = true;
        }

        // Comprobación final: Si hay algún error, se los pasamos a React y paramos aquí
        if (Object.keys(newErrors).length > 0) { 
            setErrors(newErrors); // Esto activará los bordes rojos en la interfaz
            
            const soloFaltaMapa = Object.keys(newErrors).length === 1 && newErrors.mapa;

            if (soloFaltaMapa) {
                alert("Falta la localización. Por favor, ve a la pestaña 'Mapa / Ubicación' y sitúa el centro.");
            } else {
                alert("Faltan campos obligatorios por rellenar. Por favor, revisa los campos marcados en rojo.");
            }
            return; // Ahora sí cortamos, porque la pantalla ya se ha enterado de los errores
        }

        // Construimos el objeto exacto que espera el CentrosConcertadoDTO de C#
        const payload = {
            centro_id: form.centro_id ? parseInt(form.centro_id) : 0, 
            ccn: form.ccn, 
            cif: form.cif,
            centro: form.centro,
            direccion: form.direccion,
            cp: form.cp,
            provinciaId: form.provincia ? parseInt(form.provincia) : null,
            poblacionId: form.poblacion ? parseInt(form.poblacion) : null,
            proveedorId: form.proveedor ? parseInt(form.proveedor) : null,
            delegacionId: form.delegacion ? parseInt(form.delegacion) : null,
            telefono: form.telefono,
            numero: form.numero,
            numRegistroSanitario: form.numRegistroSanitario ? parseInt(form.numRegistroSanitario, 10) : null,
            mapaValidado: !!(form.latitud && form.longitud),
            fechaAlta: form.fecha_alta || null,
            fechaBaja: form.fecha_baja || null,
            latitud: form.latitud,
            comentarios: form.comentarios,
            motivoBaja: form.motivoBaja,
            longitud: form.longitud
        };

        try {
            const url = payload.centro_id > 0
                ? `/api/CentrosConcertados/${payload.centro_id}` 
                : '/api/CentrosConcertados';                    
            
            const method = payload.centro_id > 0 ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    ...authHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload) 
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText); 
            }

            onSave?.(payload); 

        } catch (error) {
            logError(`Fallo crítico al ${payload.centro_id > 0 ? 'actualizar' : 'crear'} centro`, error);
            alert("Hubo un problema al guardar los datos en el servidor. Revisa la consola.");
        }
    };

    const handleDelete = async () => {
        if (!form.centro_id || form.centro_id === 0) {
            notify("No puedes dar de baja un centro que todavía no ha sido creado.", "warning", 3000);
            return;
        }

        const confirmar = await dxConfirm(
            "¿Estás seguro de que deseas dar de baja este centro? Se mantendrá en el historial pero dejará de estar activo.", 
            "Confirmar Baja"
        );
        
        if (!confirmar) return;

        try {
            const response = await fetch(`/api/CentrosConcertados/${form.centro_id}`, {
                method: 'DELETE',
                headers: authHeaders() 
            });

            if (response.ok) {
                notify("Centro dado de baja correctamente.", "success", 2000);
                setTimeout(() => {
                    window.location.href = '/admin/centros-concertados'; 
                }, 1000);
            } else {
                const errorData = await response.json();
                notify(`Error al dar de baja: ${errorData.message}`, "error", 4000);
            }
        } catch (error) {
            logError(`Fallo al dar de baja el centro ID: ${form.centro_id}`, error);
            notify("Hubo un error de conexión al intentar dar de baja el centro.", "error", 4000);
        }
    };

    return (
        <div className="ficha-container-inline">
            <div className="ficha-inline-content" ref={modalRef} tabIndex={-1}>
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">
                        Ficha Centro Concertado | {form.centro || form.localizador || 'Nuevo'}
                    </span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={handleSave}>Aceptar</button>
                        <button className="ficha-btn-secondary" onClick={() => window.location.href = '/Admin/Centros/CentrosConcertados'}>Salir</button>
                    </div>
                </div>

                <div className="ficha-tabs">
                    <button className={`ficha-tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
                    
                    {!esNuevo && (
                        <>
                            <button className={`ficha-tab ${activeTab === 'registroICG' ? 'active' : ''}`} onClick={() => setActiveTab('registroICG')}>Registro ICG</button>
                            <button className={`ficha-tab ${activeTab === 'mutuasAsignadas' ? 'active' : ''}`} onClick={() => setActiveTab('mutuasAsignadas')}>Mutuas Asignadas</button>
                            <button className={`ficha-tab ${activeTab === 'especialidades' ? 'active' : ''}`} onClick={() => setActiveTab('especialidades')}>Especialidades / Serv.</button>
                        </>
                    )}
                    
                    <button className={`ficha-tab ${activeTab === 'mapa' ? 'active' : ''}`} onClick={() => setActiveTab('mapa')}>Mapa / Ubicación</button>
                </div>

                <div className="ficha-tab-content">
                    {activeTab === 'general' && (
                        <TabGeneral 
                            form={form} 
                            onChange={handleChange} 
                            errors={errors} 
                            onGoToMap={() => setActiveTab('mapa')} 
                            opts={opts} 
                        />
                    )}
                    
                    {!esNuevo && (
                        <>
                            {activeTab === 'registroICG' && (
                                <TabDataGrid datos={registrosICG} nombreArchivo="Registro_ICG">
                                    <Column dataField="ano" caption="Año" width={100} />
                                    <Column dataField="mutua" caption="Mutua" />
                                    <Column dataField="centro" caption="Centro" />
                                    <Column dataField="fechaModificacion" caption="Fecha Act." dataType="date" width={150} />
                                    <Column dataField="usuarioModificacionId" caption="ID Usuario" width={150} />
                                </TabDataGrid>
                            )}

                            {activeTab === 'mutuasAsignadas' && (
                                <TabDataGrid datos={mutuasAsignadas} nombreArchivo="Mutuas_Asignadas">
                                    <Column dataField="mutua" caption="Mutua" />
                                    <Column dataField="codigoCasa" caption="Cód. CASA" width={150} />
                                    <Column dataField="localizador" caption="Localizador" width={150} />
                                </TabDataGrid>
                            )}

                            {activeTab === 'especialidades' && (
                                <TabDataGrid datos={especialidades} nombreArchivo="Especialidades">
                                    <Column dataField="anyo" caption="Año" width={100} />
                                    <Column dataField="servicio" caption="Servicio" />
                                    <Column dataField="especialidad" caption="Especialidad" />
                                    <Column dataField="cantidad" caption="Cantidad" width={100} />
                                </TabDataGrid>
                            )}
                        </>
                    )}

                    {activeTab === 'mapa' && (
                        <MapaUbicador 
                            form={form} 
                            onChange={handleChange} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FichaCentroConcertado;