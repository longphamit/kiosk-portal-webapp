import {
  getListDistrictService,
  getListWardService,
} from "../../services/map_service";
import { Button, Checkbox, Col, Form, Input, Row, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { useEffect, useState } from "react";

const ModalAdvanceSearch = ({
  onSearchModal,
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
      let name = values.name;
      if (typeof name === "undefined") {
        name = "";
      }
      let dayOfWeek = values.dayOfWeek;
      if (typeof dayOfWeek === "undefined") {
        dayOfWeek = "";
      } else {
        dayOfWeek = values.dayOfWeek.join("-");
      }
      let address = values.address;
      if (typeof address === "undefined") {
        address = "";
      }

      let city = "";
      let district = "";
      let ward = "";
      if (typeof values.city === "undefined") {
        city = "";
      } else {
        city = listProvinces.find(
          (element) => element.code === values.city
        ).name;

        if (typeof values.district.value === "undefined") {
          district = listDistrictsInForm.find(
            (element) => element.code === values.district
          ).name;
        } else {
          district = values.district.value;
        }

        if (typeof values.ward.value === "undefined") {
          ward = listWardsInForm.find(
            (element) => element.code === values.ward
          ).name;
        } else {
          ward = values.ward.value;
        }
      }

      let poicategoryId = values.poicategoryId;
      if (typeof poicategoryId === "undefined") {
        poicategoryId = "";
      }

      const searchPoi = {
        Name: name,
        DayOfWeek: dayOfWeek,
        ward: ward,
        district: district,
        city: city,
        address: address,
        poicategoryId: poicategoryId,
      };
      modalToIndex("search", searchPoi);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };
  const handleCancelPoiInModal = () => {
    form.resetFields();
    handleCancelPoiModal("search");
  };
  return (
    <>
      <Modal
        title="Search POI"
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
          <Form.Item name="city" label="Province">
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
              Search POI
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalAdvanceSearch;
