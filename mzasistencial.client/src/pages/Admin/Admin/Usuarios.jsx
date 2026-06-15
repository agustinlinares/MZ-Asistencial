import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UseProtectedRoute from '@hooks/UseProtectedRoute';
import DataGrid, {
    Column, Paging, Pager, SearchPanel, FilterRow, HeaderFilter,
    Selection, GroupPanel, Grouping, ColumnChooser, Toolbar, Item,
    Scrolling, Sorting, ColumnFixing
} from 'devextreme-react/data-grid';
import { usuariosService } from '../../../services/admin/UsuariosService';
import notify from 'devextreme/ui/notify';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { useTranslation } from "react-i18next";
import './Admin.css';

const Usuarios = () => {
    UseProtectedRoute();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dataGridRef = useRef(null);
    const menuRef = useRef(null);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuAbierto, setMenuAbierto] = useState(false);
    


    const loadData = async () => {
        try {
            setLoading(true);
            const data = await usuariosService.getAll();
            setUsuarios(data);
        } catch (error) {
            notify(error.message, 'error', 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleExportarExcel = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        if (!grid) return;
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Usuarios');
        
        exportDataGrid({
            component: grid,
            worksheet,
            autoFilterEnabled: true
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Usuarios.xlsx');
            });
        });
    };

    const handleExportarPDF = () => {
        setMenuAbierto(false);
        const grid = dataGridRef.current.instance();
        if (!grid) return;
        import('devextreme/pdf_exporter').then(({ exportDataGrid: exportPDF }) => {
            import('jspdf').then(({ jsPDF }) => {
                const doc = new jsPDF({ orientation: 'landscape' });
                exportPDF({
                    jsPDFDocument: doc,
                    component: grid,
                    indent: 5,
                }).then(() => {
                    doc.save('Usuarios.pdf');
                });
            });
        });
    };

    const handleNuevo = () => {
        setMenuAbierto(false);
        navigate('/admin/Admin/Usuarios/Ficha/nueva');
    };

    const handleEditar = (cellData) => {
        navigate(`/admin/Admin/Usuarios/Ficha/${cellData.data.usuarioId}`);
    };

    const handleEliminar = async (cellData) => {
        if (!window.confirm(`¿Seguro que deseas dar de baja al usuario ${cellData.data.login}?`)) return;
        
        try {
            await usuariosService.delete(cellData.data.usuarioId);
            notify("Usuario dado de baja", "success", 2000);
            loadData();
        } catch (error) {
            notify(error.message, "error", 3000);
        }
    };

    const actionCellRender = (cellData) => {
        const { activo } = cellData.data;
        return (
            <div className="ficha-row-actions">
                <i 
                    className="ri-edit-line edit-icon" 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditar(cellData);
                    }}
                    title={t('Editar')}
                />
                {activo && (
                    <i 
                        className="ri-delete-bin-line delete-icon" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEliminar(cellData);
                        }}
                        title={t('Dar de baja')}
                    />
                )}
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">
                    <div className="header-page">
                        <div className="title">
                            {t('Lista Usuarios')}
                        </div>
                        <div className="header-actions-side">
                            <div className="acciones-container" ref={menuRef}>
                                <div className="acciones-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
                                    <i className="ri-settings-3-line"></i>
                                    {t('Acciones')}
                                </div>

                                {menuAbierto && (
                                    <div className="acciones-menu">
                                        <div className="acciones-item" onClick={handleNuevo}>
                                            <i className="ri-add-line" style={{ color: '#1976d2' }}></i>
                                            {t('Nuevo')}
                                        </div>

                                        <div className="acciones-item" onClick={handleExportarExcel}>
                                            <i className="ri-file-excel-2-line" style={{ color: '#2e7d32' }}></i>
                                            {t('Exportar a Excel')}
                                        </div>

                                        <div className="acciones-item" onClick={handleExportarPDF}>
                                            <i className="ri-file-pdf-line" style={{ color: '#c62828' }}></i>
                                            {t('Exportar a PDF')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="table-container tabla-contenedor">
                        <div className="grid-wrapper-usuarios" style={{ height: 'calc(100vh - 190px)', width: '100%' }}>
                            <DataGrid
                                ref={dataGridRef}
                                dataSource={usuarios}
                                showBorders={true}
                                rowAlternationEnabled={true}
                                columnAutoWidth={true}
                                className="mz-table"
                                height="100%"
                            >
                                <Scrolling mode="standard" showScrollbar="always" />
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[10, 20, 50, 100]} displayMode="full" showPageSizeSelector={true} showInfo={true} showNavigationButtons={true} />
                                
                                <Toolbar>
                                    <Item location="after" name="searchPanel" />
                                    <Item location="after" name="columnChooserButton" />
                                </Toolbar>

                                <SearchPanel visible={true} width={240} placeholder={t('Buscar...')} />
                                <FilterRow visible={true} applyFilter="auto" />
                                <HeaderFilter visible={true} />
                                <Selection mode="single" />
                                <GroupPanel visible={true} />
                                <Grouping autoExpandAll={false} />
                                <ColumnChooser enabled={true} mode="select" />
                                <Sorting mode="multiple" />
                                <ColumnFixing enabled={true} />

                                <Column dataField="login" caption={t('Usuario')} />
                                <Column dataField="nombre" caption={t('Nombre')} />
                                <Column dataField="apellidos" caption={t('Apellidos')} />
                                <Column dataField="perfilNombre" caption={t('Perfil')} />
                                <Column dataField="direccionElectronica" caption={t('Dirección Electrónica')} />
                                <Column dataField="mutuaNombre" caption={t('Mutua')} />
                                <Column dataField="centroNombre" caption={t('Centro Asociado')} />
                                <Column dataField="permisoQlikSense" caption={t('Permiso Qlik Sense')} dataType="boolean" alignment="left" cssClass="qlik-sense-col" />
                                <Column caption={t('Acciones')} cellRender={actionCellRender} width={120} alignment="center" />
                            </DataGrid>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Usuarios;