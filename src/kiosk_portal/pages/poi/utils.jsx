import { EyeFilled, SwapOutlined } from "@ant-design/icons";
import { Button, Space, Tag } from "antd";

export const columns = (onFinishChangeStatusPoi, t, onNavigate) => [
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
        title: "Open Day",
        dataIndex: "dayOfWeek",
        key: "dayOfWeek",
        render: (text) => <p>{text}</p>,
    },
    {
        title: t("status"),
        dataIndex: "status",
        key: "status",
        render: (text, record, dataIndex) => record.status === "activate" ? (
            <Tag color="green">Activate</Tag>
        ) : (
            <Tag color="red">Deactivate</Tag>
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
                        onNavigate({ pathname: "/./poi", search: "?id=" + record.id });
                    }}
                >
                    <EyeFilled /> Details
                </Button>
                <Button
                    className="warn-button"
                    shape="default"
                    onClick={() => {
                        onFinishChangeStatusPoi(record);
                    }}
                >
                    <SwapOutlined /> Change Status
                </Button>
            </Space>
        ),
    },
];

