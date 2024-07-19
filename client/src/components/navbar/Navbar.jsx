import React from "react"
import logo from "../../assets/logo/logo.png"
import cart from "../../assets/icons/cart.png"

export const Navbar = () => {

  return (
    <div className='navbar'>
        <div className="nav-login">
            <button className="btn-primary">Login</button>
        </div>
        <div className="nav-logo">
            <div className="nav-logo-icon">
                <img src={logo} alt="" />
            </div>
            <div className="nav-search">
                <input type="text" placeholder="Search for products" />
                <button className="nav-search-btn">Search</button>
            </div>
            <div className="nav-cart">
                <img src={cart} alt="" />
            <div className="nav-cart-count">0</div>
        </div>
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
