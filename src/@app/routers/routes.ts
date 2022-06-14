import { ReactNode } from "react";
import AccountManagerPage from "../../kiosk_portal/pages/account";


import AccountDetailPage from "../../kiosk_portal/pages/account_detail";
import ApplicationPage from "../../kiosk_portal/pages/application";
import ApplicationDetailPage from "../../kiosk_portal/pages/application_detail";
import AppCategoryPage from "../../kiosk_portal/pages/app_category";
import ServiceApplicationPublishRequestPage from "../../kiosk_portal/pages/app_publish_request";
import HomePage from "../../kiosk_portal/pages/home";
import KioskPage from "../../kiosk_portal/pages/kiosk";
import PoiPage from "../../kiosk_portal/pages/poi";
import ScheduleManagerPage from "../../kiosk_portal/pages/schedule";
import TemplateManagerPage from "../../kiosk_portal/pages/template";
import AuthenLayout from "../components/authen_layout";
import ClientLayout from "../components/client_layout";
import { ROLE_ADMIN, ROLE_LOCATION_OWNER, ROLE_SERVICE_PROVIDER } from "../constants/role";
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
  breadcrumb: string;
  roles: string[];
}
const routes: Route[] = [
  {
    component: LoginPage,
    path: "/signin",
    isLayout: false,
    authen: false,
    breadcrumb: "",
    roles:[""]
  },
  {
    component: RegistPage,
    path: "/signup",
    isLayout: false,
    authen: false,
    breadcrumb: "",
    roles:[""]
  },
  {
    component: ConfirmAccountPage,
    path: "/confirm-account",
    isLayout: false,
    authen: false,
    breadcrumb: "",
    roles:[""]
  },
  {
    component: ResetPassPage,
    path: "/reset-pass",
    isLayout: false,
    authen: false,
    breadcrumb: "",
    roles:[""]
  },
  {
    component: UnAuthPage,
    path: "/unauth",
    isLayout: false,
    authen: true,
    breadcrumb: "",
    roles:[""]
  },
  {
    component: ForgotPassPage,
    path: "/forgot-pass",
    isLayout: false,
    authen: false,
    breadcrumb: "",
    roles:[""]
  },
  {
    component: HomePage,
    path: "/homepage",
    isLayout: true,
    layout: AuthenLayout,
    authen: false,
    breadcrumb: "",
    roles:[""]
  },
  {
    component: AccountManagerPage,
    path: "/account-manager",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles:[ROLE_ADMIN]
  },
  {
    component: AccountDetailPage,
    path: "/account-detail/:partyId",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles:[ROLE_ADMIN]
  },
  {
    component: ScheduleManagerPage,
    path: "/schedule-manager",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles:[ROLE_LOCATION_OWNER]
  },
  {
    component: KioskPage,
    path: "/kiosk",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles:[ROLE_LOCATION_OWNER]
  },
  {
    component: ServiceApplicationPublishRequestPage,
    path: "/application-publish-request",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles:[ROLE_ADMIN,ROLE_SERVICE_PROVIDER]
  },
  {
    component: ApplicationPage,
    path: "/application-page",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles:[ROLE_SERVICE_PROVIDER]
  },
  {
    component: TemplateManagerPage,
    path: "/template-manager",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles:[ROLE_LOCATION_OWNER]
  },
  {
    component: PoiPage,
    path: "/poi-page",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles:[ROLE_ADMIN,ROLE_LOCATION_OWNER]
  },
  {
    component: AppCategoryPage,
    path: "/app-category",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles:[ROLE_ADMIN]
  },
  {
    component: ApplicationDetailPage,
    path: "/app-detail/:appId",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles:[ROLE_ADMIN,ROLE_SERVICE_PROVIDER]
  },
];

export default routes;
