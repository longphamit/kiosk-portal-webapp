import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
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
} from "../../../@app/services/user_service";
import moment from "moment";
import Search from "antd/lib/transfer/search";

const AccountManager = () => {
  const { Option } = Select;
  const { t } = useTranslation();
  const [listAccount, setListAccount] = useState([]);
  const [totalAccount, setTotalAccount] = useState(0);
  const [numAccountInPage, setNumAccountInPage] = useState(5);
  const [isSearch, setIsSearch] = useState(false);
  const [querySearch, setQuerySearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [listRole, setListRole] = useState([]);
  const [isCreateAccountModalVisible, setIsCreateAccountModalVisible] =
    useState(false);
  const [isAdvancedSearchModalVisible, setIsAdvancedSearchModalVisible] =
    useState(false);
  const [form] = Form.useForm();
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
  const onFinishAdvancedSearch = async (values) => {
    const search = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      address: values.address,
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
  const onFinishSearch = async (values) => {
    console.log(values);
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
        toast.success(t("toastSuccessCreateAccount"));
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
              toast.success(t("toastSuccessChangeStatus"));
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
      title: t("gender"),
      dataIndex: "gender",
      key: "gender",
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
          <a style={{ color: "green" }}>{t("active")}</a>
        ) : (
          <a style={{ color: "red" }}>{t("deactivate")}</a>
        ),
    },

    {
      title: t("action"),
      key: "action",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button type="primary" shape="default" size={"large"} onClick={{}}>
            {t("edit")}
          </Button>
          {record.roleName === "Admin" ? (
            <Button
              type="primary"
              shape="default"
              size={"large"}
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
              size={"large"}
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

  const config = {
    rules: [
      {
        type: "object",
        required: true,
        message: t("reqdob"),
      },
    ],
  };
  const prefixSearch = (
    <Form.Item name="type" noStyle>
      <Select defaultValue="FirstName">
        {types.map((item) => {
          return <Option value={item.name}>{item.label}</Option>;
        })}
      </Select>
    </Form.Item>
  );
  return (
    <>
      <Row style={{ padding: 10 }}>
        <Col span={13}>
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
              <Col span={16}>
                <Form.Item name="searchString" style={{ marginTop: 5 }}>
                  <Input
                    addonBefore={prefixSearch}
                    style={{ width: "100%" }}
                    placeholder="Search..."
                    value=""
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
            </Row>
          </Form>
        </Col>

        <Col span={3}>
          <Button
            style={{ marginLeft: 10 }}
            type="danger"
            shape="round"
            size={"large"}
            onClick={showModalAdvancedSearch}
          >
            Advanced Search
          </Button>
        </Col>
        <Col span={3}></Col>
        <Col span={4}>
          <Button
            type="primary"
            shape="round"
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
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error(t("reqcheckbox"))),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              {t("checkboxcreateaccount")}
              <a href="">{t("checkboxcreateaccount2")}</a>
            </Checkbox>
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
          <Form.Item {...tailFormItemLayout}>
            <Space align="center">
              <Button align="center" type="primary" htmlType="submit">
                Search
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AccountManager;
