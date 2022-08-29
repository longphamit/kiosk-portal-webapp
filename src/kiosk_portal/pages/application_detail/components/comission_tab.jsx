import { Col, Pagination, Row, Skeleton, Table } from "antd";
import { useEffect, useState } from "react";
import { EmptyCard } from "../../../../@app/components/card/empty_card";
import { convertToVietNameCurrency } from "../../../components/charts/utils";
import { getAppOrderCommissionService } from "../../../services/order_service";
import moment from "moment";
export const CommissionTabComponent = ({ appId }) => {
  const [orders, setOrders] = useState();
  const [isTableLoading, setTableLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const columns = [
    {
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
      render: (text) => <p>{moment(text).format("DD/MM/YYYY HH:mm")}</p>,
    },
    {
      title: "Kiosk Name",
      dataIndex: "kioskName",
      key: "kioskName",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      render: (text) => <p>{convertToVietNameCurrency(text)}</p>,
    },
  ];

  const getAppOrderCommission = async (page, size) => {
    try {
      setTableLoading(true);
      let res = await getAppOrderCommissionService(appId, page, size);
      setTotalOrders(res.data.metadata.total);
      setOrders(res.data.data);
    } catch (e) {
      console.error(e);
      setOrders(null);
    } finally {
      setTableLoading(false);
    }
  };
  useEffect(() => {
    getAppOrderCommission(currentPage, pageSize);
  }, []);

  const handleChangeNumberOfPaging = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    getAppOrderCommission(page, pageSize);
  };
  return (
    <>
      {isTableLoading ? (
        <Skeleton />
      ) : orders ? (
        orders.length === 0 ? (
          <EmptyCard />
        ) : (
          <>
            <Table columns={columns} dataSource={orders} pagination={false} />
            <Row justify="end">
              <Col>
                <Pagination
                  defaultCurrent={1}
                  total={totalOrders}
                  pageSize={pageSize}
                  showSizeChanger
                  current={currentPage}
                  onChange={handleChangeNumberOfPaging}
                />
              </Col>
            </Row>
          </>
        )
      ) : (
        <EmptyCard />
      )}
    </>
  );
};
