import { Col, Row } from "antd";
import { Form, Input, Button, Spin } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import "./styles.css";
import { toast } from "react-toastify";
import { ValidateMessages } from "rc-field-form/lib/interface";
import { PRIMARY_COLOR } from "../../constants/colors";

import {
  ACCESS_TOKEN,
  USER_EMAIL,
  USER_FRIST_NAME,
  USER_ID,
} from "../../constants/key";
import useDispatch from "../../hooks/use_dispatch";
import { loginAction } from "../../redux/actions/login_action";

import "../../constants/role";
import { useTranslation } from "react-i18next";
import {
  ROLE_ADMIN,
  ROLE_LOCATION_OWNER,
  ROLE_SERVICE_PROVIDER,
} from "../../constants/role";
import { LENGTH_PASSWORD_REQUIRED } from "../../constants/number_constants";
import { useEffect, useState } from "react";
import { HOME_PAGE_PATH } from "../../../kiosk_portal/constants/path_constants";
import { Footer } from "antd/lib/layout/layout";
const validateMessages: ValidateMessages = {
  required: "${label} is required!",
  string: {
    len: "${label} must be have length with exact ${len}",
    min: "${label} must be at least ${min} characters",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
const LoginPage: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values: any) => {
    setLoading(true);
    dispatch(loginAction({ email: values.email, password: values.password }))
      .then(async (response: any) => {
        setLoading(false);
        if (response.error?.message === "Request failed with status code 404") {
          toast.error("Wrong Username or password");
        } else if (
          response.error?.message === "Request failed with status code 403"
        ) {
          return;
        } else {
          localStorage.setItem(ACCESS_TOKEN, response.payload.data.token);
          localStorage.setItem(USER_ID, response.payload.data.id);
          localStorage.setItem(USER_EMAIL, response.payload.data.email);
          localStorage.setItem(
            USER_FRIST_NAME,
            response.payload.data.firstName
          );
          if (!response.payload.data.passwordIsChanged) {
            navigate("/reset-pass");
          } else {
            switch (response.payload.data.roleName) {
              case ROLE_ADMIN:
                return navigate(HOME_PAGE_PATH);
              case ROLE_LOCATION_OWNER:
                return navigate(HOME_PAGE_PATH);
              case ROLE_SERVICE_PROVIDER:
                return navigate(HOME_PAGE_PATH);
            }
            toast.success("Sign in successfull");
          }
        }
      })
      .catch((error: any) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    let isSignined = localStorage.getItem("ACCESS_TOKEN") !== null;
    if (isSignined) navigate("/homepage");
  }, []);
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <Row
        align="middle"
        style={{ minHeight: "100vh", backgroundColor: "#fff" }}
      >
        <Col span={12}>
          <div>
            <img
              width="100%"
              src={require("../../../assets/user_kiosk_3.png")}
            />
          </div>
        </Col>

        <Col span={8} className="login-form">
          <h2 style={{ textAlign: "center", fontWeight: "bold", padding: 15 }}>
            {t("signin")}
          </h2>
          <Form
            validateMessages={validateMessages}
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "string" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  type: "string",
                  min: LENGTH_PASSWORD_REQUIRED,
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input.Password />
            </Form.Item>
            <Row justify="end" align="middle">
              <a
                onClick={() => {
                  navigate("/forgot-pass");
                }}
                style={{ paddingRight: 50 }}
              >
                {t("forgot-password")}
              </a>
            </Row>
            <Row justify="center" align="middle">
              <Form.Item style={{ marginTop: 10 }}>
                {isLoading ? (
                  <Spin />
                ) : (
                  <Button type="primary" htmlType="submit">
                    {t("signin")}
                  </Button>
                )}
              </Form.Item>
            </Row>
          </Form>
        </Col>
      </Row>
      <Footer className="header">
        <Row>
          <Col span={18} />

          <Col span={6}>
            Copyright © 2022 IKFTS teams, https://tikap.cf:9930/
          </Col>
        </Row>
      </Footer>
    </div>
  );
};
export default LoginPage;
