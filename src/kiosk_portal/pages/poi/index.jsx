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
  formatDatePicker,
  formatTimePicker,
} from "../../../@app/utils/date_util";
import {
  getListDistrictService,
  getListProvinceService,
  getListWardService,
} from "../../services/map_service";

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
  const [listDistricts, setListDistricts] = useState([]);
  const [listWards, setListWards] = useState([]);

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

  const handleProvinceChange = async (value) => {
    const resDistrict = await getListDistrictService(value);
    setListDistricts(resDistrict.data);
    const resWard = await getListWardService(resDistrict.data[0].code);
    setListWards(resWard.data);
    form.setFieldsValue({
      district: {
        value: resDistrict.data[0].name,
      },
      selectDistricts: {
        key: resDistrict.data[0].code,
        value: resDistrict.data[0].code,
      },
      ward: {
        value: resWard.data[0].name,
      },
      selectWards: {
        key: resWard.data[0].code,
        value: resWard.data[0].code,
      },
    });
  };

  const handleDistrictChange = async (value) => {
    const resWard = await getListWardService(value);
    setListWards(resWard.data);
    form.setFieldsValue({
      ward: {
        value: resWard.data[0].name,
      },
      selectWards: {
        key: resWard.data[0].code,
        value: resWard.data[0].code,
      },
    });
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

  const onFinishCreatePoi = async (values) => {
    const invalidMsg = [];
    var check = true;
    try {
      if (values.stringOpenTime - values.stringCloseTime > 0) {
        invalidMsg.push("Time start need to before or match with time end\n");
        check = false;
      }
      if (check) {
        let objCity = listProvinces.find(
          (element) => element.code === values.city
        );
        let objDistrict = listDistricts.find(
          (element) => element.code === values.district
        );
        let objWard = listWards.find((element) => element.code === values.ward);

        if (typeof objDistrict === "undefined") {
          objDistrict = values.district.value;
        } else {
          objDistrict = objDistrict.name;
        }
        if (typeof objWard === "undefined") {
          objWard = values.ward.value;
        } else {
          objWard = objWard.name;
        }

        const newPoi = {
          name: values.name,
          description: values.description,
          stringOpenTime: formatTimePicker(values.stringOpenTime),
          stringCloseTime: formatTimePicker(values.stringCloseTime),
          dayOfWeek: values.dayOfWeek.join("-"),
          ward: objWard,
          district: objDistrict,
          city: objCity.name,
          address: values.address,
          poicategoryId: values.poicategoryId,
        };
        await createPoiService(newPoi).then(() => {
          getListPoiFunction(currentPage, numPoiInPage);
          setIsCreatePoiModalVisible(false);
          toast.success("Create Poi Success");
        });
      } else {
        var errormsg = invalidMsg.join("-");
        toast.error(errormsg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showModalCreatePoi = () => {
    setIsCreatePoiModalVisible(true);
    form.resetFields();
  };

  const handleCancelCreatePoi = () => {
    setIsCreatePoiModalVisible(false);
    setListDistricts(null);
    setListWards(null);
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

      <Modal
        title="Create Poi"
        visible={isCreatePoiModalVisible}
        onCancel={handleCancelCreatePoi}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="registerPoi"
          onFinish={onFinishCreatePoi}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label={t("name")}
            rules={[
              {
                required: true,
                message: t("reqnameschedule"),
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
                message: "Please input your description!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stringOpenTime"
            label={t("timestart")}
            rules={[
              {
                required: true,
                message: t("reqtimestartschedule"),
              },
            ]}
          >
            <TimePicker allowClear={false} />
          </Form.Item>
          <Form.Item
            name="stringCloseTime"
            label={t("timeend")}
            rules={[
              {
                required: true,
                message: t("reqtimeendschedule"),
              },
            ]}
          >
            <TimePicker allowClear={false} />
          </Form.Item>
          <Form.Item name="dayOfWeek" label={t("dayofweek")}>
            <Checkbox.Group style={{ width: "100%" }} onChange={{}}>
              <Row>
                <Col span={8}>
                  <Checkbox value="Monday">{t("monday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Tuesday">{t("tuesday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Wednesday">{t("wednesday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Thursday">{t("thursday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Friday">{t("friday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Saturday">{t("saturday")}</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Sunday">{t("sunday")}</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "Please input your address!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[
              {
                required: true,
                message: "Please choose your city!",
              },
            ]}
          >
            <Select
              name="selectProvince"
              onChange={handleProvinceChange}
              //   defaultValue={listProvinces[0]}
            >
              {listProvinces
                ? listProvinces.map((item) => (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  ))
                : null}
            </Select>
          </Form.Item>
          <Form.Item
            name="district"
            label="District"
            rules={[
              {
                required: true,
                message: "Please choose your district!",
              },
            ]}
          >
            <Select
              name="selectDistricts"
              onChange={handleDistrictChange}
              //   defaultValue={listDistricts[0]}
            >
              {listDistricts
                ? listDistricts.map((item) => (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  ))
                : null}
            </Select>
          </Form.Item>
          <Form.Item
            name="ward"
            label="Ward"
            rules={[
              {
                required: true,
                message: "Please choose your ward!",
              },
            ]}
          >
            <Select
              name="selectWards"
              // defaultValue={listWards[0]}
            >
              {listWards
                ? listWards.map((item) => (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  ))
                : null}
            </Select>
          </Form.Item>
          <Form.Item
            name="poicategoryId"
            label="Category"
            rules={[
              {
                required: true,
                message: "Please choose your category!",
              },
            ]}
          >
            <Select defaultValue={{}}>
              {/* {provinceData.map((province) => (
                <Option key={province}>{province}</Option>
              ))} */}
              <Option value="c5ad724c-0513-4f9e-8239-50b2a70793a0">Test</Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Create Poi
            </Button>
          </Form.Item>
        </Form>
      </Modal>

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
