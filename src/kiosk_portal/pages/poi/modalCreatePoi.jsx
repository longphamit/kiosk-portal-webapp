import { formatTimePicker } from "../../../@app/utils/date_util";
import {
  getListDistrictService,
  getListWardService,
} from "../../services/map_service";
import { createPoiService } from "../../services/poi_service";
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
  Spin,
} from "antd";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { useEffect, useState } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { Editor } from "primereact/editor";
import {
  ERROR_INPUT_ADDRESS,
  ERROR_SELECT_CATEGORY,
  ERROR_INPUT_CITY,
  ERROR_INPUT_DISTRICT,
  ERROR_INPUT_NAME,
  ERROR_INPUT_WARD,
  ERROR_SELECT_TIME_END,
  ERROR_SELECT_TIME_START,
  ERROR_UPLOAD_LOGO,
  ERROR_CHECKBOX_DATE_OF_WEEK,
  ERROR_UPLOAD_LIST_IMG,
  CREATE_SUCCESS,
} from "../../../@app/constants/message";

const ModalCreatePoi = ({
  modalToIndex,
  listProvinces,
  isCreatePoiModalVisible,
  handleCancelPoiModal,
  listPoiCategories,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { t } = useTranslation();
  const [listDistrictsInForm, setListDistrictsInForm] = useState([]);
  const [listWardsInForm, setListWardsInForm] = useState([]);
  const { Option } = Select;
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    form.resetFields();
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
        invalidMsg.push("You need to add picture to list img\n");
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
          modalToIndex("create", null);
          toast.success(CREATE_SUCCESS);
          form.resetFields();
        });
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
  const handleCancelPoiInModal = () => {
    form.resetFields();
    handleCancelPoiModal("create");
  };
  return (
    <>
      <Modal
        title="Create POI"
        visible={isCreatePoiModalVisible}
        onCancel={handleCancelPoiInModal}
        footer={null}
        width={1000}
      >
        <Form
          {...formItemLayout}
          form={form}
          style={{ marginRight: 80 }}
          name="registerPoi"
          onFinish={onFinishCreatePoi}
          scrollToFirstError
        >
          <Form.Item
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
          <Form.Item
            name="description"
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
            <Editor
              onTextChange={(e) => setDescription(e.htmlValue)}
              style={{ height: "300px" }}
            />
          </Form.Item>
          <Form.Item
            name="stringOpenTime"
            label={t("timestart")}
            rules={[
              {
                required: true,
                message: ERROR_SELECT_TIME_START,
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
                message: ERROR_SELECT_TIME_END,
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
                message: ERROR_CHECKBOX_DATE_OF_WEEK,
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
                message: ERROR_INPUT_ADDRESS,
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
                message: ERROR_INPUT_CITY,
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
          <Form.Item
            name="poicategoryId"
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
          <Form.Item
            name="thumbnail"
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
            </Upload>
          </Form.Item>
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
              multiple
              accept={ACCEPT_IMAGE}
              beforeUpload={beforeUpload}
            >
              <Button icon={<UploadOutlined />}>Upload ( Max:5 )</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="banner" label="Banner">
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
          <Form.Item {...tailFormItemLayout}>
            {isLoading ? (
              <Spin />
            ) : (
              <Button type="primary" htmlType="submit">
                Create POI
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalCreatePoi;
