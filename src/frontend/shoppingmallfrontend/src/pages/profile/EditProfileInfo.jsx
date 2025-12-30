import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import './EditProfileInfo.css';

const EditProfileInfo = ({ onProfileUpdate, onCancel }) => {
    const { user } = useSelector((state) => state.auth);

    const [userName, setUserName] = useState(user.userName || '');
    const [introduction, setIntroduction] = useState(user.introduction || '');


    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const profileData = { userName, introduction };
        try {
            const response = await api.put('/api/users/profile', profileData);
            onProfileUpdate(response.data);
            onCancel();
        } catch (error) {
            console.error("Failed to update profile info", error);
            alert("Failed to update profile. The username may already be taken.");
        }
    };

    return (
        <div className="edit-profile-info-container">
            <h2 className="profile-section-title">Edit Your Information</h2>
            <form onSubmit={handleSaveChanges}>
                <div className="form-group">
                    <label htmlFor="userName">Username</label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="introduction">Introduction</label>
                    <textarea
                        id="introduction"
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        placeholder="Tell us a bit about yourself..."
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
                    <button type="submit" className="save-btn">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default EditProfileInfo;
