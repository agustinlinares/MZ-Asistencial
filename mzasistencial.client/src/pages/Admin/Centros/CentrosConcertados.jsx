import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import FichaCliente from "./FichaCentroConcertado";
import { Workbook } from 'exceljs';
import './Centros.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth/AuthService";
import DataGrid, {
    Column,
    Paging,
    SearchPanel,
    FilterRow,
    HeaderFilter,
    Selection,
    GroupPanel,
    Grouping,
    ColumnChooser,
    Export,
    Scrolling,
    Sorting,
    FilterPanel,
    ColumnFixing,
    Pager,
    Toolbar,
    Item,
    Lookup
} from "devextreme-react/data-grid";

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

const CentrosConcertados = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [isFichaOpen, setIsFichaOpen] = useState(false);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const [isFichaAbierta, setIsFichaAbierta] = useState(false);
    const [centroSeleccionado, setCentroSeleccionado] = useState(null);

    // const { isAuthenticated } = UseProtectedRoute();
    const navigate = useNavigate();

    // Datos que vienen de la Base de Datos
    const [centros, setCentros] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Recogida del token de AuthService
                const token = AuthService.getToken(); 
                
                // Petición a tu Controller 
                const respuesta = await fetch('/api/CentrosConcertados', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '' // Inyectamos seguridad
                    }
                });

                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setCentros(datos); // Volcamos el JSON de Swagger en la tabla
                } else {
                    console.error("Error en la respuesta del servidor:", respuesta.status);
                }
            } catch (error) {
                console.error("Error conectando con la API:", error);
            }
        };

        cargarDatos();
    }, []);

    // Doble clic para navegar a la ficha de detalle
    const onRowDblClick = (e) => {
        const datosAdaptados = {
            CentroID: e.data.Centro_id,
            Localizador: e.data.Ccn,
            Centro: e.data.Centro,
            Direccion: e.data.Direccion,
            Poblacion: e.data.Poblacion,
            Provincia: e.data.Provincia,
        };

        setCentroSeleccionado(datosAdaptados);
        setIsFichaAbierta(true);
    };

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="title"> {t('LISTA CENTROS CONCERTADOS')}</div>

                    <div className="BotonesCombo">
                        <button type="button" className="boton-action">{t('Subir Plantilla')}</button>
                        <button type="button" className="boton-action">{t('Procesar Plantillas')}</button>
                    </div>

                    <div className="table-container">
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={centros}
                            keyExpr="Centro_id"
                            showBorders={true}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            onExporting={onExporting}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
                            onRowDblClick={onRowDblClick}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={25} />
                            <Pager visible={true} allowedPageSizes={true} displayMode="full" showPageSizeSelector showInfo showNavigationButtons />
                            <SearchPanel visible width={240} placeholder={t('buscar')} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible searchMode='contains' />
                            <Selection mode="multiple" allowSelectAll />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled mode="select" />
                            <Export enabled fileName="CentrosConcertados" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <FilterPanel visible />
                            <ColumnFixing enabled />

                            {/* ── COLUMNAS ── */}

                            <Column dataField="Ccn" caption="CCN" width={100} />
                            <Column dataField="Cif" caption="CIF" width={110} />
                            <Column dataField="Centro_id" caption="Centro ID" width={100} />
                            <Column dataField="Centro" caption="Centro" width={180} />
                            <Column dataField="Direccion" caption="Dirección" width={200} />
                            <Column dataField="CP" caption="C.P." width={80} />

                            <Column dataField="Poblacion" caption="Población" width={150} />
                            <Column dataField="Provincia" caption="Provincia" width={130} />

                            <Column dataField="FechaAlta" caption="Fecha Alta" dataType="date" width={110} />
                            <Column dataField="Mapa" caption="Mapa" width={80} />
                            <Column dataField="acciones" caption="Acciones" width={100} />
                        </DataGrid>
                    </div>
                </div>
                {isFichaAbierta && (
                    <FichaCliente 
                        cliente={centroSeleccionado} 
                        onClose={() => setIsFichaAbierta(false)} 
                    />
                )}
            </div>
        </React.Fragment>
    );
};

export default CentrosConcertados;