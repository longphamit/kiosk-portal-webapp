import { Button, Col, Result, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_PAGE_PATH } from "../../../kiosk_portal/constants/path_constants";
import { localStorageGetUserIdService } from "../../services/localstorage_service";

const NotFoundPage: React.FC = () => {
  let navigate = useNavigate();

  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <>
            {localStorageGetUserIdService() ? (
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
export default NotFoundPage;
