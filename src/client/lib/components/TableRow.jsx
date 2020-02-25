import React from 'react';
import get from 'lodash/get';
import { isWorkingHour } from '../../utils/DateTimeUtils';

const TableRow = ({ meetingTimeSlots, tableRowIndex, workingHours }) => {
    return (
        <tr key={`table-row-${tableRowIndex}`}>
            {meetingTimeSlots.map((slot, index) =>
                <td 
                    key={`table-cell-${index}`}
                    style={isWorkingHour(get(workingHours, slot.timezoneId, []), slot.timeObject) ? { color: 'red' }: {}}
                >
                    {slot.timeObject.format('YYYY-MM-DD HH:mm')}
                </td>
            )}
        </tr>
    );
};

export default TableRow;
