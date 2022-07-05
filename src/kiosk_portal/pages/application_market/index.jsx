import { Button, Modal, Pagination, Space, Table } from "antd";
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
        "available",
        numInPage,
        currentPageToGetList
      );
      setTotalApplication(res.data.metadata.total);
      setListApplication(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishInstallApplication = (values) => {
    console.log(values);
    // installApplicationService();
    Modal.confirm({
      title: "Confirm delete the template",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        {
          try {
            const installObj = {
              serviceApplicationId: values.id,
            };
            await installApplicationService(installObj);
            toast.success("Delete successful");
          } catch (error) {
            console.log(error.responseContext);
            // toast.error(error.response.data.message);
            // console.log(error);
            // toast("Delete failed");
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
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text, record, dataIndex) => <p>{text}</p>,
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
          {}
          <Button
            className="success-button"
            onClick={() => {
              onFinishInstallApplication(record);
            }}
          >
            <DownloadOutlined /> Install
          </Button>
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
