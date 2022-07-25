import { Button, Form, Modal, Select, Spin } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    console.log(currentKiosk);
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
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancelPoiInModal = () => {
    handleCancelModal();
  };
  return (
    <>
      <Modal
        title="Choose your kiosk"
        visible={isModalAddLocationVisible}
        onCancel={handleCancelPoiInModal}
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
                message: "Please choose location!",
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
