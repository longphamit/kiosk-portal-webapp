import { Col, Row } from "antd";
import { DragDropContext } from "react-beautiful-dnd";
import { ComponentList } from "../component-list";
import { reorderComponent } from "../reorder";

//Selected Type
const SELECTED_TYPE_EVENT = "event";
export const CustomDragDropContext = ({
  selectedType,
  setComponents,
  previousComponents,
  setChanging,
}) => {
  const getRowTitle = (i) => {
    if (selectedType === SELECTED_TYPE_EVENT) {
      return i == 0 ? "Available" : i == 1 ? "Row 1" : "Row 2";
    }
    return i == 0 ? "Available" : "Displaying";
  };

  return (
    <DragDropContext
      key={selectedType}
      onDragEnd={({ destination, source }) => {
        // // dropped outside the list
        if (!destination) {
          return;
        }
        const reorder = reorderComponent(
          previousComponents,
          source,
          destination
        );
        setComponents(reorder);
        setChanging(true);
      }}
    >
      <div>
        {Object.entries(previousComponents).map((e, i) => (
          <div>
            <div style={{ fontSize: 20, paddingTop: 10 }}>
              <Row>
                <Col span={6} offset={9} justify="center" align="middle">
                  {getRowTitle(i)}
                </Col>
              </Row>
            </div>
            {selectedType === SELECTED_TYPE_EVENT ? (
              <ComponentList
                internalScroll
                key={e[0]}
                listId={e[0]}
                listType="CARD"
                components={e[1]}
                event={e}
              />
            ) : (
              <ComponentList
                internalScroll
                key={e[0]}
                listId={e[0]}
                listType="CARD"
                components={e[1]}
              />
            )}
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
