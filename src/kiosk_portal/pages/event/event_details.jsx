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
    Card
} from 'antd';

import moment from 'moment';
import { Option } from "antd/lib/mentions";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getEventByIdService, updateEventService, updateListImage, updateListImageService } from '../../services/event_service';
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
const { TextArea } = Input;
const CITY_TYPE = "CITY";
const WARD_TYPE = "WARD";
const DISTRICT_TYPE = "DISTRICT";
export const EventDetailsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentEvent, setCurrentEvent] = useState();
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);
    const [proviceOptions, setProviceOptions] = useState([]);
    const [form] = Form.useForm();
    const [formUploadImages] = Form.useForm();
    const [fileListImage, setFileListImage] = useState([]);
    const loadDistrict = async (selectedOptions) => {
        form.setFieldsValue({ district: undefined, ward: undefined });
        getDistricts(selectedOptions);
    };
    const getDistricts = async (selectedCity) => {
        try {
            let res = await getListDistrictService(selectedCity);
            console.log(selectedCity);
            setDistrictOptions(res.data);
            return;
        } catch (err) {
            console.log(err);
        }
    }
    const getWards = async (selectedDistrict) => {
        try {
            let res = await getListWardService(selectedDistrict);
            setWardOptions(res.data);
        } catch (err) {
            console.log(err);
        }
    }
    const onDistrictChange = async (value) => {
        form.setFieldsValue({ ward: undefined });
        getWards(value);
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
        getCity();
        getEventInfo();

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
    const onClickSubmit = async (values) => {
        //Start to check date time of event
        let strDateResultFromNow = moment(moment(values.dateStart).format('YYYY-MM-DD')).fromNow();

        if (strDateResultFromNow.includes('days ago')) { // Compare dateStart to today
            toast.error("Date start is over");
            return;
        }

        if (parseInt(moment(values.timeStart).format('H')) < parseInt(strDateResultFromNow.split(' ')[0])) { //Compare on hour
            toast.error("Time start must be late from now");
            return;
        } else if (parseInt(moment(values.timeStart).format('H')) == parseInt(strDateResultFromNow.split(' ')[0])) { // Compare on minute

            if (moment(values.timeStart).format('m') < moment().format('m') || moment(values.timeStart).format('m') == moment().format('m')) {
                toast.error("Time start must be late from now");
                return;
            }
        }

        let start = toStringDateTimePicker(values.dateStart, values.timeStart);
        let end = toStringDateTimePicker(values.dateEnd, values.timeEnd);
        if (start > end) { // Check ending time
            toast.error("Please recheck date and time ending");
            return;
        }
        //End to check date time of event

        let thumbnail = values.thumbnail;
        if (!checkThumbnail(thumbnail)) { // Check thumbnail must import 
            toast.warn('Please add a thumbnail image');
            return;
        }
        let base64Thumnail = '';
        if (thumbnail[0].originFileObj !== undefined) {  // Update thubnail
            try {
                base64Thumnail = (await getBase64(thumbnail[0].originFileObj)).split(",")[1]
            } catch (e) {
                console.log(e);
                return;
            }
        }
        let data = {
            "id": currentEvent.id,
            "name": values.name,
            "description": values.description,
            "timeStart": toStringDateTimePicker(values.dateStart, values.timeStart),
            "timeEnd": toStringDateTimePicker(values.dateEnd, values.timeEnd),
            "ward": getName(wardOptions, values.ward, WARD_TYPE),
            "district": getName(districtOptions, values.district, DISTRICT_TYPE),
            "city": getName(proviceOptions, values.city, CITY_TYPE),
            "address": values.address,
            "image": base64Thumnail,
            "imageId": base64Thumnail == '' ? null : currentEvent.thumbnail.id,
        };
        try {
            let res = await updateEventService(data);
            if (res.code == 200) {
                toast.success('Update Success');
                getEventInfo();
            } else if (res.code == 400) {
                toast.success(res.message);
            }

        } catch (e) {
            if (e.response.code == 400) {
                toast.error(e.response.data.message + '. Please edit date and time');
            }
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
            if (thumbnail.length == 0) {
                return false;  // Not have any image
            }
            if (thumbnail.file.originFileObj === undefined) {
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
    const onFinishUpdateListImage = async (values) => {
        //Add images

        let existingImage = [];
        let addFields = [];
        if (values.listImage === undefined || values.listImage.fileList === undefined) { // not update any image
            toast.info('Nothing changed to save!')
            return;
        } else if (values.listImage !== undefined && values.listImage.fileList !== undefined) {
            await Promise.all(values.listImage.fileList.map(async (value) => {
                if (value.uid.includes('rc-upload-')) {
                    let result = (await getBase64(value.originFileObj)).split(",")[1];
                    addFields.push(result);
                } else {
                    existingImage.push(value.uid);
                }
            }));
        }
        let removeFields = [];
        currentEvent.listImage.some((img) => {
            if (!existingImage.includes(img.id)) {
                removeFields.push(img.id);
            }
        })

        let data = {
            id: currentEvent.id,
            removeFields: removeFields,
            addFields: addFields
        }
        try {
            await updateListImageService(data);
            toast.success("Update success");
        } catch (e) {
            console.log(e)
        }
    }
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
            <Card title="Basic Information">
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
                        address: currentEvent.address,
                        description: currentEvent.description,
                        dateStart: moment(getDate(currentEvent.timeStart), formatDate),
                        timeStart: moment(getTime(currentEvent.timeStart), formatTime),
                        dateEnd: moment(getDate(currentEvent.timeEnd), formatDate),
                        timeEnd: moment(getTime(currentEvent.timeEnd), formatTime),
                        thumbnail: [
                            {
                                uid: "abc",
                                name: "thumbnail",
                                status: "done",
                                url: currentEvent.thumbnail.link,
                            },
                        ]

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
                                placeholder="Select date"
                                format="DD/MM/YYYY"
                                allowClear={false}
                                className='disable-input'
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
                            <TimePicker
                                allowClear={false} format='HH:mm'
                                style={{ width: '100%' }}
                                className='disable-input'
                            />
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
                                placeholder="Select date"
                                format="DD/MM/YYYY"
                                allowClear={false}
                                className='disable-input'
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
                            <TimePicker
                                allowClear={false}
                                format='HH:mm'
                                style={{ width: '100%' }}
                                className='disable-input'
                            />
                        </Form.Item>
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
                        <Select
                            defaultValue={proviceOptions[0]}
                            onChange={loadDistrict}
                            allowClear
                            className='disable-input'
                        >
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
                        ]}
                    >
                        <Select
                            className='disable-input'
                            onChange={onDistrictChange}
                        >
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
                        ]}
                    >
                        <Select>
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
                        label="Thumbnail"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            action={FILE_UPLOAD_URL}
                            listType="picture"
                            maxCount={1}
                            accept={ACCEPT_IMAGE}
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
                    {currentEvent.type == TYPE_SERVER && localStorageGetReduxState().auth.role == ROLE_ADMIN
                        || currentEvent.type == TYPE_LOCAL && localStorageGetReduxState().auth.role == ROLE_LOCATION_OWNER ?
                        <Row justify="center" align="middle">
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" >Update</Button>
                                </Form.Item>
                            </Col>
                        </Row> : null
                    }
                </Form>
            </Card> : null
        }
    
        {currentEvent ?
            < Card title="List Image">
                <Form form={formUploadImages}
                    onFinish={onFinishUpdateListImage}
                    initialValues={{
                        listImage: fileListImage
                    }}
                >
                    <Form.Item
                        name="listImage"
                        label="List Image"
                    >
                        {currentEvent.listImage.length > 0 ?
                            <Upload
                                action={FILE_UPLOAD_URL}
                                listType="picture"
                                maxCount={5}
                                multiple
                                accept={ACCEPT_IMAGE}
                                beforeUpload={beforeUpload}
                                defaultFileList={fileListImage}
                            >
                                <Button icon={<UploadOutlined />}>Upload ( Max:5 )</Button>
                            </Upload>
                            : <Upload
                                action={FILE_UPLOAD_URL}
                                listType="picture"
                                maxCount={5}
                                accept={ACCEPT_IMAGE}
                                beforeUpload={beforeUpload}
                            >
                                <Button icon={<UploadOutlined />}>Upload ( Max:5 )</Button>
                            </Upload>
                        }
                    </Form.Item>
                    {currentEvent.type == TYPE_SERVER && localStorageGetReduxState().auth.role == ROLE_ADMIN
                        || currentEvent.type == TYPE_LOCAL && localStorageGetReduxState().auth.role == ROLE_LOCATION_OWNER ?
                        <Form.Item>
                            <Row justify="center" align="middle">
                                <Button type='primary' htmlType="submit" >Update</Button>
                            </Row>
                        </Form.Item> : null
                    }
                </Form>
            </Card> : null
        }
    </>);
}
