import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const MeetingTable = ({ timezones, meetingTimeSlots, workingHours }) => {
    return (
        <table>
            <TableHeader timezones={timezones} />
            <tbody>
                {Object.keys(meetingTimeSlots).map((key, index) =>
                    <TableRow meetingTimeSlots={meetingTimeSlots[key]} tableRowIndex={index} workingHours={workingHours} />
                )}
            </tbody>
        </table>  
    );
};

export default MeetingTable;
