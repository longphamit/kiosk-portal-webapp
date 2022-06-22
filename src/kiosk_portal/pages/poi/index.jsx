import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { getListPoiService } from "../../services/poi_service";
import { getListProvinceService } from "../../services/map_service";
import ModalCreatePoi from "./modalCreatePoi";
import { getListPoiCategoriesService } from "../../services/poi_category_service";
import ModalUpdatePoi from "./modalUpdatePoi";
import {
  SearchOutlined,
  PlusOutlined,
  EyeFilled,
  EditFilled,
  ArrowUpOutlined
} from "@ant-design/icons";
const PoiPage = () => {
  const { Option } = Select;
  const { t } = useTranslation();
  const [listPoi, setListPoi] = useState([]);
  const [totalPoi, setTotalPoi] = useState(0);
  const [numPoiInPage, setNumPoiInPage] = useState(5);
  const [isSearch, setIsSearch] = useState(false);
  const [querySearch, setQuerySearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItem, setCurrentItem] = useState(null);
  const [listPoiCategories, setListPoiCategories] = useState([]);
  const [isCreatePoiModalVisible, setIsCreatePoiModalVisible] = useState(false);
  const [isUpdatePoiModalVisible, setIsUpdatePoiModalVisible] = useState(false);
  const [isAdvancedSearchModalVisible, setIsAdvancedSearchModalVisible] =
    useState(false);
  const [poiSearchType, setPoiSearchType] = useState("FirstName");

  const [listProvinces, setListProvinces] = useState([]);

  const [form] = Form.useForm();
  const getListPoiFunction = async (currentPageToGetList, numInPage) => {
    try {
      // if (isSearch) {
      //   querySearch.page = currentPageToGetList;
      //   const res = await searchAccountService(querySearch)
      //   setTotalApplication(res.data.metadata.total);
      //   setListApplication(res.data.data);
      //   return;
      // }
      const res = await getListPoiService(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        numInPage,
        currentPageToGetList
      );
      setTotalPoi(res.data.metadata.total);
      setListPoi(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    getListPoiFunction(currentPage, numPoiInPage);
    const resProvinces = await getListProvinceService();
    setListProvinces(resProvinces.data);
    const resPoiCategories = await getListPoiCategoriesService("", 10000, 1);
    setListPoiCategories(resPoiCategories.data.data);
  }, []);

  // const onFinishAdvancedSearch = async (values) => {
  //   console.log(values);
  //   const search = {
  //     firstName: values.firstName??"",
  //     lastName: values.lastName??"",
  //     phoneNumber: values.phoneNumber??"",
  //     email: values.email??"",
  //     address: values.address??"",
  //     status: values.status??"",
  //     size: numApplicationInPage,
  //     page: 1,
  //   };
  //   try {
  //     const res = await searchAccountService(search)
  //     setTotalApplication(res.data.metadata.total);
  //     setListApplication(res.data.data);
  //     setIsSearch(true);
  //     setQuerySearch(search);
  //     handleCloseModalAdvancedSearch();
  //   } catch (error) {
  //     console.log(error);
  //     setTotalApplication(0);
  //     setListApplication([]);
  //   }
  // };
  const buildPartyParamSearch = (value) => {
    let firstName = "";
    let lastName = "";
    let phoneNumber = "";
    let email = "";
    let address = "";
    let status = "";
    switch (poiSearchType) {
      case "FirstName":
        firstName = value;
        break;
      case "LastName":
        lastName = value;
        break;
      case "PhoneNumber":
        phoneNumber = value;
        break;
      case "Email":
        email = value;
        break;
      case "Address":
        address = value;
        break;
      case "Status":
        status = value;
        break;
    }
    return {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
      status: status,
    };
  };
  // const onFinishSearch = async (values) => {
  //   const search = buildPartyParamSearch(values.searchString);
  //   search["size"] = numApplicationInPage;
  //   search["page"] = 1
  //   try {
  //     const res = await searchAccountService(search)
  //     setTotalApplication(res.data.metadata.total);
  //     setListApplication(res.data.data);
  //     setIsSearch(true);
  //     setQuerySearch(search);
  //   } catch (error) {
  //     console.log(error);
  //     setTotalApplication(0);
  //     setListApplication([]);
  //   }
  // };

  const showModalPoi = (type) => {
    if (type === "create") {
      setIsCreatePoiModalVisible(true);
    } else if (type === "update") {
      setIsUpdatePoiModalVisible(true);
    }
  };

  const onFinishModalPoi = async () => {
    setIsCreatePoiModalVisible(false);
    await getListPoiFunction(currentPage, numPoiInPage);
  };

  const handleCancelModalPoi = (type) => {
    if (type === "create") {
      setIsCreatePoiModalVisible(false);
    }
    if (type === "update") {
      setIsUpdatePoiModalVisible(false);
    }
  };

  const showModalAdvancedSearch = () => {
    setIsAdvancedSearchModalVisible(true);
    form.resetFields();
  };
  const handleCloseModalAdvancedSearch = () => {
    setIsAdvancedSearchModalVisible(false);
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListPoiFunction(page, numPoiInPage);
  };

  const types = [
    {
      name: "FirstName",
      label: "First Name",
    },
    {
      name: "LastName",
      label: "Last Name",
    },
    {
      name: "PhoneNumber",
      label: "Phone",
    },
    {
      name: "Email",
      label: "Email",
    },
    {
      name: "Address",
      label: "Address",
    },
    {
      name: "Status",
      label: "Status",
    },
  ];
  const columns = [
    {
      title: "Image",
      render: (text, record, dataIndex) => <img src={record.thumbnail.link} width={100} height={100}/>
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
              setCurrentItem(record);
              showModalPoi("update");
            }}
          >
            <EditFilled/> POI
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row style={{ padding: 10 }}>
        <Col span={15}>
          <Form
            form={form}
            name="search"
            //   onFinish={onFinishSearch}
            initialValues={{
              type: "FirstName",
              searchString: "",
            }}
          >
            <Row>
              <Col span={4}>
                <Form.Item name="type" style={{ marginTop: 5 }}>
                  <Select
                    defaultValue="FirstName"
                    onChange={(e) => {
                      setPoiSearchType(e);
                    }}
                  >
                    {types.map((item) => {
                      return <Option value={item.name}>{item.label}</Option>;
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="searchString" style={{ marginTop: 5 }}>
                  <AutoComplete
                    style={{ width: "100%" }}
                    options={[]}
                    placeholder="Search..."
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
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
                    <SearchOutlined/>
                  </Button>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button
                  type="danger"
                  size={"large"}
                  onClick={showModalAdvancedSearch}
                >
                    
                    <SearchOutlined/>  Advanced 
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
            onClick={() => showModalPoi("create")}
          >
            <PlusOutlined/> POI
          </Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={listPoi} pagination={false} />
      <Pagination
        defaultCurrent={1}
        total={totalPoi}
        pageSize={5}
        onChange={handleChangeNumberOfPaging}
      />

      <ModalCreatePoi
        modalToIndex={onFinishModalPoi}
        listProvinces={listProvinces}
        isCreatePoiModalVisible={isCreatePoiModalVisible}
        handleCancelPoiModal={handleCancelModalPoi}
        listPoiCategories={listPoiCategories}
      />

      {currentItem ? (
        <ModalUpdatePoi
          key={currentItem.id}
          modalToIndex={onFinishModalPoi}
          listProvinces={listProvinces}
          isUpdatePoiModalVisible={isUpdatePoiModalVisible}
          handleCancelPoiModal={handleCancelModalPoi}
          listPoiCategories={listPoiCategories}
          currentItem={currentItem}
        />
      ) : null}

      <Modal
        title="Advanced Search"
        visible={isAdvancedSearchModalVisible}
        onCancel={handleCloseModalAdvancedSearch}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="advancedSearch"
          // onFinish={onFinishAdvancedSearch}
          scrollToFirstError
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
          initialValues={{
            address: "",
            email: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            status: "",
          }}
        >
          <Form.Item name="firstName" label={t("firstname")}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label={t("lastname")}>
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label={t("phonenumber")}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label={t("email")}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label={t("address")}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label={t("status")}>
            <Select initialValues="">
              <Option value="">All</Option>
              <Option value="active">{t("active")}</Option>
              <Option value="deactive">{t("deactive")}</Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Space align="center">
              <Button align="center" type="primary" htmlType="submit">
                Search
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default PoiPage;
