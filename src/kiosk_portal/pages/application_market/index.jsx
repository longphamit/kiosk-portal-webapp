import { Button, Modal, Pagination, Space, Spin, Table } from "antd";
import { EyeFilled, DownloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { useNavigate } from "react-router-dom";
import { getListApplicationService } from "../../services/application_service";
import { getAllCategoriesService } from "../../services/categories_service";
import { installApplicationService } from "../../services/party_service_application";
import { toast } from "react-toastify";

const ApplicationMarketPage = () => {
  const navigator = useNavigate();
  const { t } = useTranslation();
  const role = localStorageGetReduxState().auth.role;
  const [listApplication, setListApplication] = useState([]);
  const [totalApplication, setTotalApplication] = useState(0);
  const [numApplicationInPage, setNumApplicationInPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const getListApplicationFunction = async (
    currentPageToGetList,
    numInPage
  ) => {
    try {
      const res = await getListApplicationService(
        "",
        "",
        "",
        "",
        "",
        "available",
        numInPage,
        currentPageToGetList
      );
      console.log(res);
      setTotalApplication(res.data.metadata.total);
      setListApplication(res.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
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
            getListApplicationFunction(currentPage, numApplicationInPage);
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
    getListApplicationFunction(currentPage, numApplicationInPage);
  }, []);

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListApplicationFunction(page, numApplicationInPage);
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
      render: (text) => <p href={text}>{text}</p>,
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
            <EyeFilled /> Detail
          </Button>
          {record.partyServiceApplication && record.partyServiceApplication.status == 'installed' ? (
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

  return (
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
  );
};
export default ApplicationMarketPage;
