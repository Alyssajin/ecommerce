import React, { useState, useRef } from "react"

import cart_icon from "../../assets/icons/cart.png"
import search_icon from "../../assets/icons/search_icon.png"
import "./Navbar.css"
import { Link } from "react-router-dom"

export const Navbar = () => {
    const [menu, setMenu] = useState("home");
    const menuRef = useRef();

  return (
    <div className='navbar'>
        <div className="nav-login">
            <button className="nav-login-btn">Sign In</button>
        </div>
        <hr className="nav-hr"></hr>
        <div className="nav-header">
            <div className="nav-logo">
                <div className="nav-logo-icon">
                    <a href="/">
                        <picture>
                            <source media="(min-width: 1025px)" />
                            <img src="https://images.ctfassets.net/q602vtcuu3w3/5Kn3hosoikXHaQhOx4GikS/a97e3757c14fb0539d553c0a0462f4c7/URBAN-OUTFITTERS_LOGO_2022.svg" alt="Urban Outfitters" />
                        </picture>
                    </a>
                </div>
                <div className="nav-search-cart">
                    <div className="nav-search">
                        <input type="text" placeholder="Search" />
                        <Link to="/search">
                            <img src={search_icon} alt="" />
                        </Link>
                    </div>
                    <div className="nav-cart">
                        <Link to="/cart">
                            <img src={cart_icon} alt="" />
                        </Link>
                    <div className="nav-cart-count">0</div>
                </div>

            </div>
            </div>
            <hr className="nav-hr"></hr>
            <ul ref={menuRef} className="nav-menu">
                <li onClick={()=>{setMenu("new")}}><Link style={{ textDecoration: "none"}} to="/new"><span className="nav-span">New</span></Link>{menu==="new"? <hr className="nav-menu-hr"/>:<></>}</li>
                <li onClick={()=>{setMenu("women")}}><Link style={{ textDecoration: "none"}} to="/women"><span className="nav-span">Women</span></Link>{menu==="women"? <hr className="nav-menu-hr"/>:<></>}</li>
                <li onClick={()=>{setMenu("men")}}><Link style={{ textDecoration: "none"}} to="/men"><span className="nav-span">Men</span></Link>{menu==="men"? <hr className="nav-menu-hr"/>:<></>}</li>
                <li onClick={()=>{setMenu("kid")}}><Link style={{ textDecoration: "none"}} to="/kid"><span className="nav-span">Kids</span></Link>{menu==="kid"? <hr className="nav-menu-hr"/>:<></>}</li>
                <li onClick={()=>{setMenu("sale")}}><Link style={{ textDecoration: "none"}} to="/sale"><span className="nav-span-special">Sale</span></Link>{menu==="sale"? <hr className="nav-menu-hr"/>:<></>}</li>
            </ul>
            <hr className="nav-hr"></hr>
        </div>
        
    </div>
  )
}
