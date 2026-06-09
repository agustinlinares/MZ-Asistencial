import React, { useState } from 'react';
import { Popup } from 'devextreme-react/popup';
import notify from 'devextreme/ui/notify';

const FichaAnulacionDemanda = ({ visible, onCerrar, onConfirmar }) => {
    const handleConfirmar = () => {
        onConfirmar();
    };

    return (
        <Popup
            visible={visible}
            onHiding={onCerrar}
            dragEnabled={true}
            hideOnOutsideClick={false}
            showTitle={true}
            title="Confirmar Anulación"
            width={400}
            height={150}
        >
            <div style={{ padding: 16 }}>
                <p>¿Seguro que desea anular esta demanda? Esta acción no se puede deshacer.</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
                    <button className="ficha-btn-secondary" onClick={onCerrar}>Cancelar</button>
                    <button 
                        onClick={handleConfirmar}
                        style={{ background: '#c62828', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                    >
                        Sí, Anular
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default FichaAnulacionDemanda;
