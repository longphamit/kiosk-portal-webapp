import { Button, Col, Form, Input, Row, Spin } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PRIMARY_COLOR } from "../../constants/colors";
import { ERROR_INPUT_EMAIL } from "../../constants/message";
import { forgotPasswordService } from "../../services/auth_service";

const ForgotPassPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigator = useNavigate();
  let navigate = useNavigate();
  const onForgotPassword = async (values: any) => {
    setIsLoading(true);
    forgotPasswordService(values.email)
      .then((response) => {
        toast.success(response.message);
        toast.success(
          "Request to reset password successful. Please check your email"
        );
        navigate("/signin");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
            Forgot Password
          </h2>

          <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            onFinish={onForgotPassword}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: ERROR_INPUT_EMAIL,
                },
                {
                  type: 'email',
                  warningOnly: false
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Row justify="center" align="middle" style={{ marginTop: 10 }}>
              <Col >
                <Form.Item>
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <Button type="primary" htmlType="submit">
                      Send email verify
                    </Button>
                  )}
                </Form.Item>
              </Col>
              <Col offset={2} >
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => navigator(`/signin/`)}
                  >
                    Back to sign in page
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={8} />
      </Row>
    </div>
  );
};
export default ForgotPassPage;
