import { Col, Row, Tag } from "antd"

const INPUT_CONTENT_TYPE = 'input'
const SELECT_CONTENT_TYPE = 'select'
const TAG_CONTENT_TYPE = 'tag'

const CustomRowItem = ({
    content, //input
    label,
    contentType,
    wrapperCol,
    offsetWrapperCol,
    offsetLabelCol,
    labelCol
}) => {

    return (<>

        <Row>
            <Col span={labelCol} offset={offsetLabelCol ?? 0}>
                <label htmlFor="" style={{ fontWeight: 'bold' }}>
                    {label}:
                </label>
            </Col>
            <Col span={wrapperCol} offset={offsetWrapperCol ?? 0}>
                <p>
                    {contentType === INPUT_CONTENT_TYPE ?
                        <p>{content}</p> :
                        contentType === SELECT_CONTENT_TYPE ?
                            <></> :
                            content.map((e) => (
                                <Tag color={e.color} style={{ margin: 5 }}>
                                    {e.content}
                                </Tag>
                            ))
                    }
                </p>
            </Col>
        </Row>


    </>)
}
export default CustomRowItem;