import { ReactNode, useEffect } from "react";
import { Route, useNavigate, Navigate } from "react-router-dom";
import { HOME_PAGE_PATH } from "../../kiosk_portal/constants/path_constants";
import { ACCESS_TOKEN } from "../constants/key";
import {
  ROLE_ADMIN,
  ROLE_LOCATION_OWNER,
  ROLE_SERVICE_PROVIDER,
} from "../constants/role";
import LoginPage from "../pages/login/login_page";
import UnAuthPage from "../pages/un_auth";
import { localStorageGetReduxState } from "../services/localstorage_service";
interface Props {
  component: React.FC;
  layout?: React.FC<{ children: ReactNode }>;
  isLayout: boolean;
  authen: boolean;
  path: string;
  roles: string[];
}
const AppElement: React.FC<Props> = (props) => {
  const {
    component: Component,
    layout: Layout,
    isLayout = false,
    authen,
    path,
    roles,
  } = props;
  const access_token = localStorage.getItem(ACCESS_TOKEN);
  sessionStorage.setItem("PATH", path);
  if (!access_token && authen) {
    if (path === HOME_PAGE_PATH) {
      return <LoginPage />;
    }
    return <UnAuthPage />;
  }
  if (access_token && authen) {
    // return <Navigate to="/admin-home"/>
    const role = localStorageGetReduxState().auth.role;
    if (roles) {
      if (!roles.includes(role)) {
        return <UnAuthPage />;
      }
    }
  }
  return isLayout && Layout ? (
    <Layout>
      <Component />
    </Layout>
  ) : (
    <Component />
  );
};
export default AppElement;
