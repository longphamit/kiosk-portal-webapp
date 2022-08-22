import moment from "moment";

export const toStringDateTimePicker = (date, time) => {
    return moment(date).format('YYYY-MM-DD[T]') + moment(time).format('HH:mm:ss.sss[Z]');
}
export function checkDateTime(dateStart, timeStart, timeEnd, dateEnd) {
    const d = new Date();
    let now = moment(d).format('YYYY-MM-DD[T]HH:mm:ss.sss[Z]');
    let start = toStringDateTimePicker(dateStart, timeStart);
    //check time start
    if (start < now) {
        return "Time start must be late from now"
    } else {
        let end = toStringDateTimePicker(dateEnd, timeEnd);
        if (start > end) { // Check ending time
            return "Please recheck date and time ending";
        }
    }
    return '';
}