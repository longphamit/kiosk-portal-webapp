import { Modal, Row, Skeleton } from "antd";
import { Galleria } from "primereact/galleria";
import { useEffect, useState } from "react";
import { itemTemplate, responsiveOptions, thumbnailTemplate } from "./utils";
import { RowArea, RowInput, RowTag, RowText } from "./CustomRowInput";

export const EventDetailsModal = ({
    onCloseModal,
    isEventDetailsModalVisible,
    currentEvent
}) => {
    const [previewImages, setPreviewImages] = useState();
    useEffect(() => {
        setPreviewImages(prepareGallery(currentEvent));
    }, []);
    const prepareGallery = (event) => {
        let tempImgs = [];
        tempImgs.push({
            itemImageSrc: event.thumbnail,
            thumbnailImageSrc: event.thumbnail
        })
        if (event.listImage) {
            event.listImage.map((e) => {
                tempImgs.push({
                    itemImageSrc: e,
                    thumbnailImageSrc: e
                })
            })
        }
        return tempImgs;
    }

    return (
        <>
            <Modal
                title="Event Details"
                visible={isEventDetailsModalVisible}
                onCancel={() => onCloseModal()}
                footer={null}
            >
                {currentEvent ?
                    <div style={{ maxHeight: '75vh', overflowX: 'auto' }}>
                        <Row style={{ marginTop: 0, marginBottom: 20 }}>
                            <Galleria
                                value={previewImages}
                                responsiveOptions={responsiveOptions}
                                numVisible={5} circular
                                style={{ width: '100%' }}
                                showItemNavigators
                                showItemNavigatorsOnHover
                                item={itemTemplate}
                                thumbnail={thumbnailTemplate}
                            />
                        </Row>
                        <RowInput label='Name' value={currentEvent.name} />
                        <RowArea label='Address' value={currentEvent.address} />
                        <RowText label='Time' value={currentEvent.time} />
                        <RowText label='Created By' value={currentEvent.type === 'local' ? 'Me' : 'Admin'} />
                        <RowTag label='Status' value={currentEvent.status} />
                        <p style={{ fontWeight: 'bold', fontSize: 16 }}>Description:</p>
                        {currentEvent.description.charAt(0) === '<' ?
                            <div className="embeddedHTML" dangerouslySetInnerHTML={{ __html: currentEvent.description }} />
                            : <div><p>{currentEvent.description}</p></div>
                        }
                    </div>
                    : <Skeleton />
                }
            </Modal>
        </>
    );
}