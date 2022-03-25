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

import { ROLE_ADMIN } from "../../constants/role";
import { localStorageGetReduxState } from "../../services/localstorage_service";
import { getUserInfoService } from "../../services/user_service";
const validateMessages:ValidateMessages = {
  required: '${label} is required!',
  string: {
    len:'${label} must be have length with exact ${len}',
    min:'${label} must be at least ${min} characters'
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
const LoginPage: React.FC = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values: any) => {
    dispatch(
      loginAction({ username: values.username, password: values.password })
    )
      .then(async (response: any) => {
        console.log(response);
        if (response.error) {
          toast.error("Wrong Username or password");
        } else {
          const access_token = response.payload.data.access_token;
          console.log(access_token);
          const refresh_token = response.payload.data.refresh_token;
          localStorage.setItem(ACCESS_TOKEN, access_token);
          localStorage.setItem(REFRESH_TOKEN, refresh_token);
          await getUserInfoService()
            .then((responseUserInfo: any) => {
              toast.success("Sign in successfull");
              console.log(responseUserInfo);
              localStorage.setItem(USER_ID, responseUserInfo.data.id);
              localStorage.setItem(USER_NAME, responseUserInfo.data.username);
              localStorage.setItem(USER_AVATAR, responseUserInfo.data.avatar);
              const roles = localStorageGetReduxState().auth.roles;
              roles
                ? roles.includes(ROLE_ADMIN)
                  ? navigate("/admin-home")
                  : navigate("/admin-home")
                : navigate("/admin-home");
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
          <h2 style={{ textAlign: "center", fontWeight: "bold" }}>Sign in</h2>
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
              label="Username"
              name="username"
              rules={[{ required: true,type:"string" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, type: "string", min: 8 }]}
            >
              <Input.Password />
            </Form.Item>
            <Row justify="center" align="middle">
              <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
                <Button style={{ margin: 10 }} type="primary" htmlType="submit">
                  Sign in
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                <Button
                  type="link"
                  style={{ margin: 10 }}
                  danger
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
              </Form.Item>
              
            </Row>
            <Row justify="center" align="middle">
            <a onClick={()=>{navigate("/forgot-pass")}}>Forgot password?</a>
            </Row>
          </Form>
        </Col>
        <Col span={8} />
      </Row>
    </div>
  );
};
export default LoginPage;
