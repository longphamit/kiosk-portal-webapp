import { Col, DatePicker, Row, Select, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EmptyCard } from "../../../../../@app/components/card/empty_card";
import OrderPieChart from "../../../../components/charts/order_pie_chart";
import { getKisokOrderCommissionByMonthService, getKisokOrderCommissionByYearService, getKisokOrderCommissionService } from "../../../../services/order_service";
import moment from 'moment'
import { randomColor } from "../../../../../@app/utils/chart_util";
import { FilterChartType } from "../../../../components/charts/utils";

const TITLE_PIE_STATISTIC_ALL = `Revenue statistic`
export const PieChartComponent = ({ kioskId }) => {
    const [orders, setOrders] = useState();
    const { Option } = Select;
    const [filterPieChart, setFilterPieChart] = useState(FilterChartType.All);
    const [isPieChartLoading, setPieChartLoading] = useState(false)
    const [titlePieChart, setTitlePieChart] = useState(TITLE_PIE_STATISTIC_ALL);
    useEffect(() => {
        getListOrderFunction();
    }, []);
    const filterChartFunction = (value) => {
        switch (value) {
            case FilterChartType.Year:
                return <DatePicker picker="year" onChange={value => onChangeDatePicker(value, 'year')} />;
            case FilterChartType.Month:
                return <DatePicker picker="month" onChange={value => onChangeDatePicker(value, 'month')} />;
            default:
                return null;
        }
    }
    const onChangeFilterPieChart = async (value) => {
        if (value === 0) {
            await getListOrderFunction();
            setTitlePieChart(TITLE_PIE_STATISTIC_ALL)
        }
        setFilterPieChart(value)
    }
    const onChangeDatePicker = (value, type) => {
        if (value === null || value === 'invalid data.') {
            toast.warn('The time is invalid. Please choose again!')
            return;
        }
        let time = ''
        if (type === 'month') {
            time = moment(value).format('M/YYYY');
        } else {
            time = moment(value).format('YYYY');
        }
        showPieChart(time)
    }

    const getOrdersByMonth = async (month, year) => {
        try {
            setPieChartLoading(true);
            const res = await getKisokOrderCommissionByMonthService(month, year, kioskId)
            setOrders(res.data);
        } catch (error) {
            setOrders(null)
            console.error(error);
        } finally {
            setPieChartLoading(false);
        }
    }

    const getOrdersByYear = async (year) => {
        try {
            setPieChartLoading(true);
            const res = await getKisokOrderCommissionByYearService(year, kioskId)
            setOrders(res.data);
        } catch (error) {
            setOrders(null)
            console.error(error);
        } finally {
            setPieChartLoading(false);
        }
    }
    const showPieChart = async (time) => {
        let year;
        let title = ''
        switch (filterPieChart) {
            case FilterChartType.Year:
                year = time;
                title = `Revenue of year ${time}`
                await getOrdersByYear(year)
                break;
            case FilterChartType.Month:
                let temp = time.split('/')
                let month = temp[0]
                year = temp[1];
                title = `Revenue of ${time}`
                await getOrdersByMonth(month, year);
                break;
            default:
                title = `Revenue statistic`
                await getListOrderFunction();
                break;
        }
        setTitlePieChart(title);
    }
    const getListOrderFunction = async () => {
        try {
            setPieChartLoading(true);
            const res = await getKisokOrderCommissionService(kioskId, '')
            if (res.data.length == 0) {
                setOrders(null);
            } else {
                const colors = res.data.map(e => randomColor());
                const data = {
                    labels: res.data.map(e => e.serviceApplicationName),
                    datasets: [
                        {
                            data: res.data.map(e => e.totalCommission),
                            backgroundColor: colors,
                            hoverBackgroundColor: colors
                        }
                    ]
                }
                setOrders(data);
            }
        } catch (error) {
            setOrders(null)
            console.error(error);
        } finally {
            setPieChartLoading(false);
        }
    };
    return <div id="pie-chart-div" style={{ marginBottom: 50 }}>
        <div style={{ marginTop: 20, marginBottom: 20 }} id='select-pie-div'>
            <Select defaultValue='All' style={{ width: 120 }} onChange={(value) => { onChangeFilterPieChart(value) }} key={`pie-chart-select`}>
                <Option key={`pie-chart-option-1`} value={FilterChartType.All}>All</Option>
                <Option key={`pie-chart-option-2`} value={FilterChartType.Month}>Month</Option>
                <Option key={`pie-chart-option-3`} value={FilterChartType.Year}>Year</Option>
            </Select>
            {/* Select for Month and Year */}
            {filterChartFunction(filterPieChart)}
        </div >
        {
            !isPieChartLoading ?
                orders ?
                    orders.length === 0 || orders.datasets.length === 0 ?
                        <>
                            <EmptyCard styles={{ marginTop: 50 }} />
                        </> :
                        <>
                            <div style={{ minWidth: 700 }}>
                                <Row justify='center' align='center' >
                                    <Col span={8}>
                                        <OrderPieChart key={'order-pie-char'} orders={orders} />
                                    </Col>
                                </Row>
                                <Row justify='center' align='center' style={{ marginTop: 15, marginLeft: -100 }}>
                                    {titlePieChart}
                                </Row>
                            </div>
                        </> :
                    <>
                        <EmptyCard styles={{ marginTop: 50 }} />
                    </>
                : <Skeleton />
        }
    </div>
}