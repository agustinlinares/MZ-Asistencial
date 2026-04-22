import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
    Scrolling,
    Sorting,
    ColumnFixing,
    Pager,
    Lookup
} from "devextreme-react/data-grid";
import "./ICG.css";

const ICGConciertos = () => {
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);

    useEffect(() => {
        let active = true;

        const loadData = async () => {
            try {
                const response = await fetch("/api/IgcConciertos");
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                if (active) {
                    setRows(Array.isArray(data) ? data : []);
                }
            } catch {
                if (active) {
                    setRows([]);
                }
            }
        };

        loadData();
        return () => {
            active = false;
        };
    }, []);

    return (
        <React.Fragment>
            <div className="col-xxxl-12 col-xxl-12 col-xl-12 col-md-12 col-sm-12 col-12 mzh-xxxl-100 mzh-xxl-100 mzh-xl-100 mzh-md-100 mzh-sm-100 mzh-xs-100 row m-0 p-0">
                <div className="file-box">
                    <div className="title" style={{ padding: "10px 15px", fontSize: "18px", fontWeight: "bold", textTransform: "uppercase" }}>
                        {t("LISTA REGISTROS ICG CONCIERTOS")}
                    </div>

                    <div className="table-container" style={{ padding: "0 20px 20px 20px" }}>
                        <DataGrid
                            dataSource={rows}
                            keyExpr="Id_Icg"
                            showBorders={true}
                            className="mz-table"
                            rowAlternationEnabled={true}
                            showRowLines={true}
                            showColumnLines={true}
                            noDataText={t("Sin datos para mostrar")}
                        >
                            <Scrolling mode="standard" showScrollbar="always" />
                            <Paging defaultPageSize={20} />
                            <Pager
                                visible={true}
                                allowedPageSizes={[10, 20, 50, 100]}
                                showPageSizeSelector={true}
                                showInfo={true}
                                showNavigationButtons={true}
                            />
                            <SearchPanel visible={true} width={240} placeholder={t("buscar")} />
                            <FilterRow visible={true} applyFilter="auto" />
                            <HeaderFilter visible={true} />
                            <Selection mode="multiple" allowSelectAll={true} />
                            <GroupPanel visible={true} placeholder={t("Arrastre una columna aqui para agrupar por dicha columna")} />
                            <Grouping autoExpandAll={false} />
                            <ColumnChooser enabled={true} mode="select" />
                            <Sorting mode="multiple" />
                            <ColumnFixing enabled={true} />

                            <Column dataField="Id_Icg" caption="Id_Icg" width={90} />
                            <Column dataField="Localizador" caption="Localizador" width={130} />
                            <Column dataField="Concierto_id" caption="Concierto_id" width={120} />
                            <Column dataField="CodCASA" caption="Cod. CASA" width={110} />
                            <Column dataField="Mutua" caption="Mutua" width={170} />
                            <Column dataField="Centro_id" caption="Centro_id" width={100} />
                            <Column dataField="Centro" caption="Centro" width={180} />
                            <Column dataField="Poblacion" caption="Poblacion" width={140} />
                            <Column dataField="Provincia" caption="Provincia" width={140} />
                            <Column dataField="AsistenciaSanitaria" caption="Asistencia Sanitar." width={160} />
                            <Column dataField="IncapacidadTemp" caption="Incapacidad Temp." width={160} />
                            <Column dataField="Gastos" caption="Gastos" width={100} format="#,##0.00" />
                            <Column dataField="Articulo25" caption="Articulo 25" width={120} />
                            <Column dataField="Total" caption="Total" width={110} format="#,##0.00" />
                            <Column dataField="Confirmar" caption="Confirmar" width={100} alignment="center">
                                <Lookup
                                    dataSource={[
                                        { id: true, text: "Si" },
                                        { id: false, text: "No" }
                                    ]}
                                    valueExpr="id"
                                    displayExpr="text"
                                />
                            </Column>
                        </DataGrid>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ICGConciertos;