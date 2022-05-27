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
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  changeStatusAccountService,
  createAccountService,
  getListAccountService,
  getListRoleService,
  searchAccountService,
  updateAccountService,
} from "../../../@app/services/user_service";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ROLE_ADMIN, ROLE_LOCATION_OWNER, ROLE_SERVICE_PROVIDER } from "../../../@app/constants/role";
const AccountManagerPage = () => {
  const { Option } = Select;
  const { t } = useTranslation();
  const [listAccount, setListAccount] = useState([]);
  const [totalAccount, setTotalAccount] = useState(0);
  const [numAccountInPage, setNumAccountInPage] = useState(5);
  const [isSearch, setIsSearch] = useState(false);
  const [querySearch, setQuerySearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [listRole, setListRole] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [isCreateAccountModalVisible, setIsCreateAccountModalVisible] =
    useState(false);
  const [isEditAccountModalVisible, setIsEditAccountModalVisible] =
    useState(false);
  const [isAdvancedSearchModalVisible, setIsAdvancedSearchModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const getListAccountFunction = async (currentPageToGetList, numInPage) => {
    try {
      if (isSearch) {
        querySearch.page = currentPageToGetList;
        await searchAccountService(querySearch).then((res) => {
          setTotalAccount(res.data.metadata.total);
          setListAccount(res.data.data);
        });
        return;
      }
      await getListAccountService(currentPageToGetList, numInPage).then(
        (res) => {
          setTotalAccount(res.data.metadata.total);
          setListAccount(res.data.data);
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const listRoleFunction = async () => {
    try {
      await getListRoleService().then((res) => {
        setListRole(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListAccountFunction(currentPage, numAccountInPage);
    listRoleFunction();
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
    const updateAccount = {
      id: values.id,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      address: values.address,
      dateOfBirth: values.dateOfBirth,
    };
    try {
      await updateAccountService(updateAccount).then(() => {
        getListAccountFunction(currentPage, numAccountInPage);
        setIsCreateAccountModalVisible(false);
        toast.success(t("toastsuccesseditaccount"));
        handleCancelEditAccount();
      });
    } catch (error) {
      console.log(error);
    }
  };
  function checkUndefine(value) {
    if (value === undefined) {
      return "";
    }
    return value;
  }
  const onFinishAdvancedSearch = async (values) => {
    console.log(values);
    const search = {
      firstName: checkUndefine(values.firstName),
      lastName: checkUndefine(values.lastName),
      phoneNumber: checkUndefine(values.phoneNumber),
      email: checkUndefine(values.email),
      address: checkUndefine(values.address),
      status: checkUndefine(values.status),
      roleName: checkUndefine(values.roleName),
      size: numAccountInPage,
      page: 1,
    };
    try {
      await searchAccountService(search).then((res) => {
        setTotalAccount(res.data.metadata.total);
        setListAccount(res.data.data);
        setIsSearch(true);
        setQuerySearch(search);
        handleCloseModalAdvancedSearch();
      });
    } catch (error) {
      console.log(error);
      setTotalAccount(0);
      setListAccount([]);
    }
  };
  const onFinishSearch = async (values) => {
    console.log(values);
    let firstName = "";
    let lastName = "";
    let phoneNumber = "";
    let email = "";
    let address = "";
    let status = "";
    let roleName = "";
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
      case "Status":
        status = values.searchString;
        break;
      case "RoleName":
        roleName = values.searchString;
        break;
    }
    const search = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      status: status,
      roleName: roleName,
      size: numAccountInPage,
      page: 1,
    };
    try {
      await searchAccountService(search).then((res) => {
        setTotalAccount(res.data.metadata.total);
        setListAccount(res.data.data);
        setIsSearch(true);
        setQuerySearch(search);
      });
    } catch (error) {
      console.log(error);
      setTotalAccount(0);
      setListAccount([]);
    }
  };
  const showModalEditAccount = () => {
    setIsEditAccountModalVisible(true);
  };

  const handleCancelEditAccount = () => {
    setIsEditAccountModalVisible(false);
  };
  const onFinishCreateAccount = async (values) => {
    const newAccount = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      address: values.address,
      dateOfBirth: values.dateOfBirth,
      roleId: values.roleId,
    };
    try {
      await createAccountService(newAccount).then(() => {
        getListAccountFunction(currentPage, numAccountInPage);
        setIsCreateAccountModalVisible(false);
        toast.success(t("toastsuccesscreateaccount"));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const showModalCreateAccount = () => {
    setIsCreateAccountModalVisible(true);
    form.resetFields();
  };

  const handleCancelCreateAccount = () => {
    setIsCreateAccountModalVisible(false);
  };
  const showModalAdvancedSearch = () => {
    setIsAdvancedSearchModalVisible(true);
    form.resetFields();
  };
  const handleCloseModalAdvancedSearch = () => {
    setIsAdvancedSearchModalVisible(false);
  };
  const handleChangeStatusAccount = async (record) => {
    Modal.confirm({
      title: t("confirmChangeStatusAccount"),
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          try {
            await changeStatusAccountService(record.id, null).then(() => {
              getListAccountFunction(currentPage, numAccountInPage);
              toast.success(t("toastsuccesschangestatus"));
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
    await getListAccountFunction(page, numAccountInPage);
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
    {
      name: "RoleName",
      label: "Role Name",
    }
  ];
  const columns = [
    {
      title: t("firstname"),
      dataIndex: "firstName",
      key: "firstname",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("lastname"),
      dataIndex: "lastName",
      key: "lastname",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("phonenumber"),
      dataIndex: "phoneNumber",
      key: "phonenumber",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("address"),
      dataIndex: "address",
      key: "address",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("dob"),
      dataIndex: "dateOfBirth",
      key: "dob",
      render: (text) => <a>{converDate(text)}</a>,
    },
    {
      title: t("role"),
      dataIndex: "roleName",
      key: "role",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record, dataIndex) =>
        record.status === "active" ? (
          <Tag color="green">{t("activate")}</Tag>
        ) : (
          <a style={{ color: "red" }}>{t("deactive")}</a>
        ),
    },

    {
      title: t("action"),
      key: "action",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button className="infor-button" onClick={() => {
            navigate("/account-detail/" + record.id)
          }}>
            {t("detail")}
          </Button>
          <Button
            className="warn-button"
            shape="default"
            onClick={() => {
              setCurrentItem(record);
              showModalEditAccount();
            }}
          >
            {t("edit")}
          </Button>
          {record.roleName === "Admin" ? (
            <Button
              type="primary"
              shape="default"
              name={record}
              disabled="false"
              onClick={() => {
                handleChangeStatusAccount(record);
              }}
            >
              {t("change-status")}
            </Button>
          ) : (
            <Button
              type="primary"
              shape="default"
              name={record}
              onClick={() => {
                handleChangeStatusAccount(record);
              }}
            >
              {t("change-status")}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const options = [
    { value: 'Burns Bay Road' },
    { value: 'Downing Street' },
    { value: 'Wall Street' },
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
            onFinish={onFinishSearch}
            initialValues={{
              type: "FirstName",
              searchString: "",
            }}
          >
            <Row>
              <Col span={4}>
                <Form.Item name="type" style={{ marginTop: 5 }} >
                  <Select defaultValue="FirstName" >
                    {types.map((item) => {
                      return <Option value={item.name}>{item.label}</Option>;
                    })}
                  </Select>
                </Form.Item></Col>
              <Col span={10}>

                <Form.Item name="searchString" style={{ marginTop: 5 }}>
                  <AutoComplete
                    style={{ width: "100%" }}
                    options={options}
                    placeholder="Search..."
                    filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
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
            onClick={showModalCreateAccount}
          >
            {t("createaccount")}
          </Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={listAccount} pagination={false} />
      <Pagination
        defaultCurrent={1}
        total={totalAccount}
        pageSize={5}
        onChange={handleChangeNumberOfPaging}
      />

      <Modal
        title={t("createaccount")}
        visible={isCreateAccountModalVisible}
        onCancel={handleCancelCreateAccount}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinishCreateAccount}
          scrollToFirstError
        >
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
          <Form.Item
            name="email"
            label={t("email")}
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: t("reqemail"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label={t("password")}
            rules={[
              {
                required: true,
                message: t("reqpassword"),
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label={t("confirmpassword")}
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: t("reqconfpassword"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("reqsamepassword")));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="gender"
            label={t("gender")}
            rules={[{ required: true, message: t("reqgender") }]}
          >
            <Select placeholder={t("selectgender")}>
              <Option value="male">{t("male")}</Option>
              <Option value="female">{t("female")}</Option>
              <Option value="other">{t("other")}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="roleId"
            label={t("role")}
            rules={[{ required: true, message: t("reqrole") }]}
          >
            <Select placeholder={t("selectrole")}>
              {listRole.map((item) => {
                return <Option value={item.id}>{item.name}</Option>;
              })}
            </Select>
          </Form.Item>
          
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              {t("register")}
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
          onFinish={onFinishAdvancedSearch}
          scrollToFirstError
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
          initialValues={{
            address: "",
            email: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            roleName: "",
            status: ""
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
          <Form.Item
            name="roleName"
            label={t("role")}
          >
            <Select >
              <Option value="">All</Option>
              <Option value={ROLE_SERVICE_PROVIDER}>{ROLE_SERVICE_PROVIDER}</Option>
              <Option value={ROLE_LOCATION_OWNER}>{ROLE_LOCATION_OWNER}</Option>
              <Option value={ROLE_ADMIN}>{ROLE_ADMIN}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label={t("status")}
          >
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
          visible={isEditAccountModalVisible}
          onCancel={handleCancelEditAccount}
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
export default AccountManagerPage;
