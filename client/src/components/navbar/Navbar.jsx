import React from "react"
import cart from "../../assets/icons/cart.png"
import "./Navbar.css"

export const Navbar = () => {

  return (
    <div className='navbar'>
        <div className="nav-login">
            <button className="nav-login-btn">Sign In</button>
        </div>
        <div className="nav-logo">
            <div className="nav-logo-icon">
                <a href="/">
                    <picture>
                        <source media="(min-width: 1025px)" />
                        <img src="https://images.ctfassets.net/q602vtcuu3w3/5Kn3hosoikXHaQhOx4GikS/a97e3757c14fb0539d553c0a0462f4c7/URBAN-OUTFITTERS_LOGO_2022.svg" alt="Urban Outfitters" />
                    </picture>
                </a>
                
            </div>
            <div className="nav-search">
                <input type="text" placeholder="Search for products" />
                <button className="nav-search-btn">Search</button>
            </div>
            <div className="nav-cart">
                {/* <img src={cart} alt="" /> */}
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
