import React, { useEffect, useRef, useState } from "react";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import { Workbook } from 'exceljs';
import './Centros.css';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FichaCliente from './FichaCliente';
import DataGrid, { Column, Paging, SearchPanel, FilterRow, HeaderFilter, Selection, GroupPanel, Grouping, ColumnChooser, Export, Scrolling, Sorting, ColumnFixing, Pager } from "devextreme-react/data-grid";

const API_URL = "/api/CentrosPropios";

const onExporting = (e) => {
    e.component.beginUpdate();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({ component: e.component, worksheet, autoFilterEnabled: true }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CentrosPropios.xlsx');
        });
    });
    e.cancel = true;
};

const MapaCell = (cell) => {
    const d = cell.data;
    if (d.latitud && d.longitud) {
        return React.createElement('a', {
            href: 'https://maps.google.com/?q=' + d.latitud + ',' + d.longitud,
            target: '_blank',
            rel: 'noreferrer',
            onClick: (e) => e.stopPropagation(),
            style: { color: '#1976d2', textDecoration: 'none' }
        }, 'Ver');
    }
    return React.createElement('span', { style: { color: '#aaa' } }, '-');
};

const DesactivadoCell = (cell) => {
    return React.createElement('span', {
        style: {
            display: 'inline-block', padding: '2px 10px', borderRadius: '10px',
            fontSize: '11px', fontWeight: 600,
            background: cell.value ? '#ffebee' : '#e8f5e9',
            color: cell.value ? '#c62828' : '#2e7d32'
        }
    }, cell.value ? 'Si' : 'No');
};

const CentrosPropios = () => {
    const { t } = useTranslation();
    const dataGridRef = useRef(null);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [centros, setCentros] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(API_URL)
            .then(res => { if (!res.ok) throw new Error('Error ' + res.status); return res.json(); })
            .then(data => setCentros(data))
            .catch(err => console.error('Error cargando centros:', err));
    }, []);

    return (
        React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0' },
                React.createElement('div', { className: 'file-box' },
                    React.createElement('div', { className: 'title', style: { padding: '10px 15px', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' } },
                        t('LISTA CENTROS PROPIOS')
                    ),
                    React.createElement('div', { className: 'table-container', style: { padding: '0 20px 20px 20px', position: 'relative' } },
                        selectedCliente && React.createElement(FichaCliente, { cliente: selectedCliente, onClose: () => setSelectedCliente(null) }),
                        React.createElement(DataGrid, {
                            ref: dataGridRef, dataSource: centros, keyExpr: 'centroId',
                            showBorders: true, columnAutoWidth: false, allowColumnResizing: true,
                            onExporting: onExporting, className: 'mz-table', rowAlternationEnabled: true,
                            showRowLines: true, showColumnLines: true, wordWrapEnabled: false,
                            noDataText: t('Sin datos para mostrar'), onRowDblClick: (e) => setSelectedCliente(e.data)
                        },
                            React.createElement(Scrolling, { mode: 'standard', showScrollbar: 'always' }),
                            React.createElement(Paging, { defaultPageSize: 20 }),
                            React.createElement(Pager, { visible: true, allowedPageSizes: [10, 20, 50, 100], displayMode: 'full', showPageSizeSelector: true, showInfo: true, showNavigationButtons: true }),
                            React.createElement(SearchPanel, { visible: true, width: 240, placeholder: t('buscar') }),
                            React.createElement(FilterRow, { visible: true, applyFilter: 'auto' }),
                            React.createElement(HeaderFilter, { visible: true }),
                            React.createElement(Selection, { mode: 'multiple', allowSelectAll: true }),
                            React.createElement(GroupPanel, { visible: true }),
                            React.createElement(Grouping, { autoExpandAll: false }),
                            React.createElement(ColumnChooser, { enabled: true, mode: 'select' }),
                            React.createElement(Export, { enabled: true, allowExportSelectedData: true }),
                            React.createElement(Sorting, { mode: 'multiple' }),
                            React.createElement(ColumnFixing, { enabled: true }),
                            React.createElement(Column, { dataField: 'localizador', caption: 'Localizador', width: 110 }),
                            React.createElement(Column, { dataField: 'centroId', caption: 'No', width: 80 }),
                            React.createElement(Column, { dataField: 'mutuaId', caption: 'Mutua', width: 90 }),
                            React.createElement(Column, { dataField: 'codigoMz', caption: 'Centro ID', width: 100 }),
                            React.createElement(Column, { dataField: 'centro', caption: 'Centro', width: 200 }),
                            React.createElement(Column, { dataField: 'cp', caption: 'C.P.', width: 80 }),
                            React.createElement(Column, { dataField: 'provincia', caption: 'Provincia', width: 130 }),
                            React.createElement(Column, { dataField: 'poblacionId', caption: 'Poblacion', width: 100 }),
                            React.createElement(Column, { dataField: 'telefono', caption: 'Telefono', width: 120 }),
                            React.createElement(Column, { dataField: 'latitud', caption: 'Mapa', width: 90, alignment: 'center', cellRender: MapaCell }),
                            React.createElement(Column, { dataField: 'desactivado', caption: 'Desactivado', width: 110, alignment: 'center', cellRender: DesactivadoCell }),
                            React.createElement(Column, { caption: 'Acciones', width: 80, fixed: true, fixedPosition: 'right', alignment: 'center', cellRender: () => React.createElement('div', { style: { color: '#2f5da8', cursor: 'pointer', textAlign: 'center' } }, React.createElement('i', { className: 'ri-edit-line' })) })
                        )
                    )
                )
            )
        )
    );
};

export default CentrosPropios;



