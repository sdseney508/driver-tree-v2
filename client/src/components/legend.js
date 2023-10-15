import React from 'react';

const Legend = ({ stakeholders }) => {
    return (
        <div className="legend">
            <h2>Legend</h2>
            <h4>Stakeholders:</h4>
                {stakeholders}
        </div>
    );
};

export default Legend;
