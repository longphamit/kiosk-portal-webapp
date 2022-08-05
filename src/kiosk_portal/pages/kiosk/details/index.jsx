
import CustomBreadCumb from '../../../components/breadcumb/breadcumb';
import { KIOSK_DETAILS_HREF, KIOSK_DETAILS_LABEL, KIOSK_MANAGER_HREF, KIOSK_MANAGER_LABEL, KIOSK_SCHEDULING_HREF, KIOSK_SCHEDULING_LABEL } from '../../../components/breadcumb/breadcumb_constant';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Descriptions, Skeleton, Tabs, Tag } from 'antd';
import './styles.css'
import { getKioskByIdService } from '../../../services/kiosk_service';
import KioskSchedulingPage from '../schedule';
import { KioskOrderPage } from '../order';
export const KioskDetailsPage = () => {
    const { kioskId } = useParams();
    const { TabPane } = Tabs;
    const [kioskInfo, setKisokInfo] = useState();
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

    const onChange = (key) => {
    };
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
    }, []);
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
                                        <Tag color={'blue'}>Active</Tag>
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Rating Average" labelStyle={{ fontWeight: "bold" }}>{kioskInfo.averageRating}</Descriptions.Item>
                            <Descriptions.Item label="Number of Rating" labelStyle={{ fontWeight: "bold" }}>{kioskInfo.numberOfRating}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </div> :
                <Skeleton />
            }
            <Tabs defaultActiveKey="1" onChange={onChange}>
                <TabPane tab="Order" key="1">
                    <KioskOrderPage kioskId={kioskId} />
                </TabPane>
                <TabPane tab="Schedule" key="2">
                    <KioskSchedulingPage currentKioskId={kioskId} />
                </TabPane>
            </Tabs>
        </>)
}