
import ApplicationTable from "../../components/tables/app_table";
import CustomBreadCumb from "../impl/breadcumb";
import { APP_MANAGER_HREF, APP_MANAGER_LABEL } from "../impl/breadcumb_constant";
const ApplicationPage = () => {
  const breadCumbData = [
    {
      href: APP_MANAGER_HREF,
      label: APP_MANAGER_LABEL,
      icon: null
    },
  ]
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      <ApplicationTable />
    </>
  );
};
export default ApplicationPage;
