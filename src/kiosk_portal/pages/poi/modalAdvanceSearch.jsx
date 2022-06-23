import { formatTimePicker } from "../../../@app/utils/date_util";
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

const ModalAdvanceSearch = ({
  modalToIndex,
  listProvinces,
  isPoiModalVisible,
  handleCancelPoiModal,
  listPoiCategories,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [listDistrictsInForm, setListDistrictsInForm] = useState([]);
  const [listWardsInForm, setListWardsInForm] = useState([]);
  const [inputListImage, setInputListImage] = useState([]);
  const { Option } = Select;

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

  const onFinishSearchPoi = async (values) => {
    try {
      console.log(values);
      // if (typeof objDistrict === "undefined") {
      //   objDistrict = "";
      // } else {
      //   objDistrict = objDistrict.name;
      // }
      // if (typeof objWard === "undefined") {
      //   objWard = "";
      // } else {
      //   objWard = objWard.name;
      // }

      // const searchPoi = {
      //   name: values.name,
      //   description: values.description,
      //   stringOpenTime: formatTimePicker(values.stringOpenTime),
      //   stringCloseTime: formatTimePicker(values.stringCloseTime),
      //   dayOfWeek: values.dayOfWeek.join("-"),
      //   ward: objWard,
      //   district: objDistrict,
      //   city: objCity.name,
      //   address: values.address,
      //   poicategoryId: values.poicategoryId,
      //   thumbnail: thumbnail[1],
      //   listImage: listImage,
      // };
      // console.log(searchPoi);
      // await createPoiService(newPoi).then(() => {
      //   modalToIndex("search");
      //   toast.success("Search Poi Success");
      //   form.resetFields();
      // });
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancelPoiInModal = () => {
    form.resetFields();
    handleCancelPoiModal("search");
  };
  return (
    <>
      <Modal
        title="Search Poi"
        visible={isPoiModalVisible}
        onCancel={handleCancelPoiInModal}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="registerPoi"
          onFinish={onFinishSearchPoi}
          scrollToFirstError
        >
          <Form.Item name="name" label={t("name")}>
            <Input />
          </Form.Item>
          <Form.Item name="stringOpenTime" label={t("timestart")}>
            <TimePicker allowClear={false} />
          </Form.Item>
          <Form.Item name="stringCloseTime" label={t("timeend")}>
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
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City">
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
          <Form.Item name="district" label="District">
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
          <Form.Item name="ward" label="Ward">
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
          <Form.Item name="poicategoryId" label="Category">
            <Select>
              {listPoiCategories.map((categories) => (
                <Option value={categories.id}>{categories.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Search Poi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalAdvanceSearch;
