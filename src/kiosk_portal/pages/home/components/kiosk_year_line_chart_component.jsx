import { Col, DatePicker, Row, Select, Skeleton } from 'antd'
import { useEffect, useState } from 'react';
import { EmptyCard } from '../../../../@app/components/card/empty_card';
import { OrderLineChart } from '../../../components/charts/order_line_chart';
import { LineChartType } from '../../../components/charts/utils';
import { ChartTitle } from '../../../components/general/ChartTitleComponent';
import { MultiItemsSelectComponents } from '../../../components/select/app_select_component'
import { getKioskCommissionsByYearService } from '../../../services/order_service';
import moment from 'moment';
import './../styles.css'
import { toast } from 'react-toastify';
const currentTime = new Date();
const yearFormat = 'YYYY';
const CHART_TITLE = "The Kiosks's Revenue Year "
export const KioskYearLineChartComponent = ({ kiosks, colSpan }) => {
    const [isLoadingChart, setLoadingChart] = useState(false);
    const [chartData, setChartData] = useState();
    const [hasData, setHasData] = useState(true);
    const [timeValue, setTimeValue] = useState(currentTime.getFullYear());
    const [chartTitle, setChartTitle] = useState(CHART_TITLE + currentTime.getFullYear());
    const [selectedKiosks, setSelectedKiosk] = useState([])
    useEffect(() => {
        getKioskDataByYear(currentTime.getFullYear(), []);
    }, []);

    const getKioskDataByYear = async (year, ids) => {
        try {
            setLoadingChart(true);
            let res = await getKioskCommissionsByYearService(
                year,
                ids
            );
            checkDataLineChart(res.data.datas);
            setChartData(res.data.datas);
            setChartTitle(CHART_TITLE + year);
        } catch (e) {
            console.error(e);
            setChartData(null);
        } finally {
            setLoadingChart(false);
        }
    };

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

    const onSelectKiosks = async (kioskIds) => {
        setSelectedKiosk(kioskIds)
        await getKioskDataByYear(timeValue, kioskIds);
    };
    const onChangeDatePicker = async (value) => {
        if (value === null) {
            toast.warn('Invalid Year!');
            return;
        }
        let year = moment(value).format(yearFormat)
        setTimeValue(year);
        await getKioskDataByYear(year, selectedKiosks);
    }
    return <>
        {kiosks && kiosks.length !== 0 ?

            <div style={{ height: 300 }} className="count-chart-box">
                <Row>
                    <MultiItemsSelectComponents
                        chartType={LineChartType.Year}
                        style={{ width: "40%" }}
                        items={kiosks}
                        onChange={onSelectKiosks}
                        placeholder="Choose Kiosks"
                    />
                    <DatePicker
                        picker="year"
                        defaultValue={moment(currentTime, yearFormat)}
                        format={yearFormat}
                        onChange={value => onChangeDatePicker(value)}
                    />
                </Row>
                {!isLoadingChart ? (
                    <>
                        {chartData && hasData ? (
                            <>
                                <Row justify="center" align="middle" >
                                    <Col span={colSpan} >
                                        <OrderLineChart
                                            labelName={"kioskName"}
                                            datas={chartData}
                                            type={LineChartType.Year}
                                            aspectRatio={2}
                                        />
                                    </Col>
                                </Row>
                                <ChartTitle title={chartTitle} />
                            </>
                        ) : (
                            <>
                                <EmptyCard styles={{ marginTop: 50 }} />
                                <p style={{ color: 'red', fontStyle: 'italic', marginTop: 50 }}>* No Revenue From Kiosks In The Year {timeValue}</p>
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