import React from 'react';
import { useSelector } from 'react-redux';
import './SettingsPage.css';

import AccountInfoSection from "./AccountInfoSection.jsx";
import SocialAccountsSection from "./SocialAccountsSection.jsx";
import DeleteAccountSection from "./DeleteAccountSection.jsx";

function SettingsPage() {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="settings-page-container">
            <div className="settings-content">
                <AccountInfoSection user={user} />
                <SocialAccountsSection user={user} />
                <DeleteAccountSection />
            </div>
        </div>
    );
}

export default SettingsPage;