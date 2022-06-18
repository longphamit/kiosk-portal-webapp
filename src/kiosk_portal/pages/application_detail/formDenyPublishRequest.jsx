import { Button, Form, Input, Modal, Upload } from "antd";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { UploadOutlined } from "@ant-design/icons";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { createCategoriesService } from "../../services/categories_service";
import { toast } from "react-toastify";
import { denyAppPublishRequestService } from "../../services/app_publish_request_service";

const FormDenyAppPublishRequest = ({ onSuccess,requestId }) => {
    const [form] = Form.useForm();
    const onFinishDeny = async (values) => {
        try {
            await denyAppPublishRequestService(requestId,values.comment);
            form.resetFields();
            onSuccess()
        } catch (error) {
            console.log(error);
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
                            message: "Please input your comment!",
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
