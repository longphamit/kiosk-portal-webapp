import { Col, Row, Skeleton } from "antd"
import { useEffect, useState } from "react";
import { OrderLineChart } from "../../../components/charts/order_line_chart"
import OrderPieChart from "../../../components/charts/order_pie_chart";
import { LineChartType } from "../../../components/charts/utils";
import { ChartTitle } from "../../../components/general/ChartTitleComponent";
import { MultiItemsSelectComponents } from "../../../components/select/app_select_component";
import { getSystemCommissionByMonthAndServiceApplicationIdsServices, getSystemCommissionByMonthService } from "../../../services/order_service";
import './../styles.css'
import { rePerformAdminCommissionPieChartData } from "./utils";

let currentTime = new Date();
export const AdminMonthStatistic = ({ lineSpanCol, pieSpanCol, apps }) => {
    const [isMonthPieChartLoading, setMonthPieChartLoading] = useState(false);
    const [monthPieChartData, setMonthPieChartData] = useState();
    const [isMonthLineChartLoading, setMonthLineChartLoading] = useState(false);
    const [monthLineChartData, setMonthLineChartData] = useState();
    useEffect(() => {
        getSystemCommissionByMonth();
        getSystemCommissionByMonthAndService([]);
    }, []);
    const getSystemCommissionByMonth = async () => {
        try {
            setMonthPieChartLoading(true);
            let res = await getSystemCommissionByMonthService(currentTime.getMonth() + 1, currentTime.getFullYear());
            setMonthPieChartData(rePerformAdminCommissionPieChartData(res.data));
        } catch (e) {
            console.error(e);
            setMonthPieChartData(null)
        } finally {
            setMonthPieChartLoading(false);
        }
    }

    const getSystemCommissionByMonthAndService = async (appIds) => {
        try {
            setMonthLineChartLoading(true);
            let res = await getSystemCommissionByMonthAndServiceApplicationIdsServices(
                currentTime.getMonth() + 1, currentTime.getFullYear(), appIds);
            setMonthLineChartData(res.data.datas)
        } catch (e) {
            console.error(e);
            setMonthLineChartData(null)
        } finally {
            setMonthLineChartLoading(false);
        }
    }
    const onSelectApps = async (appIds, type) => {
        await getSystemCommissionByMonthAndService(appIds);
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
                        !isMonthLineChartLoading ?
                            monthLineChartData ?
                                <>
                                    <Row justify='center' align='center' >
                                        <Col span={20}>
                                            <OrderLineChart
                                                datas={monthLineChartData}
                                                type={LineChartType.Month}
                                                labelName={'serviceApplicationName'}
                                                aspectRatio={2}
                                            />
                                        </Col>
                                    </Row>
                                    <ChartTitle title={`Revenue From Service Applications ${currentTime.getMonth() + 1 + '/' + currentTime.getFullYear()}`} />
                                </>
                                :
                                null :
                            <Skeleton />
                    }
                </div>
            </Col>
            {!isMonthPieChartLoading ?
                monthPieChartData ?
                    <Col span={pieSpanCol}>
                        <div style={{ height: 300 }} className="count-chart-box">
                            <Row justify='center' align='middle'>
                                <Col span={16}>
                                    <OrderPieChart key={'year-pie-char'} orders={monthPieChartData} />
                                </Col>
                            </Row>
                            <ChartTitle title={`Revenue From Service Applications ${currentTime.getMonth() + 1 + '/' + currentTime.getFullYear()}`} />

                        </div>
                    </Col>
                    : null :
                <Skeleton />
            }
        </Row>
    </>
}