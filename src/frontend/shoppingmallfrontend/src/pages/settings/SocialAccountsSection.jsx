// --- File: src/components/settings/SocialAccountSection.jsx ---
import React from 'react';
import SettingsRow from './SettingsRow';
import { FaLinkedin, FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';

const SocialAccountSection = ({ user }) => {
    const handleConnect = (provider) => alert(`Initiate OAuth flow for ${provider}...`);

    return (
        <section className="settings-section">
            <h2 className="section-title">Social Account</h2>
            <SettingsRow
                icon={<FaLinkedin />}
                label="LinkedIn"
                action={<a href="#" onClick={() => handleConnect('LinkedIn')}>Connect</a>}
            >
                Not Connected
            </SettingsRow>
            <SettingsRow
                icon={<FaGoogle />}
                label="Google"
                action={<a href="#" onClick={() => handleConnect('Google')}>Connect</a>}
            >
                Not Connected
            </SettingsRow>
            <SettingsRow
                icon={<FaGithub />}
                label="Github"
                action={<a href="#" onClick={() => handleConnect('Github')}>Connect</a>}
            >
                Not Connected
            </SettingsRow>
            <SettingsRow
                icon={<FaFacebook />}
                label="Facebook"
                action={<a href="#" onClick={() => handleConnect('Facebook')}>Connect</a>}
            >
                Not Connected
            </SettingsRow>
        </section>
    );
};

export default SocialAccountSection;