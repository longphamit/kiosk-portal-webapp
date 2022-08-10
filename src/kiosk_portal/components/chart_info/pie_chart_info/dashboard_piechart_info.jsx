import { Col, Row } from "antd";
import "./styles.css";
const DashBoardPieChartInfor = ({
  activeTitle,
  deactiveTitle,
  total,
  count,
  background,
}) => {
  return (
    <div className="info-chart-box" style={{ background: background }}>
      <div>
        <Row>
          <Col span={21}>
            <div className="info-chart-title">{total}</div>
          </Col>
          <Col>
            <div className="info-chart-value">{count.total}</div>
          </Col>
        </Row>
      </div>
      <div>
        <Row>
          <Col span={21}>
            <div className="info-chart-title">{activeTitle}</div>
          </Col>
          <Col>
            <div className="info-chart-value">{count.active}</div>
          </Col>
        </Row>
      </div>
      <div>
        <Row>
          <Col span={21}>
            <div className="info-chart-title">{deactiveTitle}</div>
          </Col>
          <Col>
            <div className="info-chart-value">{count.deactive}</div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default DashBoardPieChartInfor;
