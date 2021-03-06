import { ReactNode } from "react";
import HomePage from "../../kiosk_portal/pages/home";

import AuthenLayout from "../components/authen_layout";
import ClientLayout from "../components/client_layout";
import ConfirmAccountPage from "../pages/confirm_account/confirm_account";


import ForgotPassPage from "../pages/forgot_pass/forgot_pass";
import LoginPage from "../pages/login/login_page";
import RegistPage from "../pages/regist/regist_page";
import ResetPassPage from "../pages/reset_pass/reset_pass";
import UnAuthPage from "../pages/un_auth";

interface Route {
  component: React.FC;
  layout?: React.FC<{ children: ReactNode }>;
  path: string;
  isLayout: boolean;
  authen: boolean;
  breadcrumb:string;
}
const routes: Route[] = [
  {
    component: LoginPage,
    path: "/signin",
    isLayout: false,
    authen: false,
    breadcrumb:""
  },
  {
    component: RegistPage,
    path: "/signup",
    isLayout: false,
    authen: false,
    breadcrumb:""
  },
  {
    component: ConfirmAccountPage,
    path: "/confirm-account",
    isLayout: false,
    authen: false,
    breadcrumb:""
  },
  {
    component: ResetPassPage,
    path: "/reset-pass",
    isLayout: false,
    authen: false,
    breadcrumb:""
  },
  {
    component: UnAuthPage,
    path: "/unauth",
    isLayout: false,
    authen: true,
    breadcrumb:""
  },
  {
    component: ForgotPassPage,
    path: "/forgot-pass",
    isLayout: false,
    authen: false,
    breadcrumb:""
  },
  {
    component: HomePage,
    path: "/admin-home",
    isLayout: true,
    layout:AuthenLayout,
    authen: false,
    breadcrumb:""
  },
];

export default routes;
