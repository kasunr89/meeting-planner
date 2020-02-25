import momentTZ from 'moment-timezone';
import moment from 'moment';
import last from 'lodash/last';

export const getWorkingHours = (startHour, endHour, date, timezone) => {
    const workingHours = [];
    let i = startHour;
    while(i <= endHour) {
        const workingHourBase = momentTZ.tz(date, timezone);
        workingHourBase.add(i, 'h');
        workingHours.push(workingHourBase);
        i++;
    }

    return workingHours;
};

export const isWorkingHour = (workingHoursInTimezone, timeObject) => {
    let isWorkingHour = false;
    for (const workingHour of workingHoursInTimezone) {
        if (moment(timeObject).isSame(workingHour)) {
            isWorkingHour = true;
            break;
        }
        
        let endHour = workingHour.clone().add(1, 'h');
        let lastHour = last(workingHoursInTimezone);
        if (moment(endHour).isAfter(lastHour)) {
            isWorkingHour = false;
            break;
        }

        if (moment(timeObject).isBetween(workingHour, endHour)) {
            isWorkingHour = true;
            break;
        }
    }

    return isWorkingHour;
};
