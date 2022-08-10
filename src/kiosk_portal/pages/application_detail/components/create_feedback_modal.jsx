import { toast } from "react-toastify";
import { Button, Form, Modal, Avatar, Rate, Row, Spin } from "antd";
import { formItemLayout } from "../../../layouts/form_layout";
import { useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import {
  createFeedbackService,
  getFeedbacksService,
} from "../../../services/feedback_service";

const CreateFeedbackModal = ({
  isModalVisible,
  handleCancelModal,
  appId,
  setListFeedback,
  setMyFeedback,
}) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState(5);
  const [isLoading, setLoading] = useState(false);
  useEffect(async () => {
    form.resetFields();
  }, []);
  const onFinishFeedback = async (values) => {
    try {
      setLoading(true);
      let data = {
        serviceApplicationId: appId,
        content: values.comment,
        rating: value,
      };
      let feedbackRes = await createFeedbackService(data);
      setMyFeedback(feedbackRes.data);
      let res = await getFeedbacksService(appId);
      setListFeedback(res.data.data);
      toast.success("Feedback success!");
      handleCancelModal();
    } catch (e) {
      toast.error(e.response.data.message ?? "Feedback failed!");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const desc = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];
  return (
    <>
      <Modal
        title="Feedback"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="registerPoi"
          onFinish={onFinishFeedback}
          scrollToFirstError
          labelCol={0}
          wrapperCol={24}
          initialValues={{
            rating: 5,
            comment: "",
          }}
        >
          <Avatar
            src="https://joeschmoe.io/api/v1/random"
            size="large"
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              width: "20%",
              height: "20%",
              marginBottom: 10,
            }}
          />
          <Row justify="center" align="center" style={{ marginBottom: 10 }}>
            <span style={{ marginLeft: 20 }}>
              <Rate
                tooltips={desc}
                onChange={setValue}
                value={value}
                allowClear={false}
              />
              {value ? (
                <span className="ant-rate-text">{desc[value - 1]}</span>
              ) : (
                ""
              )}
            </span>
          </Row>
          <Form.Item name="comment" label="">
            <TextArea placeholder="Write some comments ..." />
          </Form.Item>

          <Row justify="center" align="center">
            {isLoading === false ? (
              <Button htmlType="submit" type="primary">
                Submit
              </Button>
            ) : (
              <Spin />
            )}
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default CreateFeedbackModal;
