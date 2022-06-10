import { Button, Form, Select } from "antd";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { toast } from "react-toastify";
import { addTemplateToScheduleService } from "../../services/schedule_template_service";

const FormAddTemplate = ({ modalToIndex, indexToModal, listTemplate }) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const onFinishAddTemplate = async (values) => {
    const newItem = {
      scheduleId: indexToModal.id,
      templateId: values.templateId,
    };
    console.log(newItem);
    try {
      await addTemplateToScheduleService(newItem);
      toast.success("Add template to schedule success");
      modalToIndex(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinishAddTemplate}
        scrollToFirstError
      >
        <Form.Item
          name="templateId"
          label="Template"
          style={{ marginTop: 5 }}
          rules={[
            {
              required: true,
              message: "Please select template",
            },
          ]}
        >
          <Select placeholder="Please select template">
            {listTemplate
              ? listTemplate.map((item) => {
                  return <Option value={item.id}>{item.name}</Option>;
                })
              : null}
            {/* <Option value="1">a</Option>; */}
          </Select>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Create Application
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default FormAddTemplate;
