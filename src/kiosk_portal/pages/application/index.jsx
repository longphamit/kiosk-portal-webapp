
import ApplicationTable from "../../components/tables/app_table";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { APP_MANAGER_HREF, APP_MANAGER_LABEL } from "../../components/breadcumb/breadcumb_constant";
import { useEffect } from "react";
import { PREVIOUS_PATH, USER_ID } from "../../../@app/constants/key";
import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { ROLE_SERVICE_PROVIDER } from "../../../@app/constants/role";
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
  let role = localStorageGetReduxState().auth.role;
  return (
    <>
      <CustomBreadCumb props={breadCumbData} />
      <ApplicationTable partyId={role === ROLE_SERVICE_PROVIDER ? localStorage.getItem(USER_ID) : null} />
    </>
  );
};
export default ApplicationPage;
