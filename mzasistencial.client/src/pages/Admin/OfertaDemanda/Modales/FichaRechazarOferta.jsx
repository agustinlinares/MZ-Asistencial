import React, { useState } from 'react';
import { Popup } from 'devextreme-react/popup';
import notify from 'devextreme/ui/notify';

const FichaRechazarOferta = ({ visible, onCerrar, onConfirmar }) => {
    const [motivo, setMotivo] = useState('');

    const handleConfirmar = () => {
        if (!motivo.trim()) {
            notify('El motivo es obligatorio', 'warning', 2000);
            return;
        }
        onConfirmar(motivo);
    };

    const handleCerrar = () => {
        setMotivo('');
        onCerrar();
    };

    return (
        <Popup
            visible={visible}
            onHiding={handleCerrar}
            dragEnabled={true}
            hideOnOutsideClick={false}
            showTitle={true}
            title="Rechazar Citación"
            width={400}
            height={250}
        >
            <div style={{ padding: 16 }}>
                <div className="ficha-field">
                    <label style={{ fontWeight: 700, color: '#c62828' }}>Motivo de Rechazo *</label>
                    <textarea 
                        value={motivo} 
                        onChange={(e) => setMotivo(e.target.value)} 
                        rows={4}
                        placeholder="Debe indicar un motivo para rechazar la citación..."
                        style={{ width: '100%', border: '1px solid #c0d0f0', borderRadius: 4, padding: 8, fontSize: 13, resize: 'vertical' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
                    <button className="ficha-btn-secondary" onClick={handleCerrar}>Cancelar</button>
                    <button 
                        onClick={handleConfirmar}
                        style={{ background: '#c62828', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                    >
                        Confirmar Rechazo
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default FichaRechazarOferta;
