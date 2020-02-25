import React from 'react';
import range from 'lodash/range';

const HourPicker = ({ label, nameAttribute, defaultValue }) => {
    return (
        <div>
            <label>{label}</label>
            <select name={nameAttribute} defaultValue={defaultValue}>
                {range(1, 25).map((number) => 
                    <option key={number}>{number}</option>
                )}
            </select>
        </div>
    );
};

export default HourPicker;
