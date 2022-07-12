import { Button, Modal, Pagination, Space, Table } from "antd";
import { EyeFilled, DownloadOutlined, CloseCircleOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { useNavigate } from "react-router-dom";
import { getListApplicationService } from "../../services/application_service";
import { getAllCategoriesService } from "../../services/categories_service";
import {
  changeStatusMyAppService,
  getListMyAppService,
  installApplicationService,
} from "../../services/party_service_application";
import { toast } from "react-toastify";

const MyApplicationPage = () => {
  const navigator = useNavigate();
  const { t } = useTranslation();
  const role = localStorageGetReduxState().auth.role;
  const [listMyApplication, setListMyApplication] = useState([]);
  const [totalMyApplication, setTotalMyApplication] = useState(0);
  const [numApplicationInPage, setNumApplicationInPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const getListMyAppFunction = async (currentPageToGetList, numInPage) => {
    try {
      const res = await getListMyAppService(
        "",
        "installed",
        numInPage,
        currentPageToGetList
      );
      console.log(res);
      setTotalMyApplication(res.data.metadata.total);
      setListMyApplication(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onUninstallApplication = (value) => {
    Modal.confirm({
      title: "Confirm Uninstall this application",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        {
          try {
            await changeStatusMyAppService(value.serviceApplicationId);
            await getListMyAppFunction(currentPage, numApplicationInPage);
            toast.success("Uninstall successful");
          } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
          }
        }
      },
    });
  };

  useEffect(async () => {
    getListMyAppFunction(currentPage, numApplicationInPage);
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
      render: (text) => <p href={text}>{text}</p>,
    },

    {
      title: "Category",
      dataIndex: "appcategoryName",
      key: "appcategoryName",
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
              navigator(`/app-detail/${record.serviceApplicationId}`);
            }}
          >
            <EyeFilled /> Detail
          </Button>
          {
            record.status === "installed" ? <Button
              className="danger-button"
              onClick={() => {
                onUninstallApplication(record)
              }}
            >
              <CloseCircleFilled /> Uninstall
            </Button> : <></>
          }
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={listMyApplication}
        pagination={false}
      />
      <Pagination
        defaultCurrent={1}
        total={totalMyApplication}
        pageSize={5}
        onChange={handleChangeNumberOfPaging}
      />
    </>
  );
};
export default MyApplicationPage;
