import { Col, Divider, Modal, Row, Select, Skeleton } from "antd";
import { useState, useEffect } from "react";
import "./styles.css"
import { toast } from "react-toastify";
import { getListAvailableCategoriesService, getListAvailableEventsService } from "../../services/categories_service";
import { Option } from "antd/lib/mentions";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAppCategoryPosition, createEventPosition, getAppCategoryPositionService, getEventPositionService, getTemplateById, updateAppCategoryPosition, updateEventPosition } from "../../services/template_service";
import { TEMPLATE_CREATE_LABEL, TEMPLATE_EDITING_HREF, TEMPLATE_MANAGER_HREF, TEMPLATE_MANAGER_LABEL } from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { buildPositionsModelRequest, createEventModel, getComponentFromList, removeItemFromList, reorderKeysOfObject } from "./components/utils";
import { CustomDragDropContext } from "./components/custom_drag_drop_context";
import { TemplateBasicInfo } from "./components/template_basic_info";
import { SaveButtonComponent } from "./components/save_button_component";
//Selected Type
const SELECTED_TYPE_CATEGORY = "category";
const SELECTED_TYPE_EVENT = "event";

const EditTemplatePage = () => {
    const [isLoading, setLoading] = useState(false);
    const [isChanging, setChanging] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedType, setSelectedType] = useState(SELECTED_TYPE_CATEGORY);
    const [categoryComponents, setCategoryComponents] = useState();
    const [eventComponents, setEventComponents] = useState();
    const [currentTemplate, setCurrentTemplate] = useState();
    const [isFirstSavingCategory, setFirstSavingCategory] = useState(true)
    const [isFirstSavingEvent, setFirstSavingEvent] = useState(true)
    let navigate = useNavigate();
    const getAllAppCategories = async () => {
        try {
            let res = await getListAvailableCategoriesService();
            let categories = res.data.map(category => ({
                id: category.id,
                image: category.logo,
                name: category.name
            }));
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
                if (data.status === 'end') continue;
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
                console.error(e)
                setCurrentTemplate({});
            }
        }
    }

    const getEventPositions = async () => {
        try {
            let allEvents = await getAllEvents();
            let res = await getEventPositionService(searchParams.get("id"));
            let data = {
                '0': [],
                '1': [],
                '2': []
            };
            let listEventPosition = res.data.listPosition;
            if (listEventPosition.length !== 0) {
                for (let p of listEventPosition) {
                    if (p.components.length !== 0) {
                        let dataTemp = []
                        for (let component of p.components) {
                            let event = getComponentFromList(component.eventId, allEvents);
                            if (!(event && Object.keys(event).length === 0 && Object.getPrototypeOf(event) === Object.prototype)) {
                                allEvents = removeItemFromList(component.eventId, allEvents); // set available row
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
                        data[rowIndex == 0 ? '1' : '2'] = dataTemp;
                    }
                }
            }
            data['0'] = allEvents;
            setEventComponents(reorderKeysOfObject(data))
        } catch (e) {
            setEventComponents({})
            console.error(e);
        }
    }
    const getAppCategoryPositions = async () => {
        try {
            let allCategories = await getAllAppCategories();
            let res = await getAppCategoryPositionService(searchParams.get("id"));
            let data = {
                '0': [],
                '1': [],
            };
            let listAppCategoryPosition = res.data.listPosition;
            if (listAppCategoryPosition.length !== 0) {
                for (let p of listAppCategoryPosition) {
                    if (p.components.length !== 0) {
                        let dataTemp = []
                        for (let component of p.components) {
                            let appCategory = getComponentFromList(component.appCategoryId, allCategories);
                            allCategories = removeItemFromList(component.appCategoryId, allCategories); // set available row
                            dataTemp[component.columnIndex] = { id: appCategory.id, image: appCategory.image, name: appCategory.name }
                        }
                        let rowIndex = p.rowIndex;
                        data[rowIndex == 0 ? '1' : '2'] = dataTemp;
                    }
                }
            }
            data['0'] = allCategories;
            setCategoryComponents(reorderKeysOfObject(data))
        } catch (e) {
            setCategoryComponents({})
            console.error(e);
        }
    }
    useEffect(() => {
        getTemplateInfo();
        getEventPositions();
        getAppCategoryPositions();
    }, []);

    const onSelectedTypeChange = (value) => {
        if (isChanging) {
            Modal.confirm({
                title: "It looks like you have been editing something.\n\nDo you want to save it ?",
                okText: "Yes",
                cancelText: "No",
                onOk: async () => {
                    {
                        let checkMsg = checkEmptyRow();
                        if (checkMsg.length !== 0) {
                            toast.warn('Save failed!\n' + checkMsg);
                            setLoading(false);
                            selectedType(value === SELECTED_TYPE_CATEGORY ? SELECTED_TYPE_EVENT : SELECTED_TYPE_CATEGORY);
                        } else {
                            await save()
                        }
                    }
                },
            });
            setChanging(false)
        }
        setSelectedType(value);
    }
    const checkEmptyRow = () => {
        if (selectedType === SELECTED_TYPE_EVENT) {
            if (eventComponents['2'].length === 0 && eventComponents['1'] === 0) {
                return "Please add an event !";
            }
            if (eventComponents['1'].length === 0 && eventComponents['2'].length !== 0) {
                return 'Do not leave the row 1 empty!\n\nMove event from the "Row 2" to the "Row 1"';
            }
        } else {
            if (categoryComponents['1'].length === 0) {
                return "Please add an application category !"
            }
        }

        return '';
    }

    const save = async () => {
        setLoading(true);
        let checkMsg = checkEmptyRow();
        if (checkMsg.length !== 0) {
            toast.warn(checkMsg);
            setLoading(false);
            return;
        }
        let request = buildPositionsModelRequest(
            selectedType === SELECTED_TYPE_CATEGORY ? categoryComponents : eventComponents,
            currentTemplate.id, selectedType);
        if (request.listPosition.length === 0) {
            toast.warn('No component is added!')
            setLoading(false);
            return;
        }
        try {
            let res;
            if (currentTemplate.status === 'incomplete') {
                if (selectedType === SELECTED_TYPE_CATEGORY && isFirstSavingCategory) {
                    res = await createAppCategoryPosition(request)
                    setFirstSavingCategory(false)
                } else if (selectedType === SELECTED_TYPE_EVENT && isFirstSavingEvent) {
                    res = await createEventPosition(request);
                    setFirstSavingEvent(false)
                } else {
                    if (selectedType === SELECTED_TYPE_CATEGORY) {
                        res = await updateAppCategoryPosition(request);
                    } else {
                        res = await updateEventPosition(request);
                    }
                }
            } else {
                if (selectedType === SELECTED_TYPE_CATEGORY && isFirstSavingEvent) {
                    res = await updateAppCategoryPosition(request);
                } else {
                    res = await updateEventPosition(request);
                }
            }
            toast.success(selectedType === SELECTED_TYPE_CATEGORY ?
                "Save category components succesfully" :
                "Save event components succesfully");
        } catch (e) {
            console.error(e);
            toast.error('Save failed!');
        } finally {
            setChanging(false)
            setLoading(false);
        }
    }


    const breadCumbData = [
        {
            href: TEMPLATE_MANAGER_HREF,
            label: TEMPLATE_MANAGER_LABEL,
            icon: null
        },
        {
            href: TEMPLATE_EDITING_HREF,
            label: TEMPLATE_CREATE_LABEL,
            icon: null
        }
    ]
    return (<>
        <CustomBreadCumb props={breadCumbData} />
        {eventComponents && categoryComponents && currentTemplate && !isLoading ?
            <>
                <TemplateBasicInfo currentTemplate={currentTemplate} />
                <Divider style={{ height: 10 }}><label style={{ fontWeight: 'bold', fontSize: 20 }}>Customize layout</label></Divider>
                <div style={{ marginTop: 10, marginBottom: 10, height: 40, textTransform: 'capitalize' }} >
                    <Row>
                        <Col span={8} >
                            <Select defaultValue={selectedType} style={{ width: 200, fontSize: 20 }} onChange={onSelectedTypeChange}>
                                <Option value={SELECTED_TYPE_CATEGORY} style={{ textTransform: 'capitalize' }}>{SELECTED_TYPE_CATEGORY}</Option>
                                <Option value={SELECTED_TYPE_EVENT} style={{ textTransform: 'capitalize' }}>{SELECTED_TYPE_EVENT}</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>

                <div id="arrangement-space">
                    {selectedType === SELECTED_TYPE_CATEGORY ? <>
                        {categoryComponents ?
                            <CustomDragDropContext
                                selectedType={selectedType}
                                setComponents={setCategoryComponents}
                                previousComponents={categoryComponents}
                                setChanging={setChanging}
                            />
                            :
                            <>
                                <h3>You're not install any service application!</h3>
                            </>
                        }
                    </> : <>
                        {eventComponents ?
                            <CustomDragDropContext
                                selectedType={selectedType}
                                setComponents={setEventComponents}
                                previousComponents={eventComponents}
                                setChanging={setChanging}
                            />
                            :
                            <>
                                <h3>Don't have any event to show!</h3>
                            </>
                        }
                    </>
                    }
                </div>

                {
                    (selectedType === SELECTED_TYPE_CATEGORY && categoryComponents.length != 0) || (selectedType === SELECTED_TYPE_EVENT && eventComponents.length != 0) ?
                        <div style={{ marginTop: 40 }}>
                            <SaveButtonComponent save={save} isLoading={isLoading} />
                        </div> : null
                }
            </> : <Skeleton />
        }
    </>)
}
export default EditTemplatePage;


