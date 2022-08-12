import { useEffect, useState } from "react"
import { getKisokOrderCommissionService } from "../../../services/order_service";
import { Col, Empty, Row, Select, Skeleton, Spin, Table } from "antd";
import OrderPieChart from "../../../components/charts/order_pie_chart";
import { AppSelectComponent } from "./component/app_select_component";
import { convertToVietNameCurrency } from "../../../components/charts/utils";
export const KioskOrderTable = ({ kioskId, apps }) => {
    const [orders, setOrders] = useState();
    const [appSelects, setAppSelects] = useState();

    const getListOrderFunction = async () => {
        try {
            const res = await getKisokOrderCommissionService(kioskId, '')
            setOrders(res.data);
            return;
        } catch (error) {
            setOrders([])
            console.error(error);
        }
    };
    const getListOrderWithAppIdFunction = async (appId) => {
        try {
            const res = await getKisokOrderCommissionService(kioskId, appId)
            setOrders(res.data);
            return;
        } catch (error) {
            setOrders([])
            console.error(error);
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
        {
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
                    </>
                : <Skeleton />
        }


    </>
}