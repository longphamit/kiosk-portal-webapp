import { useEffect, useState } from "react"
import moment from 'moment'
import { getKisokOrderCommissionService, getKisokOrderService } from "../../../services/order_service";
import { Button, Col, Empty, Pagination, Row, Skeleton, Space, Table } from "antd";
import { OrderDetailsModal } from "./order_details_modal";
export const KioskOrderPage = ({ kioskId }) => {
    const [orders, setOrders] = useState();
    const [totalOrder, setTotalOrder] = useState();
    const [numOrderInPage, setNumOderInPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1)
    const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState();
    const handleChangeNumberOfPaging = async (page, pageSize) => {
        setCurrentPage(page);
        await getListOrderFunction(page, numOrderInPage);
    };
    const getListOrderFunction = async (currentPageToGetList, numInPage) => {
        try {
            const res = await getKisokOrderCommissionService(kioskId)
            // setTotalOrder(res.data.metadata.total);
            setOrders(res.data);
            return;
        } catch (error) {
            // resetPage();
            console.error(error);
        }
    };
    const handleCancelViewDetails = () => {
        setDetailsModalVisible(false);
        setSelectedOrder(null);
    };
    const showDetailsOrderModal = (order) => {
        setSelectedOrder(order);
        setDetailsModalVisible(true);
    }
    const resetPage = () => {
        setCurrentPage(1);
        setTotalOrder(0);
        setOrders([]);
    }
    useEffect(() => {
        getListOrderFunction(currentPage, numOrderInPage);
    }, []);

    const convertToVietNameCurrency = (text) => {
        return text.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }
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
        {orders ?
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
                    {/* <Pagination
                        defaultCurrent={1}
                        total={totalOrder}
                        pageSize={numOrderInPage}
                        onChange={handleChangeNumberOfPaging}
                    /> */}
                </>
            : <Skeleton />
        }
        {/* {
            selectedOrder ?
                <OrderDetailsModal order={selectedOrder} onCancel={handleCancelViewDetails} visible={isDetailsModalVisible}
                /> : null
        } */}
    </>
}