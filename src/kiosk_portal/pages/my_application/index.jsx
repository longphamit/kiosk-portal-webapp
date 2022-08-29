import {
  Button,
  Col,
  Empty,
  Modal,
  Pagination,
  Row,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { EyeFilled, CloseCircleFilled, LinkOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MY_APPLICATION_HREF,
  MY_APPLICATION_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import { useNavigate } from "react-router-dom";
import {
  changeStatusMyAppService,
  getListMyAppService,
} from "../../services/party_service_application";
import { toast } from "react-toastify";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { PREVIOUS_PATH } from "../../../@app/constants/key";

const MyApplicationPage = () => {
  const navigator = useNavigate();
  const { t } = useTranslation();
  const [listMyApplication, setListMyApplication] = useState([]);
  const [totalMyApplication, setTotalMyApplication] = useState(0);
  const [numApplicationInPage, setNumApplicationInPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const getListMyAppFunction = async (currentPageToGetList, numInPage) => {
    try {
      const res = await getListMyAppService(
        "",
        "",
        numInPage,
        currentPageToGetList
      );
      setTotalMyApplication(res.data.metadata.total);
      setListMyApplication(res.data.data);
    } catch (error) {
      console.error(error);
      setListMyApplication([]);
    }
  };

  const onUninstallApplication = (values) => {
    Modal.confirm({
      title: "Confirm Uninstall this application",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        {
          try {
            await changeStatusMyAppService(values.serviceApplicationId);
            await getListMyAppFunction(1, numApplicationInPage);
            toast.success("Uninstall successful");
          } catch (error) {
            toast.error(error.response.data.message);
          }
        }
      },
    });
  };

  useEffect(async () => {
    getListMyAppFunction(currentPage, numApplicationInPage);
    localStorage.setItem(
      PREVIOUS_PATH,
      JSON.stringify({ data: breadCumbData })
    );
  }, []);

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListMyAppFunction(page, numApplicationInPage);
  };
  const columns = [
    {
      title: "Logo",
      dataIndex: "serviceApplicationLogo",
      key: "serviceApplicationLogo",
      render: (text) => <img style={{ height: 80, weight: 80 }} src={text} />,
    },
    {
      title: "Name",
      dataIndex: "serviceApplicationName",
      key: "serviceApplicationName",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Link",
      dataIndex: "serviceApplicationLink",
      key: "serviceApplicationLink",
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
      title: "Category",
      dataIndex: "appcategoryName",
      key: "appcategoryName",
      render: (text) => <p>{text}</p>,
    },

    {
      title: t("status"),
      dataIndex: "serviceApplicationStatus",
      key: "serviceApplicationStatus",
      render: (text, record, dataIndex) =>
        record.serviceApplicationStatus === "available" &&
          record.status === "installed" ? (
          <Tag color={"green"}>Installed</Tag>
        ) : record.serviceApplicationStatus === "unavailable" &&
          record.status === "installed" ? (
          <>
            <Tag color={"warning"}>Unavailable</Tag>
            <Tooltip placement="topLeft" title={'Sorry! This application is temporary stopped'}>
              <InfoCircleOutlined />
            </Tooltip>
          </>
        ) : (
          <Tag color={"red"}>Unistalled</Tag>
        ),
    },

    {
      title: t("action"),
      key: "action",
      align: "center",
      render: (text, record, dataIndex) => (
        <Space size="middle">
          <Button
            className="infor-button"
            shape="default"
            onClick={() => {
              navigator(
                `/app-detail/${record.serviceApplicationId}&&installed`
              );
            }}
          >
            <EyeFilled /> Details
          </Button>
          {record.status === "installed" ? (
            <Button
              className="danger-button"
              onClick={() => {
                onUninstallApplication(record);
              }}
            >
              <CloseCircleFilled /> Uninstall
            </Button>
          ) : (
            <></>
          )}
        </Space>
      ),
    },
  ];
  const breadCumbData = [
    {
      href: MY_APPLICATION_HREF,
      label: MY_APPLICATION_LABEL,
      icon: null,
    },
  ];
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      {listMyApplication ? (
        listMyApplication.length === 0 ? (
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
              dataSource={listMyApplication}
              pagination={false}
            />
            <Pagination
              defaultCurrent={1}
              total={totalMyApplication}
              pageSize={numApplicationInPage}
              onChange={handleChangeNumberOfPaging}
            />
          </>
        )
      ) : (
        <Skeleton />
      )}
    </>
  );
};
export default MyApplicationPage;
