import { Button, Col, Result, Row } from "antd";
import { useNavigate } from "react-router-dom";

const UnAuthPage: React.FC = () => {
  let navigate = useNavigate();

  return (
    <div>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<><Button
          style={{ margin: 10 }}
          type="primary"
          onClick={() => navigate("/signin")}
        >
          Sign in
        </Button>
        <Button
          style={{ margin: 10 }}
          danger
          onClick={() => navigate("/signup")}
        >
          Sign up
        </Button></>}
      />
      ,
    </div>
  );
};
export default UnAuthPage;
