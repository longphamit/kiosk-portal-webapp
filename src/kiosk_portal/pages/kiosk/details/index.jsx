
import CustomBreadCumb from '../../../components/breadcumb/breadcumb';
import { KIOSK_DETAILS_HREF, KIOSK_DETAILS_LABEL, KIOSK_MANAGER_HREF, KIOSK_MANAGER_LABEL, KIOSK_SCHEDULING_HREF, KIOSK_SCHEDULING_LABEL } from '../../../components/breadcumb/breadcumb_constant';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Descriptions, Menu, Skeleton, Tabs, Tag } from 'antd';
import './styles.css'
import { getKioskByIdService } from '../../../services/kiosk_service';
import KioskSchedulingPage from '../schedule';
import { KioskOrderPage, KioskOrderTable } from '../order/order_table';
import { KioskLocationInformationComponent } from '../kiosk_location';
import { InfoOutlined, LineChartOutlined, ScheduleOutlined, TableOutlined, TransactionOutlined } from '@ant-design/icons';
import { KioskOrderChart } from '../order/order_chart';
import { getAllMyApplicationService } from '../../../services/party_service_application';
const menuItemKeys = {
    locationInformation: 'locationInformation',
    order: 'order',
    order_table: 'order-table',
    order_chart: 'order-chart',
    schedule: 'schedule'
}
export const KioskDetailsPage = () => {
    const { kioskId } = useParams();
    const { TabPane } = Tabs;
    const [kioskInfo, setKisokInfo] = useState();
    const [apps, setApps] = useState();
    const [selectedMenuItem, setSelectedMenuItem] = useState(menuItemKeys.locationInformation)
    const breadCumbData = [
        {
            href: KIOSK_MANAGER_HREF,
            label: KIOSK_MANAGER_LABEL,
            icon: null
        },
        {
            href: KIOSK_DETAILS_HREF,
            label: KIOSK_DETAILS_LABEL,
            icon: null
        }
    ]

    const getAllMyApplication = async () => {
        try {
            const res = await getAllMyApplicationService();
            setApps(res.data.data);
            return;
        } catch (error) {
            setApps([])
            console.error(error);
        }
    }
    const initialize = async () => {
        //get Kiosk info
        try {
            let res = await getKioskByIdService(kioskId);
            setKisokInfo(res.data)
        } catch (e) {
            console.error(e)
            setKisokInfo(null);
        }
    }

    useEffect(() => {
        initialize();
        getAllMyApplication();
    }, []);

    const switchMenuContent = (value) => {
        switch (value) {
            case menuItemKeys.locationInformation:
                return <KioskLocationInformationComponent kioskLocationId={kioskInfo.kioskLocationId} />
            case menuItemKeys.order_chart:
                return <KioskOrderChart kioskId={kioskId} apps={apps} />;
            case menuItemKeys.order_table:
                return <KioskOrderTable kioskId={kioskId} apps={apps} />;
            case menuItemKeys.schedule:
                return <KioskSchedulingPage currentKioskId={kioskId} />;
            default:
                return null;
        }
    }
    return (
        <>
            <CustomBreadCumb props={breadCumbData} />
            {kioskInfo ?
                <div id="kiosk-info-panel">
                    <Col span={24}>
                        <Descriptions title="Kiosk Info" column={2}>
                            <Descriptions.Item label="Name" labelStyle={{ fontWeight: "bold" }}>{kioskInfo.name}</Descriptions.Item>
                            <Descriptions.Item label="Status" labelStyle={{ fontWeight: "bold" }}>
                                {
                                    kioskInfo.status === 'deactive' ?
                                        <Tag color={'red'}>Deactive</Tag> :
                                        <Tag color={'green'}>Active</Tag>
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Rating Average" labelStyle={{ fontWeight: "bold" }}>{kioskInfo.averageRating}</Descriptions.Item>
                            <Descriptions.Item label="Number of Rating" labelStyle={{ fontWeight: "bold" }}>{kioskInfo.numberOfRating}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </div> :
                <Skeleton />
            }
            <Menu mode="horizontal" defaultSelectedKeys={selectedMenuItem} onClick={(key) => setSelectedMenuItem(key.key)}>
                <Menu.Item key={menuItemKeys.locationInformation} icon={<InfoOutlined />}>
                    Location Information
                </Menu.Item>
                <Menu.SubMenu key={menuItemKeys.order} title="Revenue" icon={<TransactionOutlined />}>
                    <Menu.Item key={menuItemKeys.order_table} icon={<TableOutlined />}>
                        Table
                    </Menu.Item>
                    <Menu.Item key={menuItemKeys.order_chart} icon={<LineChartOutlined />}>
                        Chart
                    </Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key={menuItemKeys.schedule} icon={<ScheduleOutlined />}>
                    Scenario
                </Menu.Item>
            </Menu>
            <div>
                {kioskInfo ? switchMenuContent(selectedMenuItem) : null}
            </div>
        </>)
}
