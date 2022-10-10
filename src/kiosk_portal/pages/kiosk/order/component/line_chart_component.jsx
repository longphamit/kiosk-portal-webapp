import { Col, DatePicker, Row, Select, Skeleton } from "antd"
import { useEffect, useState } from "react";
import { EmptyCard } from "../../../../../@app/components/card/empty_card"
import { OrderLineChart } from "../../../../components/charts/order_line_chart"
import { getKisokOrderCommissionByMonthAndAppsService, getKisokOrderCommissionByYearAndAppsService } from "../../../../services/order_service";
import moment from 'moment';
import { toast } from "react-toastify";
import { FilterChartType, LineChartType } from "../../../../components/charts/utils";
import { ChartTitleStyle } from "./utils";

const TITLE_LINE_STATISTIC_YEAR = `Revenue of year `
const currentTime = new Date();
export const LineChartComponent = ({ kioskId, apps }) => {
    const { Option } = Select;
    const [filterLineChart, setFilterLineChart] = useState(FilterChartType.Year);
    const [lineChartData, setLineChartData] = useState();
    const [selectedFilterLineChartItems, setSelectedFilterLineChartItems] = useState([]);
    const [lineChartType, setLineChartType] = useState(LineChartType.Year);
    const [isLineChartLoading, setLineChartLoading] = useState(false)
    const [hasData, setHasData] = useState(true);
    const [warningMsg, setWarningMsg] = useState('')
    const [titleLineChart, setTitleLineChart] = useState(TITLE_LINE_STATISTIC_YEAR + currentTime.getFullYear());
    const filteredLineChartOptions = apps.filter((o) => !selectedFilterLineChartItems.includes(o))
    const [valueDatePickerYear, setValueDatePickerYear] = useState(currentTime.getFullYear());
    const [valueDatePickerMonth, setValueDatePickerMonth] = useState(currentTime.getMonth() + 1 + '/' + currentTime.getFullYear())
    const [timeValue, setTimeValue] = useState()
    const yearFormat = 'YYYY';

    useEffect(() => {
        getDataLineChartByYear(currentTime.getFullYear(), apps.map((e) => e.serviceApplicationId))
    }, []);

    const getDataLineChartByYear = async (year, ids) => {
        try {
            setLineChartLoading(true)
            setLineChartType(LineChartType.Year)
            let res = await getKisokOrderCommissionByYearAndAppsService(year, kioskId, ids)
            setTimeValue('Year ' + year)
            checkDataLineChart(res.data.datas)
            setLineChartData(res.data.datas)
        } catch (e) {
            console.error(e);
            setLineChartData(null)
        } finally {
            setLineChartLoading(false)
        }
    }

    const checkDataLineChart = (datas) => {
        let noData = true;
        datas.map((e) => {
            if (e.datasets.length !== 0) {
                noData = false;
                return;
            }
        })
        noData ? setHasData(false) : setHasData(true)
    }

    const filterChartFunction = (value) => {
        switch (value) {
            case FilterChartType.Year:
                return <DatePicker
                    picker="year"
                    defaultValue={moment(currentTime, yearFormat)}
                    format={yearFormat}
                    onChange={value => onChangeDatePicker(value, 'year')}
                />;
            case FilterChartType.Month:
                return <DatePicker
                    picker="month"
                    onChange={value => onChangeDatePicker(value, 'month')}
                />;
            default:
                return null;
        }
    }

    const onChangeSelectedApps = (value) => {
        setSelectedFilterLineChartItems(value);
        showLineChart(filterLineChart === FilterChartType.Year ? valueDatePickerYear : valueDatePickerMonth, value)
    }

    const onChangeDatePicker = (value, type) => {
        if (value === null || value === 'invalid data.') {
            toast.warn('The time is invalid. Please choose again!')
            return;
        }
        let time = ''
        if (type === 'month') {
            time = moment(value).format('M/YYYY');
            setValueDatePickerMonth(time);
        } else {
            time = moment(value).format('YYYY');
            setValueDatePickerYear(time)
        }
        showLineChart(time, null);
    }

    const onChangeSetWarningMsg = (items) => {
        let checkList = items ?? selectedFilterLineChartItems;
        if (checkList.length === 0) {
            setWarningMsg("*Choose applications.")
        } else {
            setWarningMsg('')
        }
    }

    const showLineChart = async (time, items) => {
        let year;
        let title = ''
        onChangeSetWarningMsg(items);
        switch (filterLineChart) {
            case FilterChartType.Year:
                year = time;
                title = `Revenue of year ${time}`
                await getDataLineChartByYear(year, items ? items : selectedFilterLineChartItems);
                break;
            case FilterChartType.Month:
                let temp = time.split('/')
                let month = temp[0]
                year = temp[1];
                title = `Revenue of ${time}`
                await getDataLineChartByMonth(month, year, items ? items : selectedFilterLineChartItems);
                break;
            default:
                break;
        }
        setTitleLineChart(title);
    }

    const onChangeFilterLineChart = async (value) => {
        let title = ''
        if (value === FilterChartType.Year) {
            await getDataLineChartByYear(valueDatePickerYear, selectedFilterLineChartItems);
            title = `Revenue of year ${valueDatePickerYear}`
        } else if (value === FilterChartType.Month) {
            let parts = valueDatePickerMonth.split('/');
            title = `Revenue of ${valueDatePickerMonth}`
            await getDataLineChartByMonth(parts[0], parts[1], selectedFilterLineChartItems);
        }
        setTitleLineChart(title);
        setFilterLineChart(value)
    }

    const getDataLineChartByMonth = async (month, year, ids) => {
        try {
            setLineChartLoading(true)
            setLineChartType(LineChartType.Month)
            let res = await getKisokOrderCommissionByMonthAndAppsService(month, year, kioskId, ids)
            setTimeValue(`${month}/${year}`)
            checkDataLineChart(res.data.datas)
            setLineChartData(res.data.datas)
        } catch (e) {
            console.error(e);
            setLineChartData(null)
        } finally {
            setLineChartLoading(false)
        }
    }

    return <>
        {
            selectedFilterLineChartItems ?
                <div id="line-chart-div">
                    <div id='select-chart-div'>
                        <Select
                            defaultValue={FilterChartType.Year}
                            style={{ width: 120 }}
                            onChange={(value) => { onChangeFilterLineChart(value) }}
                            key={`line-chart-select`}
                        >
                            <Option key={`line-chart-option-2`} value={FilterChartType.Month}>Month</Option>
                            <Option key={`line-chart-option-3`} value={FilterChartType.Year}>Year</Option>
                        </Select>
                        {/* Select for Month and Year */}
                        {filterChartFunction(filterLineChart)}
                        <Select
                            mode="multiple"
                            placeholder="Inserted the application names"
                            onChange={(value) => onChangeSelectedApps(value)}
                            style={{
                                width: '40%',
                            }}
                        >
                            {filteredLineChartOptions.map((item) => (
                                <Select.Option key={item.id + '&'} value={item.serviceApplicationId}>
                                    {item.serviceApplicationName}
                                </Select.Option>
                            ))}
                        </Select>
                        <label style={{ paddingLeft: 20, color: '#F7C600', fontStyle: 'italic', fontWeight: 'bold' }}>
                            {warningMsg}
                        </label>
                    </div>
                    <div style={{ marginBottom: 50, marginTop: 50 }}>
                        {!isLineChartLoading ?
                            lineChartData && hasData ?
                                <>
                                    <Row justify='center' align='center' >
                                        <Col span={20}>
                                            <OrderLineChart
                                                datas={lineChartData}
                                                type={lineChartType}
                                                labelName={'serviceApplicationName'}
                                                aspectRatio={1}
                                            />
                                        </Col>
                                    </Row>
                                    <Row justify='center' align='center' style={{ marginTop: 15 }}>
                                        <p style={ChartTitleStyle}>
                                            {titleLineChart + ' by VND '}
                                        </p>
                                    </Row></>
                                :
                                <>
                                    <EmptyCard />
                                    <Row justify='center' align='middle'>
                                        <Col >
                                            <p style={{ color: 'red', fontStyle: 'italic', marginTop: 50 }}>* No Revenue From {timeValue}</p>
                                        </Col>
                                    </Row>
                                </> :
                            <Skeleton />
                        }
                    </div>
                </div>
                : null
        }
    </>
}