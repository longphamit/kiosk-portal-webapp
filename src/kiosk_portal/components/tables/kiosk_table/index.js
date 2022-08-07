import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Rate,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import { ArrowDownOutlined, EditFilled, EyeFilled, SwapOutlined, SyncOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { downloadTxtFile } from "../../../../@app/utils/file_util";
import {
  createKioskService,
  getListKioskService,
  changeStatusKioskService,
  updateKioskService,
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
import ModalAddLocation from "../../../pages/kiosk/modalAddLocation";
import { getListKioskLocationService } from "../../../services/kiosk_location_service";
import { async } from "@firebase/util";
import { PREVIOUS_PATH } from "../../../../@app/constants/key";
import {
  KIOSK_MANAGER_HREF,
  KIOSK_MANAGER_LABEL,
} from "../../breadcumb/breadcumb_constant";
import ModalChangeNameKiosk from "../../../pages/kiosk/modalChangeNameKiosk";

const searchTypeKiosk = [
  {
    name: "Name",
    label: "Name",
  },
];
const { Option } = Select;
const KioskTable = ({ partyId }) => {
  const navigator = useNavigate();
  const [listKiosk, setListKiosk] = useState();
  const [kioskTotal, setKioskTotal] = useState(0);
  const [kioskPage, setKioskPage] = useState(0);
  const [kioskPageSize, setKioskPageSize] = useState(5);
  const [kioskLocations, setKioskLocations] = useState();
  const [currentKiosk, setCurrentKiosk] = useState();
  const [isCreateKioskModalVisible, setIsCreateKioskModalVisible] =
    useState(false);
  const { t } = useTranslation();
  const [searchKioskForm, createKioskForm] = Form.useForm();
  const [isModalAddLocationVisible, setIsModalAddLocationVisible] =
    useState(false);
    const [isModalChangeNameKioskVisible, setIsModalChangeNameKioskVisible] =
    useState(false);
  const role = localStorageGetReduxState().auth.role;
  const [isLoading, setIsLoading] = useState(false);

  const [listLocation, setListLocation] = useState([]);
  const breadCumbData = [
    {
      href: KIOSK_MANAGER_HREF,
      label: KIOSK_MANAGER_LABEL,
      icon: null,
    },
  ];
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
  ];

  const changeStatus = async (values) => {
    Modal.confirm({
      title: "Are you sure to change status this kiosk",
      okText: t("yes"),
      cancelText: t("no"),
      onOk: async () => {
        {
          setIsLoading(true);
          try {
            await changeStatusKioskService(values.id);
            await getListKiosk(partyId, kioskPage, kioskPageSize);
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }
      },
    });
  };
  let navigate = useNavigate();
  const onNavigate = (url) => {
    navigate(url);
  };

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
      title: "Kiosk Location Name",
      dataIndex: "kioskLocationName",
      key: "kioskLocationName",
      render: (text, record, dataIndex) =>
        text ? (
          <Tag
            color={"green"}
            onClick={() => {
              localStorage.setItem(
                PREVIOUS_PATH,
                JSON.stringify({ data: breadCumbData })
              );

              onNavigate({
                pathname: "/./location",
                search: "?id=" + record.kioskLocationId,
              });
            }}
          >
            {text}
          </Tag>
        ) : (
          <Tag color={"red"}>Null</Tag>
        ),
    },
    {
      title: "Rating ",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (text, record, dataIndex) => (
        <>
          <p style={{ display: "inline", fontWeight: 500, fontSize: 30 }}>
            {parseFloat(record.averageRating).toFixed(1)}/5.0
          </p>{" "}
          /{record.numberOfRating} turns
        </>
      ),
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
      key: "action",
      title: t("action"),
      align: "center",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button className="infor-button" onClick={() => navigator(`/kiosk/${record.id}`)}>
            <EyeFilled/>Details
          </Button>
          {record.kioskLocationId ? (
            <Button
              className="warn-button"
              onClick={() => {
                setCurrentKiosk(record);
                showModal("addLocation");
              }}
            >
             <EditFilled/> Update Location
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setCurrentKiosk(record);
                showModal("addLocation");
              }}
            >
              Add Location
            </Button>
          )}
          {isLoading ? (
            <Spin />
          ) : record.status === "activate" ? (
            <Button
              className="change-status-button"
              shape="default"
              onClick={() => {
                changeStatus(record);
              }}
            >
              <SyncOutlined />
              Change Status
            </Button>
          ) : (
            <Button
              className="infor-button"
              shape="default"
              onClick={() => {
                changeStatus(record);
              }}
              disabled
            >
              <SyncOutlined />
              Change Status
            </Button>
          )}
          <Button className="infor-button"  onClick={() => {
                setCurrentKiosk(record);
                showModal("changeNameKiosk");
              }}>
          <SwapOutlined />Change Name
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
    try {
      const { data } = await getListKioskService(
        partyId,
        kioskPage,
        kioskPageSize
      );
      setListKiosk(data.data);
      setKioskPage(data.metadata.page);
      setKioskTotal(data.metadata.total);
      setKioskPageSize(data.metadata.size);
    } catch (e) {
      console.error(e);
      setListKiosk([]);
    }
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
      console.error(e);
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

  const handleCancelModal = (type) => {
    console.log(type);
    if(type==="addLocation"){
      setIsModalAddLocationVisible(false);
    } else if (type === "changeNameKiosk"){
      setIsModalChangeNameKioskVisible(false)
    }
    
  };

  const showModal = async (type) => {
    console.log(type)
    if (type === "addLocation") {
      setIsModalAddLocationVisible(true);
      const res = await getListKioskLocationService("", 1, -1);
      setListLocation(res.data.data);
    } else if (type==="changeNameKiosk" ){
      setIsModalChangeNameKioskVisible(true)
    }

  };

  const onFinishModal = (type) => {
    if (type === "addLocation") {
      setIsModalAddLocationVisible(false);
    } else if( type === "changeNameKiosk"){
      setIsModalChangeNameKioskVisible(false);
    }
    getListKiosk(partyId, kioskPage, kioskPageSize);
  };

  useEffect(() => {
    localStorage.setItem(
      PREVIOUS_PATH,
      JSON.stringify({ data: breadCumbData })
    );
    getListKiosk(partyId, kioskPage, kioskPageSize);
  }, []);
  return (
    <>
      <ModalAddLocation
        isModalAddLocationVisible={isModalAddLocationVisible}
        handleCancelModal={handleCancelModal}
        listLocation={listLocation}
        currentKiosk={currentKiosk}
        onFinishModal={onFinishModal}
      />
      <ModalChangeNameKiosk
        isModalChangeNameKioskVisible={isModalChangeNameKioskVisible}
        handleCancelModal={handleCancelModal}
        currentKiosk={currentKiosk}
        onFinishModal={onFinishModal}
      />
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
        {listKiosk ? (
          <>
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
          </>
        ) : (
          <Skeleton />
        )}
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
