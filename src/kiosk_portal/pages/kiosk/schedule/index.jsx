
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Collapse, Empty, Form, Modal, Row, Skeleton } from 'antd';
import CustomBreadCumb from '../../../components/breadcumb/breadcumb';
import { KIOSK_MANAGER_HREF, KIOSK_MANAGER_LABEL, KIOSK_SCHEDULING_HREF, KIOSK_SCHEDULING_LABEL } from '../../../components/breadcumb/breadcumb_constant';
import { getListScheduleWithoutParamService } from '../../../services/schedule_service';
import { getListTemplateWithoutParamService } from '../../../services/template_service';
import ScheduleKioskDetail from './components/shedule_detail_area';
import TemplateKioskDetail from './components/temple_detail_area';
import { useEffect, useState } from 'react';
import { createKisokScheduleService, deleteKisokScheduleService, getKisokScheduleService, updateKisokScheduleService } from '../../../services/kiosk_shedule';
import { toast } from 'react-toastify';
import NewKioskScheduleModal from './components/new_kiosk_schedule_modal';
import UpdateKioskScheduleModal from './components/update_kiosk_schedule_modal';

const KioskSchedulingPage = () => {
    const { Panel } = Collapse;
    const [isLoading, setLoading] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [listSchedule, setListSchedule] = useState();
    const [listTemplate, setListTemplate] = useState();
    const [listKioskSchedule, setListKioskShedule] = useState();
    const [updateKioskSchedule, setUpdateKioskSchedule] = useState();
    const [currentKioskId, setKioskId] = useState()
    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();
    const onChange = (key) => {
    };
    const breadCumbData = [
        {
            href: KIOSK_MANAGER_HREF,
            label: KIOSK_MANAGER_LABEL,
            icon: null
        },
        {
            href: KIOSK_SCHEDULING_HREF,
            label: KIOSK_SCHEDULING_LABEL,
            icon: null
        }
    ]
    const onCreateKioskScheduke = async () => {
        setLoading(true);
        let scheduleId = createForm.getFieldValue('schedule');
        let templateId = createForm.getFieldValue('template');
        let kioskId = currentKioskId;
        try {
            let data = {
                kioskId,
                scheduleId,
                templateId
            }
            let res = await createKisokScheduleService(data);
            toast.success('Create success!');
            try {
                let res = await getKisokScheduleService(currentKioskId);
                setListKioskShedule(res.data.data)
            } catch (e) {
                console.error(e);
            }
            setCreateVisible(false)
        } catch (e) {
            toast.error(e.response.data.message ?? "Create failed!");
            console.error(e.message)
        } finally {
            setLoading(false);
        }
    }

    const getListScheduleAvailable = async () => {
        await getListScheduleWithoutParamService().then(
            (res) => {
                setListSchedule(res.data.data);
            }
        ).catch((e) => {
            console.error(e);
            setListSchedule([]);
        });
    }
    const getListTemplateAvailable = async () => {
        await getListTemplateWithoutParamService('').then(
            (res) => {
                let tempList = []
                Promise.all(
                    res.data.data.map((e) => {
                        if (e.status !== 'incomplete') {
                            tempList.push(e);
                        }
                    })
                );
                setListTemplate(tempList);
            }
        ).catch((e) => {
            console.error(e);
            setListTemplate([]);
        });
    }
    const getKisokSchedule = async (id) => {
        try {
            let res = await getKisokScheduleService(id);
            setListKioskShedule(res.data.data)
        } catch (e) {
            setListKioskShedule([]);
            console.error(e);
        }
    }
    const initialize = async () => {
        //get kiosk Id
        let pathParts = window.location.pathname.split('/');
        let kioskId = pathParts[pathParts.length - 1]
        setKioskId(kioskId);
        // get List Kiosk schedules
        getKisokSchedule(kioskId);
    }
    useEffect(() => {
        initialize();
        getListScheduleAvailable();
        getListTemplateAvailable();
    }, []);
    const deleteKioskSchedule = async (id) => {
        Modal.confirm({
            title: 'Are you sure to delete this kiosk schedule ?',
            okText: 'Yes',
            cancelText: "No",
            onOk: async () => {
                {
                    try {
                        let res = await deleteKisokScheduleService(id);
                        toast.success('Delete success');
                        getKisokSchedule(currentKioskId);
                    } catch (e) {
                        toast.error(e.response.data.message ?? "Delete failed!");
                        console.error(e);
                    }
                }
            },
        });

    }
    const onUpdateKioskSchedule = async () => {
        setLoading(true);
        let scheduleId = updateForm.getFieldValue('schedule');
        let templateId = updateForm.getFieldValue('template');
        try {
            let data = {
                id: updateKioskSchedule.id,
                scheduleId,
                templateId
            }
            let res = await updateKisokScheduleService(data);
            toast.success('Update success!');
            getKisokSchedule(currentKioskId);
            setUpdateVisible(false)
        } catch (e) {
            toast.error(e.response.data.message ?? "Update failed!");
            console.error(e.message)
        } finally {
            setLoading(false);
            setUpdateKioskSchedule(null)
        }
    }
    const onCloseUpdateModal = () => {
        setUpdateKioskSchedule(null);
        setUpdateVisible(false);
    }
    const onOpenCreateModal = () => {
        setCreateVisible(true)
    }
    return (
        <>
            <CustomBreadCumb props={breadCumbData} />
            {currentKioskId ?
                <Row style={{ paddingBottom: 15 }}>
                    <Col justify="right" align="right" span={3} offset={21}>
                        <Button
                            className="success-button"
                            size={"large"}
                            onClick={() => onOpenCreateModal()}
                        >
                            <PlusOutlined /> New Kiosk Schedule
                        </Button>
                    </Col>
                </Row> : null
            }
            {listKioskSchedule ?
                <>
                    {listKioskSchedule.length != 0 ?
                        <Collapse defaultActiveKey={[listKioskSchedule[0].id]} onChange={onChange}>
                            {listKioskSchedule.map((s) => (
                                <>
                                    <Panel header={s.schedule.name + ' - ' + s.template.name} key={s.id}>
                                        <Row>
                                            <Col span={11}>
                                                <Card title="Schedule Infomation" bordered={false} >
                                                    <ScheduleKioskDetail currentSchedule={s.schedule} labelCol={6} wapperCol={18} />
                                                </Card>

                                            </Col>
                                            <Col span={12} offset={1}>
                                                <Card title="Template Infomation" bordered={false} >
                                                    <TemplateKioskDetail currentTemplate={s.template} labelCol={6} wapperCol={18} />
                                                </Card>

                                            </Col>
                                        </Row>
                                        <Row >
                                            <Col>
                                                <Button danger type="primary" style={{ marginRight: 20 }} onClick={() => deleteKioskSchedule(s.id)}>Delete</Button>
                                                <Button onClick={() => {
                                                    setUpdateKioskSchedule(s);
                                                    setUpdateVisible(true);
                                                }} >Update</Button>
                                            </Col>
                                        </Row>
                                    </Panel>
                                </>
                            ))}
                        </Collapse> :
                        <>
                            <Row justify='center' align='center' style={{ marginTop: 250 }}>
                                <Col>
                                    <Empty />
                                </Col>
                            </Row>
                        </>
                    }
                </>
                : <Skeleton />
            }
            {
                listKioskSchedule && listTemplate && updateKioskSchedule ?
                    <>
                        <UpdateKioskScheduleModal
                            isLoading={isLoading}
                            visible={updateVisible}
                            onCancel={onCloseUpdateModal}
                            onSubmit={onUpdateKioskSchedule}
                            form={updateForm}
                            listSchedule={listSchedule}
                            listTemplate={listTemplate}
                            currentKioskSchedule={updateKioskSchedule}
                        />
                    </>
                    : null
            }
            {
                listSchedule && listTemplate ?
                    <NewKioskScheduleModal
                        isLoading={isLoading}
                        form={createForm}
                        listSchedule={listSchedule}
                        listTemplate={listTemplate}
                        onSubmit={onCreateKioskScheduke}
                        visible={createVisible}
                        setVisible={setCreateVisible}
                    />
                    : null
            }
        </>)
}
export default KioskSchedulingPage;