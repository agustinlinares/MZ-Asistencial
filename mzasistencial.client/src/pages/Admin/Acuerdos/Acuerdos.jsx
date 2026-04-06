import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Acuerdos.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

const onExporting = (e) => {
    e.component.beginUpdate();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'estaciones.xlsx');
        });
    })
    e.cancel = true;
};

const Acuerdos = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);

    // const { isAuthenticated } = UseProtectedRoute();
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="title"> {t('Acuerdos')}</div>

                    <div className="filtros-title">
                        {t('Filtros')}
                    </div>

                    <div className="filtros-content">

                        {/* FILTRO MUTUA */}
                        <div className="filtro-item">
                            <label>Mutua</label>
                            <select>
                                <option>001 - ENTIDAD 1</option>
                                <option>002 - ENTIDAD 2</option>
                                <option>003 - ENTIDAD 3</option>
                                <option>007 - ENTIDAD 4</option>
                                <option>010 - ENTIDAD 5</option>
                                <option>011 - ENTIDAD 6</option>
                                <option>021 - ENTIDAD 7</option>
                            </select>
                        </div>

                        {/* FILTRO AÑO */}
                        <div className="filtro-item">
                            <label>Año</label>
                            <select>
                                <option>2026</option>
                                <option>2025</option>
                                <option>2024</option>
                            </select>
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Acuerdos;