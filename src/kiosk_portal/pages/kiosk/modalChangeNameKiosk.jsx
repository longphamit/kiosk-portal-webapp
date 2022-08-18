import { Button, Form, Input, Modal, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ERROR_INPUT_NAME } from "../../../@app/constants/message";
import {
  changeNameKioskService,
  updateKioskService,
} from "../../services/kiosk_service";
import {
  formItemLayout,
  tailFormItemLayout,
} from "../kiosk_location/modalCreateLocation";

const ModalChangeNameKiosk = ({
  isModalChangeNameKioskVisible,
  handleCancelModal,
  currentKiosk,
  onFinishModal,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFinishChangeNameKiosk = async (values) => {
    setIsLoading(true);
    try {
      const updateName = {
        id: currentKiosk.id,
        kioskName: values.kioskName,
      };
      await changeNameKioskService(currentKiosk.id, updateName);
      toast.success("Change name success");
      onFinishModal("changeNameKiosk");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancelPoiInModal = () => {
    handleCancelModal("changeNameKiosk");
  };
  return (
    <>
      {currentKiosk ? (
        <Modal
          key={currentKiosk.id}
          title="Change kiosk's name"
          visible={isModalChangeNameKioskVisible}
          onCancel={handleCancelPoiInModal}
          footer={null}
        >
          <Form
            {...formItemLayout}
            form={form}
            name="chooseLocation"
            onFinish={onFinishChangeNameKiosk}
            scrollToFirstError
            initialValues={{
              id: currentKiosk.id,
              kioskName: currentKiosk.name,
            }}
          >
            <Form.Item
              name="kioskName"
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

            <Form.Item {...tailFormItemLayout}>
              {isLoading ? (
                <Spin />
              ) : (
                <Button type="primary" htmlType="submit">
                  OK
                </Button>
              )}
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};
export default ModalChangeNameKiosk;
