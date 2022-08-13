import { toast } from "react-toastify";
import { Button, Form, Input, Modal, Upload, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { createLocationService } from "../../services/kiosk_location_service";
import { Editor } from "primereact/editor";

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
export const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 10,
    },
  },
};
const ModalCreateLocation = ({
  modalToIndex,
  isCreateModalVisible,
  handleCancelModal,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  useEffect(async () => {
    form.resetFields();
  }, []);

  const onFinishCreatePoi = async (values) => {
    setIsLoading(true);
    try {
      let listImage = [];
      await Promise.all(
        values.listImage.fileList.map(async (value) => {
          let formatImage = (await getBase64(value.originFileObj)).split(
            ","
          )[1];
          listImage.push(formatImage);
        })
      );
      let newLocation = {
        name: values.name,
        description: description,
        hotLine: values.hotline,
        listImage: listImage,
      };
      await createLocationService(newLocation).then(() => {
        modalToIndex("create");
        toast.success("Create POI Success");
        form.resetFields();
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancelPoiInModal = () => {
    form.resetFields();
    handleCancelModal("create");
  };
  return (
    <>
      <Modal
        title="Create Location"
        visible={isCreateModalVisible}
        onCancel={handleCancelPoiInModal}
        footer={null}
        width={1000}
      >
        <Form
          {...formItemLayout}
          form={form}
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
                message: t("reqnameschedule"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hotline"
            label="Hotline"
            rules={[
              {
                pattern: new RegExp("^[+0]{0,2}(91)?[0-9]{10}$"),
                message: "Please input 10 number to this input",
              },
              {
                required: true,
                message: "Please input your hotline",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="listImage"
            label="List Image Carousel"
            rules={[
              {
                required: true,
                message: "Please choose images to show on carousel!",
              },
            ]}
          >
            <Upload
              action={FILE_UPLOAD_URL}
              listType="picture"
              maxCount={5}
              accept={ACCEPT_IMAGE}
              beforeUpload={beforeUpload}
            >
              <Button icon={<UploadOutlined />}>Upload ( Max:5 )</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            value={description}
            rules={[
              {
                validator(values) {
                  console.log(description);
                  if (description === null || description === "") {
                    return Promise.reject("Please input description");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Editor
              style={{ height: "320px" }}
              onTextChange={(e) => {
                setDescription(e.htmlValue);
              }}
            />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {isLoading ? (
              <Spin />
            ) : (
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalCreateLocation;
