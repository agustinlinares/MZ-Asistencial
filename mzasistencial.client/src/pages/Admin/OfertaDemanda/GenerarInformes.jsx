import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import FincasService from "../../../services/admin/FincasService";
import '../../../styles/FichaGlobal.css';

const REPORT_TYPES = [
    { id: 'fincas', label: 'Fincas Registrales (Patrimonial)', icon: 'ri-building-line', color: '#1a5fa8' },
    { id: 'icg06', label: 'Resumen ICG06 por Centro', icon: 'ri-file-list-3-line', color: '#2e7d32' },
    { id: 'actividad', label: 'Actividad Asistencial Anual', icon: 'ri-hospital-line', color: '#d32f2f' }
];

const ANIOS = ["2022", "2023", "2024", "2025"];

const GenerarInformes = () => {
    const { t } = useTranslation();
    const [reportType, setReportType] = useState('fincas');
    const [anio, setAnio] = useState("2024");
    const [generando, setGenerando] = useState(false);

    const handleGenerar = async () => {
        setGenerando(true);
        try {
            if (reportType === 'fincas') {
                await exportFincasPatrimonial();
            } else {
                alert(t('Este informe estará disponible próximamente.'));
            }
        } catch (error) {
            console.error(error);
            alert(t('Error al generar el informe: ') + error.message);
        } finally {
            setGenerando(false);
        }
    };

    const exportFincasPatrimonial = async () => {
        const fincas = await FincasService.getAll();
        const rows = [];
        for (const f of fincas) {
            const costes = await FincasService.getCostes(f.Finca_id);
            const costeAnio = costes.find(c => String(c.Anio) === anio);
            rows.push({
                ...f,
                CosteAnual: costeAnio ? costeAnio.Coste : 0,
                LocalizadorAnual: costeAnio ? costeAnio.Localizador : '—'
            });
        }

        const workbook = new Workbook();
        const sheet = workbook.addWorksheet(`Fincas ${anio}`);
        sheet.columns = [
            { header: 'ID Finca', key: 'Finca_id', width: 10 },
            { header: 'Localizador', key: 'Localizador', width: 15 },
            { header: 'Centro', key: 'Centro', width: 25 },
            { header: 'Dirección', key: 'Direccion', width: 30 },
            { header: 'Superficie (m²)', key: 'Superficie', width: 15 },
            { header: 'Tipo', key: 'TipoFinca', width: 15 },
            { header: 'Titularidad', key: 'Titularidad', width: 25 },
            { header: 'Ref. Catastral', key: 'Referencia_Catastral', width: 20 },
            { header: `Coste ${anio} (€)`, key: 'CosteAnual', width: 15 },
            { header: 'Localizador Coste', key: 'LocalizadorAnual', width: 20 },
        ];
        sheet.addRows(rows);
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A5FA8' } };

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Informe_Patrimonial_Fincas_${anio}.xlsx`);
    };

    return (
        <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
            <div className="file-box">
                <div className="header-page">
                    <div className="title">{t('GENERACIÓN DE INFORMES REGULATORIOS')}</div>
                </div>
                <div className="ficha-tab-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="ficha-section">
                        <p className="ficha-section-title">
                            <i className="ri-settings-5-line"></i> {t('Configuración del Informe')}
                        </p>
                        <div className="ficha-grid" style={{ marginBottom: 30 }}>
                            <div className="ficha-field span2">
                                <label>{t('Tipo de Informe')}</label>
                                <div className="ficha-radio-group" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                                    {REPORT_TYPES.map(type => (
                                        <label key={type.id} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', background: reportType === type.id ? '#f0f7ff' : '#fff' }}>
                                            <input type="radio" name="reportType" value={type.id} checked={reportType === type.id} onChange={() => setReportType(type.id)} />
                                            <i className={type.icon} style={{ color: type.color, fontSize: '20px' }}></i>
                                            <span style={{ fontWeight: reportType === type.id ? 600 : 400 }}>{t(type.label)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="ficha-field">
                                <label>{t('Ejercicio / Año')}</label>
                                <select value={anio} onChange={(e) => setAnio(e.target.value)}>
                                    {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div className="ficha-field">
                                <label>{t('Formato de Salida')}</label>
                                <select disabled><option>Excel (.xlsx)</option></select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40, borderTop: '1px solid #eee', paddingTop: 30 }}>
                            <button className="acciones-btn" style={{ padding: '15px 40px', fontSize: '16px' }} onClick={handleGenerar} disabled={generando}>
                                <i className={generando ? "ri-loader-4-line ri-spin" : "ri-download-cloud-2-line"}></i>
                                {generando ? t('Procesando...') : t('Generar Informe')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerarInformes;