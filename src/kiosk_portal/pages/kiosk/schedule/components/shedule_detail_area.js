import CustomRowItem from "../../../../components/general/CustomRowItem";

const ScheduleKioskDetail = ({
    currentSchdule,
    wapperCol,
    labelCol,
    offsetWrapperCol
}) => {
    const getTime = (timeStr) => {
        let time = timeStr.substr(0, 5);
        if (time.charAt() === '0') {
            return time.substr(1, 5);
        }
        return time;
    }
    const getArrDayOfWeek = () => {
        let arr = [];
        ((currentSchdule.dayOfWeek.split('-')).map((day) => {
            arr.push({ content: day, color: "cyan" });
        })
        );
        return arr;
    }
    return (
        <>
            {currentSchdule ?
                (<>
                    <CustomRowItem label="Name" content={currentSchdule.name} contentType="input" wapperCol={wapperCol} labelCol={labelCol} offsetWrapperCol={offsetWrapperCol} />
                    <CustomRowItem label="Time Start" content={getTime(currentSchdule.timeStart)} contentType="input" wapperCol={wapperCol} labelCol={labelCol} offsetWrapperCol={offsetWrapperCol} />
                    <CustomRowItem label="Time End" content={getTime(currentSchdule.timeEnd)} contentType="input" wapperCol={wapperCol} labelCol={labelCol} offsetWrapperCol={offsetWrapperCol} />
                    <CustomRowItem label="Day of week" content={getArrDayOfWeek()} contentType="tag" wapperCol={wapperCol} labelCol={labelCol} offsetWrapperCol={offsetWrapperCol} />
                    <CustomRowItem label="Status" content={[{ content: currentSchdule.status.toUpperCase(), color: currentSchdule.status === 'off' ? "#f50" : "#2db7f5" }]} contentType="tag" wapperCol={wapperCol} labelCol={labelCol} offsetWrapperCol={offsetWrapperCol} />

                </>) : (<></>)
            }
        </>);
}
export default ScheduleKioskDetail;