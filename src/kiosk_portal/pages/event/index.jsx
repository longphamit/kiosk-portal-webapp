import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Skeleton,
  Table,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Option } from "antd/lib/mentions";
import {
  deleteEventService,
  getListEventService,
  searchEventService,
} from "../../services/event_service";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { ROLE_ADMIN, ROLE_LOCATION_OWNER } from "../../../@app/constants/role";
import {
  STATUS_COMING_SOON,
  STATUS_END,
  STATUS_ON_GOING,
} from "../../constants/event_constants";
import {
  EVENT_MANAGER_HREF,
  EVENT_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { EVENT_CREATING_PATH } from "../../constants/path_constants";
import { adminColumns, locationOwnerColumns } from "./utils";
import { DELETE_SUCCESS } from "../../../@app/constants/message";
const EventManagerPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEventsLoading, setEventsLoading] = useState(false);
  const [totalEvent, setTotalEvent] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [querySearch, setQuerySearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [selectedSearchType, setSelectedSearchType] = useState("Name");
  const [numEventInPage, setNumEventInPage] = useState(10);
  const [listEvent, setListEvent] = useState();
  useState(false);
  let role = localStorageGetReduxState().auth.role;
  const [searchForm] = Form.useForm();
  let navigate = useNavigate();

  const onNavigate = (url) => {
    navigate(url);
  };

  const getListEventFunction = async (currentPageToGetList, numInPage) => {
    try {
      setEventsLoading(true);
      if (isSearch) {
        querySearch.page = currentPageToGetList;
        let res = searchEventService(querySearch);
        setTotalEvent(res.data.metadata.total);
        setListEvent(res.data.data);
        return;
      }
      const res = await getListEventService(currentPageToGetList, numInPage);
      setTotalEvent(res.data.metadata.total);
      setListEvent(res.data.data);
    } catch (error) {
      setListEvent([]);
      if (error.response.code === 400) {
        toast.error("Cannot get events");
      }
      resetPage();
      console.error(error);
    } finally {
      setEventsLoading(false);
    }
  };

  const typesForAdmin = [
    {
      name: "Name",
      label: "Name",
    },
    {
      name: "CreatorName",
      label: "Creator Name",
    },
    {
      name: "CreatorEmail",
      label: "Creator Email",
    },
  ];

  const prefixSearch = (
    <Form.Item name="type" noStyle>
      <Select
        onChange={(e) => {
          e == null ? setSelectedSearchType("Name") : setSelectedSearchType(e);
        }}
        defaultValue="Name"
      >
        {role === ROLE_ADMIN ? (
          typesForAdmin.map((item) => {
            return <Option value={item.name}>{item.label}</Option>;
          })
        ) : (
          <Option value={"name"}>{"Name"}</Option>
        )}
      </Select>
    </Form.Item>
  );
  useEffect(() => {
    getListEventFunction(currentPage, numEventInPage);
  }, []);
  const handleChangeNumberOfPaging = async (page, pageSize) => {
    setCurrentPage(page);
    await getListEventFunction(page, numEventInPage);
  };

  const buildEventParamsSearch = (value) => {
    let name = "";
    let ward = "";
    let district = "";
    let city = "";
    let street = "";
    let creatorName = "";
    let creatorEmail = "";
    let type = "";
    switch (selectedSearchType) {
      case "Name":
        name = value;
        break;
      case "Ward":
        ward = value;
        break;
      case "District":
        district = value;
        break;
      case "City":
        city = value;
        break;
      case "Street":
        street = value;
        break;
      case "CreatorName":
        creatorName = value;
        break;
      case "Type":
        type = value;
        break;
      case "CreatorEmail":
        creatorEmail = value;
        break;
    }
    return {
      name: name,
      ward: ward,
      district: district,
      city: city,
      street: street,
      creatorName: creatorName,
      creatorEmail: creatorEmail,
      type: type,
    };
  };
  const onFinishSearch = async (values) => {
    if (values.searchString === "" && values.status === "") {
      setIsSearch(false);
      getListEventFunction(1, numEventInPage);
      return;
    }
    let searchStr = buildEventParamsSearch(values.searchString);
    searchStr["size"] = numEventInPage;
    searchStr["page"] = 1;
    searchStr["status"] = values.status;
    if (role === ROLE_LOCATION_OWNER) {
      searchStr["type"] = "local";
    }
    try {
      const res = await searchEventService(searchStr);
      setCurrentPage(1);
      setQuerySearch(searchStr);
      setTotalEvent(res.data.metadata.total);
      setListEvent(res.data.data);
    } catch (e) {
      toast("Cannot found!");
      resetPage();
      console.error(e);
    }
  };
  const resetPage = () => {
    setCurrentPage(1);
    setTotalEvent(0);
    setListEvent(0);
  };

  const handleDeleteEvent = async (record) => {
    Modal.confirm({
      title: "Confirm delete the event",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        {
          setIsLoading(true);
          try {
            await deleteEventService(record.id);
            getListEventFunction(currentPage, numEventInPage);
            toast(DELETE_SUCCESS);
          } catch (e) {
            toast.error(e.response.data.message);
          } finally {
            setIsLoading(false);
          }
        }
      },
    });
  };

  const breadCumbData = [
    {
      href: EVENT_MANAGER_HREF,
      label: EVENT_MANAGER_LABEL,
      icon: null,
    },
  ];
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      <Row style={{ padding: 10 }}>
        <Col span={15}>
          <Form
            form={searchForm}
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
                    addonBefore={prefixSearch}
                    style={{ width: "100%" }}
                    placeholder="Search..."
                    value=""
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="status" style={{ marginTop: 5 }}>
                  <Select>
                    <Option value="">All Status</Option>
                    <Option value={STATUS_COMING_SOON}>Up coming</Option>
                    <Option value={STATUS_ON_GOING}>On going</Option>
                    <Option value={STATUS_END}>End</Option>
                  </Select>
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
        <Col span={4}>
          <Button
            className="success-button"
            size={"large"}
            onClick={() => {
              navigate(EVENT_CREATING_PATH);
            }}
          >
            <PlusOutlined /> Event
          </Button>
        </Col>
      </Row>
      {!isEventsLoading ? (
        listEvent ? (
          listEvent.length === 0 ? (
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
                rowClassName={(record, index) =>
                  record.status === STATUS_END
                    ? "tb-row-event-end"
                    : record.status === STATUS_ON_GOING
                    ? "tb-row-event-ongoing"
                    : ""
                }
                columns={
                  role === ROLE_ADMIN
                    ? adminColumns(handleDeleteEvent, onNavigate)
                    : locationOwnerColumns(handleDeleteEvent, onNavigate)
                }
                dataSource={listEvent}
                pagination={false}
              />
              <Pagination
                defaultCurrent={1}
                total={totalEvent}
                pageSize={numEventInPage}
                current={currentPage}
                onChange={handleChangeNumberOfPaging}
              />
            </>
          )
        ) : (
          <>
            <Row justify="center" align="center" style={{ marginTop: 250 }}>
              <Col>
                <Empty />
              </Col>
            </Row>
          </>
        )
      ) : (
        <Skeleton />
      )}
    </>
  );
};
export default EventManagerPage;
