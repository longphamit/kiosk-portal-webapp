import { PlusOutlined } from "@ant-design/icons"
import { Button, Col, Row } from "antd"

export const AddRowComponent = ({ onClickAddNewRow }) => {
    return <>
        <Row justify="center" align="middle">
            <Col>
                <Button type="" shape="round" style={{ width: 200, height: 50, fontSize: 24, fontWeight: 'bold' }} onClick={() => { onClickAddNewRow() }}>
                    <PlusOutlined style={{ fontSize: 32 }} />
                </Button>
            </Col>
        </Row>
    </>
}
