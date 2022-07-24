import { Button, Col, Modal, Pagination, Row, Space, Table, Tag } from "antd";
import {
  EditFilled,
  EyeFilled,
  PlusOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getListAppCategoryService } from "../../services/app_category_service";
// import FormCreateCategory from "./formCreate";
// import ModalUpdateAppCategory from "./modalUpdateAppCategory";
import {
  APP_CATEGORY_MANAGER_HREF,
  APP_CATEGORY_MANAGER_LABEL,
  KIOSK_LOCATION_MANAGER_HREF,
  KIOSK_LOCATION_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { getListKioskLocationService } from "../../services/kiosk_location_service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalCreateLocation from "./modalCreateLocation";

const KioskLocationPage = () => {
  const [kioskLocationList, setKioskLocationList] = useState([]);
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record, dataIndex) =>
        record.status === "activate" ? (
          <Tag color={"green"}>Activate</Tag>
        ) : (
          <Tag color={"red"}>Deactivate</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="warn-button"
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
          <Button
            type="primary"
            shape="default"
            name={record}
            onClick={() => {
              toast.error("chưa có api");
            }}
          >
            <PoweroffOutlined /> Change Status
          </Button>
        </Space>
      ),
    },
  ];
  const getKioskLocationList = async (page, size) => {
    const res = await getListKioskLocationService("", page, size);
    console.log(res.data.data);
    setKioskLocationList(res.data.data);
    setKioskLocationPageTotal(res.data.metadata.total);
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setKioskLocationPage(page);
    await getKioskLocationList(page, pageSize);
  };

  useEffect(async () => {
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
    </>
  );
};
export default KioskLocationPage;
