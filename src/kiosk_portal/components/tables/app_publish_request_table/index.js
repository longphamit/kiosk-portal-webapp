import {
  Button,
  Col,
  Descriptions,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import {
  SearchOutlined,
  EyeFilled,
  StopOutlined
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  cancelPublishRequestService,
  getListAppPublishRequestSearchService,
  getListAppPublishRequestService,
} from "../../../services/app_publish_request_service";
import {
  PUBLISH_APPROVED,
  PUBLISH_CANCEL,
  PUBLISH_DENIED,
  PUBLISH_IN_PROGRESS,
} from "../../../constants/app_publish_request_status_constant";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROLE_ADMIN, ROLE_SERVICE_PROVIDER } from "../../../../@app/constants/role";
import { localStorageGetReduxState } from "../../../../@app/services/localstorage_service";

const searchTypeKiosk = [
  {
    name: "Name",
    label: "Name",
  },
];
const { Option } = Select;
const AppPublishRequestTable = ({ partyId }) => {
  const role = localStorageGetReduxState().auth.role;
  const { t } = useTranslation();
  const [searchAppPublishFrom] = Form.useForm();
  const [appPublishRequestPage, setAppPublishRequestPage] = useState(1);
  const [appPublishRequestTotal, setAppPublishRequestTotal] = useState(0);
  const [appPublishRequestPageSize, setAppPublishRequestPageSize] = useState(5);
  const [listAppPublishRequest, setListListAppPublishRequest] = useState();
  const [appPublishRequestSelected, setAppPublishRequestSelected] = useState();
  const [appPublishRequestSearchType, setAppPublishRequestSearchType] =
    useState("CreatorEmail");
  const [
    isPublishRequestDetailModalVisible,
    setPublishRequestDetailModalVisible,
  ] = useState();
  const navigator = useNavigate();
  const onFinishCancel = (record) => {
    Modal.confirm({
      title: "Are you sure to cancel request publish of this application",
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          try {
            await cancelPublishRequestService(JSON.stringify(record.id))
            await getListAppPublishRequest(appPublishRequestPage, appPublishRequestPageSize);
            toast.success("Cancel request success")
          } catch (error) {
            toast.error(error.response.data.message);
          }
        }
      },
    });
  }
  const AdminApplicationPublishRequestColumn = [
    {
      title: "No",
      key: "index",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "Requester",
      dataIndex: "creatorEmail",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "App Name",
      dataIndex: "serviceApplicationName",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Handler",
      dataIndex: "handlerName",
      key: "id",
      render: (text) => <a>{text}</a>,
    },

    {
      title: t("status"),
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (text, record, dataIndex) =>
        record.status === PUBLISH_APPROVED ? (
          <Tag color={"green"}>Approved</Tag>
        ) : record.status === PUBLISH_IN_PROGRESS ? (
          <Tag color={"blue"}>Pending</Tag>
        ) : record.status === PUBLISH_DENIED ? (
          <Tag color={"red"}>Denied</Tag>
        ) : record.status === PUBLISH_CANCEL ? (
          <Tag color={"grey"}>Cancelled</Tag>
        ) :
          (
            <></>
          ),
    },
    {
      title: t("action"),
      key: "action",

      render: (text, record, dataIndex) => (
        <Space size="middle">

          {
            ((record.status !== PUBLISH_CANCEL && role === ROLE_ADMIN) || role === ROLE_SERVICE_PROVIDER) ?
              <Button
                className="infor-button"
                onClick={() => {
                  navigator(`/app-detail/${record.serviceApplicationId}`);
                }}
              >
                <EyeFilled /> Details
              </Button> : null
          }


          {(record.status === PUBLISH_DENIED && role === ROLE_SERVICE_PROVIDER) ? (
            <Button
              className="warn-button"
              onClick={() => {
                setAppPublishRequestSelected(record);
                setPublishRequestDetailModalVisible(true);
              }}
            >
              View Response
            </Button>
          ) : (
            <></>
          )}
          {
            (record.status === PUBLISH_IN_PROGRESS && role === ROLE_SERVICE_PROVIDER) ? (
              <Button
                className="danger-button"
                onClick={() => {
                  onFinishCancel(record);
                }}
              >
                <StopOutlined /> Cancel Request
              </Button>
            ) : null
          }

        </Space>
      ),
    },
  ];
  const searchTypeAppPublishRequest = [
    {
      name: "ServiceApplicationName",
      label: "App Name",
    }, {
      name: "CreatorEmail",
      label: "Creator Email",
    },
    {
      name: "HandlerName",
      label: "Handler Name",
    },
  ];
  const searchTypeAppPublishRequestForSP = [
    {
      name: "ServiceApplicationName",
      label: "App Name",
    },
    {
      name: "HandlerName",
      label: "Handler Name",
    },
  ];
  const prefixSearchAppPublishRequest = (
    <Form.Item name="type" noStyle>
      <Select
        defaultValue="ServiceApplicationName"
        onChange={(e) => setAppPublishRequestSearchType(e)}
      >
        {role === ROLE_SERVICE_PROVIDER ?
          <>
           {searchTypeAppPublishRequestForSP.map((item) => {
              return <Option value={item.name}>{item.label}</Option>;
            })}
          </> : <>
            {searchTypeAppPublishRequest.map((item) => {
              return <Option value={item.name}>{item.label}</Option>;
            })}
          </>
        }
      </Select>
    </Form.Item>
  );
  const getListAppPublishRequest = async (
    appPublishRequestPage,
    appPublishRequestPageSize
  ) => {
    try {
      const res = await getListAppPublishRequestService(
        appPublishRequestPage,
        appPublishRequestPageSize
      );
      setAppPublishRequestTotal(res.data.metadata.total);
      setListListAppPublishRequest(res.data.data);
    } catch (e) {
      console.error(e);
      setListListAppPublishRequest([])
    }
  };
  const handlePaginationAppPublishRequest = async (page, pageSize) => {
    setAppPublishRequestPage(page);
    await getListAppPublishRequest(page, appPublishRequestPageSize);
  };
  const onFinishSearchAppPublishRequest = async ({
    type,
    searchString,
    status,
  }) => {
    let searchParam = {
      status: status,
    };
    searchParam[`${type}`] = searchString;
    try {
      setAppPublishRequestPage(1)
      const res = await getListAppPublishRequestSearchService(
        1,
        appPublishRequestPageSize,
        searchParam
      );
      setAppPublishRequestTotal(res.data.metadata.total);
      setListListAppPublishRequest(res.data.data);
    } catch (e) {
      setListListAppPublishRequest([]);
    }
  };

  useEffect(() => {
    getListAppPublishRequest(appPublishRequestPage, appPublishRequestPageSize);
  }, []);
  return (
    <>
      <div>
        <Row style={{ padding: 10 }}>
          <Col span={15}>
            <Form
              form={searchAppPublishFrom}
              name="search"
              onFinish={onFinishSearchAppPublishRequest}
              initialValues={{
                type: "ServiceApplicationName",
                searchString: "",
              }}
            >
              <Row>
                <Col span={10}>
                  <Form.Item name="searchString" style={{ marginTop: 5 }}>
                    <Input
                      addonBefore={prefixSearchAppPublishRequest}
                      style={{ width: "100%" }}
                      placeholder="Search..."
                      value=""
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    initialValue=""
                    name="status"
                    label={t("status")}
                    style={{ marginTop: 5, marginLeft: 10 }}
                  >
                    <Select>
                      <Option value="">All</Option>
                      <Option value={PUBLISH_IN_PROGRESS}>In Progress</Option>
                      <Option value={PUBLISH_APPROVED}>Approved</Option>
                      <Option value={PUBLISH_DENIED}>Denied</Option>
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
              </Row>
            </Form>
          </Col>
          <Col span={5} />
        </Row>
        {listAppPublishRequest ?
          listAppPublishRequest.length === 0 ?
            <>
              <Row justify='center' align='center' style={{ marginTop: 250 }}>
                <Col>
                  <Empty />
                </Col>
              </Row>
            </> :
            <>
              <Col span={24}>
                <Table
                  columns={AdminApplicationPublishRequestColumn}
                  dataSource={listAppPublishRequest}
                  pagination={false}
                />
              </Col>
              <Pagination
                defaultCurrent={appPublishRequestPage}
                total={appPublishRequestTotal}
                pageSize={appPublishRequestPageSize}
                current={appPublishRequestPage}
                onChange={handlePaginationAppPublishRequest}
              />
            </> : <Skeleton />
        }
      </div>
      {appPublishRequestSelected ? (
        <Modal
          key={appPublishRequestSelected.id}
          visible={isPublishRequestDetailModalVisible}
          title="Result"
          onCancel={() => {
            setPublishRequestDetailModalVisible(false);
          }}
          footer={[]}
        >
          <div style={{ width: "100%" }}>
            <Descriptions column={2}>
              <Descriptions.Item label="Email">
                {appPublishRequestSelected.handlerEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {appPublishRequestSelected.handlerName}
              </Descriptions.Item>
              <Descriptions.Item label="Response">
                {appPublishRequestSelected.handlerComment}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
export default AppPublishRequestTable;
