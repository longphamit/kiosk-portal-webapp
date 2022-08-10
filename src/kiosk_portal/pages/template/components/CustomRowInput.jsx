import { Col, Input, Radio, Row, Tag } from "antd";
import TextArea from "antd/lib/input/TextArea";

const spanLabelRow = 6;
const spanValuelRow = 18;
export const RowInput = ({ label, value }) => {
    return (
        <Row style={{ marginBottom: 5 }}>
            <Col span={spanLabelRow} style={{ fontWeight: 'bold', fontSize: 16 }}>{label}: </Col>
            <Col span={spanValuelRow} style={{ fontSize: 16 }}>
                <Input readOnly defaultValue={value} />
            </Col>
        </Row>
    );
};
export const RowText = ({ label, value }) => {
    return (
        <Row style={{ marginBottom: 5 }}>
            <Col span={spanLabelRow} style={{ fontWeight: 'bold', fontSize: 16 }}>{label}: </Col>
            <Col span={spanValuelRow} style={{ fontSize: 16 }}>
                {value}
            </Col>
        </Row>
    );
};
export const RowTag = ({ label, value }) => {
    return (
        <Row style={{ marginBottom: 5 }}>
            <Col span={spanLabelRow} style={{ fontWeight: 'bold', fontSize: 16 }}>{label}: </Col>
            <Col span={spanValuelRow} style={{ fontSize: 16 }}>
                {value === 'coming soon' ?
                    <Tag color={"yellow"}>Up coming</Tag>
                    : value === 'on going' ?
                        <Tag color={"green"}>On going</Tag> :
                        <Tag color={"grey"}>End</Tag>

                }
            </Col>
        </Row>
    );
};
export const RowArea = ({ label, value }) => {
    return (
        <Row style={{ marginBottom: 5 }}>
            <Col span={spanLabelRow} style={{ fontWeight: 'bold', fontSize: 16 }}>{label}: </Col>
            <Col span={spanValuelRow} style={{ fontSize: 16 }}>
                <TextArea readOnly defaultValue={value} />
            </Col>
        </Row>
    );
};
export const RowSelect = ({ label, value, currentValue }) => {
    return (
        <Row style={{ marginBottom: 5 }}>
            <Col span={spanLabelRow} style={{ fontWeight: 'bold', fontSize: 16 }}>{label}: </Col>
            <Col span={spanValuelRow} style={{ fontSize: 16 }}>
                <Radio.Group defaultValue={currentValue} disabled>
                    {value.map(e =>
                        <Radio value={e.value}>{e.label}</Radio>
                    )}
                </Radio.Group>
            </Col>
        </Row>
    );
};