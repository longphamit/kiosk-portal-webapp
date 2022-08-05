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
} from "@ant-design/icons";
import {ReactNode} from "react";
import "./styles.css";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { USER_FRIST_NAME } from "../../constants/key";

import {
  ROLE_ADMIN,
  ROLE_LOCATION_OWNER,
  ROLE_SERVICE_PROVIDER,
} from "../../constants/role";
import {
  localStorageClearService,
  localStorageGetReduxState,
} from "../../services/localstorage_service";

import { useTranslation } from "react-i18next";
import { signOutService } from "../../services/auth_service";
import { HOME_PAGE_PATH } from "../../../kiosk_portal/constants/path_constants";

import TimeView from "./time";
import NotificationView from "./notification";
const { Header, Content, Sider } = Layout;

const AuthenLayout: React.FC<{ children: ReactNode }> = (props) => {
  const role = localStorageGetReduxState().auth.role;

  const { children } = props;
  const { t } = useTranslation();

  let navigate = useNavigate();
  const logout = async () => {
    await signOutService();
    localStorageClearService();
    navigate("/signin");
    toast("Logout successfull");
  };
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

          <Col span={1}  >
            <NotificationView />
          </Col>
        </Row>

      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            defaultSelectedKeys={["1"]}
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
              key="1"
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
                  key="2"
                  onClick={() => {
                    onNavigate("/account-manager");
                  }}
                >
                  {t("accountmanager")}
                </Menu.Item>
                <Menu.Item
                  icon={<MenuOutlined />}
                  key="3"
                  onClick={() => {
                    onNavigate("/app-category");
                  }}
                >
                  App Category
                </Menu.Item>
                  <Menu.Item
                    key="poi_manager"
                    icon={<ToolOutlined />}
                    onClick={() => {
                      onNavigate("/poi-page");
                    }}
                  >
                    POI Manager
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
                  key="event"
                  onClick={() => {
                    onNavigate("/event-manager");
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
                  Kiosk Manager
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
                  icon={<BlockOutlined />}
                  key="7"
                  onClick={() => {
                    onNavigate("/schedule-manager");
                  }}
                >
                  {t("schedulemanager")}
                </Menu.Item>
                <Menu.Item
                  icon={<BlockOutlined />}
                  key="8"
                  onClick={() => {
                    onNavigate("/template-manager");
                  }}
                >
                  Template
                </Menu.Item>
                <Menu.Item
                  key="9"
                  icon={<ToolOutlined />}
                  onClick={() => {
                    onNavigate("/poi-page");
                  }}
                >
                  POI
                </Menu.Item>
                <Menu.Item
                  icon={<FundOutlined />}
                  key="event"
                  onClick={() => {
                    onNavigate("/event-manager");
                  }}
                >
                  Event
                </Menu.Item>
                <Menu.Item
                  icon={<FundOutlined />}
                  key="application_market"
                  onClick={() => {
                    onNavigate("/application-market");
                  }}
                >
                  Application Market
                </Menu.Item>
                <Menu.Item
                  icon={<FundOutlined />}
                  key="my-application"
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
                  key="10"
                  onClick={() => {
                    onNavigate("/application-page");
                  }}
                >
                  Application
                </Menu.Item>
                <Menu.Item
                  key="11"
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
              icon={<LogoutOutlined />}
              key="13"
              onClick={() => {
                logout();
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
    </Layout>
  );
};
export default AuthenLayout;
