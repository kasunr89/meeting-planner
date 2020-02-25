import React from 'react';

const DatePicker = ({ label, nameAttribute }) => {
    return (
        <div>
            <label>{label}</label>
            <input type='date' name={nameAttribute} required></input>
        </div>
    );
};

export default DatePicker;
