import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';
import {updateUserInfo} from "../../redux/authSlice";
import api from '../../services/api';
import SettingsRow from './SettingsRow';

const AccountInfoSection = ({ user }) => {
    const dispatch = useDispatch();
    const [editingField, setEditingField] = useState(null);
    const [fieldValue, setFieldValue] = useState('');
    const [error, setError] = useState('');

    if (!user) return null;

    const handleEditClick = (fieldName, currentValue) => {
        setEditingField(fieldName);
        setFieldValue(currentValue);
        setError('');
    };

    const handleCancelClick = () => {
        setEditingField(null);
        setError('');
    };

    const handleSaveClick = async (fieldName) => {
        if (fieldValue.trim() === '') {
            setError('Field cannot be empty.');
            return;
        }

        try {
            const payload = { [fieldName]: fieldValue };
            const response = await api.put('/api/users/me/info', payload);

            dispatch(updateUserInfo(response.data));

            setEditingField(null);
            setError('');
        } catch (err) {
            console.error("API SAVE FAILED:", err);

            // You can also inspect the response part of the error specifically
            if (err.response) {
                console.error("Error Response Data:", err.response.data);
                setError(err.response.data.message || `Failed to update ${fieldName}.`);
            } else {
                setError(`An unknown error occurred while updating ${fieldName}.`);
            }
        }
    };

    const renderField = (fieldName, label) => {
        const isEditing = editingField === fieldName;
        const currentValue = user[fieldName];

        return (
            <SettingsRow
                label={label}
                action={
                    isEditing ? (
                        <div className="action-buttons">
                            <button className="btn-save" onClick={() => handleSaveClick(fieldName)}>Save</button>
                            <button className="btn-cancel" onClick={handleCancelClick}>Cancel</button>
                        </div>
                    ) : (
                        <button className="link-button" onClick={() => handleEditClick(fieldName, currentValue)}>Edit</button>
                    )
                }
            >
                {isEditing ? (
                    <input
                        type="text"
                        className="inline-edit-input"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        autoFocus
                    />
                ) : (
                    currentValue || <span className="text-muted">Not set</span>
                )}
            </SettingsRow>
        );
    };

    return (
        <section className="settings-section">
            <h2 className="section-title">Account Information</h2>
            {error && <p className="error-message full-width-error">{error}</p>}

            <SettingsRow label="Your User ID">{user.userId}</SettingsRow>

            {renderField('userName', 'Username')}
            <SettingsRow
                label="Password"
                action={<button className="link-button">Edit</button>}
            />
            {renderField('email', 'Email')}
            {renderField('phoneNumber', 'Phone Number')}
        </section>
    );
};

export default AccountInfoSection;