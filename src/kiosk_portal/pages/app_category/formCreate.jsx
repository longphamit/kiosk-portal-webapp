import { Button, Form, Input, Spin, Upload } from "antd";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { UploadOutlined } from "@ant-design/icons";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { createCategoriesService } from "../../services/categories_service";
import { toast } from "react-toastify";
import { useState } from "react";

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
        commissionPercentage: parseInt(values.commissionPercentage, 10),
      };
      await createCategoriesService(newCategories);
      toast.success("Create Category Success");
      visible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
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
              message: "Please input application name!",
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

        <Form.Item
          name="commissionPercentage"
          label="Commission"
          rules={[
            {
              required: true,
              message: "Please input Commission Percentage!",
            },
            {
              pattern: "^([0-9]*[.])?[0-9]$|^([1-9][0-9]*[.])?[0-9]$|^(100)$",
              message: "Please input number >0 and <100",
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
              Create Application
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
};
export default FormCreateCategory;
