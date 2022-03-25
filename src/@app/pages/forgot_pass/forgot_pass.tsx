import { Button, Col, Form, Input, Row, Spin } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { PRIMARY_COLOR } from "../../constants/colors";
import { forgotPasswordService } from "../../services/auth_service";

const ForgotPassPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const onForgotPassword = async (values: any) => {
    setIsLoading(true);
    forgotPasswordService(values.email)
      .then((response) => {
        toast.success(response.message);
        toast.success("Please check your email");
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
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Row justify="center" align="middle">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Send email verify
                </Button>
              </Form.Item>
            </Row>
          </Form>
          {isLoading ? (
            <Row justify="center" align="middle">
              <Spin style={{marginBottom:20}} />
            </Row>
          ) : null}
        </Col>
        <Col span={8} />
      </Row>
    </div>
  );
};
export default ForgotPassPage;
