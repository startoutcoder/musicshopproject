import React, { useState } from 'react';
import api from '../../services/api';
import './EditProfilePicture.css';

const EditProfilePicture = ({ onClose, onProfileUpdate }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await api.post('/api/users/profile/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onProfileUpdate(response.data);
            onClose();
        } catch (error) {
            console.error("Failed to upload picture", error);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Change Profile Picture</h2>
                <div className="upload-area">
                    {preview ? (
                        <img src={preview} alt="Preview" className="image-preview" />
                    ) : (
                        <div className="upload-placeholder">Select an image</div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                    <button type="button" onClick={handleUpload} className="save-btn" disabled={!selectedFile || isUploading}>
                        {isUploading ? 'Uploading...' : 'Save Picture'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePicture;