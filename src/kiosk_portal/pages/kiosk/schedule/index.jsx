import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  Empty,
  Form,
  Modal,
  Row,
  Skeleton,
} from "antd";
import { getListScheduleWithoutParamService } from "../../../services/schedule_service";
import { getListTemplateWithoutParamService } from "../../../services/template_service";
import ScheduleKioskDetail from "./components/shedule_detail_area";
import TemplateKioskDetail from "./components/temple_detail_area";
import { useEffect, useState } from "react";
import {
  createKisokScheduleService,
  deleteKisokScheduleService,
  getKisokScheduleService,
  updateKioskScheduleStatuService,
  updateKisokScheduleService,
} from "../../../services/kiosk_shedule";
import { toast } from "react-toastify";
import NewKioskScheduleModal from "./components/new_kiosk_schedule_modal";
import UpdateKioskScheduleModal from "./components/update_kiosk_schedule_modal";
import { HeaderPanelComponent } from "./components/components";
import {
  SCHEDULE_MANAGER_PATH,
  TEMPLATE_MANAGER_PATH,
} from "../../../constants/path_constants";
import {
  CREATE_SUCCESS,
  DELETE_SUCCESS,
  UPDATE_SUCCESS,
} from "../../../../@app/constants/message";

const KioskSchedulingPage = ({ currentKioskId }) => {
  const { Panel } = Collapse;
  const [isLoading, setLoading] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [listSchedule, setListSchedule] = useState();
  const [listTemplate, setListTemplate] = useState();
  const [listKioskSchedule, setListKioskShedule] = useState();
  const [updateKioskSchedule, setUpdateKioskSchedule] = useState();
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const onCreateKioskScheduke = async () => {
    setLoading(true);
    let scheduleId = createForm.getFieldValue("schedule");
    let templateId = createForm.getFieldValue("template");
    let kioskId = currentKioskId;
    try {
      let data = {
        kioskId,
        scheduleId,
        templateId,
      };
      let res = await createKisokScheduleService(data);
      toast.success(CREATE_SUCCESS);
      try {
        let res = await getKisokScheduleService(currentKioskId);
        setListKioskShedule(res.data.data);
      } catch (e) {
        console.error(e);
      }
      setCreateVisible(false);
    } catch (e) {
      toast.error(e.response.data.message ?? "Create failed!");
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getListScheduleAvailable = async () => {
    await getListScheduleWithoutParamService()
      .then((res) => {
        setListSchedule(res.data.data);
      })
      .catch((e) => {
        console.error(e);
        setListSchedule([]);
      });
  };
  const getListTemplateAvailable = async () => {
    await getListTemplateWithoutParamService("complete")
      .then((res) => {
        setListTemplate(res.data.data);
      })
      .catch((e) => {
        console.error(e);
        setListTemplate([]);
      });
  };
  const getKisokSchedule = async (id) => {
    try {
      let res = await getKisokScheduleService(id);
      setListKioskShedule(res.data.data);
    } catch (e) {
      setListKioskShedule([]);
      console.error(e);
    }
  };
  const initialize = async () => {
    // get List Kiosk schedules
    getKisokSchedule(currentKioskId);
  };
  useEffect(() => {
    initialize();
    getListScheduleAvailable();
    getListTemplateAvailable();
  }, []);
  const deleteKioskSchedule = async (id) => {
    Modal.confirm({
      title: "Are you sure to delete this kiosk schedule ?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        {
          try {
            let res = await deleteKisokScheduleService(id);
            toast.success(DELETE_SUCCESS);
            getKisokSchedule(currentKioskId);
          } catch (e) {
            toast.error(e.response.data.message ?? "Delete failed!");
            console.error(e);
          }
        }
      },
    });
  };
  const onUpdateKioskSchedule = async () => {
    setLoading(true);
    let scheduleId = updateForm.getFieldValue("schedule");
    let templateId = updateForm.getFieldValue("template");
    try {
      let data = {
        id: updateKioskSchedule.id,
        scheduleId,
        templateId,
      };
      let res = await updateKisokScheduleService(data);
      toast.success(UPDATE_SUCCESS);
      getKisokSchedule(currentKioskId);
      setUpdateVisible(false);
    } catch (e) {
      toast.error(e.response.data.message ?? "Update failed!");
      console.error(e.message);
    } finally {
      setLoading(false);
      setUpdateKioskSchedule(null);
    }
  };
  const openWarningDataModal = (name, href) => {
    Modal.warning({
      title: (
        <p>
          The {name} has no data! Please{" "}
          <a href={href} target="_blank">
            click here{" "}
          </a>
          to add
        </p>
      ),
      okText: "Close",
    });
  };
  const checkEnoughData = () => {
    if (listSchedule.length === 0) {
      openWarningDataModal("Schedule", SCHEDULE_MANAGER_PATH);
      return false;
    }
    if (listTemplate.length === 0) {
      openWarningDataModal("Template", TEMPLATE_MANAGER_PATH);
      return false;
    }
    return true;
  };
  const onCloseUpdateModal = () => {
    setUpdateKioskSchedule(null);
    setUpdateVisible(false);
  };
  const onOpenCreateModal = () => {
    if (checkEnoughData()) {
      setCreateVisible(true);
    }
  };
  const onOpenUpdateModal = (schedule) => {
    if (checkEnoughData()) {
      setUpdateKioskSchedule(schedule);
      setUpdateVisible(true);
    }
  };
  const onChangeStatusKioskSchedule = async (id) => {
    try {
      let res = await updateKioskScheduleStatuService(id);
      getKisokSchedule(currentKioskId);
      toast.success("Change status success");
    } catch (e) {
      console.error(e);
      toast.error("Cannot change status");
    }
  };
  const genExtra = (id) => (
    <Button
      className="change-status-button"
      onClick={(event) => {
        event.stopPropagation();
        changeStatusKioskSchedule(id);
      }}
    >
      <SyncOutlined /> Change Status
    </Button>
  );
  const changeStatusKioskSchedule = async (id) => {
    Modal.confirm({
      title: "Are you sure to change status this kiosk schedule ?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        onChangeStatusKioskSchedule(id);
      },
    });
  };
  return (
    <>
      {currentKioskId ? (
        <Row style={{ paddingBottom: 15, paddingRight: 100 }}>
          <Col justify="right" align="right" span={2} offset={22}>
            <Button
              className="success-button"
              size={"large"}
              onClick={() => onOpenCreateModal()}
            >
              <PlusOutlined /> Kiosk Scenario
            </Button>
          </Col>
        </Row>
      ) : null}
      {listKioskSchedule ? (
        <>
          {listKioskSchedule.length != 0 ? (
            <Collapse defaultActiveKey={listKioskSchedule[0].id}>
              {listKioskSchedule.map((s) => (
                <>
                  <Panel
                    header={<HeaderPanelComponent kioskShedule={s} />}
                    extra={genExtra(s.id)}
                    key={s.id}
                  >
                    <Row>
                      <Col span={11}>
                        <Card title="Schedule Infomation" bordered={false}>
                          <ScheduleKioskDetail
                            currentSchedule={s.schedule}
                            labelCol={6}
                            wapperCol={18}
                          />
                        </Card>
                      </Col>
                      <Col span={12} offset={1}>
                        <Card title="Template Infomation" bordered={false}>
                          <TemplateKioskDetail
                            currentTemplate={s.template}
                            labelCol={6}
                            wapperCol={18}
                          />
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          danger
                          type="primary"
                          style={{ marginRight: 20 }}
                          onClick={() => deleteKioskSchedule(s.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => {
                            onOpenUpdateModal(s);
                          }}
                        >
                          Update
                        </Button>
                      </Col>
                    </Row>
                  </Panel>
                </>
              ))}
            </Collapse>
          ) : (
            <>
              <Row justify="center" align="center" style={{ marginTop: 250 }}>
                <Col>
                  <Empty />
                </Col>
              </Row>
            </>
          )}
        </>
      ) : (
        <Skeleton />
      )}
      {listKioskSchedule && listTemplate && updateKioskSchedule ? (
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
      ) : null}
      {listSchedule && listTemplate ? (
        <NewKioskScheduleModal
          isLoading={isLoading}
          form={createForm}
          listSchedule={listSchedule}
          listTemplate={listTemplate}
          onSubmit={onCreateKioskScheduke}
          visible={createVisible}
          setVisible={setCreateVisible}
        />
      ) : null}
    </>
  );
};
export default KioskSchedulingPage;
