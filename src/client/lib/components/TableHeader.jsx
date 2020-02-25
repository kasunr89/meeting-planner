import React from 'react';

const TableHeader = ({ timezones }) => {
    return (
        <thead>
            <tr>
                {timezones.map((data) =>
                    <td key={data.uuid}>{data.name}</td>
                )}
            </tr>
        </thead>
    );
};

export default TableHeader;
