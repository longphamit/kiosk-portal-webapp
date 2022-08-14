import { Col, Row, Skeleton } from "antd"
import { useEffect, useState } from "react";
import { OrderLineChart } from "../../../components/charts/order_line_chart"
import OrderPieChart from "../../../components/charts/order_pie_chart";
import { LineChartType } from "../../../components/charts/utils";
import { ChartTitle } from "../../../components/general/ChartTitleComponent";
import { MultiItemsSelectComponents } from "../../../components/select/app_select_component";
import { getSystemCommissionByYearAndServiceApplicationIdsServices, getSystemCommissionByYearService } from "../../../services/order_service";
import './../styles.css'
import { rePerformAdminCommissionPieChartData } from "./utils";

let currentTime = new Date();
export const AdminYearStatistic = ({ lineSpanCol, pieSpanCol, apps }) => {
    const [isYearPieChartLoading, setYearPieChartLoading] = useState(false);
    const [isYearLineChartLoading, setYearLineChartLoading] = useState(false);
    const [yearPieChartData, setYearPieChartData] = useState();
    const [yearLineChartData, setYearLineChartData] = useState();
    const getSystemCommissionByYear = async () => {
        try {
            setYearPieChartLoading(true);
            let res = await getSystemCommissionByYearService(currentTime.getFullYear());
            setYearPieChartData(rePerformAdminCommissionPieChartData(res.data));
        } catch (e) {
            console.error(e);
            setYearPieChartData(null)
        } finally {
            setYearPieChartLoading(false);
        }
    }
    const getSystemCommissionByYearAndService = async (appIds) => {
        try {
            setYearLineChartLoading(true);
            let res = await getSystemCommissionByYearAndServiceApplicationIdsServices(
                currentTime.getFullYear(), appIds);
            setYearLineChartData(res.data.datas)
        } catch (e) {
            console.error(e);
            setYearLineChartData(null)
        } finally {
            setYearLineChartLoading(false);
        }
    }

    useEffect(() => {
        getSystemCommissionByYear();
        getSystemCommissionByYearAndService([]);
    }, []);

    const onSelectApps = async (appIds, type) => {
        await getSystemCommissionByYearAndService(appIds);
    }
    return <>
        <Row>
            <Col span={lineSpanCol}>
                <div style={{ height: 300 }} className="count-chart-box">
                    {
                        apps && apps.length !== 0 ?
                            <Row style={{ marginBottom: 20 }}>
                                <MultiItemsSelectComponents
                                    items={apps}
                                    style={{ width: '50%' }}
                                    onChange={onSelectApps}
                                    placeholder="Choose Service Applications"
                                />
                            </Row> : null
                    }
                    {
                        !isYearLineChartLoading ?
                            yearLineChartData ?
                                <>
                                    <Row justify='center' align='center' >
                                        <Col span={20}>
                                            <OrderLineChart
                                                datas={yearLineChartData}
                                                type={LineChartType.Year}
                                                labelName={'serviceApplicationName'}
                                                aspectRatio={2}
                                            />
                                        </Col>
                                    </Row>
                                    <ChartTitle title={`Revenue From Service Applications Year ${currentTime.getFullYear()}`} />
                                </>
                                :
                                null :
                            <Skeleton />
                    }
                </div>
            </Col>

            {!isYearPieChartLoading ?
                yearPieChartData ?
                    <Col span={pieSpanCol}>
                        <div style={{ height: 300 }} className="count-chart-box">
                            <Row justify='center' align='middle'>
                                <Col span={16}>
                                    <OrderPieChart key={'year-pie-char'} orders={yearPieChartData} />
                                </Col>
                            </Row>
                            <ChartTitle title={`Revenue From Service Applications Year ${currentTime.getFullYear()}`} />
                        </div>
                    </Col>
                    : null :
                <Skeleton />
            }
        </Row>
    </>
}