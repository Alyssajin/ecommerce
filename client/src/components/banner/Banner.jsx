import React from 'react'
import './Banner.css'
import {Link} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";


const Banner = () => {
    // deal with user authentication
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
    const signUp = () => loginWithRedirect({ screen_hint: "signup" });
    const logIn = () => loginWithRedirect();
    const logOut = () => logout({ returnTo: window.location.origin });

  return (
      <div className='banner'>
          <p className='banner-text-preheading'>Limited Time Only</p>
          <p className='banner-text-heading'> BDG JEANS · BUY ONE, GET ONE 50% OFF</p>
          <div className="banner-login">
              {!isAuthenticated ? (
                  <div className="banner-login-buttons">
                      <button onClick={signUp} className="banner-login-btn">Sign in</button>
                  </div>
              ) : (
                  <div className="banner-logout">
                      <div className="banner-logout-name">
                          Hello, <Link to="/profile" className="banner-logout-name-span">{user.name}</Link>
                      </div>
                      <button onClick={logOut} className="banner-logout-button">Log Out</button>
                  </div>
              )}
          </div>
          <a href="/sale" className="banner-link">Shop Now</a>
      </div>
  )
}

export default Banner
