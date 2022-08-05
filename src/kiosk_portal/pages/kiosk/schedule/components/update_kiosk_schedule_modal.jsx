import { Button, Col, Form, Modal, Row } from "antd"
import { useEffect, useState } from "react"
import { FormItemSchedule, FormItemTemplate, SubmitButtonComponent } from "./components"
import ScheduleKioskDetail from "./shedule_detail_area"
import TemplateKioskDetail from "./temple_detail_area"

const UpdateKioskScheduleModal = ({
    visible,
    onCancel,
    onSubmit,
    form,
    listSchedule,
    listTemplate,
    currentKioskSchedule,
    isLoading
}) => {
    const [currentSchedule, setCurrentSchedule] = useState();
    const [currentTemplate, setCurrentTemplate] = useState();
    useEffect(() => {
        setCurrentSchedule(currentKioskSchedule.schedule);
        setCurrentTemplate(currentKioskSchedule.template);
    }, []);
    return (<>
        {currentSchedule && currentTemplate ?
            <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                key={'Update'}
                form={form}
                initialValues={{
                    schedule: currentSchedule.id,
                    template: currentTemplate.id
                }}
            >
                <Modal
                    key={'Update'}
                    title='Update Kiosk Schedule'
                    visible={visible}
                    width={800}
                    onCancel={() => onCancel()}
                    footer={[
                        <Button onClick={() => onCancel()} key="1">Cancel</Button>,
                        <SubmitButtonComponent isLoading={isLoading} onSubmit={onSubmit} buttonName={'Update'} />
                    ]}
                >
                    <Row>
                        <Col span={11}>
                            <FormItemSchedule listSchedule={listSchedule} setCurrentSchedule={setCurrentSchedule} />
                            <ScheduleKioskDetail currentSchedule={currentSchedule} labelCol={7} offsetWrapperCol={1} wapperCol={14} />
                        </Col>
                        <Col span={11}>
                            <FormItemTemplate listTemplate={listTemplate} setCurrentTemplate={setCurrentTemplate} />
                            <TemplateKioskDetail currentTemplate={currentTemplate} labelCol={7} offsetWrapperCol={1} wapperCol={14} />
                        </Col>
                    </Row>
                </Modal>
            </Form >
            : null}
    </>)
}
export default UpdateKioskScheduleModal;



