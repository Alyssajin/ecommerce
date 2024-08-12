import React, { useState } from 'react';
import './AppLayout.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    const { user, isLoading, logout } = useAuth0();
    const [showDisclaimer, setShowDisclaimer] = useState(true); // State to control the visibility of the disclaimer

    if (isLoading) {
        return <div className='loading'>Loading...</div>;
    }

    return (
        <div className="app">
            <header className="header">
                <div className="admin-info">
                    <div className="welcome-text">Welcome, {user.name}</div>
                    <div className="state-text">Your current state: Admin</div>
                </div>
                <button className='exit-button' onClick={() => logout({ returnTo: window.location.origin })}>
                    Log Out
                </button>
            </header>
            {showDisclaimer && (
                <div className="disclaimer">
                    <span>This page may contain sensitive information and operations. Please use with caution.</span>
                    <button className="dismiss-button" onClick={() => setShowDisclaimer(false)}>Dismiss</button>
                </div>
            )}
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
