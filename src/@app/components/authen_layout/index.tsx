import { Layout, Menu, Breadcrumb, Row } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  HomeFilled,
  LogoutOutlined,
  KeyOutlined,
  FundOutlined,
  BlockOutlined,
  AuditOutlined,
  ClockCircleOutlined,
  ToolOutlined
} from "@ant-design/icons";
import { Fragment, ReactNode, useEffect, useState } from "react";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { USER_NAME } from "../../constants/key";

import useSelector from "../../hooks/use_selector";
import { AppState } from "../../redux/stores";
import { ROLE_ADMIN } from "../../constants/role";
import { localStorageClearService } from "../../services/localstorage_service";

import routes from "../../routers/routes";
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const AuthenLayout: React.FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  const [time, setTime] = useState(new Date().toLocaleString());
  let navigate = useNavigate();
  const logout = () => {
    localStorageClearService();
    navigate("/signin");
    toast("Logout successfull");
  };
  const onNavigate = (url: string) => {
    navigate(url);
  };

  const roles: string[] | null = useSelector(
    (state: AppState) => state.auth.roles
  );
 
  useEffect(() => {
    setInterval(() => setTime(new Date().toLocaleString()), 1000);
  });
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <h2
          style={{ fontWeight: "bold",color:"#fff" }}
          onClick={() => {
            onNavigate("/admin-home");
          }}
        >
          TIKA Management - {localStorage.getItem(USER_NAME)}
        </h2>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={
              roles ? (roles.includes(ROLE_ADMIN) ? ["9999"] : ["0"]) : ["0"]
            }
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item disabled>
              <div
                style={{ marginTop: 20, marginBottom: 20, color: "#3753ad",fontSize:12 }}
              >
                <ClockCircleOutlined style={{ marginRight: 10 }} />
                {time}
              </div>
            </Menu.Item>
            {roles ? (
              roles.includes(ROLE_ADMIN) ? (
                <Menu.Item
                  icon={<KeyOutlined />}
                  key="0"
                  onClick={() => {
                    onNavigate("/admin-dashboard");
                  }}
                >
                  Admin Dashboard
                </Menu.Item>
              ) : null
            ) : null}
            <Menu.Item
              icon={<HomeFilled />}
              key="1"
              onClick={() => {
                onNavigate("/admin-home");
              }}
            >
              Home
            </Menu.Item>
            <Menu.Item
              icon={<FundOutlined />}
              key="2"
              onClick={() => {
                onNavigate("/admin-category-room");
              }}
            >
              Room Category
            </Menu.Item>
            <Menu.Item
              icon={<BlockOutlined />}
              key="3"
              onClick={() => {
                onNavigate("/admin-room");
              }}
            >
              Room
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<AuditOutlined />}
              onClick={() => {
                onNavigate("/admin-ticket");
              }}
            >
              Ticket
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<ToolOutlined />}
              onClick={() => {
                onNavigate("/admin-tool");
              }}
            >
              Tool
            </Menu.Item>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="Me">
              <Menu.Item
                key="6"
                onClick={() => {
                  onNavigate("/admin-profile");
                }}
              >
                Profile
              </Menu.Item>
            </SubMenu>
            {/* <SubMenu
              key="sub3"
              icon={<NotificationOutlined />}
              title="subnav 3"
            >
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu> */}
            <Menu.Item
              icon={<LogoutOutlined />}
              key="7"
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
