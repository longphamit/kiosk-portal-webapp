import { Button, Col, Input, Modal, Row, Select, Skeleton, Spin } from "antd";
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
import { createAppCategoryPosition, createEventPosition, getTemplateById } from "../../services/template_service";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { TEMPLATE_CREATE_HREF, TEMPLATE_CREATE_LABEL, TEMPLATE_MANAGER_HREF, TEMPLATE_MANAGER_LABEL } from "../../components/breadcumb/breadcumb_constant";

const MAXIUM_ELEMENTS_PER_ROW = 5;
//Selected Type
const SELECTED_TYPE_CATEGORY = "category";
const SELECTED_TYPE_EVENT = "event";
const ROOT_ROW_CATEGORY = "categoryavailable";
const ROOT_ROW_EVENT = "eventavailable";
const FIRST_ROW_EVENT = "eventrow1"
const FIRST_ROW_CATEGORY = "categoryrow1"
const CreateTemplatePage = () => {
    const [isChanging, setChanging] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedType, setSelectedType] = useState(SELECTED_TYPE_CATEGORY);
    const [categoryComponents, setCategoryComponents] = useState();
    const [eventComponents, setEventComponents] = useState();
    const [currentTemplate, setCurrentTemplate] = useState();
    let navigate = useNavigate();
    const getListCategoryFunction = async () => {
        try {
            let res = await getListAvailableCategoriesService();
            let categories = res.data.map(category => ({ id: category.id, image: category.logo, name: category.name }));
            let data = { [`${ROOT_ROW_CATEGORY}`]: categories, [`${FIRST_ROW_CATEGORY}`]: [] };
            setCategoryComponents(data);
        } catch (e) {
            setCategoryComponents({});
        }
    }
    const onNavigate = (url) => {
        navigate(url);
    };
    const getAvailabelEvents = async () => {
        try {
            let res = await getListAvailableEventsService();
            let events = [];
            for (const data of res.data) {
                let eventModal = createEventModel(data);
                let event = {
                    id: data.id,
                    name: data.name,
                    image: data.thumbnail.link,
                    event: eventModal
                }
                events.push(event);
            }
            let data = { [`${ROOT_ROW_EVENT}`]: events, [`${FIRST_ROW_EVENT}`]: [] };
            setEventComponents(data)
        } catch (e) {
            console.error(e)
            setEventComponents({});
        }
    }
    const getTemplateInfo = async () => {
        let id = searchParams.get("id");
        if (id == null) {
            onNavigate('/././unauth')
        } else {
            try {
                let res = await getTemplateById(id);
                setCurrentTemplate(res.data);
            } catch (e) {
                setCurrentTemplate({});
            }
        }
    }

    useEffect(() => {
        getTemplateInfo()
        getListCategoryFunction();
        getAvailabelEvents();
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
                            await save();
                        } catch (e) {

                        }
                    }
                },
            });
        }

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
        setLoading(true);
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
                setLoading(false);
                return;
            }
            let request = {
                templateId: currentTemplate.id,
                listPosition: listPosition
            }
            try {
                let res = await createAppCategoryPosition(request);
                if (res.code === 200) {
                    toast.success("Save category components succesfully")
                }
            } catch (e) {
                toast.error(e.response.data.message ?? 'Save failed!');
            } finally {
                setChanging(false)
                setLoading(false);
                return;
            }
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
            setLoading(false);
            return;
        }
        let request = {
            templateId: currentTemplate.id,
            listPosition: listPosition
        }
        try {
            let res = await createEventPosition(request);
            if (res.code === 200) {
                toast.success("Save event components succesfully")
            }
        } catch (e) {
            toast.error(e.response.data.message ?? 'Save failed!');
            console.error(e);
        } finally {
            setChanging(false)
            setLoading(false);
            return;
        }

    }
    const breadCumbData = [
        {
            href: TEMPLATE_MANAGER_HREF,
            label: TEMPLATE_MANAGER_LABEL,
            icon: null
        },
        {
            href: TEMPLATE_CREATE_HREF,
            label: TEMPLATE_CREATE_LABEL,
            icon: null
        }
    ]
    return (<>
        <CustomBreadCumb props={breadCumbData} />
        {eventComponents && categoryComponents && currentTemplate && !isLoading ?
            <>
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
                            <Select defaultValue={selectedType} style={{ width: 200, fontSize: 20 }} onChange={onSelectedTypeChange}>
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
                                if (destination.droppableId !== ROOT_ROW_CATEGORY && categoryComponents[destination.droppableId].length === MAXIUM_ELEMENTS_PER_ROW) {
                                    if (source.droppableId !== destination.droppableId) {
                                        toast.warn('Maxium only ' + MAXIUM_ELEMENTS_PER_ROW);
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
                                                        {i == 0 ? 'Available' : 'Row ' + i + ' (Maxium ' + MAXIUM_ELEMENTS_PER_ROW + ')'}
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
                                {isLoading === false ?
                                    <Button type="primary" style={{ width: 200, height: 50, fontSize: 24, fontWeight: 'bold' }} onClick={() => { save() }}>Save</Button>
                                    : <Spin />}
                            </Col>
                        </Row>
                    </div> : null
                }
            </> : <Skeleton />}
    </>)
}
export default CreateTemplatePage;
