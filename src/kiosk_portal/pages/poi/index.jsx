import { Button, Col, Form, Input, Pagination, Row, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getListPoiService } from "../../services/poi_service";
import { getListProvinceService } from "../../services/map_service";
import ModalCreatePoi from "./modalCreatePoi";
import { getListPoiCategoriesService } from "../../services/poi_category_service";
import ModalUpdatePoi from "./modalUpdatePoi";
import { SearchOutlined, PlusOutlined, EditFilled } from "@ant-design/icons";
import ModalAdvanceSearch from "./modalAdvanceSearch";
const PoiPage = () => {
  const { t } = useTranslation();
  const [listUnit, setListUnit] = useState([]);
  const [totalUnit, setTotalUnit] = useState(0);
  const [numUnitInPage, setNumUnitInPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [listPoiCategories, setListPoiCategories] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [listProvinces, setListProvinces] = useState([]);

  const [form] = Form.useForm();
  const getListPoiFunction = async (
    Name,
    Ward,
    District,
    City,
    Address,
    PoicategoryId,
    Type,
    currentPageToGetList,
    numInPage
  ) => {
    try {
      const res = await getListPoiService(
        Name,
        Ward,
        District,
        City,
        Address,
        PoicategoryId,
        Type,
        numInPage,
        currentPageToGetList
      );
      setTotalUnit(res.data.metadata.total);
      setListUnit(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    getListPoiFunction("", "", "", "", "", "", "", currentPage, numUnitInPage);
    const resProvinces = await getListProvinceService();
    setListProvinces(resProvinces.data);
    const resPoiCategories = await getListPoiCategoriesService("", 10000, 1);
    setListPoiCategories(resPoiCategories.data.data);
  }, []);

  const onFinishSearch = async (values) => {
    getListPoiFunction(
      values.name,
      "",
      "",
      "",
      "",
      "",
      "",
      currentPage,
      numUnitInPage
    );
  };

  const showModal = (type) => {
    if (type === "create") {
      setIsCreateModalVisible(true);
    } else if (type === "update") {
      setIsUpdateModalVisible(true);
    } else if (type === "search") {
      setIsSearchModalVisible(true);
    }
  };

  const onFinishModal = async (type, data) => {
    if (type === "create") {
      setIsCreateModalVisible(false);
    } else if (type === "update") {
      setIsUpdateModalVisible(false);
    } else if (type === "search") {
      setIsSearchModalVisible(false);
    }
    if (data === null) {
      setCurrentPage(1);
      await getListPoiFunction(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        currentPage,
        numUnitInPage
      );
    } else {
      setCurrentPage(1);
      await getListPoiFunction(
        data.Name,
        data.ward,
        data.district,
        data.city,
        data.address,
        data.poicategoryId,
        "",
        currentPage,
        numUnitInPage
      );
    }
  };

  const onSearchModal = async (data) => {};

  const handleCancelModalPoi = (type) => {
    if (type === "create") {
      setIsCreateModalVisible(false);
    } else if (type === "update") {
      setIsUpdateModalVisible(false);
    } else if (type === "search") {
      setIsSearchModalVisible(false);
    }
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    console.log(page, pageSize);
    setCurrentPage(page);
    await getListPoiFunction("", "", "", "", "", "", "", page, pageSize);
  };

  const columns = [
    {
      title: "Image",
      render: (text, record, dataIndex) => (
        <img src={record.thumbnail.link} width={100} height={100} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Open Day",
      dataIndex: "dayOfWeek",
      key: "dayOfWeek",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => <a>{text}</a>,
    },

    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record, dataIndex) => <a>{text}</a>,
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
            <EditFilled /> Update
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row style={{ padding: 10 }}>
        <Col span={15}>
          <Form form={form} name="search" onFinish={onFinishSearch}>
            <Row>
              <Col span={10}>
                <Form.Item name="name" style={{ marginTop: 5 }}>
                  <Input placeholder="Search by name" />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{ marginLeft: 10, borderRadius: 5 }}
                    type="primary"
                    size={"large"}
                  >
                    <SearchOutlined />
                  </Button>
                </Form.Item>
              </Col>
              <Col span={1} />
              <Col span={3}>
                <Button
                  type="danger"
                  size={"large"}
                  onClick={() => showModal("search")}
                >
                  <SearchOutlined /> Advanced
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={5} />
        <Col span={4}>
          <Button
            className="success-button"
            size={"large"}
            onClick={() => showModal("create")}
          >
            <PlusOutlined /> Create
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

      <ModalCreatePoi
        modalToIndex={onFinishModal}
        listProvinces={listProvinces}
        isCreatePoiModalVisible={isCreateModalVisible}
        handleCancelPoiModal={handleCancelModalPoi}
        listPoiCategories={listPoiCategories}
      />

      {currentUnit ? (
        <ModalUpdatePoi
          key={currentUnit.id}
          modalToIndex={onFinishModal}
          listProvinces={listProvinces}
          isUpdatePoiModalVisible={isUpdateModalVisible}
          handleCancelPoiModal={handleCancelModalPoi}
          listPoiCategories={listPoiCategories}
          currentItem={currentUnit}
        />
      ) : null}
      {
        <ModalAdvanceSearch
          onSearchModal={onSearchModal}
          modalToIndex={onFinishModal}
          listProvinces={listProvinces}
          isPoiModalVisible={isSearchModalVisible}
          handleCancelPoiModal={handleCancelModalPoi}
          listPoiCategories={listPoiCategories}
        />
      }
    </>
  );
};
export default PoiPage;
