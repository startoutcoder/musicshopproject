import React from 'react';

const DeleteAccountSection = () => {
    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
            alert('Call API to delete account...');
        }
    };

    return (
        <section className="settings-section">
            <button className="delete-button" onClick={handleDeleteAccount}>
                Delete Account
            </button>
        </section>
    );
};

export default DeleteAccountSection;