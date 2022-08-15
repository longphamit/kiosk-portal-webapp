import { DatePicker, Select } from "antd"
import { FilterChartType } from "../utils"
const { Option } = Select;


export const ChartFilterComponent = ({ filterChart, setFilterChart, onChangeDatePicker, key }) => {
    const filterChartFunction = (value) => {
        switch (value) {
            case FilterChartType.Year:
                return <DatePicker picker="year" onChange={value => onChangeDatePicker(value, 'year')} />;
            case FilterChartType.Month:
                return <DatePicker picker="month" onChange={value => onChangeDatePicker(value, 'month')} />;
            default:
                return null;
        }
    }
    return <>
        <Select defaultValue='All' style={{ width: 120 }} onChange={(value) => { setFilterChart(value) }} key={`${key}-select`}>
            <Option key={`${key}-option-1`} value={FilterChartType.All}>All</Option>
            <Option key={`${key}-option-2`} value={FilterChartType.Month}>Month</Option>
            <Option key={`${key}-option-3`} value={FilterChartType.Year}>Year</Option>
        </Select>
        {/* Select for Month and Year */}
        {filterChartFunction(filterChart)}
    </>
}
