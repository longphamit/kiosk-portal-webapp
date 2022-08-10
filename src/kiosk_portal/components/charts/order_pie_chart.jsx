import { Chart } from 'primereact/chart';
import { useState } from 'react';
import { randomColor } from '../../../@app/utils/chart_util';
const OrderPieChart = ({ orders }) => {
    const colors = orders.map(e => randomColor());
    const [chartData] = useState({
        labels: orders.map(e => e.serviceApplicationName),
        datasets: [
            {
                data: orders.map(e => e.totalCommission),
                backgroundColor: colors,
                hoverBackgroundColor: colors
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
    return (
        <div className="card flex justify-content-center">
            <Chart type="pie" data={chartData} options={lightOptions} style={{ position: 'relative', width: '40%' }} />
        </div>
    )
}
export default OrderPieChart