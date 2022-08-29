import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createTemplateService,
  deleteTemplateService,
  getListTemplateService,
  updateTemplateService,
} from "../../services/template_service";
import { STATUS_INCOMPLETE } from "../../constants/template_constants";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  PlusOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import {
  TEMPLATE_MANAGER_HREF,
  TEMPLATE_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import {
  DELETE_SUCCESS,
  ERROR_INPUT_DESCRIPTION,
  ERROR_INPUT_NAME,
  UPDATE_SUCCESS,
} from "../../../@app/constants/message";
const TemplateManagerPage = () => {
  const { Option } = Select;
  const [isEditLoading, setEditLoading] = useState(false);
  const [isCreateLoading, setCreateLoading] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const [listTemplate, setListTemplate] = useState();
  const [totalTemplate, setTotalTemplate] = useState(0);
  const [numTemplateInPage, setNumTemplateInPage] = useState(10);
  const [querySearch, setQuerySearch] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItem, setCurrentItem] = useState(null);
  const [isCreateTemplateModalVisible, setIsCreateTemplateModalVisible] =
    useState(false);
  const [isEditTemplateModalVisible, setIsEditTemplateModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const getListTemplateFunction = async (currentPageToGetList, numInPage) => {
    try {
      setCurrentPage(currentPageToGetList);
      if (Object.keys(querySearch).length !== 0 && checkEmptyObj(querySearch)) {
        const res = await getListTemplateService(
          currentPageToGetList,
          numInPage,
          querySearch.name,
          querySearch.status
        );
        setTotalTemplate(res.data.metadata.total);
        setListTemplate(res.data.data);
        return;
      }
      const res = await getListTemplateService(
        currentPageToGetList,
        numInPage,
        "",
        ""
      );
      setTotalTemplate(res.data.metadata.total);
      setListTemplate(res.data.data);
      return;
    } catch (error) {
      setCurrentPage(1);
      setTotalTemplate(0);
      setListTemplate([]);
      console.error(error);
    }
  };
  const checkEmptyObj = (obj) => {
    for (let i in obj) {
      if (obj[i] !== "") return false;
    }
    return true;
  };
  const onNavigate = (url) => {
    navigate(url);
  };
  useEffect(() => {
    getListTemplateFunction(currentPage, numTemplateInPage);
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
  const onFinishEditTemplate = async (values) => {
    setEditLoading(true);
    let data = {
      id: values.id,
      name: values.Name ?? "",
      description: values.description ?? "",
    };
    try {
      const res = await updateTemplateService(data);
      toast(UPDATE_SUCCESS);
      getListTemplateFunction(currentPage, numTemplateInPage);
    } catch (e) {
      console.error(e);
      toast.error(e.response.data.message ?? "Update failed!");
    } finally {
      setEditLoading(false);
    }
  };
  const onFinishSearch = async (values) => {
    try {
      // Only search by name and status
      let searchObj = {
        name: values.searchString,
        status: values.status,
      };
      setQuerySearch(searchObj);
      setCurrentPage(1);
      const res = await getListTemplateService(
        1,
        numTemplateInPage,
        values.searchString,
        values.status
      );
      setTotalTemplate(res.data.metadata.total);
      setListTemplate(res.data.data);
    } catch (e) {
      setListTemplate([]);
      toast("Cannot found!");
    }
  };
  const showModalEditTemplate = () => {
    setIsEditTemplateModalVisible(true);
  };
  const handleCancelEditTemplate = () => {
    setIsEditTemplateModalVisible(false);
  };
  const onFinishCreateTemplate = async (values) => {
    setCreateLoading(true);
    let data = {
      name: values.Name ?? "",
      description: values.description ?? "",
    };
    try {
      let res = await createTemplateService(data);
      handleCancelCreateTemplate();
      onNavigate({
        pathname: "/./edit-template",
        search: "?id=" + res.data.id,
      });
    } catch (e) {
      console.error(e);
      toast.error(e.response.data.message ?? "Create failed!");
    } finally {
      setCreateLoading(false);
    }
  };

  const showModalCreateTemplate = () => {
    setIsCreateTemplateModalVisible(true);
    form.resetFields();
  };

  const handleCancelCreateTemplate = () => {
    setIsCreateTemplateModalVisible(false);
  };
  const handleDeleteTemplate = async (record) => {
    Modal.confirm({
      title: "Confirm delete the template",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        {
          try {
            await deleteTemplateService(record.id);
            toast(DELETE_SUCCESS);
            await getListTemplateFunction(1, numTemplateInPage);
          } catch (e) {
            toast.error(e.response.data.message ?? "Delete failed!");
          }
        }
      },
    });
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListTemplateFunction(page, numTemplateInPage);
  };
  const types = [
    {
      name: "Name",
      label: "Name",
    },
  ];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) =>
        text === STATUS_INCOMPLETE ? (
          <Tag color={"red"}>Incomplete</Tag>
        ) : (
          <Tag color={"blue"}>Complete</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="warn-button"
            shape="default"
            onClick={() => {
              setCurrentItem(record);
              showModalEditTemplate();
            }}
          >
            <EditFilled /> Edit
          </Button>
          <Button
            className="danger-button"
            shape="default"
            name={record}
            onClick={() => {
              handleDeleteTemplate(record);
            }}
          >
            <DeleteFilled /> Delete
          </Button>
        </Space>
      ),
    },
  ];
  const prefixSearch = (
    <Form.Item name="type" noStyle>
      <Select defaultValue="Name">
        {types.map((item) => {
          return <Option value={item.name}>{item.label}</Option>;
        })}
      </Select>
    </Form.Item>
  );
  const breadCumbData = [
    {
      href: TEMPLATE_MANAGER_HREF,
      label: TEMPLATE_MANAGER_LABEL,
      icon: null,
    },
  ];
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
              type: "Name",
              searchString: "",
              status: "",
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
              <Col span={5}>
                <Form.Item name={"status"} style={{ marginTop: 5 }}>
                  <Select>
                    <Option value="">All Status</Option>
                    <Option value="incomplete">Incomplete</Option>
                    <Option value="complete">Complete</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={3}>
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
            </Row>
          </Form>
        </Col>
        <Col span={5} />
        <Col span={4}>
          <Button className="success-button" onClick={showModalCreateTemplate}>
            <PlusOutlined /> Template
          </Button>
        </Col>
      </Row>
      {listTemplate ? (
        <>
          <Table
            columns={columns}
            dataSource={listTemplate}
            pagination={false}
          />
          <Pagination
            defaultCurrent={1}
            total={totalTemplate}
            pageSize={numTemplateInPage}
            onChange={handleChangeNumberOfPaging}
          />
        </>
      ) : (
        <Skeleton />
      )}
      <Modal
        title="Create template"
        visible={isCreateTemplateModalVisible}
        onCancel={handleCancelCreateTemplate}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinishCreateTemplate}
          scrollToFirstError
        >
          <Form.Item
            name="Name"
            label="Name"
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
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: ERROR_INPUT_DESCRIPTION,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            {isCreateLoading === false ? (
              <Button type="primary" htmlType="submit">
                CONTINUE
              </Button>
            ) : (
              <Spin />
            )}
          </Form.Item>
        </Form>
      </Modal>
      {currentItem ? (
        <Modal
          key={currentItem.id}
          title="Edit"
          visible={isEditTemplateModalVisible}
          onCancel={handleCancelEditTemplate}
          footer={null}
        >
          <Form
            key={currentItem.id}
            {...formItemLayout}
            form={form}
            name="edit"
            wrapperCol={{ span: 19 }}
            labelCol={{ span: 5 }}
            onFinish={onFinishEditTemplate}
            scrollToFirstError
            initialValues={{
              id: currentItem.id,
              Name: currentItem.name,
              description: currentItem.description,
            }}
          >
            <Form.Item name="id" hidden={true}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name="Name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: ERROR_INPUT_NAME,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" required>
              <Input />
            </Form.Item>
            {isEditLoading === false ? (
              <div>
                <Row align="center" style={{ marginBottom: 10 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: 170 }}
                  >
                    Save
                  </Button>
                </Row>

                <Row align="center">
                  <Button
                    type="primary"
                    style={{ width: 170 }}
                    onClick={() =>
                      onNavigate({
                        pathname: "/./edit-template",
                        search: "?id=" + currentItem.id,
                      })
                    }
                  >
                    Arrange Component
                  </Button>
                </Row>
              </div>
            ) : (
              <Row align="center">
                <Spin />{" "}
              </Row>
            )}
          </Form>
        </Modal>
      ) : null}
    </>
  );
};
export default TemplateManagerPage;
