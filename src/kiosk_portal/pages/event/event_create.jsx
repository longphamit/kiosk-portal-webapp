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
    Card,
    Spin
} from 'antd';

import moment from 'moment';
import { Option } from "antd/lib/mentions";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createEventService, getEventByIdService, updateEventService, updateListImage, updateListImageService } from '../../services/event_service';
import { beforeUpload } from "../../../@app/utils/image_util";
import { getListDistrictService, getListWardService } from "../../services/location_services";
import { getListProvinceService } from '../../services/map_service';
import { toast } from 'react-toastify';
import { getBase64 } from '../../../@app/utils/file_util';


import "./styles.css"
import { TYPE_LOCAL, TYPE_SERVER } from '../../../@app/constants/key';
import { localStorageGetReduxState } from '../../../@app/services/localstorage_service';
import { ROLE_ADMIN, ROLE_LOCATION_OWNER } from '../../../@app/constants/role';
import { FILE_UPLOAD_URL } from '../../../@app/utils/api_links';
import { ACCEPT_IMAGE } from '../../constants/accept_file';
import { EVENT_DETAILS_HREF, EVENT_DETAILS_LABEL, EVENT_MANAGER_HREF, EVENT_MANAGER_LABEL } from '../../components/breadcumb/breadcumb_constant';
import CustomBreadCumb from '../../components/breadcumb/breadcumb';
import { formItemLayout, tailFormItemLayout } from '../../layouts/form_layout';
import { checkDateTime, toStringDateTimePicker } from './checkdatetime';
const { TextArea } = Input;
const CITY_TYPE = "CITY";
const WARD_TYPE = "WARD";
const DISTRICT_TYPE = "DISTRICT";
export const EventCreatingPage = () => {
    const [isDisbale, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentEvent, setCurrentEvent] = useState();
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);
    const [proviceOptions, setProviceOptions] = useState([]);
    const [form] = Form.useForm();
    const [formUploadImages] = Form.useForm();
    const [fileListImage, setFileListImage] = useState();
    const loadDistrict = async (selectedOptions) => {
        form.setFieldsValue({ district: undefined, ward: undefined });
        getDistricts(selectedOptions);
    };
    const getDistricts = async (selectedCity) => {
        try {
            let res = await getListDistrictService(selectedCity);
            setDistrictOptions(res.data);
            return;
        } catch (err) {
            console.error(err);
        }
    }
    const getWards = async (selectedDistrict) => {
        try {
            let res = await getListWardService(selectedDistrict);
            setWardOptions(res.data);
        } catch (err) {
            console.error(err);
        }
    }
    const onDistrictChange = async (value) => {
        form.setFieldsValue({ ward: undefined });
        getWards(value);
    };
    const onNavigate = (url) => {
        navigate(url);
    };
    const getInitValue = async () => {
        let id = searchParams.get("id");
        if (id == null) {
            onNavigate("/././unauth");
            return;
        }
        try {
            let res = await getEventByIdService(id);

            ((res.data.type == TYPE_LOCAL && localStorageGetReduxState().auth.role == ROLE_LOCATION_OWNER) ||
                (res.data.type == TYPE_SERVER && localStorageGetReduxState().auth.role == ROLE_ADMIN)) ?
                setDisable(false) : setDisable(true)

            console.log(isDisbale)
            setCurrentEvent(res.data);
            const resProvinces = await getListProvinceService();
            setProviceOptions(resProvinces.data);
            //set up init list district
            let codeProvince = resProvinces.data.find(
                (element) => element.name === res.data.city
            ).code;
            const resDistrict = await getListDistrictService(codeProvince);
            setDistrictOptions(resDistrict.data);
            //set up init list ward
            let codeDistrict = resDistrict.data.find(
                (element) => element.name === res.data.district
            ).code;
            const resWard = await getListWardService(codeDistrict);
            setWardOptions(resWard.data);

            let list = [];
            await Promise.all(res.data.listImage.map((img, index) => {
                list.push({
                    uid: img.id,
                    name: "image" + (parseInt(index) + 1),
                    status: "done",
                    url: img.link,
                });
            }));
            setFileListImage(list);

        } catch (error) {
            console.error(error)
            setCurrentEvent({});
        }

    };
    const onFinishCreateEvent = async (values) => {
        try {
            setIsLoading(true);
            //Check date time of event
            let msg = checkDateTime(values.dateStart, values.timeStart, values.timeEnd, values.dateEnd);
            if (!msg || msg.length !== 0) {
                toast.error(msg);
                setIsLoading(false);
                return;
            }
            let thumbnail = (await getBase64(values.thumbnail.file.originFileObj)).split(",")[1];

            let listImage = [];
            if (values.listImage !== undefined)
                await Promise.all(values.listImage.fileList.map(async (value) => {
                    let result = (await getBase64(value.originFileObj)).split(",")[1];
                    listImage.push(result);
                }));
            let data = {
                "name": values.name,
                "description": values.description,
                "thumbnail": thumbnail,
                "timeStart": toStringDateTimePicker(values.dateStart, values.timeStart),
                "timeEnd": toStringDateTimePicker(values.dateEnd, values.timeEnd),
                "ward": getName(wardOptions, values.ward),
                "district": getName(districtOptions, values.district),
                "city": getName(proviceOptions, values.provice),
                "address": values.address,
                "listImage": listImage
            };
            let res = await createEventService(data);
            toast.success('Create successful');
        } catch (error) {
            toast.error('Create failed!')
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    };
    let navigate = useNavigate();
    useEffect(async () => {
        getInitValue();
    }, []);
    const getDefaultName = (type) => {
        switch (type) {
            case CITY_TYPE:
                return currentEvent.city;
            case DISTRICT_TYPE:
                return currentEvent.district;
            case WARD_TYPE:
                return currentEvent.ward;
        }
    }
    const getName = (list, code, type) => {
        // initial ward and district
        if (list.length === 0) {
            return getDefaultName(type);
        }
        // initial city value is a name, not a code
        if (isNaN(parseInt(code))) {
            return getDefaultName(type);
        }
        for (let obj of list) {
            if (obj.code === code) {
                return obj.name
            }
        }

    }

    const breadCumbData = [
        {
            href: EVENT_MANAGER_HREF,
            label: EVENT_MANAGER_LABEL,
            icon: null
        },
        {
            href: EVENT_DETAILS_HREF,
            label: EVENT_DETAILS_LABEL,
            icon: null
        }
    ]
    return (<>
        <CustomBreadCumb props={breadCumbData} />
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
                rules={[
                    {
                        required: true,
                        message: 'Please input the address',
                    },
                ]}
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
                name="thumbnail"
                label="thumbnail"
                rules={[
                    {
                        required: true,
                        message: "Please choose application logo!",
                    },
                ]}
            >
                <Upload
                    action={FILE_UPLOAD_URL}
                    listType="picture"
                    maxCount={1}
                    accept={ACCEPT_IMAGE}
                    beforeUpload={beforeUpload}
                >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Form.Item>
            <Form.Item
                name="listImage"
                label="List Image"
                rules={[
                    {
                        required: true,
                        message: "Please choose list image",
                    },
                ]}
            >
                <Upload
                    action={FILE_UPLOAD_URL}
                    listType="picture"
                    maxCount={5}
                    accept={ACCEPT_IMAGE}
                    beforeUpload={beforeUpload}
                >
                    <Button icon={<UploadOutlined />}>Upload ( Max:5 )</Button>
                </Upload>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                {isLoading === false ?
                    <Button type="primary" htmlType="submit">
                        Create Event
                    </Button> : <Spin />
                }
            </Form.Item>
        </Form>
    </>);
}
