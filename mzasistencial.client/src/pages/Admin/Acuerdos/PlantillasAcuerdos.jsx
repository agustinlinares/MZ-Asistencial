import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Acuerdos.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
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

// POP UP PLANTILLA
import { useTranslation } from "react-i18next";
import Popup from "devextreme-react/popup";
import SelectBox from "devextreme-react/select-box";
import TextBox from "devextreme-react/text-box";
import FileUploader from "devextreme-react/file-uploader";
import Button from "devextreme-react/button";

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const sampleData = [];

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

const PlantillasAcuerdos = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [acuerdos, setAcuerdos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5118/api/PlantillasAcuerdo')
            .then(response => response.json())
            .then(data => setAcuerdos(data))
            .catch(error => console.error('Error al cargar acuerdos:', error));
    }, []);
    return (
        
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">

                    <div className="title"> {t('PLANTILLAS DE ACUERDOS')}</div>

                    <div className="BotonesCombo">
                        <button 
                            type="button" 
                            className="boton-action"
                            onClick={() => setPopupVisible(true)}
                        >
                            <i className="ri-search-line"></i> {t('Subir Plantilla')}
                        </button>
                        <button type="button" className="boton-action">{t('Procesar Plantillas')}</button>
                    </div>

                    <div className="table-container">
                        <DataGrid
                            ref={dataGridRef}
                            dataSource={acuerdos}
                            keyExpr="id"
                            showBorders={true}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            onExporting={onExporting}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            wordWrapEnabled={false}
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
                            <Export enabled fileName="Casos" allowExportSelectedData />
                            <Sorting mode="multiple" />
                            <FilterPanel visible />
                            <ColumnFixing enabled />



                            {/* ── COLUMNAS ─────────────────────────────────────────────────── */}

                            <Column dataField="informe" caption="Informe" />
                            <Column dataField="estadoInforme" caption="Estado Informe" />
                            <Column dataField="tipoAcuerdo" caption="Tipo de acuerdo" />
                            <Column dataField="mutua" caption="Mutua" />
                            <Column dataField="año" caption="Año" />
                            <Column dataField="mes" caption="Mes" />
                            <Column dataField="usuario" caption="Usuario" />
                            <Column dataField="fechaAlta" caption="Fecha Alta" />
                        </DataGrid>
                    </div>
                </div>
            </div>

            <Popup
                visible={popupVisible}
                onHiding={() => setPopupVisible(false)}
                dragEnabled={true}
                closeOnOutsideClick={true}
                showCloseButton={true}
                title="FICHA DOC. ADJUNTO"
                width={700}
                height="auto"
            >
                <div className="popup-container">
                    {/* BOTONES */}
                    <div className="popup-actions">
                        <Button
                            text="Aceptar"
                            type="success"
                            icon="check"
                            onClick={() => setPopupVisible(false)}
                        />
                        <Button
                            text="Salir"
                            type="danger"
                            icon="close"
                            onClick={() => setPopupVisible(false)}
                        />
                    </div>

                    {/* FILA 1 */}
                    <div className="popup-row">
                        <div className="popup-field">
                            <label>Mutua</label>
                            <SelectBox items={["ENTIDAD 1", "ENTIDAD 2", "ENTIDAD 3"]} />
                        </div>

                        <div className="popup-field">
                            <label>Año</label>
                            <SelectBox items={["2024", "2025", "2026"]} />
                        </div>
                    </div>

                    {/* FILA 2 */}
                    <div className="popup-row">
                        <div className="popup-field full">
                            <label>Acuerdo</label>
                            <SelectBox items={["Acuerdo 1", "Acuerdo 2"]} />
                        </div>
                    </div>

                    {/* FILE */}
                    <div className="popup-row">
                        <div className="popup-field full">
                            <label>Fichero</label>
                            <FileUploader
                                selectButtonText="Examinar..."
                                labelText="Seleccionar un archivo..."
                                uploadMode="useForm"
                            />
                        </div>
                    </div>

                    {/* INFO */}
                    <div className="popup-row">
                        <div className="popup-field">
                            <label>Usuario</label>
                            <TextBox value="ecua1" readOnly />
                        </div>

                        <div className="popup-field">
                            <label>Fecha de Subida</label>
                            <TextBox value={new Date().toLocaleString()} readOnly />
                        </div>
                    </div>

                </div>
            </Popup>

        </React.Fragment>
    );
};

export default PlantillasAcuerdos;