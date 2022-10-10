import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Skeleton,
  Space,
  Spin,
  Table,
} from "antd";
import {
  EyeFilled,
  DownloadOutlined,
  LinkOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import { getListApplicationService } from "../../services/application_service";
import { installApplicationService } from "../../services/party_service_application";
import { toast } from "react-toastify";
import {
  APPLICATION_MARKET_HREF,
  APPLICATION_MARKET_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { PREVIOUS_PATH } from "../../../@app/constants/key";

const ApplicationMarketPage = () => {
  const navigator = useNavigate();
  const { t } = useTranslation();
  const [listApplication, setListApplication] = useState();
  const [totalApplication, setTotalApplication] = useState(0);
  const [numApplicationInPage, setNumApplicationInPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const getListApplicationFunction = async (
    name,
    currentPageToGetList,
    numInPage
  ) => {
    try {
      const res = await getListApplicationService(
        name,
        "",
        "",
        "",
        "",
        "available",
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
  const onFinishSearch = async (values) => {
    getListApplicationFunction(
      values.searchString,
      currentPage,
      numApplicationInPage
    );
    // await getKioskLocationList(values.searchString, 1, pageSize);
    // setCurrentPaging(1);
  };

  const onFinishInstallApplication = (values) => {
    Modal.confirm({
      title: "Confirm install this application",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        {
          setIsLoading(true);
          try {
            const installObj = {
              serviceApplicationId: values.id,
            };
            await installApplicationService(installObj);
            toast.success("Install successful");
            getListApplicationFunction("", currentPage, numApplicationInPage);
          } catch (error) {
            toast.error(error.response.data.message);
          } finally {
            setIsLoading(false);
          }
        }
      },
    });
  };

  useEffect(async () => {
    getListApplicationFunction("", currentPage, numApplicationInPage);
    localStorage.setItem(
      PREVIOUS_PATH,
      JSON.stringify({ data: breadCumbData })
    );
  }, []);

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListApplicationFunction("", page, numApplicationInPage);
  };
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
      title: "Category",
      dataIndex: "appCategoryName",
      key: "appCategoryName",
      render: (text) => <p>{text}</p>,
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
          {record.partyServiceApplication &&
          record.partyServiceApplication.status == "installed" ? (
            <Button
              className="success-button"
              onClick={() => {
                onFinishInstallApplication(record);
              }}
              disabled
            >
              <DownloadOutlined /> Already install
            </Button>
          ) : isLoading ? (
            <Spin />
          ) : (
            <Button
              className="success-button"
              onClick={() => {
                onFinishInstallApplication(record);
              }}
            >
              <DownloadOutlined /> Install
            </Button>
          )}
        </Space>
      ),
    },
  ];
  const breadCumbData = [
    {
      href: APPLICATION_MARKET_HREF,
      label: APPLICATION_MARKET_LABEL,
      icon: null,
    },
  ];
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      <Row style={{ padding: 10 }}>
        <Col span={15}>
          <Form
            form={form}
            name="search"
            onFinish={onFinishSearch}
            initialValues={{
              type: "Name",
              searchString: "",
              status: "",
            }}
          >
            <Row>
              <Col span={14}>
                <Form.Item name="searchString" style={{ marginTop: 5 }}>
                  <Input
                    style={{ width: "100%" }}
                    placeholder="Search by name"
                    value=""
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
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
        <Col span={9} />
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
export default ApplicationMarketPage;
