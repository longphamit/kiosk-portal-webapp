import { useEffect, useState } from "react";
import { getKisokOrderCommissionService } from "../../../services/order_service";
import { Col, Empty, Row, Skeleton, Table } from "antd";
import OrderPieChart from "../../../components/charts/order_pie_chart";
export const KioskOrderPage = ({ kioskId }) => {
  const [orders, setOrders] = useState();

  const getListOrderFunction = async () => {
    try {
      const res = await getKisokOrderCommissionService(kioskId);
      setOrders(res.data);
      return;
    } catch (error) {
      setOrders([]);
      console.error(error);
    }
  };

  useEffect(() => {
    getListOrderFunction();
  }, []);

  const convertToVietNameCurrency = (text) => {
    return text.toLocaleString("it-IT", { style: "currency", currency: "VND" });
  };
  const columns = [
    {
      title: "Service Application",
      dataIndex: "serviceApplicationName",
      key: "serviceApplicationName",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Total",
      dataIndex: "totalCommission",
      key: "totalCommission",
      render: (text) => <p>{convertToVietNameCurrency(text)}</p>,
    },
  ];
  return (
    <>
      {orders ? (
        orders.length === 0 ? (
          <>
            <Row justify="center" align="center" style={{ marginTop: 250 }}>
              <Col>
                <Empty />
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Table columns={columns} dataSource={orders} pagination={false} />
            <OrderPieChart orders={orders} />
          </>
        )
      ) : (
        <Skeleton />
      )}
    </>
  );
};
