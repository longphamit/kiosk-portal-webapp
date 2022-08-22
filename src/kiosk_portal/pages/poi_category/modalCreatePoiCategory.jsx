import { toast } from "react-toastify";
import { Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { useEffect } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { createPoiCategoriesService } from "../../services/poi_category_service";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import {
  CREATE_SUCCESS,
  ERROR_INPUT_NAME,
  ERROR_UPLOAD_LOGO_CATE,
} from "../../../@app/constants/message";
import { ImageLimitSizeTooltip } from "../../../@app/components/image/image_extra_label";

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
        toast.success(CREATE_SUCCESS);
        form.resetFields();
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleCancelPoiInModal = () => {
    form.resetFields();
    handleCancelModal("create");
  };
  return (
    <>
      <Modal
        title="Create POI Category"
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
                message: ERROR_INPUT_NAME,
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
                message: ERROR_UPLOAD_LOGO_CATE,
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
              <Button icon={<UploadOutlined />}>Upload</Button>{ImageLimitSizeTooltip()}
            </Upload>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Create POI Category
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalCreatePoiCategory;
