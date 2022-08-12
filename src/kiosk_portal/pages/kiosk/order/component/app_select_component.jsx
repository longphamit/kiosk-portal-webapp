import { Select } from "antd"

export const AppSelectComponent = ({ apps, onChange }) => {
    const { Option, OptGroup } = Select;
    return <>
        <Select
            style={{ width: 200, margin: '20px 0px' }}
            onChange={(value) => { onChange(value) }}
            defaultValue=''
        >
            <Option value=''>All</Option>
            <OptGroup label="Installed">
                {apps.installed.map((e) => {
                    return <Option key={e.id+'#'} value={e.serviceApplicationId}>{e.serviceApplicationName}</Option>
                })}
            </OptGroup>
            <OptGroup label="Uninstalled">
                {apps.uninstalled.map((e) => {
                    return <Option key={e.id+'#'} value={e.serviceApplicationId}>{e.serviceApplicationName}</Option>
                })}
            </OptGroup>
        </Select>
    </>
}