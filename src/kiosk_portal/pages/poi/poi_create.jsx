import { formatTimePicker } from "../../../@app/utils/date_util";
import {
    getListDistrictService,
    getListProvinceService,
    getListWardService,
} from "../../services/map_service";
import { createPoiService } from "../../services/poi_service";
import { toast } from "react-toastify";
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    TimePicker,
    Upload,
    Spin,
} from "antd";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout } from "../../layouts/form_layout";
import { useEffect, useState } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { Editor } from "primereact/editor";
import {
    ERROR_INPUT_ADDRESS,
    ERROR_SELECT_CATEGORY,
    ERROR_INPUT_DISTRICT,
    ERROR_INPUT_NAME,
    ERROR_INPUT_WARD,
    ERROR_SELECT_TIME_END,
    ERROR_SELECT_TIME_START,
    ERROR_UPLOAD_LOGO,
    ERROR_CHECKBOX_DATE_OF_WEEK,
    ERROR_UPLOAD_LIST_IMG,
    CREATE_SUCCESS,
    ERROR_INPUT_PROVINCE,
    UPLOAD_MAXIUM_5_IMAGES,
} from "../../../@app/constants/message";
import { ImageLimitSizeTooltip } from "../../../@app/components/image/image_extra_label";
import { getListPoiCategoriesService } from "../../services/poi_category_service";
import { POI_CREATING_LABEL, POI_MANAGER_HREF, POI_MANAGER_LABEL } from "../../components/breadcumb/breadcumb_constant";
import { POI_CREATING_PATH } from "../../constants/path_constants";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { useNavigate } from "react-router-dom";

