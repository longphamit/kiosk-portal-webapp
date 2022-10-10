import AppPublishRequestTable from "../../components/tables/app_publish_request_table";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { APP_PUBLISH_REQUEST_HREF, APP_PUBLISH_REQUEST_LABEL } from "../../components/breadcumb/breadcumb_constant";
import { useEffect } from "react";
import { PREVIOUS_PATH } from "../../../@app/constants/key";

const ServiceApplicationPublishRequestPage = () => {

    const breadCumbData = [
        {
            href: APP_PUBLISH_REQUEST_HREF,
            label: APP_PUBLISH_REQUEST_LABEL,
            icon: null
        },
    ]

    useEffect(async () => {
        localStorage.setItem(PREVIOUS_PATH, JSON.stringify({ data: breadCumbData }));
    }, []);
    return (
        <>
            <CustomBreadCumb props={breadCumbData} />
            <AppPublishRequestTable />
        </>

    )
}
export default ServiceApplicationPublishRequestPage;