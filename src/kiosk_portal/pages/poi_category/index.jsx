import { EditFilled, PlusOutlined, PoweroffOutlined } from "@ant-design/icons";
import { Pagination, Space, Table, Button, Row, Col, Modal } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getListPoiCategoriesService } from "../../services/poi_category_service";
import ModalCreatePoiCategory from "./modalCreatePoiCategory";

const PoiCategory = () => {
  const { t } = useTranslation();
  const [listUnit, setListUnit] = useState([]);
  const [totalUnit, setTotalUnit] = useState(0);
  const [numUnitInPage, setNumUnitInPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListPoiCategoryFunction();
  };

  const showModal = (type) => {
    if (type === "create") {
      setIsCreateModalVisible(true);
    } else if (type === "update") {
      setIsUpdateModalVisible(true);
    }
  };

  const onFinishModal = async (type) => {
    if (type === "create") {
      setIsCreateModalVisible(false);
    } else if (type === "update") {
      setIsUpdateModalVisible(false);
    }
    await getListPoiCategoryFunction("", currentPage, numUnitInPage);
  };

  const handleCancelModal = (type) => {
    if (type === "create") {
      setIsCreateModalVisible(false);
    } else if (type === "update") {
      setIsUpdateModalVisible(false);
    }
  };

  useEffect(async () => {
    await getListPoiCategoryFunction("", currentPage, numUnitInPage);
  }, []);

  const handleRemovePoiCategory = async (record) => {
    Modal.confirm({
      title: "Are you sure to remove this POI category",
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          try {
            console.log(record);
            // await changeStatusAccountService(record.id, null).then(() => {
            //   getListAccountFunction(currentPage, numAccountInPage);
            //   toast.success(t("toastsuccesschangestatus"));
            // });
          } catch (error) {
            console.log(error);
          }
        }
      },
    });
  };

  const getListPoiCategoryFunction = async (
    Name,
    currentPageToGetList,
    numInPage
  ) => {
    try {
      const res = await getListPoiCategoriesService(
        Name,
        numInPage,
        currentPageToGetList
      );
      setTotalUnit(res.data.metadata.total);
      setListUnit(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "logo",
      key: "logo",
      render: (text, record, dataIndex) => (
        <img src={record.logo} width={50} height={50} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("action"),
      key: "action",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="infor-button"
            shape="default"
            onClick={() => {
              setCurrentUnit(record);
              showModal("update");
            }}
          >
            <EditFilled /> UPDATE
          </Button>
          <Button
            type="primary"
            shape="default"
            name={record}
            onClick={() => {
              handleRemovePoiCategory(record);
            }}
          >
            <PoweroffOutlined /> {t("change-status")}
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Row style={{ padding: 10 }}>
        <Col span={20} />
        <Col span={4}>
          <Button
            className="success-button"
            size={"large"}
            onClick={() => showModal("create")}
          >
            <PlusOutlined /> CREATE
          </Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={listUnit} pagination={false} />
      <Pagination
        defaultCurrent={1}
        total={totalUnit}
        pageSize={5}
        onChange={handleChangeNumberOfPaging}
      />
      <ModalCreatePoiCategory
        modalToIndex={onFinishModal}
        isCreateModalVisible={isCreateModalVisible}
        handleCancelModal={handleCancelModal}
      />
    </>
  );
};
export default PoiCategory;
