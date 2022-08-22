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
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  changeStatusPoiService,
  getListPoiService,
} from "../../services/poi_service";
import { getListProvinceService } from "../../services/map_service";
import ModalCreatePoi from "./modalCreatePoi";
import { getListPoiCategoriesService } from "../../services/poi_category_service";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  POI_MANAGER_HREF,
  POI_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { toast } from "react-toastify";
import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { columns } from "./utils";
import { POI_CREATING_PATH } from "../../constants/path_constants";

const PoiPage = () => {
  const { t } = useTranslation();
  const [listUnit, setListUnit] = useState();
  const [totalUnit, setTotalUnit] = useState(0);
  const [numUnitInPage, setNumUnitInPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  let role = localStorageGetReduxState().auth.role;
  let navigate = useNavigate();

  const [form] = Form.useForm();
  const getListPoiFunction = async (
    Name,
    Ward,
    District,
    City,
    Address,
    PoicategoryId,
    Type,
    currentPageToGetList,
    numInPage
  ) => {
    try {
      const res = await getListPoiService(
        Name,
        Ward,
        District,
        City,
        Address,
        PoicategoryId,
        Type,
        numInPage,
        currentPageToGetList
      );
      setTotalUnit(res.data.metadata.total);
      setListUnit(res.data.data);
    } catch (error) {
      setListUnit([]);
      console.error(error);
    }
  };
  const breadCumbData = [
    {
      href: POI_MANAGER_HREF,
      label: POI_MANAGER_LABEL,
      icon: null,
    },
  ];
  useEffect(async () => {
    getListPoiFunction("", "", "", "", "", "", "", currentPage, numUnitInPage);
  }, []);

  const onNavigate = (url) => {
    navigate(url);
  };

  const onFinishSearch = async (values) => {
    setCurrentPage(1);
    let name = "";
    if (typeof values.name !== "undefined") {
      name = values.name;
    }
    const res = await getListPoiFunction(
      name,
      "",
      "",
      "",
      "",
      "",
      "",
      1,
      numUnitInPage
    );
    setTotalUnit(res.data.metadata.total);
  };

  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListPoiFunction("", "", "", "", "", "", "", page, pageSize);
  };

  const onFinishChangeStatusPoi = (values) => {
    Modal.confirm({
      title: "Are you sure to change status this POI",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        {
          try {
            await changeStatusPoiService(JSON.stringify(values.id));
            toast.success("Change status successful");
            getListPoiFunction(
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              currentPage,
              numUnitInPage
            );
          } catch (error) {
            toast.error(error.response.data.message);
          }
        }
      },
    });
  };

  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      <Row style={{ padding: 10 }}>
        <Col span={15}>
          <Form form={form} name="search" onFinish={onFinishSearch}>
            <Row>
              <Col span={10}>
                <Form.Item name="name" style={{ marginTop: 5 }}>
                  <Input placeholder="Search by name" />
                </Form.Item>
              </Col>
              <Col span={2}>
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
              <Col span={1} />
              <Col span={3} />
            </Row>
          </Form>
        </Col>
        <Col span={5} />
        <Col span={4}>
          <Button
            className="success-button"
            size={"large"}
            onClick={() => {
              navigate(POI_CREATING_PATH);
              // showModal("create");
            }}
          >
            <PlusOutlined /> POI
          </Button>
        </Col>
      </Row>
      {listUnit ? (
        listUnit.length === 0 ? (
          <Row justify="center" align="center" style={{ marginTop: 250 }}>
            <Col>
              <Empty />
            </Col>
          </Row>
        ) : (
          <>
            <Table
              columns={columns(onFinishChangeStatusPoi, t, onNavigate)}
              dataSource={listUnit}
              pagination={false}
            />
            <Pagination
              defaultCurrent={1}
              total={totalUnit}
              pageSize={5}
              onChange={handleChangeNumberOfPaging}
              current={currentPage}
            />
          </>
        )
      ) : (
        <Skeleton />
      )}
      
    </>
  );
};
export default PoiPage;
