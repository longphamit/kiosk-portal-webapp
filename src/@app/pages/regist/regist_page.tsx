import { Col, DatePicker, Row, Select, Spin } from "antd";
import { Form, Input, Button, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import useDispatch from "../../hooks/use_dispatch";
import { Option } from "antd/lib/mentions";
import { ValidateMessages } from "rc-field-form/lib/interface";
import { signUpService } from "../../services/auth_service";
import { toast } from "react-toastify";
import { useState } from "react";
const validateMessages: ValidateMessages = {
  required: "${label} is required!",
  string: {
    len: "${label} must be have length with exact ${len}",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
const RegistPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = Form.useForm();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values: any) => {
    setIsLoading(true)
    console.log(values);
    const dobDate = new Date(values.dob);
    await signUpService(
      values.firstName,
      values.lastName,
      values.gender,
      dobDate,
      values.username,
      values.phone,
      values.email,
      values.cardNumber,
      values.password
    )
      .then((response: any) => {
        toast("Sign up successfull!");
        toast("Please login to system");
        navigate("/signin");
      })
      .catch((error: any) => {
        console.log(error.response);
        toast(error.response.data.message);
      }).finally(() => {
        setIsLoading(false)
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const configTime = {
    rules: [{ type: "object" as const, message: "Please select time!" }],
  };

  return (
    <div>
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: "100vh", padding: 40, backgroundColor: "#93dbbd" }}
      >
        <Col span={4} />
        <Col span={16} className="login-form">
          <h2 style={{ textAlign: "center", fontWeight: "bold" }}>Sign up</h2>

          <Form
            className="admin-login-form"
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, type: "string" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="First name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phoneNumber"
              hasFeedback
              rules={[{ required: true, len: 10 }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              hasFeedback
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Identity Num"
              name="cardNumber"
              rules={[
                {
                  required: true,
                  message: "Please input your identity card number!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select placeholder="select your gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item name="dob" label="Birth Day" {...configTime}>
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              hasFeedback
              rules={[{ required: true, type: "string", min: 8 }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}
            <Row justify="center" align="middle">
              <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
                <Button style={{ margin: 10 }} danger htmlType="submit">
                  Sign up
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                <Button
                  type="link"
                  style={{ margin: 10 }}
                  onClick={() => navigate("/signin")}
                >
                  Sign in
                </Button>
              </Form.Item>
            </Row>
          </Form>
          {isLoading ? (
            <Row justify="center" align="middle">
              <Spin style={{ marginBottom: 20 }} />
            </Row>
          ) : null}
        </Col>
        <Col span={4} />
      </Row>
    </div>
  );
};
export default RegistPage;
