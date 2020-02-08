const moment = require('moment');
const momentTZ = require('moment-timezone');
const _ = require('lodash');

const format = 'YYYY-MM-DD HH:mm:ss';
const dateOnly = 'YYYY-MM-DD';
const timeOnly = 'HH:mm:ss';
const date = "2020-01-20";


const workingHours = [];

let x = 7;
while(x <= 18) {
    const workingHourBase = momentTZ.tz('2020-01-20', "America/New_York");
    workingHourBase.add(x, 'h');
    workingHours.push(workingHourBase);
    x++;
}

const newYorkArr = [];
let i = 0;
while(i <= 24) {
    const newYork = momentTZ.tz(date, "America/New_York");
    newYork.add(i, 'h');
    newYorkArr.push({
        key: newYork.unix(),
        value: newYork,
        seq: i
    });
    i++;
}

const newYorkSlots = _.filter(newYorkArr, (o) => {
    const x = _.find(workingHours, (wh) => moment(o.value).isSame(wh));

    return !_.isUndefined(x) ? true : false;
});

// console.log(newYorkSlots);

/////////////////////////////////////////////////////

const workingHoursSL = [];

let xx = 7;
while(xx <= 18) {
    const workingHourBase = momentTZ.tz('2020-01-20', "Europe/Tallinn");
    workingHourBase.add(xx, 'h');
    workingHoursSL.push({
        key: workingHourBase.unix(),
        value: workingHourBase
    });
    xx++;
}

// console.log(workingHoursSL);

const tallinnArr = [];
let j = 0;
while(j <= 24) {
    const tallinn =  momentTZ.tz(momentTZ.tz("2020-01-20", "America/New_York").unix() * 1000, "Europe/Tallinn");
    tallinn.add(j, 'h');
    tallinnArr.push({
        key: tallinn.unix(),
        value: tallinn,
        seq: j
    });
    j++;
}

const tallinnSlots = _.filter(tallinnArr, (o) => {
    const x = _.find(workingHoursSL, (wh) => {
        
        if (moment(o.value).isSame(wh.value)) {
            return true;
        }

        let endHour = wh.value.clone().add(1, 'h');

        if (!_.find(workingHoursSL, { key: endHour.unix()})) {
            return false;
        }
    
        return moment(o.value).isBetween(wh.value, endHour);
    });

    return !_.isUndefined(x) ? true : false;
});


// console.log(newYorkSlots);
// console.log('xxxxxxxxxxxx');
// console.log(tallinnSlots);

const matches = [];
_.forEach(newYorkSlots, (slot) => {
    const match = _.find(tallinnSlots,  ['seq', slot.seq]);
    if (!_.isUndefined(match)) {
        matches.push({
            'newYork': slot,
            'tallinn': match
        });
    }
});

console.log(matches);

