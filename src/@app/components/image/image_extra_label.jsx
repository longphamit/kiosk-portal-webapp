import { InfoCircleOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"

export const ImageLimitSizeTooltip = () => {
    return (
        <Tooltip placement="top" title={'* The image shoud be less than 5MB'}>
            <InfoCircleOutlined style={{ color: 'blue', marginLeft: 4 }} />
        </Tooltip>

    )
}
