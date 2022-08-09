import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import {
  countAppService,
  countEventService,
  countKioskService,
  countPoiService,
} from "../../services/dashboard_service";
import "./styles.css";
import { Chart } from "primereact/chart";
import DashBoardPieChartInfor from "../../components/chart_info/pie_chart_info/dashboard_piechart_info";
import CountPieChart from "../../components/charts/count_pie_chart";
import { ROLE_SERVICE_PROVIDER } from "../../../@app/constants/role";
import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
const initCountValue = {
  total: 0,
  active: 0,
  deactive: 0,
};
const labelCountKiosk = ["Working", "Stopped"];
const labelCountEvent = ["UpComming", "End"];
const lableCountPoi = ["Active", "DeActive"];
const lableCountApp = ["Install", "UnInstall"];
const lableCountAppSupportProvider = ["Available", "UnAvailable"];
const HomePage = () => {
  const [role, setRole] = useState();
  const [countKiosk, setCountKiosk] = useState(initCountValue);
  const [countEvent, setCountEvent] = useState(initCountValue);
  const [countPoi, setCountPoi] = useState(initCountValue);
  const [countApp, setCountApp] = useState(initCountValue);
  const getCountKiosk = async () => {
    const res = await countKioskService();
    setCountKiosk(res.data);
  };
  const getCountEvent = async () => {
    const res = await countEventService();
    setCountEvent(res.data);
  };
  const getCountPoi = async () => {
    const res = await countPoiService();
    setCountPoi(res.data);
  };
  const getCountApp = async () => {
    const res = await countAppService();
    setCountApp(res.data);
  };
  const buildCountPie = async () => {
    const roleSaved = await localStorageGetReduxState().auth.role;
    setRole(roleSaved);
    if (roleSaved !== ROLE_SERVICE_PROVIDER) {
      getCountKiosk();
      getCountEvent();
      getCountPoi();
    }
    getCountApp();
  };
  useEffect(() => {
    buildCountPie();
  }, []);
  return (
    <>
      <CustomBreadCumb props={[]}></CustomBreadCumb>
      <Row>
        {role ? (
          role !== ROLE_SERVICE_PROVIDER ? (
            <>
              <Col span={6}>
                {countKiosk ? (
                  <div className="count-chart-box">
                    <h2>Kiosk</h2>
                    {countKiosk.total != 0 ? (
                      <CountPieChart
                        labels={labelCountKiosk}
                        count={countKiosk}
                      />
                    ) : null}
                    <DashBoardPieChartInfor
                      activeTitle={"Working"}
                      deactiveTitle={"Stopped"}
                      total={"Total"}
                      background="#dceef2"
                      count={countKiosk}
                    />
                  </div>
                ) : null}
              </Col>
              <Col span={6}>
                {countEvent ? (
                  <div className="count-chart-box">
                    <h2>Event</h2>
                    {countEvent.total != 0 ? (
                      <CountPieChart
                        labels={labelCountEvent}
                        count={countEvent}
                      />
                    ) : null}
                    <DashBoardPieChartInfor
                      activeTitle={"UpComming"}
                      deactiveTitle={"End"}
                      total={"Total"}
                      background="#92e8b5"
                      count={countEvent}
                    />
                  </div>
                ) : null}
              </Col>
              <Col span={6}>
                {countPoi ? (
                  <div className="count-chart-box">
                    <h2>Poi</h2>
                    {countPoi.total != 0 ? (
                      <CountPieChart labels={lableCountPoi} count={countPoi} />
                    ) : null}
                    <DashBoardPieChartInfor
                      activeTitle={"Active"}
                      deactiveTitle={"DeAtive"}
                      total={"Total"}
                      background="#95c8f0"
                      count={countPoi}
                    />
                  </div>
                ) : null}
              </Col>
              <Col span={6}>
          {countApp ? (
            <div className="count-chart-box">
              <h2>App</h2>
              {countApp.total != 0 ? (
                <CountPieChart labels={lableCountApp} count={countApp} />
              ) : null}
              <DashBoardPieChartInfor
                activeTitle={"Install"}
                deactiveTitle={"UnInstall"}
                total={"Total"}
                background="#f0de95"
                count={countApp}
              />
            </div>
          ) : null}
        </Col>
            </>
          ) :
          role===ROLE_SERVICE_PROVIDER?
          <Col span={6}>
          {countApp ? (
            <div className="count-chart-box">
              <h2>App</h2>
              {countApp.total != 0 ? (
                <CountPieChart labels={lableCountAppSupportProvider} count={countApp} />
              ) : null}
              <DashBoardPieChartInfor
                activeTitle={"Available"}
                deactiveTitle={"UnAvailable"}
                total={"Total"}
                background="#f0de95"
                count={countApp}
              />
            </div>
          ) : null}
        </Col>:null
        ) : null}

       
      </Row>
    </>
  );
};
export default HomePage;
