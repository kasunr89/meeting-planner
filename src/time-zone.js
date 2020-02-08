import { resolve } from 'url';
import { rejects } from 'assert';

const moment = require('moment');
const momentTZ = require('moment-timezone');
const _ = require('lodash');

const date = '2020-01-20';
const timezone_1 = 'America/New_York';
const timezone_2 = 'Asia/Colombo';
const startHour = 7;
const endHour = 18;


export const getWorkingHours = (startHour, endHour, date, timezone) => {
    return new Promise((resolve) => {
        const workingHours = [];
        let i = startHour;
        while(i <= endHour) {
            const workingHourBase = momentTZ.tz(date, timezone);
            workingHourBase.add(i, 'h');
            workingHours.push({
                seq: i,
                workingHour: workingHourBase
            });
            i++;
        }

        resolve(workingHours);
    });
};

export const getTimeSlotsPerDay = (date, timezone) => {
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
    })
};

const filterOutWorkingHours = (slotArr, workingHours) => {
    return _.filter(slotArr, (o) => {
        const x = _.find(workingHours, (wh) => {
            
            if (moment(o.value).isSame(wh.value)) {
                return true;
            }
    
            let endHour = wh.value.clone().add(1, 'h');
    
            if (!_.find(workingHours, { key: endHour.unix()})) {
                return false;
            }
        
            return moment(o.value).isBetween(wh.value, endHour);
        });
    
        return !_.isUndefined(x) ? true : false;
    });
};



 
// const newYorkWorkingHours = getWorkingHours(startHour, endHour, date, timezone_1);
// const colomboWorkingHours = getWorkingHours(startHour, endHour, momentTZ.tz(date, timezone_1).unix() * 1000, timezone_2);

// console.log(colomboWorkingHours)


// const newYorkSlots = _.filter(newYorkArr, (o) => {
//     const x = _.find(workingHours, (wh) => moment(o.value).isSame(wh));

//     return !_.isUndefined(x) ? true : false;
// });

// // console.log(newYorkSlots);

// /////////////////////////////////////////////////////

// const workingHoursSL = [];

// let xx = 7;
// while(xx <= 18) {
//     const workingHourBase = momentTZ.tz('2020-01-20', "Europe/Tallinn");
//     workingHourBase.add(xx, 'h');
//     workingHoursSL.push({
//         key: workingHourBase.unix(),
//         value: workingHourBase
//     });
//     xx++;
// }

// // console.log(workingHoursSL);

// const tallinnArr = [];
// let j = 0;
// while(j <= 24) {
//     const tallinn =  momentTZ.tz(momentTZ.tz("2020-01-20", "America/New_York").unix() * 1000, "Europe/Tallinn");
//     tallinn.add(j, 'h');
//     tallinnArr.push({
//         key: tallinn.unix(),
//         value: tallinn,
//         seq: j
//     });
//     j++;
// }

// const tallinnSlots = _.filter(tallinnArr, (o) => {
//     const x = _.find(workingHoursSL, (wh) => {
        
//         if (moment(o.value).isSame(wh.value)) {
//             return true;
//         }

//         let endHour = wh.value.clone().add(1, 'h');

//         if (!_.find(workingHoursSL, { key: endHour.unix()})) {
//             return false;
//         }
    
//         return moment(o.value).isBetween(wh.value, endHour);
//     });

//     return !_.isUndefined(x) ? true : false;
// });


// // console.log(newYorkSlots);
// // console.log('xxxxxxxxxxxx');
// // console.log(tallinnSlots);

// const matches = [];
// _.forEach(newYorkSlots, (slot) => {
//     const match = _.find(tallinnSlots,  ['seq', slot.seq]);
//     if (!_.isUndefined(match)) {
//         matches.push({
//             'newYork': slot,
//             'tallinn': match
//         });
//     }
// });

// console.log(matches);

