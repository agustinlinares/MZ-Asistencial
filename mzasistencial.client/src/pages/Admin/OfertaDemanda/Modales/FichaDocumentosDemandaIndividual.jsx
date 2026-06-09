import React, { useState, useRef } from 'react';
import { Popup } from 'devextreme-react/popup';
import notify from 'devextreme/ui/notify';

const MAX_FILE_SIZE_MB = 55;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FichaDocumentosDemandaIndividual = ({ visible, onCerrar, onUpload }) => {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        // Validar extensión
        if (!selected.name.toLowerCase().endsWith('.pdf')) {
            notify('El tipo de archivo no está permitido. Solo se admiten PDFs.', 'error', 3000);
            e.target.value = '';
            setFile(null);
            return;
        }

        // Validar tamaño
        if (selected.size > MAX_FILE_SIZE_BYTES) {
            notify(`El archivo supera el límite de ${MAX_FILE_SIZE_MB}MB.`, 'error', 3000);
            e.target.value = '';
            setFile(null);
            return;
        }

        setFile(selected);
    };

    const handleConfirmar = () => {
        if (!file) {
            notify('Debe seleccionar un archivo', 'warning', 2000);
            return;
        }
        
        onUpload(file);
        setFile(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCerrar = () => {
        setFile(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
        onCerrar();
    };

    return (
        <Popup
            visible={visible}
            onHiding={handleCerrar}
            dragEnabled={true}
            hideOnOutsideClick={false}
            showTitle={true}
            title="Adjuntar Documento"
            width={450}
            height={200}
        >
            <div style={{ padding: 16 }}>
                <div className="ficha-field">
                    <label style={{ fontWeight: 700, color: '#1a5fa8' }}>Seleccionar Archivo (solo .pdf, max 55MB)</label>
                    <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'block', marginTop: 10 }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
                    <button className="ficha-btn-secondary" onClick={handleCerrar}>Cancelar</button>
                    <button 
                        onClick={handleConfirmar}
                        style={{ background: '#1a5fa8', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default FichaDocumentosDemandaIndividual;
