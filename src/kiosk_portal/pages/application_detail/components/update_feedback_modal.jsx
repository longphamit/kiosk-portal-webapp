import { toast } from "react-toastify";
import { Avatar, Button, Form, Modal, Rate, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import { formItemLayout } from "../../../layouts/form_layout";
import {
  getFeedbacksService,
  updateFeedbackService,
} from "../../../services/feedback_service";
import { UPDATE_SUCCESS } from "../../../../@app/constants/message";

const UpdateFeedbackModal = ({
  isModalVisible,
  handleCancelModal,
  feedbackModel,
  setListFeedback,
  appId,
  setMyFeedback,
}) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState();
  const [isLoading, setLoading] = useState(false);
  useEffect(async () => {
    form.resetFields();
    setValue(feedbackModel.rating);
  }, []);
  const onFinishFeedback = async (values) => {
    try {
      setLoading(true);
      let data = {
        id: feedbackModel.id,
        content: values.comment,
        rating: value,
      };
      let feedbackRes = await updateFeedbackService(data);
      setMyFeedback(feedbackRes.data);
      let res = await getFeedbacksService(appId);
      setListFeedback(res.data.data);
      handleCancelModal()
      toast.success(UPDATE_SUCCESS);
    } catch (e) {
      console.error(e);
      toast.error(e.response.data.message ?? "Update failed!");
    } finally {
      setLoading(false);
    }
  };
  const desc = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];
  return (
    <>
      <Modal
        title="Update feeback"
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
            comment: feedbackModel.content,
            rating: feedbackModel.rate,
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
export default UpdateFeedbackModal;
