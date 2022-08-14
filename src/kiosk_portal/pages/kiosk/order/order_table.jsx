import { useEffect, useState } from "react"
import { getKisokOrderCommissionByAppIdService } from "../../../services/order_service";
import { Col, Empty, Row, Skeleton, Spin, Table } from "antd";
import { convertToVietNameCurrency } from "../../../components/charts/utils";
import { EmptyCard } from "../../../../@app/components/card/empty_card";
import { LoationOwnerAppSelectByGroupComponent } from "../../../components/select/app_select_component";
export const KioskOrderTable = ({ kioskId, apps }) => {
    const [orders, setOrders] = useState();
    const [appSelects, setAppSelects] = useState();
    const [isLoading, setLoading] = useState(false);
    const getListOrderFunction = async () => {
        try {
            setLoading(true)
            const res = await getKisokOrderCommissionByAppIdService(kioskId, '')
            setOrders(reperformData(res.data.data));
        } catch (error) {
            setOrders(null)
            console.error(error);
        } finally {
            setLoading(false)
        }
    };
    const getAppName = (appId) => {
        let appName = ''
        apps.map((e) => {
            if (e.serviceApplicationId === appId) {
                appName = e.serviceApplicationName;
                return;
            }
        })
        return appName;
    }
    
    const buildOrderData = (oldData, newData) => {
        let appName = getAppName(newData.serviceApplicationId)
        if (oldData === null) {
            return {
                "total": newData.total,
                "commission": newData.commission,
                "systemCommission": newData.systemCommission,
                "serviceApplicationId": newData.serviceApplicationId,
                "serviceApplicationName": appName
            }
        }
        return {
            "total": oldData.total + newData.total,
            "commission": oldData.commission + newData.commission,
            "systemCommission": oldData.systemCommission + newData.systemCommission,
            "serviceApplicationId": oldData.serviceApplicationId,
            "serviceApplicationName": appName
        }
    }
    const reperformData = (data) => {
        let orderMap = new Map();
        data.map((e) => {
            if (orderMap.get(e.serviceApplicationId) === undefined) {
                orderMap.set(e.serviceApplicationId, buildOrderData(null, e))
            } else {
                orderMap.set(e.serviceApplicationId, buildOrderData(orderMap.get(e.serviceApplicationId), e))
            }
        })
        return [...orderMap.values()];
    }
    const getListOrderWithAppIdFunction = async (appId) => {
        try {
            setLoading(true)
            const res = await getKisokOrderCommissionByAppIdService(kioskId, appId)
            setOrders(reperformData(res.data.data));
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
            title: 'Commission',
            dataIndex: "commission",
            key: "commission",
            render: (text) => <p>{convertToVietNameCurrency(text)}</p>,
        },
        {
            title: 'Orders Total',
            dataIndex: "total",
            key: "total",
            render: (text) => <p>{convertToVietNameCurrency(text)}</p>,
        },
        {
            title: 'System Commission',
            dataIndex: "systemCommission",
            key: "systemCommission",
            render: (text) => <p>{convertToVietNameCurrency(text)}</p>,
        }
    ];
    return <>
        {
            appSelects ?
                <LoationOwnerAppSelectByGroupComponent apps={appSelects} onChange={getListOrderWithAppIdFunction} /> :
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