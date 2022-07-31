import { DeleteOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { DragDropContext } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { ComponentList } from "../component-list";
import { reorderComponent } from "../reorder";

//Selected Type
const SELECTED_TYPE_CATEGORY = "category";
const SELECTED_TYPE_EVENT = "event";
const ROOT_ROW_CATEGORY = "categoryavailable";
const ROOT_ROW_EVENT = "eventavailable";
const FIRST_ROW_EVENT = "eventrow1"
const FIRST_ROW_CATEGORY = "categoryrow1"
const WARN_DO_NOT_LEAVE_EMPTY_ROW = 'Dont leave an empty row!'
export const CustomDragDropContext = ({
    selectedType,
    setComponents,
    previousComponents,
    setChanging,
    deleteRow,
    haveEmptyRow
}) => {
    return <DragDropContext key={selectedType} onDragEnd={({ destination, source }) => {
        // // dropped outside the list
        if (!destination) {
            return;
        }
        const reorder = reorderComponent(
            previousComponents,
            source,
            destination
        )
        setComponents(
            reorder
        );
        setChanging(true)
        if (haveEmptyRow(reorder) && source.droppableId !== destination.droppableId) {
            toast.warn(WARN_DO_NOT_LEAVE_EMPTY_ROW)
        }
    }}>
        <div>
            {Object.entries(previousComponents).map((e, i) => (
                <div >
                    <div style={{ fontSize: 20, paddingTop: 10 }}>
                        <Row>
                            <Col span={6} offset={9} justify="center" align="middle">
                                {i == 0 ? 'Available' : 'Row ' + i + ' (Minimum 1)'}
                            </Col>
                            {selectedType === SELECTED_TYPE_EVENT ?
                                e[0] !== ROOT_ROW_EVENT && e[0] !== FIRST_ROW_EVENT ?
                                    <DeleteRowComponent deleteRow={deleteRow} item={e[0]} /> : null
                                :
                                e[0] !== ROOT_ROW_CATEGORY && e[0] !== FIRST_ROW_CATEGORY ?
                                    <DeleteRowComponent deleteRow={deleteRow} item={e[0]} /> : null
                            }
                        </Row>
                    </div>
                    {selectedType === SELECTED_TYPE_EVENT ?
                        <ComponentList
                            internalScroll
                            key={e[0]}
                            listId={e[0]}
                            listType="CARD"
                            components={e[1]}
                            event={e}
                        /> :
                        <ComponentList
                            internalScroll
                            key={e[0]}
                            listId={e[0]}
                            listType="CARD"
                            components={e[1]}
                        />
                    }
                </div>
            ))}
        </div>
    </DragDropContext>
}

const DeleteRowComponent = ({ deleteRow, item }) => {
    return <>
        <Col span={6} offset={3} justify="left" align="end">
            <div style={{ float: 'right', position: 'relative' }}>
                <DeleteOutlined
                    style={{ fontSize: 20, color: 'red', marginRight: 5 }}
                    onClick={() => deleteRow(item)}
                />
            </div>
        </Col>
    </>
}