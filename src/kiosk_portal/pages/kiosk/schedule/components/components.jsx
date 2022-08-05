import { Button, Col, Form,  Row, Select, Spin, Tag } from "antd"
import { Option } from "antd/lib/mentions";
import { getScheduleByIdService } from "../../../../services/schedule_service";
import { getTemplateById } from "../../../../services/template_service";

export const SubmitButtonComponent = ({ isLoading, onSubmit, buttonName }) => {
    return (<>
        {
            isLoading ?
                <Spin /> :
                <Button className='success-button' key="2" onClick={() => onSubmit()}>{buttonName}</Button>
        }
    </>)
}

export const FormItemSchedule = ({ listSchedule, setCurrentSchedule }) => {
    const handleScheduleChange = async (value) => {
        let sheduleId = value;
        try {
            let res = await getScheduleByIdService(sheduleId);
            setCurrentSchedule(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    return <>
        <Form.Item label="Schedule" name="schedule">
            <Select name="selectSchedule" onChange={handleScheduleChange} >
                {listSchedule.length !== 0 ?
                    listSchedule.map((schedule) => (
                        <Option key={schedule.id} value={schedule.id} >
                            {schedule.name}
                        </Option>
                    ))
                    : null}
            </Select>
        </Form.Item>
    </>
}
export const FormItemTemplate = ({ listTemplate, setCurrentTemplate }) => {
    const handleTemplateChange = async (value) => {
        let templateId = value;
        try {
            let res = await getTemplateById(templateId);
            setCurrentTemplate(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    return <>
        <Form.Item label="Template" name="template">
            <Select name="selectTemplate" onChange={handleTemplateChange} >
                {listTemplate.length !== 0 ?
                    listTemplate.map((template) => (
                        <Option key={template.id} value={template.id} >
                            {template.name}
                        </Option>
                    ))
                    : null}
            </Select>
        </Form.Item>
    </>
}

export const HeaderPanelComponent = ({ kioskShedule }) => {

    return <Row style={{ width: '95%' }}>
        <Col span={2}>
            {
                kioskShedule.status === 'activate' ?
                    <Tag color="blue">Active</Tag> :
                    <Tag color="grey">Deactive</Tag >
            }
        </Col>
        <Col span={21}>
            {kioskShedule.schedule.name + ' - ' + kioskShedule.template.name}
        </Col>
    </Row>
}