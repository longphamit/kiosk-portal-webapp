// @flow
import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { EventDetailsModal } from './components/event_details_modal';
import { CategoryDetailsModal } from './components/category_details_modal';
import { DroppableCard } from './components/droppable_card';
import { getApplicationsByCategoryIdService } from '../../services/party_service_application';

export const ComponentList = ({ listId, listType, components }) => {
    const [isEventDetailsModalVisible, setEventDetailsModalVisible] = useState(false);
    const [isCategoryDetailsModalVisible, setCategoryDetailsModalVisible] = useState(false);
    const [currentEvent, setCurrentEvent] = useState();
    const [listApp, setListApp] = useState();
    const onOpenEventModal = (event) => {
        setEventDetailsModalVisible(true);
        setCurrentEvent(event);
    }
    const onOpenCategoryModal = async (cateId) => {
        setCategoryDetailsModalVisible(true);
        getListAppByCategory(cateId);
    }
    const getListAppByCategory = async (cateId) => {
        try {
            let res = await getApplicationsByCategoryIdService(cateId);
            let data = res.data.data;
            setListApp(data)
        } catch (e) {
            setListApp([]);
        }
    }
    const onCloseEventDetailModal = () => {
        setEventDetailsModalVisible(false)
        setCurrentEvent(null);
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
                    <div {...dropProvided.droppableProps} style={{ display: "flex", marginTop: '20px', overflowX: 'scroll', overflowY: 'hidden', height: 200, boxShadow: ' 0px 10px 15px -3px rgba(0,0,0,0.1)' }} ref={dropProvided.innerRef}>
                        {components.map((component, index) => (
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
                                            component.event ?
                                                onOpenEventModal(component.event) :
                                                onOpenCategoryModal(component.id)

                                        }}>
                                            <DroppableCard component={component} />
                                        </div>
                                    </div>
                                )}
                            </Draggable>)
                        )}
                        {dropProvided.placeholder}
                    </div>
                )}
            </Droppable>

            <CategoryDetailsModal
                isCategoryDetailsModalVisible={isCategoryDetailsModalVisible}
                setCategoryDetailsModalVisible={setCategoryDetailsModalVisible}
                listApp={listApp}
                setListApp={setListApp}
            />
            {
                currentEvent ?
                    <EventDetailsModal
                        onCloseModal={onCloseEventDetailModal}
                        isEventDetailsModalVisible={isEventDetailsModalVisible}
                        currentEvent={currentEvent}
                    /> : null
            }
        </>
    );

}

