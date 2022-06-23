import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    TimePicker,
    Upload,
    Row,
    Col,
    Modal,
} from 'antd';
import moment from 'moment';
import { Option } from "antd/lib/mentions";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getEventByIdService, updateEventService } from '../../services/event_service';
import { beforeUpload } from "../../../@app/utils/image_util";
import { getListDistrictService, getListWardService } from "../../services/location_services";
import { getListProvinceService } from '../../services/map_service';
import { toast } from 'react-toastify';
import { getBase64 } from '../../../@app/utils/file_util';

const { TextArea } = Input;

export const EventDetailsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentEvent, setCurrentEvent] = useState();
    const [componentDisabled, setComponentDisabled] = useState(true);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);
    const [proviceOptions, setProviceOptions] = useState([]);
    const [form] = Form.useForm();
    const [formUploadImages] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fileListImage, setFileListImage] = useState([]);
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
    const onNavigate = (url) => {
        navigate(url);
    };
    const getCity = async () => {
        try {
            let res = await getListProvinceService();
            setProviceOptions(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    let navigate = useNavigate();
    useEffect(async () => {
        getEventInfo();
        getCity();
    }, []);
    const onClickSubmit = async (values) => {
        // Editing
        if (componentDisabled) {
            setComponentDisabled(false);
            return;
        }
        // Update event
        // Check thumbnail must import 
        let thumbnail = values.thumbnail;
        if (!checkThumbnail(thumbnail)) {
            toast.warn('Please add a thumbnail image');
            return;
        }
        const getName = (list, code) => {
            for (let obj of list) {
                if (obj.code == code) {
                    return obj.name
                }
            }
        }
        let base64Thumnail = '';
        if (thumbnail.file === undefined) {
            //convert base64 from img url
        } else {
            base64Thumnail = (await getBase64(thumbnail.file.originFileObj)).split(",")[1];
        }
        let data = {
            "id": '',
            "name": values.name,
            "description": values.description,
            "timeStart": toStringDateTimePicker(values.dateStart, values.timeStart),
            "timeEnd": toStringDateTimePicker(values.dateEnd, values.timeEnd),
            "ward": getName(wardOptions, values.ward),
            "district": getName(districtOptions, values.district),
            "city": getName(proviceOptions, values.provice),
            "address": values.address,
            "image": base64Thumnail,
            "imageId": currentEvent.thumbnail.id,
        };
        console.log(data);
        try {
            updateEventService(data);
            setComponentDisabled(true);
        } catch (e) {
            console.log(e);
        }
    }
    const formatDatePicker = (str) => {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    const toStringDateTimePicker = (date, time) => {
        return formatDatePicker(date) + time._d.toISOString().slice(10,);
    }
    const checkThumbnail = (thumbnail) => {
        try {
            if (thumbnail.file.originFileObj == undefined) {
                return false;
            }
        } catch (e) {
            return true;
        }
        return true;
    }
    const getEventInfo = async () => {
        let id = searchParams.get("id");
        if (id == null) {
            onNavigate('/././unauth')
            return;
        }
        try {
            let res = await getEventByIdService(id);
            setCurrentEvent(res.data);
        } catch (e) {
            console.log(e)
            setCurrentEvent({});
        }
    }
    const formatTime = 'HH:mm';
    const formatDate = "DD/MM/YYYY";
    const getTime = (str) => {
        return moment(str).format(formatTime);
    }
    const getDate = (str) => {
        return moment(str).format(formatDate);
    }
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const loadFileList = () => {
        let list = []
        currentEvent.listImage.map((img, index) => list.push({
            uid: img.id,
            name: "image" + (parseInt(index) + 1),
            status: "done",
            url: img.link,
        }));
        setFileListImage(list);
    }
    return (<>
        {currentEvent ?
            <Form
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 20 }}
                layout="horizontal"
                form={form}
                onFinish={onClickSubmit}
                initialValues={{
                    name: currentEvent.name,
                    city: currentEvent.city,
                    district: currentEvent.district,
                    ward: currentEvent.ward,
                    status: currentEvent.status,
                    address: currentEvent.address,
                    description: currentEvent.description,
                    dateStart: moment(getDate(currentEvent.timeStart), formatDate),
                    timeStart: moment(getTime(currentEvent.timeStart), formatTime),
                    dateEnd: moment(getDate(currentEvent.timeEnd), formatDate),
                    timeEnd: moment(getTime(currentEvent.timeEnd), formatTime),

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
                    <Input disabled={componentDisabled} />
                </Form.Item>
                <Form.Item label="Time start" style={{ marginBottom: 0 }} rules={[{ required: true, message: '' }]}>
                    <Form.Item name="dateStart"
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the start date'
                            },
                        ]}>


                        <DatePicker

                            disabled={componentDisabled}
                            placeholder="Select date"
                            format="DD/MM/YYYY"
                            allowClear={false}
                            style={{
                                height: "auto",
                                width: '100%'
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="timeStart"
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0px 0px 5px 15px' }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the event start time'
                            },
                        ]}>
                        <TimePicker allowClear={false} format='HH:mm' style={{ width: '100%' }}
                            disabled={componentDisabled} />
                    </Form.Item>
                </Form.Item>
                <Form.Item label="Time end" style={{ marginBottom: 0 }} rules={[{ required: true, message: '' }]}>
                    <Form.Item name="dateEnd"
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the end date'
                            },
                        ]}>
                        <DatePicker
                            disabled={componentDisabled}
                            placeholder="Select date"
                            format="DD/MM/YYYY"
                            allowClear={false}
                            style={{
                                height: "auto",
                                width: '100%'
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="timeEnd"
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0px 0px 5px 15px' }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the event end time'
                            },
                        ]}>
                        <TimePicker allowClear={false} format='HH:mm' style={{ width: '100%' }} disabled={componentDisabled} />
                    </Form.Item>
                </Form.Item>
                <Form.Item name='status' label="Status">
                    <Select name='status' style={{ width: '50%' }} disabled={componentDisabled}>
                        <Option value="coming soon">Coming Soon</Option>
                        <Option value="on going">On going</Option>
                        <Option value="end">End</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="city"
                    label='City'
                    rules={[
                        {
                            required: true,
                            message: 'Please input the city',
                        },
                    ]}>
                    <Select disabled={componentDisabled} defaultValue={proviceOptions[0]} onChange={loadDistrict} allowClear>
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
                    <Select id="district-select" disabled={componentDisabled}
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
                    <Select disabled={componentDisabled}>
                        {wardOptions.map(ward => (
                            <Option key={ward.code}>{ward.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="address"
                    label='Address'
                >
                    <TextArea disabled={componentDisabled} />
                </Form.Item>
                <Form.Item
                    name="description"
                    label='Description'
                >
                    <TextArea disabled={componentDisabled} />
                </Form.Item>
                <Form.Item
                    name="thumbnail"
                    label="Thumbnail"
                    getValueFromEvent={normFile}
                >
                    <Upload disabled={componentDisabled}
                        action=""
                        listType="picture"
                        maxCount={1}
                        accept=".png,.jpeg"
                        beforeUpload={beforeUpload}
                        defaultFileList={[
                            {
                                uid: "abc",
                                name: "thumbnail",
                                status: "done",
                                url: currentEvent.thumbnail.link,
                            },
                        ]}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>
                <Row justify="center" align="middle">
                    <Col>
                        <Form.Item>
                            <Button onClick={() => { loadFileList(); setVisible(true); }}>
                                Update List Image
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" > {componentDisabled ? 'Update Event' : 'Save Event'}</Button>
                        </Form.Item>
                    </Col>

                </Row>

            </Form> : null
        }
        {currentEvent ?
            <Modal
                title="List Image"
                centered
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                width={1000}
            >
                <Form form={formUploadImages}>
                    <Form.Item
                        name="listImage"
                        label="List Image"
                    >
                        {currentEvent.listImage.length > 0 ?
                            <Upload
                                action=''
                                listType="picture"
                                maxCount={5}
                                accept=".png,.jpeg"
                                beforeUpload={beforeUpload}
                                fileList={fileListImage}
                            >
                                <Button icon={<UploadOutlined />}>Upload ( Max:5 )</Button>
                            </Upload>
                            : <Upload
                                action=""
                                listType="picture"
                                maxCount={5}
                                accept=".png,.jpeg"
                                beforeUpload={beforeUpload}
                            >
                                <Button icon={<UploadOutlined />}>Upload ( Max:5 )</Button>
                            </Upload>
                        }
                    </Form.Item>
                </Form>
            </Modal> : null
        }
    </>);
}