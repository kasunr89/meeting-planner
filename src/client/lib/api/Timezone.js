import momentTZ from 'moment-timezone';

export const getDefaultSlots = (date, timezone) => {
    return new Promise((resolve) => {
        const slotArr = [];
        let i = 0;
        while(i <= 24) {
            const slot = momentTZ.tz(date, timezone);
            slot.add(i, 'h');
            slotArr.push({
                key: slot.unix(),
                seq: i
            });
            i++;
        }

        resolve(slotArr);
    });
};
