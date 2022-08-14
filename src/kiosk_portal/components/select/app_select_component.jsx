import { Select } from "antd"
import { useState } from "react";
const { Option, OptGroup } = Select;

export const LoationOwnerAppSelectByGroupComponent = ({ apps, onChange }) => {
    return <>
        <Select
            style={{ width: 200, margin: '20px 0px' }}
            onChange={(value) => { onChange(value) }}
            defaultValue=''
        >
            <Option value=''>All</Option>
            <OptGroup label="Installed">
                {apps.installed.map((e) => {
                    return <Option key={e.id + '#'} value={e.serviceApplicationId}>{e.serviceApplicationName}</Option>
                })}
            </OptGroup>
            <OptGroup label="Uninstalled">
                {apps.uninstalled.map((e) => {
                    return <Option key={e.id + '#'} value={e.serviceApplicationId}>{e.serviceApplicationName}</Option>
                })}
            </OptGroup>
        </Select>
    </>
}

export const MultiItemsSelectComponents = ({ items, onChange, chartType, placeholder, style }) => {
    return <Select
        style={style}
        placeholder={placeholder}
        mode="multiple"
        onChange={(selected) => {
            onChange(selected, chartType)
        }}
    >
        {items.map((e) => {
            return <Option key={e.id} value={e.id}>
                {e.name}
            </Option>
        })}
    </Select>
}