import {
  Button,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Skeleton,
  Space,
  Table,
  Tag,
  TimePicker,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import moment from "moment";
import "./styles.css";
import {
  changeScheduleStatusService,
  createScheduleService,
  getListScheduleService,
  updateScheduleService,
} from "../../services/schedule_service";
import {
  PlusOutlined,
  EditFilled,
  SyncOutlined,
  EyeFilled,
} from "@ant-design/icons";
import {
  formatTimePicker,
  splitTimeString,
} from "../../../@app/utils/date_util";
import {
  SCHEDULE_MANAGER_HREF,
  SCHEDULE_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import {
  ERROR_CHECKBOX_DATE_OF_WEEK,
  ERROR_INPUT_NAME,
  ERROR_SELECT_TIME_START,
  UPDATE_SUCCESS,
} from "../../../@app/constants/message";
import { ScheduleDetailsComponent } from "./components/details_modal";

const ScheduleManagerPage = () => {
  const { t } = useTranslation();
  const [listSchedule, setListSchedule] = useState();
  const [totalSchedule, setTotalSchedule] = useState(0);
  const [numScheduleInPage, setNumScheduleInPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEndDay, setIsEndDay] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isCreateScheduleModalVisible, setIsCreateScheduleModalVisible] =
    useState(false);
  const [timePickerValue, setTimePickerValue] = useState("00:00");
  const [isEditScheduleModalVisible, setIsEditScheduleModalVisible] =
    useState(false);
  const [isCheckEdit, setIsCheckEdit] = useState(false);
  const [form] = Form.useForm();
  const [formCreate] = Form.useForm();
  const [detailsModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const getListScheduleFunction = async (currentPageToGetList, numInPage) => {
    try {
      await getListScheduleService(currentPageToGetList, numInPage).then(
        (res) => {
          setTotalSchedule(res.data.metadata.total);
          setListSchedule(res.data.data);
        }
      );
    } catch (error) {
      setListSchedule([]);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getListScheduleFunction(currentPage, numScheduleInPage);
  }, []);

  const handleCloseDetailsModal = () => {
    setSelectedItem(null);
    setDetailModalVisible(false);
  };

  const handleOpenDetailsModal = (item) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  const onFinishEditShedule = async (values) => {
    let timeEnd = "";
    const invalidMsg = [];
    var check = true;
    let dOW = "";
    try {
      if (isEndDay === true) {
        timeEnd = "23:59:59";
      } else {
        var date = new Date(values.timeEnd);
        var hours = ("0" + date.getHours()).slice(-2);
        timeEnd = [hours, "00", "00"].join(":");
      }
      if (values.timeStart - values.timeEnd > 0) {
        invalidMsg.push("Time start need to before or match with time end\n");
        check = false;
      }
      if (Array.isArray(values.dayOfWeek)) {
        dOW = values.dayOfWeek.join("-");
      } else {
        dOW = values.dayOfWeek;
      }
      if (check) {
        const updateSchedule = {
          id: currentItem.id,
          name: values.name,
          stringTimeStart: moment(values.timeStart).format("HH"),
          stringTimeEnd: timeEnd,
          dayOfWeek: dOW,
          status: currentItem.status,
        };
        await updateScheduleService(updateSchedule).then(() => {
          getListScheduleFunction(currentPage, numScheduleInPage);
          setIsEditScheduleModalVisible(false);
          toast.success(UPDATE_SUCCESS);
        });
      } else {
        var errormsg = invalidMsg.join("-");
        toast.error(errormsg);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const showModalEditSchedule = () => {
    setIsEditScheduleModalVisible(true);
  };

  const handleCancelEditSchedule = () => {
    setIsEditScheduleModalVisible(false);
  };
  const onFinishCreateSchedule = async (values) => {
    let timeEnd = "";
    const invalidMsg = [];
    var check = true;
    try {
      if (isEndDay === true) {
        timeEnd = "23:59:59";
      } else {
        if (typeof values.timeEnd === "undefined") {
          invalidMsg.push(
            "Please choose time end or check to end day checkbox"
          );
          check = false;
        } else {
          if (values.timeStart - values.timeEnd > 0) {
            invalidMsg.push(
              "Time start need to before or match with time end\n"
            );
            check = false;
          }
          timeEnd = formatTimePicker(values.timeEnd);
        }
      }

      if (check) {
        const createSchedule = {
          name: values.name,
          stringTimeStart: moment(values.timeStart).format("HH"),
          stringTimeEnd: timeEnd,
          dayOfWeek: values.dayOfWeek.join("-"),
        };
        await createScheduleService(createSchedule).then(() => {
          getListScheduleFunction(currentPage, numScheduleInPage);
          setIsCreateScheduleModalVisible(false);
          toast.success(t("toastsuccesscreateschedule"));
        });
      } else {
        var errormsg = invalidMsg.join("-");
        toast.error(errormsg);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const showModalCreateSchedule = () => {
    setIsEndDay(false);
    formCreate.resetFields();
    setIsCreateScheduleModalVisible(true);
  };

  const handleCancelCreateSchedule = () => {
    setIsCreateScheduleModalVisible(false);
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListScheduleFunction(page, numScheduleInPage);
  };
  const handleChangeStatusSchedule = async (scheduleId) => {
    Modal.confirm({
      title: "Are you sure to change status this schedule",
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          try {
            await changeScheduleStatusService(scheduleId);
            await getListScheduleFunction(currentPage, numScheduleInPage);
            toast.success("Change schedule status success");
          } catch (e) {
            toast.error("Change schedule status fail");
          }
        }
      },
    });
  };
  const types = [
    {
      name: "name",
      label: "Name",
    },
    {
      name: "status",
      label: "Status",
    },
  ];
  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("timestart"),
      dataIndex: "timeStart",
      key: "timeStart",
      render: (text) => <a>{splitTimeString(text)}</a>,
    },
    {
      title: t("timeend"),
      dataIndex: "timeEnd",
      key: "timeEnd",
      render: (text) => <a>{splitTimeString(text)}</a>,
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record, dataIndex) =>
        record.status === "on" ? (
          <Tag color={"green"}>ON</Tag>
        ) : (
          <Tag color={"red"}>OFF</Tag>
        ),
    },

    {
      title: t("action"),
      key: "action",
      align: "center",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="infor-button"
            shape="default"
            onClick={() => {
              handleOpenDetailsModal(record);
            }}
          >
            <EyeFilled /> Details
          </Button>
          <Button
            className="warn-button"
            shape="default"
            onClick={() => {
              setCurrentItem(record);
              if (record.timeEnd === "23:59:59.0000000") {
                setIsEndDay(true);
                setIsCheckEdit(true);
              } else {
                setIsEndDay(false);
                setIsCheckEdit(false);
              }
              showModalEditSchedule();
            }}
          >
            <EditFilled /> {t("edit")}
          </Button>
          <Button
            className="change-status-button"
            shape="default"
            onClick={() => {
              handleChangeStatusSchedule(record.id);
            }}
          >
            <SyncOutlined /> Change Status
          </Button>
        </Space>
      ),
    },
  ];

  const breadCumbData = [
    {
      href: SCHEDULE_MANAGER_HREF,
      label: SCHEDULE_MANAGER_LABEL,
      icon: null,
    },
  ];
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      <Row style={{ padding: 10 }}>
        <Col span={15}></Col>
        <Col span={5} />
        <Col span={4}>
          <Button
            className="success-button"
            size={"large"}
            onClick={showModalCreateSchedule}
          >
            {/* {t("createschedule")} */}
            <PlusOutlined /> Schedule
          </Button>
        </Col>
      </Row>
      {listSchedule ? (
        listSchedule.length === 0 ? (
          <Row justify="center" align="center" style={{ marginTop: 250 }}>
            <Col>
              <Empty />
            </Col>
          </Row>
        ) : (
          <>
            <Table
              rowClassName={(record, index) =>
                record.status === "off"
                  ? "tb-row-schedule-off"
                  : "tb-row-schedule-on"
              }
              columns={columns}
              dataSource={listSchedule}
              pagination={false}
            />
            <Pagination
              defaultCurrent={1}
              total={totalSchedule}
              pageSize={5}
              onChange={handleChangeNumberOfPaging}
            />
          </>
        )
      ) : (
        <Skeleton />
      )}
      <Modal
        title={t("createschedule")}
        visible={isCreateScheduleModalVisible}
        onCancel={handleCancelCreateSchedule}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={formCreate}
          name="register"
          onFinish={onFinishCreateSchedule}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label={t("name")}
            rules={[
              {
                required: true,
                message: ERROR_INPUT_NAME,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="timeStart"
            label={t("timestart")}
            rules={[
              {
                required: true,
                message: ERROR_SELECT_TIME_START,
              },
            ]}
          >
            <TimePicker allowClear={false} format="HH" />
          </Form.Item>
          <Form.Item label={t("timeend")} style={{ marginBottom: 0 }} required>
            <Form.Item
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
              name="timeEnd"
            >
              {isEndDay ? (
                <TimePicker value={timePickerValue} disabled />
              ) : (
                <TimePicker
                  allowClear={false}
                  format="HH"
                  value={timePickerValue}
                />
              )}
            </Form.Item>
            <Form.Item
              name="isEndDay"
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              <Checkbox
                onChange={() => {
                  if (isEndDay) {
                    setIsEndDay(false);
                  } else {
                    setTimePickerValue(moment("23:59:59", "HH:mm:ss"));
                    setIsEndDay(true);
                  }
                }}
              >
                End Day (23:59:59)
              </Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="dayOfWeek"
            label={t("dayofweek")}
            rules={[
              {
                required: true,
                message: ERROR_CHECKBOX_DATE_OF_WEEK,
              },
            ]}
          >
            <Checkbox.Group style={{ width: "100%" }} onChange={{}}>
              <Row>
                <Col span={8}>
                  <Checkbox value="Monday">{t("monday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Tuesday">{t("tuesday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Wednesday">{t("wednesday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Thursday">{t("thursday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Friday">{t("friday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Saturday">{t("saturday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Sunday">{t("sunday")}</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              {t("btncreateschedule")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {currentItem ? (
        <Modal
          key={currentItem.id}
          title="Edit Schedule"
          visible={isEditScheduleModalVisible}
          onCancel={handleCancelEditSchedule}
          footer={null}
        >
          <Form
            key={currentItem.id}
            {...formItemLayout}
            form={form}
            name="edit"
            onFinish={onFinishEditShedule}
            scrollToFirstError
            initialValues={{
              name: currentItem.name,
              timeStart: moment(
                currentItem.timeStart.split(".")[0],
                "HH:mm:ss"
              ),
              timeEnd: moment(currentItem.timeEnd.split(".")[0], "HH:mm:ss"),
              dayOfWeek: currentItem.dayOfWeek,
            }}
          >
            <Form.Item
              name="name"
              label={t("name")}
              rules={[
                {
                  required: true,
                  message: ERROR_INPUT_NAME,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="timeStart"
              label={t("timestart")}
              rules={[
                {
                  required: true,
                  message: ERROR_SELECT_TIME_START,
                },
              ]}
            >
              <TimePicker allowClear={false} format="HH" />
            </Form.Item>

            <Form.Item label={t("timeend")} style={{ marginBottom: 0 }}>
              <Form.Item
                style={{ display: "inline-block", width: "calc(50% - 12px)" }}
                name="timeEnd"
              >
                {isEndDay ? (
                  <TimePicker
                    defaultValue={moment("00:00:00", "HH:mm:ss")}
                    value={timePickerValue}
                    disabled
                  />
                ) : (
                  <TimePicker
                    allowClear={false}
                    format="HH"
                    value={timePickerValue}
                  />
                )}
              </Form.Item>
              <Form.Item
                name="isEndDay"
                style={{ display: "inline-block", width: "calc(50% - 12px)" }}
              >
                {isCheckEdit ? (
                  <Checkbox
                    defaultChecked={true}
                    onChange={() => {
                      if (isEndDay) {
                        setIsEndDay(false);
                      } else {
                        setTimePickerValue(moment("23:59:59", "HH:mm:ss"));
                        setIsEndDay(true);
                      }
                    }}
                  >
                    End Day (23:59:59)
                  </Checkbox>
                ) : (
                  <Checkbox
                    onChange={() => {
                      if (isEndDay) {
                        setIsEndDay(false);
                      } else {
                        setTimePickerValue(moment("23:59:59", "HH:mm:ss"));
                        setIsEndDay(true);
                      }
                    }}
                  >
                    End Day (23:59:59)
                  </Checkbox>
                )}
              </Form.Item>
            </Form.Item>

            <Form.Item
              name="dayOfWeek"
              label={t("dayofweek")}
              rules={[
                {
                  required: true,
                  message: ERROR_CHECKBOX_DATE_OF_WEEK,
                },
              ]}
            >
              <Checkbox.Group style={{ width: "100%" }} onChange={{}}>
                <Row>
                  <Col span={8}>
                    <Checkbox value="Monday">{t("monday")}</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Tuesday">{t("tuesday")}</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Wednesday">{t("wednesday")}</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Thursday">{t("thursday")}</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Friday">{t("friday")}</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Saturday">{t("saturday")}</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Sunday">{t("sunday")}</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Edit Schedule
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
      {selectedItem ? (
        <ScheduleDetailsComponent
          schedule={selectedItem}
          onClose={handleCloseDetailsModal}
          visible={detailsModalVisible}
        />
      ) : null}
    </>
  );
};
export default ScheduleManagerPage;
