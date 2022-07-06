// @flow
import { Card, Checkbox, Col, Form, Input, List, Modal, Radio, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
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
    url: string,
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
            console.log(categoryName);
            let res = await getListApplicationServiceByCategory(categoryName);
            let data = res.data.data;
            
        } catch (e) {
            setListApp([]);
        }
    }
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
                    <div {...dropProvided.droppableProps}>
                            <div style={{ display: "flex", marginTop: '20px', overflowX: 'scroll', overflowY: 'hidden', height: 200, boxShadow: ' 0px 10px 15px -3px rgba(0,0,0,0.1)'  }} ref={dropProvided.innerRef}>
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
                                                    <div style={{ padding: 20 }} onClick={() => {
                                                        setEventDetailsModalVisible(true);
                                                        setCurrentEvent(component.event);
                                                        console.log(currentEvent)
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
                                                                cover={<img alt="example" src={component.image} style={{ height: 120 }}></img>}
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
                    </div>
                )}
            </Droppable>

            <Modal
                title="List apps on the category"
                onCancel={() => setCategoryDetailsModalVisible(false)}
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
                                style={{ width: 240, verticalAlign: 'center' }}
                                cover={<img alt="example" src={item.logo} />}
                            >
                                <Meta title={item.name} description={item.discription} />
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
                <Row>
                    <Col>Name: </Col>
                    <Col>{currentEvent?.name}</Col>
                </Row>
                <Row>
                    <Col>Discription: </Col>
                    <Col>{currentEvent?.description}</Col>
                </Row>
                <Row>
                    <Col>Time: </Col>
                    <Col>{currentEvent?.time}</Col>
                </Row>
                <Row>
                    <Col>Address: </Col>
                    <Col>{currentEvent?.address}</Col>
                </Row>
                <Row>
                    <Radio.Group defaultValue={currentEvent?.type} >
                        <Radio value="server"> Created by system </Radio>
                        <Radio value="local"> Created by me </Radio>
                    </Radio.Group>
                </Row>
                <Row>
                    <Radio.Group defaultValue={currentEvent?.status} >
                        <Radio value="ongoing"> On going </Radio>
                        <Radio value="upcoming"> Upcoming </Radio>
                    </Radio.Group>
                </Row>
                <Row>
                    <div>
                        <img src={currentEvent?.thumbnail} alt="" />
                    </div>
                </Row>
                <Row>
                    {currentEvent?.listImage.length == 0 ? <>No image display</> :
                        currentEvent?.listImage.map((object, i) => <img src={object} alt="" />)}
                </Row>
            </Modal>
        </>
    );
}