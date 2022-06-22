import { convertTime, formatTimePicker } from "../../../@app/utils/date_util";
import {
  getListDistrictService,
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
  Modal,
  Select,
  TimePicker,
  Upload,
} from "antd";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { useEffect, useState } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";

const ModalUpdatePoi = ({
  modalToIndex,
  listProvinces,
  isUpdatePoiModalVisible,
  handleCancelPoiModal,
  listPoiCategories,
  currentItem,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [listDistrictsInForm, setListDistrictsInForm] = useState([]);
  const [listWardsInForm, setListWardsInForm] = useState([]);
  const [inputListImage, setInputListImage] = useState([]);
  const { Option } = Select;

  useEffect(async () => {
    form.resetFields();
    listProvinces.filter(async (element) => {
      if (element.name === currentItem.city) {
        await handleProvinceChange(element.code);
        return;
      }
    });
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

  const onFinishUpdatePoi = async (values) => {
    const invalidMsg = [];
    var check = true;
    try {
      if (values.stringOpenTime - values.stringCloseTime > 0) {
        invalidMsg.push("Time start need to before or match with time end\n");
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

        let listImage = [];
        let formatImage = [];
        setInputListImage(values.listImage.fileList);
        inputListImage.map(async (value) => {
          result = await getBase64(value.originFileObj);
          formatImage = result.split(",");
          listImage.push(formatImage[1]);
        });

        const updatePoi = {
          name: values.name,
          description: values.description,
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
        };
        // await createPoiService(updatePoi).then(() => {
        //   modalToIndex();
        //   toast.success("Update Poi Success");
        // });
      } else {
        var errormsg = invalidMsg.join("-");
        toast.error(errormsg);
      }
    } catch (error) {
      console.log(error);
    } finally {
      form.resetFields();
    }
  };
  const handleCancelPoiInModal = () => {
    form.resetFields();
    handleCancelPoiModal("update");
  };
  return (
    <>
      {currentItem ? (
        <Modal
          title="Update Poi"
          visible={isUpdatePoiModalVisible}
          onCancel={handleCancelPoiInModal}
          footer={null}
        >
          <Form
            {...formItemLayout}
            form={form}
            name="registerPoi"
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
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <Input />
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
              <TimePicker allowClear={false} />
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
              <TimePicker allowClear={false} />
            </Form.Item>
            <Form.Item name="dayOfWeek" label={t("dayofweek")}>
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
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                maxCount={1}
                accept=".png,.jpeg"
                beforeUpload={beforeUpload}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="listImage"
              label="listImage"
              rules={[
                {
                  required: true,
                  message: "Please choose application logo!",
                },
              ]}
            >
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                maxCount={5}
                accept=".png,.jpeg"
                beforeUpload={beforeUpload}
              >
                <Button icon={<UploadOutlined />}>Upload ( Max:5 )</Button>
              </Upload>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Update Poi
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};
export default ModalUpdatePoi;
