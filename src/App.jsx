import React, { Component, Fragment } from 'react';
import { getTimeSlotsPerDay, getWorkingHours } from './time-zone';
import Constants from './constants';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import './App.css';

const dataKeys = [
    {
        key: 'meetingDate',
        nameAttribute: 'meeting-date'
    },
    {
        key: 'startHour',
        nameAttribute: 'start-hour',
        type: 'number'
    },
    {
        key: 'endHour',
        nameAttribute: 'end-hour',
        type: 'number'
    },
    {
        key: 'timezones',
        nameAttribute: 'timezone-picker-[index]',
        multiple: true
    }
];

class App extends Component {

	constructor() {
        super();

		this.state = {
            timezones: [
                {   
                    name: 'America/New_York',
                    seq: 1,
                    uuid: 'b84c7c56-4671-4c51-80d2-2a16e7e50340',
                    isDefault: true
                },
                {   
                    name: 'Asia/Colombo',
                    seq: 2,
                    uuid: 'b84c7c56-4671-4c51-80d2-2a16e7e50341',
                    isDefault: false
                },
                {   
                    name: 'Europe/Tallinn',
                    seq: 3,
                    uuid: 'b84c7c56-4671-4c51-80d2-2a16e7e50342',
                    isDefault: false
                }
            ],
            timezoneData: {},
            workingHours: {}
		};
    }

    processAvailableSlots(availableSlots) {
        const slotPerHour = {};
        
        this.state.timezones.map((timezone) => {
            availableSlots.map((slot) => {
                if (!slotPerHour[slot.key]) {
                    slotPerHour[slot.key] = [];
                }

                slotPerHour[slot.key].push({
                    timeObject: momentTZ.tz(slot.key * 1000, timezone.name),
                    seq: slot.seq,
                    timezoneId: timezone.uuid
                });
            });
        });

        return slotPerHour;
    }
    
    identifyWorkingDays(meetingDate, startHour, endHour, availableSlots) {
        const workingDaysPromises = this.state.timezones.map((timezone) => {
            return getWorkingHours(startHour, endHour, meetingDate, timezone.name)
                .then((workingHours) => {
                    return {
                        workingHours,
                        timezoneId: timezone.uuid,
                    };
                })
        });
        
        Promise.all(workingDaysPromises)
            .then((workingHours) => {
                this.setState({
                    timezoneData: availableSlots,
                    workingHours
                })
            });

    }

    isWorkingDay(slot) {
        const x = _.find(this.state.workingHours, { timezoneId: slot.timezoneId });
        const workingHour = _.find(x.workingHours, (wh) => {
            if (moment(slot.timeObject).isSame(wh.workingHour)) {
                return true;
            }

            let endHour = wh.workingHour.clone().add(1, 'h');
            let lastHour = _.last(x.workingHours);

            if (moment(endHour).isAfter(lastHour.workingHour)) {
                return false;
            }

            return moment(slot.timeObject).isBetween(wh.workingHour, endHour);
    
        });
        if (workingHour) {
            return true;
        }

        return false;
    }
    
    handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const submitObject = {};
        for (let data of dataKeys) {
            const value = formData.get(data.nameAttribute);

            if (data.type === 'number') {
                value = Number(value);
            }

            submitObject[data.key] = value;
        }

        console.log(submitObject)

        getTimeSlotsPerDay(submitObject.meetingDate, _.get(this.state.timezones, '[0].name'))
            .then(this.processAvailableSlots.bind(this))
            .then(this.identifyWorkingDays.bind(this, submitObject.meetingDate, submitObject.startHour, submitObject.endHour));
    }
    
	render() {
        // moment.tz.names()
		return (
            <Fragment>
                <div className='section-1'>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <label>Date:</label>
                        <input type='date' name='meeting-date' required></input>
                        <br />
                        <label>Start Hour:</label>
                        <select name='start-hour' defaultValue={Constants.defaultStartHour}>
                            {_.range(1, 25).map((number) => 
                                <option key={number}>{number}</option>
                            )}
                        </select>
                        <label>End Hour:</label>
                        <select name='end-hour' defaultValue={Constants.defaultEndHour}>
                            {_.range(1, 25).map((number) => 
                                <option key={number}>{number}</option>
                            )}
                        </select>
                        <br />

                        <div className='timezone-bubble'>
                            <label>Timezone 1</label>
                            <select name='timezone-picker-1'>
                                {moment.tz.names().map((timezoneName, index) => 
                                    <option key={index}>{timezoneName}</option>
                                )}
                            </select>

                            <label>Timezone 2</label>
                            <select name='timezone-picker-2'>
                                {moment.tz.names().map((timezoneName, index) => 
                                    <option key={index}>{timezoneName}</option>
                                )}
                            </select>
                        </div>
                        

                    

                        <button>Send data!</button>
                    </form>
                </div>
                <div className='mid-ground'></div>
                <div className='section-2'>
                    <table>
                        <tbody>
                            <tr>
                                {this.state.timezones.map((data) =>
                                    <td key={data.uuid} key-data={data.uuid}>{data.name}</td>
                                )}
                            </tr>
                                {Object.keys(this.state.timezoneData).map((key, j) =>
                                    <tr key={j} key-data={j}>
                                        {this.state.timezoneData[key].map((slot, i) =>
                                            <td key={key + '_' + i} key-data={key + '_' + i} style={this.isWorkingDay(slot) ? { color: 'red' }: {}}>{slot.timeObject.format('YYYY-MM-DD HH:mm')}</td>
                                        )}
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </Fragment>
		);
	}
}

export default App;
