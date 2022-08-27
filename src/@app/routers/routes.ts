import { ReactNode } from "react";
import ApplicationPolicy from "../../kiosk_portal/components/tables/app_table/applicationPolicy";
import {
  ACCOUNT_MANAGER_PATH, APPLICATION_MARKET_PATH, APP_CATEGORY_MANAGER_PATH,
  APP_MANAGER_PATH, APP_PUBLISH_REQUEST_PATH, EDIT_TEMPLATE_PATH, EVENT_CREATING_PATH, EVENT_MANAGER_PATH, EVENT_PATH, HOME_PAGE_PATH,
  KIOSK_LOCATION_PATH,
  KIOSK_MANAGER_PATH, LOCATION_PATH, MY_APPLICATION_PATH, POI_CATEGORY_MANAGER_PATH, POI_CREATING_PATH, POI_MANAGER_PATH, POI_PATH, PROFILE_PATH, SCHEDULE_MANAGER_PATH,
  TEMPLATE_MANAGER_PATH
} from "../../kiosk_portal/constants/path_constants";
import AccountManagerPage from "../../kiosk_portal/pages/account";
import AccountDetailPage from "../../kiosk_portal/pages/account_detail";
import ApplicationPage from "../../kiosk_portal/pages/application";
import ApplicationDetailPage from "../../kiosk_portal/pages/application_detail";
import ApplicationMarketPage from "../../kiosk_portal/pages/application_market";
import AppCategoryPage from "../../kiosk_portal/pages/app_category";
import ServiceApplicationPublishRequestPage from "../../kiosk_portal/pages/app_publish_request";
import EventManagerPage from "../../kiosk_portal/pages/event";
import { EventCreatingPage } from "../../kiosk_portal/pages/event/event_create";
import { EventDetailsPage } from "../../kiosk_portal/pages/event/event_details";
import HomePage from "../../kiosk_portal/pages/home";
import KioskPage from "../../kiosk_portal/pages/kiosk";
import { KioskDetailsPage } from "../../kiosk_portal/pages/kiosk/details";
import KioskLocationPage from "../../kiosk_portal/pages/kiosk_location";
import DetailLocationPage from "../../kiosk_portal/pages/kiosk_location/locationDetail";
import MyApplicationPage from "../../kiosk_portal/pages/my_application";
import PoiPage from "../../kiosk_portal/pages/poi";
import { POICreatePage } from "../../kiosk_portal/pages/poi/poi_create";
import DetailPoiPage from "../../kiosk_portal/pages/poi/poi_detail";
import PoiCategory from "../../kiosk_portal/pages/poi_category";
import ProfilePage from "../../kiosk_portal/pages/profile";
import ScheduleManagerPage from "../../kiosk_portal/pages/schedule";
import TemplateManagerPage from "../../kiosk_portal/pages/template";
import EditTemplatePage from "../../kiosk_portal/pages/template/edit-template";
import AuthenLayout from "../components/authen_layout";
import { ROLE_ADMIN, ROLE_LOCATION_OWNER, ROLE_SERVICE_PROVIDER } from "../constants/role";
import ConfirmAccountPage from "../pages/confirm_account/confirm_account";
import ForgotPassPage from "../pages/forgot_pass/forgot_pass";
import VerifyForgotPassPage from "../pages/forgot_pass/verifyForgotPass.jsx";
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
    roles: [""]
  },
  {
    component: RegistPage,
    path: "/signup",
    isLayout: false,
    authen: false,
    breadcrumb: "",
    roles: [""]
  },
  {
    component: ConfirmAccountPage,
    path: "/confirm-account",
    isLayout: false,
    authen: false,
    breadcrumb: "",
    roles: [""]
  },
  {
    component: ResetPassPage,
    path: "/reset-pass",
    isLayout: false,
    authen: false,
    breadcrumb: "",
    roles: [""]
  },
  {
    component: UnAuthPage,
    path: "/unauth",
    isLayout: false,
    authen: true,
    breadcrumb: "",
    roles: [""]
  },
  {
    component: ForgotPassPage,
    path: "/forgot-pass",
    isLayout: false,
    authen: false,
    breadcrumb: "",
    roles: [""]
  },
  {
    component: HomePage,
    path: HOME_PAGE_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: false,
    breadcrumb: "",
    roles: [""]
  },
  {
    component: AccountManagerPage,
    path: ACCOUNT_MANAGER_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN]
  },
  {
    component: AccountDetailPage,
    path: "/account-detail/:partyId",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN]
  },
  {
    component: ScheduleManagerPage,
    path: SCHEDULE_MANAGER_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER]
  },
  {
    component: KioskPage,
    path: KIOSK_MANAGER_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER]
  },
  {
    component: ServiceApplicationPublishRequestPage,
    path: APP_PUBLISH_REQUEST_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN, ROLE_SERVICE_PROVIDER]
  },
  {
    component: ApplicationPage,
    path: APP_MANAGER_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN, ROLE_SERVICE_PROVIDER]
  },
  {
    component: TemplateManagerPage,
    path: TEMPLATE_MANAGER_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER]
  },
  {
    component: PoiPage,
    path: POI_MANAGER_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN, ROLE_LOCATION_OWNER]
  },
  {
    component: AppCategoryPage,
    path: APP_CATEGORY_MANAGER_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN]
  },
  {
    component: ApplicationDetailPage,
    path: "/app-detail/:id",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN, ROLE_LOCATION_OWNER, ROLE_SERVICE_PROVIDER]
  },
  {
    component: EditTemplatePage,
    path: EDIT_TEMPLATE_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER]
  },
  {
    component: PoiCategory,
    path: POI_CATEGORY_MANAGER_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN]
  },
  {
    component: EventManagerPage,
    path: EVENT_MANAGER_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN, ROLE_LOCATION_OWNER]
  },
  {
    component: EventDetailsPage,
    path: EVENT_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN, ROLE_LOCATION_OWNER]
  },
  {
    component: DetailPoiPage,
    path: POI_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN, ROLE_LOCATION_OWNER]
  },
  {
    component: ApplicationMarketPage,
    path: APPLICATION_MARKET_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER]
  },
  {
    component: MyApplicationPage,
    path: MY_APPLICATION_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER]
  },
  {
    component: KioskLocationPage,
    path: KIOSK_LOCATION_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER]
  },
  {
    component: DetailLocationPage,
    path: LOCATION_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER]
  },
  {
    component: EventCreatingPage,
    path: EVENT_CREATING_PATH,
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_ADMIN, ROLE_LOCATION_OWNER]
  },
  {
    component: KioskDetailsPage,
    path: "/kiosk/:kioskId",
    isLayout: true,
    layout: AuthenLayout,
    authen: true,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER]
  },
  {
    component: VerifyForgotPassPage,
    path: "/verify-pass",
    isLayout: false,
    authen: false,
    breadcrumb: "",
    roles: [""]
  },
  {
    component: ProfilePage,
    path: PROFILE_PATH,
    isLayout: true,
    authen: true,
    layout: AuthenLayout,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER, ROLE_SERVICE_PROVIDER, ROLE_ADMIN]
  },
  {
    component: POICreatePage,
    path: POI_CREATING_PATH,
    isLayout: true,
    authen: true,
    layout: AuthenLayout,
    breadcrumb: "",
    roles: [ROLE_LOCATION_OWNER, ROLE_ADMIN]
  },
  {
    component: ApplicationPolicy,
    path: "/application-policy",
    isLayout: false,
    layout: AuthenLayout,
    authen: false,
    breadcrumb: "",
    roles: []
  },
];

export default routes;