export const POICreatePage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [listDistrictsInForm, setListDistrictsInForm] = useState([]);
    const [listWardsInForm, setListWardsInForm] = useState([]);
    const { Option } = Select;
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [listProvinces, setListProvinces] = useState([]);
    const [listPoiCategories, setListPoiCategories] = useState([]);
    const [days, setDays] = useState([]);
    useEffect(async () => {
        form.resetFields();
        const resProvinces = await getListProvinceService();
        setListProvinces(resProvinces.data);
        const resPoiCategories = await getListPoiCategoriesService("", 10000, 1);
        setListPoiCategories(resPoiCategories.data.data);
    }, []);

    const handleProvinceChange = async (value) => {
        const resDistrict = await getListDistrictService(value);
        setListDistrictsInForm(resDistrict.data);
        const resWard = await getListWardService(resDistrict.data[0].code);
        setListWardsInForm(resWard.data);
        form.setFieldsValue({
            district: {
                value: resDistrict.data[0].name,
            },
            selectDistricts: {
                key: resDistrict.data[0].code,
                value: resDistrict.data[0].code,
            },
            ward: {
                value: resWard.data[0].name,
            },
            selectWards: {
                key: resWard.data[0].code,
                value: resWard.data[0].code,
            },
        });
    };

    const handleDistrictChange = async (value) => {
        const resWard = await getListWardService(value);
        setListWardsInForm(resWard.data);
        form.setFieldsValue({
            ward: {
                value: resWard.data[0].name,
            },
            selectWards: {
                key: resWard.data[0].code,
                value: resWard.data[0].code,
            },
        });
    };

    const onFinishCreatePoi = async (values) => {
        setIsLoading(true);
        const invalidMsg = [];
        var check = true;
        try {
            if (values.stringOpenTime - values.stringCloseTime > 0) {
                invalidMsg.push("Time start need to before or match with time end\n");
                check = false;
            }

            if (values.listImage.fileList.length === 0) {
                invalidMsg.push(ERROR_UPLOAD_LIST_IMG);
                check = false;
            }
            if (values.thumbnail.fileList.length === 0) {
                invalidMsg.push("You need to add logo\n");
                check = false;
            }

            if (check) {
                let objCity = listProvinces.find(
                    (element) => element.code === values.city
                );
                let objDistrict = listDistrictsInForm.find(
                    (element) => element.code === values.district
                );
                let objWard = listWardsInForm.find(
                    (element) => element.code === values.ward
                );

                if (typeof objDistrict === "undefined") {
                    objDistrict = values.district.value;
                } else {
                    objDistrict = objDistrict.name;
                }
                if (typeof objWard === "undefined") {
                    objWard = values.ward.value;
                } else {
                    objWard = objWard.name;
                }

                let thumbnail = [];
                let result = await getBase64(values.thumbnail.file.originFileObj);
                thumbnail = result.split(",");

                let banner = [];
                if (values.banner?.fileList[0]) {
                    let resultBanner = await getBase64(values.banner.file.originFileObj);
                    banner = resultBanner.split(",");
                }

                let listImage = [];
                await Promise.all(
                    values.listImage.fileList.map(async (value) => {
                        let formatImage = (await getBase64(value.originFileObj)).split(
                            ","
                        )[1];
                        listImage.push(formatImage);
                    })
                );
                let newPoi = {
                    name: values.name,
                    description: description ?? "",
                    stringOpenTime: formatTimePicker(values.stringOpenTime),
                    stringCloseTime: formatTimePicker(values.stringCloseTime),
                    dayOfWeek: values.dayOfWeek.join("-"),
                    ward: objWard,
                    district: objDistrict,
                    city: objCity.name,
                    address: values.address,
                    poicategoryId: values.poicategoryId,
                    thumbnail: thumbnail[1],
                    listImage: listImage,
                    banner: banner[1],
                };
                await createPoiService(newPoi).then(() => {
                    toast.success(CREATE_SUCCESS);
                    form.resetFields();
                });
                navigate(POI_MANAGER_HREF);
            } else {
                var errormsg = invalidMsg.join("-");
                toast.error(errormsg);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };
    const breadCumbData = [
        {
            href: POI_MANAGER_HREF,
            label: POI_MANAGER_LABEL,
            icon: null,
        },
        {
            href: POI_CREATING_PATH,
            label: POI_CREATING_LABEL,
            icon: null,
        },
    ];
    return <>
        <CustomBreadCumb props={breadCumbData} />

        <Form
            style={{ marginTop: 50 }}
            {...formItemLayout}
            form={form}
            name="registerPoi"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinishCreatePoi}
            scrollToFirstError
        >

            <Row>
                <Col span={11}>
                    <Form.Item
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        name="name"
                        label={t("name")}
                        rules={[
                            {
                                required: true,
                                message: ERROR_INPUT_NAME,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Row style={{ marginLeft: -7 }}>
                        <Col span={11} offset={1} >
                            <Form.Item
                                name="stringOpenTime"
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 16 }}
                                label={t("timestart")}
                                rules={[
                                    {
                                        required: true,
                                        message: ERROR_SELECT_TIME_START,
                                    },
                                ]}
                            >
                                <TimePicker allowClear={false} format="HH:mm" style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item
                                name="poicategoryId"
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 16 }}
                                label="Category"
                                rules={[
                                    {
                                        required: true,
                                        message: ERROR_SELECT_CATEGORY,
                                    },
                                ]}
                            >
                                <Select>
                                    {listPoiCategories.map((categories) => (
                                        <Option value={categories.id}>{categories.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="stringCloseTime"
                                label={t("timeend")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                rules={[
                                    {
                                        required: true,
                                        message: ERROR_SELECT_TIME_END,
                                    },
                                ]}
                            >
                                <TimePicker allowClear={false} format="HH:mm" style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item
                                name="dayOfWeek"
                                label={t("dayofweek")}
                                wrapperCol={{ span: 16 }}
                                labelCol={{ span: 8 }}
                                rules={[
                                    {
                                        required: true,
                                        message: ERROR_CHECKBOX_DATE_OF_WEEK,
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Please select day"
                                    defaultValue={days}
                                    onChange={(value) => setDays(value)}
                                >
                                    <Option key={1} value="Monday">{t("monday")}</Option>
                                    <Option key={2} value="Tuesday">{t("tuesday")}</Option>
                                    <Option key={3} value="Wednesday">{t("wednesday")}</Option>
                                    <Option key={4} value="Thursday">{t("thursday")}</Option>
                                    <Option key={5} value="Friday">{t("friday")}</Option>
                                    <Option key={6} value="Saturday">{t("saturday")}</Option>
                                    <Option key={7} value="Sunday">{t("sunday")}</Option>

                                </Select>
                            </Form.Item>

                        </Col>
                    </Row>
                    <Form.Item
                        name="address"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="Address"
                        rules={[
                            {
                                required: true,
                                message: ERROR_INPUT_ADDRESS,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Row style={{ marginLeft: -7 }}>
                        <Col span={11} offset={1}>
                            <Form.Item
                                name="city"
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 18 }}
                                label="Province"
                                rules={[
                                    {
                                        required: true,
                                        message: ERROR_INPUT_PROVINCE,
                                    },
                                ]}
                            >
                                <Select name="selectProvince" onChange={handleProvinceChange}>
                                    {listProvinces
                                        ? listProvinces.map((item) => (
                                            <Option key={item.code} value={item.code}>
                                                {item.name}
                                            </Option>
                                        ))
                                        : null}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="thumbnail"
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 16 }}
                                label="Logo"
                                rules={[
                                    {
                                        required: true,
                                        message: ERROR_UPLOAD_LOGO,
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
                                    {ImageLimitSizeTooltip()}
                                </Upload>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="district"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                label="District"
                                rules={[
                                    {
                                        required: true,
                                        message: ERROR_INPUT_DISTRICT,
                                    },
                                ]}
                            >
                                <Select name="selectDistricts" onChange={handleDistrictChange}>
                                    {listDistrictsInForm
                                        ? listDistrictsInForm.map((item) => (
                                            <Option key={item.code} value={item.code}>
                                                {item.name}
                                            </Option>
                                        ))
                                        : null}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="ward"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                label="Ward"
                                rules={[
                                    {
                                        required: true,
                                        message: ERROR_INPUT_WARD,
                                    },
                                ]}
                            >
                                <Select name="selectWards">
                                    {listWardsInForm
                                        ? listWardsInForm.map((item) => (
                                            <Option key={item.code} value={item.code}>
                                                {item.name}
                                            </Option>
                                        ))
                                        : null}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: -3 }}>
                        <Col span={14}>
                            <Form.Item
                                name="listImage"
                                label="List Image"
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 16 }}
                                rules={[
                                    {
                                        required: true,
                                        message: ERROR_UPLOAD_LIST_IMG,
                                    },
                                ]}
                            >
                                <Upload
                                    action={FILE_UPLOAD_URL}
                                    listType="picture"
                                    maxCount={5}
                                    multiple
                                    accept={ACCEPT_IMAGE}
                                    beforeUpload={beforeUpload}
                                >
                                    <Button icon={<UploadOutlined />}>{UPLOAD_MAXIUM_5_IMAGES}</Button>
                                    {ImageLimitSizeTooltip()}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                                name="banner"
                                label="Banner"
                            >
                                <Upload
                                    action={FILE_UPLOAD_URL}
                                    listType="picture"
                                    maxCount={1}
                                    accept={ACCEPT_IMAGE}
                                    beforeUpload={beforeUpload}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                    {ImageLimitSizeTooltip()}
                                </Upload>
                            </Form.Item>
                        </Col>

                    </Row>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="description"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="Description"
                        required
                        rules={[
                            {
                                validator(values) {
                                    if (description === null || description === "") {
                                        return Promise.reject("Please input description");
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <div style={{ marginLeft: 10 }}>
                            <Editor
                                onTextChange={(e) => setDescription(e.htmlValue)}
                                style={{ height: "370px" }}
                            />
                        </div>

                    </Form.Item>
                </Col>
            </Row>


            <Row align="middle" justify="center">
                <Form.Item >
                    {isLoading ? (
                        <Spin />
                    ) : (
                        <Button type="primary" htmlType="submit">
                            Create POI
                        </Button>
                    )}
                </Form.Item>
            </Row>
        </Form>
    </>
}