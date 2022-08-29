import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
  Upload,
  Spin,
  Row,
  Col,
} from "antd";

import { Option } from "antd/lib/mentions";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createEventService } from "../../services/event_service";
import { beforeUpload } from "../../../@app/utils/image_util";
import { toast } from "react-toastify";
import { getBase64 } from "../../../@app/utils/file_util";

import "./styles.css";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import {
  EVENT_CREATING_LABEL,
  EVENT_MANAGER_HREF,
  EVENT_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { checkDateTime, toStringDateTimePicker } from "./checkdatetime";
import { Editor } from "primereact/editor";
import {
  EVENT_CREATING_PATH,
  EVENT_MANAGER_PATH,
} from "../../constants/path_constants";
import { getCities, getDistricts, getWards } from "./location_utils";
import {
  ERROR_INPUT_ADDRESS,
  ERROR_INPUT_DISTRICT,
  ERROR_UPLOAD_THUMBNAIL,
  ERROR_INPUT_NAME,
  ERROR_INPUT_PROVINCE,
  ERROR_INPUT_WARD,
  ERROR_SELECT_DATE_END,
  ERROR_SELECT_DATE_START,
  ERROR_SELECT_TIME_END,
  ERROR_SELECT_TIME_START,
  ERROR_UPLOAD_LIST_IMG,
  CREATE_SUCCESS,
  UPLOAD_MAXIUM_5_IMAGES,
} from "../../../@app/constants/message";
import { ImageLimitSizeTooltip } from "../../../@app/components/image/image_extra_label";
const { TextArea } = Input;

export const EventCreatingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [proviceOptions, setProviceOptions] = useState([]);
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const loadDistrict = async (selectedOptions) => {
    form.setFieldsValue({ district: undefined, ward: undefined });
    setDistrictOptions(await getDistricts(selectedOptions));
  };
  const onDistrictChange = async (value) => {
    form.setFieldsValue({ ward: undefined });
    setWardOptions(await getWards(value));
  };

  const getInitValue = async () => {
    try {
      const cities = await getCities();
      setProviceOptions(cities);
    } catch (error) {
      console.error(error);
      setProviceOptions([]);
    }
  };
  const onFinishCreateEvent = async (values) => {
    const invalidMsg = [];
    let check = true;
    setIsLoading(true);

    try {
      if (values.thumbnail.fileList.length === 0) {
        invalidMsg.push("You need to add logo\n");
        check = false;
      }
      if (values.listImage.fileList.length === 0) {
        invalidMsg.push(ERROR_UPLOAD_LIST_IMG);
        check = false;
      }
      //Check date time of event
      let msg = checkDateTime(
        values.dateStart,
        values.timeStart,
        values.timeEnd,
        values.dateEnd
      );
      if (msg.length !== 0) {
        invalidMsg.push(msg);
        check = false;
      }
      if (check) {
        let thumbnail = (
          await getBase64(values.thumbnail.file.originFileObj)
        ).split(",")[1];

        let banner = [];
        if (values.banner?.fileList[0]) {
          let resultBanner = await getBase64(values.banner.file.originFileObj);
          banner = resultBanner.split(",");
        }

        let listImage = [];
        if (values.listImage !== undefined)
          await Promise.all(
            values.listImage.fileList.map(async (value) => {
              let result = (await getBase64(value.originFileObj)).split(",")[1];
              listImage.push(result);
            })
          );
        let data = {
          name: values.name,
          description: description ?? "",
          thumbnail: thumbnail,
          timeStart: toStringDateTimePicker(values.dateStart, values.timeStart),
          timeEnd: toStringDateTimePicker(values.dateEnd, values.timeEnd),
          ward: getName(wardOptions, values.ward),
          district: getName(districtOptions, values.district),
          city: getName(proviceOptions, values.provice),
          address: values.address,
          listImage: listImage,
          banner: banner[1],
        };
        await createEventService(data);
        toast.success(CREATE_SUCCESS);
        navigate(EVENT_MANAGER_PATH);
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
  const getName = (list, code) => {
    for (let obj of list) {
      if (obj.code === code) {
        return obj.name;
      }
    }
  };
  let navigate = useNavigate();
  useEffect(async () => {
    getInitValue();
  }, []);

  const breadCumbData = [
    {
      href: EVENT_MANAGER_HREF,
      label: EVENT_MANAGER_LABEL,
      icon: null,
    },
    {
      href: EVENT_CREATING_PATH,
      label: EVENT_CREATING_LABEL,
      icon: null,
    },
  ];
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinishCreateEvent}
        scrollToFirstError
        initialValues={{
          hiddenField: "hiddenImg",
        }}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 20 }}
      >
        <Row>
          <Col span={11}>
            <Form.Item
              name="name"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              label="Name"
              rules={[
                {
                  required: true,
                  message: ERROR_INPUT_NAME,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Time start"
              labelCol={{ span: 4 }}
              style={{ marginBottom: 0 }}
              wrapperCol={{ span: 20 }}
              rules={[{ required: true, message: ERROR_SELECT_TIME_START }]}
            >
              <Form.Item
                name="dateStart"
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                rules={[
                  {
                    required: true,
                    message: ERROR_SELECT_DATE_START,
                  },
                ]}
              >
                <DatePicker
                  placeholder="Select date"
                  format="DD/MM/YYYY"
                  allowClear={false}
                  style={{
                    height: "auto",
                    width: "100%",
                  }}
                />
              </Form.Item>
              <Form.Item
                name="timeStart"
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "0px 0px 0px 15px",
                }}
                rules={[
                  {
                    required: true,
                    message: ERROR_SELECT_TIME_START,
                  },
                ]}
              >
                <TimePicker
                  allowClear={false}
                  format="HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item
              label="Time end"
              labelCol={{ span: 4 }}
              style={{ marginBottom: 0 }}
              wrapperCol={{ span: 20 }}
              rules={[{ required: true, message: ERROR_SELECT_TIME_END }]}
            >
              <Form.Item
                name="dateEnd"
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                rules={[
                  {
                    required: true,
                    message: ERROR_SELECT_DATE_END,
                  },
                ]}
              >
                <DatePicker
                  placeholder="Select date"
                  format="DD/MM/YYYY"
                  allowClear={false}
                  style={{
                    height: "auto",
                    width: "100%",
                  }}
                />
              </Form.Item>
              <Form.Item
                name="timeEnd"
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "0px 0px 0px 15px",
                }}
                rules={[
                  {
                    required: true,
                    message: ERROR_SELECT_TIME_END,
                  },
                ]}
              >
                <TimePicker
                  allowClear={false}
                  format="HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Form.Item>
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
            <Row style={{ marginLeft: 0 }}>
              <Col span={12}>
                <Form.Item
                  name="provice"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label="Province"
                  rules={[
                    {
                      required: true,
                      message: ERROR_INPUT_PROVINCE,
                    },
                  ]}
                >
                  <Select
                    defaultValue={proviceOptions[0]}
                    onChange={loadDistrict}
                    allowClear
                  >
                    {proviceOptions.map((province) => (
                      <Option key={province.code}>{province.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="thumbnail"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label="Logo"
                  rules={[
                    {
                      required: true,
                      message: ERROR_UPLOAD_THUMBNAIL,
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
                <Form.Item
                  name="listImage"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label="List Image"
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
                    <Button icon={<UploadOutlined />}>
                      {UPLOAD_MAXIUM_5_IMAGES}
                    </Button>
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
                  <Select id="district-select" onChange={onDistrictChange}>
                    {districtOptions.map((district) => (
                      <Option key={district.code}>{district.name}</Option>
                    ))}
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
                  <Select>
                    {wardOptions.map((ward) => (
                      <Option key={ward.code}>{ward.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="banner"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
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
        <Row justify="center" align="middle">
          <Form.Item>
            {isLoading === false ? (
              <Button type="primary" htmlType="submit">
                Create Event
              </Button>
            ) : (
              <Spin />
            )}
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};
