import { toast } from "react-toastify";
import { Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { useEffect, useState } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { updatePoiCategoryService } from "../../services/poi_category_service";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { ERROR_INPUT_NAME, UPDATE_SUCCESS } from "../../../@app/constants/message";
import { ImageLimitSizeTooltip } from "../../../@app/components/image/image_extra_label";

const ModalUpdatePoiCategory = ({
  modalToIndex,
  isUpdateModalVisible,
  handleCancelModal,
  currentUnit,
}) => {
  const [form] = Form.useForm();
  const [isHasPicture, setIsHasPicture] = useState(true);

  useEffect(async () => {
    form.resetFields();
  }, []);

  const onFinishUpdatePoi = async (values) => {
    try {
      if (isHasPicture) {
        let valueLogo = "";
        if (typeof values.logo === "undefined") {
          valueLogo = currentUnit.logo;
        } else {
          let inputLogo = [];
          let result = await getBase64(values.logo.file.originFileObj);
          inputLogo = result.split(",");
          valueLogo = inputLogo[1];
        }

        const updateItem = {
          id: currentUnit.id,
          name: values.name,
          logo: valueLogo,
        };
        await updatePoiCategoryService(updateItem).then(() => {
          modalToIndex("update");
          toast.success(UPDATE_SUCCESS);
          form.resetFields();
        });
      } else {
        toast.error("Please choose logo");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleCancelPoiInModal = () => {
    form.resetFields();
    handleCancelModal("update");
  };
  const onChange = (file) => {
    if (file.file.status === "removed") {
      setIsHasPicture(false);
    } else {
      setIsHasPicture(true);
    }
  };
  return (
    <>
      {currentUnit ? (
        <Modal
          key={currentUnit.id}
          title="Update POI Category"
          visible={isUpdateModalVisible}
          onCancel={handleCancelPoiInModal}
          footer={null}
        >
          <Form
            {...formItemLayout}
            form={form}
            name="registerPoi"
            onFinish={onFinishUpdatePoi}
            scrollToFirstError
            initialValues={{
              name: currentUnit.name,
            }}
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
            >
              <Upload
                action={FILE_UPLOAD_URL}
                listType="picture"
                maxCount={1}
                accept={ACCEPT_IMAGE}
                beforeUpload={beforeUpload}
                onChange={onChange}
                defaultFileList={[
                  {
                    uid: "abc",
                    name: "thumbnail",
                    status: "done",
                    url: currentUnit.logo,
                  },
                ]}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>{ImageLimitSizeTooltip()}
              </Upload>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Update POI Category
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};
export default ModalUpdatePoiCategory;
