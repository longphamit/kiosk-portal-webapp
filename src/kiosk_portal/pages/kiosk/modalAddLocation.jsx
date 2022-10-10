import { Button, Form, Modal, Select, Spin } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { ERROR_SELECT_LOCATION, UPDATE_SUCCESS } from "../../../@app/constants/message";
import { updateKioskService } from "../../services/kiosk_service";
import {
  formItemLayout,
  tailFormItemLayout,
} from "../kiosk_location/modalCreateLocation";

const ModalAddLocation = ({
  isModalAddLocationVisible,
  handleCancelModal,
  listLocation,
  currentKiosk,
  onFinishModal,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [isLoading, setIsLoading] = useState(false);

  const onFinishChooseLocation = async (values) => {
    setIsLoading(true);
    try {
      const updateObj = {
        id: currentKiosk.id,
        name: currentKiosk.name,
        longtitude: 0,
        latitude: 0,
        kioskLocationId: values.kioskLocationId,
      };
      await updateKioskService(updateObj);
      onFinishModal("addLocation");
      toast.success(UPDATE_SUCCESS)
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancelInModal = () => {
    form.resetFields();
    handleCancelModal("addLocation");
  };
  return (
    <>
      <Modal
        title="Update kiosk's location"
        visible={isModalAddLocationVisible}
        onCancel={handleCancelInModal}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="chooseLocation"
          onFinish={onFinishChooseLocation}
          scrollToFirstError
        >
          <Form.Item
            name="kioskLocationId"
            label="Location"
            rules={[
              {
                required: true,
                message: ERROR_SELECT_LOCATION,
              },
            ]}
          >
            <Select name="selectProvince">
              {listLocation
                ? listLocation.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))
                : null}
            </Select>
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
    </>
  );
};
export default ModalAddLocation;
