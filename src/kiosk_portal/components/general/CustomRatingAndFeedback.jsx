import { Avatar, Col, Rate, Row } from "antd"
import moment from 'moment';
const CustomRatingAndFeedback = ({ feedback }) => {

    return (<>

        <Row style={{ float: 'center', marginTop: 20 }}>
            <Col span={2} >
                <Avatar src="https://joeschmoe.io/api/v1/random" size='large' />
            </Col>
            <Col span={22}>
                <div style={{ marginBottom: 10 }}>
                    <label htmlFor="" style={{ color: 'blue', fontWeight: 'bold' }}>{feedback.partyEmail}</label>
                    <label style={{ color: 'grey', marginLeft: 20, marginRight: 5 }}>{moment(feedback.createDate).format('DD/MM/YYYY HH:mm')}</label>
                    <Rate disabled value={feedback.rating} />
                </div>
                <p>{feedback.content}</p>
            </Col>
        </Row>


    </>)
}
export default CustomRatingAndFeedback;