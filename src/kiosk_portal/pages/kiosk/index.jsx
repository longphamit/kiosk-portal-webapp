import { localStorageGetUserIdService } from "../../../@app/services/localstorage_service";
import KioskTable from "../../components/tables/kiosk_table";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import {
  KIOSK_MANAGER_HREF,
  KIOSK_MANAGER_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import { Button, PageHeader } from "antd";

const KioskPage = () => {
  const breadCumbData = [
    {
      href: KIOSK_MANAGER_HREF,
      label: KIOSK_MANAGER_LABEL,
      icon: null,
    },
  ];

  const partyId = localStorageGetUserIdService();
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      {partyId ? <KioskTable partyId={partyId} /> : null}
    </>
  );
};
export default KioskPage;
