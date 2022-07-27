import { useEffect, useState } from "react";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Pagination,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    TimePicker,
    Upload
} from "antd";
import { DeleteFilled, EyeFilled, PlusOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { toast } from "react-toastify";
import { Option } from "antd/lib/mentions";
import { createEventService, deleteEventService, getListEventService, searchEventService } from "../../services/event_service";
import TextArea from "antd/lib/input/TextArea";
import { getListDistrictService, getListProviceService, getListWardService } from "../../services/location_services";
import { getBase64 } from "../../../@app/utils/file_util";
import { beforeUpload } from "../../../@app/utils/image_util";
import { useNavigate } from "react-router-dom";
import "./styles.css"
import { TYPE_SERVER } from "../../../@app/constants/key";
import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { ROLE_ADMIN, ROLE_LOCATION_OWNER } from "../../../@app/constants/role";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { STATUS_COMING_SOON, STATUS_END, STATUS_ON_GOING } from "../../constants/event_constants";
import { EVENT_MANAGER_HREF, EVENT_MANAGER_LABEL } from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { checkDateTime, toStringDateTimePicker } from "./checkdatetime";
const EventManagerPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [totalEvent, setTotalEvent] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [querySearch, setQuerySearch] = useState('');
    const [isSearch, setIsSearch] = useState(false);
    const [selectedSearchType, setSelectedSearchType] = useState('Name');
    const [numEventInPage, setNumEventInPage] = useState(10);
    const [listEvent, setListEvent] = useState([]);
    useState(false);
    const [form, searchForm] = Form.useForm();
    let navigate = useNavigate();

    const onNavigate = (url) => {
        navigate(url);
    };

    const getListEventFunction = async (currentPageToGetList, numInPage) => {
        try {
            if (isSearch) {
                querySearch.page = currentPageToGetList;
                let res = searchEventService(querySearch)
                setTotalEvent(res.data.metadata.total);
                setListEvent(res.data.data);
                return;
            }
            const res = await getListEventService(currentPageToGetList, numInPage);
            setTotalEvent(res.data.metadata.total);
            setListEvent(res.data.data);
            return;
        } catch (error) {
            if (error.response.code === 400) {
                toast.error("Cannot get events")
            }
            resetPage();
            console.log(error);
        }
    };

    const typesForAdmin = [
        {
            name: "Name",
            label: "Name",
        },
        {
            name: "Ward",
            label: "Ward",
        },
        {
            name: "District",
            label: "District",
        },
        {
            name: "City",
            label: "City",
        },
        {
            name: "Status",
            label: "Status",
        },
        {
            name: "Street",
            label: "Street",
        },
        {
            name: "CreatorName",
            label: "Creator Name",
        },
        {
            name: "Type",
            label: "Type",
        },
        {
            name: "CreatorEmail",
            label: "Creator Email",
        }
    ];
    const typesForLocatioOwner = [
        {
            name: "Name",
            label: "Name",
        },
        {
            name: "Ward",
            label: "Ward",
        },
        {
            name: "District",
            label: "District",
        },
        {
            name: "City",
            label: "City",
        },
        {
            name: "Status",
            label: "Status",
        },
        {
            name: "Street",
            label: "Street",
        },
    ];


    const prefixSearch = (
        <Form.Item name="type" noStyle>
            <Select
                onChange={(e) => { e == null ? setSelectedSearchType('Name') : setSelectedSearchType(e) }}
                defaultValue="Name"
            >   {
                    localStorageGetReduxState().auth.role == ROLE_ADMIN ?
                        typesForAdmin.map((item) => {
                            return <Option value={item.name}>{item.label}</Option>
                        }) : localStorageGetReduxState().auth.role == ROLE_LOCATION_OWNER ?
                            typesForLocatioOwner.map((item) => {
                                return <Option value={item.name}>{item.label}</Option>
                            }) : null
                }
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
        let name = '';
        let ward = '';
        let district = '';
        let city = '';
        let street = '';
        let creatorName = '';
        let creatorEmail = '';
        let type = ''
        console.log(selectedSearchType)
        switch (selectedSearchType) {
            case 'Name':
                name = value;
                break;
            case 'Ward':
                ward = value;
                break;
            case 'District':
                district = value;
                break;
            case 'City':
                city = value;
                break;
            case 'Street':
                street = value;
                break;
            case 'CreatorName':
                creatorName = value;
                break;
            case 'Type':
                type = value;
                break;
            case 'CreatorEmail':
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
            type: type
        }
    }
    const onFinishSearch = async (values) => {
        if (values.searchString === '' && values.status === '') {
            setIsSearch(false);
            getListEventFunction(1, numEventInPage)
            return;
        }
        let searchStr = buildEventParamsSearch(values.searchString);
        searchStr["size"] = numEventInPage;
        searchStr["page"] = 1;
        searchStr["status"] = values.status;
        if (localStorageGetReduxState().auth.role === ROLE_LOCATION_OWNER) {
            searchStr["type"] = "local";
        }
        try {
            const res = await searchEventService(searchStr);
            setCurrentPage(1);
            setQuerySearch(searchStr)
            setTotalEvent(res.data.metadata.total);
            setListEvent(res.data.data);
        } catch (e) {
            toast("Cannot found!")
            resetPage()
            console.log(e)
        }
    };
    const resetPage = () => {
        setCurrentPage(1);
        setTotalEvent(0);
        setListEvent(0);
    }

    const handleDeleteEvent = async (record) => {

        Modal.confirm({
            title: 'Confirm delete the event',
            okText: "Yes",
            cancelText: 'No',
            onOk: async () => {
                {
                    setIsLoading(true);
                    try {
                        await deleteEventService(record.id);
                        getListEventFunction(currentPage, numEventInPage);
                        toast("Delete successful");
                    } catch (e) {
                        toast.error(e.response.data.message);
                    } finally {
                        setIsLoading(false);
                    }
                }
            },
        });
    };

    const convertDate = (str) => {
        return {
            'date': moment(str).format('DD/MM/YYYY'),
            'time': moment(str).format('HH:ss'),
        }

    }
    const columns = [
        {
            title: 'Name',
            dataIndex: "name",
            key: "name",
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Time Start',
            dataIndex: "timeStart",
            key: "timeStart",
            render: (text) => {
                let data = convertDate(text);
                return <><p>{data.date}</p><br /><p>{data.time}</p></>
            },
        },
        {
            title: 'Time End',
            dataIndex: "timeEnd",
            key: "timeEnd",
            render: (text) => {
                let data = convertDate(text);
                return <><p>{data.date}</p><br /><p>{data.time}</p></>
            },
        },
        {
            title: 'Address',
            dataIndex: "address",
            key: "address",
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Status',
            dataIndex: "status",
            key: "status",
            render: (text) => text === STATUS_COMING_SOON ? (
                <Tag color={"yellow"}>Up coming</Tag>
            ) : text === STATUS_ON_GOING ?
                (
                    <Tag color={"green"}>On going</Tag>
                ) :
                (
                    <Tag color={"grey"}>End</Tag>
                )
        },
        {
            title: 'Created By',
            dataIndex: "type",
            key: "type",
            render: (text) => text == TYPE_SERVER ? <p>Admin</p> : <p>Location Owner</p>,
        },
        {
            title: 'Action',
            key: "action",
            render: (text, record, dataIndex) => (
                <Space size="middle">
                    <Button
                        className="infor-button"
                        shape="default"
                        onClick={() => {
                            onNavigate({ pathname: '/./event', search: '?id=' + record.id });
                        }}
                    >
                        <EyeFilled />   Details
                    </Button>

                    <Button
                        className="danger-button"
                        shape="default"
                        name={record}
                        onClick={() => {
                            handleDeleteEvent(record);
                        }}
                    >
                        <DeleteFilled />    Delete
                    </Button>

                </Space>
            ),
        },
    ];
    const breadCumbData = [
        {
            href: EVENT_MANAGER_HREF,
            label: EVENT_MANAGER_LABEL,
            icon: null
        },
    ]
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
                            status: ""
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
                                <Form.Item name='status' style={{ marginTop: 5 }}>
                                    <Select >
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
                        onClick={() => { navigate('/event/create') }}
                    >
                        <PlusOutlined /> Event
                    </Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={listEvent} pagination={false} />
            <Pagination
                defaultCurrent={1}
                total={totalEvent}
                pageSize={numEventInPage}
                onChange={handleChangeNumberOfPaging}
            />
        </>
    );
};
export default EventManagerPage;
