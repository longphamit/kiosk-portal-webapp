import { Button, Col, Form, Input, Row } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PRIMARY_COLOR } from "../../constants/colors";
import { forgotPasswordService } from "../../services/auth_service";
import { resetPasswordService } from "../../services/user_service";

const ResetPassPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();
  console.log(searchParams.get("email"))
  const onResetPassword=async(values)=>{
    resetPasswordService(searchParams.get("email"),searchParams.get("uuid"), {password:values.password}).then((response)=>{
      toast.success(response.message)
      navigate("/signin")
    }).catch(error=>{
      toast.error(error.response.data.message)
    })
  }
  return (
    <div>
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: "100vh", backgroundColor: PRIMARY_COLOR }}
      >
        <Col span={4} />
        <Col span={12} className="login-form">
          <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
            Reset Password
          </h2>
          <Form labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} onFinish={onResetPassword}>
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
            <Row justify="center" align="middle">
              <Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
              </Form.Item>
            </Row>
          </Form>
        </Col>
        <Col span={4} />
      </Row>
    </div>
  );
};
export default ResetPassPage;
