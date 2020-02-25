import momentTZ from 'moment-timezone';
import uuid from 'uuid/v1';
// import _ from 'lodash';
import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import React, { Component, Fragment } from 'react';
import { getDefaultSlots } from './lib/api/Timezone';
import { getWorkingHours } from './utils/DateTimeUtils';
import Constants from './constants';
import FormFields from './lib/forms/FormFields';
import TimezonePicker from './lib/components/TimezonePicker';
import HourPicker from './lib/components/HourPicker';
import DatePicker from './lib/components/DatePicker';
import MeetingTable from './lib/components/MeetingTable';
import './App.css';

class App extends Component {

	constructor() {
        super();

		this.state = {
            timezones: [],
            meetingTimeSlots: {},
            workingHours: {},
            timezonePickerCount: size(FormFields[Constants.formFields.timezones].collection)
		};
    }
    
    handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const submitObject = {};
        for (let key in FormFields) {

            if (FormFields[key].isMultiple === true) {
                submitObject[key] = [];
                for (let element of FormFields[key].collection) {
                    submitObject[key].push({   
                        name: formData.get(element.nameAttribute),
                        uuid: uuid()
                    })
                }
            } else {
                let value = formData.get(FormFields[key].nameAttribute);
                if (FormFields[key].type === 'number') {
                    value = Number(value);
                }

                submitObject[key] = value;
            }
        }

        getDefaultSlots(submitObject.meetingDate, get(submitObject[Constants.formFields.timezones], '[0].name'))
            .then((defaultSlots) => {
                const meetingTimeSlots = this.processAvailableSlots(submitObject['timezones'], defaultSlots);
                const workingHours = this.identifyWorkingHours(
                    submitObject['timezones'],
                    submitObject['startHour'],
                    submitObject['endHour'],
                    submitObject['meetingDate']
                );

                this.setState({
                    meetingTimeSlots,
                    workingHours,
                    ...submitObject
                });
            });
    }

    processAvailableSlots(timezones, defaultSlots) {
        const slotPerHour = {};
        
        timezones.map((timezone) => {
            defaultSlots.map((slot) => {
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
    
    identifyWorkingHours(timezones, startHour, endHour, meetingDate) {
        const workHoursByTimezones = {};
        timezones.map((timezone) => {
            const workingHours = getWorkingHours(startHour, endHour, meetingDate, timezone.name);
            workHoursByTimezones[timezone.uuid] = workingHours;
        });

        return workHoursByTimezones
    }

    shouldDisplayMeetingTable() {
        return !isEmpty(this.state.meetingTimeSlots);
    }
    
	render() {
    	return (
            <Fragment>
                <div className='form-section'>
                    <form onSubmit={this.handleSubmit}>
                        <DatePicker 
                            label='Meeting Date' 
                            nameAttribute={FormFields[Constants.formFields.meetingDate].nameAttribute} />

                        <HourPicker 
                            label='Start Hour'
                            nameAttribute={FormFields[Constants.formFields.startHour].nameAttribute}
                            defaultValue={Constants.defaultStartHour} />

                        <HourPicker 
                            label='End Hour'
                            nameAttribute={FormFields[Constants.formFields.endHour].nameAttribute}
                            defaultValue={Constants.defaultEndHour} />


                        <div className='timezone-bubble'>
                            {FormFields[Constants.formFields.timezones].collection.map((timezonePicker, index) =>
                                <Fragment key={`timezone-picker-fragment-${index}`}>
                                    <TimezonePicker 
                                        nameAttribute={timezonePicker.nameAttribute}
                                        index={index} />
                                </Fragment>
                            )}
                        </div>
                        <button>Send data!</button>
                    </form>
                </div>

                <div className='mid-ground'></div>

                {this.shouldDisplayMeetingTable() &&
                    <div className='meeting-table-section'>
                        <MeetingTable
                            timezones={this.state.timezones}
                            meetingTimeSlots={this.state.meetingTimeSlots}
                            workingHours={this.state.workingHours} />
                    </div>
                }
            </Fragment>
		);
	}
}

export default App;
