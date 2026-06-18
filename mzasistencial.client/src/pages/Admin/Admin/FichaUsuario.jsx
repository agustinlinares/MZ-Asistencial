import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import AuthService from '@services/auth/AuthService';
import { Button } from 'devextreme-react/button';
import { Form, SimpleItem, GroupItem, RequiredRule, EmailRule } from 'devextreme-react/form';
import notify from 'devextreme/ui/notify';
import { usuariosService } from '../../../services/admin/UsuariosService';
import CambioPasswordModal from './CambioPasswordModal';

const FichaUsuario = () => {
    UseProtectedRoute();
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'nueva';
    
    const userStr = localStorage.getItem('UsuarioActual') || sessionStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : {};
    const isAdmin = currentUser.perfilId === 1;

    const [formData, setFormData] = useState({
        login: '',
        nombre: '',
        apellidos: '',
        direccionElectronica: '',
        perfilId: currentUser.perfilId !== 1 && currentUser.perfilId !== 2 ? currentUser.perfilId : null,
        mutuaId: currentUser.perfilId !== 1 ? (currentUser.mutuaId ?? null) : null,
        centroId: null,
        permisoQlikSense: false,
        dgossrecibeCorreo: false,
        recibirNotificaciones: false,
        password: '' // Solo para creación
    });
    const [loading, setLoading] = useState(!isNew);
    const [perfiles, setPerfiles] = useState([]);
    const [mutuas, setMutuas] = useState([]);
    const [todosCentros, setTodosCentros] = useState([]);
    const [centros, setCentros] = useState([]);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const isSelf = parseInt(id) === currentUser.usuarioId;
    const isEditingAdmin = formData.perfilId === 1;
    const readOnly = !isNew && isEditingAdmin && !isSelf;

    const loadAllData = async () => {
        setLoading(true);
        try {
            // Cargar catálogos en paralelo
            const mPromise = fetch('/api/Mutuas').then(res => res.ok ? res.json() : []).catch(() => []);
            const pPromise = AuthService.fetch('/api/Usuarios/perfiles').then(res => res.ok ? res.json() : []).catch(() => []);
            const cPromise = fetch('/api/centros').then(res => res.ok ? res.json() : []).catch(() => []);
            
            const [mList, pList, cList] = await Promise.all([mPromise, pPromise, cPromise]);
            
            setMutuas(mList);
            setTodosCentros(cList);

            let filtered = Array.isArray(pList) ? pList : [];
            if (currentUser.perfilId === 2) {
                filtered = filtered.filter(x => x.perfilId === 2 || x.perfilId === 6 || x.perfilId === 7);
            } else if (currentUser.perfilId !== 1) {
                filtered = filtered.filter(x => x.perfilId === currentUser.perfilId);
            }
            setPerfiles(filtered);

            if (!isNew) {
                const data = await usuariosService.getById(id);
                setFormData(data);
            }
        } catch (error) {
            notify(error.message || 'Error al cargar los datos', 'error', 3000);
            if (!isNew) {
                navigate('/admin/Admin/Usuarios');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!formData.mutuaId) {
            setCentros(todosCentros);
        } else {
            setCentros(todosCentros.filter(c => c.mutuaId === formData.mutuaId));
        }
    }, [formData.mutuaId, todosCentros]);

    useEffect(() => {
        loadAllData();
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();
        
        // Validaciones programáticas
        if (!formData.login || !formData.login.trim()) {
            notify('El Login (Usuario) es obligatorio', 'error', 3000);
            return;
        }
        if (!formData.direccionElectronica || !formData.direccionElectronica.trim()) {
            notify('El Email es obligatorio', 'error', 3000);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.direccionElectronica)) {
            notify('El formato del Email no es válido', 'error', 3000);
            return;
        }
        if (!formData.nombre || !formData.nombre.trim()) {
            notify('El Nombre es obligatorio', 'error', 3000);
            return;
        }
        if (!formData.apellidos || !formData.apellidos.trim()) {
            notify('Los Apellidos son obligatorios', 'error', 3000);
            return;
        }
        if (!formData.perfilId) {
            notify('El Perfil es obligatorio', 'error', 3000);
            return;
        }
        if (formData.perfilId !== 1 && formData.perfilId !== 4 && !formData.mutuaId) {
            notify('La Mutua es obligatoria', 'error', 3000);
            return;
        }
        if (isNew) {
            if (!formData.password || !formData.password.trim()) {
                notify('La Contraseña es obligatoria para un nuevo usuario', 'error', 3000);
                return;
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{7,20}$/;
            if (!passwordRegex.test(formData.password)) {
                notify('La contraseña debe tener entre 7 y 20 caracteres, e incluir al menos una mayúscula, una minúscula y un número.', 'error', 4000);
                return;
            }
        }

        try {
            if (isNew) {
                await usuariosService.create(formData);
                notify('Usuario creado con éxito', 'success', 2000);
            } else {
                await usuariosService.update(id, formData);
                notify('Usuario actualizado con éxito', 'success', 2000);
            }
            navigate('/admin/Admin/Usuarios');
        } catch (error) {
            notify(error.message, 'error', 3000);
        }
    };

    const onFieldDataChanged = (e) => {
        setFormData(prev => {
            const updated = { ...prev, [e.dataField]: e.value };
            // Lógica de limpieza al cambiar el perfil
            if (e.dataField === 'perfilId') {
                if (e.value === 1 || e.value === 4) {
                    updated.mutuaId = null;
                }
                if (e.value === 1) {
                    updated.centroId = null;
                }
            }
            return updated;
        });
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="col-12 p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{isNew ? 'Nuevo Usuario' : `Ficha de Usuario: ${formData.login}`}</h2>
                <Button 
                    text="Volver" 
                    icon="back" 
                    onClick={() => navigate('/admin/Admin/Usuarios')} 
                />
            </div>
            
            <form onSubmit={handleSave}>
                <Form
                     formData={formData}
                     readOnly={readOnly}
                     onFieldDataChanged={onFieldDataChanged}
                     showColonAfterLabel={true}
                     labelLocation="top"
                >
                    <GroupItem caption="Datos Básicos" colCount={2}>
                        <SimpleItem dataField="login" label={{ text: "Login (Usuario)" }}>
                            <RequiredRule message="El login es obligatorio" />
                        </SimpleItem>
                        <SimpleItem dataField="direccionElectronica" label={{ text: "Email" }}>
                            <RequiredRule message="El email es obligatorio" />
                            <EmailRule message="El formato del email no es válido" />
                        </SimpleItem>
                        <SimpleItem dataField="nombre" label={{ text: "Nombre" }}>
                            <RequiredRule message="El nombre es obligatorio" />
                        </SimpleItem>
                        <SimpleItem dataField="apellidos" label={{ text: "Apellidos" }}>
                            <RequiredRule message="Los apellidos son obligatorios" />
                        </SimpleItem>
                    </GroupItem>

                    <GroupItem caption="Asignación y Permisos" colCount={2}>
                        <SimpleItem 
                            dataField="perfilId" 
                            label={{ text: "Perfil" }} 
                            editorType="dxSelectBox"
                            editorOptions={{
                                dataSource: perfiles,
                                displayExpr: "perfil",
                                valueExpr: "perfilId",
                                disabled: !isAdmin && currentUser.perfilId !== 2
                            }}
                        >
                            <RequiredRule message="Debe seleccionar un perfil" />
                        </SimpleItem>
                        <SimpleItem 
                            dataField="mutuaId" 
                            label={{ text: "Mutua" }} 
                            editorType="dxSelectBox"
                            editorOptions={{
                                dataSource: mutuas,
                                displayExpr: "mutua",
                                valueExpr: "numeroId",
                                disabled: !isAdmin || formData.perfilId === 1 || formData.perfilId === 4
                            }}
                        >
                            {formData.perfilId !== 1 && formData.perfilId !== 4 && <RequiredRule message="La mutua es obligatoria para este perfil" />}
                        </SimpleItem>
                        <SimpleItem 
                            dataField="centroId" 
                            label={{ text: "Centro Asociado" }} 
                            editorType="dxSelectBox"
                            editorOptions={{
                                dataSource: centros,
                                displayExpr: "centro",
                                valueExpr: "centroId",
                                showClearButton: true,
                                placeholder: "Seleccionar Centro...",
                                disabled: formData.perfilId === 1
                            }}
                        />
                        <SimpleItem dataField="dgossrecibeCorreo" editorType="dxCheckBox" label={{ text: "Recibir correos DGOSS" }} />
                        <SimpleItem dataField="recibirNotificaciones" editorType="dxCheckBox" label={{ text: "Recibir Notificaciones del Sistema" }} />
                    </GroupItem>

                    {isAdmin && !isNew && (
                        <GroupItem caption="Qlik Sense" colCount={2}>
                            <SimpleItem 
                                dataField="permisoQlikSense" 
                                editorType="dxCheckBox" 
                                label={{ text: "Acceso a Qlik Sense" }} 
                            />
                            <SimpleItem 
                                editorType="dxTextBox"
                                label={{ text: "Usuario Qlik (Sin funcionalidad)" }} 
                                editorOptions={{ 
                                    value: formData.login ? `${formData.login}@qlik.local` : '',
                                    disabled: true 
                                }} 
                            />
                        </GroupItem>
                    )}

                    {isNew && (
                        <GroupItem caption="Seguridad" colCount={1}>
                            <SimpleItem 
                                dataField="password" 
                                label={{ text: "Contraseña" }} 
                                editorOptions={{ mode: 'password' }} 
                            >
                                <RequiredRule message="La contraseña es obligatoria" />
                            </SimpleItem>
                        </GroupItem>
                    )}
                </Form>

                <div className="d-flex justify-content-end mt-4 gap-2" style={{ gap: '8px' }}>
                    {!isNew && !readOnly && (
                        <Button 
                            text="Modificar Contraseña" 
                            icon="key" 
                            type="normal"
                            onClick={() => setIsPasswordModalOpen(true)} 
                        />
                    )}
                    {!readOnly && (
                        <Button 
                            text="Guardar" 
                            icon="save" 
                            useSubmitBehavior={true} 
                        />
                    )}
                </div>
            </form>

            <CambioPasswordModal 
                visible={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)} 
                usuarioId={id} 
            />
        </div>
    );
};

export default FichaUsuario;
