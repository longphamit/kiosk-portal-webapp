import { Col, DatePicker, Row, Skeleton } from "antd"
import { useEffect, useState } from "react";
import { OrderLineChart } from "../../../components/charts/order_line_chart"
import OrderPieChart from "../../../components/charts/order_pie_chart";
import { LineChartType } from "../../../components/charts/utils";
import { ChartTitle } from "../../../components/general/ChartTitleComponent";
import { MultiItemsSelectComponents } from "../../../components/select/app_select_component";
import { getSystemCommissionByYearAndServiceApplicationIdsServices, getSystemCommissionByYearService } from "../../../services/order_service";
import './../styles.css'
import { rePerformAdminCommissionPieChartData } from "./utils";
import moment from 'moment';
import { toast } from 'react-toastify';

let currentTime = new Date();
const yearFormat = 'YYYY';
const CHART_TITLE = 'Revenue From Service Applications Year ';
export const AdminYearStatistic = ({ lineSpanCol, pieSpanCol, apps }) => {
    const [isYearPieChartLoading, setYearPieChartLoading] = useState(false);
    const [isYearLineChartLoading, setYearLineChartLoading] = useState(false);
    const [yearPieChartData, setYearPieChartData] = useState();
    const [yearLineChartData, setYearLineChartData] = useState();
    const [timeValue, setTimeValue] = useState(currentTime.getFullYear());
    const [selectedServices, setSelectedServices] = useState([])
    const [chartTitle, setChartTitle] = useState(CHART_TITLE + `${currentTime.getFullYear()}`);
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
    const getSystemCommissionByYearAndService = async (year, appIds) => {
        try {
            setYearLineChartLoading(true);
            let res = await getSystemCommissionByYearAndServiceApplicationIdsServices(
                year, appIds);
            setYearLineChartData(res.data.datas)
            setChartTitle(CHART_TITLE + year)
        } catch (e) {
            console.error(e);
            setYearLineChartData(null)
        } finally {
            setYearLineChartLoading(false);
        }
    }

    useEffect(() => {
        getSystemCommissionByYear();
        getSystemCommissionByYearAndService(currentTime.getFullYear(), []);
    }, []);

    const onSelectApps = async (appIds) => {
        setSelectedServices(appIds);
        await getSystemCommissionByYearAndService(timeValue, appIds);
    }
    const onChangeDatePicker = async (value) => {
        if (value === null) {
            toast.warn('Invalid Year!');
            return;
        }
        let year = moment(value).format(yearFormat)
        setTimeValue(year);
        await getSystemCommissionByYearAndService(year, selectedServices);
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
                                <DatePicker
                                    picker="year"
                                    defaultValue={moment(currentTime, yearFormat)}
                                    format={yearFormat}
                                    onChange={value => onChangeDatePicker(value)}
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
                                    <ChartTitle title={chartTitle} />
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
                                <Col span={14}>
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