import { Skeleton, Table } from "antd"
import { useEffect, useState } from "react"
import { EmptyCard } from "../../../../@app/components/card/empty_card"
import moment from 'moment'
import { getAppOrderCommission } from "../../../services/order_service"
import { convertToVietNameCurrency } from "../../../components/charts/utils"

export const CommissionTabComponent = ({ appId }) => {
    const [orders, setOrders] = useState();
    const [isTableLoading, setTableLoading] = useState(false);
    const columns = [
        {
            title: 'Time',
            dataIndex: "createDate",
            key: "createDate",
            render: (text) => <p>{moment(text).format('DD/MM/YYYY HH:mm')}</p>,
        },
        {
            title: 'Total',
            dataIndex: "totalCommission",
            key: "totalCommission",
            render: (text) => <p>{convertToVietNameCurrency(text)}</p>,
        }
    ];

    const getInitialData = async () => {
        try {
            setTableLoading(true)
            let res = await getAppOrderCommission(appId);
            setOrders(res.data);
        } catch (e) {
            console.log(e)
            setOrders(null)
        } finally {
            setTableLoading(false)
        }
    }

    useEffect(() => {
        getInitialData()
    }, []);
    return <>
        {
            isTableLoading ?
                <Skeleton /> :
                orders ?
                    orders.length === 0 ?
                        <EmptyCard /> :
                        <Table columns={columns} dataSource={orders} pagination={false} />
                    : <EmptyCard />
        }
    </>
}