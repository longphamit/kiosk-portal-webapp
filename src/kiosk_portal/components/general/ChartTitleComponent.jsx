import { Row } from "antd"

export const ChartTitle = ({ title }) => {
    return <>
        <Row justify='center' align='middle' style={{ marginTop: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 'bold' }}>
                {title}
            </p>
        </Row>
    </>
}