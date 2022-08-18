import { Col, DatePicker, Row, Select, Skeleton } from 'antd'
import { useEffect, useState } from 'react';
import { EmptyCard } from '../../../../@app/components/card/empty_card';
import { OrderLineChart } from '../../../components/charts/order_line_chart';
import { LineChartType } from '../../../components/charts/utils';
import { ChartTitle } from '../../../components/general/ChartTitleComponent';
import { MultiItemsSelectComponents } from '../../../components/select/app_select_component'
import { getKioskCommissionsByMonthService, getKioskCommissionsByYearService } from '../../../services/order_service';
import moment from 'moment';
import './../styles.css'
import { toast } from 'react-toastify';
const currentTime = new Date();
const monthFormat = 'M/YYYY';
const CHART_TITLE = "The Kiosks's Revenue "

export const KioskMonthLineChartComponent = ({ kiosks, colSpan }) => {
    const [isLoadingChart, setLoadingChart] = useState(false);
    const [chartData, setChartData] = useState();
    const [hasData, setHasData] = useState(true);
    const [timeValue, setTimeValue] = useState(currentTime.getMonth() + 1 + '/' + currentTime.getFullYear());
    const [chartTitle, setChartTitle] = useState(CHART_TITLE + currentTime.getMonth() + 1 + '/' + currentTime.getFullYear());
    const [selectedKiosks, setSelectedKiosk] = useState([])
    useEffect(() => {
        getKioskDataByMonth(currentTime.getMonth() + 1,
            currentTime.getFullYear(), []);
    }, []);

    const checkDataLineChart = (datas) => {
        let noData = true;
        datas.map((e) => {
            if (e.datasets.length !== 0) {
                noData = false;
                return;
            }
        });
        setHasData(!noData);
    };

    const getKioskDataByMonth = async (month, year, ids) => {
        try {
            setLoadingChart(true);
            let res = await getKioskCommissionsByMonthService(
                month,
                year,
                ids
            );
            checkDataLineChart(res.data.datas, false);
            setChartData(res.data.datas);
            setChartTitle(CHART_TITLE + month + '/' + year)
        } catch (e) {
            console.error(e);
            setChartData(null);
        } finally {
            setLoadingChart(false);
        }
    };

    const onSelectKiosks = async (kioskIds) => {
        setSelectedKiosk(kioskIds)
        let parts = timeValue.split('/')
        await getKioskDataByMonth(parts[0], parts[1], kioskIds);
    };
    const onChangeDatePicker = async (value) => {
        if (value === null) {
            toast.warn('Invalid time!');
            return;
        }
        let month = moment(value).format('M')
        let year = moment(value).format('YYYY')
        setTimeValue(moment(value).format(monthFormat));
        await getKioskDataByMonth(month, year, selectedKiosks);
    }
    return <>
        {kiosks && kiosks.length !== 0 ?
            <div style={{ height: 300 }} className="count-chart-box">
                <Row>
                    <MultiItemsSelectComponents
                        chartType={LineChartType.Month}
                        style={{ width: "40%" }}
                        items={kiosks}
                        onChange={onSelectKiosks}
                        placeholder="Choose Kiosks"
                    />
                    <DatePicker
                        picker="month"
                        defaultValue={moment(currentTime, 'M/YYYY')}
                        onChange={value => onChangeDatePicker(value)}
                    />
                </Row>
                {!isLoadingChart ? (
                    <>
                        {chartData && hasData ? (
                            <>
                                <Row justify="center" align="middle">
                                    <Col span={colSpan}>
                                        <OrderLineChart
                                            labelName={"kioskName"}
                                            datas={chartData}
                                            type={LineChartType.Month}
                                            aspectRatio={2}
                                        />
                                    </Col>
                                </Row>
                                <ChartTitle title={chartTitle} />
                            </>
                        ) : (
                            <>
                                <EmptyCard styles={{ marginTop: 50 }} />
                                <p style={{ color: 'red', fontStyle: 'italic', marginTop: 50 }}>* No Revenue From Kiosks In {timeValue}</p>
                            </>
                        )}
                    </>
                ) : (
                    <Skeleton />
                )}
            </div> : null
        }

    </>
}