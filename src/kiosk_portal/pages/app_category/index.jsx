import {
  Button,
  Col,
  Empty,
  Modal,
  Pagination,
  Row,
  Skeleton,
  Space,
  Table,
} from "antd";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { deleteAppCategoryService, getListAppCategoryService } from "../../services/app_category_service";
import FormCreateCategory from "./formCreate";
import ModalUpdateAppCategory from "./modalUpdateAppCategory";
import {
  APP_CATEGORY_MANAGER_HREF,
  APP_CATEGORY_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { t } from "i18next";
import { toast } from "react-toastify";
import { DELETE_SUCCESS } from "../../../@app/constants/message";

const AppCategoryPage = () => {
  const [appCategoryList, setAppCategoryList] = useState();
  const [appCategoryPage, setAppCategoryPage] = useState(1);
  const [appCategoryPageSize, setAppCategoryPageSize] = useState(5);
  const [appCategoryPageTotal, setAppCategoryPageTotal] = useState(0);
  const [isCreateCategoryModalVisible, setIsCreateCategoryModalVisible] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(null);
  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (text) => <img style={{ height: 80, weight: 80 }} src={text} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Commission Percentage",
      dataIndex: "commissionPercentage",
      key: "commissionPercentage",
      render: (text) => <p>{text}%</p>,
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
              handleRemoveAppCategory(record);
            }}
          >
            <DeleteFilled /> Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleRemoveAppCategory = async (record) => {
    Modal.confirm({
      title: "Are you sure to delete this application category",
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          try {
            await deleteAppCategoryService(record.id);
            setCurrentPage(1);
            await getAppCategoryList(1, appCategoryPageSize);
            toast.success(DELETE_SUCCESS);
          } catch (error) {
            toast.error(error.response.data.message);
          }
        }
      },
    });
  };

  const getAppCategoryList = async (page, size) => {
    try {
      const res = await getListAppCategoryService(page, size);
      setAppCategoryList(res.data.data);
      setAppCategoryPageTotal(res.data.metadata.total);
    } catch (e) {
      console.error(e);
      setAppCategoryList([]);
    }
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setAppCategoryPage(page);
    setCurrentPage(page);
    await getAppCategoryList(page, appCategoryPageSize);
  };

  const handleShowModalCreateCategory = () => {
    setIsCreateCategoryModalVisible(true);
  };

  const handleCancelCreateCategory = () => {
    setIsCreateCategoryModalVisible(false);
  };
  const onFinishModalCreateCategory = async (childdata) => {
    setIsCreateCategoryModalVisible(childdata);
    await getAppCategoryList(appCategoryPage, appCategoryPageSize);
  };

  const showModal = (type) => {
    if (type === "update") {
      setIsUpdateModalVisible(true);
    }
  };

  const onFinishModal = async (type) => {
    if (type === "update") {
      setIsUpdateModalVisible(false);
    }
    await getAppCategoryList(appCategoryPage, appCategoryPageSize);
  };

  const handleCancelModal = (type) => {
    if (type === "update") {
      setIsUpdateModalVisible(false);
    }
  };

  useEffect(async () => {
    getAppCategoryList(appCategoryPage, appCategoryPageSize);
  }, []);
  const breadCumbData = [
    {
      href: APP_CATEGORY_MANAGER_HREF,
      label: APP_CATEGORY_MANAGER_LABEL,
      icon: null,
    },
  ];
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      <Modal
        title="Create Application Category"
        visible={isCreateCategoryModalVisible}
        onCancel={handleCancelCreateCategory}
        footer={null}
      >
        <FormCreateCategory visible={onFinishModalCreateCategory} />
      </Modal>
      <ModalUpdateAppCategory
        modalToIndex={onFinishModal}
        isUpdateModalVisible={isUpdateModalVisible}
        handleCancelModal={handleCancelModal}
        currentUnit={currentUnit}
      />
      <Row style={{ padding: 10 }}>
        <Col span={15}></Col>
        <Col span={5} />
        <Col span={4}>
          <Button
            className="success-button"
            size={"large"}
            onClick={handleShowModalCreateCategory}
          >
            <PlusOutlined /> App category
          </Button>
        </Col>
      </Row>
      {appCategoryList ? (
        appCategoryList.length === 0 ? (
          <>
            <Row justify="center" align="center" style={{ marginTop: 250 }}>
              <Col>
                <Empty />
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={appCategoryList}
              pagination={false}
            />
            <Pagination
              defaultCurrent={1}
              total={appCategoryPageTotal}
              pageSize={appCategoryPageSize}
              current={currentPage}
              onChange={handleChangeNumberOfPaging}
            />
          </>
        )
      ) : (
        <Skeleton />
      )}
    </>
  );
};
export default AppCategoryPage;
