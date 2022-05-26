
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
      </Routes>
    </Router>
  );
};
export default AppRouter;
