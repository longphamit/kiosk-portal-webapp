import { Col, Row, Select, Skeleton, Spin } from "antd";
import { useEffect, useState } from "react"
import { EmptyCard } from "../../../../@app/components/card/empty_card";
import { OrderLineChart } from "../../../components/charts/order_line_chart";
import { LineChartType } from "../../../components/charts/utils";
import { getKioskCommissionsByMonthService, getKioskCommissionsByYearService } from "../../../services/order_service";
import './../styles.css'
import { getListKioskService } from "../../../services/kiosk_service";
import { USER_ID } from "../../../../@app/constants/key";
import { MultiItemsSelectComponents } from "../../../components/select/app_select_component";
import { ChartTitle } from "../../../components/general/ChartTitleComponent";
const currentTime = new Date();
export const KioskLineChartComponent = ({ span }) => {
    const { Option } = Select;
    const [chartDataByMonth, setChartDataByMonth] = useState();
    const [chartDataByYear, setChartDataByYear] = useState();
    const [isLoadingChartYear, setLoadingChartYear] = useState(false);
    const [isLoadingChartMonth, setLoadingChartMonth] = useState(false);
    const [isYearChartHasData, setYearChartHasData] = useState(true)
    const [isMonthChartHasData, setMonthChartHasData] = useState(true)
    const [kiosks, setKiosks] = useState();
    const [isLoadingKiosks, setLoadingKiosks] = useState(false);
    const getKioskDataByYear = async (ids) => {
        try {
            setLoadingChartYear(true)
            let res = await getKioskCommissionsByYearService(currentTime.getFullYear(), ids);
            checkDataLineChart(res.data.datas, true)
            setChartDataByYear(res.data.datas)
        } catch (e) {
            console.error(e)
            setChartDataByYear(null)
        } finally {
            setLoadingChartYear(false)
        }
    }
    const checkDataLineChart = (datas, isYearChart) => {
        let noData = true;
        datas.map((e) => {
            if (e.datasets.length !== 0) {
                noData = false;
                return;
            }
        })
        setHasData(isYearChart, !noData)
    }
    const setHasData = (isYearChart, hasData) => {
        isYearChart ?
            setYearChartHasData(hasData) : setMonthChartHasData(hasData)
    }
    const getKioskDataByMonth = async (ids) => {
        try {
            setLoadingChartMonth(true)
            let res = await getKioskCommissionsByMonthService(currentTime.getMonth() + 1, currentTime.getFullYear(), ids);
            checkDataLineChart(res.data.datas, false)
            setChartDataByMonth(res.data.datas)
        } catch (e) {
            console.error(e)
            setChartDataByMonth(null)
        } finally {
            setLoadingChartMonth(false)
        }
    }
    const getAllKiosk = async () => {
        try {
            setLoadingKiosks(true)
            let res = await getListKioskService(localStorage.getItem(USER_ID), 1, 0)
            setKiosks(res.data.data)
        } catch (e) {
            console.error(e);
            setKiosks(null)
        } finally {
            setLoadingKiosks(false)
        }
    }
    useEffect(() => {
        getKioskDataByYear([]);
        getKioskDataByMonth([]);
        getAllKiosk()
    }, []);

    const onSelectKiosks = async (kioskIds, type) => {
        if (type === LineChartType.Year) {
            await getKioskDataByYear(kioskIds);
        } else {
            await getKioskDataByMonth(kioskIds);
        }
    }
    return <>
        <Row>
            <Col span={12}>
                <SubKioskLineChartComponent
                    isLoadingChart={isLoadingChartYear}
                    chartData={chartDataByYear}
                    hasData={isYearChartHasData}
                    chartTitle={"The Kiosks's Revenue Year " + currentTime.getFullYear()}
                    chartType={LineChartType.Year}
                    spanCol={span}
                    isLoadingKiosks={isLoadingKiosks}
                    kiosks={kiosks}
                    onSelectKiosks={onSelectKiosks}
                />
            </Col>
            <Col span={12}>
                <SubKioskLineChartComponent
                    isLoadingChart={isLoadingChartMonth}
                    chartData={chartDataByMonth}
                    hasData={isMonthChartHasData}
                    chartTitle={`The Kiosks's Revenue ${currentTime.getMonth() + 1}/${currentTime.getFullYear()}`}
                    chartType={LineChartType.Month}
                    spanCol={span}
                    isLoadingKiosks={isLoadingKiosks}
                    kiosks={kiosks}
                    onSelectKiosks={onSelectKiosks}
                />
            </Col>
        </Row>
    </>
}

const SubKioskLineChartComponent = ({
    isLoadingChart,
    chartData,
    hasData,
    chartTitle,
    chartType,
    spanCol,
    isLoadingKiosks,
    kiosks,
    onSelectKiosks
}) => {
    return <>
        <div style={{ height: 300 }} className="count-chart-box">
            {!isLoadingKiosks ?
                kiosks && kiosks.length !== 0 ?
                    <Row>
                        <MultiItemsSelectComponents
                            chartType={chartType}
                            style={{ width: '40%' }}
                            items={kiosks}
                            onChange={onSelectKiosks}
                            placeholder="Choose Kiosks"
                        />
                    </Row> : null
                : <Spin />
            }
            {!isLoadingChart ?
                <>
                    {chartData && hasData ?
                        <>
                            <Row justify='center' align='middle' >
                                <Col span={spanCol}>
                                    <OrderLineChart
                                        labelName={'kioskName'}
                                        datas={chartData}
                                        type={chartType}
                                        aspectRatio={2}
                                    />
                                </Col>
                            </Row>
                            <ChartTitle title={chartTitle} />
                        </> :
                        <EmptyCard />
                    }
                </> : <Skeleton />
            }
        </div>
    </>
}