import { ReactNode, useEffect } from "react";
import { Route, useNavigate, Navigate } from "react-router-dom";
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
}
const AppElement: React.FC<Props> = (props) => {
  const {
    component: Component,
    layout: Layout,
    isLayout = false,
    authen,
    path,
  } = props;
  const access_token = localStorage.getItem(ACCESS_TOKEN);
  sessionStorage.setItem("PATH", path);

  if (!access_token && authen) {
    return <UnAuthPage />;
  }
  if (access_token && !authen) {
    const role = localStorageGetReduxState().auth.role;
    switch (role) {
      case ROLE_ADMIN:
        return <Navigate to="/admin-home" />;
      case ROLE_LOCATION_OWNER:
        break;
      case ROLE_SERVICE_PROVIDER:
        break;
    }
    return <UnAuthPage />;
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
