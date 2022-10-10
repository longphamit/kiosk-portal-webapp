import { Row } from 'antd';
import { Chart } from 'primereact/chart';
import { useState } from 'react';
const CountPieChart = ({ count, labels }) => {
    const [chartData] = useState({
        labels: labels,
        datasets: [
            {
                data: [count.active, count.deactive],
                backgroundColor: [
                    "#67c7d6",
                    "#fa78a3"
                ],
                hoverBackgroundColor: [
                    "#8cd9e6",
                    "#f0c2e1"
                ]
            }
        ]
    });

    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    });
    return (<div>
        <Row justify='center' align='middle'>
            <Chart type="pie" data={chartData} options={lightOptions} style={{ position: 'relative', width: '70%' }} />
        </Row>
    </div>
    )
}
export default CountPieChart