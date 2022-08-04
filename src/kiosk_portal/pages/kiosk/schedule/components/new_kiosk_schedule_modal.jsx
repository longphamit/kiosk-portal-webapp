import { Button, Col, Form, Modal, Row, Select, Skeleton } from "antd"
import { Option } from "antd/lib/mentions"
import { useEffect, useState } from "react"
import { getScheduleByIdService } from "../../../../services/schedule_service"
import { getTemplateById } from "../../../../services/template_service"
import { FormItemSchedule, FormItemTemplate, SubmitButtonComponent } from "./components"
import ScheduleKioskDetail from "./shedule_detail_area"
import TemplateKioskDetail from "./temple_detail_area"

const NewKioskScheduleModal = ({
    isLoading,
    visible,
    setVisible,
    onSubmit,
    form,
    listSchedule,
    listTemplate
}) => {
    const [currentSchedule, setCurrentSchedule] = useState();
    const [currentTemplate, setCurrentTemplate] = useState();
    useEffect(() => {
        setCurrentSchedule(listSchedule[0]);
        setCurrentTemplate(listTemplate[0]);
    }, []);
    return (<>
        {currentSchedule && currentTemplate ?
            <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                form={form}
                key={'Create'}
                initialValues={{
                    schedule: listSchedule[0].id,
                    template: listTemplate[0].id
                }}
            >
                <Modal
                    key={'Create'}
                    title='Create Kiosk Schedule'
                    visible={visible}
                    width={800}
                    onCancel={() => setVisible(false)}
                    footer={[
                        <Button onClick={() => setVisible(false)} key="1">Cancel</Button>,
                        <SubmitButtonComponent isLoading={isLoading} onSubmit={onSubmit} buttonName={'Create'} />
                    ]}
                >
                    <Row>
                        <Col span={11}>
                            <FormItemSchedule listSchedule={listSchedule} setCurrentSchedule={setCurrentSchedule} />
                            <ScheduleKioskDetail currentSchedule={currentSchedule} labelCol={7} offsetWrapperCol={1} wapperCol={14} />
                        </Col>
                        <Col span={11} >
                            <FormItemTemplate listTemplate={listTemplate} setCurrentTemplate={setCurrentTemplate} />
                            <TemplateKioskDetail currentTemplate={currentTemplate} labelCol={7} offsetWrapperCol={1} wapperCol={14} />
                        </Col>
                    </Row>
                </Modal>
            </Form>
            : <Skeleton />
        }
    </>)
}
export default NewKioskScheduleModal;