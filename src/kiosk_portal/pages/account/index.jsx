import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Empty,
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
import {
  SearchOutlined,
  PlusOutlined,
  EyeFilled,
  EditFilled,
  PoweroffOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getListRoleService } from "../../services/role_service";
import {
  changeStatusAccountService,
  createAccountService,
  getListAccountService,
  searchAccountService,
  updateAccountService,
} from "../../services/account_service";
import "./styles.css";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import {
  ACCOUNT_MANAGER_HREF,
  ACCOUNT_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import {
  ROLE_ADMIN,
  ROLE_LOCATION_OWNER,
  ROLE_SERVICE_PROVIDER,
} from "../../../@app/constants/role";
import {
  CREATE_SUCCESS,
  ERROR_INPUT_ADDRESS,
  ERROR_INPUT_EMAIL,
  ERROR_INPUT_FIRST_NAME,
  ERROR_INPUT_LAST_NAME,
  ERROR_INPUT_PHONE_NUMBER,
  ERROR_REGREX_EMAIL,
  ERROR_REGREX_PHONE_NUMBER,
  ERROR_SELECT_DOB,
  ERROR_SELECT_ROLE,
} from "../../../@app/constants/message";
import { PHONE_NUMBER_REGEX } from "../../../@app/constants/regex";

const currentTime = new Date();
const AccountManagerPage = () => {
  const [isListAccountLoading, setListAccountLoading] = useState(false);
  const [isCreateAccountLoading, setCreateAccountLoading] = useState();
  const [isUpdateAccountLoading, setUpdateAccountLoading] = useState();
  const { Option } = Select;
  const { t } = useTranslation();
  const [listAccount, setListAccount] = useState();
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
  const [accountSearchType, setAccountSearchType] = useState("FirstName");
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const getListAccountFunction = async (currentPageToGetList, numInPage) => {
    setListAccountLoading(true);
    try {
      if (isSearch) {
        querySearch.page = currentPageToGetList;
        const res = await searchAccountService(querySearch);
        setTotalAccount(res.data.metadata.total);
        setListAccount(res.data.data);
        return;
      }
      const res = await getListAccountService(currentPageToGetList, numInPage);
      setTotalAccount(res.data.metadata.total);
      setListAccount(res.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setListAccountLoading(false);
    }
  };

  useEffect(async () => {
    getListAccountFunction(currentPage, numAccountInPage);
    const res = await getListRoleService();
    setListRole(res.data);
  }, []);

  const onFinishEditAccount = async (values) => {
    try {
      setUpdateAccountLoading(true);
      let isCheck = true;
      const today = new Date();
      if (values.dateOfBirth - today > 0) {
        isCheck = false;
        toast.error("Date of birth need to soon form now");
      }
      if (isCheck) {
        const updateAccount = {
          id: values.id,
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          address: values.address,
          dateOfBirth: values.dateOfBirth,
        };
        await updateAccountService(updateAccount);
        getListAccountFunction(currentPage, numAccountInPage);
        setIsCreateAccountModalVisible(false);
        toast.success("Edit account success");
        handleCancelEditAccount();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setUpdateAccountLoading(false);
    }
  };

  const buildPartyParamSearch = (value) => {
    let firstName = "";
    let lastName = "";
    let phoneNumber = "";
    let email = "";
    let address = "";
    let status = "";
    let roleName = "";
    switch (accountSearchType) {
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
      case "RoleName":
        roleName = value;
        break;
    }
    return {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      status: status,
      roleName: roleName,
    };
  };
  const onFinishSearch = async (values) => {
    const search = buildPartyParamSearch(values.searchString);
    search["status"] = values.status;
    search["size"] = numAccountInPage;
    search["roleName"] = values.role;
    search["page"] = 1;
    try {
      const res = await searchAccountService(search);
      setCurrentPage(1);
      setTotalAccount(res.data.metadata.total);
      setListAccount(res.data.data);
      setIsSearch(true);
      setQuerySearch(search);
    } catch (error) {
      console.error(error);
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
    try {
      setCreateAccountLoading(true);
      let isCheck = true;
      const today = new Date();
      if (values.dateOfBirth - today > 0) {
        isCheck = false;
        toast.error("Date of birth need to soon form now");
      }
      if (isCheck) {
        const newAccount = {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          email: values.email,
          address: values.address,
          dateOfBirth: values.dateOfBirth,
          roleId: values.roleId,
        };
        await createAccountService(newAccount);
        getListAccountFunction(currentPage, numAccountInPage);
        setIsCreateAccountModalVisible(false);
        toast.success(CREATE_SUCCESS);
      }
    } catch (error) {
      toast.error(
        error.response.data.message ??
          "Cannot create new account! Please try again"
      );
      console.error(error);
    } finally {
      setCreateAccountLoading(false);
    }
  };

  const showModalCreateAccount = () => {
    setIsCreateAccountModalVisible(true);
    form.resetFields();
  };

  const handleCancelCreateAccount = () => {
    setIsCreateAccountModalVisible(false);
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
              toast.success("Change status account success");
            });
          } catch (error) {
            toast.error(error.response.data.message);
          }
        }
      },
    });
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    const res = await getListAccountService(page, 5);
    setTotalAccount(res.data.metadata.total);
    setListAccount(res.data.data);
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
  ];
  const columns = [
    {
      title: t("firstname"),
      dataIndex: "firstName",
      key: "firstname",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("lastname"),
      dataIndex: "lastName",
      key: "lastname",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("phonenumber"),
      dataIndex: "phoneNumber",
      key: "phonenumber",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("dob"),
      dataIndex: "dateOfBirth",
      key: "dob",
      render: (text) => <p>{converDate(text)}</p>,
    },
    {
      title: t("role"),
      dataIndex: "roleName",
      key: "role",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record, dataIndex) =>
        record.status === "activate" ? (
          <Tag color="green">Activate</Tag>
        ) : (
          <Tag color="red">Deactivate</Tag>
        ),
    },

    {
      title: t("action"),
      key: "action",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="infor-button"
            onClick={() => {
              navigate("/account-detail/" + record.id);
            }}
          >
            <EyeFilled />
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
            <EditFilled />
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
              <PoweroffOutlined /> {t("change-status")}
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
              <PoweroffOutlined /> {t("change-status")}
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
        message: ERROR_SELECT_DOB,
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (
            !value ||
            currentTime.getFullYear() - parseInt(moment(value).format("YYYY")) >
              18
          ) {
            return Promise.resolve();
          }
          return Promise.reject(new Error("The age must be over 18"));
        },
      }),
    ],
  };

  const breadCumbData = [
    {
      href: ACCOUNT_MANAGER_HREF,
      label: ACCOUNT_MANAGER_LABEL,
      icon: <UserOutlined />,
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
                      setAccountSearchType(e);
                    }}
                  >
                    {types.map((item) => {
                      return <Option value={item.name}>{item.label}</Option>;
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
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
              <Col span={6}>
                <Form.Item
                  initialValue=""
                  name="status"
                  label={t("status")}
                  style={{ margin: 5 }}
                >
                  <Select>
                    <Option value="">All</Option>
                    <Option value="activate">Active</Option>
                    <Option value="deactivate">Deactive</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  initialValue=""
                  name="role"
                  label="Role"
                  style={{ margin: 5 }}
                >
                  <Select>
                    <Option value="">All</Option>
                    <Option value={ROLE_ADMIN}>Admin</Option>
                    <Option value={ROLE_LOCATION_OWNER}>Location Owner</Option>
                    <Option value={ROLE_SERVICE_PROVIDER}>
                      Service Provider
                    </Option>
                  </Select>
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
            <PlusOutlined /> Account
          </Button>
        </Col>
      </Row>
      {listAccount && !isListAccountLoading ? (
        listAccount.lenght === 0 ? (
          <>
            <Row justify="center" align="center" style={{ marginTop: 250 }}>
              <Col>
                <Empty />
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={listAccount}
              pagination={false}
            />
            <Pagination
              defaultCurrent={1}
              total={totalAccount}
              pageSize={5}
              current={currentPage}
              onChange={handleChangeNumberOfPaging}
            />
          </>
        )
      ) : (
        <Skeleton />
      )}
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
                message: ERROR_INPUT_FIRST_NAME,
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
                message: ERROR_INPUT_LAST_NAME,
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
                pattern: new RegExp(PHONE_NUMBER_REGEX),
                message: ERROR_REGREX_PHONE_NUMBER,
              },
              {
                required: true,
                message: ERROR_INPUT_PHONE_NUMBER,
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
                message: ERROR_INPUT_ADDRESS,
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
                message: ERROR_REGREX_EMAIL,
              },
              {
                required: true,
                message: ERROR_INPUT_EMAIL,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="roleId"
            label={t("role")}
            rules={[{ required: true, message: ERROR_SELECT_ROLE }]}
          >
            <Select placeholder={t("selectrole")}>
              {listRole
                ? listRole.map((item) => {
                    return <Option value={item.id}>{item.name}</Option>;
                  })
                : null}
            </Select>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            {isCreateAccountLoading ? (
              <Spin />
            ) : (
              <Button type="primary" htmlType="submit">
                {t("register")}
              </Button>
            )}
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
                  message: ERROR_INPUT_FIRST_NAME,
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
                  message: ERROR_INPUT_LAST_NAME,
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
                  pattern: new RegExp(PHONE_NUMBER_REGEX),
                  message: ERROR_REGREX_PHONE_NUMBER,
                },
                {
                  required: true,
                  message: ERROR_INPUT_PHONE_NUMBER,
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
                  message: ERROR_INPUT_ADDRESS,
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
              {isUpdateAccountLoading ? (
                <Spin />
              ) : (
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              )}
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};
export default AccountManagerPage;
