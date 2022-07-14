import {
  Button,
  Col,
  Collapse,
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
  createKioskService,
  getListKioskService,
  changeStatusKioskService,
} from "../../../services/kiosk_service";
import {
  formItemLayout,
  tailFormItemLayout,
} from "../../../layouts/form_layout";
import {
  localStorageGetReduxState,
  localStorageSaveReduxState,
} from "../../../../@app/services/localstorage_service";
import { ROLE_ADMIN } from "../../../../@app/constants/role";
import { useNavigate } from "react-router-dom";

const searchTypeKiosk = [
  {
    name: "Name",
    label: "Name",
  },
];
const { Option } = Select;
const KioskTable = ({ partyId }) => {
  const navigator = useNavigate();
  const [listKiosk, setListKiosk] = useState([]);
  const [kioskTotal, setKioskTotal] = useState(0);
  const [kioskPage, setKioskPage] = useState(0);
  const [kioskPageSize, setKioskPageSize] = useState(5);
  const [kioskLocations, setKioskLocations] = useState();
  const [currentKiosk, setCurrentKiosk] = useState();
  const [isCreateKioskModalVisible, setIsCreateKioskModalVisible] =
    useState(false);
  const { t } = useTranslation();
  const [searchKioskForm, createKioskForm] = Form.useForm();
  const role = localStorageGetReduxState().auth.role;
  const onConfirmChangeStatus = async (kioskId) => {
    try {
      await changeStatusKioskService(kioskId);
      await getListKiosk(partyId, kioskPage, kioskPageSize);
      toast.success("Change status kiosk success");
    } catch (e) {
      console.log(e);
    }
  };
  const kioskColumnAdmin = [
    {
      title: "No",
      key: "index",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: t("id"),
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: t("status"),
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (text, record, dataIndex) =>
        record.status === "activate" ? (
          <Tag color={"green"}>{t("active")}</Tag>
        ) : (
          <Tag color={"red"}>{t("deactivate")}</Tag>
        ),
    },
    {
      title: t("action"),
      key: "action",
      align: "center",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="success-button"
            onClick={() => {
              downloadTxtFile(partyId + "-" + record.name, record.id);
            }}
          >
            <ArrowDownOutlined /> Key
          </Button>
        </Space>
      ),
    },
  ];
  const kioskColumnLocationOwner = [
    {
      title: "No",
      key: "index",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: t("status"),
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (text, record, dataIndex) =>
        record.status === "activate" ? (
          <Tag color={"green"}>Activate</Tag>
        ) : (
          <Tag color={"red"}>Deactivate</Tag>
        ),
    },
    {
      title: t("action"),
      align: "center",
      key: "action",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button className="warn-button" shape="default" onClick={() => { }}>
            {t("edit")}
          </Button>
          <Button className="infor-button" shape="default" onClick={() => {}}>
            Detail
          </Button>
          <Popconfirm
            title="Are you sure, you want to change status this kiosk?"
            onConfirm={() => onConfirmChangeStatus(record.id)}
            onVisibleChange={() => console.log("visible change")}
          >
            <Button
              type="primary"
              shape="default"
              name={record}
              onClick={() => { }}
            >
              {t("change-status")}
            </Button>
          </Popconfirm>
          <Button className="primary" onClick={() => navigator(`/kiosk-scheduling/${record.id}`)}>
            Scheduling
          </Button>
          <Button
            className="success-button"
            onClick={() => {
              downloadTxtFile(partyId + "-" + record.name, record.id);
            }}
          >
            <ArrowDownOutlined /> Key
          </Button>
        </Space>
      ),
    },
  ];

  const handlePaginationKioskTable = async (page, pageSize) => {
    setKioskPage(page);
    await getListKiosk(partyId, page, kioskPageSize);
  };
  const getListKiosk = async (partyId, kioskPage, kioskPageSize) => {
    const { data } = await getListKioskService(
      partyId,
      kioskPage,
      kioskPageSize
    );
    console.log(data)
    setListKiosk(data.data);
    setKioskPage(data.metadata.page);
    setKioskTotal(data.metadata.total);
    setKioskPageSize(data.metadata.size);
  };
  const onCreateKiosk = async (values) => {
    try {
      const res = await createKioskService({
        name: values.name,
        partyId: partyId,
      });
      getListKiosk(partyId, kioskPage, kioskPageSize);
      toast.success("Create Kiosk Success");
      setIsCreateKioskModalVisible(false);
      createKioskForm.resetFields();
    } catch (e) {
      console.log(e);
    }
  };
  const onFinishSearchKiosk = () => { };
  const prefixSearchKiosk = (
    <Form.Item name="type" noStyle>
      <Select defaultValue="Name">
        {searchTypeKiosk.map((item) => {
          return <Option value={item.name}>{item.label}</Option>;
        })}
      </Select>
    </Form.Item>
  );

  useEffect(() => {
    getListKiosk(partyId, kioskPage, kioskPageSize);
  }, []);
  return (
    <>
      <div>
        <Row style={{ padding: 10 }}>
          <Col span={15}>
            <Form
              form={searchKioskForm}
              name="search"
              onFinish={onFinishSearchKiosk}
              initialValues={{
                type: "Name",
                searchString: "",
              }}
            >
              <Row>
                <Col span={14}>
                  <Form.Item name="searchString" style={{ marginTop: 5 }}>
                    <Input
                      addonBefore={prefixSearchKiosk}
                      style={{ width: "100%" }}
                      placeholder="Search..."
                      value=""
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
              </Row>
            </Form>
          </Col>
          <Col span={5} />
          {role ? (
            role === ROLE_ADMIN ? (
              <Col span={4}>
                <Button
                  className="success-button"
                  size={"large"}
                  onClick={() => {
                    setIsCreateKioskModalVisible(true);
                  }}
                >
                  {t("createkiosk")}
                </Button>
              </Col>
            ) : null
          ) : null}
        </Row>
        <Col span={24}>
          {role ? (
            role === ROLE_ADMIN ? (
              <Table
                columns={kioskColumnAdmin}
                dataSource={listKiosk}
                pagination={false}
              />
            ) : (
              <Table
                columns={kioskColumnLocationOwner}
                dataSource={listKiosk}
                pagination={false}
              />
            )
          ) : null}
        </Col>
        <Pagination
          defaultCurrent={kioskPage}
          total={kioskTotal}
          pageSize={kioskPageSize}
          onChange={handlePaginationKioskTable}
        />
      </div>

      <Modal
        key={kioskTotal}
        title={t("createkiosk")}
        visible={isCreateKioskModalVisible}
        onCancel={() => {
          setIsCreateKioskModalVisible(false);
        }}
        footer={null}
      >
        <Form
          key={kioskTotal}
          {...formItemLayout}
          form={createKioskForm}
          name="CreateKiosk"
          onFinish={onCreateKiosk}
          initialValues={{ name: "kiosk" + "-" + (kioskTotal + 1) }}
          scrollToFirstError
        >
          <Form.Item name="name" label={t("name")}>
            <Input disabled />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default KioskTable;
