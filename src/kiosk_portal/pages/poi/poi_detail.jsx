import { convertTime, formatTimePicker } from "../../../@app/utils/date_util";
import {
  getListDistrictService,
  getListProvinceService,
  getListWardService,
} from "../../services/map_service";
import { toast } from "react-toastify";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  TimePicker,
  Upload,
  Card,
  Skeleton,
  Spin,
} from "antd";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { useEffect, useState } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getPoiByIdService,
  updateBannerPoiService,
  updatePoiBasicService,
  updatePoiListImgService,
} from "../../services/poi_service";
import { getListPoiCategoriesService } from "../../services/poi_category_service";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { async } from "@firebase/util";
import {
  POI_DETAILS_HREF,
  POI_DETAILS_LABEL,
  POI_MANAGER_HREF,
  POI_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { Editor } from "primereact/editor";
import {
  ERROR_CHECKBOX_DATE_OF_WEEK,
  ERROR_INPUT_ADDRESS,
  ERROR_INPUT_DISTRICT,
  ERROR_INPUT_NAME,
  ERROR_INPUT_PROVINCE,
  ERROR_INPUT_WARD,
  ERROR_SELECT_CATEGORY,
  ERROR_SELECT_TIME_END,
  ERROR_SELECT_TIME_START,
  ERROR_UPLOAD_LIST_IMG,
  ERROR_UPLOAD_LOGO,
  UPDATE_SUCCESS,
  UPLOAD_MAXIUM_5_IMAGES,
} from "../../../@app/constants/message";
import { ImageLimitSizeTooltip } from "../../../@app/components/image/image_extra_label";

const DetailPoiPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formBasic] = Form.useForm();
  const [formThumbnail] = Form.useForm();
  const [formListImg] = Form.useForm();
  const [formUploadBanner] = Form.useForm();
  const [days, setDays] = useState();
  const { t } = useTranslation();
  const [listDistrictsInForm, setListDistrictsInForm] = useState([]);
  const [description, setDescription] = useState("");
  const [listWardsInForm, setListWardsInForm] = useState([]);
  const [currentItem, setCurrentItem] = useState();
  const [listProvinces, setListProvinces] = useState([]);
  const [listPoiCategories, setListPoiCategories] = useState([]);
  const [fileListImage, setFileListImage] = useState();
  const [isHasPicture, setIsHasPicture] = useState(true);
  const [listRemoveImg, setListRemoveImg] = useState([]);
  const [isLoadingBasic, setIsLoadingBasic] = useState(false);
  const [isLoadingListImg, setIsLoadingListImg] = useState(false);
  const [isLoadingBanner, setIsLoadingBanner] = useState(false);
  const { Option } = Select;

  let navigate = useNavigate();
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
      let res = await getPoiByIdService(id);
      setCurrentItem(res.data);
      setDescription(res.data.description);
      const resProvinces = await getListProvinceService();
      setListProvinces(resProvinces.data);
      //set up init list district
      let codeProvince = resProvinces.data.find(
        (element) => element.name === res.data.city
      ).code;
      const resDistrict = await getListDistrictService(codeProvince);
      setListDistrictsInForm(resDistrict.data);
      //set up init list ward
      let codeDistrict = resDistrict.data.find(
        (element) => element.name === res.data.district
      ).code;
      const resWard = await getListWardService(codeDistrict);
      setListWardsInForm(resWard.data);

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

      //days 
      setDays(res.data.dayOfWeek.split('-'))
    } catch (error) {
      toast.error(error.response.data.message);
      setCurrentItem({});
    }
  };

  const resetField = () => {
    formBasic.resetFields();
    formThumbnail.resetFields();
    formListImg.resetFields();
  };
  const breadCumbData = [
    {
      href: POI_MANAGER_HREF,
      label: POI_MANAGER_LABEL,
      icon: null,
    },
    {
      href: POI_DETAILS_HREF,
      label: POI_DETAILS_LABEL,
      icon: null,
    },
  ];
  useEffect(async () => {
    resetField();
    await getInitValue();
    const resPoiCategories = await getListPoiCategoriesService("", 10000, 1);
    setListPoiCategories(resPoiCategories.data.data);
  }, []);

  const handleProvinceChange = async (value) => {
    const resDistrict = await getListDistrictService(value);
    setListDistrictsInForm(resDistrict.data);
    const resWard = await getListWardService(resDistrict.data[0].code);
    setListWardsInForm(resWard.data);
    formBasic.setFieldsValue({
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
    formBasic.setFieldsValue({
      ward: {
        value: resWard.data[0].name,
      },
      selectWards: {
        key: resWard.data[0].code,
        value: resWard.data[0].code,
      },
    });
  };

  const onFinishUpdateBanner = async (values) => {
    try {
      setIsLoadingBanner(true);
      let banner = "";
      let isChange = true;
      if (typeof values.banner === "undefined") {
        isChange = false;
        toast.error("Your img is not change");
      } else if (values.banner.fileList.length === 0) {
        banner = "";
      } else {
        banner = (await getBase64(values.banner.file.originFileObj)).split(
          ","
        )[1];
      }
      if (isChange) {
        const updateBanner = {
          poiId: currentItem.id,
          banner: banner,
        };
        await updateBannerPoiService(updateBanner);
        toast.success(UPDATE_SUCCESS);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingBanner(false);
    }
  };

  const onFinishUpdatePoi = async (values) => {
    try {
      setIsLoadingBasic(true);
      const invalidMsg = [];
      var check = true;
      if (values.stringOpenTime - values.stringCloseTime > 0) {
        invalidMsg.push("Time start need to before or match with time end\n");
        check = false;
      }
      if (isHasPicture === false) {
        invalidMsg.push("Please choose logo \n");
        check = false;
      }

      if (check) {
        let valueLogo = "";
        if (typeof values.thumbnail === "undefined") {
          valueLogo = "";
        } else {
          let inputLogo = [];
          if (values.thumbnail.file !== undefined) {
            let result = await getBase64(values.thumbnail.file.originFileObj);
            inputLogo = result.split(",");
            valueLogo = inputLogo[1];
          }
        }

        let objCity = listProvinces.find(
          (element) => element.code === values.city
        );
        if (typeof objCity === "undefined") {
          objCity = values.city;
        } else {
          objCity = objCity.name;
        }

        let objDistrict = listDistrictsInForm.find(
          (element) => element.code === values.district
        );
        if (typeof objDistrict === "undefined") {
          if (typeof values.district?.value === "undefined") {
            objDistrict = values.district;
          } else {
            objDistrict = values.district.value;
          }
        } else {
          objDistrict = objDistrict.name;
        }

        let objWard = listWardsInForm.find(
          (element) => element.code === values.ward
        );

        if (typeof objWard === "undefined") {
          if (typeof values.ward?.value === "undefined") {
            objWard = values.ward;
          } else {
            objWard = values.ward.value;
          }
        } else {
          objWard = objWard.name;
        }
        const updatePoi = {
          id: currentItem.id,
          name: values.name,
          description: description,
          stringOpenTime: formatTimePicker(values.stringOpenTime),
          stringCloseTime: formatTimePicker(values.stringCloseTime),
          dayOfWeek: days.join('-'),
          ward: objWard,
          district: objDistrict,
          city: objCity,
          address: values.address,
          poicategoryId: values.poicategoryId,
          thumbnailId: currentItem.thumbnail.id,
          thumbnail: valueLogo,
        };
        await updatePoiBasicService(updatePoi).then(() => {
          toast.success(UPDATE_SUCCESS);
        });
      } else {
        var errormsg = invalidMsg.join("-");
        toast.error(errormsg);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingBasic(false);
    }
  };

  const onFinishUpdateListImage = async (values) => {
    try {
      setIsLoadingListImg(true);
      let isTrue = true;
      if (values.listImage.fileList.length === 0) {
        toast.error(ERROR_UPLOAD_LIST_IMG);
        isTrue = false;
      }
      if (isTrue) {
        let listImage = [];
        let formatImage = [];
        await Promise.all(
          values.listImage.fileList.map(async (value) => {
            if (value?.originFileObj) {
              let result = await getBase64(value.originFileObj);
              formatImage = result.split(",");
              listImage.push(formatImage[1]);
            }
          })
        );
        const updateListImage = {
          id: currentItem.id,
          removeFields: listRemoveImg,
          addFields: listImage,
        };
        await updatePoiListImgService(updateListImage).then(() => {
          toast.success(UPDATE_SUCCESS);
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingListImg(false);
    }
  };

  const onChangeThumbnail = (file) => {
    if (file.file.status === "removed") {
      setIsHasPicture(false);
    } else {
      setIsHasPicture(true);
    }
  };

  const onChangeListImage = (file) => {
    if (file.file.status === "removed") {
      if (file.file.url.includes("https://firebasestorage.googleapis.com")) {
        setListRemoveImg((prevArray) => [...prevArray, file.file.uid]);
      }
    }
  };
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      {currentItem && days ? (
        <Row style={{ padding: 10 }}>
          <Col span={24}>
            <Card title="Basic Information">
              <Form
                {...formItemLayout}
                form={formBasic}
                name="basicInfor"
                onFinish={onFinishUpdatePoi}
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 20 }}
                scrollToFirstError
                initialValues={{
                  name: currentItem.name,
                  description: currentItem.description,
                  stringOpenTime: convertTime(
                    currentItem.openTime.hours,
                    currentItem.openTime.minutes,
                    currentItem.openTime.seconds
                  ),
                  stringCloseTime: convertTime(
                    currentItem.closeTime.hours,
                    currentItem.closeTime.minutes,
                    currentItem.closeTime.seconds
                  ),
                  dayOfWeek: days,
                  ward: currentItem.ward,
                  district: currentItem.district,
                  city: currentItem.city,
                  address: currentItem.address,
                  thumbnail: {
                    uid: "abc",
                    name: "logo",
                    status: "done",
                    url: currentItem.thumbnail.link,
                  },
                  poicategoryId: currentItem.poicategoryId,
                }}
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
                          {days ?
                            <Select
                              mode="multiple"
                              style={{ width: '100%' }}
                              placeholder="Please select day"
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
                            : <Spin />}
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
                            onChange={onChangeThumbnail}
                            defaultFileList={[
                              {
                                uid: "abc",
                                name: "thumbnail",
                                status: "done",
                                url: currentItem.thumbnail.link,
                              },
                            ]}
                          >
                            <Button icon={<UploadOutlined />}>Upload</Button>{ImageLimitSizeTooltip()}
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
                          value={currentItem.description}
                          onTextChange={(e) => setDescription(e.htmlValue)}
                          style={{ height: "370px" }}
                        />
                      </div>

                    </Form.Item>
                  </Col>
                </Row>
                <Row align="middle" justify="center">
                  <Form.Item >
                    {isLoadingBasic ? (
                      <Spin />
                    ) : (
                      <Button type="primary" htmlType="submit">
                        Update
                      </Button>
                    )}
                  </Form.Item>
                </Row>

              </Form>
            </Card>
            <Card title="List Image">
              <Form
                {...formItemLayout}
                form={formListImg}
                name="listImg"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 20 }}
                onFinish={onFinishUpdateListImage}
                scrollToFirstError
              >
                {fileListImage ? (
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
                    <Upload
                      action={FILE_UPLOAD_URL}
                      listType="picture"
                      maxCount={5}
                      accept={ACCEPT_IMAGE}
                      multiple
                      beforeUpload={beforeUpload}
                      onChange={onChangeListImage}
                      defaultFileList={[...fileListImage]}
                    >
                      <Button icon={<UploadOutlined />}>
                        {UPLOAD_MAXIUM_5_IMAGES}
                      </Button>{ImageLimitSizeTooltip()}
                    </Upload>
                  </Form.Item>
                ) : null}
                <Row align="middle" justify="center">
                  <Form.Item >
                    {isLoadingListImg ? (
                      <Spin />
                    ) : (
                      <Button type="primary" htmlType="submit">
                        Update
                      </Button>
                    )}
                  </Form.Item>
                </Row>
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
              >
                <Form.Item
                  name="banner"
                  label="Banner"
                >
                  {currentItem.banner ? (
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
                          url: currentItem.banner,
                        },
                      ]}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>{ImageLimitSizeTooltip()}
                    </Upload>
                  ) : (
                    <Upload
                      action={FILE_UPLOAD_URL}
                      listType="picture"
                      maxCount={1}
                      accept={ACCEPT_IMAGE}
                      beforeUpload={beforeUpload}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  )}
                </Form.Item>
                <Row align="middle" justify="center">
                  <Form.Item >
                    {isLoadingBanner === false ? (
                      <Button type="primary" htmlType="submit">
                        Update
                      </Button>
                    ) : (
                      <Spin />
                    )}
                  </Form.Item>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      ) : (
        <Skeleton />
      )}
    </>
  );
};
export default DetailPoiPage;
