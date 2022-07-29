
import { Skeleton } from "antd";
import { useEffect, useState } from "react";
import { getListInstallAppService } from "../../../../services/party_service_application";
import { getEventPositionService } from "../../../../services/template_service";

const TemplateKioskDetail = ({
    currentTemplate,
    labelCol,
    wapperCol
}) => {
    const [totalInstalledApps, setTotalInstalledApps] = useState(0);
    const [totalEventDisplayed, setTotalEventDisplayed] = useState(0);
    const getTotalInstalledApps = async () => {
        try {
            let res = await getListInstallAppService();
            setTotalInstalledApps(res.data.metadata.total)
        } catch (e) {
            console.error(e)
        }
    }
    const getTotalEventDisplayed = async () => {
        try {
            let res = await getEventPositionService(currentTemplate.id);
            let total = 0;
            res.data.listPosition.map((position) => total += position.components.length);
            setTotalEventDisplayed(total);
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        getTotalInstalledApps();
        getTotalEventDisplayed();
    }, []);

    return (
        <>
            {currentTemplate ?
                (<>
                    <a href={"../edit-template?id=" + currentTemplate.id} target="_blank">View details the template</a>
                </>) : (<Skeleton />)
            }
        </>);
}
export default TemplateKioskDetail;