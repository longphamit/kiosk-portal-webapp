import { Card, Col, Empty, List, Modal, Row, Skeleton } from "antd";
import Meta from "antd/lib/card/Meta";

export const CategoryDetailsModal = ({
    isCategoryDetailsModalVisible,
    setCategoryDetailsModalVisible,
    listApp,
    setListApp
}) => {
    const gridData = {
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 3,
    }
    return (<>
        <Modal
            title="List apps on the category"
            onCancel={() => {
                setCategoryDetailsModalVisible(false)
                setListApp([])
            }}
            visible={isCategoryDetailsModalVisible}
            footer={null}
            width={1400}
        >
            {listApp ?
                listApp.length === 0 ?
                    <>
                        <Row justify='center' align='center' style={{ marginTop: 50 }}>
                            <Col>
                                <Empty />
                            </Col>
                        </Row>
                    </> :
                    <>
                        <List
                            grid={gridData}
                            dataSource={listApp}
                            renderItem={item => (
                                <List.Item>
                                    <div onClick={() => window.open('/app-detail/' + item.serviceApplicationId + '&&installed')}>
                                        <Card
                                            hoverable
                                            style={{ width: 200, verticalAlign: 'center' }}
                                            cover={<img alt="example" src={item.serviceApplicationLogo} style={{ width: 200, height: 150 }} />}
                                        >
                                            <Meta title={item.serviceApplicationName} description={item.serviceApplicationLink} />
                                        </Card>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </>
                : <Skeleton />
            }
        </Modal>
    </>);

}