import { Button, Col, Form, Modal, Row, Select, Skeleton } from "antd"
import { Option } from "antd/lib/mentions"
import { useEffect, useState } from "react"
import { getScheduleByIdService } from "../../../../services/schedule_service"
import { getTemplateById } from "../../../../services/template_service"
import ScheduleKioskDetail from "./shedule_detail_area"
import TemplateKioskDetail from "./temple_detail_area"

const KioskScheduleModal = ({
    type,
    modalTitle,
    visible,
    setVisible,
    onSubmit,
    form,
    listSchedule,
    listTemplate,
    currTemplate,
    currSchedule
}) => {
    const [currentSchedule, setCurrentSchedule] = useState();
    const [currentTemplate, setCurrentTemplate] = useState();
    const handleScheduleChange = async (value) => {
        let sheduleId = value;
        try {
            let res = await getScheduleByIdService(sheduleId);
            setCurrentSchedule(res.data);
        } catch (e) {
            console.error(e);
        }

    }

    const handleTemplateChange = async (value) => {
        let templateId = value;
        try {
            let res = await getTemplateById(templateId);
            setCurrentTemplate(res.data);
        } catch (e) {
            console.error(e);
        }
    }
    useEffect(() => {
        setCurrentSchedule(currSchedule);
        setCurrentTemplate(currTemplate);
        console.log('visible ' + visible)
    }, []);
    return (<>
        {currentSchedule && currTemplate ?
            <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                form={form}
                initialValues={{
                    schedule: currentSchedule.id,
                    template: currentTemplate.id
                }}
            >
                <Modal
                    title={modalTitle}
                    visible={visible}
                    width={800}
                    onCancel={() => setVisible(false)}
                    footer={[
                        <Button onClick={() => setVisible(false)} key="1">Cancel</Button>,
                        <Button className='success-button' key="2" onClick={() => onSubmit()}>{type}</Button>,
                    ]}
                >
                    {currSchedule && currTemplate ?
                        <Row>
                            <Col span={11}>
                                <Form.Item label="Schedule" name="schedule">
                                    <Select name="selectSchedule" onChange={handleScheduleChange}>
                                        {listSchedule.length !== 0 ?
                                            listSchedule.map((schedule) => (
                                                <Option key={schedule.id} value={schedule.id}>
                                                    {schedule.name}
                                                </Option>
                                            ))
                                            : null}
                                    </Select>
                                </Form.Item>
                                <ScheduleKioskDetail currentSchedule={currentSchedule} labelCol={7} offsetWrapperCol={1} wapperCol={14} />
                            </Col>
                            <Col span={12} offset={1}>
                                <Form.Item label="Template" name="template">
                                    <Select name="selectTemplate" onChange={handleTemplateChange}>
                                        {listTemplate.length !== 0 ?
                                            listTemplate.map((template) => (
                                                <Option key={template.id} value={template.id}>
                                                    {template.name}
                                                </Option>
                                            ))
                                            : null}
                                    </Select>
                                </Form.Item>
                                <TemplateKioskDetail currentTemplate={currentTemplate} labelCol={12} wapperCol={12} />
                            </Col>
                        </Row>
                        : <Skeleton />
                    }
                </Modal>
            </Form>
            : null}
    </>)
}
export default KioskScheduleModal;