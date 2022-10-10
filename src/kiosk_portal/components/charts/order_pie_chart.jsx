import { Row } from 'antd';
import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';
const OrderPieChart = ({ orders }) => {
    const [chartData, setChartData] = useState();

    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    });
    useEffect(() => {
        setChartData(orders);
    }, [])
    return (
        <Chart type="pie" data={chartData} options={lightOptions} style={{ position: 'relative', width: '100%' }} />
    )
}
export default OrderPieChart