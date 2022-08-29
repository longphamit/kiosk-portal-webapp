import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Upload,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeFilled,
  EditFilled,
  ArrowUpOutlined,
  DownloadOutlined,
  LinkOutlined,
  StopOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../../../@app/utils/file_util";
import {
  localStorageGetReduxState,
  localStorageGetUserIdService,
} from "../../../../@app/services/localstorage_service";
import {
  formItemLayout,
  tailFormItemLayout,
} from "../../../layouts/form_layout";
import {
  createApplicationService,
  getListApplicationService,
  sendReqPublishApplicationService,
  stopApplicationService,
  updateApplicationService,
  updateBannerApplicationService,
} from "../../../services/application_service";
import { getAllCategoriesService } from "../../../services/categories_service";
import { beforeUpload } from "../../../../@app/utils/image_util";
import { useNavigate } from "react-router-dom";
import {
  ROLE_ADMIN,
  ROLE_LOCATION_OWNER,
  ROLE_SERVICE_PROVIDER,
} from "../../../../@app/constants/role";
import { Editor } from "primereact/editor";
import { FILE_UPLOAD_URL } from "../../../../@app/utils/api_links";
import { ACCEPT_IMAGE } from "../../../constants/accept_file";
import {
  ERROR_SELECT_CATEGORY,
  ERROR_INPUT_LINK,
  ERROR_INPUT_NAME,
  UPDATE_SUCCESS,
  CREATE_SUCCESS,
  ERROR_UPLOAD_LOGO_CATE,
} from "../../../../@app/constants/message";
import { ImageLimitSizeTooltip } from "../../../../@app/components/image/image_extra_label";

