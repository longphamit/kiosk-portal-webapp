import { toast } from "react-toastify";
import { Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { useEffect, useState } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { updateAppCategoryService } from "../../services/app_category_service";

const ModalUpdateAppCategory = ({
  modalToIndex,
  isUpdateModalVisible,
  handleCancelModal,
  currentUnit,
}) => {
  const [form] = Form.useForm();

  useEffect(async () => {
    form.resetFields();
  }, [form]);

  const onFinishUpdateAppCaterogy = async (values) => {
    try {
      if (
        typeof values.logo === "undefined" ||
        values.logo.fileList.length !== 0
      ) {
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

        await updateAppCategoryService(updateItem).then(() => {
          modalToIndex("update");
          toast.success("Update Poi Category Success");
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

  return (
    <>
      {currentUnit ? (
        <Modal
          key={currentUnit.id}
          title="Update Application Category"
          visible={isUpdateModalVisible}
          onCancel={handleCancelPoiInModal}
          footer={null}
        >
          <Form
            {...formItemLayout}
            form={form}
            name="registerPoi"
            onFinish={onFinishUpdateAppCaterogy}
            scrollToFirstError
            initialValues={{
              name: currentUnit.name,
              commissionPercentage: currentUnit.commissionPercentage + "",
            }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please Input Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="logo" label="Logo">
              <Upload
                action={FILE_UPLOAD_URL}
                listType="picture"
                maxCount={1}
                accept={ACCEPT_IMAGE}
                beforeUpload={beforeUpload}
                defaultFileList={[
                  {
                    uid: "abc",
                    name: "thumbnail",
                    status: "done",
                    thumbUrl: currentUnit.logo,
                  },
                ]}
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
                  pattern:
                    "^([0-9]*[.])?[0-9]$|^([1-9][0-9]*[.])?[0-9]$|[1-9][0-9]?|^(100)$",
                  message: "Please input number >0 and <100",
                },
              ]}
            >
              <Input
                addonAfter={<p style={{ height: 16, fontWeight: 900 }}>%</p>}
              />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Update Application Category
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};
export default ModalUpdateAppCategory;
