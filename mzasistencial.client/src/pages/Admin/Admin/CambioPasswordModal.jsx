import React, { useState } from 'react';
import { Popup } from 'devextreme-react/popup';
import { Form, SimpleItem, GroupItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import { usuariosService } from '../../../services/admin/UsuariosService';

const CambioPasswordModal = ({ visible, onClose, usuarioId }) => {
    const [formData, setFormData] = useState({
        nuevaPassword: '',
        confirmarPassword: ''
    });

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.nuevaPassword) {
            notify("La contraseña no puede estar vacía", "error", 2000);
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{7,20}$/;
        if (!passwordRegex.test(formData.nuevaPassword)) {
            notify("La contraseña debe tener entre 7 y 20 caracteres, e incluir al menos una mayúscula, una minúscula y un número.", "error", 4000);
            return;
        }

        if (formData.nuevaPassword !== formData.confirmarPassword) {
            notify("Las contraseñas no coinciden", "error", 2000);
            return;
        }

        try {
            await usuariosService.changePassword(usuarioId, formData.nuevaPassword);
            notify("Contraseña modificada con éxito", "success", 2000);
            setFormData({ nuevaPassword: '', confirmarPassword: '' });
            onClose();
        } catch (error) {
            notify(error.message, "error", 3000);
        }
    };

    const onFieldDataChanged = (e) => {
        setFormData(prev => ({ ...prev, [e.dataField]: e.value }));
    };

    return (
        <Popup
            visible={visible}
            onHiding={onClose}
            dragEnabled={false}
            hideOnOutsideClick={true}
            showTitle={true}
            title="Cambiar Contraseña"
            width={400}
            height={300}
        >
            <form onSubmit={handleSave}>
                <Form
                    formData={formData}
                    onFieldDataChanged={onFieldDataChanged}
                    labelLocation="top"
                >
                    <SimpleItem 
                        dataField="nuevaPassword" 
                        label={{ text: "Nueva Contraseña" }} 
                        editorOptions={{ mode: 'password' }} 
                        isRequired={true} 
                    />
                    <SimpleItem 
                        dataField="confirmarPassword" 
                        label={{ text: "Confirmar Contraseña" }} 
                        editorOptions={{ mode: 'password' }} 
                        isRequired={true} 
                    />
                </Form>
                <div className="d-flex justify-content-end mt-4 gap-2" style={{ gap: '8px' }}>
                    <Button text="Cancelar" onClick={onClose} />
                    <Button text="Guardar" useSubmitBehavior={true} />
                </div>
            </form>
        </Popup>
    );
};

export default CambioPasswordModal;
