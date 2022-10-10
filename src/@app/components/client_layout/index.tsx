import { Layout, Menu, Breadcrumb, Row } from "antd";

import { Fragment, ReactNode, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useSelector from "../../hooks/use_selector";
import { AppState } from "../../redux/stores";
import { ROLE_ADMIN } from "../../constants/role";
import { localStorageClearService } from "../../services/localstorage_service";
import routes from "../../routers/routes";
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const ClientLayout: React.FC<{ children: ReactNode }> = (props) => {
  const { children } = props;

  return (
    <>
        
    </>
    
  );
};
export default ClientLayout;
