import { Button, Form, Input, Spin, Upload } from "antd";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { UploadOutlined } from "@ant-design/icons";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { createCategoriesService } from "../../services/categories_service";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  CREATE_SUCCESS,
  ERROR_INPUT_COMMISSION_PERCENTAGE,
  ERROR_INPUT_NAME,
  ERROR_REGREX_COMMISSION_PERCENTAGE,
  ERROR_UPLOAD_LOGO_CATE,
} from "../../../@app/constants/message";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { ImageLimitSizeTooltip } from "../../../@app/components/image/image_extra_label";

const FormCreateCategory = ({ visible }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const onFinishCreateCategories = async (values) => {
    try {
      setIsLoading(true);
      let formatResult = [];
      const result = await getBase64(values.logo.file.originFileObj);
      formatResult = result.split(",");
      const newCategories = {
        name: values.name,
        logo: formatResult[1],
        commissionPercentage: parseFloat(values.commissionPercentage, 10),
      };
      await createCategoriesService(newCategories);
      toast.success(CREATE_SUCCESS);
      visible(false);
      form.resetFields();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinishCreateCategories}
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
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture"
            maxCount={1}
            accept={ACCEPT_IMAGE}
            beforeUpload={beforeUpload}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
            {ImageLimitSizeTooltip()}
          </Upload>
        </Form.Item>

        <Form.Item
          name="commissionPercentage"
          label="Commission"
          rules={[
            {
              required: true,
              message: ERROR_INPUT_COMMISSION_PERCENTAGE,
            },
            {
              pattern: "^[1-9]?[0-9]{1}$|^100$",
              message: ERROR_REGREX_COMMISSION_PERCENTAGE,
            },
          ]}
        >
          <Input
            addonAfter={<p style={{ height: 16, fontWeight: 900 }}>%</p>}
          />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {isLoading ? (
            <Spin />
          ) : (
            <Button type="primary" htmlType="submit">
              Create Application Category
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
};
export default FormCreateCategory;
