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
        <div className="card flex justify-content-center">
            <Chart type="pie" data={chartData} options={lightOptions} style={{ position: 'relative', width: '80%' }} />
        </div>
    )
}
export default OrderPieChart