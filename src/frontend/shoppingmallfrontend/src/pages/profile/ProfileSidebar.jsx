import React, { useState } from 'react';
import api from '../../services/api';
import './ProfileSidebar.css';

const ProfileSidebar = ({ user, onProfileUpdate, onPictureEditClick }) => {
    const [isEditing, setIsEditing] = useState(false);

    const [editData, setEditData] = useState({
        userName: user.userName || '',
        introduction: user.introduction || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setEditData({ userName: user.userName, introduction: user.introduction });
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const response = await api.put('/api/users/profile', editData);
            onProfileUpdate(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. The username may already be taken.");
        }
    };

    const profilePicStyle = user.profilePicture ? { backgroundImage: `url(${user.profilePicture})` } : {};

    return (
        <aside className="profile-sidebar">
            <div className="profile-pic-container">
                <div className="profile-pic" style={profilePicStyle}>
                    {!user.profilePicture && user.userName ? user.userName.charAt(0).toUpperCase() : ''}
                </div>
                <button className="edit-icon-btn picture-edit-btn" onClick={onPictureEditClick}>📷</button>
            </div>

            {isEditing ? (
                <div className="sidebar-edit-view">
                    <input
                        type="text"
                        name="userName"
                        className="edit-username-input"
                        value={editData.userName}
                        onChange={handleInputChange}
                    />
                    <textarea
                        name="introduction"
                        className="edit-intro-textarea"
                        value={editData.introduction}
                        onChange={handleInputChange}
                        placeholder="Your introduction..."
                    />
                    <div className="sidebar-actions">
                        <button onClick={handleCancel} className="sidebar-btn cancel-btn">Cancel</button>
                        <button onClick={handleSave} className="sidebar-btn save-btn">Save</button>
                    </div>
                </div>
            ) : (
                // --- DISPLAY VIEW ---
                <div className="sidebar-display-view">
                    <h2 className="profile-username">{user.userName}</h2>
                    <p className="profile-introduction">
                        {user.introduction || "No introduction yet."}
                    </p>
                    <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                </div>
            )}
        </aside>
    );
};

export default ProfileSidebar;
