import React, { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Save,
    CreditCard
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="settings-section">
                        <h2 className="section-header">Profile Information</h2>
                        <div className="profile-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" defaultValue="Sarah Jenkins" />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" defaultValue="sarah.jenkins@loreal.com" />
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <input type="text" defaultValue="L'Oréal Paris" />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <input type="text" defaultValue="Creative Director" />
                            </div>
                        </div>
                    </div>
                );
            case 'preferences':
                return (
                    <div className="settings-section">
                        <h2 className="section-header">App Preferences</h2>
                        <div className="preferences-list">
                            <div className="preference-item">
                                <div className="pref-info">
                                    <h4>Dark Mode</h4>
                                    <p>Use dark theme across the application</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="preference-item">
                                <div className="pref-info">
                                    <h4>Auto-Save Projects</h4>
                                    <p>Automatically save changes while editing</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="preference-item">
                                <div className="pref-info">
                                    <h4>High Quality Preview</h4>
                                    <p>Show high resolution previews (uses more data)</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div className="settings-section"><p>Coming soon...</p></div>;
        }
    };

    return (
        <div className="settings-container">
            <h1 className="page-title">Settings</h1>

            <div className="settings-layout">
                <div className="settings-sidebar glass-panel">
                    <button
                        className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={18} /> Profile
                    </button>
                    <button
                        className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                    <button
                        className={`settings-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <Palette size={18} /> Preferences
                    </button>
                    <button
                        className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <Shield size={18} /> Security
                    </button>
                    <button
                        className={`settings-nav-item ${activeTab === 'billing' ? 'active' : ''}`}
                        onClick={() => setActiveTab('billing')}
                    >
                        <CreditCard size={18} /> Billing
                    </button>
                </div>

                <div className="settings-content glass-panel">
                    {renderContent()}
                    <div className="settings-footer">
                        <button className="btn btn-secondary">Cancel</button>
                        <button className="btn btn-primary"><Save size={18} /> Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
