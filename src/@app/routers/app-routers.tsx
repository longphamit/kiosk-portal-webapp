
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HOME_PAGE_PATH } from "../../kiosk_portal/constants/path_constants";
import HomePage from "../../kiosk_portal/pages/home";
import AuthenLayout from "../components/authen_layout";
import { ROLE_ADMIN, ROLE_LOCATION_OWNER, ROLE_SERVICE_PROVIDER } from "../constants/role";
import NotFoundPage from "../pages/not_found";
import UnAuthPage from "../pages/un_auth";
import AppElement from "./app-element";
import AppRoute from "./app-element";
import routes from "./routes";

const AppRouter: React.FC = () => {
 
  return (
    <Router>
      <Routes>
        {routes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={
              <AppElement
                component={r.component}
                isLayout={r.isLayout}
                layout={r.layout}
                authen={r.authen}
                path={r.path}
                roles={r.roles}
              />
            }
          />
        ))}
        <Route path="*" element={<NotFoundPage/>}/>
        <Route index element={<AppElement 
        component={HomePage}
                isLayout={true}
                layout={AuthenLayout}
                authen={true}
                path={HOME_PAGE_PATH}
                roles={[ROLE_ADMIN,ROLE_LOCATION_OWNER,ROLE_SERVICE_PROVIDER]} />} />
      </Routes>
    </Router>
  );
};
export default AppRouter;
