import { Button, Form, Input } from "antd";
import { ERROR_INPUT_COMMENT } from "../../../@app/constants/message";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { denyAppPublishRequestService } from "../../services/app_publish_request_service";

const FormDenyAppPublishRequest = ({ onSuccess, requestId }) => {
  const [form] = Form.useForm();
  const onFinishDeny = async (values) => {
    try {
      await denyAppPublishRequestService(requestId, values.comment);
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="Deny Form"
        onFinish={onFinishDeny}
        scrollToFirstError
      >
        <Form.Item
          name="comment"
          label="Comment"
          rules={[
            {
              required: true,
              message: ERROR_INPUT_COMMENT,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button className="danger-button" htmlType="submit">
            Deny Publish Request
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default FormDenyAppPublishRequest;
