import AppPublishRequestTable from "../../components/tables/app_publish_request_table";
import CustomBreadCumb from "../impl/breadcumb";
import { APP_PUBLISH_REQUEST_HREF, APP_PUBLISH_REQUEST_LABEL } from "../impl/breadcumb_constant";

const ServiceApplicationPublishRequestPage = () => {

    const breadCumbData = [
        {
            href: APP_PUBLISH_REQUEST_HREF,
            label: APP_PUBLISH_REQUEST_LABEL,
            icon: null
        },
    ]
    return (
        <>
            <CustomBreadCumb props={breadCumbData} />
            <AppPublishRequestTable />
        </>

    )
}
export default ServiceApplicationPublishRequestPage;