import {
  Button,
  Col,
  Collapse,
  Descriptions,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { downloadTxtFile } from "../../../../@app/utils/file_util";

import {
  formItemLayout,
  tailFormItemLayout,
} from "../../../layouts/form_layout";
import {
  localStorageGetReduxState,
  localStorageSaveReduxState,
} from "../../../../@app/services/localstorage_service";
import {
  ROLE_ADMIN,
  ROLE_SERVICE_PROVIDER,
} from "../../../../@app/constants/role";
import {
  getListAppPublishRequestSearchService,
  getListAppPublishRequestService,
} from "../../../services/app_publish_request_service";
import {
  PUBLISH_APPROVED,
  PUBLISH_DENIED,
  PUBLISH_IN_PROGRESS,
} from "../../../constants/app_publish_request_status_constant";
import { useNavigate } from "react-router-dom";

const searchTypeKiosk = [
  {
    name: "Name",
    label: "Name",
  },
];
const { Option } = Select;
const AppPublishRequestTable = ({ partyId }) => {
  const { t } = useTranslation();
  const [searchAppPublishFrom] = Form.useForm();
  const [appPublishRequestPage, setAppPublishRequestPage] = useState(1);
  const [appPublishRequestTotal, setAppPublishRequestTotal] = useState(0);
  const [appPublishRequestPageSize, setAppPublishRequestPageSize] = useState(5);
  const [listAppPublishRequest, setListListAppPublishRequest] = useState([]);
  const [appPublishRequestSelected, setAppPublishRequestSelected] = useState();
  const [appPublishRequestSearchType, setAppPublishRequestSearchType] =
    useState("CreatorEmail");
  const [
    isPublishRequestDetailModalVisible,
    setPublishRequestDetailModalVisible,
  ] = useState();
  const navigator = useNavigate();
  const AdminApplicationPublishRequestColumn = [
    {
      title: "No",
      key: "index",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "Creator Email",
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
          <Tag color={"blue"}>IN PROGRESS</Tag>
        ) : record.status === PUBLISH_DENIED ? (
          <Tag color={"red"}>DENIED</Tag>
        ) : (
          <></>
        ),
    },
    {
      title: t("action"),
      key: "action",
      
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="infor-button"
            onClick={() => {
              navigator(`/app-detail/${record.serviceApplicationId}`);
            }}
          >
            App
          </Button>
          {record.status === PUBLISH_DENIED ? (
            <Button
              className="infor-button"
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
        </Space>
      ),
    },
  ];
  const searchTypeAppPublishRequest = [
    {
      name: "CreatorEmail",
      label: "Creator Email",
    },
    {
      name: "HandlerName",
      label: "Handler Name",
    },
    {
      name: "ServiceApplicationName",
      label: "App Name",
    },
  ];
  const prefixSearchAppPublishRequest = (
    <Form.Item name="type" noStyle>
      <Select
        defaultValue="CreatorEmail"
        onChange={(e) => setAppPublishRequestSearchType(e)}
      >
        {searchTypeAppPublishRequest.map((item) => {
          return <Option value={item.name}>{item.label}</Option>;
        })}
      </Select>
    </Form.Item>
  );
  const getListAppPublishRequest = async (
    appPublishRequestPage,
    appPublishRequestPageSize
  ) => {
    const res = await getListAppPublishRequestService(
      appPublishRequestPage,
      appPublishRequestPageSize
    );
    console.log(res);
    setAppPublishRequestTotal(res.data.metadata.total);
    setListListAppPublishRequest(res.data.data);
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
      const res = await getListAppPublishRequestSearchService(
        appPublishRequestPage,
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
                type: "CreatorEmail",
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
                      Search
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={5} />
        </Row>
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
          onChange={handlePaginationAppPublishRequest}
        />
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
