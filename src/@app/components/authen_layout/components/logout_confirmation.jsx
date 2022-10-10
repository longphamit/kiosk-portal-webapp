import { Modal } from "antd";
import { t } from "i18next";
import { toast } from "react-toastify";
import { signOutService } from "../../../services/auth_service";
import { localStorageClearService } from "../../../services/localstorage_service";

export const logout = async (navigate) => {
    Modal.confirm({
        title: "Are you sure you want to logout?",
        okText: t("yes"),
        cancelText: t("no"),
        onOk: async () => {
            {
                await signOutService();
                localStorageClearService();
                navigate("/signin");
                toast("Logout successfull");
            }
        },
    });

};

