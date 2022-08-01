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

const DetailPoiPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formBasic] = Form.useForm();
  const [formThumbnail] = Form.useForm();
  const [formListImg] = Form.useForm();
  const { TextArea } = Input;
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

  const onFinishUpdatePoi = async (values) => {
    try {
      setIsLoadingBasic(true);
      const invalidMsg = [];
      var check = true;
      let dOW = "";
      if (values.stringOpenTime - values.stringCloseTime > 0) {
        invalidMsg.push("Time start need to before or match with time end\n");
        check = false;
      }
      if (isHasPicture === false) {
        invalidMsg.push("Please choose logo \n");
        check = false;
      }
      if (Array.isArray(values.dayOfWeek)) {
        dOW = values.dayOfWeek.join("-");
      } else {
        dOW = values.dayOfWeek;
      }

      if (check) {
        let valueLogo = "";
        if (typeof values.thumbnail === "undefined") {
          valueLogo = "";
        } else {
          let inputLogo = [];
          let result = await getBase64(values.thumbnail.file.originFileObj);
          inputLogo = result.split(",");
          valueLogo = inputLogo[1];
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
          dayOfWeek: dOW,
          ward: objWard,
          district: objDistrict,
          city: objCity,
          address: values.address,
          poicategoryId: values.poicategoryId,
          thumbnailId: currentItem.thumbnail.id,
          thumbnail: valueLogo,
        };
        await updatePoiBasicService(updatePoi).then(() => {
          toast.success("Update Poi Success");
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
        toast.success("Update List Img Poi Success");
      });
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
      {currentItem ? (
        <Row style={{ padding: 10 }}>
          <Col span={14}>
            <Card title="Basic Information">
              <Form
                {...formItemLayout}
                form={formBasic}
                name="basicInfor"
                onFinish={onFinishUpdatePoi}
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
                  dayOfWeek: currentItem.dayOfWeek,
                  ward: currentItem.ward,
                  district: currentItem.district,
                  city: currentItem.city,
                  address: currentItem.address,
                  poicategoryId: currentItem.poicategoryId,
                }}
              >
                <Form.Item
                  name="name"
                  label={t("name")}
                  rules={[
                    {
                      required: true,
                      message: t("reqnameschedule"),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                  <Editor
                    value={currentItem.description}
                    onTextChange={(e) => setDescription(e.htmlValue)}
                    style={{ height: "250px" }}
                  />
                </Form.Item>
                <Form.Item
                  name="stringOpenTime"
                  label={t("timestart")}
                  rules={[
                    {
                      required: true,
                      message: t("reqtimestartschedule"),
                    },
                  ]}
                >
                  <TimePicker allowClear={false} format="HH:mm" />
                </Form.Item>
                <Form.Item
                  name="stringCloseTime"
                  label={t("timeend")}
                  rules={[
                    {
                      required: true,
                      message: t("reqtimeendschedule"),
                    },
                  ]}
                >
                  <TimePicker allowClear={false} format="HH:mm" />
                </Form.Item>
                <Form.Item
                  name="dayOfWeek"
                  label={t("dayofweek")}
                  rules={[
                    {
                      required: true,
                      message: t("reqtimestartschedule"),
                    },
                  ]}
                >
                  <Checkbox.Group style={{ width: "100%" }} onChange={{}}>
                    <Row>
                      <Col span={8}>
                        <Checkbox value="Monday">{t("monday")}</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Tuesday">{t("tuesday")}</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Wednesday">{t("wednesday")}</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Thursday">{t("thursday")}</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Friday">{t("friday")}</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Saturday">{t("saturday")}</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Sunday">{t("sunday")}</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: "Please input your address!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[
                    {
                      required: true,
                      message: "Please choose your city!",
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
                  name="district"
                  label="District"
                  rules={[
                    {
                      required: true,
                      message: "Please choose your district!",
                    },
                  ]}
                >
                  <Select
                    name="selectDistricts"
                    onChange={handleDistrictChange}
                  >
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
                  label="Ward"
                  rules={[
                    {
                      required: true,
                      message: "Please choose your ward!",
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
                <Form.Item
                  name="poicategoryId"
                  label="Category"
                  rules={[
                    {
                      required: true,
                      message: "Please choose your category!",
                    },
                  ]}
                >
                  <Select defaultValue={{}}>
                    {listPoiCategories.map((categories) => (
                      <Option value={categories.id}>{categories.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="thumbnail" label="Avatar">
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
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  {isLoadingBasic ? (
                    <Spin />
                  ) : (
                    <Button type="primary" htmlType="submit">
                      Update
                    </Button>
                  )}
                </Form.Item>
              </Form>
            </Card>
            <Card title="List Image">
              <Form
                {...formItemLayout}
                form={formListImg}
                name="listImg"
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
                        message: "Please choose poi logo!",
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
                        Upload ( Max:5 )
                      </Button>
                    </Upload>
                  </Form.Item>
                ) : null}
                <Form.Item {...tailFormItemLayout}>
                  {isLoadingListImg ? (
                    <Spin />
                  ) : (
                    <Button type="primary" htmlType="submit">
                      Update
                    </Button>
                  )}
                </Form.Item>
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
