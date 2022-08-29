import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Upload,
  Card,
  Spin,
  Skeleton,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { useEffect, useState } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { Editor } from "primereact/editor";
import {
  KIOSK_LOCATION_DETAIL_HREF,
  KIOSK_LOCATION_DETAIL_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import {
  getLocationByIdService,
  updateLocationBasicService,
  updateLocationListImgService,
} from "../../services/kiosk_location_service";
import { PREVIOUS_PATH } from "../../../@app/constants/key";
import {
  ERROR_INPUT_HOT_LINE,
  ERROR_INPUT_NAME,
  ERROR_REGREX_HOT_LINE,
  ERROR_REGREX_PHONE_NUMBER,
  ERROR_UPLOAD_LIST_IMG,
  UPDATE_SUCCESS,
  UPLOAD_MAXIUM_5_IMAGES,
} from "../../../@app/constants/message";
import { ImageLimitSizeTooltip } from "../../../@app/components/image/image_extra_label";

const DetailLocationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formBasic] = Form.useForm();
  const [formListImg] = Form.useForm();
  const [currentItem, setCurrentItem] = useState();
  const [fileListImage, setFileListImage] = useState();
  const [listRemoveImg, setListRemoveImg] = useState([]);
  const [isLoadingBasicInfor, setIsLoadingBasicInfor] = useState(false);
  const [isLoadingListImg, setIsLoadingListImg] = useState(false);
  const [description, setDescription] = useState("");
  let navigate = useNavigate();
  const onNavigate = (url) => {
    navigate(url);
  };
  const getInitValue = async () => {
    let id = searchParams.get("id");
    if (id == null) {
      onNavigate("/././unauth");
      return;
    }
    try {
      let res = await getLocationByIdService(id);
      setCurrentItem(res.data);
      setDescription(res.data.description);
      let list = [];
      await Promise.all(
        res.data.listImage.map((img, index) => {
          list.push({
            uid: img.id,
            name: "image",
            status: "done",
            url: img.link,
          });
        })
      );
      setFileListImage(list);
    } catch (error) {
      toast.error(error.response.data.message);
      setCurrentItem({});
    }
  };

  const resetField = () => {
    formBasic.resetFields();
    formListImg.resetFields();
  };

  const getApplicationPage = () => {
    const previousBreadCumb = JSON.parse(
      localStorage.getItem(PREVIOUS_PATH)
    ).data;
    previousBreadCumb.push(breadCumbData);
    return previousBreadCumb;
  };
  const breadCumbData = {
    href: KIOSK_LOCATION_DETAIL_HREF,
    label: KIOSK_LOCATION_DETAIL_LABEL,
    icon: null,
  };
  useEffect(async () => {
    resetField();
    await getInitValue();
  }, []);

  const onFinishUpdatePoi = async (values) => {
    setIsLoadingBasicInfor(true);
    try {
      const updateLocation = {
        id: currentItem.id,
        name: values.name,
        description: description,
        hotLine: values.hotline,
      };
      await updateLocationBasicService(updateLocation).then(() => {
        toast.success(UPDATE_SUCCESS);
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingBasicInfor(false);
    }
  };

  const onFinishUpdateListImage = async (values) => {
    setIsLoadingListImg(true);
    let isCheck = true;
    try {
      if (values.listImage.fileList.length === 0) {
        isCheck = false;
        toast.error(ERROR_UPLOAD_LIST_IMG);
      }
      if (isCheck) {
        let listImage = [];
        let formatImage = [];
        await Promise.all(
          values.listImage.fileList.map(async (value) => {
            if (value?.originFileObj) {
              let result = await getBase64(value.originFileObj);
              formatImage = result.split(",");
              listImage.push(formatImage[1]);
            }
          })
        );
        const updateListImage = {
          id: currentItem.id,
          removeFields: listRemoveImg,
          addFields: listImage,
        };
        await updateLocationListImgService(updateListImage).then(() => {
          toast.success(UPDATE_SUCCESS);
          setListRemoveImg([]);
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingListImg(false);
    }
  };

  const onChangeListImage = (file) => {
    setIsLoadingListImg(true);
    try {
      if (file.file.status === "removed") {
        if (file.file.url.includes("https://firebasestorage.googleapis.com")) {
          setListRemoveImg((prevArray) => [...prevArray, file.file.uid]);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingListImg(false);
    }
  };
  return (
    <>
      <CustomBreadCumb props={getApplicationPage()} />
      {currentItem ? (
        <Row style={{ padding: 10 }}>
          <Col span={14}>
            <Card title="Basic Information">
              <Form
                {...formItemLayout}
                form={formBasic}
                name="basicInfor"
                onFinish={onFinishUpdatePoi}
                scrollToFirstError
                initialValues={{
                  name: currentItem.name,
                  description: currentItem.description,
                  hotline: currentItem.hotLine,
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
                  name="hotline"
                  label="Hotline"
                  rules={[
                    {
                      pattern: new RegExp("^[+0]{0,2}(91)?[0-9]{10}$"),
                      message: ERROR_REGREX_HOT_LINE,
                    },
                    {
                      required: true,
                      message: ERROR_INPUT_HOT_LINE,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  required
                  rules={[
                    {
                      validator(values) {
                        if (description === null || description === "") {
                          return Promise.reject("Please input description");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  value={description}
                >
                  <Editor
                    style={{ height: "320px" }}
                    onTextChange={(e) => {
                      setDescription(e.htmlValue);
                    }}
                  />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  {isLoadingBasicInfor ? (
                    <Spin />
                  ) : (
                    <Button type="primary" htmlType="submit">
                      Update
                    </Button>
                  )}
                </Form.Item>
              </Form>
            </Card>
            <Card title="List Image">
              <Form
                {...formItemLayout}
                form={formListImg}
                name="listImg"
                onFinish={onFinishUpdateListImage}
                scrollToFirstError
              >
                {fileListImage ? (
                  <Form.Item
                    name="listImage"
                    label="List Image"
                    rules={[
                      {
                        required: true,
                        message: ERROR_UPLOAD_LIST_IMG,
                      },
                    ]}
                  >
                    <Upload
                      action={FILE_UPLOAD_URL}
                      listType="picture"
                      maxCount={5}
                      accept={ACCEPT_IMAGE}
                      multiple
                      beforeUpload={beforeUpload}
                      onChange={onChangeListImage}
                      defaultFileList={[...fileListImage]}
                    >
                      <Button icon={<UploadOutlined />}>
                        {UPLOAD_MAXIUM_5_IMAGES}
                      </Button>
                      {ImageLimitSizeTooltip()}
                    </Upload>
                  </Form.Item>
                ) : null}
                <Form.Item {...tailFormItemLayout}>
                  {isLoadingListImg ? (
                    <Spin />
                  ) : (
                    <Button type="primary" htmlType="submit">
                      Update
                    </Button>
                  )}
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          <Skeleton />
        </>
      )}
    </>
  );
};
export default DetailLocationPage;
