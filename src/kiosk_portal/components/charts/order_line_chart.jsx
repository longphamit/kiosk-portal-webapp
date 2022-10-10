import { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { randomColor } from '../../../@app/utils/chart_util';
import { LineChartType } from './utils';

const LABELS_YEAR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const LABELS_MONTH = [1, 5, 10, 15, 20, 25, 30]
export const OrderLineChart = ({ datas, type, labelName, aspectRatio }) => {
    const [basicData, setBasicData] = useState();
    const initialize = () => {
        if (type === LineChartType.Year) {
            let tempDatasets = []
            if (datas && datas.length !== 0) {
                datas.map((e) => {
                    tempDatasets.push({
                        label: e[`${labelName}`],
                        data: e.datasets,
                        fill: false,
                        borderColor: randomColor(),
                        tension: .4
                    })
                })
            }
            setBasicData({
                labels: LABELS_YEAR,
                datasets: tempDatasets
            })
        } else {
            let tempDatasets = []
            //convert response data into chart data format
            if (datas && datas.length !== 0) {
                datas.map((e) => {
                    tempDatasets.push({
                        label: e[`${labelName}`],
                        data: reformatDatasets(e.datasets),
                        fill: false,
                        borderColor: randomColor(),
                        tension: .4
                    })
                })
            }
            setBasicData({
                labels: LABELS_MONTH,
                datasets: tempDatasets
            })
        }
    }
    const reformatDatasets = (data) => {
        let count = 0;
        let total = 0;
        let tempTotalList = [];
        for (let i = 0; i < data.length; i++) {
            if (i == 0) {
                tempTotalList.push(data[i]);
                continue;
            }
            if (count < 5) {
                count++;
                total += data[i];
            } else {
                tempTotalList.push(total);
                total = data[i];
                count = 1;
            }
        }
        return tempTotalList;
    }
    useEffect(() => {
        initialize()
    }, []);
    const basicOptions = () => {
        return {
            maintainAspectRatio: false,
            responsive: true,
            aspectRatio: aspectRatio,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        }
    };
    return <>
        <div className="card">
            <Chart type="line" data={basicData} options={basicOptions()} />
        </div>
    </>
}

