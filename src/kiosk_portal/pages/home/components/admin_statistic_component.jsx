import { Skeleton } from "antd";
import { useEffect, useState } from "react"
import { getAllApplicationsService } from "../../../services/application_service";
import { AdminMonthStatistic } from "./admin_month_statistic";
import { AdminYearStatistic } from "./admin_year_statistic";

const LINE_SPAN_COL = 18
const PIE_SPAN_COL = 6
let currentTime = new Date();
export const AdminStatisticComponent = ({ }) => {
    const [serviceApplications, setServiceApplications] = useState();
    const [isServiceApplicationsLoading, setServiceApplicationsLoading] = useState(false);


    const getServiceApplications = async () => {
        try {
            setServiceApplicationsLoading(true)
            let res = await getAllApplicationsService();
            setServiceApplications(res.data.data);
        } catch (e) {
            console.error(e);
            setServiceApplications(null)
        } finally {
            setServiceApplicationsLoading(false)
        }
    }

    useEffect(() => {
        getServiceApplications();
    }, []);


    return <>
        {!isServiceApplicationsLoading ? <>
            <AdminYearStatistic
                lineSpanCol={LINE_SPAN_COL}
                pieSpanCol={PIE_SPAN_COL}
                apps={serviceApplications}
            />
            <AdminMonthStatistic
                lineSpanCol={LINE_SPAN_COL}
                pieSpanCol={PIE_SPAN_COL}
                apps={serviceApplications}
            />
        </> : <Skeleton />
        }

    </>
}