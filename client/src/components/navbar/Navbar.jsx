import React from 'react'
import logo from '../../assets/logo/logo.png'

export const Navbar = () => {

  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt="" />
            <p>E Commerce</p>
        </div>
        <ul className="nav-menu">
            <li>Home</li>
            <li>WOMEN</li>
            <li>MAN</li>
            <li>KIDS</li>
        </ul>
    </div>
  )
}
