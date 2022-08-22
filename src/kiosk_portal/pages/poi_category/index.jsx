import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";
import {
  Pagination,
  Space,
  Table,
  Button,
  Row,
  Col,
  Modal,
  Skeleton,
  Empty,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deletePoiCategoryService,
  getListPoiCategoriesService,
} from "../../services/poi_category_service";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import {
  POI_CATEGORY_MANAGER_HREF,
  POI_CATEGORY_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import ModalCreatePoiCategory from "./modalCreatePoiCategory";
import ModalUpdatePoiCategory from "./modalUpdatePoiCategory";
import { toast } from "react-toastify";
import { DELETE_SUCCESS } from "../../../@app/constants/message";

const PoiCategory = () => {
  const { t } = useTranslation();
  const [listUnit, setListUnit] = useState();
  const [totalUnit, setTotalUnit] = useState(0);
  const [numUnitInPage, setNumUnitInPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListPoiCategoryFunction("", page, numUnitInPage);
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
      title: "Are you sure to delete this POI category",
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          try {
            await deletePoiCategoryService(record.id);
            await getListPoiCategoryFunction("", 1, numUnitInPage);
            toast.success(DELETE_SUCCESS);
          } catch (error) {
            toast.error(error.response.data.message);
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
    } catch (error) {
      setListUnit([]);
      console.error(error);
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
            className="warn-button"
            shape="default"
            onClick={() => {
              setCurrentUnit(record);
              showModal("update");
            }}
          >
            <EditFilled /> UPDATE
          </Button>
          <Button
            className="danger-button"
            shape="default"
            name={record}
            onClick={() => {
              handleRemovePoiCategory(record);
            }}
          >
            <DeleteFilled /> Delete
          </Button>
        </Space>
      ),
    },
  ];
  const breadCumbData = [
    {
      href: POI_CATEGORY_MANAGER_HREF,
      label: POI_CATEGORY_MANAGER_LABEL,
      icon: null,
    },
  ];
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      <Row style={{ padding: 10 }}>
        <Col span={20} />
        <Col span={4}>
          <Button
            className="success-button"
            size={"large"}
            onClick={() => showModal("create")}
          >
            <PlusOutlined /> POI category
          </Button>
        </Col>
      </Row>
      {listUnit ? (
        listUnit.length === 0 ? (
          <>
            <Row justify="center" align="center" style={{ marginTop: 250 }}>
              <Col>
                <Empty />
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Table columns={columns} dataSource={listUnit} pagination={false} />
            <Pagination
              defaultCurrent={1}
              total={totalUnit}
              pageSize={5}
              onChange={handleChangeNumberOfPaging}
            />
          </>
        )
      ) : (
        <Skeleton />
      )}
      <ModalCreatePoiCategory
        modalToIndex={onFinishModal}
        isCreateModalVisible={isCreateModalVisible}
        handleCancelModal={handleCancelModal}
      />
      <ModalUpdatePoiCategory
        modalToIndex={onFinishModal}
        isUpdateModalVisible={isUpdateModalVisible}
        handleCancelModal={handleCancelModal}
        currentUnit={currentUnit}
      />
    </>
  );
};
export default PoiCategory;
