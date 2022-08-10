import { Button, Col, Empty, Pagination, Row, Skeleton, Space, Table, Tag } from "antd";
import { EyeFilled, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  KIOSK_LOCATION_MANAGER_HREF,
  KIOSK_LOCATION_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { getListKioskLocationService } from "../../services/kiosk_location_service";
import { useNavigate } from "react-router-dom";
import ModalCreateLocation from "./modalCreateLocation";
import { PREVIOUS_PATH } from "../../../@app/constants/key";

const KioskLocationPage = () => {
  const [kioskLocationList, setKioskLocationList] = useState();
  const [kioskLocationPage, setKioskLocationPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [kioskLocationPageTotal, setKioskLocationPageTotal] = useState(0);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  let navigate = useNavigate();
  const onNavigate = (url) => {
    navigate(url);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "HotLine",
      dataIndex: "hotLine",
      key: "hotLine",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="infor-button"
            shape="default"
            onClick={() => {
              onNavigate({
                pathname: "/./location",
                search: "?id=" + record.id,
              });
            }}
          >
            <EyeFilled /> Details
          </Button>
        </Space>
      ),
    },
  ];
  const getKioskLocationList = async (page, size) => {
    try {
      const res = await getListKioskLocationService("", page, size);
      setKioskLocationList(res.data.data);
      setKioskLocationPageTotal(res.data.metadata.total);
    } catch (e) {
      console.error(e);
      setKioskLocationList([]);
    }
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setKioskLocationPage(page);
    await getKioskLocationList(page, pageSize);
  };

  useEffect(async () => {
    localStorage.setItem(
      PREVIOUS_PATH,
      JSON.stringify({ data: breadCumbData })
    );
    getKioskLocationList(kioskLocationPage, pageSize);
  }, []);
  const breadCumbData = [
    {
      href: KIOSK_LOCATION_MANAGER_HREF,
      label: KIOSK_LOCATION_MANAGER_LABEL,
      icon: null,
    },
  ];
  const showModal = (type) => {
    if (type === "create") {
      setIsCreateModalVisible(true);
    }
  };
  const onFinishModal = async (type) => {
    if (type === "create") {
      setIsCreateModalVisible(false);
    }
    await getKioskLocationList(kioskLocationPage, pageSize);
  };

  const handleCancelModal = (type) => {
    if (type === "create") {
      setIsCreateModalVisible(false);
    }
  };
  return (
    <>
      <ModalCreateLocation
        modalToIndex={onFinishModal}
        isCreateModalVisible={isCreateModalVisible}
        handleCancelModal={handleCancelModal}
      />
      <CustomBreadCumb props={breadCumbData} />
      <Row style={{ padding: 10 }}>
        <Col span={15}></Col>
        <Col span={5} />
        <Col span={4}>
          <Button
            className="success-button"
            size={"large"}
            onClick={() => showModal("create")}
          >
            <PlusOutlined /> Kiosk Location
          </Button>
        </Col>
      </Row>
      {kioskLocationList ?
        kioskLocationList.length === 0 ?
          <Row justify='center' align='center' style={{ marginTop: 250 }}>
            <Col>
              <Empty />
            </Col>
          </Row> :
          <>
            <Table
              columns={columns}
              dataSource={kioskLocationList}
              pagination={false}
            />
            <Pagination
              defaultCurrent={1}
              total={kioskLocationPageTotal}
              pageSize={pageSize}
              onChange={handleChangeNumberOfPaging}
            />
          </> : <Skeleton />
      }
    </>
  );
};
export default KioskLocationPage;
