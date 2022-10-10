import { formatTimePicker } from "../../../@app/utils/date_util";
import {
  getListDistrictService,
  getListWardService,
} from "../../services/map_service";
import { createPoiService } from "../../services/poi_service";
import { toast } from "react-toastify";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Modal,
  Select,
  TimePicker,
  Upload,
  Spin,
  DatePicker,
} from "antd";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import { formItemLayout, tailFormItemLayout } from "../../layouts/form_layout";
import { useEffect, useState } from "react";
import { beforeUpload } from "../../../@app/utils/image_util";
import { getBase64 } from "../../../@app/utils/file_util";
import { ACCEPT_IMAGE } from "../../constants/accept_file";
import { FILE_UPLOAD_URL } from "../../../@app/utils/api_links";
import { Editor } from "primereact/editor";
import {
  ERROR_INPUT_ADDRESS,
  ERROR_SELECT_CATEGORY,
  ERROR_INPUT_DISTRICT,
  ERROR_INPUT_NAME,
  ERROR_INPUT_WARD,
  ERROR_SELECT_TIME_END,
  ERROR_SELECT_TIME_START,
  ERROR_UPLOAD_LOGO,
  ERROR_CHECKBOX_DATE_OF_WEEK,
  ERROR_UPLOAD_LIST_IMG,
  CREATE_SUCCESS,
  ERROR_INPUT_PROVINCE,
  UPLOAD_MAXIUM_5_IMAGES,
} from "../../../@app/constants/message";
import { ImageLimitSizeTooltip } from "../../../@app/components/image/image_extra_label";

const ModalCreatePoi = ({
  modalToIndex,
  listProvinces,
  isCreatePoiModalVisible,
  handleCancelPoiModal,
  listPoiCategories,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { t } = useTranslation();
  const [listDistrictsInForm, setListDistrictsInForm] = useState([]);
  const [listWardsInForm, setListWardsInForm] = useState([]);
  const { Option } = Select;
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    form.resetFields();
  }, []);

  const handleProvinceChange = async (value) => {
    const resDistrict = await getListDistrictService(value);
    setListDistrictsInForm(resDistrict.data);
    const resWard = await getListWardService(resDistrict.data[0].code);
    setListWardsInForm(resWard.data);
    form.setFieldsValue({
      district: {
        value: resDistrict.data[0].name,
      },
      selectDistricts: {
        key: resDistrict.data[0].code,
        value: resDistrict.data[0].code,
      },
      ward: {
        value: resWard.data[0].name,
      },
      selectWards: {
        key: resWard.data[0].code,
        value: resWard.data[0].code,
      },
    });
  };

  const handleDistrictChange = async (value) => {
    const resWard = await getListWardService(value);
    setListWardsInForm(resWard.data);
    form.setFieldsValue({
      ward: {
        value: resWard.data[0].name,
      },
      selectWards: {
        key: resWard.data[0].code,
        value: resWard.data[0].code,
      },
    });
  };

  const onFinishCreatePoi = async (values) => {
    setIsLoading(true);
    const invalidMsg = [];
    var check = true;
    try {
      if (values.stringOpenTime - values.stringCloseTime > 0) {
        invalidMsg.push("Time start need to before or match with time end\n");
        check = false;
      }

      if (values.listImage.fileList.length === 0) {
        invalidMsg.push(ERROR_UPLOAD_LIST_IMG);
        check = false;
      }
      if (values.thumbnail.fileList.length === 0) {
        invalidMsg.push("You need to add logo\n");
        check = false;
      }

      if (check) {
        let objCity = listProvinces.find(
          (element) => element.code === values.city
        );
        let objDistrict = listDistrictsInForm.find(
          (element) => element.code === values.district
        );
        let objWard = listWardsInForm.find(
          (element) => element.code === values.ward
        );

        if (typeof objDistrict === "undefined") {
          objDistrict = values.district.value;
        } else {
          objDistrict = objDistrict.name;
        }
        if (typeof objWard === "undefined") {
          objWard = values.ward.value;
        } else {
          objWard = objWard.name;
        }

        let thumbnail = [];
        let result = await getBase64(values.thumbnail.file.originFileObj);
        thumbnail = result.split(",");

        let banner = [];
        if (values.banner?.fileList[0]) {
          let resultBanner = await getBase64(values.banner.file.originFileObj);
          banner = resultBanner.split(",");
        }

        let listImage = [];
        await Promise.all(
          values.listImage.fileList.map(async (value) => {
            let formatImage = (await getBase64(value.originFileObj)).split(
              ","
            )[1];
            listImage.push(formatImage);
          })
        );
        let newPoi = {
          name: values.name,
          description: description ?? "",
          stringOpenTime: formatTimePicker(values.stringOpenTime),
          stringCloseTime: formatTimePicker(values.stringCloseTime),
          dayOfWeek: values.dayOfWeek.join("-"),
          ward: objWard,
          district: objDistrict,
          city: objCity.name,
          address: values.address,
          poicategoryId: values.poicategoryId,
          thumbnail: thumbnail[1],
          listImage: listImage,
          banner: banner[1],
        };
        await createPoiService(newPoi).then(() => {
          modalToIndex("create", null);
          toast.success(CREATE_SUCCESS);
          form.resetFields();
        });
      } else {
        var errormsg = invalidMsg.join("-");
        toast.error(errormsg);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancelPoiInModal = () => {
    form.resetFields();
    handleCancelPoiModal("create");
  };
  return (
    <>
      <Modal
        title="Create POI"
        visible={isCreatePoiModalVisible}
        onCancel={handleCancelPoiInModal}
        footer={null}
        width={800}
      >
        
      </Modal>
    </>
  );
};
export default ModalCreatePoi;
