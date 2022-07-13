import { Button, Col, Result, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_PAGE_PATH } from "../../../kiosk_portal/constants/path_constants";
import { localStorageGetUserIdService } from "../../services/localstorage_service";

const UnAuthPage: React.FC = () => {
  let navigate = useNavigate();
  const userId = localStorageGetUserIdService();
  return (
    <div>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <>
            {userId ? (
              <Button
                style={{ margin: 10 }}
                type="primary"
                onClick={() => navigate(HOME_PAGE_PATH)}
              >
                Home
              </Button>
            ) : (
              <>
                <Button
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
                </Button>
              </>
            )}
          </>
        }
      />
      ,
    </div>
  );
};
export default UnAuthPage;
