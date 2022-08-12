import { Button, Space, Tag } from "antd";
import { TYPE_SERVER } from "../../../@app/constants/key";
import { STATUS_COMING_SOON, STATUS_ON_GOING } from "../../constants/event_constants";
import moment from 'moment'
import { DeleteFilled, EyeFilled } from "@ant-design/icons";

const convertDate = (str) => {
    return {
        date: moment(str).format("DD/MM/YYYY"),
        time: moment(str).format("HH:ss"),
    };
};

export const adminColumns = (handleDeleteEvent, navigate) => [
    {
        title: "Image",
        render: (text, record, dataIndex) => (
            <img src={record.thumbnail.link} width={50} height={50} />
        ),
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => <p>{text}</p>,
    },
    {
        title: "Time Start",
        dataIndex: "timeStart",
        key: "timeStart",
        render: (text) => {
            let data = convertDate(text);
            return (
                <>
                    <p>{data.date}</p>
                    <br />
                    <p>{data.time}</p>
                </>
            );
        },
    },
    {
        title: "Time End",
        dataIndex: "timeEnd",
        key: "timeEnd",
        render: (text) => {
            let data = convertDate(text);
            return (
                <>
                    <p>{data.date}</p>
                    <br />
                    <p>{data.time}</p>
                </>
            );
        },
    },
    {
        title: "Address",
        dataIndex: "address",
        key: "address",
        render: (text) => <p>{text}</p>,
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text) =>
            text === STATUS_COMING_SOON ? (
                <Tag color={"yellow"}>Up coming</Tag>
            ) : text === STATUS_ON_GOING ? (
                <Tag color={"green"}>On going</Tag>
            ) : (
                <Tag color={"grey"}>End</Tag>
            ),
    },
    {
        title: "Created By",
        dataIndex: "type",
        key: "type",
        render: (text) =>
            text == TYPE_SERVER ? <p>Admin</p> : <p>Location Owner</p>,
    },
    {
        title: "Action",
        key: "action",
        align: "center",
        render: (text, record, dataIndex) => (
            <Space size="middle">
                <Button
                    className="infor-button"
                    shape="default"
                    onClick={() => {
                        navigate({ pathname: "/./event", search: "?id=" + record.id });
                    }}
                >
                    <EyeFilled /> Details
                </Button>

                <Button
                    className="danger-button"
                    shape="default"
                    name={record}
                    onClick={() => {
                        handleDeleteEvent(record);
                    }}
                >
                    <DeleteFilled /> Delete
                </Button>
            </Space>
        ),
    },
];

export const locationOwnerColumns = (handleDeleteEvent, navigate) => [
    {
        title: "Image",
        render: (text, record, dataIndex) => (
            <img src={record.thumbnail.link} width={50} height={50} />
        ),
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => <p>{text}</p>,
    },
    {
        title: "Time Start",
        dataIndex: "timeStart",
        key: "timeStart",
        render: (text) => {
            let data = convertDate(text);
            return (
                <>
                    <p>{data.date}</p>
                    <br />
                    <p>{data.time}</p>
                </>
            );
        },
    },
    {
        title: "Time End",
        dataIndex: "timeEnd",
        key: "timeEnd",
        render: (text) => {
            let data = convertDate(text);
            return (
                <>
                    <p>{data.date}</p>
                    <br />
                    <p>{data.time}</p>
                </>
            );
        },
    },
    {
        title: "Address",
        dataIndex: "address",
        key: "address",
        render: (text) => <p>{text}</p>,
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text) =>
            text === STATUS_COMING_SOON ? (
                <Tag color={"yellow"}>Up coming</Tag>
            ) : text === STATUS_ON_GOING ? (
                <Tag color={"green"}>On going</Tag>
            ) : (
                <Tag color={"grey"}>End</Tag>
            ),
    },
    {
        title: "Action",
        key: "action",
        align: "center",
        render: (text, record, dataIndex) => (
            <Space size="middle">
                <Button
                    className="infor-button"
                    shape="default"
                    onClick={() => {
                        navigate({ pathname: "/./event", search: "?id=" + record.id });
                    }}
                >
                    <EyeFilled /> Details
                </Button>

                <Button
                    className="danger-button"
                    shape="default"
                    name={record}
                    onClick={() => {
                        handleDeleteEvent(record);
                    }}
                >
                    <DeleteFilled /> Delete
                </Button>
            </Space>
        ),
    },
];