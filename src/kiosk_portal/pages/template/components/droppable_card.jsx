import { Card } from "antd"
import Meta from "antd/lib/card/Meta"

export const DroppableCard = ({ component }) => {
    return <Card
        hoverable
        style={{ width: 150, marginLeft: 20, marginRight: 20 }}
        size={'small'}
        cover={<img alt="example" src={component.image} style={{ height: 120, }}></img>}
    >
        <Meta title={component.name} description="" />
    </Card>
}