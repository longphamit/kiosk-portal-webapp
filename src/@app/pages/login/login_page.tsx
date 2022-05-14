import { Col, Row } from "antd";
import { Form, Input, Button, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { toast } from "react-toastify";
import { ValidateMessages } from "rc-field-form/lib/interface";
import { signInService } from "../../services/auth_service";
import { PRIMARY_COLOR } from "../../constants/colors";

import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  USER_AVATAR,
  USER_ID,
  USER_NAME,
} from "../../constants/key";
import useDispatch from "../../hooks/use_dispatch";
import { loginAction } from "../../redux/actions/login_action";

import  "../../constants/role";
import { localStorageGetReduxState } from "../../services/localstorage_service";
import { getUserInfoService } from "../../services/user_service";
import { useTranslation } from "react-i18next";
import { ROLE_ADMIN, ROLE_LOCATION_OWNER, ROLE_SERVICE_PROVIDER } from "../../constants/role";
const validateMessages: ValidateMessages = {
  required: "${label} is required!",
  string: {
    len: "${label} must be have length with exact ${len}",
    // min: "${label} must be at least ${min} characters {signin}",
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
    dispatch(
      loginAction({ email: values.email, password: values.password })
    )
      .then(async (response: any) => {
        console.log(response);
        if (response.error) {
          // toast.error({t("warning-wrong-email-or-password")});
        } else {
          console.log(response.payload);
          const access_token = response.payload.data.token;
          console.log(access_token);
          localStorage.setItem(ACCESS_TOKEN, access_token);
          await getUserInfoService()
            .then((responseUserInfo: any) => {
              toast.success("Sign in successfull");
              console.log(responseUserInfo);
              localStorage.setItem(USER_ID, responseUserInfo.data.id);
              // localStorage.setItem(USER_NAME, responseUserInfo.data.username);
              // localStorage.setItem(USER_AVATAR, responseUserInfo.data.avatar);
              const role = localStorageGetReduxState().auth.role;
              switch(role){
                case ROLE_ADMIN:
                  break;
                case ROLE_LOCATION_OWNER:
                  break;
                case ROLE_SERVICE_PROVIDER:
                  break;
                default:
                  return;
              }
            })
            .catch((error: any) => {
              toast.error("Get user info fail");
              navigate("/signin");
            });
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
            {t("singin")}
          </h2>
          <Form
            validateMessages={validateMessages}
            className="admin-login-form"
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
             rules={[{ required: true, type: "string", min: 7 }]}
             style={{marginBottom:0}}
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
              <Form.Item style={{marginTop:10}}>
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
