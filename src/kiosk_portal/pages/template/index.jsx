import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    Pagination,
    Row,
    Select,
    Space,
    Table,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { createTemplateService, deleteTemplateService, getListTemplateService, updateTemplateService } from "../../services/template_service";

const TemplateManagerPage = () => {
    const { Option } = Select;
    const [listTemplate, setListTemplate] = useState([]);
    const [totalTemplate, setTotalTemplate] = useState(0);
    const [numTemplateInPage, setNumTemplateInPage] = useState(10);
    const [querySearch, setQuerySearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentItem, setCurrentItem] = useState(null);
    const [isCreateTemplateModalVisible, setIsCreateTemplateModalVisible] =
        useState(false);
    const [isEditTemplateModalVisible, setIsEditTemplateModalVisible] =
        useState(false);
    const [form] = Form.useForm();
    const getListTemplateFunction = async (currentPageToGetList, numInPage) => {
        try {
            let name = querySearch !== '' ? querySearch : '';
            const res = await getListTemplateService(currentPageToGetList, numInPage, name);
            setTotalTemplate(res.data.metadata.total);
            setListTemplate(res.data.data);
            return;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getListTemplateFunction(currentPage, numTemplateInPage);
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
        let data = {
            id: values.id,
            name: values.Name ?? "",
            description: values.description ?? ""
        }
        try {
            const res = await updateTemplateService(data);
            handleCancelEditTemplate();
            toast("Update successful");
            getListTemplateFunction(currentPage, numTemplateInPage)
        } catch (e) {
            toast("Update failed");
        }
    };
    const onFinishSearch = async (values) => {
        try {
            const res = await getListTemplateService(1, numTemplateInPage, values.searchString);
            setCurrentPage(1);
            setTotalTemplate(res.data.metadata.total);
            setListTemplate(res.data.data);
        } catch (e) {
            toast("Cannot found!")
        }

    };
    const showModalEditTemplate = () => {
        setIsEditTemplateModalVisible(true);
    };
    const handleCancelEditTemplate = () => {
        setIsEditTemplateModalVisible(false);
    };
    const onFinishCreateTemplate = async (values) => {
        let data = {
            name: values.Name ?? "",
            description: values.description ?? ""
        }
        try {
            await createTemplateService(data);
            handleCancelCreateTemplate();
            toast("Create successful");
            getListTemplateFunction(currentPage, numTemplateInPage);
        } catch (e) {
            toast("Create failed");
        }
    };

    const showModalCreateTemplate = () => {
        setIsCreateTemplateModalVisible(true);
        form.resetFields();
    };

    const handleCancelCreateTemplate = () => {
        setIsCreateTemplateModalVisible(false);
    };
    const handleDeleteTemplate = async (record) => {
        console.log(record);
        Modal.confirm({
            title: 'Confirm delete the template',
            okText: "Yes",
            cancelText: 'No',
            onOk: async () => {
                {
                    try {
                        await deleteTemplateService(record.id);
                        getListTemplateFunction(currentPage, numTemplateInPage);
                        toast("Delete successful");
                    } catch (e) {
                        toast("Delete failed");
                    }
                }
            },
        });
    };

    const handleChangeNumberOfPaging = async (page, pageSize) => {
        setCurrentPage(page);
        await getListTemplateFunction(page, numTemplateInPage);
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
            title: 'Name',
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Description',
            dataIndex: "description",
            key: "description",
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Action',
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
                        Edit
                    </Button>

                    <Button
                        type="primary"
                        shape="default"
                        name={record}
                        onClick={() => {
                            handleDeleteTemplate(record);
                        }}
                    >
                        Delete
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
                        Create template
                    </Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={listTemplate} pagination={false} />
            <Pagination
                defaultCurrent={1}
                total={totalTemplate}
                pageSize={5}
                onChange={handleChangeNumberOfPaging}
            />

            <Modal
                title='Create template'
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
                        label='Name'
                        rules={[
                            {
                                required: true,
                                message: 'Please input name',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label='Description'
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Create Template
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {currentItem ? (
                <Modal
                    key={currentItem.id}
                    title="Edit"
                    visible={isEditTemplateModalVisible}
                    onCancel={handleCancelEditTemplate}
                    footer={null}
                >
                    <Form
                        key={currentItem.id}
                        {...formItemLayout}
                        form={form}
                        name="edit"
                        onFinish={onFinishEditTemplate}
                        scrollToFirstError
                        initialValues={{
                            id: currentItem.id,
                            Name: currentItem.name,
                            description: currentItem.description
                        }}
                    >
                        <Form.Item name="id" hidden={true}>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                            name="Name"
                            label='Name'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input name',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label='Description'
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
