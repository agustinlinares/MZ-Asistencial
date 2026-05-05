import React, { useState, useEffect, useRef } from "react";
import '../../../styles/FichaGlobal.css';

// Recibimos dos props:
// - mutua: los datos de la fila que clickó el usuario
// - onClose: la función para cerrar la ficha
const FichaMutua = ({ mutua, onClose }) => {

    // Estado que controla qué pestaña está activa
    // Por defecto empieza en "general"
    const [activeTab, setActiveTab] = useState("general");

    // Estado para guardar los datos completos de la mutua -segun el DTO-
    // Empieza con los datos básicos que ya tenemos de la lista
    const [datosMutua, setDatosMutua] = useState(mutua);

    // Estado para el formulario editable
    // Es una copia de los datos que el usuario puede modificar
    const [form, setForm] = useState({});

    // Listas para los combos
    const [provincias, setProvincias] = useState([]);
    const [poblaciones, setPoblaciones] = useState([]);
    // IDs seleccionados para filtrar
    const [provinciaId, setProvinciaId] = useState(null);

    // Referencia para el foco inicial igual que FichaFinca
    const modalRef = useRef(null);

    // Función helper para actualizar un campo del form
    // "key" es el nombre del campo, "e" es el evento del input
    const set = (key) => (e) => {
        setForm(f => ({ ...f, [key]: e.target.value }));
    };

    //Sirve para detectar si la mutua que se va a guarda es nueva
    const esNuevo = !mutua.numeroId;

    // Igual que FichaFinca: foco al abrir y cerrar con Escape
    useEffect(() => {
        modalRef.current?.focus();
        const handler = e => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // Cuando se abre la ficha, pedimos los datos del DTO
    // useEffect se ejecuta automáticamente cuando el componente aparece en pantalla
    useEffect(() => {

        // Si es nuevo - No hace fetch
        if (!mutua.numeroId) {
            setForm({
                mutua: "",
                razonSocial: "",
                provincia: "",
                poblacion: "",
                poblacionId: null,
                direccion: "",
                cp: "",
                telefono: "",
                fax: "",
                direccionElectronica: "",
                personaContacto: "",
                numeroMutua: "",
            });
            return;
        }
        
        // Si es edición - Fetch normal
        fetch(`/api/mutuas/${mutua.numeroId}`)
            .then(response => response.json())
            .then(data => {
                //console.log("Datos completos del DTO:", data);
                setDatosMutua(data); // Guardamos los datos detallados en el DTO

                // Inicializamos el form con los datos recibidos
                setForm({
                    mutua: data.mutua || "",
                    razonSocial: data.razonSocial || "",
                    provincia: data.provincia || "",
                    poblacion: data.poblacion || "",
                    poblacionId: data.poblacionId || null,
                    direccion: data.direccion || "",
                    cp: data.cp || "",
                    telefono: data.telefono || "",
                    fax: data.fax || "",
                    direccionElectronica: data.direccionElectronica || "",
                    personaContacto: data.personaContacto || "",
                    numeroMutua: data.numeroMutua || "",
                });

            })
            .catch(error => console.error("Error cargando ficha mutua:", error));
    }, [mutua]); // Se ejecuta esto solo una vez, al abrirse.

    // Carga todas las provincias al abrir la ficha
    useEffect(() => {
        fetch('/api/auxprovincias')
            .then(r => r.json())
            .then(data => setProvincias(data))
            .catch(err => console.error("Error cargando provincias:", err));
    }, []);

    useEffect(() => {
        if (provincias.length === 0 || !datosMutua.provincia) return;
        
        const provEncontrada = provincias.find(
            p => p.provincia.trim() === datosMutua.provincia?.trim()
        );
        if (provEncontrada) {
            setProvinciaId(provEncontrada.provinciaId);
            // También inicializamos el poblacionId
            setForm(f => ({ ...f, poblacionId: datosMutua.poblacionId || null }));
        }
    }, [provincias, datosMutua]);

    // Cuando el usuario elige una provincia, carga sus poblaciones
    useEffect(() => {
        if (!provinciaId) return;
        fetch(`/api/auxpoblaciones/${provinciaId}`)
            .then(r => r.json())
            .then(data => setPoblaciones(data))
            .catch(err => console.error("Error cargando poblaciones:", err));
    }, [provinciaId]); // Se ejecuta cada vez que provincia cambia

    // función que llama al PUT cuando el usuario pulsa Aceptar
    const handleGuardar = async () => {
    
        try {

            const url = esNuevo 
                ? '/api/mutuas' 
                : `/api/mutuas/${mutua.numeroId}`;

            const method = esNuevo ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    //numeroId: mutua.numeroId,
                    ...(esNuevo ? {} : { numeroId: mutua.numeroId }),

                    mutua: form.mutua,
                    razonSocial: form.razonSocial,
                    direccion: form.direccion,
                    poblacionId: form.poblacionId,
                    cp: form.cp,
                    telefono: form.telefono,
                    fax: form.fax,
                    direccionElectronica: form.direccionElectronica,
                    personaContacto: form.personaContacto,
                    //numeroMutua: form.numeroMutua,
                })
            });

            if (response.ok) {
                //alert("Mutua guardada correctamente");
                onClose();
            } else {
                alert("Error al guardar la mutua");
            }

        } catch (error) {
            console.error("Error guardando mutua:", error);
            alert("Error de conexión");
        }
    };

    return (
        <div className="ficha-container-inline" role="region" aria-label={`Ficha Mutua ${datosMutua.numeroMutua}`}>
            <div className="ficha-inline-content" ref={modalRef} tabIndex={-1}>

                {/* HEADER */}
                <div className="ficha-modal-header">
                    <span className="ficha-modal-title">
                        {/*✏️ Ficha Mutua | {datosMutua.numeroMutua || '—'}*/}
                         Ficha Mutua | {datosMutua.numeroMutua || '—'} | {datosMutua.mutua || '—'}
                    </span>
                    <div className="ficha-header-btns">
                        <button className="ficha-btn-primary" onClick={handleGuardar}>✓ Aceptar</button>
                        <button className="ficha-btn-secondary" onClick={onClose}>✗ Salir</button>
                    </div>
                </div>

                {/* PESTAÑAS HORIZONTALES*/}
                <div className="ficha-tabs">
                    <button
                        className={`ficha-tab ${activeTab === "general" ? "active" : ""}`}
                        onClick={() => setActiveTab("general")}
                    >
                        General
                    </button>
                    <button
                        className={`ficha-tab ${activeTab === "centrosPropios" ? "active" : ""}`}
                        onClick={() => setActiveTab("centrosPropios")}
                    >
                        Centros Propios
                    </button>
                    <button
                        className={`ficha-tab ${activeTab === "conciertos" ? "active" : ""}`}
                        onClick={() => setActiveTab("conciertos")}
                    >
                        Conciertos
                    </button>
                    <button
                        className={`ficha-tab ${activeTab === "especialidadesPropios" ? "active" : ""}`}
                        onClick={() => setActiveTab("especialidadesPropios")}
                    >
                        Especialidades / Serv. (Propios)
                    </button>
                    <button
                        className={`ficha-tab ${activeTab === "especialidadesConciertos" ? "active" : ""}`}
                        onClick={() => setActiveTab("especialidadesConciertos")}
                    >
                        Especialidades / Serv. (Conciertos)
                    </button>
                </div>

                {/* CONTENIDO DE CADA PESTAÑA */}
                <div className="ficha-tab-content">

                    {/* PESTAÑA GENERAL — muestra los datos de la mutua */}
                    {activeTab === "general" && (
                        <div className="ficha-grid">

                            <div className="ficha-field">
                                <label>Mutua</label>
                                {/* Usa form.mutua y tiene onChange */}
                                <input type="text" value={form.mutua || ""} onChange={set("mutua")} />
                            </div>
                            <div className="ficha-field">
                                <label>Código Razón Social</label>
                                <input type="text" value={form.razonSocial || ""} onChange={set("razonSocial")} />
                            </div>
                            <div className="ficha-field">
                                <label>Provincia</label>
                                <select
                                    value={provinciaId || ""}
                                    onChange={(e) => {
                                        const id = parseInt(e.target.value);
                                        setProvinciaId(id);
                                        // Busca el nombre de la provincia para guardarlo en el form
                                        const prov = provincias.find(p => p.provinciaId === id);
                                        setForm(f => ({ ...f, provincia: prov?.provincia || "", poblacion: "" }));
                                        setPoblaciones([]); // limpia el combo de población
                                    }}
                                >
                                    <option value="">-- Selecciona provincia --</option>
                                    {provincias.map(p => (
                                        <option key={p.provinciaId} value={p.provinciaId}>
                                            {p.provincia}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="ficha-field">
                                <label>Población</label>
                                <select
                                    value={form.poblacionId || ""}
                                    onChange={(e) => {
                                        const id = parseInt(e.target.value);
                                        const pob = poblaciones.find(p => p.poblacionId === id);
                                        setForm(f => ({ 
                                            ...f, 
                                            poblacion: pob?.poblacion || "",
                                            poblacionId: id  // Guardamos el id
                                        }));
                                    }}
                                    disabled={!provinciaId} // deshabilitado hasta que haya provincia
                                >
                                    <option value="">-- Selecciona población --</option>
                                    {poblaciones.map(p => (
                                        <option key={p.poblacionId} value={p.poblacionId}>
                                            {p.poblacion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="ficha-field">
                                <label>Dirección</label>
                                <input type="text" value={form.direccion || ""} onChange={set("direccion")} />
                            </div>
                            <div className="ficha-field">
                                <label>Código Postal</label>
                                <input type="text" value={form.cp || ""} onChange={set("cp")} />
                            </div>
                            <div className="ficha-field">
                                <label>Teléfono</label>
                                <input type="text" value={form.telefono || ""} onChange={set("telefono")} />
                            </div>
                            <div className="ficha-field">
                                <label>Fax</label>
                                <input type="text" value={form.fax || ""} onChange={set("fax")} />
                            </div>
                            <div className="ficha-field">
                                <label>Dirección Electrónica</label>
                                <input type="text" value={form.direccionElectronica || ""} onChange={set("direccionElectronica")} />
                            </div>
                            <div className="ficha-field">
                                <label>Persona de Contacto</label>
                                <input type="text" value={form.personaContacto || ""} onChange={set("personaContacto")} />
                            </div>
                            <div className="ficha-field">
                                <label>Número de Mutua</label>
                                <input type="text" value={esNuevo ? "Se generará automáticamente" : form.numeroMutua} disabled />
                            </div>

                        </div>
                    )}

                    {/* PESTAÑAS CENTROS PROPIOS — ??? */}
                    {activeTab === "centrosPropios" && (
                        <p>Centros Propios</p>
                    )}

                    {/* PESTAÑAS CONCIERTOS — ??? */}
                    {activeTab === "conciertos" && (
                        <p>Conciertos</p>
                    )}

                    {/* PESTAÑAS ESPECIALIDADES /SERV. (PROPIOS) — ??? */}
                    {activeTab === "especialidadesPropios" && (
                        <p>Especialidades / Serv. (Propios)</p>
                    )}

                    {/* PESTAÑAS ESPECIALIDADES /SERV. (CONCIERTOS) — ??? */}
                    {activeTab === "especialidadesConciertos" && (
                        <p>Especialidades / Serv. (Conciertos)</p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FichaMutua;