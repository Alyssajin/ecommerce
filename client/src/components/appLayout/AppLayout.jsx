import React from 'react'
import './AppLayout.css'
import { useAuth0 } from '@auth0/auth0-react'
import { Outlet, Link } from 'react-router-dom';


const AppLayout = () => {
    const { user, isLoading, logout } = useAuth0();
    if (isLoading) {
        return <div className='loading'>Loading...</div>
    }
  return (
    <div className="app">
        <div className="title">
            <h1>Test App Page</h1>
        </div>
        <div className="header">
            <nav className="menu">
                <ul className="menu-list">
                    <li>
                        <Link to="/app/admin">Admin</Link>
                    </li>
                    <li>
                        <Link to="/app/debugger">Auth Debugger</Link>
                    </li>
                    <li>
                        <button className='exit-button' onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
                    </li>
                </ul>
            </nav>
            <div>Welcome 👋 {user.name}</div>
        </div>
        <div className="content">
            <Outlet />
        </div>
    </div>
  )
}

export default AppLayout