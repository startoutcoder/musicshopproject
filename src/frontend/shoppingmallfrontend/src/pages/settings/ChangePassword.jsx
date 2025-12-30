import React, { useState } from 'react';
import api from '../../services/api';

const ChangePassword = ({ onClose }) => {
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            await api.put('/api/users/me/password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setSuccess('Password updated successfully! You can now close this window.');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Clear form
        } catch (err) {
            setError(err.response?.data || 'Failed to update password.');
        }
    };

    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Change Password</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" name="currentPassword" onChange={handleChange} value={formData.currentPassword} required />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input type="password" name="newPassword" onChange={handleChange} value={formData.newPassword} required />
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} required />
                </div>
                <button type="submit" className="btn-primary">Update Password</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
};

export default ChangePassword;