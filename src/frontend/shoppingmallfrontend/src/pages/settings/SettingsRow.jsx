import React from 'react';
import './SettingsPage.css';

const SettingsRow = ({ icon, label, children, action }) => {
    return (
        <div className="settings-row">
            <div className="settings-label">
                {icon && <span className="settings-icon">{icon}</span>}
                {label}
            </div>
            <div className="settings-value">
                {children}
            </div>
            <div className="settings-action">
                {action}
            </div>
        </div>
    );
};

export default SettingsRow;