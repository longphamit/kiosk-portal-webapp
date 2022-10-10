import { Button, Col, Form, Input, Row, Skeleton, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PRIMARY_COLOR } from "../../constants/colors";
import {
  forgotPasswordService,
  resetPasswordService,
} from "../../services/auth_service";

const VerifyForgotPassPage = () => {
  const navigator = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [newPassword, setNewPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(async () => {
    try {
      let partyId = searchParams.get("partyId");
      let verifyCode = searchParams.get("verifyCode").split("-")[0];
      const res = await resetPasswordService(partyId, verifyCode);
      setNewPassword(res.data.newPassword);
      toast.success("Success");
    } catch (error) {
      toast.error(error.response.data.message);
      setErrorMessage(error.response.data.message);
      setIsSuccess(false);
    }
  }, []);
  return (
    <div>
      {newPassword ? (
        <Row
          justify="center"
          align="middle"
          style={{ minHeight: "100vh", backgroundColor: PRIMARY_COLOR }}
        >
          <Col span={8} />
          <Col span={8} className="login-form">
            {isSuccess ? (
              <>
                <h2
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 30,
                  }}
                >
                  Change password success
                </h2>
                <h3 style={{ textAlign: "center" }}>
                  Your new password is: {newPassword}
                </h3>
                <h3 style={{ textAlign: "center" }}>
                  You can go to gmail to review it
                </h3>
              </>
            ) : (
              <>
                <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
                  Change password error
                </h2>
              </>
            )}

            <Row span={8}>
              <Col span={8} />
              <Col span={8}>
                <Form form={form} name="search">
                  <Form.Item name="searchString" style={{ marginTop: 5 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => navigator(`/signin/`)}
                    >
                      Back to sign in page
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={8} />
            </Row>
          </Col>
          <Col span={8} />
        </Row>
      ) : (
        <Row
          justify="center"
          align="middle"
          style={{ minHeight: "100vh", backgroundColor: PRIMARY_COLOR }}
        >
          <Col span={8} />
          <Col span={8} className="login-form">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              Change password error
            </h2>

            {errorMessage ===
            "Code has expired, please get another code and try again." ? (
              <h3 style={{ textAlign: "center" }}>
                The code only worked for five minutes. Currently the code has
                expired, please get a new code to perform the function again
              </h3>
            ) : (
              <h3 style={{ textAlign: "center" }}>{errorMessage}</h3>
            )}

            <Row span={8}>
              <Col span={8} />
              <Col span={8}>
                <Form form={form} name="search">
                  <Form.Item name="searchString" style={{ marginTop: 5 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => navigator(`/signin/`)}
                    >
                      Back to sign in page
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={8} />
            </Row>
          </Col>
          <Col span={8} />
        </Row>
      )}
    </div>
  );
};
export default VerifyForgotPassPage;
