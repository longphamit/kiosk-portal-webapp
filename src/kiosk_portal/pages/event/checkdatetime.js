import moment from "moment";

export const toStringDateTimePicker = (date, time) => {
    return moment(date).format('YYYY-MM-DD[T]') + moment(time).format('HH:mm:ss.sss[Z]');
}
export function checkDateTime(dateStart, timeStart, timeEnd, dateEnd) {
    let strDateResultFromNow = moment(moment(dateStart).format('YYYY-MM-DD')).fromNow();
    const d = new Date();
    let hour = d.getHours();
    let minute = d.getMinutes();
    if (strDateResultFromNow.includes('days ago')) { // Compare dateStart to today
        return "Date start is over";
    }
    if (strDateResultFromNow.includes('hours ago')) { // Compare on minute (create day is today)
        //strDateResultFromNow will round up the time. Ex: 7:30 -> 8 hours ago.
        let hourTimeStart = parseInt(moment(timeStart).format('H'))
        if ((hourTimeStart + 1) == strDateResultFromNow.replaceAll(' hours ago', '')) {
            if (moment(timeStart).format('m') < minute || moment(timeStart).format('m') == minute) {
                return "Time start must be late from now";
            }
        } else if (hourTimeStart < hour) {
            //Compare on hour
            return "Time start must be late from now";
        }
    }

    let start = toStringDateTimePicker(dateStart, timeStart);
    let end = toStringDateTimePicker(dateEnd, timeEnd);
    if (start > end) { // Check ending time
        return "Please recheck date and time ending";
    }
    return '';
}