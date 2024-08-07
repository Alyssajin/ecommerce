import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import './Profile.css'

export default function Profile() {
    const { user } = useAuth0();

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img className="profile-avatar" src={user.picture} alt="Profile Avatar" />
                <h2 className="profile-name">{user.name}</h2>
            </div>
            <div className="profile-info">
                <p>
                    📧 <strong>Email: </strong>
                    {user.email}
                </p>
                <p>
                    🔑 <strong>Auth0Id: </strong>
                    {user.sub}
                </p>
                <p>
                    ✅ <strong>Email Verified: </strong>
                    {user.email_verified?.toString()}
                </p>
            </div>
        </div>
    );
}
