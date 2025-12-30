import React, { useState } from 'react';
import api from '../../services/api';

const EditInfo = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        // Add any other fields from your UserUpdateDTO here
    });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.put('/api/users/me/info', formData);
            onUpdate(response.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update information.');
        }
    };

    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Edit Information</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" onChange={handleChange} value={formData.email} required />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phoneNumber" onChange={handleChange} value={formData.phoneNumber} />
                </div>
                <button type="submit" className="btn-primary">Save Changes</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default EditInfo;