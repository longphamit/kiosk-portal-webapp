import { Col, Empty, Modal, Row, Skeleton, Table } from "antd"
import { useEffect, useState } from "react";

export const OrderDetailsModal = ({ order, onCancel, visible }) => {
    const [items, setItems] = useState();
    useEffect(() => {
        setItems(JSON.parse(order.orderDetail))
    }, []);
    return <>
        <Modal
            title="Basic Modal"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            {items ?
                items.length === 0 ?
                    <>
                        <Row justify='center' align='center' style={{ marginTop: 250 }}>
                            <Col>
                                <Empty />
                            </Col>
                        </Row>
                    </> :
                    <>
                        {/* <Table columns={columns} dataSource={items} pagination={false} /> */}
                       
                    </>
                : <Skeleton />
            }
        </Modal>
    </>
}