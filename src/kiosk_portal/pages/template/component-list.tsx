// @flow
import { Card, Checkbox, Col, Form, Image, Input, List, Modal, Radio, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import TextArea from 'antd/lib/input/TextArea';
import React, { FC, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from "react-toastify";
import { getListApplicationServiceByCategory } from '../../services/application_service';
interface Props {
    components: component[],
    listId: string,
    listType?: string,
    internalScroll?: boolean,
    isCombineEnabled?: boolean,
};
interface component {
    id: string,
    name: string,
    image: string, //logo or thumbnail
    event?: event
}
interface event {
    id: string,
    name: string,
    thumbnail: string,
    description: string,
    time: string,
    address: string,
    type: string,
    status: string,
    listImage: string[],
}
interface app {
    name: string,
    logo: string,
    link: string,
    discription: string,
    status: string
}
interface Template {
    id: string,
    name: string
}
export const ComponentList: React.FC<Props> = ({ listId, listType, components }) => {
    const [isEventDetailsModalVisible, setEventDetailsModalVisible] = useState(false);
    const [isCategoryDetailsModalVisible, setCategoryDetailsModalVisible] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<event>();
    const [listApp, setListApp] = useState<app[]>([]);
    const [currentTemplate, setCurrentTemplate] = useState<Template>();
    const getListAppByCategory = async (categoryName: string) => {
        try {
            let res = await getListApplicationServiceByCategory(categoryName);
            let data = res.data.data;
            setListApp(data)
        } catch (e) {
            toast.warn('Not found')
            setListApp([]);
        }
    }
    const createdBySelect = [
        {
            label: 'Admin',
            value: 'server'
        },
        {
            label: 'Me',
            value: 'local'
        }
    ]
    const eventStatusSelect = [
        {
            label: 'On going',
            value: 'ongoing'
        },
        {
            label: 'Upcoming',
            value: 'coming soon'
        },
        {
            label: 'End',
            value: 'end'
        }
    ]
    return (
        <>
            <Droppable
                droppableId={listId}
                type={listType}
                key={listId}
                direction="horizontal"
                isCombineEnabled={false}
            >
                {(
                    dropProvided
                ) => (
                    <div {...dropProvided.droppableProps} style={{ display: "flex", marginTop: '20px', overflowX: 'scroll', overflowY: 'hidden', height: 200, boxShadow: ' 0px 10px 15px -3px rgba(0,0,0,0.1)' }} ref={dropProvided.innerRef}>
                        {components.map((component, index) => (
                            component.event ? (
                                <Draggable key={component.id} draggableId={component.id} index={index}>
                                    {(
                                        dragProvided
                                    ) => (
                                        <div
                                            {...dragProvided.dragHandleProps}
                                            {...dragProvided.draggableProps}
                                            ref={dragProvided.innerRef}
                                        >
                                            <div onClick={() => {
                                                setEventDetailsModalVisible(true);
                                                setCurrentEvent(component.event);
                                            }}>
                                                <Card
                                                    hoverable
                                                    style={{ width: 150, marginLeft: 20, marginRight: 20 }}
                                                    size={'small'}
                                                    cover={<img alt="example" src={component.image} style={{ height: 120 }}></img>}
                                                >
                                                    <Meta title={component.name} description="" />
                                                </Card>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>) :
                                (<>
                                    <Draggable key={component.id} draggableId={component.id} index={index}>
                                        {(
                                            dragProvided
                                        ) => (
                                            <div
                                                {...dragProvided.dragHandleProps}
                                                {...dragProvided.draggableProps}
                                                ref={dragProvided.innerRef}
                                            >
                                                <div onClick={() => {
                                                    getListAppByCategory(component.name);
                                                    setCategoryDetailsModalVisible(true)
                                                }}>
                                                    <Card
                                                        hoverable
                                                        style={{ width: 150, marginLeft: 20, marginRight: 20 }}
                                                        size={'small'}
                                                        cover={<img alt="example" src={component.image} style={{ height: 120, }}></img>}
                                                    >
                                                        <Meta title={component.name} description="" />
                                                    </Card>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                </>)
                        ))}
                        {dropProvided.placeholder}
                    </div>
                )}
            </Droppable>

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
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 6,
                        xxl: 3,
                    }}
                    dataSource={listApp}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                hoverable
                                style={{ width: 200, verticalAlign: 'center' }}
                                cover={<img alt="example" src={item.logo} style={{ width: 200, height: 150 }} />}
                            >
                                <Meta title={item.name} description={item.discription ?? '' + '\n' + item.link} />
                            </Card>

                        </List.Item>
                    )}
                />
            </Modal>
            <Modal
                title="Event Details"
                visible={isEventDetailsModalVisible}
                onCancel={() => setEventDetailsModalVisible(false)}
                footer={null}
            >
                <RowInput label='Name' value={currentEvent === undefined ? '' : currentEvent.name} />
                <RowInput label='Discription' value={currentEvent === undefined ? '' : currentEvent.description} />
                <RowInput label='Time' value={currentEvent === undefined ? '' : currentEvent.time} />
                <RowArea label='Address' value={currentEvent === undefined ? '' : currentEvent.address} />
                <RowSelect label='Created By' currentValue={currentEvent === undefined ? '' : currentEvent.type} value={createdBySelect} />
                <RowSelect label='Status' currentValue={currentEvent === undefined ? '' : currentEvent.status} value={eventStatusSelect} />

                <Row style={{ marginTop: 20, marginBottom: 20 }}>
                    <div>
                        <Image src={currentEvent?.thumbnail} width={450} height={200} alt="" />
                    </div>
                </Row>
                <Row>
                    <Image.PreviewGroup>
                        {currentEvent?.listImage.length === 0 ? <>No more image display</> :
                            currentEvent?.listImage.map((object, i) => <Image width={234} src={object} style={{ paddingRight: 17 }} alt="" />)}
                    </Image.PreviewGroup>

                </Row>
            </Modal>
        </>
    );

}
interface RowInputProps {
    label: string;
    value: string
}
interface RowSelectProps {
    label: string;
    currentValue: string;
    value: RowInputProps[]
}
const spanLabelRow = 6;
const spanValuelRow = 18;
const RowInput: FC<RowInputProps> = ({ label, value }) => {
    return (
        <Row style={{ marginBottom: 5 }}>
            <Col span={spanLabelRow} style={{ fontWeight: 'bold', fontSize: 16 }}>{label}: </Col>
            <Col span={spanValuelRow} style={{ fontSize: 16 }}>
                <Input readOnly defaultValue={value} />
            </Col>
        </Row>
    );
};
const RowArea: FC<RowInputProps> = ({ label, value }) => {
    return (
        <Row style={{ marginBottom: 5 }}>
            <Col span={spanLabelRow} style={{ fontWeight: 'bold', fontSize: 16 }}>{label}: </Col>
            <Col span={spanValuelRow} style={{ fontSize: 16 }}>
                <TextArea readOnly defaultValue={value} />
            </Col>
        </Row>
    );
};
const RowSelect: FC<RowSelectProps> = ({ label, value, currentValue }) => {
    return (
        <Row style={{ marginBottom: 5 }}>
            <Col span={spanLabelRow} style={{ fontWeight: 'bold', fontSize: 16 }}>{label}: </Col>
            <Col span={spanValuelRow} style={{ fontSize: 16 }}>
                <Radio.Group defaultValue={currentValue} disabled>
                    {value.map(e =>
                        <Radio value={e.value}>{e.label}</Radio>
                    )}
                </Radio.Group>
            </Col>
        </Row>
    );
};
