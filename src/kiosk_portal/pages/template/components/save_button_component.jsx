import { Button, Col, Row, Spin } from "antd"

export const SaveButtonComponent = ({ save, isLoading }) => {
    return <Row justify="center" align="middle" style={{ marginTop: 40 }}>
        <Col>
            {isLoading === false ?
                <Button type="primary" style={{ width: 200, height: 50, fontSize: 24, fontWeight: 'bold' }} onClick={() => { save() }}>Save</Button>
                : <Spin />
            }
        </Col>
    </Row>
}