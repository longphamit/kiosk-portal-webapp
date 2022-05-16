import { ReactNode, useEffect } from "react";
import { Route, useNavigate, Navigate   } from "react-router-dom";
import LoginPage from "../pages/login/login_page";
import UnAuthPage from "../pages/un_auth";
interface Props {
  component: React.FC;
  layout?: React.FC<{ children: ReactNode }>;
  isLayout: boolean;
  authen:boolean;
  path:string
}
const AppElement: React.FC<Props> = (props) => {
  const { component: Component, layout: Layout, isLayout = false, authen,path } = props;
  const access_token=localStorage.getItem("ACCESS_TOKEN");

  sessionStorage.setItem("PATH",path)

  if(!access_token&&authen){
    return <UnAuthPage/>
  }
  if(access_token&&authen){
    return <Navigate to="/admin-home"/>
  }
  return isLayout && Layout ? (
    <Layout>
      <Component />
    </Layout>
  ) : <Component />;
};
export default AppElement;
