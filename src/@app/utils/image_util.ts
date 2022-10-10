import { toast } from "react-toastify";
import { ACCEPT_IMAGE } from "../../kiosk_portal/constants/accept_file";

export const beforeUpload = (file: any) => {
  let imageType = file.type.replace("image/", '');
  let isAcceptedType = ACCEPT_IMAGE.includes(imageType);
  if (!isAcceptedType) {
    toast.error("You can only upload JPG/PNG file!");
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    toast.error("Image must smaller than 5MB!");
  }

  return isAcceptedType && isLt5M;
};

