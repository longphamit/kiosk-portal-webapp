import { Button, Col, Modal, Pagination, Row, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getListAppCategoryService } from "../../services/app_category_service";
import FormCreateCategory from "./formCreate";

const AppCategoryPage = () => {
  const [appCategoryList, setAppCategoryList] = useState([]);
  const [appCategoryPage, setAppCategoryPage] = useState(1);
  const [appCategoryPageSize, setAppCategoryPageSize] = useState(5);
  const [appCategoryPageTotal, setAppCategoryPageTotal] = useState(0);
  const [isCreateCategoryModalVisible, setIsCreateCategoryModalVisible] =
    useState(false);

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
      render: (text) => <a>{text}</a>,
    },
  ];
  const getAppCategoryList = async (page, size) => {
    const res = await getListAppCategoryService(page, size);
    setAppCategoryList(res.data.data);
    setAppCategoryPageTotal(res.data.metadata.total);
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setAppCategoryPage(page);
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

  useEffect(async () => {
    getAppCategoryList(appCategoryPage, appCategoryPageSize);
  }, []);

  return (
    <>
      <Modal
        title="Create Application"
        visible={isCreateCategoryModalVisible}
        onCancel={handleCancelCreateCategory}
        footer={null}
      >
        <FormCreateCategory visible={onFinishModalCreateCategory} />
      </Modal>

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
      <Table
        columns={columns}
        dataSource={appCategoryList}
        pagination={false}
      />
      <Pagination
        defaultCurrent={1}
        total={appCategoryPageTotal}
        pageSize={appCategoryPageSize}
        onChange={handleChangeNumberOfPaging}
      />
    </>
  );
};
export default AppCategoryPage;
