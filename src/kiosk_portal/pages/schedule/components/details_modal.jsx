import { Button, Modal } from "antd"
import ScheduleKioskDetail from "../../kiosk/schedule/components/shedule_detail_area"

export const ScheduleDetailsComponent = ({ schedule, visible, onClose }) => {
    return <>
        <Modal
            key={'scheeduleDetailsModal' + schedule.id}
            title="Schedule Details"
            visible={visible}
            onCancel={onClose}
            footer={
                <Button onClick={() => onClose()}>Close</Button>
            }
        >
            <ScheduleKioskDetail
                currentSchedule={schedule}
                labelCol={6}
                wapperCol={18}
                offsetWrapperCol={0}
            />
        </Modal>
    </>
}