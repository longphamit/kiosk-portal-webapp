import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Pagination,
    Row,
    Select,
    Space,
    Table,
    Tag,
    TimePicker,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import moment from "moment";
import { localStorageGetUserIdService } from "../../../@app/services/localstorage_service";
import { getListTemplateService } from "../../services/template_service";

const TemplateManagerPage = () => {
    const { Option } = Select;
    const { t } = useTranslation();
    const [listTemplate, setlistTemplate] = useState([]);
    const [totalTemplate, setTotalTemplate] = useState(0);
    const [numTemplatePage, setnumTemplatePage] = useState(5);
    const [isSearch, setIsSearch] = useState(false);
    const [querySearch, setQuerySearch] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentItem, setCurrentItem] = useState(null);
    const [isCreateTemplateModalVisible, setIsCreateTemplateModalVisible] =
        useState(false);
    const [isEditTemplateModalVisible, setIsEditTemplateModalVisible] =
        useState(false);
    const [form] = Form.useForm();
    const getListTemplateFunction = async (currentPageToGetList, numInPage) => {
        try {
            if (isSearch) {
                querySearch.page = currentPageToGetList;
                //Get list search
            } else {
                await getListTemplateService(currentPageToGetList, numInPage).then(
                    (res) => {
                        setTotalTemplate(res.data.metadata.total);
                        setlistTemplate(res.data);
                    }
                );
            }
            return;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getListTemplateFunction(currentPage, numTemplatePage);
    }, []);

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };
    const onFinishEditTemplate = async (values) => {

    };
    const onFinishSearch = async (values) => {
    };
    const showModalEditTemplate = () => {
        setIsEditTemplateModalVisible(true);
    };
    const handleCancelEditSchedule = () => {
        setIsEditTemplateModalVisible(false);
    };
    const onFinishCreateTemplate = async (values) => {
    };

    const showModalCreateTemplate = () => {
        setIsCreateTemplateModalVisible(true);
        form.resetFields();
    };

    const handleCancelCreateTemplate = () => {
        setIsCreateTemplateModalVisible(false);
    };
    const handleDeleteTemplate = async (record) => {
        Modal.confirm({
            title: t("confirmDeleteTemplate"),
            okText: t("yes"),
            cancelText: t("no"),
            onOk: async () => {
                {
                }
            },
        });
    };

    const handleChangeNumberOfPaging = async (page, pageSize) => {
        setCurrentPage(page);
        await getListTemplateFunction(page, numTemplatePage);
    };

    const convertDate = (stringToConvert) => {
        return moment(new Date(stringToConvert)).format("DD/MM/YYYY");
    };
    const types = [
        {
            name: "Name",
            label: "Name",
        }
    ];
    const columns = [
        {
            title: t('name'),
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: t('description'),
            dataIndex: "description",
            key: "description",
            render: (text) => <a>{text}</a>,
        },
        {
            title: t('createdate'),
            dataIndex: "createdate",
            key: "createdate",
            render: (text) => <a>{convertDate(text)}</a>,
        },
        {
            title: t("action"),
            key: "action",
            render: (text, record, dataIndex) => (
                <Space size="middle">
                    <Button
                        className="warn-button"
                        shape="default"
                        onClick={() => {
                            setCurrentItem(record);
                            showModalEditTemplate();
                        }}
                    >
                        {t("edit")}
                    </Button>

                    <Button
                        type="primary"
                        shape="default"
                        name={record}
                        onClick={() => {
                            handleDeleteTemplate(record);
                        }}
                    >
                        {t("delete")}
                    </Button>

                </Space>
            ),
        },
    ];
    const sample = [{
        name: 'a',
        description: 'aa',
        createdate: '20222/05/22'
    }];
    const prefixSearch = (
        <Form.Item name="type" noStyle>
            <Select defaultValue="Name">
                {types.map((item) => {
                    return <Option value={item.name}>{item.label}</Option>;
                })}
            </Select>
        </Form.Item>
    );
    return (
        <>
            <Row style={{ padding: 10 }}>
                <Col span={15}>
                    <Form
                        form={form}
                        name="search"
                        onFinish={onFinishSearch}
                        initialValues={{
                            type: "Name",
                            searchString: "",
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
                            <Col span={3}>
                                <Form.Item>
                                    <Button
                                        htmlType="submit"
                                        style={{ marginLeft: 10, borderRadius: 5 }}
                                        type="primary"
                                        size={"large"}
                                    >
                                        Search
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                </Col>
                <Col span={5} />
                <Col span={4}>
                    <Button
                        type="primary"
                        shape="round"
                        size={"large"}
                        onClick={showModalCreateTemplate}
                    >
                        {t("createtemplate")}
                    </Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={sample} pagination={false} />
            <Pagination
                defaultCurrent={1}
                total={totalTemplate}
                pageSize={5}
                onChange={handleChangeNumberOfPaging}
            />

            <Modal
                title={t("createtemplate")}
                visible={isCreateTemplateModalVisible}
                onCancel={handleCancelCreateTemplate}
                footer={null}
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinishCreateTemplate}
                    scrollToFirstError
                >
                    <Form.Item
                        name="Name"
                        label={t("name")}
                        rules={[
                            {
                                required: true,
                                message: t("reqname"),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={t("description")}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            {t("btncreateschedule")}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {currentItem ? (
                <Modal
                    key={currentItem.id}
                    title={t("edit")}
                    visible={isEditTemplateModalVisible}
                    onCancel={handleCancelEditSchedule}
                    footer={null}
                >
                    <Form
                        key={currentItem.id}
                        {...formItemLayout}
                        form={form}
                        name="edit"
                        onFinish={onFinishEditTemplate}
                        scrollToFirstError
                        initialValues={{}}
                    >
                        <Form.Item name="id" hidden={true}>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                            name="Name"
                            label={t("name")}
                            rules={[
                                {
                                    required: true,
                                    message: t("reqname"),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={t("description")}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            ) : null}
        </>
    );
};
export default TemplateManagerPage;
