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
import DashBoardPieChartInfor from "../../components/chart_info/pie_chart_info/dashboard_piechart_info";
import CountPieChart from "../../components/charts/count_pie_chart";
import { ROLE_ADMIN, ROLE_LOCATION_OWNER, ROLE_SERVICE_PROVIDER } from "../../../@app/constants/role";
import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { KioskLineChartComponent } from "./components/kiosk_line_chart_component";
import { AdminStatisticComponent } from "./components/admin_statistic_component";
import { CountPieChartType, EmptyPieChart } from "../../../@app/components/card/empty_pie_chart";
const initCountValue = {
  total: 0,
  active: 0,
  deactive: 0,
};
const SPAN_PIE_CHART_COL = 6
const SPAN_LINE_CHART_COL = 20
const labelCountKiosk = ["Working", "Stopped"];
const labelCountEvent = ["Upcomming", "End"];
const lableCountPoi = ["Active", "Deactive"];
const lableCountApp = ["Install", "Uninstall"];
const lableCountAppSupportProvider = ["Available", "Unavailable"];
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
      <Row justify="space-around">
        {role ? (
          role !== ROLE_SERVICE_PROVIDER ? (
            <>
              <Col span={SPAN_PIE_CHART_COL}>
                {countKiosk ? (
                  <div className="count-chart-box">
                    <h2>Kiosk</h2>
                    <div style={{ height: 200 }}>
                      {countKiosk.total ? (
                        <CountPieChart
                          labels={labelCountKiosk}
                          count={countKiosk}
                        />
                      ) : <EmptyPieChart type={CountPieChartType.kiosk} />}
                    </div>
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
              <Col span={SPAN_PIE_CHART_COL}>
                <div className="count-chart-box">
                  <h2>Event</h2>
                  <div style={{ height: 200 }}>
                    {
                      countEvent.total ? <CountPieChart
                        labels={labelCountEvent}
                        count={countEvent}
                      /> : <EmptyPieChart type={CountPieChartType.event} />
                    }
                  </div>
                  <DashBoardPieChartInfor
                    activeTitle={"Upcomming"}
                    deactiveTitle={"End"}
                    total={"Total"}
                    background="#92e8b5"
                    count={countEvent}
                  />
                </div>
              </Col>
              <Col span={SPAN_PIE_CHART_COL}>
                {countPoi ? (
                  <div className="count-chart-box">
                    <h2>POI</h2>
                    <div style={{ height: 200 }}>
                      {countPoi.total ? (
                        <CountPieChart labels={lableCountPoi} count={countPoi} />
                      ) : <EmptyPieChart type={CountPieChartType.poi} />
                      }

                    </div>
                    <DashBoardPieChartInfor
                      activeTitle={"Active"}
                      deactiveTitle={"Deative"}
                      total={"Total"}
                      background="#95c8f0"
                      count={countPoi}
                    />
                  </div>
                ) : null}
              </Col>
              <Col span={SPAN_PIE_CHART_COL}>
                {countApp ? (
                  <div className="count-chart-box">
                    <h2>App</h2>
                    <div style={{ height: 200 }}>
                      {countApp.total ? (
                        <CountPieChart labels={lableCountApp} count={countApp} />
                      ) : <EmptyPieChart type={CountPieChartType.my_app} />}
                    </div>

                    <DashBoardPieChartInfor
                      activeTitle={"Install"}
                      deactiveTitle={"Uninstall"}
                      total={"Total"}
                      background="#f0de95"
                      count={countApp}
                    />
                  </div>
                ) : null}
              </Col>
            </>
          ) :
            role === ROLE_SERVICE_PROVIDER ?
              <Col span={SPAN_PIE_CHART_COL}>
                {countApp ? (
                  <div className="count-chart-box">
                    <h2>App</h2>
                    <div style={{ height: 200 }}>
                      {countApp.total != 0 ? (
                        <CountPieChart labels={lableCountAppSupportProvider} count={countApp} />
                      ) : <EmptyPieChart type={CountPieChartType.app} />}
                    </div>

                    <DashBoardPieChartInfor
                      activeTitle={"Available"}
                      deactiveTitle={"Unavailable"}
                      total={"Total"}
                      background="#f0de95"
                      count={countApp}
                    />
                  </div>
                ) : null}
              </Col> : null
        ) : null}
      </Row>
      {role === ROLE_LOCATION_OWNER ?
        <>
          <KioskLineChartComponent span={SPAN_LINE_CHART_COL} />
        </> : null
      }
      {role === ROLE_ADMIN ?
        <>
          <AdminStatisticComponent />
        </> : null
      }
    </>
  );
};
export default HomePage;
