import { Button, Empty } from "antd"
import { useNavigate } from "react-router-dom"
import { APP_MANAGER_PATH, EVENT_MANAGER_PATH, KIOSK_MANAGER_PATH, MY_APPLICATION_PATH, POI_MANAGER_PATH } from "../../../kiosk_portal/constants/path_constants"

export const CountPieChartType = {
    event: 'event',
    kiosk: 'kiosk',
    poi: 'poi',
    my_app: 'my_app',
    app: 'app'
}

const Type = {
    event: {
        name: 'event',
        link: EVENT_MANAGER_PATH
    },
    kiosk: {
        name: 'kiosk',
        link: KIOSK_MANAGER_PATH
    },
    poi: {
        name: 'POI',
        link: POI_MANAGER_PATH
    },
    my_app: {
        name: 'installed applications',
        link: MY_APPLICATION_PATH
    },
    app: {
        name: 'applications',
        link: APP_MANAGER_PATH
    }
}
export const EmptyPieChart = ({ type }) => {
    let navigate = useNavigate();
    return <Empty
        style={{ paddingTop: 0 }}
        description={
            <span style={{ fontWeight: 'bold', fontSize: 16 }}>You have no {Type[`${type}`].name}</span>
        }
    >
        <Button type="" onClick={() => navigate(Type[`${type}`].link)}>View More</Button>
    </Empty>
}