import { Button, Col, Input, Modal, Row, Select } from "antd";
import { useState, useEffect } from "react";
import TextArea from "antd/lib/input/TextArea";
import { DragDropContext } from "react-beautiful-dnd";
import "./styles.css"
import { reorderComponent } from "./reorder";
import { ComponentList } from "./component-list";
import { toast } from "react-toastify";
import { getListAvailableCategoriesService, getListAvailableEventsService } from "../../services/categories_service";
import { Option } from "antd/lib/mentions";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAppCategoryPositionService, getEventPositionService, getTemplateById, updateAppCategoryPosition, updateEventPosition } from "../../services/template_service";
import { async } from "@firebase/util";

//Selected Type
const SELECTED_TYPE_CATEGORY = "category";
const SELECTED_TYPE_EVENT = "event";
const ROOT_ROW_CATEGORY = "categoryavailable";
const ROOT_ROW_EVENT = "eventavailable";
const FIRST_ROW_EVENT = "eventrow1"
const FIRST_ROW_CATEGORY = "categoryrow1"
const EditTemplatePage = () => {
    const [isChanging, setChanging] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedType, setSelectedType] = useState(SELECTED_TYPE_CATEGORY);
    const [categoryComponents, setCategoryComponents] = useState({});
    const [eventComponents, setEventComponents] = useState({});
    const [currentTemplate, setCurrentTemplate] = useState({});
    let navigate = useNavigate();
    const getAllAppCategories = async () => {
        try {
            let res = await getListAvailableCategoriesService();
            let categories = res.data.map(category => ({ id: category.id, image: category.logo, name: category.name }));
            return categories;
        } catch (e) {
            return [];
        }
    }
    const onNavigate = (url) => {
        navigate(url);
    };
    const getAllEvents = async () => {
        try {
            let res = await getListAvailableEventsService();
            let events = [];
            for (const data of res.data) {
                let eventModel = createEventModel(data);
                let event = {
                    id: data.id,
                    name: data.name,
                    image: data.thumbnail.link,
                    event: eventModel
                }
                events.push(event);
            }
            return events;
        } catch (e) {
            return [];
        }
    }
    const getTemplateInfo = async () => {
        let id = searchParams.get("id");
        if (id === null) {
            onNavigate('/././unauth')
        } else {
            try {
                let res = await getTemplateById(id);
                setCurrentTemplate(res.data);
            } catch (e) {
                console.log(e)
                setCurrentTemplate({});
            }
        }
    }
    const removeComponentIfExisted = (id, list) => {
        const removeIndex = []
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                removeIndex.push(i);
            }
        }
        for (let index of removeIndex) {
            list.splice(index, 1)
        }
        return list
    }
    const isColumnExisted = (rowIndex, componentsObj) => {
        if (componentsObj['row' + `${rowIndex}`] === undefined) {
            return false;
        }
        return true;
    }
    const getComponentFromList = (id, list) => {
        for (let component of list) {
            if (component.id == id) {
                return component;
            }
        }
        return {};
    }
    const reorderKeysOfObject = (component) => {
        return Object.keys(component).sort().reduce(
            (obj, key) => {
                obj[key] = component[key];
                return obj;
            },
            {}
        );
    }
    const getEventPositions = async () => {
        try {
            // let allEvents = await getAllEvents();
            // let res = await getEventPositionService(searchParams.get("id"));
            // let data = {};
            // let listEventPosition = res.data.listPosition;
            // listEventPosition.map(p => {
            //     if (p.components.length !== 0) {
            //         let dataTemp = [];
            //         for (let component of p.components) {
            //             let event = getComponentFromList(component.eventId, allEvents);
            //             if (!(event && Object.keys(event).length === 0 && Object.getPrototypeOf(event) === Object.prototype)) {
            //                 allEvents = removeComponentIfExisted(component.eventId, allEvents); // set available row
            //                 let eventTemp = {
            //                     id: component.eventId,
            //                     name: component.eventName,
            //                     image: event.image === undefined ? '' : event.image, // get event thumbnail
            //                     event: event.event
            //                 }
            //                 dataTemp[component.columnIndex] = eventTemp;
            //             }
            //         }
            //         let rowIndex = p.rowIndex;
            //         if (!isColumnExisted(rowIndex, data)) {
            //             data['eventrow' + `${rowIndex + 1}`] = dataTemp;
            //         }
            //     }
            // })

            // if (listEventPosition.length === 0) {
            //     data[`${FIRST_ROW_EVENT}`] = [];
            // }
            // setEventComponents(data)
            // console.log(data)

            let allEvents = await getAllEvents();
            let res = await getEventPositionService(searchParams.get("id"));
            let data = {};
            let listEventPosition = res.data.listPosition;
            if (listEventPosition.length !== 0) {
                for (let p of listEventPosition) {
                    if (p.components.length !== 0) {
                        let dataTemp = []
                        for (let component of p.components) {
                            let event = getComponentFromList(component.eventId, allEvents);
                            if (!(event && Object.keys(event).length === 0 && Object.getPrototypeOf(event) === Object.prototype)) {
                                allEvents = removeComponentIfExisted(component.eventId, allEvents); // set available row
                                let eventTemp = {
                                    id: component.eventId,
                                    name: component.eventName,
                                    image: event.image === undefined ? '' : event.image, // get event thumbnail
                                    event: event.event
                                }
                                dataTemp[component.columnIndex] = eventTemp;
                            }
                        }
                        let rowIndex = p.rowIndex;
                        if (!isColumnExisted(rowIndex, data)) {
                            data['eventrow' + `${rowIndex + 1}`] = dataTemp;
                        }
                    }
                }
            } else {
                data[`${FIRST_ROW_EVENT}`] = [];
            }
            data[`${ROOT_ROW_EVENT}`] = allEvents;
            console.log(reorderKeysOfObject(data))
            setEventComponents(reorderKeysOfObject(data))
        } catch (e) {
            console.error(e);
        }
    }
    const getAppCategoryPositions = async () => {
        try {
            let allCategories = await getAllAppCategories();
            let res = await getAppCategoryPositionService(searchParams.get("id"));
            let data = {};
            let listAppCategoryPosition = res.data.listPosition;
            if (listAppCategoryPosition.length !== 0) {
                for (let p of listAppCategoryPosition) {
                    if (p.components.length !== 0) {
                        let dataTemp = []
                        for (let component of p.components) {
                            let appCategory = getComponentFromList(component.appCategoryId, allCategories);
                            console.log(appCategory)
                            allCategories = removeComponentIfExisted(component.appCategoryId, allCategories); // set available row
                            dataTemp[component.columnIndex] = { id: appCategory.id, image: appCategory.image, name: appCategory.name }
                        }
                        let rowIndex = p.rowIndex;
                        if (!isColumnExisted(rowIndex, data)) {
                            data['categoryrow' + `${rowIndex + 1}`] = dataTemp;
                        }
                    }
                }
            } else {
                data[`${FIRST_ROW_CATEGORY}`] = [];
            }
            data[`${ROOT_ROW_CATEGORY}`] = allCategories;
            console.log(reorderKeysOfObject(data))
            setCategoryComponents(reorderKeysOfObject(data))
        } catch (e) {
            console.error(e);
        }
    }
    useEffect(() => {
        getTemplateInfo();
        getEventPositions();
        getAppCategoryPositions();
    }, []);
    function generateRowName() {
        let defaultName = selectedType + "row";
        let index = 1;
        Object.entries(selectedType === SELECTED_TYPE_CATEGORY ? categoryComponents : eventComponents).map(([k, v]) => {
            if (k.includes(defaultName)) {
                index = parseInt(k.replace(defaultName, ''));
            }
        });
        return defaultName + (parseInt(index) + 1);
    }
    const createEventModel = (event) => {
        let imgs = [];
        if (event.listImage !== undefined && event.listImage.length != 0)
            event.listImage.map(img => imgs.push(img.link));
        let data = {
            id: event.id,
            name: event.name,
            thumbnail: event.thumbnail.link,
            description: event.description,
            time: "string",
            address: event.address + ' - ' + event.ward + ', ' + event.district + ', ' + event.city,
            type: event.type,
            status: event.status,
            listImage: imgs,
        }
        return data;
    }
    function onClickAddNewRow() {
        let rowName = generateRowName();
        if (selectedType == SELECTED_TYPE_CATEGORY) {
            setCategoryComponents(prevState => {
                return { ...prevState, [`${rowName}`]: [] };
            });
            setChanging(true);
            return;
        }
        setChanging(true)
        setEventComponents(prevState => {
            return { ...prevState, [`${rowName}`]: [] };
        });
    }
    const onSelectedTypeChange = (value) => {
        if (isChanging) {
            Modal.confirm({
                title: "It looks like you have been editing something. \nDo you want to save it ?",
                okText: "Yes",
                cancelText: "No",
                onOk: async () => {
                    {
                        try {
                            await save()
                        } catch (e) {

                        }
                    }
                },
            });
        }
        setChanging(false)
        setSelectedType(value);
    }
    function deleteRow(rowName) {
        let state;
        if (selectedType === SELECTED_TYPE_CATEGORY) {
            state = { ...categoryComponents };
            if (state[`${rowName}`].length != 0) {
                state[`${rowName}`].forEach(element => {
                    state[`${ROOT_ROW_CATEGORY}`].push(element);
                });
            }
            delete state[`${rowName}`];
            setCategoryComponents(state);
            setChanging(true);
            return;
        }
        state = { ...eventComponents };
        if (state[`${rowName}`].length != 0) {
            state[`${rowName}`].forEach(element => {
                state[`${ROOT_ROW_EVENT}`].push(element);
            });
        }
        delete state[`${rowName}`];
        setChanging(true)
        setEventComponents(state)
    }
    const haveEmptyRow = () => {
        if (selectedType === SELECTED_TYPE_CATEGORY) {
            Object.entries(categoryComponents).map(([k, v]) => {
                if (k !== ROOT_ROW_CATEGORY && v.length == 0) {
                    return true;
                }
            });
        }
        Object.entries(eventComponents).map(([k, v]) => {
            if (k !== ROOT_ROW_EVENT && v.length == 0) {
                return true;
            }
        });
        return false;
    }
    const haveEmptyRowWithParam = (categoryComponents) => {
        let result = false;
        if (selectedType === SELECTED_TYPE_CATEGORY) {
            Object.entries(categoryComponents).map(([k, v]) => {
                if (k !== ROOT_ROW_CATEGORY && v.length == 0) {
                    result = true;
                    return;
                }
            });
            return result;
        }
        Object.entries(eventComponents).map(([k, v]) => {
            if (k !== ROOT_ROW_EVENT && v.length == 0) {
                result = true;
                return;
            }
        });
        return result;
    }

    const save = async () => {
        if (selectedType === SELECTED_TYPE_CATEGORY) {
            let listPosition = [];
            let rowIndex = 0;
            Object.entries(categoryComponents).map((element, index) => {
                if (index != 0 && element[1].length != 0) {
                    let component = element[1];
                    for (let i = 0; i < component.length; i++) {
                        let position = {
                            appCategoryId: component[i].id,
                            rowIndex: rowIndex,
                            columnIndex: i
                        };
                        listPosition.push(position);
                    }
                    rowIndex++;
                }

            });
            if (listPosition.length == 0) {
                toast.warn('Nothing added to the template');
                return;
            }
            let request = {
                templateId: currentTemplate.id,
                listPosition: listPosition
            }

            let res = await updateAppCategoryPosition(request);
            if (res.code === 200) {
                toast.success("Save category components succesfully")
                return;
            }
            return;
        }
        let listPosition = [];
        let rowIndex = 0;
        Object.entries(eventComponents).map((element, index) => {
            if (index != 0 && element[1].length != 0) {
                let component = element[1];
                for (let i = 0; i < component.length; i++) {
                    let position = {
                        eventId: component[i].id,
                        rowIndex: rowIndex,
                        columnIndex: i
                    };
                    listPosition.push(position);
                }
                rowIndex++;
            }
        });
        if (listPosition.length == 0) {
            toast.warn('Nothing added to the template');
            return;
        }
        let request = {
            templateId: currentTemplate.id,
            listPosition: listPosition
        }
        try {
            let res = await updateEventPosition(request);
            setChanging(false)
            if (res.code === 200) {
                toast.success("Save event components succesfully")
                return;
            }
        } catch (e) {
            toast.error('Save failed!');
        }

    }
    return (<>
        <div id="account-info-panel">
            <Row>
                <Col span={20}>
                    <Row className="info-row">
                        <Col span={2} className="info-title">
                            Name:
                        </Col>
                        <Col span={12}>
                            <Input value={currentTemplate.name} contentEditable={false} />
                        </Col>

                    </Row><Row>
                        <Col span={2} className="info-title">
                            Description:
                        </Col>
                        <Col span={12}>
                            <TextArea rows='1' value={currentTemplate.description} contentEditable={false} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div >
        <div style={{ marginTop: 10, marginBottom: 10, height: 40, textTransform: 'capitalize' }} >
            <Row>
                <Col span={8} >
                    <Select defaultValue={SELECTED_TYPE_CATEGORY} style={{ width: 200, fontSize: 20 }} onChange={onSelectedTypeChange}>
                        <Option value={SELECTED_TYPE_CATEGORY} style={{ textTransform: 'capitalize' }}>{SELECTED_TYPE_CATEGORY}</Option>
                        <Option value={SELECTED_TYPE_EVENT} style={{ textTransform: 'capitalize' }}>{SELECTED_TYPE_EVENT}</Option>
                    </Select>
                </Col>
            </Row>
        </div>
        <div id="arrangement-space">
            {selectedType === SELECTED_TYPE_CATEGORY ? <>
                {categoryComponents.length != 0 ? <>
                    <DragDropContext key={selectedType} onDragEnd={({ destination, source }) => {
                        // // dropped outside the list
                        if (!destination) {
                            return;
                        }
                        if (destination.droppableId !== ROOT_ROW_CATEGORY && categoryComponents[destination.droppableId].length === 5) {
                            if (source.droppableId !== destination.droppableId) {
                                toast.warn('Maxium only 5');
                                return;
                            }
                        }
                        const reorder = reorderComponent(
                            categoryComponents,
                            source,
                            destination
                        );
                        setChanging(true)
                        setCategoryComponents(
                            reorder
                        );

                        if (haveEmptyRowWithParam(reorder) && source.droppableId !== destination.droppableId) {
                            toast.warn("Dont leave a empty row, it will be deleted when you save")
                        }
                    }}>
                        <div>
                            {Object.entries(categoryComponents).map((e, i) => (
                                <div >
                                    <div style={{ fontSize: 20, paddingTop: 10 }}>
                                        <Row>
                                            <Col span={6} offset={9} justify="center" align="middle">
                                                {i == 0 ? 'Available' : 'Row ' + i + ' (Maxium 5)'}
                                            </Col>
                                            {e[0] !== ROOT_ROW_CATEGORY && e[0] !== FIRST_ROW_CATEGORY ?
                                                <Col span={6} offset={3} justify="left" align="end">
                                                    <DeleteOutlined style={{ fontSize: 20, color: 'red' }} onClick={() => deleteRow(e[0])} />
                                                </Col>
                                                :
                                                <></>
                                            }
                                        </Row>
                                    </div>
                                    <ComponentList
                                        internalScroll
                                        key={e[0]}
                                        listId={e[0]}
                                        listType="CARD"
                                        components={e[1]}
                                    />
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </> :
                    <>
                        <h3>You're not install any service application!</h3>
                    </>}
            </> : <>{eventComponents.length != 0 ?
                <>
                    <DragDropContext key={selectedType} onDragEnd={({ destination, source }) => {
                        // // dropped outside the list
                        if (!destination) {
                            return;
                        }

                        setEventComponents(
                            reorderComponent(
                                eventComponents,
                                source,
                                destination
                            )
                        );
                        setChanging(true)
                        if (haveEmptyRow() && source.droppableId !== destination.droppableId) {
                            toast.warn("Dont leave a empty row, it will be deleted when you save")
                        }
                    }}>
                        <div>
                            {Object.entries(eventComponents).map((e, i) => (
                                <div >
                                    <div style={{ fontSize: 20, paddingTop: 10 }}>
                                        <Row>
                                            <Col span={6} offset={9} justify="center" align="middle">
                                                {i == 0 ? 'Available' : 'Row ' + i}
                                            </Col>
                                            {e[0] !== ROOT_ROW_EVENT && e[0] !== FIRST_ROW_EVENT ?
                                                <Col span={6} offset={3} justify="left" align="end">
                                                    <DeleteOutlined style={{ fontSize: 20, color: 'red' }} onClick={() => deleteRow(e[0])} />
                                                </Col>
                                                :
                                                <></>
                                            }
                                        </Row>
                                    </div>
                                    <ComponentList
                                        internalScroll
                                        key={e[0]}
                                        listId={e[0]}
                                        listType="CARD"
                                        components={e[1]}
                                        event={e}
                                    />

                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </> :
                <>
                    <h3>Don't have any event to show!</h3>
                </>}
            </>}


        </div>

        {(selectedType === SELECTED_TYPE_CATEGORY && categoryComponents.length != 0) || (selectedType === SELECTED_TYPE_EVENT && eventComponents.length != 0) ?

            <div style={{ marginTop: 40 }}>
                <Row justify="center" align="middle">
                    <Col>

                        <Button type="" shape="round" style={{ width: 200, height: 50, fontSize: 24, fontWeight: 'bold' }} onClick={() => { onClickAddNewRow() }}>
                            <PlusOutlined style={{ fontSize: 32 }} />
                        </Button>
                    </Col>
                </Row>
                <Row justify="center" align="middle" style={{ marginTop: 40 }}>
                    <Col>

                        <Button type="primary" style={{ width: 200, height: 50, fontSize: 24, fontWeight: 'bold' }} onClick={() => { save() }}>Save</Button>
                    </Col>
                </Row>
            </div> : null
        }
    </>)
}
export default EditTemplatePage;