const COMMISSION_FEE = "* Commission Fee: ";
const ApplicationTable = ({ partyId }) => {
  const navigator = useNavigate();
  const { Option } = Select;
  const { TextArea } = Input;
  const { t } = useTranslation();
  const role = localStorageGetReduxState().auth.role;
  const [listApplication, setListApplication] = useState();
  const [totalApplication, setTotalApplication] = useState(0);
  const [numApplicationInPage, setNumApplicationInPage] = useState(5);
  const [isSearch, setIsSearch] = useState(false);
  const [querySearch, setQuerySearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItem, setCurrentItem] = useState(null);
  const [listCategories, setListCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [isCreateApplicationModalVisible, setIsCreateApplicationModalVisible] =
    useState(false);
  const [isEditApplicationModalVisible, setIsEditApplicationModalVisible] =
    useState(false);
  const [isAdvancedSearchModalVisible, setIsAdvancedSearchModalVisible] =
    useState(false);
  const [isLoadingBanner, setIsLoadingBanner] = useState(false);
  const [applicationSearchType, setApplicationSearchType] =
    useState("FirstName");
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [formUploadBanner] = Form.useForm();
  const [formAdvanceSearch] = Form.useForm();
  const [isCheck, setIsCheck] = useState(true);
  const [commissionText, setCommissionText] = useState("");
  const [isAffiliateVisible, setIsAffiliateVisible] = useState(false);
  const getListApplicationFunction = async (
    Name,
    PartyName,
    PartyEmail,
    AppCategoryId,
    AppCategoryName,
    Status,
    currentPageToGetList,
    numInPage
  ) => {
    try {
      const res = await getListApplicationService(
        Name,
        PartyName,
        PartyEmail,
        AppCategoryId,
        AppCategoryName,
        Status,
        numInPage,
        currentPageToGetList
      );
      setTotalApplication(res.data.metadata.total);
      setListApplication(res.data.data);
    } catch (error) {
      setListApplication([]);
      toast.error(error.response.data.message);
    }
  };

  useEffect(async () => {
    getListApplicationFunction(
      "",
      "",
      "",
      "",
      "",
      "",
      currentPage,
      numApplicationInPage
    );
    const res = await getAllCategoriesService();
    setListCategories(res.data);
  }, []);

  const onFinishUpdateApplication = async (values) => {
    setIsLoading(true);
    try {
      let isCheck = true;
      if (values.logo.fileList !== undefined) {
        if (values.logo.fileList.length === 0) {
          toast.error("Please choose logo");
          isCheck = false;
        }
      }
      if (isCheck) {
        let updateApplication = [];
        if (typeof values.logo === "object") {
          let formatResult = [];
          const result = await getBase64(values.logo.file.originFileObj);
          formatResult = result.split(",");
          updateApplication = {
            id: values.id,
            name: values.name,
            description: description,
            logo: formatResult[1],
            link: values.link,
            appCategoryId: values.appCategoryId,
            isAffiliate: isCheck,
          };
        } else {
          updateApplication = {
            id: values.id,
            name: values.name,
            description: description,
            logo: null,
            link: values.link,
            appCategoryId: values.appCategoryId,
            isAffiliate: isCheck,
          };
        }
        let res = await updateApplicationService(updateApplication);
        getListApplicationFunction(
          "",
          "",
          "",
          "",
          "",
          "",
          currentPage,
          numApplicationInPage
        );
        setIsCreateApplicationModalVisible(false);
        toast.success(UPDATE_SUCCESS);
        handleCancelEditApplication();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopApplication = async (record) => {
    Modal.confirm({
      title: "Are you sure to stop this application ?",
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          try {
            const id = {
              serviceApplicationId: record.id,
            };
            await stopApplicationService(id).then(() => {
              getListApplicationFunction(
                "",
                "",
                "",
                "",
                "",
                "",
                currentPage,
                numApplicationInPage
              );
              toast.success("Stop application success");
            });
          } catch (error) {
            toast.error(error.response.data.message);
          }
        }
      },
    });
  };

  const showModalEditApplication = () => {
    setIsEditApplicationModalVisible(true);
  };

  const handleCancelEditApplication = () => {
    setIsEditApplicationModalVisible(false);
  };

  const onFinishCreateApplication = async (values) => {
    setIsLoading(true);
    try {
      let formatResult = [];
      const result = await getBase64(values.logo.file.originFileObj);
      formatResult = result.split(",");
      let isCheck = true;
      if (
        typeof values.isAffiliate === "undefined" ||
        values.isAffiliate === false
      ) {
        isCheck = false;
      }
      let banner = [];
      if (values.banner?.fileList[0]) {
        let resultBanner = await getBase64(values.banner.file.originFileObj);
        banner = resultBanner.split(",");
      }
      const newApplication = {
        name: values.name,
        description: description,
        link: values.link,
        logo: formatResult[1],
        appCategoryId: values.appCategoryId,
        isAffiliate: isCheck,
        banner: banner[1],
      };
      await createApplicationService(newApplication);
      getListApplicationFunction(
        "",
        "",
        "",
        "",
        "",
        "",
        currentPage,
        numApplicationInPage
      );
      setIsCreateApplicationModalVisible(false);
      toast.success(CREATE_SUCCESS);
      form.resetFields();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const showModalCreateApplication = () => {
    setIsCreateApplicationModalVisible(true);
    form.resetFields();
  };

  const handleCancelCreateApplication = () => {
    setIsCreateApplicationModalVisible(false);
    setIsAffiliateVisible(false);
  };
  const showModalAdvancedSearch = () => {
    setIsAdvancedSearchModalVisible(true);
    form.resetFields();
  };
  const handleCloseModalAdvancedSearch = () => {
    setIsAdvancedSearchModalVisible(false);
  };
  const handleChangeStatusApplication = async (record) => {
    Modal.confirm({
      title: "Are you sure to send request publish this application",
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          try {
            const newReq = {
              creatorId: localStorageGetUserIdService(),
              serviceApplicationId: record.id,
            };
            await sendReqPublishApplicationService(newReq).then(() => {
              getListApplicationFunction(
                "",
                "",
                "",
                "",
                "",
                "",
                currentPage,
                numApplicationInPage
              );
              toast.success("Send request publish success");
            });
          } catch (error) {
            toast.error(error.response.data.message);
          }
        }
      },
    });
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListApplicationFunction(
      "",
      "",
      "",
      "",
      "",
      "",
      page,
      numApplicationInPage
    );
  };
  const onFinishSearch = async (values) => {
    var status = "";
    if (typeof values.status === "undefined") {
      status = "";
    } else {
      status = values.status;
    }
    try {
      if (values.type === "name") {
        await getListApplicationFunction(
          values.searchString,
          "",
          "",
          "",
          "",
          status,
          1,
          numApplicationInPage
        );
      } else if (values.type === "partyEmail") {
        await getListApplicationFunction(
          "",
          "",
          values.searchString,
          "",
          "",
          status,
          1,
          numApplicationInPage
        );
      }
      setCurrentPage(1);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const onFinishAdvancedSearch = async (values) => {
    try {
      let name = "";
      let partyEmail = "";
      let status = values.status;
      if (typeof values.name === "undefined") {
        name = "";
      } else {
        name = values.name;
      }
      if (typeof values.partyEmail === "undefined") {
        partyEmail = "";
      } else {
        partyEmail = values.partyEmail;
      }
      await getListApplicationFunction(
        name,
        "",
        partyEmail,
        "",
        "",
        status,
        1,
        numApplicationInPage
      );
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsAdvancedSearchModalVisible(false);
      form.resetFields();
    }
  };

  const onFinishUpdateBanner = async (values) => {
    try {
      setIsLoadingBanner(true);
      let banner = "";
      let isChange = true;
      if (typeof values.banner === "undefined") {
        isChange = false;
        toast.error("Your img is not change");
      } else if (values.banner.fileList.length === 0) {
        banner = "";
      } else {
        banner = (await getBase64(values.banner.file.originFileObj)).split(
          ","
        )[1];
      }
      if (isChange) {
        const updateBanner = {
          serviceApplicationId: currentItem.id,
          banner: banner,
        };
        await updateBannerApplicationService(updateBanner);
        getListApplicationFunction(
          "",
          "",
          "",
          "",
          "",
          "",
          currentPage,
          numApplicationInPage
        );
        setIsEditApplicationModalVisible(false);
        toast.success(UPDATE_SUCCESS);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingBanner(false);
    }
  };

  const getCommissionPercentage = (id) => {
    let commission = -1;
    listCategories.map((e) => {
      if (e.id === id) {
        commission = e.commissionPercentage;
      }
    });
    setCommissionText(COMMISSION_FEE + commission + "%");
  };
  const types = [
    {
      name: "name",
      label: "Name",
    },
    {
      name: "partyEmail",
      label: "Owner's Email",
    },
  ];

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
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text) => (
        <p>
          <a href={text} target="_blank">
            <LinkOutlined />
            Click here
          </a>
        </p>
      ),
    },
    {
      title: "Installed Users ",
      dataIndex: "userInstalled",
      key: "userInstalled",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Is Affiliate",
      dataIndex: "isAffiliate",
      key: "isAffiliate",
      render: (text, record, dataIndex) =>
        record.isAffiliate === true ? (
          <Tag color="green">Yes</Tag>
        ) : (
          <Tag color="red">No</Tag>
        ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record, dataIndex) =>
        record.status === "available" ? (
          <Tag color="green">Approved</Tag>
        ) : record.status === "pending" ? (
          <Tag color="blue">Pending</Tag>
        ) : record.status === "unavailable" ? (
          <Tag color="red">Unavailable</Tag>
        ) : (
          <Tag color="red">Denied</Tag>
        ),
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
              navigator(`/app-detail/${record.id}`);
            }}
          >
            <EyeFilled /> Details
          </Button>
          {role === ROLE_ADMIN ? (
            record.status === "available" ? (
              <Button
                type="primary"
                danger
                shape="default"
                onClick={() => {
                  handleStopApplication(record);
                }}
              >
                <StopOutlined />
                Stop Application
              </Button>
            ) : (
              <Button
                type="primary"
                danger
                shape="default"
                onClick={() => {
                  handleStopApplication(record);
                }}
                disabled
              >
                <StopOutlined />
                Stop Application
              </Button>
            )
          ) : null}

          {role ? (
            role === ROLE_SERVICE_PROVIDER ? (
              <>
                {record.status === "unavailable" ? (
                  <>
                    <Button
                      className="warn-button"
                      shape="default"
                      onClick={() => {
                        setCurrentItem(record);
                        setIsCheck(record.isAffiliate);
                        setDescription(record.description);
                        showModalEditApplication();
                      }}
                    >
                      <EditFilled />
                      Update
                    </Button>
                    <Button
                      type="primary"
                      shape="default"
                      name={record}
                      onClick={() => {
                        handleChangeStatusApplication(record);
                      }}
                    >
                      <ArrowUpOutlined /> Publish
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="warn-button"
                      shape="default"
                      onClick={() => {
                        setCurrentItem(record);
                        setIsCheck(record.isAffiliate);
                        setDescription(record.description);
                        showModalEditApplication();
                      }}
                      disabled
                    >
                      <EditFilled />
                      Update
                    </Button>
                    <Button
                      type="primary"
                      shape="default"
                      disabled="false"
                      name={record}
                      onClick={() => {
                        handleChangeStatusApplication(record);
                      }}
                    >
                      <ArrowUpOutlined /> Publish
                    </Button>
                  </>
                )}
              </>
            ) : null
          ) : null}
          {role ? (
            role === ROLE_LOCATION_OWNER ? (
              <Button className="success-button">
                <DownloadOutlined /> Install
              </Button>
            ) : null
          ) : null}
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
            onFinish={onFinishSearch}
            initialValues={{
              type: "name",
              searchString: "",
            }}
          >
            <Row>
              <Col span={4}>
                <Form.Item name="type" style={{ marginTop: 5 }}>
                  <Select
                    defaultValue="name"
                    onChange={(e) => {
                      setApplicationSearchType(e);
                    }}
                  >
                    {partyId ? (
                      <>
                        <Option value={"name"}>{"Name"}</Option>;
                      </>
                    ) : (
                      <>
                        {types.map((item) => {
                          return (
                            <Option value={item.name}>{item.label}</Option>
                          );
                        })}
                      </>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="searchString" style={{ marginTop: 5 }}>
                  <Input placeholder="Please input" />

                  {/* <Input placeholder="Please input" /> */}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="status" style={{ marginTop: 5 }}>
                  <Select defaultValue="">
                    <Option value="">All status</Option>
                    <Option value="available">Approved</Option>
                    <Option value="unavailable">Denied</Option>
                  </Select>
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
                    <SearchOutlined />
                  </Button>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button
                  type="danger"
                  size={"large"}
                  onClick={showModalAdvancedSearch}
                >
                  <SearchOutlined />
                  Advanced
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={5} />
        {role ? (
          role === ROLE_SERVICE_PROVIDER ? (
            <Col span={4}>
              <Button
                className="success-button"
                size={"large"}
                onClick={showModalCreateApplication}
              >
                <PlusOutlined /> Application
              </Button>
            </Col>
          ) : null
        ) : null}
      </Row>
      {listApplication ? (
        listApplication.length === 0 ? (
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
              dataSource={listApplication}
              pagination={false}
            />
            <Pagination
              defaultCurrent={1}
              total={totalApplication}
              pageSize={5}
              current={currentPage}
              onChange={handleChangeNumberOfPaging}
            />
          </>
        )
      ) : (
        <Skeleton />
      )}
      <Modal
        title="Create Application"
        visible={isCreateApplicationModalVisible}
        onCancel={handleCancelCreateApplication}
        footer={null}
        width={1000}
      >
        <Form
          {...formItemLayout}
          style={{
            marginRight: 80,
          }}
          form={form}
          name="register"
          onFinish={onFinishCreateApplication}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: ERROR_INPUT_NAME,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" value={description}>
            <Editor
              style={{ height: "250px" }}
              onTextChange={(e) => {
                setDescription(e.htmlValue);
              }}
            />
          </Form.Item>
          <Form.Item
            name="link"
            label="Link"
            rules={[
              {
                required: true,
                message: ERROR_INPUT_LINK,
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
                message: ERROR_UPLOAD_LOGO_CATE,
              },
            ]}
          >
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture"
              maxCount={1}
              accept={ACCEPT_IMAGE}
              beforeUpload={beforeUpload}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
              {ImageLimitSizeTooltip()}
            </Upload>
          </Form.Item>
          <Form.Item
            name="appCategoryId"
            label="Category"
            rules={[
              {
                required: true,
                message: ERROR_SELECT_CATEGORY,
              },
            ]}
          >
            <Select
              placeholder="Select your categories"
              onChange={(value) => {
                getCommissionPercentage(value);
                setIsAffiliateVisible(true);
              }}
            >
              {listCategories.map((item) => {
                return <Option value={item.id}>{item.name}</Option>;
              })}
            </Select>
          </Form.Item>
          {isAffiliateVisible ? (
            <Form.Item name="isAffiliate" label="Is Affiliate">
              <Checkbox.Group style={{ width: "100%" }}>
                <Row>
                  <Checkbox value="isAffiliate"></Checkbox>
                  <>
                    <label
                      style={{
                        fontStyle: "italic",
                        fontSize: 16,
                        color: "red",
                        marginLeft: 20,
                      }}
                    >
                      {commissionText}
                    </label>
                    <Tooltip
                      title={
                        "Click to view all of commision and policy of affiliate"
                      }
                    >
                      <InfoCircleOutlined
                        style={{ color: "blue", marginLeft: 4, marginTop: 6 }}
                        onClick={() => {
                          window.open("../application-policy", "_blank");
                        }}
                      />
                    </Tooltip>
                  </>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          ) : null}

          <Form.Item name="banner" label="Banner">
            <Upload
              action={FILE_UPLOAD_URL}
              listType="picture"
              maxCount={1}
              accept={ACCEPT_IMAGE}
              beforeUpload={beforeUpload}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
              {ImageLimitSizeTooltip()}
            </Upload>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            {isLoading ? (
              <Spin />
            ) : (
              <Button type="primary" htmlType="submit">
                Create Application
              </Button>
            )}
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
          form={formAdvanceSearch}
          name="advancedSearch"
          onFinish={onFinishAdvancedSearch}
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
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          {partyId ? (
            <></>
          ) : (
            <Form.Item name="partyEmail" label="Owner's Email">
              <Input />
            </Form.Item>
          )}

          <Form.Item name="status" label="Status">
            <Select defaultValue="">
              <Option value="">All status</Option>
              <Option value="available">Available</Option>
              <Option value="unavailable">Unavailable</Option>
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
          visible={isEditApplicationModalVisible}
          onCancel={handleCancelEditApplication}
          footer={null}
          width={1000}
        >
          <Card title="Basic information">
            <Form
              style={{
                marginRight: 80,
              }}
              key={currentItem.id}
              {...formItemLayout}
              form={form}
              name="edit"
              onFinish={onFinishUpdateApplication}
              scrollToFirstError
              initialValues={{
                id: currentItem.id,
                name: currentItem.name,
                description: currentItem.description ?? "",
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
                    message: ERROR_INPUT_NAME,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                value={description}
              >
                <Editor
                  style={{ height: "250px" }}
                  onTextChange={(e) => {
                    setDescription(e.htmlValue);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="link"
                label="Link"
                rules={[
                  {
                    required: true,
                    message: ERROR_INPUT_LINK,
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
                    message: ERROR_UPLOAD_LOGO_CATE,
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
                  {ImageLimitSizeTooltip()}
                </Upload>
              </Form.Item>
              <Form.Item
                name="appCategoryId"
                label="Category"
                rules={[
                  {
                    required: true,
                    message: ERROR_SELECT_CATEGORY,
                  },
                ]}
              >
                <Select
                  placeholder="Select your categories"
                  onChange={(value) => getCommissionPercentage(value)}
                >
                  {listCategories
                    ? listCategories.map((item) => {
                        return <Option value={item.id}>{item.name} </Option>;
                      })
                    : null}
                </Select>
              </Form.Item>
              <Form.Item name="isAffiliate" label="Is Affiliate">
                {currentItem.isAffiliate ? (
                  <Checkbox
                    defaultChecked
                    value="isAffiliate"
                    onChange={() => {
                      if (isCheck) {
                        setIsCheck(false);
                      } else {
                        setIsCheck(true);
                      }
                    }}
                  />
                ) : (
                  <Checkbox
                    defaultChecked={false}
                    value="isAffiliate"
                    onChange={() => {
                      if (isCheck) {
                        setIsCheck(false);
                      } else {
                        setIsCheck(true);
                      }
                    }}
                  />
                )}
              </Form.Item>
              <span
                style={{ fontStyle: "italic", fontSize: 12, color: "#202124" }}
              >
                {commissionText}
              </span>
              <Form.Item {...tailFormItemLayout}>
                {isLoading ? (
                  <Spin />
                ) : (
                  <Button type="primary" htmlType="submit">
                    Update Application
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Card>
          <Card title="Banner">
            <Form
              {...formItemLayout}
              form={formUploadBanner}
              name="banner"
              onFinish={onFinishUpdateBanner}
              scrollToFirstError
            >
              <Form.Item name="banner" label="Banner">
                {currentItem.banner ? (
                  <Upload
                    action={FILE_UPLOAD_URL}
                    listType="picture"
                    maxCount={1}
                    accept={ACCEPT_IMAGE}
                    beforeUpload={beforeUpload}
                    defaultFileList={[
                      {
                        uid: "abc",
                        name: "thumbnail",
                        status: "done",
                        url: currentItem.banner,
                      },
                    ]}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                    {ImageLimitSizeTooltip()}
                  </Upload>
                ) : (
                  <Upload
                    action={FILE_UPLOAD_URL}
                    listType="picture"
                    maxCount={1}
                    accept={ACCEPT_IMAGE}
                    beforeUpload={beforeUpload}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                    {ImageLimitSizeTooltip()}
                  </Upload>
                )}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                {isLoadingBanner === false ? (
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                ) : (
                  <Spin />
                )}
              </Form.Item>
            </Form>
          </Card>
        </Modal>
      ) : null}
    </>
  );
};
export default ApplicationTable;
