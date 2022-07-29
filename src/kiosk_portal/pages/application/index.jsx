
import ApplicationTable from "../../components/tables/app_table";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { APP_MANAGER_HREF, APP_MANAGER_LABEL } from "../../components/breadcumb/breadcumb_constant";
import { useEffect } from "react";
import { PREVIOUS_PATH } from "../../../@app/constants/key";
const ApplicationPage = () => {
  const breadCumbData = [
    {
      href: APP_MANAGER_HREF,
      label: APP_MANAGER_LABEL,
      icon: null
    },
  ]
  useEffect(async () => {
    localStorage.setItem(PREVIOUS_PATH, JSON.stringify({ data: breadCumbData }));
  }, []);
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      <ApplicationTable />
    </>
  );
};
export default ApplicationPage;
