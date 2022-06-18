import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Tag,
  TimePicker,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import moment from "moment";

import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { getBase64 } from "../../../@app/utils/file_util";
import { localStorageGetUserIdService } from "../../../@app/services/localstorage_service";
import {
  createPoiService,
  getListPoiService,
} from "../../services/poi_service";
import {
  getListDistrictService,
  getListProvinceService,
  getListWardService,
} from "../../services/map_service";
import ModalCreatePoi from "./modalCreatePoi";
import { getListCategoriesService } from "../../services/categories_service";

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
  const [listCategories, setListCategories] = useState([]);
  const [isCreatePoiModalVisible, setIsCreatePoiModalVisible] = useState(false);
  const [isEditPoiModalVisible, setIsEditPoiModalVisible] = useState(false);
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
    const resCategories = await getListCategoriesService("", 10000, 1);
    setListCategories(resCategories.data);
  }, []);

  const onFinishUpdatePoi = async (values) => {
    let updatePoi = [];
    if (typeof values.logo === "object") {
      let formatResult = [];
      const result = await getBase64(values.logo.file.originFileObj);
      formatResult = result.split(",");
      updatePoi = {
        id: values.id,
        name: values.name,
        description: values.description,
        logo: formatResult[1],
        link: values.link,
        partyId: values.partyId,
        appCategoryId: values.appCategoryId,
      };
    } else {
      updatePoi = {
        id: values.id,
        name: values.name,
        description: values.description,
        logo: values.logo,
        link: values.link,
        partyId: values.partyId,
        appCategoryId: values.appCategoryId,
      };
    }
    // try {
    //   await updateApplicationService(updatePoi);
    //   getListPoiFunction(currentPage, numPoiInPage);
    //   setIsCreatePoiModalVisible(false);
    //   toast.success("Update Poi Success");
    //   handleCancelEditPoi();
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const onFinishModalCreatePoi = async (childdata) => {
    setIsCreatePoiModalVisible(childdata);
    await getListPoiFunction(currentPage, numPoiInPage);
  };

  const handleCancelCreatePoi = (childdata) => {
    setIsCreatePoiModalVisible(childdata);
  };

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
  const showModalEditPoi = () => {
    setIsEditPoiModalVisible(true);
  };

  const handleCancelEditPoi = () => {
    setIsEditPoiModalVisible(false);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      toast.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast.error("Image must smaller than 2MB!");
    }

    return isJpgOrPng && isLt2M;
  };

  const showModalCreatePoi = async () => {
    setIsCreatePoiModalVisible(true);
    form.resetFields();
  };

  const showModalAdvancedSearch = () => {
    setIsAdvancedSearchModalVisible(true);
    form.resetFields();
  };
  const handleCloseModalAdvancedSearch = () => {
    setIsAdvancedSearchModalVisible(false);
  };
  const handleChangeStatusPoi = async (record) => {
    Modal.confirm({
      title: "Are you sure to send request change status this poi",
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          //   try {
          //     const newReq = {
          //       //   creatorId: localStorageGetUserIdService(),
          //       //   serviceApplicationId: record.id,
          //     };
          //     await sendReqPublishApplicationService(newReq).then(() => {
          //       getListPoiFunction(currentPage, numPoiInPage);
          //       toast.success("Send req success");
          //     });
          //   } catch (error) {
          //     console.log(error);
          //   }
        }
      },
    });
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
              showModalEditPoi();
            }}
          >
            Update poi
          </Button>
          {record.status === "unavailable" ? (
            <Button
              type="primary"
              shape="default"
              name={record}
              onClick={() => {
                handleChangeStatusPoi(record);
              }}
            >
              Publish App
            </Button>
          ) : (
            <Button
              type="primary"
              shape="default"
              disabled="false"
              name={record}
              onClick={() => {
                handleChangeStatusPoi(record);
              }}
            >
              Publish App
            </Button>
          )}
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
              <Col span={3}>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{ marginLeft: 10, borderRadius: 5 }}
                    type="primary"
                    size={"large"}
                  >
                    Search
                  </Button>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button
                  type="danger"
                  size={"large"}
                  onClick={showModalAdvancedSearch}
                >
                  Advanced Search
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
            onClick={showModalCreatePoi}
          >
            Create poi
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
        modalToIndex={onFinishModalCreatePoi}
        listProvinces={listProvinces}
        isCreatePoiModalVisible={isCreatePoiModalVisible}
        handleCancelCreatePoi={handleCancelCreatePoi}
        listCategories={listCategories}
      />

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
      {currentItem ? (
        <Modal
          key={currentItem.id}
          title={t("edit")}
          visible={isEditPoiModalVisible}
          onCancel={handleCancelEditPoi}
          footer={null}
        >
          <Form
            key={currentItem.id}
            {...formItemLayout}
            form={form}
            name="edit"
            onFinish={onFinishUpdatePoi}
            scrollToFirstError
            initialValues={{
              id: currentItem.id,
              name: currentItem.name,
              description: currentItem.description,
              logo: currentItem.logo,
              link: currentItem.link,
              partyId: localStorageGetUserIdService(),
              appCategoryId: currentItem.appCategoryId,
            }}
          >
            <Form.Item name="id" hidden={true}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="partyId" hidden={true}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input poi name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please input poi description!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="link"
              label="Link"
              rules={[
                {
                  required: true,
                  message: "Please input poi link!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="logo"
              label="Logo"
              rules={[
                {
                  required: true,
                  message: "Please choose poi logo!",
                },
              ]}
            >
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                maxCount={1}
                accept=".png"
                beforeUpload={beforeUpload}
                defaultFileList={[
                  {
                    uid: "abc",
                    name: "image.png",
                    status: "done",
                    url: currentItem.logo,
                  },
                ]}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="appCategoryId"
              label="Category"
              rules={[
                {
                  required: true,
                  message: "Please choose poi category!",
                },
              ]}
            >
              <Select placeholder="Select your categories">
                {listCategories
                  ? listCategories.map((item) => {
                      return <Option value={item.id}>{item.name}</Option>;
                    })
                  : null}
              </Select>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Update Poi
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};
export default PoiPage;
