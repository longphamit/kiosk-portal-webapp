import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  Row,
  Skeleton,
  Spin,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { localStorageGetUserIdService } from "../../../@app/services/localstorage_service";
import { formItemLayout } from "../../layouts/form_layout";
import {
  getAccountByIdService,
  resetPasswordService,
  updateAccountService,
} from "../../services/account_service";
import moment from "moment";
import { toast } from "react-toastify";
const validateMessages = {
  required: "${label} is required!",
  string: {
    len: "${label} must be have length with exact ${len}",
    min: "${label} must be at least ${min} characters",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
const formatDate = "DD/MM/YYYY";
const ProfilePage = () => {
  const [party, setParty] = useState();
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isLoadingUpdatePassword, setIsLoadingUpdatePassword] = useState(false);
  const [isLoadingUpdateProfile, setIsLoadingUpdateProfile] = useState(false);
  const [formChangePassword, formProfile] = Form.useForm();
  const partyId = localStorageGetUserIdService();
  const { t } = useTranslation();
  const getPartyById = async () => {
    try {
      setIsLoadingInfo(true);
      const res = await getAccountByIdService(partyId);
      setParty(res.data);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingInfo(false);
    }
  };
  const onFinishUpdatePassword = async (values) => {
    try {
      setIsLoadingUpdatePassword(true);
      const res = await resetPasswordService(values);
      toast.success(res.message);
      formChangePassword.resetFields();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingUpdatePassword(false);
    }
  };
  const onFinishUpdateProfile = async (values) => {
    setIsLoadingUpdateProfile(true);
    const accountInfo = {
      id: partyId,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      address: values.address,
      dateOfBirth: values.dateOfBirth,
    };
    try {
      const res = await updateAccountService(accountInfo);
      toast.success(res.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingUpdateProfile(false);
    }
  };
  const config = {
    rules: [
      {
        type: "object",
        required: true,
        message: t("reqdob"),
      },
    ],
  };

  useEffect(() => {
    getPartyById();
  }, []);
  const getDate = (str) => {
    return moment(str).format(formatDate);
  };
  return (
    <>
      <div>
        {isLoadingInfo ? <Skeleton className="center" /> : null}
        {party ? (
          <Row style={{ padding: 10 }}>
            <Col span={14}>
              <Card title="Profile Information">
                <Form
                  {...formItemLayout}
                  form={formProfile}
                  name="register"
                  scrollToFirstError
                  onFinish={onFinishUpdateProfile}
                  initialValues={{
                    firstName: party.firstName,
                    lastName: party.lastName,
                    phoneNumber: party.phoneNumber,
                    address: party.address,
                    email: party.email,
                    dateOfBirth: moment(getDate(party.dateOfBirth), formatDate),
                  }}
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
                        pattern: new RegExp("(84|0[3|5|7|8|9])+([0-9]{8})"),
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
                    <Input disabled />
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
                  <Row justify="center" align="middle">
                    <Col>
                      <Form.Item>
                        {isLoadingUpdateProfile ? (
                          <Spin />
                        ) : (
                          <Button type="primary" htmlType="submit">
                            Update
                          </Button>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
              <Card title="Password">
                <Form
                  form={formChangePassword}
                  validateMessages={validateMessages}
                  {...formItemLayout}
                  onFinish={onFinishUpdatePassword}
                >
                  <Form.Item
                    label="Old Password"
                    name="oldPassword"
                    rules={[{ required: true, type: "string", min: 7 }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, type: "string", min: 7 }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Row justify="center" align="middle">
                    <Form.Item>
                      {isLoadingUpdatePassword ? (
                        <Spin />
                      ) : (
                        <Button
                          style={{ margin: 10 }}
                          type="primary"
                          htmlType="submit"
                        >
                          Update password
                        </Button>
                      )}
                    </Form.Item>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        ) : null}
        {!isLoadingInfo && !party ? <Empty /> : null}
      </div>
    </>
  );
};
export default ProfilePage;
