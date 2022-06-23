import { toast } from "react-toastify";
import { Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { useEffect } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { createPoiCategoriesService } from "../../services/poi_category_service";

const ModalCreatePoiCategory = ({
  modalToIndex,
  isCreateModalVisible,
  handleCancelModal,
}) => {
  const [form] = Form.useForm();

  useEffect(async () => {
    form.resetFields();
  }, []);

  const onFinishCreatePoi = async (values) => {
    try {
      let logo = [];
      let result = await getBase64(values.logo.file.originFileObj);
      logo = result.split(",");
      const newItem = {
        name: values.name,
        logo: logo[1],
      };
      await createPoiCategoriesService(newItem).then(() => {
        modalToIndex("create");
        toast.success("Create Poi Category Success");
        form.resetFields();
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancelPoiInModal = () => {
    form.resetFields();
    handleCancelModal("create");
  };
  return (
    <>
      <Modal
        title="Create Poi Category"
        visible={isCreateModalVisible}
        onCancel={handleCancelPoiInModal}
        footer={null}
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
            label="Name"
            rules={[
              {
                required: true,
                message: "Please Input Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="logo"
            label="Logo"
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
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Create Poi Category
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalCreatePoiCategory;
