import { Col, Descriptions, Divider, Empty, Row, Skeleton, Spin } from "antd";
import { useEffect, useState } from "react"
import { getLocationByIdService } from "../../../services/kiosk_location_service";
import './styles.css'
import { Carousel } from 'primereact/carousel';
import moment from 'moment';
export const KioskLocationInformationComponent = ({ kioskLocationId }) => {
    const [kioskLocation, setKioskLocation] = useState();
    const [images, setImages] = useState();
    const [isLoading, setLoading] = useState(false)
    const initialize = async () => {
        //get Kiosk info
        try {
            setLoading(true);
            let res = await getLocationByIdService(kioskLocationId);
            setKioskLocation(res.data);
            let tempImages = [];
            Promise.all(res.data.listImage.map((e) => {
                tempImages.push({
                    itemImageSrc: e.link,
                    thumbnailImageSrc: e.link,
                    alt: e.keyType
                })
            }))
            setImages(tempImages)
        } catch (e) {
            console.error(e)
            setKioskLocation(null);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        initialize();
    }, []);
    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '600px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '480px',
            numVisible: 1,
            numScroll: 1
        }
    ];
    const itemTemplate = (item) => {
        return <Row justify='center' align='center' >
            <Col>
                <img src={item.itemImageSrc} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={item.alt} style={{ width: '100', height: '200px', display: 'block' }} />
            </Col>
        </Row >
    }

    return <>
        {!isLoading ?
            kioskLocation ?
                <>
                    <Row style={{ marginTop: 20 }}>
                        <Col span={12}>
                            {images ?
                                images.length === 0 ? <>
                                    <Row justify='center' align='center' style={{ marginTop: 50 }}>
                                        <Col>
                                            <Empty style={{ marginTop: 40 }} image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                description={
                                                    <span>
                                                        No images display
                                                    </span>
                                                }
                                            />
                                        </Col>
                                    </Row>

                                </> :
                                    <div className="card">
                                        <Carousel value={images} numVisible={1} numScroll={1} responsiveOptions={responsiveOptions}
                                            itemTemplate={itemTemplate} />
                                    </div>
                                : <Spin />}
                        </Col>
                        <Col span={1}></Col>
                        <Col span={9}>
                            <div className="card-info">
                                <Descriptions column={1} >
                                    <Descriptions.Item label="Name" labelStyle={{ fontWeight: "bold" }}>{kioskLocation.name}</Descriptions.Item>
                                    <Descriptions.Item label="Owner's Email" labelStyle={{ fontWeight: "bold" }}>{kioskLocation.ownerEmail}</Descriptions.Item>
                                    <Descriptions.Item label="Hotline" labelStyle={{ fontWeight: "bold" }}>{kioskLocation.hotLine}</Descriptions.Item>
                                    <Descriptions.Item label="Create Date" labelStyle={{ fontWeight: "bold" }}>{moment(kioskLocation.createDate).format('DD/MM/YYYY')}</Descriptions.Item>
                                </Descriptions>
                            </div>
                        </Col>
                    </Row><br />
                    <Divider orientation="left">Description</Divider>
                    <Row style={{ margin: '20px 60px' }}>
                        {kioskLocation.description.charAt(0) === '<' ?
                            <div className="div-description" dangerouslySetInnerHTML={{ __html: kioskLocation.description }} />
                            : <div><p>{kioskLocation.description}</p></div>
                        }
                    </Row>
                </> :
                <Empty style={{ marginTop: 300 }} /> :
            <Skeleton />
        }
    </>
}