import React from 'react';

export default function Placeholder({ title }) {
    return (
        <div className="placeholder">
            <h3>{title}</h3>
            <div className="skeleton-loader" />
        </div>
    );
}
