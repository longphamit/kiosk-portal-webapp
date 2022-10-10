import {
  Button,
  Col,
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
} from "antd";
import { StopFilled, EditFilled, EyeFilled, SwapOutlined, ExclamationCircleOutlined, StarOutlined, StarFilled, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  createKioskService,
  getListKioskService,
  changeStatusKioskService,
} from "../../../services/kiosk_service";
import {
  localStorageGetReduxState,
} from "../../../../@app/services/localstorage_service";
import { ROLE_ADMIN, ROLE_LOCATION_OWNER } from "../../../../@app/constants/role";
import { useNavigate } from "react-router-dom";
import ModalAddLocation from "../../../pages/kiosk/modalAddLocation";
import { getListKioskLocationService } from "../../../services/kiosk_location_service";
import { PREVIOUS_PATH } from "../../../../@app/constants/key";
import {
  KIOSK_MANAGER_HREF,
  KIOSK_MANAGER_LABEL,
} from "../../breadcumb/breadcumb_constant";
import ModalChangeNameKiosk from "../../../pages/kiosk/modalChangeNameKiosk";
import { CREATE_SUCCESS } from "../../../../@app/constants/message";

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
  const [currentKiosk, setCurrentKiosk] = useState();
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
          <Tag color={"green"}>Working</Tag>
        ) : (
          <Tag color={"red"}>Stopped</Tag>
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
            await getListKiosk("",partyId,"","","","",kioskPageSize, kioskPage);
            toast.success("Stop kiosk success")
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
          <Tag color={"red"}>Unknow</Tag>
        ),
    },
    {
      title: "Rating ",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (text, record, dataIndex) => (
        <>
          {parseFloat(record.averageRating).toFixed(1)}<StarFilled style={{ color: 'orange', marginRight: 7, marginLeft: 1 }} />
          ({record.numberOfRating} reviews)
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
          <Tag color={"green"}>Working</Tag>
        ) : (
          <Tag color={"red"}>Stopped</Tag>
        ),
    },
    {
      key: "action",
      title: t("action"),
      align: "center",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="infor-button"
            onClick={() => navigator(`/kiosk/${record.id}`)}
          >
            <EyeFilled />
            Details
          </Button>
          <Button
            className="warn-button"
            onClick={() => {
              setCurrentKiosk(record);
              showModal("addLocation");
            }}
          >
            <EditFilled /> Update Location
          </Button>
          {isLoading ? (
            <Spin />
          ) : record.status === "activate" ? (
            <Button
              className="danger-button"
              shape="default"
              onClick={() => {
                changeStatus(record);
              }}
            >
              <StopFilled />
              Stop
            </Button>
          ) : (
            <Button
              shape="default"
              onClick={() => {
                changeStatus(record);
              }}
              disabled
            >
              <StopFilled />
              Stop
            </Button>
          )}
          <Button className="infor-button" onClick={() => {
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
    await getListKiosk("",partyId,"","","","", kioskPageSize, page);
  };
  const getListKiosk = async (  Name,
    partyId,
    KioskLocationName,
    Status,
    Longtitude,
    Latitude,
    size,
    page) => {
    try {
      const { data } = await getListKioskService(
        Name,
        partyId,
    KioskLocationName,
    Status,
    Longtitude,
    Latitude,
    size,
    page
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
  const onCreateKiosk = async () => {
    try {
      const res = await createKioskService({
        name: "kiosk" + "-" + (kioskTotal + 1),
        partyId: partyId,
      });
      getListKiosk("",partyId,"","","","",kioskPageSize, kioskPage );
      toast.success(CREATE_SUCCESS);
      createKioskForm.resetFields();
    } catch (e) {
      console.error(e);
    }
  };
  const onFinishSearchKiosk = (values) => { 
    if(values.type==="Name"){
      getListKiosk(values.searchString,partyId,"","","","",kioskPageSize, 1 );
    }
    
  };
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
    if (type === "addLocation") {
      setIsModalAddLocationVisible(false);
    } else if (type === "changeNameKiosk") {
      setIsModalChangeNameKioskVisible(false)
    }

  };

  const showModal = async (type) => {
    if (type === "addLocation") {
      setIsModalAddLocationVisible(true);
      const res = await getListKioskLocationService("", 1, -1);
      setListLocation(res.data.data);
    } else if (type === "changeNameKiosk") {
      setIsModalChangeNameKioskVisible(true)
    }

  };

  const onFinishModal = (type) => {
    if (type === "addLocation") {
      setIsModalAddLocationVisible(false);
    } else if (type === "changeNameKiosk") {
      setIsModalChangeNameKioskVisible(false);
    }
    getListKiosk("",partyId,"","","","",kioskPageSize, kioskPage );
  };

  useEffect(() => {
    localStorage.setItem(
      PREVIOUS_PATH,
      JSON.stringify({ data: breadCumbData })
    );
    getListKiosk("",partyId,"","","","",kioskPageSize, kioskPage );
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
                      <SearchOutlined />
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
                    Modal.confirm({
                      title: 'Confirm',
                      icon: <ExclamationCircleOutlined />,
                      content: 'Are you sure to create new Kiosk ?',
                      okText: 'Confirm',
                      cancelText: 'Cancel',
                      onOk: async () => onCreateKiosk()
                    });
                  }}
                >
                  <PlusOutlined /> Kiosk
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

    </>
  );
};
export default KioskTable;
