import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Tag,
  TimePicker,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import moment from "moment";
import { localStorageGetUserIdService } from "../../../@app/services/localstorage_service";
import {
  changeStatusAccountService,
  searchAccountService,
  updateAccountService,
} from "../../services/account_service";
import {
  createScheduleService,
  getListScheduleService,
  updateScheduleService,
} from "../../services/schedule_service";
import {
  SearchOutlined,
  PlusOutlined,
  EyeFilled,
  EditFilled,
  ArrowUpOutlined,
  DeleteFilled,
  PoweroffOutlined,
} from "@ant-design/icons";
import {
  convertDate,
  formatDatePicker,
  formatTimePicker,
  getDate,
  splitTimeString,
} from "../../../@app/utils/date_util";
import { getListTemplateService } from "../../services/template_service";
import { SCHEDULE_MANAGER_HREF, SCHEDULE_MANAGER_LABEL } from "../impl/breadcumb_constant";
import CustomBreadCumb from "../impl/breadcumb";

const ScheduleManagerPage = () => {
  const { Option } = Select;
  const { t } = useTranslation();
  const [listSchedule, setListSchedule] = useState([]);
  const [totalSchedule, setTotalSchedule] = useState(0);
  const [numScheduleInPage, setNumScheduleInPage] = useState(5);
  const [isSearch, setIsSearch] = useState(false);
  const [querySearch, setQuerySearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItem, setCurrentItem] = useState(null);
  const [listTemplate, setListTemplate] = useState([]);
  const [isCreateScheduleModalVisible, setIsCreateScheduleModalVisible] =
    useState(false);
  const [isEditScheduleModalVisible, setIsEditScheduleModalVisible] =
    useState(false);
  const [isAdvancedSearchModalVisible, setIsAdvancedSearchModalVisible] =
    useState(false);

  const [form] = Form.useForm();

  const getListTemplateFunction = async () => {
    try {
      let name = querySearch !== "" ? querySearch : "";
      const res = await getListTemplateService(1, 100000000, "");
      setListTemplate(res.data.data);
      console.log(res.data.data);
      console.log(listTemplate);
    } catch (error) {
      console.log(error);
    }
  };

  const getListScheduleFunction = async (currentPageToGetList, numInPage) => {
    try {
      if (isSearch) {
        querySearch.page = currentPageToGetList;
        await searchAccountService(querySearch).then((res) => {
          setTotalSchedule(res.data.metadata.total);
          setListSchedule(res.data.data);
        });
      } else {
        await getListScheduleService(currentPageToGetList, numInPage).then(
          (res) => {
            setTotalSchedule(res.data.metadata.total);
            setListSchedule(res.data.data);
          }
        );
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListScheduleFunction(currentPage, numScheduleInPage);
    getListTemplateFunction();
    console.log(listTemplate);
  }, []);

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
  const onFinishEditAccount = async (values) => {
    const invalidMsg = [];
    var check = true;
    let dOW = "";
    try {
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
          stringTimeStart: formatTimePicker(values.timeStart),
          stringTimeEnd: formatTimePicker(values.timeEnd),
          dayOfWeek: dOW,
          status: currentItem.status,
        };
        console.log(updateSchedule);
        await updateScheduleService(updateSchedule).then(() => {
          getListScheduleFunction(currentPage, numScheduleInPage);
          setIsEditScheduleModalVisible(false);
          toast.success("Update Schedule Success");
        });
      } else {
        var errormsg = invalidMsg.join("-");
        toast.error(errormsg);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onFinishAdvancedSearch = async (values) => {
    const search = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      address: values.address,
      size: numScheduleInPage,
      page: 1,
    };
    try {
      await searchAccountService(search).then((res) => {
        setTotalSchedule(res.data.metadata.total);
        setListSchedule(res.data.data);
        setIsSearch(true);
        setQuerySearch(search);
      });
    } catch (error) {
      console.log(error);
      setTotalSchedule(0);
      setListSchedule([]);
    }
  };
  const onFinishSearch = async (values) => {
    let firstName = "";
    let lastName = "";
    let phoneNumber = "";
    let email = "";
    let address = "";
    switch (values.type) {
      case "FirstName":
        firstName = values.searchString;
        break;
      case "LastName":
        lastName = values.searchString;
        break;
      case "PhoneNumber":
        phoneNumber = values.searchString;
        break;
      case "Email":
        email = values.searchString;
        break;
      case "Address":
        address = values.searchString;
        break;
    }
    const search = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      size: numScheduleInPage,
      page: 1,
    };
    try {
      await searchAccountService(search).then((res) => {
        setTotalSchedule(res.data.metadata.total);
        setListSchedule(res.data.data);
        setIsSearch(true);
        setQuerySearch(search);
      });
    } catch (error) {
      console.log(error);
      setTotalSchedule(0);
      setListSchedule([]);
    }
  };
  const showModalEditSchedule = () => {
    setIsEditScheduleModalVisible(true);
  };

  const handleCancelEditSchedule = () => {
    setIsEditScheduleModalVisible(false);
  };
  const onFinishCreateSchedule = async (values) => {
    const invalidMsg = [];
    var check = true;
    try {
      if (values.timeStart - values.timeEnd > 0) {
        invalidMsg.push("Time start need to before or match with time end\n");
        check = false;
      }
      if (check) {
        const createSchedule = {
          name: values.name,
          stringTimeStart: formatTimePicker(values.timeStart),
          stringTimeEnd: formatTimePicker(values.timeEnd),
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
      console.log(error);
    }
  };

  const showModalCreateSchedule = () => {
    setIsCreateScheduleModalVisible(true);
    form.resetFields();
  };

  const handleCancelCreateSchedule = () => {
    setIsCreateScheduleModalVisible(false);
  };
  const showModalAdvancedSearchSchedule = () => {
    setIsAdvancedSearchModalVisible(true);
    form.resetFields();
  };
  const handleCloseModalAdvancedSearchSchedule = () => {
    setIsAdvancedSearchModalVisible(false);
  };
  const handleChangeStatusSchedule = async (record) => {
    Modal.confirm({
      title: t("confirmChangeStatusAccount"),
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          try {
            toast.error("Chưa làm");
          } catch (error) {
            console.log(error);
          }
        }
      },
    });
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListScheduleFunction(page, numScheduleInPage);
  };

  const types = [
    {
      name: "FirstName",
      label: "First Name",
    },
    {
      name: "LastName",
      label: "Last Name",
    },
    {
      name: "PhoneNumber",
      label: "Phone Number",
    },
    {
      name: "Email",
      label: "Email",
    },
    {
      name: "Address",
      label: "Address",
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
          <Tag color={"green"}>{t("active")}</Tag>
        ) : (
          <Tag color={"red"}>{t("deactivate")}</Tag>
        ),
    },

    {
      title: t("action"),
      key: "action",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="warn-button"
            shape="default"
            onClick={() => {
              setCurrentItem(record);
              showModalEditSchedule();
            }}
          >
            <EditFilled /> {t("edit")}
          </Button>
          <Button
            className="warn-button"
            shape="default"
            onClick={() => {
              toast.error("Chưa làm");
            }}
          >
            <PlusOutlined /> Template
          </Button>
          {record.roleName === "Admin" ? (
            <Button
              shape="default"
              name={record}
              disabled="false"
              onClick={() => {
                handleChangeStatusSchedule(record);
              }}
            >
              <PoweroffOutlined /> {t("change-status")}
            </Button>
          ) : (
            <Button
              type="primary"
              shape="default"
              name={record}
              onClick={() => {
                handleChangeStatusSchedule(record);
              }}
            >
              <PoweroffOutlined /> {t("change-status")}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const prefixSearch = (
    <Form.Item name="type" noStyle>
      <Select defaultValue="FirstName">
        {types.map((item) => {
          return <Option value={item.name}>{item.label}</Option>;
        })}
      </Select>
    </Form.Item>
  );
  const breadCumbData = [
    {
      href: SCHEDULE_MANAGER_HREF,
      label: SCHEDULE_MANAGER_LABEL,
      icon: null
    },
  ]
  return (
    <>
    <CustomBreadCumb props={breadCumbData} />
      <Row style={{ padding: 10 }}>
        <Col span={15}>
          <Form
            form={form}
            name="search"
            onFinish={onFinishSearch}
            initialValues={{
              type: "FirstName",
              searchString: "",
            }}
          >
            <Row>
              <Col span={14}>
                <Form.Item name="searchString" style={{ marginTop: 5 }}>
                  <Input
                    addonBefore={prefixSearch}
                    style={{ width: "100%" }}
                    placeholder="Search..."
                    value=""
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{ marginLeft: 10, borderRadius: 5 }}
                    type="primary"
                    size={"large"}
                  >
                    <SearchOutlined />
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Button
                  span={3}
                  style={{ marginLeft: 10 }}
                  type="danger"
                  size={"large"}
                  onClick={showModalAdvancedSearchSchedule}
                >
                  <SearchOutlined /> Advance
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
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
      <Table columns={columns} dataSource={listSchedule} pagination={false} />
      <Pagination
        defaultCurrent={1}
        total={totalSchedule}
        pageSize={5}
        onChange={handleChangeNumberOfPaging}
      />

      <Modal
        title={t("createschedule")}
        visible={isCreateScheduleModalVisible}
        onCancel={handleCancelCreateSchedule}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
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
                message: t("reqnameschedule"),
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
                message: t("reqtimestartschedule"),
              },
            ]}
          >
            <TimePicker allowClear={false} format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="timeEnd"
            label={t("timeend")}
            rules={[
              {
                required: true,
                message: t("reqtimeendschedule"),
              },
            ]}
          >
            <TimePicker allowClear={false} format="HH:mm" />
          </Form.Item>
          <Form.Item name="dayOfWeek" label={t("dayofweek")}>
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
            onFinish={onFinishEditAccount}
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
                  message: t("reqnameschedule"),
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
                  message: t("reqtimestartschedule"),
                },
              ]}
            >
              <TimePicker allowClear={false} format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="timeEnd"
              label={t("timeend")}
              rules={[
                {
                  required: true,
                  message: t("reqtimeendschedule"),
                },
              ]}
            >
              <TimePicker allowClear={false} format="HH:mm" />
            </Form.Item>
            <Form.Item name="dayOfWeek" label={t("dayofweek")}>
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
    </>
  );
};
export default ScheduleManagerPage;
