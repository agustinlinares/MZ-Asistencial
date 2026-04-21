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
    Lookup,
    Editing
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
    const [mutuasList, setMutuasList] = useState([]);
    const currentYear = new Date().getFullYear();
    const añosList = Array.from({ length: currentYear - 2008 + 1 }, (_, i) => 2008 + i).reverse();

    const [formData, setFormData] = useState({
        mutua: "",
        año: currentYear,
        informe: "",
        estadoInforme: "1",
        tipoAcuerdo: "Bilateral",
        mes: new Date().getMonth() + 1
    });
    const navigate = useNavigate();

    const fetchAcuerdos = () => {
        fetch('/api/PlantillasAcuerdo')
            .then(response => response.json())
            .then(data => setAcuerdos(data))
            .catch(error => console.error('Error al cargar acuerdos:', error));
    };

    const fetchMutuas = () => {
        fetch('/api/mutuas')
            .then(response => response.json())
            .then(data => setMutuasList(data.map(m => m.mutua)))
            .catch(error => console.error('Error al cargar mutuas:', error));
    };

    useEffect(() => {
        fetchAcuerdos();
        fetchMutuas();
    }, []);

    const onRowUpdating = (e) => {
        const updatedData = { ...e.oldData, ...e.newData };
        fetch(`/api/PlantillasAcuerdo/${e.key}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .catch(error => console.error('Error al actualizar:', error));
    };

    const onRowRemoving = (e) => {
        fetch(`/api/PlantillasAcuerdo/${e.key}`, {
            method: 'DELETE'
        })
        .catch(error => console.error('Error al eliminar:', error));
    };

    const handleSave = () => {
        fetch('/api/PlantillasAcuerdo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                setPopupVisible(false);
                fetchAcuerdos();
            }
        })
        .catch(error => console.error('Error al guardar:', error));
    };
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
                            onRowUpdating={onRowUpdating}
                            onRowRemoving={onRowRemoving}
                        >
                            <Editing
                                mode="row"
                                allowUpdating={true}
                                allowDeleting={true}
                                useIcons={true}
                            />
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
                showCloseButton={false}
                title="FICHA DOC. ADJUNTO"
                width={700}
                height="auto"
                className="popup-ficha-doc"
            >
                <Toolbar itemVisible={true}>
                    <Item
                        widget="dxButton"
                        toolbar="top"
                        location="after"
                        options={{
                            text: "Aceptar",
                            type: "default",
                            icon: "check",
                            onClick: handleSave,
                            elementAttr: { class: "btn-aceptar-popup" }
                        }}
                    />
                    <Item
                        widget="dxButton"
                        toolbar="top"
                        location="after"
                        options={{
                            text: "Salir",
                            type: "normal",
                            icon: "close",
                            onClick: () => setPopupVisible(false),
                            elementAttr: { class: "btn-salir-popup" }
                        }}
                    />
                </Toolbar>

                <div className="popup-container">
                    {/* FILA 1: Mutua y Año */}
                    <div className="popup-row">
                        <div className="popup-field">
                            <label>Mutua</label>
                            <SelectBox 
                                items={mutuasList} 
                                value={formData.mutua}
                                onValueChanged={(e) => setFormData({...formData, mutua: e.value})}
                                placeholder=""
                            />
                        </div>

                        <div className="popup-field">
                            <label>Año</label>
                            <SelectBox 
                                items={añosList} 
                                value={formData.año}
                                onValueChanged={(e) => setFormData({...formData, año: e.value})}
                                placeholder=""
                            />
                        </div>
                    </div>

                    {/* FILA 2: Acuerdo */}
                    <div className="popup-row">
                        <div className="popup-field full">
                            <label>Acuerdo</label>
                            <SelectBox 
                                items={["Acuerdo 1", "Acuerdo 2", "Acuerdo 3"]}
                                value={formData.informe}
                                onValueChanged={(e) => setFormData({...formData, informe: e.value})}
                                placeholder=""
                            />
                        </div>
                    </div>

                    {/* FILA 3: Fichero */}
                    <div className="popup-row mt-3">
                        <div className="popup-field full">
                            <label>Fichero</label>
                            <div className="file-uploader-custom">
                                <FileUploader
                                    selectButtonText="Examinar..."
                                    labelText="Seleccionar un archivo..."
                                    uploadMode="useForm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* FILA 4: Info Usuario y Fecha */}
                    <div className="popup-row mt-2">
                        <div className="popup-field">
                            <label>Usuario</label>
                            <TextBox value="TestDev" readOnly stylingMode="filled" />
                        </div>

                        <div className="popup-field">
                            <label>Fecha de Subida</label>
                            <TextBox value={new Date().toLocaleString()} readOnly stylingMode="filled" />
                        </div>
                    </div>
                </div>
            </Popup>

        </React.Fragment>
    );
};

export default PlantillasAcuerdos;