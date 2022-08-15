import { randomColor } from "../../../../@app/utils/chart_util";

export const ChartTitleStyle = {
    fontSize: 18,
    fontWeight: 'bold'
}
export const rePerformAdminCommissionPieChartData = (obj) => {
    const colors = obj.labels.map(e => randomColor());
    const data = {
        labels: obj.labels,
        datasets: [
            {
                data: obj.datasets,
                backgroundColor: colors,
                hoverBackgroundColor: colors
            }
        ]
    }
    return data
}