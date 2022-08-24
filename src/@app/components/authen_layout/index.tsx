import { Layout, Menu, Row, Col } from "antd";
import {
  HomeFilled,
  LogoutOutlined,
  FundOutlined,
  BlockOutlined,
  ArrowUpOutlined,
  ToolOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  NotificationOutlined,
  CloudOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { USER_FRIST_NAME } from "../../constants/key";

import {
  ROLE_ADMIN,
  ROLE_LOCATION_OWNER,
  ROLE_SERVICE_PROVIDER,
} from "../../constants/role";
import { localStorageGetReduxState } from "../../services/localstorage_service";

import { useTranslation } from "react-i18next";
import {
  ACCOUNT_MANAGER_PATH,
  EVENT_MANAGER_PATH,
  HOME_PAGE_PATH,
  POI_MANAGER_PATH,
  PROFILE_PATH,
  SCHEDULE_MANAGER_PATH,
  TEMPLATE_MANAGER_PATH,
} from "../../../kiosk_portal/constants/path_constants";

import TimeView from "./time";
import NotificationView from "./notification";
import { logout } from "./components/logout_confirmation.jsx";
import { Footer } from "antd/lib/layout/layout";
const { Header, Content, Sider } = Layout;

const AuthenLayout: React.FC<{ children: ReactNode }> = (props) => {
  const role = localStorageGetReduxState().auth.role;

  const { children } = props;
  const { t } = useTranslation();

  let navigate = useNavigate();

  const onNavigate = (url: string) => {
    navigate(url);
  };

  return (
    <Layout>
      <Header className="header">
        <Row>
          <Col span={10}>
            <div className="logo" />
            <h2
              style={{ fontWeight: "bold", color: "#fff" }}
              onClick={() => {
                onNavigate(HOME_PAGE_PATH);
              }}
            >
              TIKA Management - {localStorage.getItem(USER_FRIST_NAME)}
            </h2>
          </Col>
          <Col span={13} />

          <Col span={1}>
            <NotificationView />
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            defaultSelectedKeys={["home"]}
            mode="inline"
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item disabled>
              <div
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  color: "#3753ad",
                  fontSize: 12,
                }}
              >
                <TimeView />
              </div>
            </Menu.Item>

            <Menu.Item
              icon={<HomeFilled />}
              key="home"
              onClick={() => {
                onNavigate(HOME_PAGE_PATH);
              }}
            >
              {t("home")}
            </Menu.Item>
            {role === ROLE_ADMIN ? (
              <>
                <Menu.Item
                  icon={<FundOutlined />}
                  key="account_management"
                  onClick={() => {
                    onNavigate(ACCOUNT_MANAGER_PATH);
                  }}
                >
                  {t("accountmanager")}
                </Menu.Item>
                <Menu.Item
                  icon={<MenuOutlined />}
                  key="app_category"
                  onClick={() => {
                    onNavigate("/app-category");
                  }}
                >
                  App Category
                </Menu.Item>
                <Menu.Item
                  key="poi_management"
                  icon={<ToolOutlined />}
                  onClick={() => {
                    onNavigate(POI_MANAGER_PATH);
                  }}
                >
                  POI
                </Menu.Item>
                <Menu.Item
                  key="poi_category"
                  icon={<ToolOutlined />}
                  onClick={() => {
                    onNavigate("/poi-category");
                  }}
                >
                  POI Category
                </Menu.Item>

                <Menu.Item
                  icon={<FundOutlined />}
                  key="event_manager"
                  onClick={() => {
                    onNavigate(EVENT_MANAGER_PATH);
                  }}
                >
                  Event
                </Menu.Item>
              </>
            ) : null}
            {role === ROLE_LOCATION_OWNER ? (
              <>
                <Menu.Item
                  icon={<MenuUnfoldOutlined />}
                  key="kiosk_manager"
                  onClick={() => {
                    onNavigate("/kiosk");
                  }}
                >
                  Kiosk
                </Menu.Item>
                <Menu.Item
                  key="kiosk_location"
                  icon={<ToolOutlined />}
                  onClick={() => {
                    onNavigate("/kiosk-location");
                  }}
                >
                  Kiosk Location
                </Menu.Item>
                <Menu.Item
                  icon={<CalendarOutlined />}
                  key="schedule_manager"
                  onClick={() => {
                    onNavigate(SCHEDULE_MANAGER_PATH);
                  }}
                >
                  {t("schedulemanager")}
                </Menu.Item>
                <Menu.Item
                  icon={<BlockOutlined />}
                  key="template_manager"
                  onClick={() => {
                    onNavigate(TEMPLATE_MANAGER_PATH);
                  }}
                >
                  Template
                </Menu.Item>
                <Menu.Item
                  key="poi_page"
                  icon={<EnvironmentOutlined />}
                  onClick={() => {
                    onNavigate(POI_MANAGER_PATH);
                  }}
                >
                  POI
                </Menu.Item>
                <Menu.Item
                  icon={<NotificationOutlined />}
                  key="event_manager"
                  onClick={() => {
                    onNavigate(EVENT_MANAGER_PATH);
                  }}
                >
                  Event
                </Menu.Item>
                <Menu.Item
                  icon={<CloudOutlined />}
                  key="application_market"
                  onClick={() => {
                    onNavigate("/application-market");
                  }}
                >
                  Application Market
                </Menu.Item>
                <Menu.Item
                  icon={<FundOutlined />}
                  key="my_application"
                  onClick={() => {
                    onNavigate("/my-application");
                  }}
                >
                  My Application
                </Menu.Item>
              </>
            ) : null}
            <></>

            {role === ROLE_ADMIN || role === ROLE_SERVICE_PROVIDER ? (
              <>
                <Menu.Item
                  icon={<BlockOutlined />}
                  key="application_page"
                  onClick={() => {
                    onNavigate("/application-page");
                  }}
                >
                  Application
                </Menu.Item>
                <Menu.Item
                  key="application_publish_request"
                  icon={<ArrowUpOutlined />}
                  onClick={() => {
                    onNavigate("/application-publish-request");
                  }}
                >
                  App Publish
                </Menu.Item>
              </>
            ) : null}
            <Menu.Item
              icon={<UserOutlined />}
              key="profile"
              onClick={() => {
                navigate(PROFILE_PATH);
              }}
            >
              Profile
            </Menu.Item>
            <Menu.Item
              icon={<LogoutOutlined />}
              key="logout"
              onClick={() => {
                logout(navigate);
              }}
            >
              Logout
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <div style={{ marginBottom: 10 }}>
              {/* <Fragment>
                {breadcrumbs.map((e: any) => (
                  <a href={e.key}>{e.breadcrumb}</a>
                ))}
              </Fragment> */}
            </div>

            {children}
          </Content>
        </Layout>
      </Layout>
      <Footer className="header">
        <Row>
          <Col span={18} />

          <Col span={6}>
            Copyright © 2022 IKFTS teams, https://tikap.cf:9930/
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};
export default AuthenLayout;
