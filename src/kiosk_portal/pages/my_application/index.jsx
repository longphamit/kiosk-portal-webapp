import { Button, Modal, Pagination, Space, Table } from "antd";
import { EyeFilled, DownloadOutlined, CloseCircleOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MY_APPLICATION_HREF, MY_APPLICATION_LABEL } from "../../components/breadcumb/breadcumb_constant";
import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { useNavigate } from "react-router-dom";
import {
  changeStatusMyAppService,
  getListMyAppService,
  installApplicationService,
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
        "installed",
        numInPage,
        currentPageToGetList
      );
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
    localStorage.setItem(PREVIOUS_PATH, JSON.stringify({ data: breadCumbData }));
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
              navigator(`/app-detail/${record.serviceApplicationId}&&installed`);
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
  const breadCumbData = [
    {
      href: MY_APPLICATION_HREF,
      label: MY_APPLICATION_LABEL,
      icon: null
    },
  ]
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
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

  );
};
export default MyApplicationPage;
