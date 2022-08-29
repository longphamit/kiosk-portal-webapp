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
  Card,
  Spin,
  Skeleton,
} from "antd";

import moment from "moment";
import { Option } from "antd/lib/mentions";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getEventByIdService,
  updateBannerEventService,
  updateEventService,
  updateListImageService,
} from "../../services/event_service";
import { beforeUpload } from "../../../@app/utils/image_util";
import {
  getListDistrictService,
  getListWardService,
} from "../../services/location_services";
import { toast } from "react-toastify";
import { getBase64 } from "../../../@app/utils/file_util";
import "./styles.css";
import { TYPE_LOCAL, TYPE_SERVER } from "../../../@app/constants/key";
import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { ROLE_ADMIN, ROLE_LOCATION_OWNER } from "../../../@app/constants/role";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import {
  EVENT_DETAILS_HREF,
  EVENT_DETAILS_LABEL,
  EVENT_MANAGER_HREF,
  EVENT_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { formItemLayout } from "../../layouts/form_layout";
import { checkDateTime, toStringDateTimePicker } from "./checkdatetime";
import { getDistricts, getWards } from "./location_utils";
import { getListProvinceService } from "../../services/map_service";
import { Editor } from "primereact/editor";
import {
  ERROR_INPUT_ADDRESS,
  ERROR_INPUT_DISTRICT,
  ERROR_INPUT_NAME,
  ERROR_INPUT_PROVINCE,
  ERROR_INPUT_WARD,
  ERROR_SELECT_DATE_END,
  ERROR_SELECT_DATE_START,
  ERROR_SELECT_TIME_END,
  ERROR_SELECT_TIME_START,
  ERROR_UPLOAD_LIST_IMG,
  ERROR_UPLOAD_LOGO,
  UPDATE_SUCCESS,
  UPLOAD_MAXIUM_5_IMAGES,
} from "../../../@app/constants/message";
import { customSort } from "../../../@app/utils/sort";
import { ImageLimitSizeTooltip } from "../../../@app/components/image/image_extra_label";
const { TextArea } = Input;
const CITY_TYPE = "CITY";
const WARD_TYPE = "WARD";
const DISTRICT_TYPE = "DISTRICT";
export const EventDetailsPage = () => {
  const [description, setDescription] = useState("");
  const [isDisbale, setDisable] = useState(false);
  const [isLoadingListImage, setIsLoadingListImage] = useState(false);
  const [isLoadingBasicInfo, setIsLoadingBasicInfo] = useState(false);
  const [isUpdateListImage, setUpdateListImage] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentEvent, setCurrentEvent] = useState();
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [proviceOptions, setProviceOptions] = useState([]);
  const [form] = Form.useForm();
  const [formUploadImages] = Form.useForm();
  const [formUploadBanner] = Form.useForm();
  const [fileListImage, setFileListImage] = useState();
  const [isLoadingBanner, setIsLoadingBanner] = useState(false);
  const loadDistrict = async (selectedOptions) => {
    form.setFieldsValue({ district: undefined, ward: undefined });
    setDistrictOptions(await getDistricts(selectedOptions));
  };
  const onDistrictChange = async (value) => {
    form.setFieldsValue({ ward: undefined });
    setWardOptions(await getWards(value));
  };
  const onNavigate = (url) => {
    navigate(url);
  };
  const getInitValue = async () => {
    let id = searchParams.get("id");
    if (id === null) {
      onNavigate("/././unauth");
      return;
    }
    try {
      let res = await getEventByIdService(id);

      (res.data.type === TYPE_LOCAL &&
        localStorageGetReduxState().auth.role === ROLE_LOCATION_OWNER) ||
      (res.data.type === TYPE_SERVER &&
        localStorageGetReduxState().auth.role === ROLE_ADMIN)
        ? setDisable(false)
        : setDisable(true);

      setCurrentEvent(res.data);
      setDescription(res.data.description);
      const resProvinces = await getListProvinceService();
      setProviceOptions(customSort(resProvinces.data));
      //set up init list district
      let codeProvince = resProvinces.data.find(
        (element) => element.name === res.data.city
      ).code;
      const resDistrict = await getListDistrictService(codeProvince);
      setDistrictOptions(customSort(resDistrict.data));
      //set up init list ward
      let codeDistrict = resDistrict.data.find(
        (element) => element.name === res.data.district
      ).code;
      const resWard = await getListWardService(codeDistrict);
      setWardOptions(customSort(resWard.data));

      let list = [];
      await Promise.all(
        res.data.listImage.map((img, index) => {
          list.push({
            uid: img.id,
            name: "image" + (parseInt(index) + 1),
            status: "done",
            url: img.link,
          });
        })
      );
      setFileListImage(list);
    } catch (error) {
      console.error(error);
      setCurrentEvent({});
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
  };
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
        return obj.name;
      }
    }
  };
  const onClickSubmit = async (values) => {
    try {
      setIsLoadingBasicInfo(true);
      //Start to check date time of event
      let msg = checkDateTime(
        values.dateStart,
        values.timeStart,
        values.timeEnd,
        values.dateEnd
      );
      if (!!msg || msg.length !== 0) {
        toast.error(msg);
        setIsLoadingBasicInfo(false);
        return;
      }
      //End to check date time of event

      let thumbnail = values.thumbnail;
      if (!checkThumbnail(thumbnail)) {
        // Check thumbnail must import
        toast.warn("Please add a logo image");
        setIsLoadingBasicInfo(true);
        return;
      }
      let base64Thumnail = "";
      if (thumbnail[0].originFileObj !== undefined) {
        // Update thubnail
        try {
          base64Thumnail = (await getBase64(thumbnail[0].originFileObj)).split(
            ","
          )[1];
        } catch (e) {
          console.error(e);
          setIsLoadingBasicInfo(false);
          return;
        }
      }
      let data = {
        id: currentEvent.id,
        name: values.name,
        description: description,
        timeStart: toStringDateTimePicker(values.dateStart, values.timeStart),
        timeEnd: toStringDateTimePicker(values.dateEnd, values.timeEnd),
        ward: getName(wardOptions, values.ward, WARD_TYPE),
        district: getName(districtOptions, values.district, DISTRICT_TYPE),
        city: getName(proviceOptions, values.city, CITY_TYPE),
        address: values.address,
        image: base64Thumnail,
        imageId: base64Thumnail === "" ? null : currentEvent.thumbnail.id,
      };
      let res = await updateEventService(data);
      toast.success(UPDATE_SUCCESS);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingBasicInfo(false);
    }
  };

  const checkThumbnail = (thumbnail) => {
    try {
      if (thumbnail.length === 0) {
        return false; // Not have any image
      }
      if (thumbnail.file.originFileObj === undefined) {
        return false;
      }
    } catch (e) {
      return true;
    }
    return true;
  };

  const formatTime = "HH:mm";
  const formatDate = "DD/MM/YYYY";
  const getTime = (str) => {
    return moment(str).format(formatTime);
  };
  const getDate = (str) => {
    return moment(str).format(formatDate);
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFinishUpdateBanner = async (values) => {
    try {
      setIsLoadingBanner(true);
      let banner = "";
      let isChange = true;
      if (typeof values.banner === "undefined") {
        isChange = false;
        toast.error("Your img is not change");
      } else if (values.banner.length === 0) {
        banner = "";
      } else {
        banner = (await getBase64(values.banner[0].originFileObj)).split(
          ","
        )[1];
      }
      if (isChange) {
        const updateBanner = {
          eventId: currentEvent.id,
          banner: banner,
        };
        await updateBannerEventService(updateBanner);
        toast.success(UPDATE_SUCCESS);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingBanner(false);
    }
  };

  const onFinishUpdateListImage = async (values) => {
    try {
      setIsLoadingListImage(true);
      let isCheck = true;

      if (!isUpdateListImage) {
        toast.info("Nothing changed!");
        return;
      }
      if (values.listImage.fileList.length === 0) {
        isCheck = false;
        toast.error(ERROR_UPLOAD_LIST_IMG);
      }
      if (isCheck) {
        //Add images
        let existingImage = [];
        let addFields = [];
        if (
          values.listImage === undefined ||
          values.listImage.fileList === undefined
        ) {
          // not update any image
          toast.info("Nothing changed!");
          setIsLoadingListImage(false);
          return;
        } else if (
          values.listImage !== undefined &&
          values.listImage.fileList !== undefined
        ) {
          await Promise.all(
            values.listImage.fileList.map(async (value) => {
              if (value.uid.includes("rc-upload-")) {
                let result = (await getBase64(value.originFileObj)).split(
                  ","
                )[1];
                addFields.push(result);
              } else {
                existingImage.push(value.uid);
              }
            })
          );
        }
        let removeFields = [];
        currentEvent.listImage.some((img) => {
          if (!existingImage.includes(img.id)) {
            removeFields.push(img.id);
          }
        });

        let data = {
          id: currentEvent.id,
          removeFields: removeFields,
          addFields: addFields,
        };
        await updateListImageService(data);
        toast.success(UPDATE_SUCCESS);
        setUpdateListImage(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingListImage(false);
    }
  };
  const breadCumbData = [
    {
      href: EVENT_MANAGER_HREF,
      label: EVENT_MANAGER_LABEL,
      icon: null,
    },
    {
      href: EVENT_DETAILS_HREF,
      label: EVENT_DETAILS_LABEL,
      icon: null,
    },
  ];
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      {currentEvent ? (
        <>
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
                ],
              }}
            >
              <Row>
                <Col span={11}>
                  <Form.Item
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    name="name"
                    label={"Name"}
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
                    wrapperCol={{ span: 20 }}
                    style={{ marginBottom: 0 }}
                    rules={[
                      { required: true, message: ERROR_SELECT_TIME_START },
                    ]}
                  >
                    <Form.Item
                      name="dateStart"
                      style={{
                        display: "inline-block",
                        width: "calc(50% - 8px)",
                      }}
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
                        className="disable-input"
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
                        margin: "0px 0px 5px 15px",
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
                        className="disable-input"
                      />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item
                    label="Time end"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    style={{ marginBottom: 0 }}
                    rules={[{ required: true, message: ERROR_SELECT_TIME_END }]}
                  >
                    <Form.Item
                      name="dateEnd"
                      style={{
                        display: "inline-block",
                        width: "calc(50% - 8px)",
                      }}
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
                        className="disable-input"
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
                        margin: "0px 0px 5px 15px",
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
                        className="disable-input"
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
                        name="city"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        allowClear={false}
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
                          allowClear={false}
                          className="disable-input"
                        >
                          {proviceOptions.map((province) => (
                            <Option key={province.code}>{province.name}</Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="thumbnail"
                        label="Logo"
                        rules={[
                          {
                            required: true,
                            message: ERROR_UPLOAD_LOGO,
                          },
                        ]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        getValueFromEvent={normFile}
                      >
                        <Upload
                          action={FILE_UPLOAD_URL}
                          listType="picture"
                          maxCount={1}
                          disabled={isDisbale}
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
                          {ImageLimitSizeTooltip()}
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col span={11} offset={1}>
                      <Form.Item
                        name="district"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        allowClear={false}
                        label="District"
                        rules={[
                          {
                            required: true,
                            message: ERROR_INPUT_DISTRICT,
                          },
                        ]}
                      >
                        <Select
                          className="disable-input"
                          onChange={onDistrictChange}
                        >
                          {districtOptions.map((district) => (
                            <Option key={district.code}>{district.name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        allowClear={false}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        name="ward"
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
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="description"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    label="Description"
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
                        value={currentEvent.description}
                        onTextChange={(e) => setDescription(e.htmlValue)}
                        style={{ height: "250px" }}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              {(currentEvent.type === TYPE_SERVER &&
                localStorageGetReduxState().auth.role === ROLE_ADMIN) ||
              (currentEvent.type === TYPE_LOCAL &&
                localStorageGetReduxState().auth.role ===
                  ROLE_LOCATION_OWNER) ? (
                <Row justify="center" align="middle">
                  <Col>
                    <Form.Item>
                      {isLoadingBasicInfo === false ? (
                        <Button type="primary" htmlType="submit">
                          Update
                        </Button>
                      ) : (
                        <Spin />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}
            </Form>
          </Card>

          <Card title="List Image">
            <Form
              {...formItemLayout}
              form={formUploadImages}
              name="listImg"
              onFinish={onFinishUpdateListImage}
              scrollToFirstError
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 20 }}
              layout="horizontal"
            >
              <Form.Item
                name="listImage"
                label="List Image"
                rules={[
                  {
                    required: true,
                    message: ERROR_UPLOAD_LIST_IMG,
                  },
                ]}
              >
                {fileListImage ? (
                  <>
                    <Upload
                      action={FILE_UPLOAD_URL}
                      listType="picture"
                      maxCount={5}
                      accept={ACCEPT_IMAGE}
                      multiple
                      disabled={isDisbale}
                      beforeUpload={beforeUpload}
                      onChange={() => setUpdateListImage(true)}
                      defaultFileList={[...fileListImage]}
                    >
                      <Button icon={<UploadOutlined />}>
                        {UPLOAD_MAXIUM_5_IMAGES}
                      </Button>
                      {ImageLimitSizeTooltip()}
                    </Upload>{" "}
                  </>
                ) : null}
              </Form.Item>
              {(currentEvent.type === TYPE_SERVER &&
                localStorageGetReduxState().auth.role === ROLE_ADMIN) ||
              (currentEvent.type === TYPE_LOCAL &&
                localStorageGetReduxState().auth.role ===
                  ROLE_LOCATION_OWNER) ? (
                <Row justify="center" align="middle">
                  <Col>
                    <Form.Item>
                      {isLoadingListImage === false ? (
                        <Button type="primary" htmlType="submit">
                          Update
                        </Button>
                      ) : (
                        <Spin />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}
            </Form>
          </Card>

          <Card title="Banner">
            <Form
              {...formItemLayout}
              form={formUploadBanner}
              name="banner"
              onFinish={onFinishUpdateBanner}
              scrollToFirstError
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 20 }}
              layout="horizontal"
            >
              <Form.Item
                name="banner"
                label="Banner"
                getValueFromEvent={normFile}
              >
                {currentEvent.banner ? (
                  <Upload
                    action={FILE_UPLOAD_URL}
                    listType="picture"
                    maxCount={1}
                    disabled={isDisbale}
                    accept={ACCEPT_IMAGE}
                    beforeUpload={beforeUpload}
                    defaultFileList={[
                      {
                        uid: "abc",
                        name: "thumbnail",
                        status: "done",
                        url: currentEvent.banner,
                      },
                    ]}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                    {ImageLimitSizeTooltip()}
                  </Upload>
                ) : (
                  <Upload
                    action={FILE_UPLOAD_URL}
                    listType="picture"
                    maxCount={1}
                    disabled={isDisbale}
                    accept={ACCEPT_IMAGE}
                    beforeUpload={beforeUpload}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                    {ImageLimitSizeTooltip()}
                  </Upload>
                )}
              </Form.Item>
              {(currentEvent.type === TYPE_SERVER &&
                localStorageGetReduxState().auth.role === ROLE_ADMIN) ||
              (currentEvent.type === TYPE_LOCAL &&
                localStorageGetReduxState().auth.role ===
                  ROLE_LOCATION_OWNER) ? (
                <Row justify="center" align="middle">
                  <Col>
                    <Form.Item>
                      {isLoadingBanner === false ? (
                        <Button type="primary" htmlType="submit">
                          Update
                        </Button>
                      ) : (
                        <Spin />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}
            </Form>
          </Card>
        </>
      ) : (
        <Skeleton />
      )}
    </>
  );
};
