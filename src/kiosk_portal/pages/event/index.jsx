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
    Table,
    TimePicker,
    Upload
} from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import { Option } from "antd/lib/mentions";
import { createEventService, getListEventService } from "../../services/event_service";
import TextArea from "antd/lib/input/TextArea";
import { getListDistrictService, getListProviceService, getListWardService } from "../../services/location_services";
import { getBase64 } from "../../../@app/utils/file_util";

const EventManagerPage = () => {
    const [totalEvent, setTotalEvent] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [querySearch, setQuerySearch] = useState('');
    const [numEventInPage, setNumEventInPage] = useState(10);
    const [currentItem, setCurrentItem] = useState(null);
    const [isCreateEventModalVisible, setIsCreateEventModalVisible] =
        useState(false);
    const [proviceOptions, setProviceOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);
    const [listEvent, setListEvent] = useState([]);
    const [isEditEventModalVisible, setIsEditEventModalVisible] =
        useState(false);
    const [form] = Form.useForm();
    const getCity = async () => {
        try {
            let res = await getListProviceService();
            setProviceOptions(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    const getListEventFunction = async (currentPageToGetList, numInPage) => {
        try {
            let name = querySearch !== '' ? querySearch : '';
            const res = await getListEventService(currentPageToGetList, numInPage, name, '', '', '');
            setTotalEvent(res.data.metadata.total);
            setListEvent(res.data.data);
            return;
        } catch (error) {
            console.log(error);
        }
    };
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
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
    const types = [
        {
            name: "Name",
            label: "Name",
        }
    ];
    const prefixSearch = (
        <Form.Item name="type" noStyle>
            <Select defaultValue="Name">
                {types.map((item) => {
                    return <Option value={item.name}>{item.label}</Option>;
                })}
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
    const showModalCreateEvent = () => {
        getCity();
        setIsCreateEventModalVisible(true);
        form.resetFields();
    };

    const onFinishEditEvent = async (values) => {
        let data = {
            id: values.id,
            name: values.Name ?? "",
            description: values.description ?? ""
        }
        try {
            // const res = await updateTemplateService(data);
            // handleCancelEditTemplate();
            // toast("Update successful");
            // getListTemplateFunction(currentPage, numTemplateInPage)
        } catch (e) {
            toast("Update failed");
        }
    };
    const formatDatePicker = (str) => {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    const formatTimePicker = (str) => {
        var date = new Date(str);
        var hours = ("0" + date.getHours()).slice(-2);
        var minutes = ("0" + date.getMinutes()).slice(-2);
        var second = ("0" + date.getSeconds()).slice(-2);
        return [hours, minutes, second].join(":");
    }
    const compare2dates = (d1, d2) => {
        return formatDatePicker(d1) === formatDatePicker(d2);
    }
    const toStringDateTimePicker = (date, time) => {
        return formatDatePicker(date) + time._d.toISOString().slice(10,);
    }
    const onFinishCreateEvent = async (values) => {
        var today = new Date();
        try {

            if (values.dateStart - today < 0) {
                toast.error("Date start cannot be today");
                return;
            }

            if (values.dateEnd - values.dateStart < 0) {
                toast.error("Start date must be earlier than end date");
                return;
            }
            if (compare2dates(values.dateEnd, values.dateStart) && (values.timeEnd - values.timeStart < 0)) {
                toast.error("Start time must be earlier than end time");
                return;
            }

            let data = {
                "name": values.name,
                "description": values.description,
                "image": document.getElementById(values.hiddenField).value,
                "timeStart": toStringDateTimePicker(values.dateStart, values.timeStart),
                "timeEnd": toStringDateTimePicker(values.dateEnd, values.timeEnd),
                "street": "string",
                "ward": getName(wardOptions, values.ward),
                "district": getName(districtOptions, values.district),
                "city": getName(proviceOptions, values.provice),
                "address": values.address,

            };
            // console.log(values);
            console.log(data);
            await createEventService(data);
            getListEventFunction(currentPage, numEventInPage);
            setIsCreateEventModalVisible(false);
            toast.success('Create successful');
        } catch (error) {
            toast.error('Create failed!')
            console.log(error);
        }
    };
    const getName = (list, code) => {
        // console.log(list)
       for(let obj of list){
           if(obj.code == code ){
               return obj.name
           }
       }
    }
    const onFinishSearch = async (values) => {
        try {
            // const res = await getListTemplateService(1, numTemplateInPage, values.searchString);
            // setCurrentPage(1);
            // setTotalTemplate(res.data.metadata.total);
            // setListTemplate(res.data.data);
        } catch (e) {
            toast("Cannot found!")
        }

    };
    const showModalEditEvent = () => {
        setIsEditEventModalVisible(true);
    };
    const handleCancelCreateEvent = () => {
        setIsCreateEventModalVisible(false);
    };
    const handleCancelEditEvent = () => {
        setIsEditEventModalVisible(false);
    };
    const handleDeleteEvent = async (record) => {
        console.log(record);
        Modal.confirm({
            title: 'Confirm delete the event',
            okText: "Yes",
            cancelText: 'No',
            onOk: async () => {
                {
                    // try {
                    //     await deleteTemplateService(record.id);
                    //     getListTemplateFunction(currentPage, numTemplateInPage);
                    //     toast("Delete successful");
                    // } catch (e) {
                    //     toast("Delete failed");
                    // }
                }
            },
        });
    };
    const loadDistrict = async (selectedOptions) => {
        form.setFieldsValue({ district: undefined, ward: undefined });
        try {
            let res = await getListDistrictService(selectedOptions);
            setDistrictOptions(res.data);
            return;
        } catch (err) {

        }
    };
    const onDistrictChange = async (value) => {
        form.setFieldsValue({ ward: undefined });
        try {
            let res = await getListWardService(value);
            setWardOptions(res.data);
        } catch (err) {

        }
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
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Description',
            dataIndex: "description",
            key: "description",
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Time Start',
            dataIndex: "timeStart",
            key: "timeStart",
            render: (text) => {
                let data = convertDate(text);
                return <><a>{data.date}</a><br /><a>{data.time}</a></>
            },
        },
        {
            title: 'Time End',
            dataIndex: "timeEnd",
            key: "timeEnd",
            render: (text) => {
                let data = convertDate(text);
                return <><a>{data.date}</a><br /><a>{data.time}</a></>
            },
        },
        {
            title: 'Address',
            dataIndex: "address",
            key: "address",
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
                            showModalEditEvent();
                        }}
                    >
                        Edit
                    </Button>

                    <Button
                        type="primary"
                        shape="default"
                        name={record}
                        onClick={() => {
                            handleDeleteEvent(record);
                        }}
                    >
                        Delete
                    </Button>

                </Space>
            ),
        },
    ];
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
                        onClick={showModalCreateEvent}
                    >
                        Create Event
                    </Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={listEvent} pagination={false} />
            <Pagination
                defaultCurrent={1}
                total={totalEvent}
                pageSize={5}
                onChange={handleChangeNumberOfPaging}
            />

            <Modal
                title='Create event'
                visible={isCreateEventModalVisible}
                onCancel={handleCancelCreateEvent}
                footer={null}
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinishCreateEvent}
                    scrollToFirstError
                    initialValues={{
                        hiddenField: 'hiddenImg'
                    }}
                >
                    <Form.Item
                        name="name"
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

                    <Form.Item name="dateStart" label='Date start'
                        rules={[
                            {
                                required: true,
                                message: 'Please input the start date'
                            },
                        ]}>


                        <DatePicker
                            placeholder="Select date"
                            format="DD/MM/YYYY"
                            allowClear={false}
                            style={{
                                height: "auto"
                            }}
                        />
                    </Form.Item>

                    <Form.Item name="timeStart" label='Time start'
                        rules={[
                            {
                                required: true,
                                message: 'Please input the event start time'
                            },
                        ]}>
                        <TimePicker allowClear={false} format='HH:mm' />
                    </Form.Item>



                    <Form.Item name="dateEnd" label='Date end'
                        rules={[
                            {
                                required: true,
                                message: 'Please input the end date'
                            },
                        ]}>
                        <DatePicker
                            placeholder="Select date"
                            format="DD/MM/YYYY"
                            allowClear={false}
                            style={{
                                height: "auto",
                                width: "auto",
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="timeEnd" label='Time end'
                        rules={[
                            {
                                required: true,
                                message: 'Please input the event end time'
                            },
                        ]}>
                        <TimePicker allowClear={false} format='HH:mm' />
                    </Form.Item>
                    <Form.Item
                        name="provice"
                        label='Provice'
                        rules={[
                            {
                                required: true,
                                message: 'Please input the provice',
                            },
                        ]}>
                        <Select defaultValue={proviceOptions[0]} onChange={loadDistrict} allowClear>
                            {proviceOptions.map(province => (
                                <Option key={province.code}>{province.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="district"
                        label='District'
                        rules={[
                            {
                                required: true,
                                message: 'Please input the district',
                            },
                        ]}>
                        <Select id="district-select"
                            onChange={onDistrictChange}>
                            {districtOptions.map(district => (
                                <Option key={district.code}>{district.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="ward"
                        label='Ward'
                        rules={[
                            {
                                required: true,
                                message: 'Please input the ward',
                            },
                        ]}>
                        <Select >
                            {wardOptions.map(ward => (
                                <Option key={ward.code}>{ward.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label='Address'
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label='Description'
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Image"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the district',
                            },
                        ]}>
                        <Input type='file' accept="image/*" onChange={async (event) => {
                            let img = await getBase64(event.target.files[0]);
                            document.getElementById('hiddenImg').value = img.replace(/^data:.+;base64,/, '')
                        }}
                        />
                    </Form.Item>
                    <Form.Item name="hiddenField" hidden={true}>
                        <Input type='hidden' id="hiddenImg" />
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Create Event
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {currentItem ? (
                <Modal
                    key={currentItem.id}
                    title="Edit"
                    visible={isEditEventModalVisible}
                    onCancel={handleCancelEditEvent}
                    footer={null}
                >
                    <Form
                        key={currentItem.id}
                        {...formItemLayout}
                        form={form}
                        name="edit"
                        onFinish={onFinishEditEvent}
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
export default EventManagerPage;
