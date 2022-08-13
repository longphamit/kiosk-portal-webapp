import { useEffect, useState } from "react"
import { getKisokOrderCommissionService } from "../../../services/order_service";
import { Col, Empty, Row, Skeleton, Spin, Table } from "antd";
import { AppSelectComponent } from "./component/app_select_component";
import { convertToVietNameCurrency } from "../../../components/charts/utils";
import { EmptyCard } from "../../../../@app/components/card/empty_card";
export const KioskOrderTable = ({ kioskId, apps }) => {
    const [orders, setOrders] = useState();
    const [appSelects, setAppSelects] = useState();
    const [isLoading, setLoading] = useState(false);
    const getListOrderFunction = async () => {
        try {
            setLoading(true)
            const res = await getKisokOrderCommissionService(kioskId, '')
            setOrders(repperformData(res.data));
        } catch (error) {
            setOrders(null)
            console.error(error);
        } finally {
            setLoading(false)
        }
    };
    const repperformData = (obj) => {
        if (obj.labels.length === 0) {
            return [];
        }
        let temp = []
        for (let i = 0; i < obj.labels.length; i++) {
            temp.push({
                serviceApplicationName: obj.labels[i],
                totalCommission: obj.datasets[i]
            })
        }
        return temp;
    }
    const getListOrderWithAppIdFunction = async (appId) => {
        try {
            setLoading(true)
            const res = await getKisokOrderCommissionService(kioskId, appId)
            setOrders(repperformData(res.data));
        } catch (error) {
            setOrders(null)
            console.error(error);
        } finally {
            setLoading(false)
        }
    };
    const initialAppSelect = () => {
        let temp = { uninstalled: [], installed: [] };
        apps.map((e) => {
            if (e.status === 'uninstalled') {
                temp.uninstalled.push(e);
            } else {
                temp.installed.push(e);
            }
        })
        setAppSelects(temp)
    }
    useEffect(() => {
        initialAppSelect()
        getListOrderFunction();
    }, []);

    const columns = [
        {
            title: 'Service Application',
            dataIndex: "serviceApplicationName",
            key: "serviceApplicationName",
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Total',
            dataIndex: "totalCommission",
            key: "totalCommission",
            render: (text) => <p>{convertToVietNameCurrency(text)}</p>,
        }
    ];
    return <>
        {
            appSelects ?
                <AppSelectComponent apps={appSelects} onChange={getListOrderWithAppIdFunction} /> :
                <Spin />
        }
        {!isLoading ?
            orders ?
                orders.length === 0 ?
                    <>
                        <Row justify='center' align='center' style={{ marginTop: 250 }}>
                            <Col>
                                <Empty />
                            </Col>
                        </Row>
                    </> :
                    <>
                        <Table columns={columns} dataSource={orders} pagination={false} />
                    </> : <EmptyCard styles={{ marginTop: 250 }} />
            : <Skeleton />
        }


    </>
}