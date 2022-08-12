import { Col, Empty, Row } from "antd"

export const EmptyCard = ({ styles }) => {
    return <Row justify='center' align='center' style={styles}>
        <Col>
            <Empty />
        </Col>
    </Row>
}