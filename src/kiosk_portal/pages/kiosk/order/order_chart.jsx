import { PieChartComponent } from "./component/pie_chart_component";
import { LineChartComponent } from "./component/line_chart_component";

export const KioskOrderChart = ({ kioskId, apps }) => {

    return <>
        <PieChartComponent kioskId={kioskId} />

        <LineChartComponent kioskId={kioskId} apps={apps} />
    </>
}