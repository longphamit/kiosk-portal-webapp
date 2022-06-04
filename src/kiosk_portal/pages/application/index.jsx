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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import {
  createApplicationService,
  getListApplicationService,
  sendReqPublishApplicationService,
  updateLogoServiceApplicationService,
} from "../../services/application_service";
import { localStorageGetUserIdService } from "../../../@app/services/localstorage_service";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../../@app/utils/file_util";
const ApplicationPage = () => {
  const { Option } = Select;
  const { t } = useTranslation();
  const [listApplication, setListApplication] = useState([]);
  const [totalApplication, setTotalApplication] = useState(0);
  const [numApplicationInPage, setNumApplicationInPage] = useState(5);
  const [isSearch, setIsSearch] = useState(false);
  const [querySearch, setQuerySearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItem, setCurrentItem] = useState(null);
  const [isCreateApplicationModalVisible, setIsCreateapplicationModalVisible] =
    useState(false);
  const [isEditApplicationModalVisible, setIsEditApplicationModalVisible] =
    useState(false);
  const [isAdvancedSearchModalVisible, setIsAdvancedSearchModalVisible] =
    useState(false);
  const [IsUpdateLogoApplicationVisible, setIsUpdateLogoApplicationVisible] =
    useState(false);
  const [applicationSearchType, setApplicationSearchType] =
    useState("FirstName");
  const [form] = Form.useForm();
  const [imageBase64, setImageBase64] = useState(null);
  const [chooseImg, setChooseImg] = useState([]);
  const [formatImg, setFormatImg] = useState(false);
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
        currentPageToGetList,
        numInPage
      );
      setTotalApplication(res.data.metadata.total);
      setListApplication(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListApplicationFunction(currentPage, numApplicationInPage);
  }, []);

  // const onFinishEditApplication = async (values) => {
  //   const updateApplication = {
  //     id: values.id,
  //     firstName: values.firstName,
  //     lastName: values.lastName,
  //     phoneNumber: values.phoneNumber,
  //     address: values.address,
  //     dateOfBirth: values.dateOfBirth,
  //   };
  //   try {
  //     await updateAccountService(updateApplication)
  //     getListApplicationFunction(currentPage, numApplicationInPage);
  //     setIsCreateapplicationModalVisible(false);
  //     toast.success("Update Application Success");
  //     handleCancelEditApplication();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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

  const showModalUpdateLogoApplication = () => {
    setIsUpdateLogoApplicationVisible(true);
  };

  const handleCancelEditApplication = () => {
    setIsEditApplicationModalVisible(false);
  };

  const handleCancelUpdateLogoApplication = () => {
    setIsUpdateLogoApplicationVisible(false);
  };

  const beforeUpload = (file) => {
    setFormatImg(true);
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      toast.error("You can only upload JPG/PNG file!");
      setFormatImg(false);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast.error("Image must smaller than 2MB!");
      setFormatImg(false);
    }

    return isJpgOrPng && isLt2M;
  };

  const changeImg = (file) => {
    setChooseImg(file);
  };

  const onFinishCreateApplication = async (values) => {
    const newApplication = {
      name: values.name,
      description: values.description,
      link: values.link,
      appCategoryId: values.appCategoryId,
    };
    try {
      await createApplicationService(newApplication);
      getListApplicationFunction(currentPage, numApplicationInPage);
      setIsCreateapplicationModalVisible(false);
      toast.success("Create Application Success");
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishUpdateLogoApplication = async (value) => {
    let formatResult = [];
    const result = await getBase64(value.logo.file.originFileObj);
    formatResult = result.split(",");
    const objectUpdateLogo = {
      serviceApplicationId: currentItem.id,
      logo: formatResult[1],
    };
    try {
      const res = await updateLogoServiceApplicationService(objectUpdateLogo);
      getListApplicationFunction(currentPage, numApplicationInPage);
      setIsUpdateLogoApplicationVisible(false);
      toast.success("Update Logo Success");
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const showModalCreateApplication = () => {
    setIsCreateapplicationModalVisible(true);
    form.resetFields();
  };

  const handleCancelCreateApplication = () => {
    setIsCreateapplicationModalVisible(false);
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
              toast.success("Send req success");
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

  const converDate = (stringToConvert) => {
    return moment(new Date(stringToConvert)).format("DD/MM/YYYY");
  };
  const getDate = (dateOfBirth) => {
    return moment(dateOfBirth);
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
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text) => <a href={text}>{text}</a>,
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (text) => <img style={{ height: 80, weight: 80 }} src={text} />,
    },
    {
      title: "Category",
      dataIndex: "appCategoryName",
      key: "appCategoryName",
      render: (text) => <a>{text}</a>,
    },

    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record, dataIndex) => <a>{text}</a>,
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
              setCurrentItem(record);
              showModalEditApplication();
            }}
          >
            Update application
          </Button>
          {record.status === "incomplete" ? (
            <Button
              className="warn-button"
              shape="default"
              onClick={() => {
                setCurrentItem(record);
                showModalUpdateLogoApplication();
              }}
            >
              Add Logo
            </Button>
          ) : (
            <Button
              className="warn-button"
              shape="default"
              disabled
              onClick={() => {
                setCurrentItem(record);
                showModalUpdateLogoApplication();
              }}
            >
              Add Logo
            </Button>
          )}
          {record.status === "unavailable" ? (
            <Button
              type="primary"
              shape="default"
              name={record}
              onClick={() => {
                handleChangeStatusApplication(record);
              }}
            >
              Send Req Publish App
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
              Send Req Publish App
            </Button>
          )}
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
              <Col span={3}>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{ marginLeft: 10, borderRadius: 5 }}
                    type="primary"
                    size={"large"}
                  >
                    Search
                  </Button>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button
                  type="danger"
                  size={"large"}
                  onClick={showModalAdvancedSearch}
                >
                  Advanced Search
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
            onClick={showModalCreateApplication}
          >
            Create application
          </Button>
        </Col>
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
            name="appCategoryId"
            label="Category"
            rules={[
              {
                required: true,
                message: "Please choose application category!",
              },
            ]}
          >
            <Select>
              <Option value="ae1f9890-194d-4b69-8b57-7f496581a45a">Move</Option>
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
        title="Update Logo"
        visible={IsUpdateLogoApplicationVisible}
        onCancel={handleCancelUpdateLogoApplication}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="updatelogo"
          onFinish={onFinishUpdateLogoApplication}
          scrollToFirstError
        >
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
              onChange={changeImg}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            {formatImg ? (
              <Button type="primary" htmlType="submit">
                Add Logo
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" disabled>
                Add Logo
              </Button>
            )}
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
            //   onFinish={onFinishEditApplication}
            scrollToFirstError
            initialValues={{
              firstName: currentItem.firstName,
              lastName: currentItem.lastName,
              phoneNumber: currentItem.phoneNumber,
              address: currentItem.address,
              dateOfBirth: getDate(currentItem.dateOfBirth),
              id: currentItem.id,
            }}
          >
            <Form.Item name="id" hidden={true}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name="firstName"
              label={t("firstname")}
              rules={[
                {
                  required: true,
                  message: t("reqfirstname"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label={t("lastname")}
              rules={[
                {
                  required: true,
                  message: t("reqlastname"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label={t("phonenumber")}
              rules={[
                {
                  pattern: new RegExp("^[+0]{0,2}(91)?[0-9]{10}$"),
                  message: t("formatphonenumber"),
                },
                {
                  required: true,
                  message: t("reqphonenumber"),
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="address"
              label={t("address")}
              rules={[
                {
                  required: true,
                  message: t("reqaddress"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="dateOfBirth" label={t("dob")} {...config}>
              <DatePicker
                placeholder={t("selectdob")}
                format="DD/MM/YYYY"
                allowClear={false}
                style={{
                  height: "auto",
                  width: "auto",
                }}
              />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};
export default ApplicationPage;
