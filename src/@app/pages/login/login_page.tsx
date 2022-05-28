import { Col, Row } from "antd";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { toast } from "react-toastify";
import { ValidateMessages } from "rc-field-form/lib/interface";
import { PRIMARY_COLOR } from "../../constants/colors";

import {
  ACCESS_TOKEN,
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
  const { t } = useTranslation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values: any) => {
    dispatch(loginAction({ email: values.email, password: values.password }))
      .then(async (response: any) => {
        console.log(response);
        if (response.error) {
          toast.error("Wrong Username or password");
        } else {
          localStorage.setItem(ACCESS_TOKEN, response.payload.data.token);
          localStorage.setItem(USER_ID, response.payload.data.id);
          localStorage.setItem(
            USER_FRIST_NAME,
            response.payload.data.firstName
          );
          if(!response.payload.data.passwordIsChanged){
            navigate("/reset-pass");
          }else{
            switch (response.payload.data.roleName) {
              case ROLE_ADMIN:
                return navigate("/homepage");
              case ROLE_LOCATION_OWNER:
                return navigate("/homepage");
              case ROLE_SERVICE_PROVIDER:
                break;
            }
            toast.success("Sign in successfull");
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: "100vh", backgroundColor: PRIMARY_COLOR }}
      >
        <Col span={8} />
        <Col span={8} className="login-form">
          <h2 style={{ textAlign: "center", fontWeight: "bold", padding: 15 }}>
            {t("signin")}
          </h2>
          <Form
            validateMessages={validateMessages}
            className="login-form"
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
              rules={[{ required: true, type: "string", min: LENGTH_PASSWORD_REQUIRED }]}
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
                <Button type="primary" htmlType="submit">
                  {t("signin")}
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Col>
        <Col span={8} />
      </Row>
    </div>
  );
};
export default LoginPage;
