import React, { Fragment } from 'react';
import moment from 'moment';

const TimezonePicker = ({ nameAttribute, index }) => {
  return (
    <div>
      <label>Timezone {index + 1}</label>
      <select name={nameAttribute}>
          {moment.tz.names().map((timezoneName, timezoneIdx) => 
              <option key={timezoneIdx}>{timezoneName}</option>
          )}
      </select>
    </div>
      
  );
;}

export default TimezonePicker;
