
export default {
    meetingDate: {
        nameAttribute: 'meeting-date'
    },
    startHour: {
        nameAttribute: 'start-hour',
        type: 'number'
    },
    endHour: {
        nameAttribute: 'end-hour',
        type: 'number'
    },
    timezones: {
        isMultiple: true,
        collection: [
            {
                nameAttribute: 'timezone-picker-1',
            },
            {
                nameAttribute: 'timezone-picker-2'
            },
            {
                nameAttribute: 'timezone-picker-3'
            }
        ]
    }
};
