import {
  AutoComplete,
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
  Upload,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeFilled,
  EditFilled,
  ArrowUpOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../../../@app/utils/file_util";
import {
  localStorageGetReduxState,
  localStorageGetUserIdService,
} from "../../../../@app/services/localstorage_service";
import {
  formItemLayout,
  tailFormItemLayout,
} from "../../../layouts/form_layout";
import {
  createApplicationService,
  getListApplicationService,
  sendReqPublishApplicationService,
  updateApplicationService,
} from "../../../services/application_service";
import {
  getAllCategoriesService,
  getListCategoriesService,
} from "../../../services/categories_service";
import { beforeUpload } from "../../../../@app/utils/image_util";
import { useNavigate } from "react-router-dom";
import {
  ROLE_ADMIN,
  ROLE_LOCATION_OWNER,
  ROLE_SERVICE_PROVIDER,
} from "../../../../@app/constants/role";

const ApplicationTable = () => {
  const navigator = useNavigate();
  const { Option } = Select;
  const { TextArea } = Input;
  const { t } = useTranslation();
  const role = localStorageGetReduxState().auth.role;
  const [listApplication, setListApplication] = useState([]);
  const [totalApplication, setTotalApplication] = useState(0);
  const [numApplicationInPage, setNumApplicationInPage] = useState(5);
  const [isSearch, setIsSearch] = useState(false);
  const [querySearch, setQuerySearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItem, setCurrentItem] = useState(null);
  const [listCategories, setListCategories] = useState([]);
  const [isCreateApplicationModalVisible, setIsCreateApplicationModalVisible] =
    useState(false);
  const [isEditApplicationModalVisible, setIsEditApplicationModalVisible] =
    useState(false);
  const [isAdvancedSearchModalVisible, setIsAdvancedSearchModalVisible] =
    useState(false);
  const [applicationSearchType, setApplicationSearchType] =
    useState("FirstName");
  const [form] = Form.useForm();
  const getListApplicationFunction = async (
    currentPageToGetList,
    numInPage
  ) => {
    try {
      // if (isSearch) {
      //   querySearch.page = currentPageToGetList;
      //   const res = await searchAccountService(querySearch)
      //   setTotalApplication(res.data.metadata.total);
      //   setListApplication(res.data.data);
      //   return;
      // }
      const res = await getListApplicationService(
        "",
        "",
        "",
        "",
        "",
        numInPage,
        currentPageToGetList
      );
      setTotalApplication(res.data.metadata.total);
      setListApplication(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    getListApplicationFunction(currentPage, numApplicationInPage);
    const res = await getAllCategoriesService();
    setListCategories(res.data);
  }, []);

  const onFinishUpdateApplication = async (values) => {
    let updateApplication = [];
    if (typeof values.logo === "object") {
      let formatResult = [];
      const result = await getBase64(values.logo.file.originFileObj);
      formatResult = result.split(",");
      updateApplication = {
        id: values.id,
        name: values.name,
        description: values.description,
        logo: formatResult[1],
        link: values.link,
        partyId: values.partyId,
        appCategoryId: values.appCategoryId,
      };
    } else {
      updateApplication = {
        id: values.id,
        name: values.name,
        description: values.description,
        logo: values.logo,
        link: values.link,
        partyId: values.partyId,
        appCategoryId: values.appCategoryId,
      };
    }
    try {
      await updateApplicationService(updateApplication);
      getListApplicationFunction(currentPage, numApplicationInPage);
      setIsCreateApplicationModalVisible(false);
      toast.success("Update Application Success");
      handleCancelEditApplication();
    } catch (error) {
      console.log(error);
    }
  };

  // const onFinishAdvancedSearch = async (values) => {
  //   console.log(values);
  //   const search = {
  //     firstName: values.firstName??"",
  //     lastName: values.lastName??"",
  //     phoneNumber: values.phoneNumber??"",
  //     email: values.email??"",
  //     address: values.address??"",
  //     status: values.status??"",
  //     size: numApplicationInPage,
  //     page: 1,
  //   };
  //   try {
  //     const res = await searchAccountService(search)
  //     setTotalApplication(res.data.metadata.total);
  //     setListApplication(res.data.data);
  //     setIsSearch(true);
  //     setQuerySearch(search);
  //     handleCloseModalAdvancedSearch();
  //   } catch (error) {
  //     console.log(error);
  //     setTotalApplication(0);
  //     setListApplication([]);
  //   }
  // };
  const buildPartyParamSearch = (value) => {
    let firstName = "";
    let lastName = "";
    let phoneNumber = "";
    let email = "";
    let address = "";
    let status = "";
    switch (applicationSearchType) {
      case "FirstName":
        firstName = value;
        break;
      case "LastName":
        lastName = value;
        break;
      case "PhoneNumber":
        phoneNumber = value;
        break;
      case "Email":
        email = value;
        break;
      case "Address":
        address = value;
        break;
      case "Status":
        status = value;
        break;
    }
    return {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      status: status,
    };
  };
  // const onFinishSearch = async (values) => {
  //   const search = buildPartyParamSearch(values.searchString);
  //   search["size"] = numApplicationInPage;
  //   search["page"] = 1
  //   try {
  //     const res = await searchAccountService(search)
  //     setTotalApplication(res.data.metadata.total);
  //     setListApplication(res.data.data);
  //     setIsSearch(true);
  //     setQuerySearch(search);
  //   } catch (error) {
  //     console.log(error);
  //     setTotalApplication(0);
  //     setListApplication([]);
  //   }
  // };

  const showModalEditApplication = () => {
    setIsEditApplicationModalVisible(true);
  };

  const handleCancelEditApplication = () => {
    setIsEditApplicationModalVisible(false);
  };

  const onFinishCreateApplication = async (values) => {
    let formatResult = [];
    const result = await getBase64(values.logo.file.originFileObj);
    formatResult = result.split(",");
    const newApplication = {
      name: values.name,
      description: values.description,
      link: values.link,
      logo: formatResult[1],
      appCategoryId: values.appCategoryId,
    };
    console.log(newApplication);
    try {
      await createApplicationService(newApplication);
      getListApplicationFunction(currentPage, numApplicationInPage);
      setIsCreateApplicationModalVisible(false);
      toast.success("Create Application Success");
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const showModalCreateApplication = () => {
    setIsCreateApplicationModalVisible(true);
    form.resetFields();
  };

  const handleCancelCreateApplication = () => {
    setIsCreateApplicationModalVisible(false);
  };
  const showModalAdvancedSearch = () => {
    setIsAdvancedSearchModalVisible(true);
    form.resetFields();
  };
  const handleCloseModalAdvancedSearch = () => {
    setIsAdvancedSearchModalVisible(false);
  };
  const handleChangeStatusApplication = async (record) => {
    Modal.confirm({
      title: "Are you sure to send request change status this application",
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          try {
            const newReq = {
              creatorId: localStorageGetUserIdService(),
              serviceApplicationId: record.id,
            };
            await sendReqPublishApplicationService(newReq).then(() => {
              getListApplicationFunction(currentPage, numApplicationInPage);
              toast.success("Send request publish success");
            });
          } catch (error) {
            console.log(error);
          }
        }
      },
    });
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListApplicationFunction(page, numApplicationInPage);
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
      label: "Phone",
    },
    {
      name: "Email",
      label: "Email",
    },
    {
      name: "Address",
      label: "Address",
    },
    {
      name: "Status",
      label: "Status",
    },
  ];
  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (text) => <img style={{ height: 80, weight: 80 }} src={text} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text) => <p href={text}>{text}</p>,
    },

    {
      title: "Category",
      dataIndex: "appCategoryName",
      key: "appCategoryName",
      render: (text) => <p>{text}</p>,
    },

    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record, dataIndex) => <p>{text}</p>,
    },

    {
      title: t("action"),
      key: "action",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="infor-button"
            shape="default"
            onClick={() => {
              navigator(`/app-detail/${record.id}`);
            }}
          >
            <EyeFilled /> Detail
          </Button>
          {role ? (
            role === ROLE_SERVICE_PROVIDER ? (
              <>
                <Button
                  className="warn-button"
                  shape="default"
                  onClick={() => {
                    setCurrentItem(record);
                    showModalEditApplication();
                  }}
                >
                  <EditFilled />
                  Update
                </Button>
                {record.status === "unavailable" ? (
                  <Button
                    type="primary"
                    shape="default"
                    name={record}
                    onClick={() => {
                      handleChangeStatusApplication(record);
                    }}
                  >
                    <ArrowUpOutlined /> Publish
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    shape="default"
                    disabled="false"
                    name={record}
                    onClick={() => {
                      handleChangeStatusApplication(record);
                    }}
                  >
                    <ArrowUpOutlined /> Publish
                  </Button>
                )}
              </>
            ) : null
          ) : null}
          {role ? (
            role == ROLE_LOCATION_OWNER ? (
              <Button className="success-button">
                <DownloadOutlined /> Install
              </Button>
            ) : null
          ) : null}
        </Space>
      ),
    },
  ];

  const config = {
    rules: [
      {
        type: "object",
        required: true,
        message: t("reqdob"),
      },
    ],
  };

  return (
    <>
      <Row style={{ padding: 10 }}>
        <Col span={15}>
          <Form
            form={form}
            name="search"
            //   onFinish={onFinishSearch}
            initialValues={{
              type: "FirstName",
              searchString: "",
            }}
          >
            <Row>
              <Col span={4}>
                <Form.Item name="type" style={{ marginTop: 5 }}>
                  <Select
                    defaultValue="FirstName"
                    onChange={(e) => {
                      setApplicationSearchType(e);
                    }}
                  >
                    {types.map((item) => {
                      return <Option value={item.name}>{item.label}</Option>;
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="searchString" style={{ marginTop: 5 }}>
                  <AutoComplete
                    style={{ width: "100%" }}
                    options={[]}
                    placeholder="Search..."
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
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
              <Col span={3}>
                <Button
                  type="danger"
                  size={"large"}
                  onClick={showModalAdvancedSearch}
                >
                  <SearchOutlined />
                  Advanced
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={5} />
        {role ? (
          role === ROLE_SERVICE_PROVIDER || role === ROLE_ADMIN ? (
            <Col span={4}>
              <Button
                className="success-button"
                size={"large"}
                onClick={showModalCreateApplication}
              >
                <PlusOutlined /> Application
              </Button>
            </Col>
          ) : null
        ) : null}
      </Row>
      <Table
        columns={columns}
        dataSource={listApplication}
        pagination={false}
      />
      <Pagination
        defaultCurrent={1}
        total={totalApplication}
        pageSize={5}
        onChange={handleChangeNumberOfPaging}
      />
      <Modal
        title="Create Application"
        visible={isCreateApplicationModalVisible}
        onCancel={handleCancelCreateApplication}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinishCreateApplication}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input application name!",
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
                message: "Please input application description!",
              },
            ]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            name="link"
            label="Link"
            rules={[
              {
                required: true,
                message: "Please input application link!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="logo"
            label="Logo"
            rules={[
              {
                required: true,
                message: "Please choose application logo!",
              },
            ]}
          >
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture"
              maxCount={1}
              accept=".png,.jpeg"
              beforeUpload={beforeUpload}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="appCategoryId"
            label="Category"
            rules={[
              {
                required: true,
                message: "Please choose application category!",
              },
            ]}
          >
            <Select placeholder="Select your categories">
              {listCategories.map((item) => {
                return <Option value={item.id}>{item.name}</Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Create Application
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Advanced Search"
        visible={isAdvancedSearchModalVisible}
        onCancel={handleCloseModalAdvancedSearch}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="advancedSearch"
          // onFinish={onFinishAdvancedSearch}
          scrollToFirstError
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
          initialValues={{
            address: "",
            email: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            status: "",
          }}
        >
          <Form.Item name="firstName" label={t("firstname")}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label={t("lastname")}>
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label={t("phonenumber")}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label={t("email")}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label={t("address")}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label={t("status")}>
            <Select initialValues="">
              <Option value="">All</Option>
              <Option value="active">{t("active")}</Option>
              <Option value="deactive">{t("deactive")}</Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Space align="center">
              <Button align="center" type="primary" htmlType="submit">
                Search
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {currentItem ? (
        <Modal
          key={currentItem.id}
          title={t("edit")}
          visible={isEditApplicationModalVisible}
          onCancel={handleCancelEditApplication}
          footer={null}
        >
          <Form
            key={currentItem.id}
            {...formItemLayout}
            form={form}
            name="edit"
            onFinish={onFinishUpdateApplication}
            scrollToFirstError
            initialValues={{
              id: currentItem.id,
              name: currentItem.name,
              description: currentItem.description,
              logo: currentItem.logo,
              link: currentItem.link,
              partyId: localStorageGetUserIdService(),
              appCategoryId: currentItem.appCategoryId,
            }}
          >
            <Form.Item name="id" hidden={true}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="partyId" hidden={true}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input application name!",
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
                  message: "Please input application description!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="link"
              label="Link"
              rules={[
                {
                  required: true,
                  message: "Please input application link!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="logo"
              label="Logo"
              rules={[
                {
                  required: true,
                  message: "Please choose application logo!",
                },
              ]}
            >
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                maxCount={1}
                accept=".png"
                beforeUpload={beforeUpload}
                defaultFileList={[
                  {
                    uid: "abc",
                    name: "image.png",
                    status: "done",
                    url: currentItem.logo,
                  },
                ]}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="appCategoryId"
              label="Category"
              rules={[
                {
                  required: true,
                  message: "Please choose application category!",
                },
              ]}
            >
              <Select placeholder="Select your categories">
                {listCategories
                  ? listCategories.map((item) => {
                      return <Option value={item.id}>{item.name}</Option>;
                    })
                  : null}
              </Select>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Update Application
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};
export default ApplicationTable;
