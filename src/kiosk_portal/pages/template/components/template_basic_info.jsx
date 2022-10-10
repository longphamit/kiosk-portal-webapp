import { Col, Input, Row } from "antd"
import TextArea from "antd/lib/input/TextArea"
export const TemplateBasicInfo = ({ currentTemplate }) => {
    return <div id="account-info-panel">
        <Row>
            <Col span={20}>
                <Row className="info-row">
                    <Col span={2} className="info-title">
                        Name:
                    </Col>
                    <Col span={12}>
                        <Input value={currentTemplate.name} contentEditable={false} />
                    </Col>

                </Row>
                <Row>
                    <Col span={2} className="info-title">
                        Description:
                    </Col>
                    <Col span={12}>
                        <TextArea rows='1' value={currentTemplate.description} contentEditable={false} />
                    </Col>
                </Row>
            </Col>
        </Row>
    </div >
}