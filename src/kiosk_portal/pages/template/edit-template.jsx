import { Col, Modal, Row, Select, Skeleton } from "antd";
import { useState, useEffect } from "react";
import "./styles.css"
import { toast } from "react-toastify";
import { getListAvailableCategoriesService, getListAvailableEventsService } from "../../services/categories_service";
import { Option } from "antd/lib/mentions";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAppCategoryPosition, createEventPosition, getAppCategoryPositionService, getEventPositionService, getTemplateById, updateAppCategoryPosition, updateEventPosition } from "../../services/template_service";
import { TEMPLATE_CREATE_LABEL, TEMPLATE_EDITING_HREF, TEMPLATE_MANAGER_HREF, TEMPLATE_MANAGER_LABEL } from "../../components/breadcumb/breadcumb_constant";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { buildPositionsModelRequest, checkEmptyRow, createEventModel, getComponentFromList, getIndexOfEmptyRow, isColumnExisted, removeItemFromList, reorderKeysOfObject } from "./components/utils";
import { CustomDragDropContext } from "./components/custom_drag_drop_context";
import { TemplateBasicInfo } from "./components/template_basic_info";
import { SaveButtonComponent } from "./components/save_button_component";
import { AddRowComponent } from "./components/add_row_button_component";
//Selected Type
const SELECTED_TYPE_CATEGORY = "category";
const SELECTED_TYPE_EVENT = "event";
const ROOT_ROW_CATEGORY = "categoryavailable";
const ROOT_ROW_EVENT = "eventavailable";
const FIRST_ROW_EVENT = "eventrow1"
const FIRST_ROW_CATEGORY = "categoryrow1"
const WARN_DO_NOT_LEAVE_EMPTY_ROW = 'Dont leave an empty row!'
const EditTemplatePage = () => {
    const [isLoading, setLoading] = useState(false);
    const [isChanging, setChanging] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedType, setSelectedType] = useState(SELECTED_TYPE_CATEGORY);
    const [categoryComponents, setCategoryComponents] = useState();
    const [eventComponents, setEventComponents] = useState();
    const [currentTemplate, setCurrentTemplate] = useState();
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
            let data = {};
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
                        if (!isColumnExisted(rowIndex, data)) {
                            data['eventrow' + `${rowIndex + 1}`] = dataTemp;
                        }
                    }
                }
            } else {
                data[`${FIRST_ROW_EVENT}`] = [];
            }
            data[`${ROOT_ROW_EVENT}`] = allEvents;
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
            let data = {};
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
                        if (!isColumnExisted(rowIndex, data)) {
                            data['categoryrow' + `${rowIndex + 1}`] = dataTemp;
                        }
                    }
                }
            } else {
                data[`${FIRST_ROW_CATEGORY}`] = [];
            }
            data[`${ROOT_ROW_CATEGORY}`] = allCategories;
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

    function onClickAddNewRow() {
        if (haveEmptyRow()) {
            toast.warn(WARN_DO_NOT_LEAVE_EMPTY_ROW)
        }
        let rowName = generateRowName();
        if (selectedType == SELECTED_TYPE_CATEGORY) {
            setCategoryComponents(prevState => {
                return { ...prevState, [`${rowName}`]: [] };
            });
            setChanging(true);
            return;
        }
        setEventComponents(prevState => {
            return { ...prevState, [`${rowName}`]: [] };
        });
        setChanging(true)
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
            return checkEmptyRow(categoryComponents, ROOT_ROW_CATEGORY)
        }
        return checkEmptyRow(eventComponents, ROOT_ROW_EVENT)

    }
    const haveEmptyRowWithParam = (components) => {
        if (selectedType === SELECTED_TYPE_CATEGORY) {
            return checkEmptyRow(components, ROOT_ROW_CATEGORY)
        }
        return checkEmptyRow(components, ROOT_ROW_EVENT);
    }

    const save = async () => {
        setLoading(true);
        if (checkEmptyRow) {
            let rowIndex;
            if (selectedType === SELECTED_TYPE_CATEGORY) {
                rowIndex = getIndexOfEmptyRow(categoryComponents, ROOT_ROW_CATEGORY)
            } else {
                rowIndex = getIndexOfEmptyRow(eventComponents, ROOT_ROW_EVENT)
            }
            if (rowIndex !== -1) {
                toast.error(`The row ${rowIndex} is empty!\nPlease remove all empty rows before you save!`)
                setLoading(false);
                return;
            }
        }
        let request = buildPositionsModelRequest(
            selectedType === SELECTED_TYPE_CATEGORY ? categoryComponents : eventComponents,
            currentTemplate.id, selectedType);
        try {
            let res;
            if (currentTemplate.status === 'incomplete') {
                if (selectedType === SELECTED_TYPE_CATEGORY) {
                    res = await createAppCategoryPosition(request)
                } else {
                    res = await createEventPosition(request);
                }
            } else {
                if (selectedType === SELECTED_TYPE_CATEGORY) {
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
                        {categoryComponents.length != 0 ?
                            <CustomDragDropContext
                                selectedType={selectedType}
                                setComponents={setCategoryComponents}
                                previousComponents={categoryComponents}
                                deleteRow={deleteRow}
                                haveEmptyRow={haveEmptyRowWithParam}
                                setChanging={setChanging}
                            />
                            :
                            <>
                                <h3>You're not install any service application!</h3>
                            </>
                        }
                    </> : <>
                        {eventComponents.length != 0 ?
                            <CustomDragDropContext
                                selectedType={selectedType}
                                setComponents={setEventComponents}
                                previousComponents={eventComponents}
                                deleteRow={deleteRow}
                                haveEmptyRow={haveEmptyRowWithParam}
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
                            <AddRowComponent onClickAddNewRow={onClickAddNewRow} />
                            <SaveButtonComponent save={save} isLoading={isLoading} />
                        </div> : null
                }
            </> : <Skeleton />
        }
    </>)
}
export default EditTemplatePage;


